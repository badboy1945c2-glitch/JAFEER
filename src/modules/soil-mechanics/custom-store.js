/**
 * custom-store.js - مخزن ما يحرره المشرف في وحدة ميكانيك التربة (من لوحة التحكم)
 * المسموح تعديله فقط: الترجمات، الملاحظات، الأمثلة الإضافية، الصور المرتبطة. القواعد مقفلة في الكود.
 * هذا هو المفتاح الوحيد الذي تقرأه وتكتبه كل أجزاء الموقع (واجهة التربة، اللوحة، النسخ الاحتياطي، النشر).
 */
export const SOIL_STORAGE_KEY = 'almuhandis_v1_soil_custom';

const empty = () => ({ translations: {}, notes: [], examples: [], assets: {} });

export function getSoilCustom() {
  try {
    const d = JSON.parse(localStorage.getItem(SOIL_STORAGE_KEY));
    return d && typeof d === 'object' ? { ...empty(), ...d } : empty();
  } catch {
    return empty();
  }
}

export function saveSoilCustom(data) {
  localStorage.setItem(SOIL_STORAGE_KEY, JSON.stringify(data));
}

// الترجمة العربية المعدّلة من اللوحة، أو القيمة البديلة إن لم توجد
export function translateName(en, fallback = '') {
  return getSoilCustom().translations[en] || fallback;
}