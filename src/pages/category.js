/**
 * category.js - صفحة التصنيف الهندسي المستقلة
 */

import { StorageAdapter } from '../store/adapter.js';
import { createDimensionLineSvg } from '../motion/draw-lines.js';

export function renderCategoryPage({ params, navigate }) {
  const container = document.createElement('div');
  container.className = 'container page-container';
  container.style.padding = '40px 20px 100px';

  const categoryId = params.id;
  const category = StorageAdapter.getCategory(categoryId);

  if (!category) {
    container.innerHTML = `
      <div class="empty-state" style="margin-top: 40px;">
        <h3 class="empty-state-title">التصنيف غير موجود</h3>
        <p class="empty-state-desc">لم نتمكن من العثور على التصنيف المطلوب: <code>${categoryId}</code>.</p>
        <button class="btn btn-primary" onclick="window.location.hash = '#/library'">العودة للمكتبة</button>
      </div>
    `;
    return container;
  }

  const formulas = StorageAdapter.getFormulas().filter(f => f.categoryId === categoryId);

  container.innerHTML = `
    <!-- ترويسة التصنيف -->
    <div style="border-bottom: 1px solid var(--line); padding-bottom: 24px; margin-bottom: 30px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
        <a href="#/library" class="btn btn-ghost btn-sm" style="padding: 4px 8px;">← جميع التصنيفات</a>
        <span style="color: var(--line-strong);">/</span>
        <span class="badge badge-category">قسم تخصصي</span>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 14px;">
        <div>
          <h1 style="font-size: 2.1rem; margin-bottom: 8px;">${category.title}</h1>
          <p style="margin: 0; font-size: 1rem; color: var(--ink-soft); max-width: 650px;">
            ${category.description || 'تصفح جميع القوانين والمعادلات الحسابية الخاصة بهذا القسم.'}
          </p>
        </div>
        <div style="font-family: var(--font-mono); font-size: 1rem; color: var(--violet-700); font-weight: 600;">
          ${formulas.length} معادلة
        </div>
      </div>
    </div>

    <!-- شبكة معادلات هذا التصنيف -->
    ${formulas.length > 0 ? `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
        ${formulas.map(f => `
          <div class="card card-interactive" onclick="window.location.hash = '#/calc/${f.id}'">
            <div class="card-header">
              <span class="badge badge-category">${category.title}</span>
              ${f.isSample ? '<span class="badge badge-sample">تجريبي</span>' : ''}
            </div>
            <h3 class="card-title">${f.title}</h3>
            <p class="card-desc">${f.description || 'معادلة حسابية موثقة.'}</p>
            <div class="card-footer">
              <span style="font-family: var(--font-mono); color: var(--violet-600); font-weight: 500;">
                ${f.outputs && f.outputs[0] ? `${f.outputs[0].key} = ${f.outputs[0].expression}` : ''}
              </span>
              <span style="color: var(--ink-soft); font-size: 0.82rem;">${(f.inputs || []).length} مدخلات</span>
            </div>
          </div>
        `).join('')}
      </div>
    ` : `
      <div class="empty-state">
        <h4 class="empty-state-title">لا توجد معادلات في هذا القسم بعد</h4>
        <p class="empty-state-desc">لم تتم إضافة معادلات تابعة لقسم "${category.title}" حتى الآن. يمكنك إضافة معادلة من لوحة التحكم.</p>
        <a href="#/library" class="btn btn-secondary btn-sm">العودة للمكتبة</a>
      </div>
    `}
  `;

  return container;
}

