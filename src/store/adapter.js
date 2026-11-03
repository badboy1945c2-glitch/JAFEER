/**
 * adapter.js - طبقة التخزين الموحدة لموقع «المهندس الصغير»
 * 
 * تجمع بين LocalStorage للنصوص والإعدادات والمعادلات، و IndexedDB للصور والوسائط،
 * وتوفر واجهة برمجية موحدة ومتسقة لكامل التطبيق.
 */

import { LocalStorageAdapter } from './local-storage.js';
import { IndexedDBAdapter } from './indexed-db.js';
import {
  SCHEMA_VERSION,
  validateFormulaSchema,
  validateCategorySchema,
  validateSourceSchema,
  validateConstantSchema,
  validateTableSchema,
  migrateData
} from './schema.js';
import seedData from '../data/seed.json';
import { getPublishedAsset } from '../media/published.js';
const COLLECTIONS = {
  FORMULAS: 'formulas',
  CATEGORIES: 'categories',
  SOURCES: 'sources',
  CONSTANTS: 'constants',
  TABLES: 'tables',
  HOME_SECTIONS: 'home_sections',
  SETTINGS: 'settings',
  META: 'meta'
};

export const StorageAdapter = {
  /**
   * تهيئة المخزن عند إقلاع التطبيق (فحص الإصدار، تحميل البيانات الابتدائية إن وجد فراغ)
   */
  async initStore() {
    const meta = LocalStorageAdapter.getObject(COLLECTIONS.META) || {};
    const existingVersion = meta.schemaVersion || 0;

    // فحص ما إذا كانت البيانات موجودة مسبقاً
    const existingFormulas = LocalStorageAdapter.list(COLLECTIONS.FORMULAS);

    if (existingFormulas.length === 0) {
      // تحميل المحتوى الابتدائي المبدئي seedData
      this.loadSeedData(seedData);
    } else if (existingVersion < SCHEMA_VERSION) {
      // ترقية البيانات إن وُجد إصدار قديم
      const allCurrentData = this.getAllDataSync();
      const migrated = migrateData(allCurrentData, existingVersion);
      this.restoreAllData(migrated);
    }

    // تحديث رقم الإصدار
    LocalStorageAdapter.setObject(COLLECTIONS.META, {
      schemaVersion: SCHEMA_VERSION,
      lastInitialized: new Date().toISOString()
    });
  },

  /**
   * تحميل البيانات الابتدائية
   * @param {Object} seed 
   */
  loadSeedData(seed = seedData) {
    if (seed.settings) LocalStorageAdapter.setObject(COLLECTIONS.SETTINGS, seed.settings);
    if (seed.categories) LocalStorageAdapter.saveCollection(COLLECTIONS.CATEGORIES, seed.categories);
    if (seed.formulas) LocalStorageAdapter.saveCollection(COLLECTIONS.FORMULAS, seed.formulas);
    if (seed.constants) LocalStorageAdapter.saveCollection(COLLECTIONS.CONSTANTS, seed.constants);
    if (seed.tables) LocalStorageAdapter.saveCollection(COLLECTIONS.TABLES, seed.tables);
    if (seed.sources) LocalStorageAdapter.saveCollection(COLLECTIONS.SOURCES, seed.sources);
    if (seed.homeSections) LocalStorageAdapter.saveCollection(COLLECTIONS.HOME_SECTIONS, seed.homeSections);
  },

  // --------------------------------------------------------------------------
  // 1. المعادلات (Formulas)
  // --------------------------------------------------------------------------
  getFormulas() {
    return LocalStorageAdapter.list(COLLECTIONS.FORMULAS);
  },

  getFormula(id) {
    return LocalStorageAdapter.get(COLLECTIONS.FORMULAS, id);
  },

  saveFormula(formula) {
    const check = validateFormulaSchema(formula);
    if (!check.isValid) {
      throw new Error(`خطأ في مخطط المعادلة: ${check.error}`);
    }
    return LocalStorageAdapter.set(COLLECTIONS.FORMULAS, formula);
  },

  deleteFormula(id) {
    return LocalStorageAdapter.remove(COLLECTIONS.FORMULAS, id);
  },

  // --------------------------------------------------------------------------
  // 2. التصنيفات (Categories)
  // --------------------------------------------------------------------------
  getCategories() {
    const list = LocalStorageAdapter.list(COLLECTIONS.CATEGORIES);
    return list.sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  getCategory(id) {
    return LocalStorageAdapter.get(COLLECTIONS.CATEGORIES, id);
  },

  saveCategory(category) {
    const check = validateCategorySchema(category);
    if (!check.isValid) {
      throw new Error(`خطأ في بيانات التصنيف: ${check.error}`);
    }
    return LocalStorageAdapter.set(COLLECTIONS.CATEGORIES, category);
  },

  deleteCategory(id) {
    return LocalStorageAdapter.remove(COLLECTIONS.CATEGORIES, id);
  },

  // --------------------------------------------------------------------------
  // 3. المصادر والمراجع (Sources)
  // --------------------------------------------------------------------------
  getSources() {
    return LocalStorageAdapter.list(COLLECTIONS.SOURCES);
  },

  getSource(id) {
    return LocalStorageAdapter.get(COLLECTIONS.SOURCES, id);
  },

  saveSource(source) {
    const check = validateSourceSchema(source);
    if (!check.isValid) {
      throw new Error(`خطأ في بيانات المصدر: ${check.error}`);
    }
    return LocalStorageAdapter.set(COLLECTIONS.SOURCES, source);
  },

  deleteSource(id) {
    // فحص ما إذا كانت هناك معادلات مرتبطة بالمصدر
    const formulas = this.getFormulas();
    const linkedFormulas = formulas.filter(f => f.sourceIds && f.sourceIds.includes(id));
    if (linkedFormulas.length > 0) {
      // إشعار بوجود ارتباط
      const titles = linkedFormulas.map(f => `"${f.title}"`).join('، ');
      const err = new Error(`لا يمكن حذف المصدر لأنه مرتبط بالمعادلات التالية: ${titles}`);
      err.isLinked = true;
      err.linkedCount = linkedFormulas.length;
      throw err;
    }
    return LocalStorageAdapter.remove(COLLECTIONS.SOURCES, id);
  },

  // --------------------------------------------------------------------------
  // 4. الثوابت المركزية (Constants)
  // --------------------------------------------------------------------------
  getConstants() {
    return LocalStorageAdapter.list(COLLECTIONS.CONSTANTS);
  },

  getConstant(key) {
    return LocalStorageAdapter.get(COLLECTIONS.CONSTANTS, key);
  },

  saveConstant(constant) {
    const check = validateConstantSchema(constant);
    if (!check.isValid) {
      throw new Error(`خطأ في بيانات الثابت: ${check.error}`);
    }
    return LocalStorageAdapter.set(COLLECTIONS.CONSTANTS, constant);
  },

  deleteConstant(key) {
    return LocalStorageAdapter.remove(COLLECTIONS.CONSTANTS, key);
  },

  // --------------------------------------------------------------------------
  // 5. الجداول المرجعية (Lookup Tables)
  // --------------------------------------------------------------------------
  getTables() {
    return LocalStorageAdapter.list(COLLECTIONS.TABLES);
  },

  getTable(id) {
    return LocalStorageAdapter.get(COLLECTIONS.TABLES, id);
  },

  saveTable(table) {
    const check = validateTableSchema(table);
    if (!check.isValid) {
      throw new Error(`خطأ في بيانات الجدول: ${check.error}`);
    }
    return LocalStorageAdapter.set(COLLECTIONS.TABLES, table);
  },

  deleteTable(id) {
    return LocalStorageAdapter.remove(COLLECTIONS.TABLES, id);
  },

  // --------------------------------------------------------------------------
  // 6. إعدادات الموقع وأقسام الرئيسية (Settings & Home Sections)
  // --------------------------------------------------------------------------
  getSettings() {
    return LocalStorageAdapter.getObject(COLLECTIONS.SETTINGS) || seedData.settings;
  },

  updateSettings(newSettings) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    LocalStorageAdapter.setObject(COLLECTIONS.SETTINGS, updated);
    return updated;
  },

  getHomeSections() {
    const sections = LocalStorageAdapter.list(COLLECTIONS.HOME_SECTIONS);
    if (sections.length === 0) return seedData.homeSections;
    return sections.sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  saveHomeSections(sections) {
    LocalStorageAdapter.saveCollection(COLLECTIONS.HOME_SECTIONS, sections);
  },

  // --------------------------------------------------------------------------
  // 7. وسائط وملفات IndexedDB
  // --------------------------------------------------------------------------
  async saveMediaAsset(asset) {
    return await IndexedDBAdapter.saveAsset(asset);
  },

    async getMediaAsset(id) {
    return (await IndexedDBAdapter.getAsset(id)) || (await getPublishedAsset(id));
  },

  async listMediaAssets() {
    return await IndexedDBAdapter.listAssets();
  },

  async deleteMediaAsset(id) {
    return await IndexedDBAdapter.removeAsset(id);
  },

  async getMediaStorageUsage() {
    return await IndexedDBAdapter.getStorageUsage();
  },

  // --------------------------------------------------------------------------
  // 8. استخراج واسترجاع البيانات دفعة واحدة (Export & Import)
  // --------------------------------------------------------------------------
  getAllDataSync() {
    return {
      schemaVersion: SCHEMA_VERSION,
      settings: this.getSettings(),
      categories: this.getCategories(),
      formulas: this.getFormulas(),
      constants: this.getConstants(),
      tables: this.getTables(),
      sources: this.getSources(),
      homeSections: this.getHomeSections()
    };
  },

  restoreAllData(data) {
    if (!data || typeof data !== 'object') return;
    if (data.settings) LocalStorageAdapter.setObject(COLLECTIONS.SETTINGS, data.settings);
    if (data.categories) LocalStorageAdapter.saveCollection(COLLECTIONS.CATEGORIES, data.categories);
    if (data.formulas) LocalStorageAdapter.saveCollection(COLLECTIONS.FORMULAS, data.formulas);
    if (data.constants) LocalStorageAdapter.saveCollection(COLLECTIONS.CONSTANTS, data.constants);
    if (data.tables) LocalStorageAdapter.saveCollection(COLLECTIONS.TABLES, data.tables);
    if (data.sources) LocalStorageAdapter.saveCollection(COLLECTIONS.SOURCES, data.sources);
    if (data.homeSections) LocalStorageAdapter.saveCollection(COLLECTIONS.HOME_SECTIONS, data.homeSections);
  },

  clearAllData() {
    LocalStorageAdapter.clearAll();
  }
};

