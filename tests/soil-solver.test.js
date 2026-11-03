// اختبارات محرك حل الأطوار وأتربرغ (S2) - حالات المحاضرة حسب القسم 9 من المواصفات
import { describe, it, expect } from 'vitest';
import { makeSoilSolver } from '../src/modules/soil-mechanics/engine/soil-engine.js';
import { plasticityByPI, plasticityByLL, activityClass, stateOf } from '../src/modules/soil-mechanics/engine/describe.js';

const s = makeSoilSolver();
const near = (a, b, tol) => expect(Math.abs(a - b)).toBeLessThanOrEqual(tol);

describe('الأطوار', () => {
  it('T-P01 مثال 1', () => {
    const r = s.solve({ gamma: 19.80, G: 2.70, w: 0.11 }).values;
    near(r.gamma_d, 17.84, 0.02); near(r.e, 0.485, 0.002); near(r.S, 0.6124, 0.003);
  });
  it('T-P02 مثال 2 (بالتحويل الصحيح للوحدات)', () => {
    const V = Math.PI * 3.81 ** 2 / 4 * 7.62 * 1e-6; // m³
    const r = s.solve({ V, W: 1.668e-3, Ws: 1.400e-3, G: 2.7 }).values;
    near(r.w, 0.1914, 0.0005); near(V * 1e6, 86.87, 0.01); near(r.gamma, 19.20, 0.02);
  });
  it('T-P03 مثال 3 (e ثابتة)', () => {
    const first = s.solve({ gamma: 20.1, w: 0.15 }).values;
    const second = s.solve({ gamma_d: first.gamma_d, gamma: 19.4 }).values;
    near(second.w, 0.1099, 0.002);
  });
  it('T-P04 مثال 4 (أ، ب، ج، د)', () => {
    near(s.solve({ e: 0.65, G: 2.8, S: 0, w: 0 }).values.gamma_d, 16.65, 0.02);
    const b = s.solve({ e: 0.65, G: 2.8, S: 0.6 }).values;
    near(b.w, 0.1393, 0.001); near(b.gamma, 18.97, 0.02);
    near(s.solve({ e: 0.65, G: 2.8, S: 0.95 }).values.gamma, 20.32, 0.02);
    near(s.solve({ e: 0.65, G: 2.8, S: 1 }).values.gamma_sat, 20.51, 0.02);
  });
  it('T-P05 مثال 5 (بالتحويل الصحيح للوحدات)', () => {
    const r = s.solve({ G: 2.6, W: 2.5e-3, Ws: 2.1e-3, V: 150e-6 }).values;
    near(r.w, 0.1905, 0.0005); near(r.gamma_d, 14.0, 0.02); near(r.S, 0.603, 0.003);
  });
  it('تعارض المدخلات يُكشف ولا يُخمَّن', () => {
    const r = s.solve({ gamma: 19, G: 2.7, w: 0.11, gamma_d: 15 });
    expect(r.conflicts.length).toBeGreaterThan(0);
  });
  it('معطيات ناقصة: لا يحسب e بدون ما يكفي', () => {
    const r = s.solve({ G: 2.7 });
    expect('e' in r.values).toBe(false);
  });
  it('اقتراح ما ينقص', () => {
    const opts = s.suggest('e', ['G']).map((o) => o.join('+'));
    expect(opts).toContain('gamma_d');
    expect(opts).toContain('n');
  });
});

describe('أتربرغ', () => {
  it('T-A01 مثال 8: PL=41 والحالة لدنة', () => {
    const r = s.solve({ LL: 0.56, PI: 0.15, w: 0.45 }).values;
    near(r.PL, 0.41, 1e-9);
    expect(stateOf({ w: r.w, PL: r.PL, LL: r.LL }).ar).toContain('لدنة');
  });
  it('T-A02 مثال 8: SL = 32.5%', () => near(s.solve({ e: 0.88, G: 2.71 }).values.ws, 0.325, 0.0005));
  it('T-A03 مثال 9: LL=55, LI=0.30, CI=0.70', () => {
    const r = s.solve({ PL: 0.25, PI: 0.30, w: 0.34 }).values;
    near(r.LL, 0.55, 1e-9); near(r.LI, 0.30, 1e-9); near(r.CI, 0.70, 1e-9);
  });
  it('T-A04 مثال 10: SL = 18.4%', () => near(s.solve({ e: 0.50, G: 2.72 }).values.ws, 0.184, 0.0005));
  it('T-A05 مثال 11: PI=22, A=0.52 خامل, LI=0.59', () => {
    const r = s.solve({ LL: 0.48, PL: 0.26, w: 0.39, clayPercent: 0.42 }).values;
    near(r.PI, 0.22, 1e-9); near(r.A, 0.52, 0.005); near(r.LI, 0.59, 0.005);
    expect(activityClass(r.A).en).toBe('Inactive');
  });
});

describe('التوصيفات (حدود القاعدة المعتمدة)', () => {
  it('وصف اللدونة بدلالة PI عند الحدود المشتركة', () => {
    expect(plasticityByPI(0).en).toBe('Nonplastic');
    expect(plasticityByPI(5).en).toBe('Slightly plastic');
    expect(plasticityByPI(10).en).toBe('Low');
    expect(plasticityByPI(40).en).toBe('High');
    expect(plasticityByPI(41).en).toBe('Very high');
  });
  it('وصف اللدونة بدلالة LL', () => {
    expect(plasticityByLL(35).en).toBe('Low');
    expect(plasticityByLL(50).en).toBe('Intermediate');
    expect(plasticityByLL(91).en).toBe('Extremely high');
  });
});