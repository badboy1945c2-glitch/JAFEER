/**
 * header.js - الترويسة الرئيسية وشريط التصفح مع القائمة المنزلقة للجوال
 */

import { renderLogo } from './logo.js';

export function createHeader() {
  const headerEl = document.createElement('header');
  headerEl.className = 'site-header';
  headerEl.innerHTML = `
    <div class="container site-header-inner">
      <!-- الشعار -->
      <div class="site-header-brand">
        ${renderLogo({ showTagline: false, size: 'normal' })}
      </div>

      <!-- روابط التصفح للشاشات المتوسطة والكبيرة -->
      <nav class="site-nav" aria-label="التنقل الرئيسي">
        <a href="#/" class="nav-link" data-route="/">الرئيسية</a>
        <a href="#/library" class="nav-link" data-route="/library">المعادلات</a>
        <a href="#/tables" class="nav-link" data-route="/tables">الجداول المرجعية</a>
        <a href="#/sources" class="nav-link" data-route="/sources">المصادر</a>
        <a href="#/soil" class="nav-link" data-route="/soil">ميكانيك التربة</a>
        <a href="#/concrete" class="nav-link" data-route="/concrete">الكونكريت</a>
        <a href="#/about" class="nav-link" data-route="/about">عن الموقع</a>
      </nav>

      <!-- الأزرار الجانبية وقائمة الجوال -->
      <div class="site-header-actions">
        <a href="#/admin" class="btn btn-secondary btn-sm admin-nav-btn" title="لوحة التحكم">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span class="admin-btn-text">لوحة التحكم</span>
        </a>

        <!-- زر القائمة المنزلقة للجوال -->
        <button class="mobile-menu-toggle" aria-label="فتح القائمة الرئيسية" aria-expanded="false">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- القائمة المنزلقة للجوال (Mobile Drawer) -->
    <div class="mobile-drawer-backdrop" aria-hidden="true"></div>
    <div class="mobile-drawer" role="dialog" aria-modal="true" aria-label="القائمة الرئيسية">
      <div class="mobile-drawer-header">
        ${renderLogo({ showTagline: false, size: 'normal' })}
        <button class="mobile-drawer-close" aria-label="إغلاق القائمة">✕</button>
      </div>
      <nav class="mobile-drawer-nav">
        <a href="#/" class="mobile-nav-link" data-route="/">الرئيسية</a>
        <a href="#/library" class="mobile-nav-link" data-route="/library">مكتبة المعادلات</a>
        <a href="#/tables" class="mobile-nav-link" data-route="/tables">الجداول المرجعية</a>
        <a href="#/sources" class="mobile-nav-link" data-route="/sources">المصادر والأكواد</a>
        <a href="#/soil" class="mobile-nav-link" data-route="/soil">ميكانيك التربة</a>
                <a href="#/concrete" class="mobile-nav-link" data-route="/concrete">الكونكريت</a>
        <a href="#/about" class="mobile-nav-link" data-route="/about">عن المهندس الصغير</a>
        <div style="border-top: 1px solid var(--line); margin: 12px 0;"></div>
        <a href="#/admin" class="mobile-nav-link" data-route="/admin" style="color: var(--violet-700); font-weight: 600;">
          لوحة التحكم
        </a>
        <a href="#/design" class="mobile-nav-link" data-route="/design" style="color: var(--ink-soft); font-size: 0.85rem;">
          دليل المكونات (وضع التطوير)
        </a>
      </nav>
    </div>
  `;

  // ربط سلوك القائمة المنزلقة
  const toggleBtn = headerEl.querySelector('.mobile-menu-toggle');
  const closeBtn = headerEl.querySelector('.mobile-drawer-close');
  const backdrop = headerEl.querySelector('.mobile-drawer-backdrop');
  const drawer = headerEl.querySelector('.mobile-drawer');

  const openDrawer = () => {
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    backdrop.setAttribute('aria-hidden', 'false');
  };

  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    backdrop.setAttribute('aria-hidden', 'true');
  };

  toggleBtn.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  headerEl.querySelectorAll('.mobile-nav-link').forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  // تحديث الروابط النشطة عند تغيير المسار
  const updateActiveLinks = (currentPath) => {
    const navLinks = headerEl.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks.forEach((link) => {
      const route = link.getAttribute('data-route');
      const isActive = route === '/' ? currentPath === '/' : currentPath.startsWith(route);
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  window.addEventListener('app:route-changed', (e) => {
    updateActiveLinks(e.detail.path);
  });

  // تحديد أولي
  const initialPath = window.location.hash.replace(/^#/, '').split('?')[0] || '/';
  updateActiveLinks(initialPath.startsWith('/') ? initialPath : '/' + initialPath);

  return headerEl;
}

