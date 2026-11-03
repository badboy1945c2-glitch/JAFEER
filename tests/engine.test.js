import { describe, it, expect } from 'vitest';
import {
  normalizeNumberString,
  parseNumber,
  validateInputValue,
  validateInputs,
  validateFormulaExpression,
  validateCalculationResult
} from '../src/engine/validate.js';
import { evaluateFormula, roundToDecimals } from '../src/engine/evaluate.js';
import { convertUnit, areUnitsCompatible } from '../src/engine/units.js';

describe('محرك المعادلات الهندسية (Engine Tests - Phase 3)', () => {
  const simpleBeamFormula = {
    id: 'beam-simple-moment',
    title: 'العزم الأقصى في عتبة بسيطة الإسناد',
    category: 'المنشآت',
    description: 'حساب العزم الأقصى لعتبة محمّلة بحمل منتظم على كامل طولها.',
    inputs: [
      { key: 'w', label: 'الحمل الموزع', unit: 'kN/m', default: 10, min: 0 },
      { key: 'L', label: 'طول العتبة', unit: 'm', default: 5, min: 0 }
    ],
    outputs: [
      {
        key: 'M',
        label: 'العزم الأقصى',
        unit: 'kN.m',
        expression: 'w * L^2 / 8',
        latex: 'M = \\frac{w L^2}{8}',
        decimals: 2
      }
    ]
  };

  // 1. حساب معادلة العتبة البسيطة
  it('1. يحسب العزم الأقصى لعتبة بسيطة بشكل صحيح (31.25 عند w=10 و L=5)', () => {
    const res = evaluateFormula(simpleBeamFormula, { w: 10, L: 5 });
    expect(res.success).toBe(true);
    expect(res.outputs.M.value).toBe(31.25);
    expect(res.steps[0].substitutedExpression).toContain('10');
    expect(res.steps[0].substitutedExpression).toContain('5');
  });

  // 2. مخرجات متسلسلة
  it('2. يدعم المخرجات المتسلسلة (مخرج يعتمد على ناتج مخرج سابق)', () => {
    const slabFormula = {
      id: 'slab-volume-weight',
      title: 'حجم ووزن بلاطة خرسانية',
      inputs: [
        { key: 'L', label: 'الطول', default: 6 },
        { key: 'B', label: 'العرض', default: 4 },
        { key: 't', label: 'السماكة', default: 0.2 },
        { key: 'density', label: 'الكثافة', default: 25 }
      ],
      outputs: [
        { key: 'Area', label: 'المساحة', expression: 'L * B', decimals: 2 },
        { key: 'Volume', label: 'الحجم', expression: 'Area * t', decimals: 2 },
        { key: 'Weight', label: 'الوزن', expression: 'Volume * density', decimals: 2 }
      ]
    };

    const res = evaluateFormula(slabFormula, { L: 6, B: 4, t: 0.2, density: 25 });
    expect(res.success).toBe(true);
    expect(res.outputs.Area.value).toBe(24);
    expect(res.outputs.Volume.value).toBe(4.8);
    expect(res.outputs.Weight.value).toBe(120);
  });

  // 3. أرقام عربية مشرقية
  it('3. يحول الأرقام العربية الهندية (٠-٩) المكتوبة كنص بنجاح', () => {
    const res = evaluateFormula(simpleBeamFormula, { w: '١٠', L: '٥' });
    expect(res.success).toBe(true);
    expect(res.outputs.M.value).toBe(31.25);
  });

  // 4. فواصل عشرية عربية
  it('4. يدعم الفاصلة العشرية العربية (٫) والفاصلة العادية (,) في المدخلات', () => {
    const res = evaluateFormula(simpleBeamFormula, { w: '١٠٫٥', L: '٤' });
    expect(res.success).toBe(true);
    expect(res.outputs.M.value).toBe(21);
  });

  // 5. التحقق من المدخلات الناقصة أو غير الرقمية
  it('5. يرفض المدخلات غير الصالحة برسالة عربية واضحة', () => {
    const res = evaluateFormula(simpleBeamFormula, { w: 'invalid', L: 5 });
    expect(res.success).toBe(false);
    expect(res.errors.w).toBe('يرجى إدخال قيمة رقمية صحيحة.');
  });

  // 6. التحقق من min
  it('6. يرفض القيم الأقل من الحد الأدنى (min)', () => {
    const res = evaluateFormula(simpleBeamFormula, { w: -2, L: 5 });
    expect(res.success).toBe(false);
    expect(res.errors.w).toContain('يجب ألا تقل عن 0');
  });

  // 7. التحقق من max
  it('7. يرفض القيم الأعلى من الحد الأقصى (max)', () => {
    const formulaWithMax = {
      id: 'max-test',
      inputs: [{ key: 'ratio', label: 'النسبة', min: 0, max: 1 }],
      outputs: [{ key: 'res', expression: 'ratio * 100' }]
    };
    const res = evaluateFormula(formulaWithMax, { ratio: 1.2 });
    expect(res.success).toBe(false);
    expect(res.errors.ratio).toContain('يجب ألا تزيد عن 1');
  });

  // 8. كشف المتغيرات الناقصة
  it('8. يكشف أي متغير غير معرّف في الصيغة ويرفضها', () => {
    const formulaWithMissingVar = {
      id: 'missing-test',
      inputs: [{ key: 'b', label: 'العرض' }],
      outputs: [{ key: 'h', expression: 'b * unknownVar' }]
    };
    const res = evaluateFormula(formulaWithMissingVar, { b: 5 });
    expect(res.success).toBe(false);
    expect(res.errorMessage).toContain('unknownVar');
  });

  // 9. كشف القسمة على صفر
  it('9. يكشف حالات القسمة على الصفر ويعطي خطأ عربياً واضحاً بدلاً من Infinity', () => {
    const stressFormula = {
      id: 'stress-zero',
      inputs: [
        { key: 'P', label: 'القوة' },
        { key: 'A', label: 'المساحة' }
      ],
      outputs: [
        { key: 'sigma', label: 'الإجهاد', expression: 'P / A' }
      ]
    };
    const res = evaluateFormula(stressFormula, { P: 500, A: 0 });
    expect(res.success).toBe(false);
    expect(res.errorMessage).toContain('قسمة على صفر');
  });

  // 10. ثوابت ودوال الرياضيات (pi, sqrt)
  it('10. يدعم ثوابت ودوال الرياضيات الافتراضية كـ pi و sqrt دون اعتبارها متغيرات ناقصة', () => {
    const circleFormula = {
      id: 'circle-area',
      inputs: [{ key: 'd', label: 'القطر' }],
      outputs: [{ key: 'A', expression: 'pi * d^2 / 4', decimals: 4 }]
    };
    const res = evaluateFormula(circleFormula, { d: 2 });
    expect(res.success).toBe(true);
    expect(res.outputs.A.value).toBe(3.1416);
  });

  // 11. دعم الثوابت المركزية (مثل g = 9.81)
  it('11. يدعم الثوابت المركزية للنظام (مثل تسارع الجاذبية g)', () => {
    const weightFormula = {
      id: 'weight-formula',
      inputs: [{ key: 'm', label: 'الكتلة', default: 100 }],
      outputs: [
        { key: 'W', label: 'الوزن', expression: 'm * g', decimals: 1 }
      ]
    };

    const context = {
      constants: [{ key: 'g', label: 'تسارع الجاذبية', value: 9.81 }]
    };

    const res = evaluateFormula(weightFormula, { m: 100 }, context);
    expect(res.success).toBe(true);
    expect(res.outputs.W.value).toBe(981);
  });

  // 12. تغلب مدخلات المستخدم على الثوابت إذا تطابق الاسم
  it('12. يتغلب مدخل المستخدم على الثابت المركزي إذا حمل نفس الاسم داخل المعادلة', () => {
    const customGFormula = {
      id: 'custom-g',
      inputs: [
        { key: 'm', label: 'الكتلة' },
        { key: 'g', label: 'جاذبية مخصصة' }
      ],
      outputs: [
        { key: 'W', expression: 'm * g' }
      ]
    };

    const context = {
      constants: [{ key: 'g', value: 9.81 }]
    };

    // نحدد g = 10 بدلاً من 9.81
    const res = evaluateFormula(customGFormula, { m: 100, g: 10 }, context);
    expect(res.success).toBe(true);
    expect(res.outputs.W.value).toBe(1000);
  });

  // 13. دعم الجداول المرجعية ودالة lookup
  it('13. يدعم الجداول المرجعية باستخدام دالة lookup(tableId, value, targetCol)', () => {
    const concreteBeamFormula = {
      id: 'concrete-capacity',
      inputs: [
        { key: 'grade', label: 'رتبة الخرسانة', type: 'text', default: 'C25' },
        { key: 'b', label: 'عرض المقطع', default: 250 },
        { key: 'd', label: 'العمق الفعال', default: 500 }
      ],
      outputs: [
        { key: 'fc', label: 'مقاومة الخرسانة', expression: 'lookup("concrete_grades", grade, "fc")' },
        { key: 'capacity', label: 'السعة التقريبية', expression: '0.36 * fc * b * d / 1000', decimals: 2 }
      ]
    };

    const context = {
      tables: [
        {
          id: 'concrete_grades',
          title: 'رتب الخرسانة',
          columns: [
            { key: 'grade', label: 'الرتبة' },
            { key: 'fc', label: 'مقاومة الانضغاط' }
          ],
          rows: [
            { grade: 'C20', fc: 20 },
            { grade: 'C25', fc: 25 },
            { grade: 'C30', fc: 30 }
          ]
        }
      ]
    };

    const res = evaluateFormula(concreteBeamFormula, { grade: 'C25', b: 250, d: 500 }, context);
    expect(res.success).toBe(true);
    expect(res.outputs.fc.value).toBe(25);
    // capacity = 0.36 * 25 * 250 * 500 / 1000 = 1125
    expect(res.outputs.capacity.value).toBe(1125);
  });

  // 14. كشف الأخطاء عند استعلام جدول غير موجود
  it('14. يعطي خطأ واضحاً عند استعلام جدول مرجعي أو قيمة غير موجودة', () => {
    const badLookupFormula = {
      id: 'bad-lookup',
      inputs: [{ key: 'x', label: 'س', type: 'text', default: 'None' }],
      outputs: [{ key: 'y', expression: 'lookup("non_existent_table", x, "fc")' }]
    };

    const res = evaluateFormula(badLookupFormula, { x: 'C25' }, { tables: [] });
    expect(res.success).toBe(false);
    expect(res.errorMessage).toContain('غير موجود');
  });

  // 15. تحويل الوحدات الهندسية عبر units.js
  it('15. يحول الوحدات الهندسية المتوافقة (طول، قوة، إجهاد، عزم) بدقة', () => {
    // الطول: 500 mm = 0.5 m
    expect(convertUnit(500, 'mm', 'm')).toBe(0.5);
    // القوة: 2.5 kN = 2500 N
    expect(convertUnit(2.5, 'kN', 'N')).toBe(2500);
    // الإجهاد: 1 N/mm² = 1 MPa = 1000 kPa
    expect(convertUnit(1, 'N/mm²', 'MPa')).toBe(1);
    expect(convertUnit(1, 'MPa', 'kPa')).toBe(1000);
    // العزم: 10 kN.m = 10000 N.m
    expect(convertUnit(10, 'kN.m', 'N.m')).toBe(10000);

    // فحص عدم توافق الوحدات
    expect(areUnitsCompatible('m', 'kN')).toBe(false);
    expect(() => convertUnit(10, 'm', 'kN')).toThrow('غير متوافقتين');
  });
});
