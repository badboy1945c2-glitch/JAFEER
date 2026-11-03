/**
 * backup-sections.js - تسجيل «أقسام الوحدات» في حزمة النسخ الاحتياطي
 * كل وحدة (مثل ميكانيك التربة) تسجّل قسماً: كيف تُصدَّر بياناتها وكيف تُستورد وتُمسح.
 * النتيجة: الحزمة تحمل modules: { 'soil-mechanics': {...} } دون أن يعرف backup.js تفاصيل الوحدة.
 */
const sections = new Map();

export function registerBackupSection(id, section) { sections.set(id, section); }
export const getBackupSections = () => [...sections.entries()].map(([id, s]) => ({ id, ...s }));

export function collectModules() {
  const out = {};
  for (const s of getBackupSections()) {
    const d = s.export();
    if (d !== null && d !== undefined) out[s.id] = d;
  }
  return out;
}
export function applyModules(modules = {}, mode = 'merge') {
  for (const s of getBackupSections()) if (modules && modules[s.id] !== undefined) s.import(modules[s.id], mode);
}
export function resetModules() {
  for (const s of getBackupSections()) if (s.reset) s.reset();
}

const isPlain = (x) => x && typeof x === 'object' && !Array.isArray(x);
const hasId = (arr) => arr.every((x) => isPlain(x) && 'id' in x);

// دمج بيانات وحدة: المصفوفات ذات id تُدمج بالمعرّف (الوارد يغلب)، والكائنات تُدمج مفتاحاً مفتاحاً، والباقي يُستبدل
export function mergeModuleData(cur, inc) {
  if (cur === undefined || cur === null) return inc;
  if (Array.isArray(cur) && Array.isArray(inc)) {
    if (hasId(cur) && hasId(inc)) {
      const map = new Map(cur.map((x) => [x.id, x]));
      inc.forEach((x) => map.set(x.id, x));
      return [...map.values()];
    }
    return inc;
  }
  if (isPlain(cur) && isPlain(inc)) {
    const out = { ...cur };
    for (const k of Object.keys(inc)) out[k] = mergeModuleData(cur[k], inc[k]);
    return out;
  }
  return inc;
}