/**
 * auth.js - نظام إدارة الجلسة والتحقق برمز الـ PIN المشفّر عبر SHA-256
 */

import { StorageAdapter } from '../store/adapter.js';

const SESSION_KEY = 'almuhandis_admin_session';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 دقيقة خمول

/**
 * تشفير الـ PIN باستخدام خوارزمية SHA-256 القياسية
 * @param {string} pin 
 * @returns {Promise<string>}
 */
export async function hashPin(pin) {
  const cleanPin = String(pin).trim();
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(cleanPin);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // بديل بسيط إن لم يتوفر crypto.subtle
  let hash = 0;
  for (let i = 0; i < cleanPin.length; i++) {
    hash = ((hash << 5) - hash) + cleanPin.charCodeAt(i);
    hash |= 0;
  }
  return 'simple_' + Math.abs(hash);
}

/**
 * فحص ما إذا كان هناك رمز PIN مسجل مسبقاً
 * @returns {boolean}
 */
export function hasAdminPin() {
  const settings = StorageAdapter.getSettings();
  return Boolean(settings && settings.adminPinHash);
}

/**
 * تعيين رمز PIN جديد للمشرف
 * @param {string} pin 
 * @returns {Promise<boolean>}
 */
export async function setAdminPin(pin) {
  if (!pin || pin.length < 4 || pin.length > 8) {
    throw new Error('يجب أن يتكون رمز PIN من 4 إلى 8 أرقام.');
  }
  const hash = await hashPin(pin);
  StorageAdapter.updateSettings({ adminPinHash: hash });
  startSession();
  return true;
}

/**
 * التحقق من صحة رمز PIN المدخل
 * @param {string} pin 
 * @returns {Promise<boolean>}
 */
export async function verifyAdminPin(pin) {
  const settings = StorageAdapter.getSettings();
  if (!settings || !settings.adminPinHash) return false;
  const hash = await hashPin(pin);
  const isValid = hash === settings.adminPinHash;
  if (isValid) {
    startSession();
  }
  return isValid;
}

/**
 * بدء جلسة المشرف
 */
export function startSession() {
  try {
    const sessionData = {
      authenticated: true,
      lastActive: Date.now()
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  } catch {
    // sessionStorage fallback
  }
}

/**
 * فحص صلاحية الجلسة الحالية ومراعاة مهلة الـ 30 دقيقة
 * @returns {boolean}
 */
export function isAuthenticated() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const session = JSON.parse(raw);
    if (!session || !session.authenticated) return false;

    // فحص انتهاء الجلسة بعد 30 دقيقة
    const now = Date.now();
    if (now - session.lastActive > SESSION_TIMEOUT_MS) {
      logoutAdmin();
      return false;
    }

    // تحديث وقت النشاط
    session.lastActive = now;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return true;
  } catch {
    return false;
  }
}

/**
 * تسجيل الخروج وإنهاء الجلسة
 */
export function logoutAdmin() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}

