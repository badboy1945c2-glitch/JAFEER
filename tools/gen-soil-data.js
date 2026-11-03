/**
 * gen-soil-data.js - يولّد ملفات بيانات وحدة ميكانيك التربة من soil-mechanics-spec.md حرفياً
 * التشغيل (من مجلد المشروع):  node tools/gen-soil-data.js
 */
import fs from 'node:fs';
import path from 'node:path';

const SPEC_PATH = process.argv[2] || 'soil-mechanics-spec.md';
const OUT = path.resolve('src/modules/soil-mechanics/data');

if (!fs.existsSync(SPEC_PATH)) {
  console.error(`لم أجد الملف: ${SPEC_PATH}\nضع soil-mechanics-spec.md في مجلد المشروع (بجانب package.json).`);
  process.exit(1);
}
const SPEC = fs.readFileSync(SPEC_PATH, 'utf-8');
fs.mkdirSync(OUT, { recursive: true });

// ── أدوات مساعدة ──
function section(start, end) {
  const a = SPEC.indexOf(start);
  if (a < 0) throw new Error('لم أجد في المواصفات: ' + start);
  const b = SPEC.indexOf(end, a + 1);
  if (b < 0) throw new Error('لم أجد في المواصفات: ' + end);
  return SPEC.slice(a, b);
}
function rows(text) {
  return text.split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('|') && !/^\|\s*-/.test(l))
    .map(l => l.replace(/^\|+|\|+$/g, '').split('|').map(c => c.trim()));
}
const stripTicks = (s) => { const m = s.match(/`([^`]*)`/); return (m ? m[1] : s).trim(); };
function jsonBlockAfter(marker) {
  const i = SPEC.indexOf(marker);
  if (i < 0) throw new Error('لم أجد في المواصفات: ' + marker);
  const a = SPEC.indexOf('```json', i) + 7;
  const b = SPEC.indexOf('```', a);
  return JSON.parse(SPEC.slice(a, b));
}
const save = (name, obj) => fs.writeFileSync(path.join(OUT, name), JSON.stringify(obj, null, 2), 'utf-8');

// ── الثوابت ──
save('constants.json', [{ key: 'gamma_w', symbol: 'γw', value: 9.81, unit: 'kN/m³', note: 'يساوي 1 g/cm³ أو 1000 kg/m³', page: 6 }]);

// ── المتغيرات (القسم 2) ──
const vars = rows(section('## 2. المتغيرات', '## 3. علاقات الأطوار')).filter(r => r[0] !== 'المفتاح');
save('variables.json', vars.map(r => ({ key: stripTicks(r[0]), symbol: r[1], ar: r[2], en: r[3], unit: r[4], kind: r[5] })));

// ── المعادلات E01..E27 (3.1) و A01..A05 (5.2) ──
const equations = [];
for (const r of rows(section('### 3.1 المعادلات', '### 3.2 جدول'))) {
  if (/^E\d\d$/.test(r[0])) equations.push({ id: r[0], expr: stripTicks(r[1]), ar: r[2], page: r[3] });
}
for (const r of rows(section('### 5.2 القوانين', '### 5.3 تصنيف'))) {
  if (/^A\d\d$/.test(r[0])) equations.push({ id: r[0], expr: stripTicks(r[1]), ar: r[2], page: r[3] });
}
save('equations.json', equations);

// ── الجداول ──
const sieves = jsonBlockAfter('### 4.1 جدول المناخل').sieves;
const clayMinerals = jsonBlockAfter('### 5.5 جدول قيم').clayMinerals;
const aashto = jsonBlockAfter('### 6.2 تصنيف AASHTO').aashto;
const coarseNames = jsonBlockAfter('**أ) الخشنة').coarseNames;
const fineBaseNames = jsonBlockAfter('**ب) الناعمة').fineBaseNames;

const gradeSystems = rows(section('### 4.2 أنظمة', '### 4.3 طرق'))
  .filter(r => r[0] !== 'النظام')
  .map(r => ({ system: r[0], gravel: r[1], sand: r[2], silt: r[3], clay: r[4] }));
const activityClasses = rows(section('### 5.3 تصنيف النشاط', '### 5.4 وصف'))
  .filter(r => r[0] !== 'النشاط A')
  .map(r => ({ range: r[0], class: r[1] }));

const plasticityDescriptions = {
  byPI: [
    { min: null, max: 0, en: 'Nonplastic', ar: 'غير لدنة', rule: 'PI = 0' },
    { min: 0, max: 5, en: 'Slightly plastic', ar: 'لدنة قليلاً', rule: '(0,5]' },
    { min: 5, max: 10, en: 'Low', ar: 'لدونة منخفضة', rule: '(5,10]' },
    { min: 10, max: 20, en: 'Medium', ar: 'متوسطة', rule: '(10,20]' },
    { min: 20, max: 40, en: 'High', ar: 'عالية', rule: '(20,40]' },
    { min: 40, max: null, en: 'Very high', ar: 'عالية جداً', rule: '> 40' }
  ],
  byLL: [
    { min: null, max: 35, en: 'Low', ar: 'منخفضة', rule: '<= 35' },
    { min: 35, max: 50, en: 'Intermediate', ar: 'متوسطة', rule: '(35,50]' },
    { min: 50, max: 70, en: 'High', ar: 'عالية', rule: '(50,70]' },
    { min: 70, max: 90, en: 'Very high', ar: 'عالية جداً', rule: '(70,90]' },
    { min: 90, max: null, en: 'Extremely high', ar: 'عالية للغاية', rule: '> 90' }
  ],
  assumption: 'الحدود المشتركة تُحسم بقاعدة المجال المفتوح من اليسار والمغلق من اليمين (القسم 5.4)'
};
const subdivisions = {
  silt: [['Fine', null, 0.006], ['Medium', 0.006, 0.02], ['Coarse', 0.02, 0.06]],
  sand: [['Fine', 0.06, 0.2], ['Medium', 0.2, 0.6], ['Coarse', 0.6, 2]],
  gravel: [['Fine', 2, 6], ['Medium', 6, 20], ['Coarse', 20, 60]],
  cobbles: [60, 200], boulders: '>200', unit: 'mm', page: 18
};

save('tables.json', { sieves, gradeSystems, subdivisions, clayMinerals, activityClasses, plasticityDescriptions });
save('aashto.json', aashto);
save('uscs-names.json', { coarseNames, fineBaseNames });

// ── قواعد USDA (6.1) ──
const usdaNames = ['Sand', 'Loamy sand', 'Sandy loam', 'Loam', 'Silt loam', 'Silt',
  'Sandy clay loam', 'Clay loam', 'Silty clay loam', 'Sandy clay', 'Silty clay', 'Clay'];
let blk = SPEC.slice(SPEC.indexOf('// clay, silt, sand'));
blk = blk.slice(0, blk.indexOf('```'));
const usdaRules = [...blk.matchAll(/(?:if|elif)\s*(.*?)\s*→\s*([A-Za-z ]+?)\s*(?:\(|$)/gms)]
  .map((m, i) => ({ order: i + 1, name: m[2].trim(), condition: m[1].replace(/\s+/g, ' ').trim() }));
if (JSON.stringify(usdaRules.map(u => u.name)) !== JSON.stringify(usdaNames)) {
  throw new Error('قواعد USDA لم تُقرأ كما هو متوقع: ' + usdaRules.map(u => u.name).join(', '));
}
save('usda.json', { gravelCorrection: "sand' = sand*100/(100-gravel) وكذلك silt وclay", rules: usdaRules, page: '31-32' });

// ── المسرد العربي (7) ──
save('glossary-ar.json', rows(section('## 7. الترجمة', '## 8. المعلومات'))
  .filter(r => r[0] !== 'English').map(r => ({ en: r[0], ar: r[1] })));

// ── حالات الاختبار / الأمثلة (9) ──
const cases = [];
let group = null;
for (const line of section('## 9. حالات الاختبار', '## 10. ملاحظات').split('\n')) {
  const g = line.match(/^###\s+9\.\d\s+(.*)/);
  if (g) group = g[1].trim();
  if (line.startsWith('| T-')) {
    const c = line.trim().replace(/^\|+|\|+$/g, '').split('|').map(x => x.trim());
    const d = { id: c[0].replace(/\s*⚠️/g, ''), warn: c[0].includes('⚠️'), group, source: c[1], givens: c[2], expected: c[3] };
    if (c.length > 4) d.tolerance = c[4];
    cases.push(d);
  }
}
save('examples.json', cases);

// ── الملاحظات المطبعية (10) ──
const notes = [];
for (const line of section('## 10. ملاحظات', '## 11. ما لم').split('\n')) {
  const m = line.match(/^(\d+)\.\s+\*\*(.*?)\*\*\s*(.*)$/);
  if (m) notes.push({ n: Number(m[1]), title: m[2].trim(), text: m[3].trim() });
}
save('notes.json', notes);

console.log('تم توليد ملفات البيانات في:', OUT);
console.log(`معادلات: ${equations.length} | متغيرات: ${vars.length} | مناخل: ${sieves.length} | حالات: ${cases.length} | ملاحظات: ${notes.length}`);