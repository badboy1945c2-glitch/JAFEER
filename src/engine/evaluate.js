/**
 * evaluate.js - تنفيذ وتقييم المعادلات الرياضية بأمان عبر mathjs
 * 
 * المزايا المتقدمة:
 * - تقييم آمن بدون eval() أو new Function()
 * - دعم الثوابت المركزية (مثل g = 9.81) مع أولوية المدخلات إن تشابهت الأسماء
 * - دعم الجداول المرجعية (Lookup Tables) ودالة lookup(tableId, value, targetCol)
 * - تسجيل خطوات الحل المتسلسلة
 */

import { compile, parse, round } from 'mathjs';
import {
  validateInputs,
  validateFormulaExpression,
  validateCalculationResult
} from './validate.js';

/**
 * تقريب رقم لعدد محدد من الخانات العشرية
 * @param {number} value
 * @param {number} decimals
 * @returns {number}
 */
export function roundToDecimals(value, decimals = 2) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return value;
  if (decimals === undefined || decimals === null || decimals < 0) return value;
  return round(value, decimals);
}

/**
 * بناء دالة lookup آمنة لربط الجداول المرجعية بمحرك mathjs
 * @param {Array|Object} tables - الجداول المرجعية المتاحة
 * @returns {Function}
 */
export function createLookupFunction(tables = []) {
  const tableMap = new Map();

  if (Array.isArray(tables)) {
    tables.forEach((t) => {
      if (t && t.id) tableMap.set(t.id, t);
    });
  } else if (tables && typeof tables === 'object') {
    Object.entries(tables).forEach(([id, t]) => {
      tableMap.set(id, t);
    });
  }

  return function lookup(tableId, lookupValue, targetColumn) {
    const table = tableMap.get(tableId);
    if (!table) {
      throw new Error(`الجدول المرجعي غير موجود: "${tableId}"`);
    }

    const rows = table.rows || [];
    const columns = table.columns || [];

    // العمود الأساسي للبحث (العمود الأول أو العمود المسمى 'key' أو 'grade' أو 'id')
    const keyCol = columns.find(c => c.key === 'key' || c.key === 'id') || columns[0];
    const keyProp = keyCol ? keyCol.key : Object.keys(rows[0] || {})[0];

    // مطابقة الصف
    const matchRow = rows.find((r) => {
      const cellVal = r[keyProp];
      return String(cellVal).trim().toLowerCase() === String(lookupValue).trim().toLowerCase();
    });

    if (!matchRow) {
      throw new Error(`لم يتم العثور على القيمة "${lookupValue}" في الجدول "${table.title || tableId}"`);
    }

    if (!Object.prototype.hasOwnProperty.call(matchRow, targetColumn)) {
      throw new Error(`العمود "${targetColumn}" غير موجود في الجدول "${tableId}"`);
    }

    const val = matchRow[targetColumn];
    return typeof val === 'number' ? val : Number(val) || val;
  };
}

/**
 * إنشاء تمثيل نصي للمعادلة بعد تعويض قيم المتغيرات والثوابت فيها
 * @param {string} expression - التعبير الرياضي الأصلي
 * @param {Object} scope - المتغيرات وقيمها
 * @returns {string}
 */
export function generateSubstitutedExpression(expression, scope) {
  try {
    const node = parse(expression);
    const transformed = node.transform((childNode) => {
      if (childNode.isSymbolNode && Object.prototype.hasOwnProperty.call(scope, childNode.name)) {
        const val = scope[childNode.name];
        if (typeof val === 'function') return childNode; // لا نستبدل أسماء الدوال
        const displayVal = typeof val === 'number' && val < 0 ? `(${val})` : String(val);
        return parse(displayVal);
      }
      return childNode;
    });
    return transformed.toString();
  } catch {
    return expression;
  }
}

/**
 * تنفيذ حساب معادلة متكاملة مع دعم الثوابت والجداول المرجعية
 * @param {Object} formula - كائن المعادلة
 * @param {Object} rawInputValues - قيم المدخلات من المستخدم
 * @param {Object} [context] - الثوابت والجداول المرجعية
 * @param {Object|Array} [context.constants] - الثوابت المسجلة
 * @param {Object|Array} [context.tables] - الجداول المرجعية المسجلة
 * @returns {{
 *   success: boolean,
 *   inputs: Object,
 *   outputs: Object,
 *   steps: Array,
 *   errors: Object,
 *   errorMessage: string|null
 * }}
 */
export function evaluateFormula(formula, rawInputValues = {}, context = {}) {
  if (!formula) {
    return {
      success: false,
      inputs: {},
      outputs: {},
      steps: [],
      errors: { _general: 'بيانات المعادلة غير متوفرة.' },
      errorMessage: 'بيانات المعادلة غير متوفرة.'
    };
  }

  const inputsSpec = formula.inputs || [];
  const outputsSpec = formula.outputs || [];

  // تحويل الثوابت إلى كائن { key: value }
  const constantsScope = {};
  if (context.constants) {
    if (Array.isArray(context.constants)) {
      context.constants.forEach((c) => {
        if (c && c.key) constantsScope[c.key] = c.value;
      });
    } else if (typeof context.constants === 'object') {
      Object.assign(constantsScope, context.constants);
    }
  }

  // دالة البحث في الجداول
  const lookupFn = createLookupFunction(context.tables || []);

  // 1. التحقق من المدخلات
  const inputValidation = validateInputs(inputsSpec, rawInputValues);
  if (!inputValidation.isValid) {
    return {
      success: false,
      inputs: inputValidation.values,
      outputs: {},
      steps: [],
      errors: inputValidation.errors,
      errorMessage: 'يرجى تصحيح قيم المدخلات المعلمة باللون الأحمر.'
    };
  }

  // 2. إعداد نطاق المتغيرات
  // القاعدة: المدخلات تتغلب على الثوابت إذا تطابقت المفاتيح
  const scope = {
    ...constantsScope,
    ...inputValidation.values,
    lookup: lookupFn
  };

  const outputs = {};
  const steps = [];
  const errors = {};

  // 3. حساب المخرجات بالترتيب
  for (let i = 0; i < outputsSpec.length; i++) {
    const outSpec = outputsSpec[i];
    const key = outSpec.key;
    const label = outSpec.label || key;
    const expression = outSpec.expression;
    const decimals = typeof outSpec.decimals === 'number' ? outSpec.decimals : 2;

    const availableVars = Object.keys(scope);

    // التحقق من صحة الصيغة
    const exprValidation = validateFormulaExpression(expression, availableVars);
    if (!exprValidation.isValid) {
      errors[key] = exprValidation.error;
      return {
        success: false,
        inputs: inputValidation.values,
        outputs,
        steps,
        errors,
        errorMessage: `خطأ في صيغة المخرج "${label}": ${exprValidation.error}`
      };
    }

    const substitutedExpr = generateSubstitutedExpression(expression, scope);

    // التقييم الآمن
    let rawResult;
    try {
      const compiled = compile(expression);
      rawResult = compiled.evaluate(scope);
    } catch (evalErr) {
      errors[key] = `خطأ أثناء الحساب: ${evalErr.message || 'تعذر تقييم المعادلة'}`;
      return {
        success: false,
        inputs: inputValidation.values,
        outputs,
        steps,
        errors,
        errorMessage: `تعذر حساب "${label}": ${evalErr.message || 'تأكد من العمليات الرياضية'}`
      };
    }

    // التحقق من صلاحية النتيجة
    const resultCheck = validateCalculationResult(rawResult, label);
    if (!resultCheck.isValid) {
      errors[key] = resultCheck.error;
      return {
        success: false,
        inputs: inputValidation.values,
        outputs,
        steps,
        errors,
        errorMessage: resultCheck.error
      };
    }

    const finalValue = roundToDecimals(rawResult, decimals);

    // إضافة الناتج لنطاق المتغيرات
    scope[key] = rawResult;
    outputs[key] = {
      key,
      label,
      unit: outSpec.unit || '',
      rawValue: rawResult,
      value: finalValue,
      decimals
    };

    steps.push({
      key,
      label,
      unit: outSpec.unit || '',
      latex: outSpec.latex || `${key} = ${expression}`,
      expression,
      substitutedExpression: `${key} = ${substitutedExpr}`,
      resultFormatted: `${finalValue} ${outSpec.unit || ''}`.trim(),
      value: finalValue
    });
  }

  return {
    success: true,
    inputs: inputValidation.values,
    outputs,
    steps,
    errors: {},
    errorMessage: null
  };
}
