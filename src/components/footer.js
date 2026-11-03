/**
 * footer.js - التذييل الهندسي لموقع «المهندس الصغير»
 */
import { StorageAdapter } from '../store/adapter.js'
import { renderLogo } from './logo.js';
import { createDimensionLineSvg } from '../motion/draw-lines.js';

export function createFooter() {
  const footerEl = document.createElement('footer');
  footerEl.className = 'site-footer';
  footerEl.innerHTML = `
    <div class="container">
      <div style="margin-bottom: 24px;">
        ${createDimensionLineSvg('نهاية المخطط // FOOTER', 240)}
      </div>

      <div class="site-footer-grid">
        <!-- عمود العلامة والوصف -->
        <div class="footer-col footer-col-brand">
          ${renderLogo({ showTagline: true, size: 'normal' })}
          <p style="font-size: 0.88rem; color: var(--ink-soft); margin-top: 14px; line-height: 1.7; max-width: 320px;">
            ${StorageAdapter.getSettings().footerText || 'موقع وحاسبة هندسية عربية مخصصة للمهندس والباحث المدني.'}
          </p>
        </div>

        <!-- عمود التصفح السريع -->
        <div class="footer-col">
          <h4 class="footer-title">الأقسام الرئيسية</h4>
          <ul class="footer-links">
            <li><a href="#/library">مكتبة المعادلات</a></li>
            <li><a href="#/tables">الجداول المرجعية</a></li>
            <li><a href="#/sources">المصادر والأكواد</a></li>
            <li><a href="#/about">عن الموقع والمنهجية</a></li>
          </ul>
        </div>

        <!-- عمود التصنيفات الهندسية -->
        <div class="footer-col">
          <h4 class="footer-title">التصنيفات</h4>
          <ul class="footer-links">
            <li><a href="#/library?category=cat-structures">المنشآت والعزوم</a></li>
            <li><a href="#/library?category=cat-concrete">الخرسانة المسلحة</a></li>
            <li><a href="#/library?category=cat-soil">ميكانيكا التربة</a></li>
            <li><a href="#/library?category=cat-survey">المساحة والطرق</a></li>
          </ul>
        </div>

        <!-- عمود الإدارة والتنويه -->
        <div class="footer-col">
          <h4 class="footer-title">الإدارة والتحكم</h4>
          <ul class="footer-links">
            <li><a href="#/admin" style="font-weight: 600; color: var(--violet-600);">دخول لوحة التحكم</a></li>
            <li><a href="#/design" style="color: var(--ink-soft);">دليل نظام التصميم</a></li>
          </ul>
          <div style="margin-top: 16px; padding: 10px 12px; background: var(--bg-soft); border: 1px solid var(--line); border-radius: var(--radius-sm); font-size: 0.78rem; color: var(--ink-soft); line-height: 1.6;">
            <strong>تنويه هندسي:</strong> جميع النتائج لأغراض تعليمية واسترشادية، ويجب دائماً الرجوع للأكواد المعتمدة قبل الاعتماد الإنشائي.
          </div>
        </div>
      </div>

      <!-- حقوق الموقع والسنة -->
      <div class="site-footer-bottom">
        <div style="font-size: 0.85rem; color: var(--ink-soft);">
          © ${new Date().getFullYear()} موقع <strong>المهندس الصغير</strong>. جميع الحقوق محفوظة ومفتوحة المصدر.
        </div>
        <div style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--violet-600);">
          v2.0 // STATIC-FIRST ARCHITECTURE
        </div>
      </div>
    </div>
  `;

  return footerEl;
}

