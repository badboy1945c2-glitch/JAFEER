/**
 * local-storage.js - محول التخزين المحلي LocalStorage مع دعم الذاكرة كبديل
 */

const PREFIX = 'almuhandis_v1_';

// مخزن بالذاكرة لحالات عدم توفر localStorage (مثل بيئة Vitest/Node)
const memoryStore = new Map();

function isStorageAvailable() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const testKey = '__test_storage__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function getRaw(key) {
  if (isStorageAvailable()) {
    return window.localStorage.getItem(PREFIX + key);
  }
  return memoryStore.get(PREFIX + key) || null;
}

function setRaw(key, value) {
  if (isStorageAvailable()) {
    window.localStorage.setItem(PREFIX + key, value);
  } else {
    memoryStore.set(PREFIX + key, value);
  }
}

function removeRaw(key) {
  if (isStorageAvailable()) {
    window.localStorage.removeItem(PREFIX + key);
  } else {
    memoryStore.delete(PREFIX + key);
  }
}

export const LocalStorageAdapter = {
  /**
   * جلب قائمة عناصر مجموعة محددة (formulas, categories, ...)
   * @param {string} collection 
   * @returns {Array}
   */
  list(collection) {
    const raw = getRaw(collection);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  /**
   * جلب عنصر واحد بالمعرف
   * @param {string} collection 
   * @param {string} id 
   * @returns {Object|null}
   */
  get(collection, id) {
    const items = this.list(collection);
    return items.find((item) => (item.id === id || item.key === id)) || null;
  },

  /**
   * حفظ أو تحديث عنصر في مجموعة
   * @param {string} collection 
   * @param {Object} item 
   * @returns {Object}
   */
  set(collection, item) {
    if (!item) return item;
    const items = this.list(collection);
    const keyProp = item.id !== undefined ? 'id' : 'key';
    const index = items.findIndex((i) => i[keyProp] === item[keyProp]);

    if (index >= 0) {
      items[index] = { ...items[index], ...item, updatedAt: new Date().toISOString() };
    } else {
      const now = new Date().toISOString();
      items.push({
        ...item,
        createdAt: item.createdAt || now,
        updatedAt: now
      });
    }

    setRaw(collection, JSON.stringify(items));
    return item;
  },

  /**
   * حفظ المجموعة كاملة دفعة واحدة
   * @param {string} collection 
   * @param {Array|Object} data 
   */
  saveCollection(collection, data) {
    setRaw(collection, JSON.stringify(data));
  },

  /**
   * جلب كائن مفرد كالإعدادات
   * @param {string} key 
   * @returns {Object|null}
   */
  getObject(key) {
    const raw = getRaw(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  /**
   * حفظ كائن مفرد كالإعدادات
   * @param {string} key 
   * @param {Object} value 
   */
  setObject(key, value) {
    setRaw(key, JSON.stringify(value));
  },

  /**
   * حذف عنصر من مجموعة
   * @param {string} collection 
   * @param {string} id 
   * @returns {boolean}
   */
  remove(collection, id) {
    const items = this.list(collection);
    const keyProp = items.length > 0 && items[0].id !== undefined ? 'id' : 'key';
    const filtered = items.filter((item) => item[keyProp] !== id && item.id !== id && item.key !== id);
    const removed = filtered.length !== items.length;
    if (removed) {
      setRaw(collection, JSON.stringify(filtered));
    }
    return removed;
  },

  /**
   * تفريغ مجموعة كاملة
   * @param {string} collection 
   */
  clear(collection) {
    removeRaw(collection);
  },

  /**
   * مسح كامل مخزن الموقع
   */
  clearAll() {
    if (isStorageAvailable()) {
      const toRemove = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && k.startsWith(PREFIX)) toRemove.push(k);
      }
      toRemove.forEach((k) => window.localStorage.removeItem(k));
    }
    memoryStore.clear();
  }
};

