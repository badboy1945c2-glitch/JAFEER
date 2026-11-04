/**
 * index.js - تسجيل وحدة «الكونكريت» (خرسانة مسلحة)
 * المرجع: محاضرات Design of Reinforced Concrete Structures I (جامعة المثنى). كل معلومة برقم صفحتها.
 */
import { StorageAdapter } from '../../store/adapter.js';

export const CONCRETE_SOURCE = {
  id: 'src-concrete-lec-1',
  title: 'محاضرات تصميم المنشآت الخرسانية المسلحة 1 (Design of Reinforced Concrete Structures I)',
  author: 'م.د. عثمان حميد وم.م. أمير جبار، جامعة المثنى، كلية الهندسة',
  edition: '',
  pages: '',
  link: ''
};

// يضيف مصدر المحاضرة إلى نظام المصادر إن لم يكن موجوداً (آمن للتكرار)
export function ensureConcreteSource() {
  try {
    const exists = StorageAdapter.getSources().some((s) => s.id === CONCRETE_SOURCE.id);
    if (!exists) StorageAdapter.saveSource({ ...CONCRETE_SOURCE });
  } catch (err) {
    console.warn('تعذر تسجيل مصدر الكونكريت:', err);
  }
}