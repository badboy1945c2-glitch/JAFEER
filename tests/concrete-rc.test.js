import { describe, it, expect } from 'vitest';
import {
  modularRatio, loadCombinations,
  singlyUncracked, singlyCracked, doublyUncracked, doublyCracked
} from '../src/modules/concrete/engine/rc.js';

const n = modularRatio(25);

describe('محاضرة 2: توافيق الأحمال', () => {
  it('D=5, L=2 تتحكم 5.3.1b', () => {
    const { governing } = loadCombinations({ D: 5, L: 2 });
    expect(governing.id).toBe('5.3.1b');
    expect(governing.U).toBeCloseTo(9.2, 10);
  });
});

describe('محاضرة 4: المحور المحايد يحقق معادلة المحاضرة', () => {
  it('مفرد متشقق', () => {
    const { y } = singlyCracked({ b: 300, d: 500, As: 1500, n, M: 100 });
    expect(0.5 * 300 * y * y).toBeCloseTo(n * 1500 * (500 - y), 3);
  });
  it('مفرد غير متشقق', () => {
    const { y } = singlyUncracked({ b: 300, h: 550, d: 500, As: 1500, n, M: 100 });
    expect(0.5 * 300 * y * y).toBeCloseTo((n - 1) * 1500 * (500 - y) + (300 * (550 - y) ** 2) / 2, 3);
  });
  it('مزدوج غير متشقق', () => {
    const { y } = doublyUncracked({ b: 300, h: 550, d: 500, dp: 50, As: 1500, Asp: 600, n, M: 100 });
    expect(0.5 * 300 * y * y + (2 * n - 1) * 600 * (y - 50)).toBeCloseTo(
      (n - 1) * 1500 * (500 - y) + (300 * (550 - y) ** 2) / 2, 3);
  });
  it('مزدوج متشقق', () => {
    const { y } = doublyCracked({ b: 300, d: 500, dp: 50, As: 1500, Asp: 600, n, M: 100 });
    expect(0.5 * 300 * y * y + (2 * n - 1) * 600 * (y - 50)).toBeCloseTo(n * 1500 * (500 - y), 3);
  });
});
import { analyzeSection, kjDoubly, doublyCracked } from '../src/modules/concrete/engine/rc.js';

describe('WSD examples from the lectures', () => {
  const S = (...t) => t.map(([tt, w]) => ({ t: tt, w }));
  it('Ex-3: T-type box section, cracked', () => {
    const r = analyzeSection({ segs: S([100, 1000], [300, 250], [100, 1000]), d: 430, As: 4000, n: 8, M: 100, mode: 1, fcAll: 12.5, fsAll: 165 });
    expect(r.y).toBeCloseTo(140.56, 1);
    expect(r.Mallow).toBeCloseTo(255.8, 0);
  });
  it('Ex-7: first crack moment', () => {
    const r = analyzeSection({ segs: S([100, 500], [450, 200]), d: 500, As: 981.2, n: 7.77, M: 48.8, fcp: 30, mode: 2 });
    expect(r.yUn).toBeCloseTo(239.2, 0);
    expect(r.Mcr).toBeCloseTo(48.8, 0);
  });
  it('k-j doubly equals the direct method (Ex-5)', () => {
    const a = kjDoubly({ b: 350, d: 630, dp: 70, As: 1963.5, Asp: 981, n: 10, M: 200 });
    const c = doublyCracked({ b: 350, d: 630, dp: 70, As: 1963.5, Asp: 981, n: 10, M: 200 });
    expect(a.y).toBeCloseTo(c.y, 6);
    expect(a.fs).toBeCloseTo(c.fs, 6);
  });
});