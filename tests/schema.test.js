import { describe, it, expect, beforeEach } from 'vitest';
import { StorageAdapter } from '../src/store/adapter.js';
import {
  validateFormulaSchema,
  validateCategorySchema,
  validateImportPackage,
  migrateData
} from '../src/store/schema.js';
import { importBackupPackage, createBackupPackage } from '../src/store/backup.js';

describe('طبقة البيانات والتخزين الموحدة (Storage & Schema Tests - Phase 4)', () => {
  beforeEach(async () => {
    StorageAdapter.clearAllData();
    await StorageAdapter.initStore();
  });

  // 1. التهيئة الأولية بالبيانات الابتدائية
  it('1. يقوم بتهيئة البيانات الابتدائية (Seed Data) عند بدء التشغيل', () => {
    const formulas = StorageAdapter.getFormulas();
    const categories = StorageAdapter.getCategories();
    const constants = StorageAdapter.getConstants();
    const tables = StorageAdapter.getTables();
    const settings = StorageAdapter.getSettings();

    expect(formulas.length).toBeGreaterThanOrEqual(3);
    expect(categories.length).toBeGreaterThanOrEqual(4);
    expect(constants.some(c => c.key === 'g')).toBe(true);
    expect(tables.some(t => t.id === 'concrete_grades')).toBe(true);
    expect(settings.siteName).toBe('المهندس الصغير');
  });

  // 2. إضافة واسترجاع وحذف معادلة جديدة
  it('2. يتيح حفظ واسترجاع وتعديل وحذف المعادلات', () => {
    const newFormula = {
      id: 'test-deflection',
      title: 'أقصى هطول لعتبة بسيطة',
      categoryId: 'cat-structures',
      inputs: [
        { key: 'w', label: 'الحمل', default: 10 },
        { key: 'L', label: 'الطول', default: 5 },
        { key: 'E', label: 'معامل المرونة', default: 200000 },
        { key: 'I', label: 'عزم العطالة', default: 8000 }
      ],
      outputs: [
        { key: 'delta', label: 'الهطول', expression: '5 * w * L^4 / (384 * E * I)' }
      ]
    };

    // حفظ
    StorageAdapter.saveFormula(newFormula);
    expect(StorageAdapter.getFormula('test-deflection')).toBeDefined();
    expect(StorageAdapter.getFormula('test-deflection').title).toBe('أقصى هطول لعتبة بسيطة');

    // تعديل
    StorageAdapter.saveFormula({ ...newFormula, title: 'أقصى هطول معدل' });
    expect(StorageAdapter.getFormula('test-deflection').title).toBe('أقصى هطول معدل');

    // حذف
    const removed = StorageAdapter.deleteFormula('test-deflection');
    expect(removed).toBe(true);
    expect(StorageAdapter.getFormula('test-deflection')).toBeNull();
  });

  // 3. رفض المعادلات غير المطابقة للمخطط
  it('3. يرفض حفظ المعادلات غير الصالحة برسالة خطأ عربية', () => {
    const invalidFormula = {
      id: 'bad-formula'
      // بدون title وبدون inputs أو outputs
    };

    expect(() => StorageAdapter.saveFormula(invalidFormula)).toThrow('عنوان المعادلة مطلوب');
  });

  // 4. إدارة التصنيفات
  it('4. يتيح حفظ وتعديل وحذف التصنيفات الهندسية', () => {
    const newCat = {
      id: 'cat-hydraulics',
      title: 'الهيدروليكا وميكانيكا الموائع',
      order: 10
    };

    StorageAdapter.saveCategory(newCat);
    expect(StorageAdapter.getCategory('cat-hydraulics')).toBeDefined();

    StorageAdapter.deleteCategory('cat-hydraulics');
    expect(StorageAdapter.getCategory('cat-hydraulics')).toBeNull();
  });

  // 5. حماية المصادر المرتبطة بالمعادلات من الحذف الخاطئ
  it('5. يمنع حذف أي مصدر إذا كان مرتبطاً بمعادلات في النظام', () => {
    // المصدر src-001 مرتبط بمعادلة beam-simple-moment في seedData
    expect(() => StorageAdapter.deleteSource('src-001')).toThrow('لا يمكن حذف المصدر لأنه مرتبط');
  });

  // 6. إدارة الثوابت والجداول
  it('6. يتيح حفظ وتعديل الثوابت والجداول المرجعية', () => {
    StorageAdapter.saveConstant({ key: 'steel_yield', label: 'خضوع الحديد', value: 420, unit: 'MPa' });
    expect(StorageAdapter.getConstant('steel_yield').value).toBe(420);

    StorageAdapter.deleteConstant('steel_yield');
    expect(StorageAdapter.getConstant('steel_yield')).toBeNull();
  });

  // 7. تحديث إعدادات الموقع
  it('7. يحفظ ويحدث إعدادات الموقع', () => {
    StorageAdapter.updateSettings({ tagline: 'موقع الهندسة المدنية الأول' });
    const settings = StorageAdapter.getSettings();
    expect(settings.tagline).toBe('موقع الهندسة المدنية الأول');
    expect(settings.siteName).toBe('المهندس الصغير');
  });

  // 8. حفظ واسترجاع وسائط IndexedDB
  it('8. يدعم حفظ واسترجاع وإحصاء حجم الوسائط', async () => {
    const mockAsset = {
      id: 'asset-test-1',
      name: 'مخطط عتبة خرسانية.png',
      alt: 'رسم توضيحي لعتبة',
      mimeType: 'image/png',
      dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      size: 512
    };

    await StorageAdapter.saveMediaAsset(mockAsset);
    const retrieved = await StorageAdapter.getMediaAsset('asset-test-1');
    expect(retrieved).toBeDefined();
    expect(retrieved.name).toBe('مخطط عتبة خرسانية.png');

    const usage = await StorageAdapter.getMediaStorageUsage();
    expect(usage).toBeGreaterThanOrEqual(512);

    await StorageAdapter.deleteMediaAsset('asset-test-1');
    expect(await StorageAdapter.getMediaAsset('asset-test-1')).toBeNull();
  });

  // 9. تصدير واستيراد الحزمة الكاملة
  it('9. ينشئ حزمة تصدير ويستوردها بنجاح (Merge & Replace)', async () => {
    const backup = await createBackupPackage();
    expect(backup.schemaVersion).toBe(1);
    expect(backup.formulas.length).toBeGreaterThan(0);

    // تعديل محلي لاختبار الاستيراد
    StorageAdapter.saveFormula({
      id: 'imported-test',
      title: 'معادلة استيراد تجريبية',
      inputs: [{ key: 'x', label: 'س' }],
      outputs: [{ key: 'y', expression: 'x * 2' }]
    });

    const resMerge = await importBackupPackage(backup, { mode: 'merge' });
    expect(resMerge.success).toBe(true);
    // في نمط الدمج، المعادلة المضافة تبقى
    expect(StorageAdapter.getFormula('imported-test')).toBeDefined();

    // في نمط الاستبدال، تعود البيانات لحالة النسخة الاحتياطية فقط
    const resReplace = await importBackupPackage(backup, { mode: 'replace' });
    expect(resReplace.success).toBe(true);
    expect(StorageAdapter.getFormula('imported-test')).toBeNull();
  });

  // 10. كشف الملفات التالفة عند الاستيراد
  it('10. يرفض الحزم التالفة أو غير المطابقة للمخطط برسائل عربية دقيقة', async () => {
    const corruptJson = '{ "brokenJson": ';
    const res1 = await importBackupPackage(corruptJson);
    expect(res1.success).toBe(false);
    expect(res1.message).toContain('JSON');

    const invalidStructure = {
      formulas: [
        { id: 'broken', title: '' } // عنوان فارغ وبدون مدخلات
      ]
    };
    const res2 = await importBackupPackage(invalidStructure);
    expect(res2.success).toBe(false);
    expect(res2.errors.length).toBeGreaterThan(0);
  });

  // 11. ترقية المخطط تلقائياً
  it('11. يضمن ترقية المخطط وحفظ الحقول الأساسية عند الترقية من إصدار قديم', () => {
    const oldData = {
      formulas: [{ id: 'f1', title: 'قديمة' }]
    };
    const migrated = migrateData(oldData, 0);
    expect(migrated.schemaVersion).toBe(1);
    expect(Array.isArray(migrated.categories)).toBe(true);
    expect(Array.isArray(migrated.tables)).toBe(true);
  });
});

