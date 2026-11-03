import { describe, it, expect } from 'vitest';
import {
  normalizeArabicText,
  matchArabicSearch,
  normalizeArabicNumber
} from '../src/engine/arabic.js';

describe('معالجة وتوحيد النصوص العربية (Arabic Processing Tests)', () => {
  it('1. يزيل التشكيل والتطويل من النص بدقة', () => {
    const raw = 'المُهَنْدِسُ الصَّـغِيرُ';
    expect(normalizeArabicText(raw)).toBe('المهندس الصغير');
  });

  it('2. يوحد الهمزات وأشكال الألف (أ، إ، آ، ٱ ← ا)', () => {
    expect(normalizeArabicText('إجهاد')).toBe('اجهاد');
    expect(normalizeArabicText('أقصى')).toBe('اقصي');
    expect(normalizeArabicText('آلات')).toBe('الات');
  });

  it('3. يوحد التاء المربوطة والهاء (ة ← ه)', () => {
    expect(normalizeArabicText('عتبة')).toBe('عتبه');
    expect(normalizeArabicText('خرسانة')).toBe('خرسانه');
  });

  it('4. يوحد الألف المقصورة والياء (ى ← ي)', () => {
    expect(normalizeArabicText('انحناء عظمى')).toBe('انحناء عظمي');
  });

  it('5. يدعم البحث الذكي متعدد الكلمات متجاهلاً الفروقات الإملائية والتشكيل', () => {
    const title = 'حساب العزم الأقصى لعتبة بسيطة الإسناد';
    
    // بحث بدون همزة
    expect(matchArabicSearch(title, 'العزم الاقصي')).toBe(true);
    // بحث مع تشكيل
    expect(matchArabicSearch(title, 'عَتَبَة')).toBe(true);
    // بحث بكلمات متباعدة
    expect(matchArabicSearch(title, 'حساب الإسناد')).toBe(true);
    // بحث غير مطابق
    expect(matchArabicSearch(title, 'أعمدة')).toBe(false);
  });

  it('6. يحول الأرقام المشرقية (٠-٩) والفارسية (۰-۹) والفواصل العشرية (٫) بشكل سليم', () => {
    expect(normalizeArabicNumber('٢٥٫٧٥')).toBe('25.75');
    expect(normalizeArabicNumber('۱۲٫۵')).toBe('12.5');
    expect(normalizeArabicNumber('3,14')).toBe('3.14');
  });
});

