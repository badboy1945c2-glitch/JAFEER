/**
 * schema.js - مخطط البيانات، التحقق من الصحة، والترقية التلقائية
 */

export const SCHEMA_VERSION = 1;

/**
 * التحقق من كائن المعادلة
 * @param {Object} formula
 * @returns {{ isValid: boolean, error: string|null }}
 */
export function validateFormulaSchema(formula) {
  if (!formula || typeof formula !== 'object') {
    return { isValid: false, error: 'كائن المعادلة غير صالح.' };
  }
  if (!formula.id || typeof formula.id !== 'string') {
    return { isValid: false, error: 'معرّف المعادلة (id) مفقود أو غير نصي.' };
  }
  if (!formula.title || typeof formula.title !== 'string') {
    return { isValid: false, error: 'عنوان المعادلة مطلوب.' };
  }
  if (!Array.isArray(formula.inputs)) {
    return { isValid: false, error: 'مصفوفة المدخلات (inputs) غير صالحة.' };
  }
  for (const input of formula.inputs) {
    if (!input.key || typeof input.key !== 'string') {
      return { isValid: false, error: 'مفتاح المدخل (key) مطلوب في جميع المدخلات.' };
    }
  }
  if (!Array.isArray(formula.outputs) || formula.outputs.length === 0) {
    return { isValid: false, error: 'يجب أن تحتوي المعادلة على مخرج واحد على الأقل.' };
  }
  for (const output of formula.outputs) {
    if (!output.key || typeof output.key !== 'string') {
      return { isValid: false, error: 'مفتاح المخرج (key) مطلوب في جميع المخرجات.' };
    }
    if (!output.expression || typeof output.expression !== 'string') {
      return { isValid: false, error: `صيغة المخرج "${output.key}" مطلوبة.` };
    }
  }
  return { isValid: true, error: null };
}

/**
 * التحقق من كائن التصنيف
 * @param {Object} category
 * @returns {{ isValid: boolean, error: string|null }}
 */
export function validateCategorySchema(category) {
  if (!category || typeof category !== 'object') {
    return { isValid: false, error: 'كائن التصنيف غير صالح.' };
  }
  if (!category.id || typeof category.id !== 'string') {
    return { isValid: false, error: 'معرّف التصنيف مطلوب.' };
  }
  if (!category.title || typeof category.title !== 'string') {
    return { isValid: false, error: 'اسم التصنيف مطلوب.' };
  }
  return { isValid: true, error: null };
}

/**
 * التحقق من كائن المصدر
 * @param {Object} source
 * @returns {{ isValid: boolean, error: string|null }}
 */
export function validateSourceSchema(source) {
  if (!source || typeof source !== 'object') {
    return { isValid: false, error: 'كائن المصدر غير صالح.' };
  }
  if (!source.id || typeof source.id !== 'string') {
    return { isValid: false, error: 'معرّف المصدر مطلوب.' };
  }
  if (!source.title || typeof source.title !== 'string') {
    return { isValid: false, error: 'عنوان المصدر مطلوب.' };
  }
  return { isValid: true, error: null };
}

/**
 * التحقق من كائن الثابت الرياضي/الهندسي
 * @param {Object} constant
 * @returns {{ isValid: boolean, error: string|null }}
 */
export function validateConstantSchema(constant) {
  if (!constant || typeof constant !== 'object') {
    return { isValid: false, error: 'كائن الثابت غير صالح.' };
  }
  if (!constant.key || typeof constant.key !== 'string') {
    return { isValid: false, error: 'رمز الثابت مطلوب.' };
  }
  if (constant.value === undefined || constant.value === null || isNaN(Number(constant.value))) {
    return { isValid: false, error: 'قيمة الثابت يجب أن تكون رقماً صالحاً.' };
  }
  return { isValid: true, error: null };
}

/**
 * التحقق من كائن الجدول المرجعي
 * @param {Object} table
 * @returns {{ isValid: boolean, error: string|null }}
 */
export function validateTableSchema(table) {
  if (!table || typeof table !== 'object') {
    return { isValid: false, error: 'كائن الجدول المرجعي غير صالح.' };
  }
  if (!table.id || typeof table.id !== 'string') {
    return { isValid: false, error: 'معرّف الجدول مطلوب.' };
  }
  if (!table.title || typeof table.title !== 'string') {
    return { isValid: false, error: 'عنوان الجدول مطلوب.' };
  }
  if (!Array.isArray(table.columns)) {
    return { isValid: false, error: 'أعمدة الجدول يجب أن تكون مصفوفة.' };
  }
  if (!Array.isArray(table.rows)) {
    return { isValid: false, error: 'صفوف الجدول يجب أن تكون مصفوفة.' };
  }
  return { isValid: true, error: null };
}

/**
 * التحقق من صحة حزمة الاستيراد الكاملة
 * @param {Object} pkg - حزمة الموقع المراد استيرادها
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateImportPackage(pkg) {
  const errors = [];

  if (!pkg || typeof pkg !== 'object') {
    return { isValid: false, errors: ['الملف المستورد تالف أو لا يحتوي على كائن JSON صالح.'] };
  }

  if (pkg.formulas && !Array.isArray(pkg.formulas)) {
    errors.push('حقل المعادلات (formulas) يجب أن يكون مصفوفة.');
  } else if (pkg.formulas) {
    pkg.formulas.forEach((f, idx) => {
      const res = validateFormulaSchema(f);
      if (!res.isValid) errors.push(`المعادلة #${idx + 1} (${f.id || 'بدون معرف'}): ${res.error}`);
    });
  }

  if (pkg.categories && !Array.isArray(pkg.categories)) {
    errors.push('حقل التصنيفات (categories) يجب أن يكون مصفوفة.');
  }

  if (pkg.tables && !Array.isArray(pkg.tables)) {
    errors.push('حقل الجداول (tables) يجب أن يكون مصفوفة.');
  }

  if (pkg.constants && !Array.isArray(pkg.constants)) {
    errors.push('حقل الثوابت (constants) يجب أن يكون مصفوفة.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * ترقية مخطط البيانات تلقائياً في حال وجود إصدارات أقدم
 * @param {Object} data 
 * @param {number} fromVersion 
 * @returns {Object}
 */
export function migrateData(data, fromVersion = 0) {
  let migrated = { ...data };

  // إذا كانت البيانات بدون إصدار أو إصدار 0، نقوم بالترقية للإصدار 1
  if (fromVersion < 1) {
    migrated.schemaVersion = 1;
    if (!migrated.settings) migrated.settings = {};
    if (!migrated.formulas) migrated.formulas = [];
    if (!migrated.categories) migrated.categories = [];
    if (!migrated.sources) migrated.sources = [];
    if (!migrated.constants) migrated.constants = [];
    if (!migrated.tables) migrated.tables = [];
    if (!migrated.homeSections) migrated.homeSections = [];
  }

  return migrated;
}

