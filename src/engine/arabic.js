/**
 * arabic.js - معالجة وتوحيد النصوص والأرقام العربية للبحث والمطابقة
 * 
 * القواعد:
 * 1. إزالة التشكيل والتطويل (ـ)
 * 2. توحيد الهمزات والألفات (أ، إ، آ ← ا)
 * 3. توحيد التاء المربوطة والهاء (ة ← ه)
 * 4. توحيد الياء والألف المقصورة (ى ← ي)
 * 5. توحيد الأرقام العربية الهندية (٠-٩) والفارسية (۰-۹) إلى أرقام لاتينية
 * 6. توحيد الفواصل العشرية (٫)
 */

// خريطة تحويل الأرقام المشرقية والفارسية
const NUM_MAP = {
  '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
  '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
  '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
  '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9'
};

// أنماط التشكيل العربي والتطويل
const TASHKEEL_REGEX = /[\u064B-\u065F\u0670\u0640]/g;

/**
 * توحيد النص العربي للبحث والمطابقة
 * @param {string} text - النص الأصلي
 * @returns {string} - النص موحداً
 */
export function normalizeArabicText(text) {
  if (!text || typeof text !== 'string') return '';

  let normalized = text.trim().toLowerCase();

  // 1. إزالة حركات التشكيل والتطويل
  normalized = normalized.replace(TASHKEEL_REGEX, '');

  // 2. توحيد أشكال الألف والهمزات
  normalized = normalized.replace(/[أإآٱ]/g, 'ا');
  normalized = normalized.replace(/ؤ/g, 'و');
  normalized = normalized.replace(/ئ/g, 'ي');

  // 3. توحيد التاء المربوطة والهاء
  normalized = normalized.replace(/ة/g, 'ه');

  // 4. توحيد الألف المقصورة والياء
  normalized = normalized.replace(/ى/g, 'ي');

  // 5. استبدال الأرقام العربية المشرقية
  normalized = normalized.replace(/[٠-٩۰-۹]/g, (digit) => NUM_MAP[digit] || digit);

  // 6. توحيد المسافات المتعددة إلى مسافة واحدة
  normalized = normalized.replace(/\s+/g, ' ');

  return normalized;
}

/**
 * فحص مطابقة نص البحث داخل نص المصدر مع مراعاة خصائص اللغة العربية
 * يدعم البحث بعدة كلمات منفصلة
 * @param {string} sourceText - النص المراد البحث فيه
 * @param {string} queryText - كلمة أو جملة البحث
 * @returns {boolean} - true إذا طابقت جميع الكلمات
 */
export function matchArabicSearch(sourceText, queryText) {
  if (!queryText || !queryText.trim()) return true;
  if (!sourceText || typeof sourceText !== 'string') return false;

  const normalizedSource = normalizeArabicText(sourceText);
  const normalizedQuery = normalizeArabicText(queryText);

  // تقسيم كلمات البحث للمطابقة المرنة
  const queryWords = normalizedQuery.split(' ').filter(Boolean);

  return queryWords.every((word) => normalizedSource.includes(word));
}

/**
 * استبدال الأرقام في نص أو رقم وتحويل الفواصل العشرية
 * @param {string|number} rawValue 
 * @returns {string}
 */
export function normalizeArabicNumber(rawValue) {
  if (rawValue === null || rawValue === undefined) return '';
  let str = String(rawValue).trim();

  // تحويل الأرقام المشرقية
  str = str.replace(/[٠-٩۰-۹]/g, (d) => NUM_MAP[d] || d);

  // إزالة فاصلة الآلاف
  str = str.replace(/\u066C/g, '');

  // تحويل الفاصلة العشرية العربية (٫)
  str = str.replace(/\u066B/g, '.');

  // تحويل الفاصلة العادية إلى نقطة إذا كانت وحيدة
  if (str.includes(',') && !str.includes('.')) {
    str = str.replace(',', '.');
  }

  return str;
}

