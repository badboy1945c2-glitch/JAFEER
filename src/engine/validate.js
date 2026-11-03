/**
 * validate.js - وحدة التحقق من صحة المدخلات وصيغ المعادلات
 * 
 * القواعد:
 * - رسائل أخطاء باللغة العربية الواضحة
 * - دعم الأرقام العربية المشرقية (٠-٩) والفواصل العشرية (٫)
 * - فحص حدود القيم (min, max) والقسمة على الصفر
 * - فحص المتغيرات غير المعرفة، مع دعم الثوابت والجداول المرجعية
 */

import { parse } from 'mathjs';
import { normalizeArabicNumber } from './arabic.js';

// الثوابت والدوال الرياضية المسموح بها في mathjs دون اعتبارها متغيرات ناقصة
const ALLOWED_MATH_SYMBOLS = new Set([
  'pi', 'PI', 'e', 'E', 'LN2', 'LN10', 'LOG2E', 'LOG10E', 'SQRT1_2', 'SQRT2', 'tau', 'phi',
  'lookup' // دالة البحث في الجداول المرجعية
]);

/**
 * تحويل السلسلة النصية للأرقام العربية والفواصل إلى صيغة قياسية
 * @param {string|number} rawValue
 * @returns {string}
 */
export function normalizeNumberString(rawValue) {
  return normalizeArabicNumber(rawValue);
}

/**
 * تحويل القيمة المدخلة إلى رقم عشري مع التحقق
 * @param {any} rawValue
 * @returns {{ isValid: boolean, value: number, error: string|null }}
 */
export function parseNumber(rawValue) {
  if (rawValue === null || rawValue === undefined || rawValue === '') {
    return { isValid: false, value: NaN, error: 'هذا الحقل مطلوب.' };
  }

  const normalized = normalizeNumberString(rawValue);
  const num = Number(normalized);

  if (isNaN(num)) {
    return { isValid: false, value: NaN, error: 'يرجى إدخال قيمة رقمية صحيحة.' };
  }

  if (!Number.isFinite(num)) {
    return { isValid: false, value: NaN, error: 'القيمة غير منتهية أو خارج النطاق المسموح.' };
  }

  return { isValid: true, value: num, error: null };
}

/**
 * التحقق من قيمة مدخلة ومطابقتها للمواصفات (الحد الأدنى والأعلى)
 * @param {any} rawValue 
 * @param {object} spec 
 * @returns {{ isValid: boolean, value: any, error: string|null }}
 */
export function validateInputValue(rawValue, spec = {}) {
  // إذا كان الحقل نصياً أو مرتبطاً بقائمة جدول منسدلة
  if (spec.type === 'text' || spec.lookupTableId) {
    if (rawValue === null || rawValue === undefined || rawValue === '') {
      return { isValid: false, value: rawValue, error: `حقل "${spec.label || spec.key}" مطلوب.` };
    }
    return { isValid: true, value: String(rawValue).trim(), error: null };
  }

  const parseResult = parseNumber(rawValue);
  if (!parseResult.isValid) {
    return parseResult;
  }

  const val = parseResult.value;
  const label = spec.label || spec.key || 'القيمة';

  if (spec.min !== undefined && spec.min !== null && val < spec.min) {
    return {
      isValid: false,
      value: val,
      error: `قيمة "${label}" يجب ألا تقل عن ${spec.min}.`
    };
  }

  if (spec.max !== undefined && spec.max !== null && val > spec.max) {
    return {
      isValid: false,
      value: val,
      error: `قيمة "${label}" يجب ألا تزيد عن ${spec.max}.`
    };
  }

  return { isValid: true, value: val, error: null };
}

/**
 * التحقق من مجموعة مدخلات المعادلة دفعة واحدة
 * @param {Array} inputsSpec - مصفوفة تعريف المدخلات من المعادلة
 * @param {Object} userValues - كائن يحتوي على القيم المدخلة
 * @returns {{ isValid: boolean, values: Object, errors: Object }}
 */
export function validateInputs(inputsSpec = [], userValues = {}) {
  const values = {};
  const errors = {};
  let isValid = true;

  for (const inputSpec of inputsSpec) {
    const key = inputSpec.key;
    const rawVal = userValues[key] !== undefined && userValues[key] !== null && userValues[key] !== ''
      ? userValues[key]
      : inputSpec.default;

    const res = validateInputValue(rawVal, inputSpec);
    if (!res.isValid) {
      isValid = false;
      errors[key] = res.error;
    } else {
      values[key] = res.value;
    }
  }

  return { isValid, values, errors };
}

/**
 * التحقق من سلامة صيغة المعادلة (mathjs expression)
 * وفحص المتغيرات المستخدمة فيها مقارنة بالمتغيرات المتاحة
 * @param {string} expression - صيغة المعادلة
 * @param {Array<string>} availableVariables - قائمة الرموز المعرّفة (مدخلات، مخرجات سابقة، وثوابت)
 * @returns {{ isValid: boolean, error: string|null, symbols: string[] }}
 */
export function validateFormulaExpression(expression, availableVariables = []) {
  if (!expression || typeof expression !== 'string' || !expression.trim()) {
    return { isValid: false, error: 'صيغة المعادلة فارغة.', symbols: [] };
  }

  let node;
  try {
    node = parse(expression);
  } catch (err) {
    return {
      isValid: false,
      error: `خطأ في صياغة المعادلة: ${err.message || 'تأكد من كتابة العمليات والأقواس بصورة صحيحة'}`,
      symbols: []
    };
  }

  const foundSymbols = new Set();
  node.traverse((childNode, path, parent) => {
    if (childNode.isSymbolNode) {
      const isFunctionCallName = parent && parent.isFunctionNode && parent.fn === childNode;
      if (!isFunctionCallName) {
        foundSymbols.add(childNode.name);
      }
    }
  });

  const availableSet = new Set([...availableVariables, ...ALLOWED_MATH_SYMBOLS]);
  const missingSymbols = [];

  for (const sym of foundSymbols) {
    if (!availableSet.has(sym)) {
      missingSymbols.push(sym);
    }
  }

  if (missingSymbols.length > 0) {
    return {
      isValid: false,
      error: `المتغير أو الثابت التالي غير معرّف في المدخلات: ${missingSymbols.join('، ')}`,
      symbols: Array.from(foundSymbols)
    };
  }

  return {
    isValid: true,
    error: null,
    symbols: Array.from(foundSymbols)
  };
}

/**
 * فحص نتيجة الحساب الرياضي (تجنب القسمة على صفر أو ما لا نهاية أو NaN)
 * @param {any} result
 * @param {string} [outputLabel]
 * @returns {{ isValid: boolean, error: string|null }}
 */
export function validateCalculationResult(result, outputLabel = 'النتيجة') {
  if (result === undefined || result === null) {
    return { isValid: false, error: `تعذر حساب ${outputLabel}.` };
  }

  if (typeof result === 'number') {
    if (isNaN(result)) {
      return { isValid: false, error: `ناتج ${outputLabel} غير معرّف (NaN). تحقق من صحة المدخلات كالقيم السالبة داخل الجذور.` };
    }
    if (!isFinite(result)) {
      return { isValid: false, error: `ناتج ${outputLabel} لا نهائي (قسمة على صفر). تحقق من القيم المدخلة.` };
    }
  }

  return { isValid: true, error: null };
}
