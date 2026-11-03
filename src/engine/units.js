/**
 * units.js - نظام تحويل ومطابقة الوحدات الهندسية
 * 
 * يدعم وحدات الهندسة المدنية والميكانيكية الأساسية:
 * - الأطوال والمساحات والحجوم
 * - القوى والعزوم
 * - الإجهادات والضغوط (Pa, kPa, MPa, GPa, N/mm², kN/m²)
 * - الكتل والكثافات
 */

// جداول التحويل إلى الوحدة القياسية الأساسية في النظام الدولي (SI)
const UNIT_DEFINITIONS = {
  // 1. الطول (Base: m)
  length: {
    base: 'm',
    units: {
      'm': 1,
      'cm': 0.01,
      'mm': 0.001,
      'km': 1000,
      'in': 0.0254,
      'ft': 0.3048
    }
  },

  // 2. المساحة (Base: m²)
  area: {
    base: 'm²',
    units: {
      'm²': 1,
      'cm²': 0.0001,
      'mm²': 0.000001,
      'km²': 1000000,
      'ft²': 0.092903,
      'in²': 0.00064516
    }
  },

  // 3. الحجم (Base: m³)
  volume: {
    base: 'm³',
    units: {
      'm³': 1,
      'L': 0.001,
      'cm³': 0.000001,
      'mm³': 1e-9
    }
  },

  // 4. القوة (Base: N)
  force: {
    base: 'N',
    units: {
      'N': 1,
      'kN': 1000,
      'MN': 1000000,
      'kgf': 9.80665,
      'lbf': 4.44822
    }
  },

  // 5. الإجهاد والضغط (Base: Pa)
  stress: {
    base: 'Pa',
    units: {
      'Pa': 1,
      'kPa': 1000,
      'kN/m²': 1000,
      'MPa': 1000000,
      'N/mm²': 1000000, // 1 N/mm² = 1 MPa
      'GPa': 1000000000,
      'bar': 100000,
      'psi': 6894.76
    }
  },

  // 6. العزم (Base: N.m)
  moment: {
    base: 'N.m',
    units: {
      'N.m': 1,
      'kN.m': 1000,
      'N.mm': 0.001,
      'kN.mm': 1
    }
  },

  // 7. الكتلة (Base: kg)
  mass: {
    base: 'kg',
    units: {
      'kg': 1,
      'g': 0.001,
      'ton': 1000,
      'lb': 0.453592
    }
  },

  // 8. الكثافة والوزن الحجمي (Base: kg/m³)
  density: {
    base: 'kg/m³',
    units: {
      'kg/m³': 1,
      'ton/m³': 1000,
      'g/cm³': 1000,
      'kN/m³': 101.9716 // تقريبي مع تسارع الجاذبية 9.80665
    }
  }
};

/**
 * تحديد صنف الوحدة الهندسية
 * @param {string} unit 
 * @returns {string|null}
 */
export function getUnitCategory(unit) {
  if (!unit) return null;
  const cleanUnit = unit.trim();
  for (const [category, def] of Object.entries(UNIT_DEFINITIONS)) {
    if (Object.prototype.hasOwnProperty.call(def.units, cleanUnit)) {
      return category;
    }
  }
  return null;
}

/**
 * فحص ما إذا كانت وحدتان متوافقتين للتحويل بينهما
 * @param {string} unitA 
 * @param {string} unitB 
 * @returns {boolean}
 */
export function areUnitsCompatible(unitA, unitB) {
  if (!unitA || !unitB) return false;
  if (unitA.trim() === unitB.trim()) return true;
  const catA = getUnitCategory(unitA);
  const catB = getUnitCategory(unitB);
  return catA !== null && catA === catB;
}

/**
 * تحويل قيمة رقمية من وحدة إلى وحدة أخرى متوافقة
 * @param {number} value - القيمة المراد تحويلها
 * @param {string} fromUnit - الوحدة المصدر
 * @param {string} toUnit - الوحدة الهدف
 * @returns {number}
 */
export function convertUnit(value, fromUnit, toUnit) {
  if (value === null || value === undefined || isNaN(value)) return value;
  if (!fromUnit || !toUnit || fromUnit.trim() === toUnit.trim()) return value;

  const category = getUnitCategory(fromUnit);
  if (!category || category !== getUnitCategory(toUnit)) {
    throw new Error(`الوحدتان غير متوافقتين للتحويل: "${fromUnit}" و "${toUnit}"`);
  }

  const def = UNIT_DEFINITIONS[category];
  const fromFactor = def.units[fromUnit.trim()];
  const toFactor = def.units[toUnit.trim()];

  // تحويل إلى الأساس أولاً ثم إلى الوحدة المستهدفة
  const baseValue = value * fromFactor;
  return baseValue / toFactor;
}

