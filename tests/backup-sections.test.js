// اختبار دمج بيانات الوحدات (المرحلة 13)
import { describe, it, expect } from 'vitest';
import { mergeModuleData } from '../src/store/backup-sections.js';

describe('دمج بيانات الوحدة', () => {
  it('الكائنات تُدمج مفتاحاً مفتاحاً والوارد يغلب', () => {
    const r = mergeModuleData({ translations: { Sand: 'رمل', Silt: 'غرين' } }, { translations: { Sand: 'رمل خشن', Clay: 'طين' } });
    expect(JSON.stringify(r.translations)).toBe(JSON.stringify({ Sand: 'رمل خشن', Silt: 'غرين', Clay: 'طين' }));
  });
  it('المصفوفات ذات id تُدمج بالمعرّف', () => {
    const r = mergeModuleData({ notes: [{ id: 'n1', text: 'أ' }, { id: 'n2', text: 'ب' }] }, { notes: [{ id: 'n2', text: 'ب معدّلة' }, { id: 'n3', text: 'ج' }] });
    expect(r.notes.map((n) => `${n.id}:${n.text}`).join('|')).toBe('n1:أ|n2:ب معدّلة|n3:ج');
  });
  it('بدون بيانات حالية يرجع الوارد كما هو', () => {
    expect(mergeModuleData(null, { a: 1 }).a).toBe(1);
  });
});