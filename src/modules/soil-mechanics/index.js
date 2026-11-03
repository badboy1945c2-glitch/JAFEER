/**
 * index.js - تسجيل وحدة «ميكانيك التربة»
 * المرجع الوحيد: soil-mechanics-spec.md  |  المصدر: src-soil-lec-1
 */
import { StorageAdapter } from '../../store/adapter.js';

export const SOIL_SOURCE = {
  id: 'src-soil-lec-1',
  title: 'محاضرات ميكانيك التربة (Soil Mechanic)',
  author: '',
  edition: '',
  pages: 'الصفحات 1 إلى 45',
  link: ''
};

export const SOIL_TABS = [
  { id: 'laws', title: 'القوانين', hint: 'علاقات الأطوار وحدود أتربرغ' },
  { id: 'grain', title: 'التحليل الحبيبي', hint: 'المناخل ومنحنى التدرج' },
  { id: 'detect', title: 'كشف نوع التربة', hint: 'USCS وAASHTO وUSDA' },
  { id: 'examples', title: 'أمثلة المحاضرة', hint: 'حلول جاهزة بضغطة زر' },
  { id: 'tables', title: 'الجداول', hint: 'جداول المرجع للقراءة' }
];

// يضيف مصدر المحاضرة إلى نظام المصادر إن لم يكن موجوداً (آمن للتكرار)
export function ensureSoilSource() {
  try {
    const exists = StorageAdapter.getSources().some(s => s.id === SOIL_SOURCE.id);
    if (!exists) StorageAdapter.saveSource({ ...SOIL_SOURCE });
  } catch (err) {
    console.warn('تعذر تسجيل مصدر ميكانيك التربة:', err);
  }
}