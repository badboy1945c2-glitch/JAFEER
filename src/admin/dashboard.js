/**
 * dashboard.js - لوحة التحكم الشاملة لموقع «المهندس الصغير»
 */

import { StorageAdapter } from '../store/adapter.js';
import { showToast } from '../components/toast.js';
import {
  isAuthenticated,
  hasAdminPin,
  setAdminPin,
  verifyAdminPin,
  logoutAdmin
} from './auth.js';

import { renderCategoriesManager } from './categories.js';
import { renderSourcesManager } from './sources.js';
import { renderConstantsManager } from './constants.js';
import { renderTablesManager } from './tables.js';
import { renderMediaLibrary } from './media.js';
import { renderAppearanceManager, renderHomeSectionsManager } from './appearance.js';
import { renderBackupManager } from './backup.js';
import { renderSoilAdmin } from './soil.js';
import { renderFormulasManager } from './formulas.js';

export function renderAdminDashboard({ navigate }) {
  const container = document.createElement('div');
  container.className = 'page-container';

  // حالة القسم النشط
  let currentTab = 'overview';

  async function renderView() {
    container.innerHTML = '';

    // 1. فحص تسجيل الدخول ورمز الـ PIN
    if (!isAuthenticated()) {
      container.appendChild(renderPinLoginView(() => renderView()));
      return;
    }

    // 2. الهيكل الرئيسي للوحة التحكم
    const layout = document.createElement('div');
    layout.className = 'admin-layout';

    // الشريط الجانبي
    const sidebar = document.createElement('aside');
    sidebar.className = 'admin-sidebar';
    sidebar.innerHTML = `
      <div class="admin-sidebar-header">
        <div style="font-weight: 700; font-size: 1.1rem; color: var(--violet-700);">لوحة المشرف</div>
        <div style="font-size: 0.78rem; color: var(--ink-soft);">المهندس الصغير v2.0</div>
      </div>

      <nav class="admin-sidebar-nav">
        <a href="javascript:void(0)" class="admin-nav-item ${currentTab === 'overview' ? 'is-active' : ''}" data-tab="overview">
          <span>نظرة عامة</span>
        </a>
        <a href="javascript:void(0)" class="admin-nav-item ${currentTab === 'formulas' ? 'is-active' : ''}" data-tab="formulas">
          <span>المعادلات (${StorageAdapter.getFormulas().length})</span>
        </a>
        <a href="javascript:void(0)" class="admin-nav-item ${currentTab === 'categories' ? 'is-active' : ''}" data-tab="categories">
          <span>التصنيفات (${StorageAdapter.getCategories().length})</span>
        </a>
        <a href="javascript:void(0)" class="admin-nav-item ${currentTab === 'sources' ? 'is-active' : ''}" data-tab="sources">
          <span>المصادر (${StorageAdapter.getSources().length})</span>
        </a>
        <a href="javascript:void(0)" class="admin-nav-item ${currentTab === 'constants' ? 'is-active' : ''}" data-tab="constants">
          <span>الثوابت المركزية (${StorageAdapter.getConstants().length})</span>
        </a>
        <a href="javascript:void(0)" class="admin-nav-item ${currentTab === 'tables' ? 'is-active' : ''}" data-tab="tables">
          <span>الجداول المرجعية (${StorageAdapter.getTables().length})</span>
        </a>
        <a href="javascript:void(0)" class="admin-nav-item ${currentTab === 'media' ? 'is-active' : ''}" data-tab="media">
          <span>مكتبة الوسائط والصور</span>
        </a>
                <a href="javascript:void(0)" class="admin-nav-item ${currentTab === 'appearance' ? 'is-active' : ''}" data-tab="appearance">
          <span>مظهر الموقع</span>
        </a>
        <a href="javascript:void(0)" class="admin-nav-item ${currentTab === 'home' ? 'is-active' : ''}" data-tab="home">
                <a href="javascript:void(0)" class="admin-nav-item ${currentTab === 'backup' ? 'is-active' : ''}" data-tab="backup">
          <span>النسخ الاحتياطي</span>
                  <a href="javascript:void(0)" class="admin-nav-item ${currentTab === 'soil' ? 'is-active' : ''}" data-tab="soil">
          <span>وحدة التربة</span>
        </a>
        </a>
          <span>أقسام الرئيسية</span>
        </a>
      </nav>

      <div class="admin-sidebar-footer">
        <a href="#/" class="btn btn-secondary btn-sm" style="width: 100%; margin-bottom: 8px;">
          العودة للموقع
        </a>
        <button class="btn btn-ghost btn-sm" id="btn-admin-logout" style="width: 100%; color: var(--error);">
          تسجيل الخروج
        </button>
      </div>
    `;

    // ربط تبديل التبويبات في الشريط الجانبي
    sidebar.querySelectorAll('.admin-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        currentTab = item.getAttribute('data-tab');
        renderView();
      });
    });

    sidebar.querySelector('#btn-admin-logout')?.addEventListener('click', () => {
      logoutAdmin();
      showToast('تم تسجيل الخروج بنجاح.', { type: 'info' });
      renderView();
    });

    // المساحة الرئيسية للوحة
    const main = document.createElement('main');
    main.className = 'admin-main';

    // تنبيه المعمارية الثابتة الدائم (قسم 3 من الخطة)
    const disclaimerBanner = document.createElement('div');
    disclaimerBanner.style.cssText = `
      padding: 14px 18px; 
      background-color: var(--violet-50); 
      border: 1px solid var(--violet-100); 
      border-right: 4px solid var(--violet-600); 
      border-radius: var(--radius); 
      margin-bottom: 24px;
      font-size: 0.88rem;
      color: var(--ink-soft);
      line-height: 1.6;
    `;
    disclaimerBanner.innerHTML = `
      <strong style="color: var(--violet-900);">تنويه عن لوحة التحكم:</strong> 
      الموقع بدون سيرفر مدفوع (Static Site). التغييرات تُحفظ في هذا المتصفح فوراً. ولنشرها للزوار، يُستخدم زر «نشر التغييرات» ثم رفع الملفات إلى GitHub.
    `;
    main.appendChild(disclaimerBanner);

    // عرض التبويب المختار
    if (currentTab === 'overview') {
      main.appendChild(renderOverviewTab(() => renderView()));
    } else if (currentTab === 'formulas') {
      main.appendChild(renderFormulasManager(() => renderView()));
    } else if (currentTab === 'categories') {
      main.appendChild(renderCategoriesManager(() => renderView()));
    } else if (currentTab === 'sources') {
      main.appendChild(renderSourcesManager(() => renderView()));
    } else if (currentTab === 'constants') {
      main.appendChild(renderConstantsManager(() => renderView()));
    } else if (currentTab === 'tables') {
      main.appendChild(renderTablesManager(() => renderView()));
       } else if (currentTab === 'media') {
      main.appendChild(await renderMediaLibrary(() => renderView()));
    } else if (currentTab === 'appearance') {
      main.appendChild(renderAppearanceManager(() => renderView()));
    } else if (currentTab === 'home') {
      main.appendChild(renderHomeSectionsManager(() => renderView()));
    } else if (currentTab === 'home') {
      main.appendChild(renderHomeSectionsManager(() => renderView()));
    } else if (currentTab === 'backup') {
      main.appendChild(renderBackupManager(() => renderView()));
     } else if (currentTab === 'soil') {
      main.appendChild(renderSoilAdmin());
    }
  

    layout.appendChild(sidebar);
    layout.appendChild(main);
    container.appendChild(layout);
  }

  renderView();
  return container;
}

/**
 * تبويب النظرة العامة والإحصائيات
 */
function renderOverviewTab(refresh) {
  const div = document.createElement('div');
  const formulas = StorageAdapter.getFormulas();
  const categories = StorageAdapter.getCategories();
  const sources = StorageAdapter.getSources();
  const constants = StorageAdapter.getConstants();
  const tables = StorageAdapter.getTables();

  div.innerHTML = `
    <div class="admin-card-header">
      <div>
        <h2 style="font-size: 1.4rem; color: var(--ink); margin-bottom: 4px;">لوحة النظرة العامة</h2>
        <p style="margin: 0; font-size: 0.88rem; color: var(--ink-soft);">ملخص حالة النظام والمحتوى المخزن محلياً.</p>
      </div>
      <div>
        <span class="badge badge-published">الحالة: متصل محلياً</span>
      </div>
    </div>

    <!-- شبكة بطاقات الإحصائيات -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 30px;">
      <div class="card" style="padding: 18px;">
        <span style="font-size: 0.8rem; color: var(--ink-soft);">إجمالي المعادلات</span>
        <div style="font-size: 2rem; font-weight: 700; font-family: var(--font-mono); color: var(--violet-700);">${formulas.length}</div>
      </div>
      <div class="card" style="padding: 18px;">
        <span style="font-size: 0.8rem; color: var(--ink-soft);">التصنيفات</span>
        <div style="font-size: 2rem; font-weight: 700; font-family: var(--font-mono); color: var(--violet-700);">${categories.length}</div>
      </div>
      <div class="card" style="padding: 18px;">
        <span style="font-size: 0.8rem; color: var(--ink-soft);">المصادر المرجعية</span>
        <div style="font-size: 2rem; font-weight: 700; font-family: var(--font-mono); color: var(--violet-700);">${sources.length}</div>
      </div>
      <div class="card" style="padding: 18px;">
        <span style="font-size: 0.8rem; color: var(--ink-soft);">الثوابت المسجلة</span>
        <div style="font-size: 2rem; font-weight: 700; font-family: var(--font-mono); color: var(--violet-700);">${constants.length}</div>
      </div>
      <div class="card" style="padding: 18px;">
        <span style="font-size: 0.8rem; color: var(--ink-soft);">الجداول المرجعية</span>
        <div style="font-size: 2rem; font-weight: 700; font-family: var(--font-mono); color: var(--violet-700);">${tables.length}</div>
      </div>
    </div>

    <!-- بطاقة سريعة للمعادلات المتاحة -->
    <div class="card">
      <div class="card-header">
        <h3 style="font-size: 1.1rem; color: var(--ink);">أحدث المعادلات المسجلة في النظام</h3>
        <span class="badge badge-category">${formulas.length} معادلة</span>
      </div>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>المعرّف</th>
              <th>عنوان المعادلة</th>
              <th>التصنيف</th>
              <th>عدد المدخلات</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            ${formulas.map(f => {
              const cat = categories.find(c => c.id === f.categoryId);
              return `
                <tr>
                  <td><code style="color: var(--violet-700);">${f.id}</code></td>
                  <td style="font-weight: 600;">${f.title}</td>
                  <td><span class="badge badge-category">${cat ? cat.title : 'عام'}</span></td>
                  <td>${(f.inputs || []).length}</td>
                  <td>
                    ${f.isSample ? '<span class="badge badge-sample">تجريبي</span>' : '<span class="badge badge-published">منشور</span>'}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  return div;
}

/**
 * شاشة التحقق برمز الـ PIN أو إنشائه لأول مرة
 */
function renderPinLoginView(onSuccess) {
  const container = document.createElement('div');
  container.className = 'container';
  container.style.padding = '40px 20px 80px';

  const isFirstTime = !hasAdminPin();
  let enteredPin = '';

  container.innerHTML = `
    <div class="pin-screen-container">
      <div style="display: flex; justify-content: center; margin-bottom: 16px;">
        <div style="width: 52px; height: 52px; border-radius: 50%; background-color: var(--violet-50); border: 1px solid var(--violet-200); display: flex; align-items: center; justify-content: center; color: var(--violet-700);">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
      </div>

      <h2 style="font-size: 1.4rem; color: var(--ink); margin-bottom: 6px;">
        ${isFirstTime ? 'إنشاء رمز PIN المشرف' : 'الدخول إلى لوحة التحكم'}
      </h2>
      <p style="font-size: 0.88rem; color: var(--ink-soft); margin-bottom: 20px;">
        ${isFirstTime 
          ? 'اختر رمز PIN مكون من 4 إلى 8 أرقام لحماية لوحة التحكم لأول مرة.' 
          : 'أدخل رمز PIN للمتابعة. تنتهي الجلسة تلقائياً بعد 30 دقيقة خمول.'}
      </p>

      <!-- نقاط عرض الـ PIN -->
      <div class="pin-display-dots">
        <div class="pin-dot" id="dot-0"></div>
        <div class="pin-dot" id="dot-1"></div>
        <div class="pin-dot" id="dot-2"></div>
        <div class="pin-dot" id="dot-3"></div>
      </div>

      <div style="margin-bottom: 20px;">
        <input 
          type="password" 
          id="pin-direct-input" 
          class="form-input font-mono" 
          placeholder="أو اكتب الرمز هنا..." 
          style="text-align: center; font-size: 1.3rem; letter-spacing: 8px; max-width: 260px; margin: 0 auto;"
          maxlength="8"
        />
      </div>

      <!-- لوحة الأرقام الرقمية -->
      <div class="pin-keypad">
        ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => `
          <button class="pin-key btn-num" data-num="${num}">${num}</button>
        `).join('')}
        <button class="pin-key" id="btn-pin-clear" style="font-size: 0.9rem; color: var(--error);">مسح</button>
        <button class="pin-key btn-num" data-num="0">0</button>
        <button class="pin-key" id="btn-pin-submit" style="background-color: var(--violet-600); color: #fff; font-size: 1.1rem;">↵</button>
      </div>

      <div style="margin-top: 24px;">
        <a href="#/" class="btn btn-ghost btn-sm" style="color: var(--ink-soft);">← العودة للموقع</a>
      </div>
    </div>
  `;

  const inputEl = container.querySelector('#pin-direct-input');

  function updateDots() {
    const len = enteredPin.length;
    for (let i = 0; i < 4; i++) {
      const dot = container.querySelector(`#dot-${i}`);
      if (dot) dot.classList.toggle('is-filled', i < len);
    }
    if (inputEl) inputEl.value = enteredPin;
  }

  async function trySubmit() {
    if (enteredPin.length < 4) {
      showToast('يجب ألا يقل رمز PIN عن 4 أرقام.', { type: 'error' });
      return;
    }

    if (isFirstTime) {
      await setAdminPin(enteredPin);
      showToast('تم إنشاء رمز PIN وحفظه بنجاح!', { type: 'success' });
      onSuccess();
    } else {
      const valid = await verifyAdminPin(enteredPin);
      if (valid) {
        showToast('تم تسجيل الدخول بنجاح.', { type: 'success' });
        onSuccess();
      } else {
        showToast('رمز PIN غير صحيح.', { type: 'error' });
        enteredPin = '';
        updateDots();
      }
    }
  }

  container.querySelectorAll('.btn-num').forEach(btn => {
    btn.addEventListener('click', () => {
      if (enteredPin.length < 8) {
        enteredPin += btn.getAttribute('data-num');
        updateDots();
        if (!isFirstTime && enteredPin.length === 4) {
          trySubmit();
        }
      }
    });
  });

  container.querySelector('#btn-pin-clear')?.addEventListener('click', () => {
    enteredPin = '';
    updateDots();
  });

  container.querySelector('#btn-pin-submit')?.addEventListener('click', () => {
    trySubmit();
  });

  inputEl?.addEventListener('input', (e) => {
    enteredPin = e.target.value.replace(/[^0-9]/g, '');
    updateDots();
  });

  inputEl?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      trySubmit();
    }
  });

  return container;
}
