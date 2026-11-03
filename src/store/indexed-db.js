/**
 * indexed-db.js - غلاف أصيل خفيف وبسيط لـ IndexedDB لتخزين الصور والملفات الكبيرة
 * بدون أي مكتبات خارجية وفق شروط الخطة
 */

const DB_NAME = 'almuhandis_db';
const DB_VERSION = 1;
const STORE_ASSETS = 'media_assets';

// مخزن ذاكرة احتياطي عند غياب IndexedDB (مثل اختبارات Node/Vitest)
const memoryAssets = new Map();

function isIndexedDBAvailable() {
  return typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';
}

/**
 * فتح أو ترقية قاعدة البيانات
 * @returns {Promise<IDBDatabase>}
 */
function openDB() {
  return new Promise((resolve, reject) => {
    if (!isIndexedDBAvailable()) {
      return resolve(null);
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_ASSETS)) {
        db.createObjectStore(STORE_ASSETS, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const IndexedDBAdapter = {
  /**
   * حفظ أصل وسائط (صورة، ملف)
   * @param {Object} asset - { id, name, alt, mimeType, dataUrl, thumbUrl, size, tags, createdAt }
   * @returns {Promise<Object>}
   */
  async saveAsset(asset) {
    if (!asset || !asset.id) {
      throw new Error('بيانات الأصل غير مكتملة (المعرف مطلوب).');
    }

    const assetToSave = {
      ...asset,
      createdAt: asset.createdAt || new Date().toISOString()
    };

    if (!isIndexedDBAvailable()) {
      memoryAssets.set(asset.id, assetToSave);
      return assetToSave;
    }

    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_ASSETS, 'readwrite');
      const store = tx.objectStore(STORE_ASSETS);
      const req = store.put(assetToSave);

      req.onsuccess = () => resolve(assetToSave);
      req.onerror = () => reject(req.error);
    });
  },

  /**
   * جلب أصل واحد بواسطة المعرف
   * @param {string} id 
   * @returns {Promise<Object|null>}
   */
  async getAsset(id) {
    if (!id) return null;

    if (!isIndexedDBAvailable()) {
      return memoryAssets.get(id) || null;
    }

    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_ASSETS, 'readonly');
      const store = tx.objectStore(STORE_ASSETS);
      const req = store.get(id);

      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  },

  /**
   * استرجاع قائمة جميع الوسائط المحفوظة
   * @returns {Promise<Array>}
   */
  async listAssets() {
    if (!isIndexedDBAvailable()) {
      return Array.from(memoryAssets.values());
    }

    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_ASSETS, 'readonly');
      const store = tx.objectStore(STORE_ASSETS);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  },

  /**
   * حذف أصل من التخزين
   * @param {string} id 
   * @returns {Promise<boolean>}
   */
  async removeAsset(id) {
    if (!id) return false;

    if (!isIndexedDBAvailable()) {
      return memoryAssets.delete(id);
    }

    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_ASSETS, 'readwrite');
      const store = tx.objectStore(STORE_ASSETS);
      const req = store.delete(id);

      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  },

  /**
   * حساب المساحة التخزينية المستخدمة تقريبياً (بالبايت)
   * @returns {Promise<number>}
   */
  async getStorageUsage() {
    const assets = await this.listAssets();
    let totalBytes = 0;
    for (const asset of assets) {
      if (asset.size) {
        totalBytes += asset.size;
      } else if (asset.dataUrl) {
        totalBytes += asset.dataUrl.length * 0.75; // تقدير تقريبي لـ Base64
      }
    }
    return Math.round(totalBytes);
  },

  /**
   * مسح جميع الوسائط
   * @returns {Promise<void>}
   */
  async clearAll() {
    if (!isIndexedDBAvailable()) {
      memoryAssets.clear();
      return;
    }
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_ASSETS, 'readwrite');
      const store = tx.objectStore(STORE_ASSETS);
      const req = store.clear();

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
};

