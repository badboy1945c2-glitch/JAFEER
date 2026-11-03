// اختبار سلامة بيانات وحدة ميكانيك التربة (S1)
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const dir = path.resolve(__dirname, '../src/modules/soil-mechanics/data');
const load = (f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8'));

describe('بيانات ميكانيك التربة', () => {
  it('27 معادلة E01..E27 و5 قوانين A01..A05', () => {
    const eq = load('equations.json');
    expect(eq.filter(e => /^E\d\d$/.test(e.id)).length).toBe(27);
    expect(eq.filter(e => /^A\d\d$/.test(e.id)).length).toBe(5);
  });
  it('21 متغيراً بمفاتيح فريدة', () => {
    const v = load('variables.json');
    expect(v.length).toBe(21);
    expect(new Set(v.map(x => x.key)).size).toBe(21);
  });
  it('25 منخلاً بفتحات متناقصة و7 معادن طينية', () => {
    const t = load('tables.json');
    expect(t.sieves.length).toBe(25);
    for (let i = 1; i < t.sieves.length; i++) expect(t.sieves[i].mm).toBeLessThan(t.sieves[i - 1].mm);
    expect(t.clayMinerals.length).toBe(7);
  });
  it('12 مجموعة AASHTO (7 حبيبية و5 غرينية-طينية)', () => {
    const a = load('aashto.json');
    expect(a.granular.groups.length).toBe(7);
    expect(a.siltClay.groups.length).toBe(5);
  });
  it('18 رمزاً خشناً بنتيجتين لكل رمز', () => {
    const n = load('uscs-names.json').coarseNames;
    expect(Object.keys(n).length).toBe(18);
    Object.values(n).forEach(x => expect(x.length).toBe(2));
  });
  it('12 منطقة USDA و27 حالة اختبار و12 ملاحظة', () => {
    expect(load('usda.json').rules.length).toBe(12);
    expect(load('examples.json').length).toBe(27);
    expect(load('notes.json').length).toBe(12);
  });
});