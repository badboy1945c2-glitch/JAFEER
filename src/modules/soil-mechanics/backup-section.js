/**
 * backup-section.js - يسجّل بيانات وحدة ميكانيك التربة (ما تحرره من لوحة التحكم) في حزمة النسخ الاحتياطي
 * القواعد المقفلة (القوانين وأشجار التصنيف) لا تُصدَّر: هي في الكود.
 */
import { registerBackupSection, mergeModuleData } from '../../store/backup-sections.js';
import { SOIL_STORAGE_KEY } from './custom-store.js';

const read = () => {
  try { return JSON.parse(localStorage.getItem(SOIL_STORAGE_KEY)); } catch { return null; }
};

registerBackupSection('soil-mechanics', {
  label: 'وحدة ميكانيك التربة (الترجمات والملاحظات والأمثلة والصور المرتبطة)',
  export: () => read(),
  import: (data, mode) => {
    const next = mode === 'replace' ? data : mergeModuleData(read(), data);
    localStorage.setItem(SOIL_STORAGE_KEY, JSON.stringify(next));
  },
  reset: () => localStorage.removeItem(SOIL_STORAGE_KEY)
});