// اختبارات محرك التصنيف (S5) - T-C01 إلى T-C10 وPT1 إلى PT9
import { describe, it, expect } from 'vitest';
import { classifyUSCS as U, classifyAASHTO as A, classifyUSDA as D } from '../src/modules/soil-mechanics/engine/classify.js';

const syms = (r) => r.candidates.map((c) => c.symbol).sort().join(',');
const names = (r) => r.candidates.map((c) => c.name).sort();

describe('التصنيف: حالات المحاضرة', () => {
  it('T-C01 AASHTO A-1-b', () => expect(A({ P10: 42, P40: 35, F200: 20, LL: 25, PL: 20 }).result.group).toBe('A-1-b'));
  it('T-C02 AASHTO A-7-6 وGI=42', () => {
    const r = A({ F200: 95, LL: 60, PI: 40 });
    expect(r.result.group).toBe('A-7-6'); expect(r.result.GI).toBe(42);
  });
  it('T-C03 USCS: CL وSandy lean clay (P4 مستنتج)', () => {
    const r = U({ P10: 100, P40: 80, F200: 58, LL: 30, PI: 10 });
    expect(r.result.symbol).toBe('CL'); expect(r.result.name).toBe('Sandy lean clay');
  });
  it('T-C04 USCS: SC وClayey sand with gravel', () => {
    const r = U({ P4: 70, F200: 30, LL: 33, PL: 12 });
    expect(r.result.symbol).toBe('SC'); expect(r.result.name).toBe('Clayey sand with gravel');
  });
  it('T-C05 USCS: SP-SC', () => {
    const r = U({ F200: 8, P4: 100, D10: 0.085, D30: 0.12, D60: 0.135, LL: 30, PL: 22 });
    expect(r.result.symbol).toBe('SP-SC'); expect(r.result.name).toContain('Poorly graded sand with clay');
  });
  it('T-C06 USCS: CL-ML (الاسم ينتظر P4، ومع P4=100 يعطي Sandy silty clay)', () => {
    const r = U({ F200: 61, LL: 26, PL: 20 });
    expect(r.status).toBe('partial'); expect(r.path.some((s) => s.symbol === 'CL-ML')).toBe(true);
    expect(U({ F200: 61, P4: 100, LL: 26, PL: 20 }).result.name).toBe('Sandy silty clay');
  });
  it('T-C07 USDA: Clay loam', () => expect(D({ sand: 30, silt: 40, clay: 30 }).result.name).toBe('Clay loam'));
  it('T-C08 USDA: Clay بعد تصحيح الحصى', () => {
    const r = D({ gravel: 20, sand: 10, silt: 30, clay: 40 });
    expect(r.result.name).toBe('Clay');
    expect(Math.abs(r.corrected.sand - 12.5)).toBeLessThanOrEqual(1e-9);
  });
  it('T-C09 واجب 1 تربة A: A-2-6 وSM', () => {
    const x = { P4: 98, P10: 90, P40: 76, F200: 34, LL: 38, PL: 26 };
    expect(A(x).result.group).toBe('A-2-6');
    expect(U(x).result.symbol).toBe('SM'); expect(U(x).result.name).toBe('Silty sand');
  });
  it('T-C10 واجب 1 تربة B: A-7-6 وML', () => {
    const x = { P4: 100, P10: 98, P40: 86, F200: 58, LL: 49, PL: 28 };
    expect(A(x).result.group).toBe('A-7-6');
    expect(U(x).result.symbol).toBe('ML'); expect(U(x).result.name).toBe('Sandy silt');
  });
});

describe('التصنيف: السلوك الجزئي (غير المعلوم)', () => {
  it('PT1: F200=58 فقط', () => {
    const r = U({ F200: 58 });
    expect(r.status).toBe('partial'); expect(r.needs.map((n) => n.key)).toContain('LL');
    expect(syms(r)).toBe('CH,CL,CL-ML,MH,ML');
  });
  it('PT2: F200=58، LL=30', () => {
    const r = U({ F200: 58, LL: 30 });
    expect(r.status).toBe('partial'); expect(r.needs.map((n) => n.key)).toContain('PI');
    expect(syms(r)).toBe('CL,CL-ML,ML');
  });
  it('PT3: F200=20 فقط (USCS وAASHTO)', () => {
    const u = U({ F200: 20 });
    expect(u.status).toBe('partial'); expect(u.needs.map((n) => n.key)).toEqual(['P4']);
    const a = A({ F200: 20 });
    expect(a.groups.find((g) => g.g === 'A-1-a').status).toBe('false');
    expect(a.groups.find((g) => g.g === 'A-3').status).toBe('false');
    expect(a.candidates.map((c) => c.symbol)).toContain('A-1-b');
    expect(a.candidates.map((c) => c.symbol)).toContain('A-2-4');
  });
  it('PT4: بلا مدخلات = blocked', () => {
    expect(U({}).status).toBe('blocked'); expect(U({}).result).toBe(null);
  });
  it('PT5: P10=45 وP4=40 خطأ تحقق', () => {
    const r = U({ P10: 45, P4: 40 });
    expect(r.status).toBe('invalid'); expect(r.errors[0]).toContain('P4');
  });
  it('PT6: بلا P4 ثم إضافة P10=100', () => {
    const r = U({ F200: 58, LL: 30, PI: 10 });
    expect(r.status).toBe('partial'); expect(r.needs.map((n) => n.key)).toEqual(['P4']);
    expect(names(r)).toEqual(['Gravelly lean clay', 'Gravelly lean clay with sand', 'Sandy lean clay', 'Sandy lean clay with gravel']);
    expect(U({ F200: 58, LL: 30, PI: 10, P10: 100 }).result.name).toBe('Sandy lean clay');
  });
  it('PT7: القيم الحدية', () => {
    const fine = (pi, ll = 22) => U({ F200: 60, P4: 100, LL: ll, PI: pi }).result.symbol;
    expect(fine(4)).toBe('CL-ML'); expect(fine(7)).toBe('CL-ML'); expect(fine(7.01)).toBe('CL'); expect(fine(3.99)).toBe('ML');
    expect(fine(14.6, 40)).toBe('CL'); // على خط A تماماً = فوقه
    const coarse = (f) => U({ F200: f, P4: 50, Cu: 5, Cc: 2, LL: 30, PL: 10 }).result.symbol;
    expect(coarse(4.99)).toBe('GW'); expect(coarse(5)).toBe('GW-GC'); expect(coarse(12)).toBe('GW-GC'); expect(coarse(12.01)).toBe('GC');
    expect(U({ F200: 50, LL: 30, PL: 10, P4: 100 }).result.symbol).toBe('CL'); // 50 بالضبط = ناعمة
  });
  it('PT8: PI=21 مقابل خط A=21.17 يعطي ML بلا تقريب', () => {
    expect(U({ F200: 58, P4: 100, LL: 49, PI: 21 }).result.symbol).toBe('ML');
  });
  it('PT9: النتيجة لا تتأثر بترتيب الحقول', () => {
    const a = U({ LL: 49, PL: 28, F200: 58, P4: 100, P10: 98, P40: 86 });
    const b = U({ P40: 86, P10: 98, P4: 100, PL: 28, F200: 58, LL: 49 });
    expect(JSON.stringify(a.result)).toBe(JSON.stringify(b.result));
  });
});