// اختبارات التحليل الحبيبي (S4) - T-G01 إلى T-G04
import { describe, it, expect } from 'vitest';
import { percentFinerFromMasses, percentAt, dAt, gradeParams, fractions, checkPoints, SIEVES } from '../src/modules/soil-mechanics/engine/grain.js';

const near = (a, b, tol) => expect(Math.abs(a - b)).toBeLessThanOrEqual(tol);
const mmOf = (no) => SIEVES.find((s) => s.no === String(no)).mm;
const MASSES = { 4: 0, 10: 21.6, 20: 49.5, 40: 102.6, 60: 89.1, 100: 95.6, 200: 60.4 };
const example6 = () => percentFinerFromMasses(Object.entries(MASSES).map(([no, mass]) => ({ no, mm: mmOf(no), mass })), 31.2);

describe('التحليل الحبيبي', () => {
  it('T-G01: النسبة المارة من الكتل', () => {
    const r = example6();
    near(r.total, 450, 1e-9);
    [100, 95.2, 84.2, 61.4, 41.6, 20.4, 6.9].forEach((exp, i) => near(r.rows[i].finer, exp, 0.05));
  });
  it('T-G02: Cu وCc من قراءات المحاضرة', () => {
    const { Cu, Cc } = gradeParams(0.09, 0.185, 0.41);
    near(Cu, 4.56, 0.01); near(Cc, 0.93, 0.01);
  });
  it('T-G03: استيفاء D10 وD30 وD60 قريب من قراءة المحاضرة (±8%)', () => {
    const pts = example6().points;
    near(dAt(pts, 60) / 0.41, 1, 0.08); near(dAt(pts, 30) / 0.185, 1, 0.08); near(dAt(pts, 10) / 0.09, 1, 0.08);
  });
  it('T-G04: مثال 7: الطين 42% ونسب الأنظمة', () => {
    const pts = [[0.425, 100], [0.033, 90], [0.018, 80], [0.01, 70], [0.0062, 60], [0.0035, 50], [0.0018, 40], [0.001, 35]]
      .map(([mm, finer]) => ({ mm, finer }));
    near(percentAt(pts, 0.002), 42, 1.5);
    const exp = { MIT: [0, 5, 53, 42], USDA: [0, 6, 52, 42], AASHTO: [0, 4, 54, 42] };
    for (const [sys, [g, s, si, c]] of Object.entries(exp)) {
      const f = fractions(pts, sys);
      near(f.gravel, g, 3); near(f.sand, s, 3); near(f.silt, si, 3); near(f.clay, c, 1.5);
    }
  });
  it('التحقق: النسبة المارة يجب أن تتناقص', () => {
    expect(checkPoints([{ mm: 1, finer: 50 }, { mm: 0.1, finer: 60 }]).length).toBeGreaterThan(0);
    expect(checkPoints(example6().points).length).toBe(0);
  });
});