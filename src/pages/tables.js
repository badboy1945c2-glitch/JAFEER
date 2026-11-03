/**
 * tables.js - صفحة عرض الجداول المرجعية الهندسية
 */

import { StorageAdapter } from '../store/adapter.js';
import { createDimensionLineSvg } from '../motion/draw-lines.js';

export function renderTablesPage({ navigate }) {
  const container = document.createElement('div');
  container.className = 'container page-container';
  container.style.padding = '40px 20px 100px';

  const tables = StorageAdapter.getTables();
  const constants = StorageAdapter.getConstants();

  container.innerHTML = `
    <!-- ترويسة الصفحة -->
    <div style="border-bottom: 1px solid var(--line); padding-bottom: 24px; margin-bottom: 40px;">
      <div class="badge badge-category" style="margin-bottom: 10px;">المراجع والمعايير</div>
      <h1 style="font-size: 2rem; margin-bottom: 8px;">الجداول والثوابت المرجعية</h1>
      <p style="margin: 0; font-size: 0.95rem; color: var(--ink-soft);">
        جداول خواص المواد والمعايير الهندسية المعمول بها، بالإضافة إلى الثوابت الفيزيائية التي تعتمد عليها حاسبات الموقع.
      </p>
    </div>

    <!-- قسم الثوابت الرياضية والهندسية -->
    <section style="margin-bottom: 50px;">
      <div style="margin-bottom: 16px;">
        ${createDimensionLineSvg('الثوابت الفيزيائية والرياضية', 320)}
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
        ${constants.map(c => `
          <div class="card">
            <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 1.05rem; font-weight: 600; color: var(--ink);">${c.label || c.key}</span>
              <code style="font-size: 1.25rem; font-weight: 700; color: var(--violet-700);">${c.key} = ${c.value} ${c.unit || ''}</code>
            </div>
            <p style="font-size: 0.85rem; color: var(--ink-soft); margin: 0;">${c.description || 'ثابت معتمد في حسابات النظام.'}</p>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- قسم الجداول المرجعية -->
    <section>
      <div style="margin-bottom: 16px;">
        ${createDimensionLineSvg('الجداول المرجعية للمواد (Lookup Tables)', 380)}
      </div>
      
      ${tables.map(table => `
        <div class="card" style="margin-bottom: 30px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
            <div>
              <h3 style="font-size: 1.2rem; color: var(--violet-800); margin-bottom: 4px;">${table.title}</h3>
              <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--ink-muted);">معرف الجدول: ${table.id}</span>
            </div>
            <span class="badge badge-published">${(table.rows || []).length} صفوف</span>
          </div>

          <div class="table-wrapper">
            <table class="table">
              <thead>
                <tr>
                  ${(table.columns || []).map(col => `
                    <th>${col.label || col.key} ${col.unit ? `[${col.unit}]` : ''}</th>
                  `).join('')}
                </tr>
              </thead>
              <tbody>
                ${(table.rows || []).map(row => `
                  <tr>
                    ${(table.columns || []).map((col, idx) => `
                      <td class="${col.type === 'number' ? 'font-mono' : ''}" style="${idx === 0 ? 'font-weight: 600;' : ''}">
                        ${row[col.key] !== undefined ? row[col.key] : '—'}
                      </td>
                    `).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `).join('')}
    </section>
  `;

  return container;
}

