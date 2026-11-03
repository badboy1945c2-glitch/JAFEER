/**
 * sources.js - صفحة استعراض المصادر والمراجع الهندسية
 */

import { StorageAdapter } from '../store/adapter.js';
import { createDimensionLineSvg } from '../motion/draw-lines.js';

export function renderSourcesPage({ navigate }) {
  const container = document.createElement('div');
  container.className = 'container page-container';
  container.style.padding = '40px 20px 100px';

  const sources = StorageAdapter.getSources();
  const formulas = StorageAdapter.getFormulas();

  container.innerHTML = `
    <!-- ترويسة الصفحة -->
    <div style="border-bottom: 1px solid var(--line); padding-bottom: 24px; margin-bottom: 40px;">
      <div class="badge badge-category" style="margin-bottom: 10px;">التوثيق العلمي</div>
      <h1 style="font-size: 2rem; margin-bottom: 8px;">المصادر والمراجع والأكواد الهندسية</h1>
      <p style="margin: 0; font-size: 0.95rem; color: var(--ink-soft);">
        قائمة الكتب الأكاديمية والأكواد الإنشائية المعتمدة التي تستند إليها معادلات وحسابات «المهندس الصغير».
      </p>
    </div>

    <!-- شبكة بطاقات المصادر -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
      ${sources.map(src => {
        const linkedFormulas = formulas.filter(f => f.sourceIds && f.sourceIds.includes(src.id));
        return `
          <div class="card">
            <div class="card-header">
              <span class="badge badge-category">${src.edition || 'مرجع معتمد'}</span>
              <span style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--ink-muted);">${src.id}</span>
            </div>
            <h3 class="card-title">${src.title}</h3>
            <div style="font-size: 0.88rem; color: var(--ink-soft); margin-bottom: 12px;">
              المؤلف / الجهة: <strong>${src.author || 'غير محدد'}</strong>
            </div>
            ${src.pages ? `
              <div style="font-size: 0.85rem; color: var(--violet-800); background-color: var(--violet-50); border: 1px solid var(--violet-100); padding: 8px 12px; border-radius: var(--radius-sm); margin-bottom: 16px;">
                ${src.pages}
              </div>
            ` : ''}

            <div class="card-footer" style="flex-direction: column; align-items: flex-start; gap: 8px;">
              <span style="font-size: 0.82rem; font-weight: 600; color: var(--ink);">المعادلات المرتبطة بهذا المرجع (${linkedFormulas.length}):</span>
              <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                ${linkedFormulas.length > 0 ? linkedFormulas.map(f => `
                  <a href="#/calc/${f.id}" class="badge badge-draft" style="text-decoration: none;">${f.title}</a>
                `).join('') : '<span style="font-size: 0.8rem; color: var(--ink-muted);">لا توجد معادلات مرتبطة حالياً.</span>'}
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  return container;
}

