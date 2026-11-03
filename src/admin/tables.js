/**
 * tables.js - إدارة الجداول المرجعية (Lookup Tables) في لوحة التحكم
 */

import { StorageAdapter } from '../store/adapter.js';
import { openModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

export function renderTablesManager(refreshDashboard) {
  const container = document.createElement('div');
  const tables = StorageAdapter.getTables();

  container.innerHTML = `
    <div class="admin-card-header">
      <div>
        <h2 style="font-size: 1.4rem; color: var(--ink); margin-bottom: 4px;">إدارة الجداول المرجعية</h2>
        <p style="margin: 0; font-size: 0.88rem; color: var(--ink-soft);">جداول خواص المواد ودرجات الخرسانة والتسليح التي ترتبط بها المعادلات.</p>
      </div>
      <button class="btn btn-primary btn-sm" id="btn-add-table">
        + إنشاء جدول جديد
      </button>
    </div>

    ${tables.map(table => `
      <div class="card" style="margin-bottom: 24px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
          <div>
            <h3 style="font-size: 1.15rem; color: var(--violet-800); margin-bottom: 2px;">${table.title}</h3>
            <span style="font-family: var(--font-mono); font-size: 0.82rem; color: var(--ink-muted);">معرّف الجدول: <code>${table.id}</code></span>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary btn-sm btn-add-row" data-id="${table.id}">+ إضافة صف</button>
            <button class="btn btn-danger btn-sm btn-delete-table" data-id="${table.id}">حذف الجدول</button>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                ${(table.columns || []).map(col => `
                  <th>${col.label || col.key} ${col.unit ? `[${col.unit}]` : ''}</th>
                `).join('')}
                <th style="width: 80px; text-align: left;">حذف</th>
              </tr>
            </thead>
            <tbody>
              ${(table.rows || []).map((row, rIdx) => `
                <tr>
                  ${(table.columns || []).map((col, cIdx) => `
                    <td class="${col.type === 'number' ? 'font-mono' : ''}" style="${cIdx === 0 ? 'font-weight: 600;' : ''}">
                      ${row[col.key] !== undefined ? row[col.key] : '—'}
                    </td>
                  `).join('')}
                  <td style="text-align: left;">
                    <button class="btn btn-ghost btn-sm btn-delete-row" data-table="${table.id}" data-row="${rIdx}" style="color: var(--error); padding: 2px 6px;">
                      ✕
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `).join('')}
  `;

  // زر إنشاء جدول جديد
  container.querySelector('#btn-add-table')?.addEventListener('click', () => {
    openCreateTableModal(refreshDashboard);
  });

  // إضافة صف إلى جدول
  container.querySelectorAll('.btn-add-row').forEach(btn => {
    btn.addEventListener('click', () => {
      const tableId = btn.getAttribute('data-id');
      const table = StorageAdapter.getTable(tableId);
      if (table) {
        openAddRowModal(table, refreshDashboard);
      }
    });
  });

  // حذف صف من جدول
  container.querySelectorAll('.btn-delete-row').forEach(btn => {
    btn.addEventListener('click', () => {
      const tableId = btn.getAttribute('data-table');
      const rIdx = parseInt(btn.getAttribute('data-row'), 10);
      const table = StorageAdapter.getTable(tableId);
      if (table && table.rows) {
        table.rows.splice(rIdx, 1);
        StorageAdapter.saveTable(table);
        refreshDashboard();
        showToast('تم حذف الصف بنجاح.', { type: 'info' });
      }
    });
  });

  // حذف جدول كامل
  container.querySelectorAll('.btn-delete-table').forEach(btn => {
    btn.addEventListener('click', () => {
      const tableId = btn.getAttribute('data-id');
      const table = StorageAdapter.getTable(tableId);
      if (!table) return;

      openModal({
        title: `حذف الجدول: ${table.title}`,
        content: `<p>هل أنت متأكد من حذف هذا الجدول وجميع صفوفه؟</p>`,
        confirmText: 'نعم، احذف',
        onConfirm: () => {
          StorageAdapter.deleteTable(tableId);
          refreshDashboard();
          showToast(`تم حذف الجدول "${table.title}".`, {
            type: 'info',
            duration: 10000,
            onUndo: () => {
              StorageAdapter.saveTable(table);
              refreshDashboard();
              showToast('تمت استعادة الجدول.', { type: 'success' });
            }
          });
        }
      });
    });
  });

  return container;
}

function openCreateTableModal(onSuccess) {
  const formHtml = `
    <form id="new-table-form">
      <div class="form-group">
        <label class="form-label" for="tbl-id">معرّف الجدول (ID بالإنجليزية)</label>
        <input type="text" id="tbl-id" class="form-input font-mono" placeholder="rebar_diameters" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="tbl-title">اسم الجدول بالعربية</label>
        <input type="text" id="tbl-title" class="form-input" placeholder="أقطار ومساحات حديد التسليح" required />
      </div>
      <div class="form-group">
        <label class="form-label">الأعمدة (مفتاح:اسم:وحدة مفصولة بفاصلة)</label>
        <textarea id="tbl-cols" class="form-textarea font-mono" rows="3" placeholder="bar:القطر:mm, area:المساحة:mm2, weight:الوزن:kg/m"></textarea>
        <span class="form-hint">اكتب كل عمود بصيغة <code>المفتاح:الاسم:الوحدة</code>، وافصل بين الأعمدة بفاصلة.</span>
      </div>
    </form>
  `;

  openModal({
    title: 'إنشاء جدول مرجعي جديد',
    content: formHtml,
    confirmText: 'إنشاء',
    onConfirm: () => {
      const id = document.getElementById('tbl-id').value.trim();
      const title = document.getElementById('tbl-title').value.trim();
      const rawCols = document.getElementById('tbl-cols').value.trim();

      if (!id || !title || !rawCols) {
        showToast('يرجى ملء جميع الحقول المطلوبة.', { type: 'error' });
        return;
      }

      // تحليل الأعمدة
      const columns = rawCols.split(',').map(part => {
        const [k, lbl, u] = part.split(':').map(s => s ? s.trim() : '');
        return {
          key: k,
          label: lbl || k,
          unit: u || '',
          type: 'text'
        };
      }).filter(c => c.key);

      StorageAdapter.saveTable({
        id,
        title,
        columns,
        rows: []
      });

      showToast(`تم إنشاء الجدول "${title}" بنجاح.`, { type: 'success' });
      onSuccess();
    }
  });
}

function openAddRowModal(table, onSuccess) {
  const formHtml = `
    <form id="add-row-form">
      ${(table.columns || []).map(col => `
        <div class="form-group">
          <label class="form-label" for="row-col-${col.key}">
            <span>${col.label || col.key}</span>
            ${col.unit ? `<span class="form-label-optional">[${col.unit}]</span>` : ''}
          </label>
          <input type="text" id="row-col-${col.key}" class="form-input" required />
        </div>
      `).join('')}
    </form>
  `;

  openModal({
    title: `إضافة صف إلى: ${table.title}`,
    content: formHtml,
    confirmText: 'إضافة الصف',
    onConfirm: () => {
      const newRow = {};
      (table.columns || []).forEach(col => {
        const inp = document.getElementById(`row-col-${col.key}`);
        if (inp) {
          const val = inp.value.trim();
          // تحويل للأرقام إذا كانت قيمة رقمية
          newRow[col.key] = !isNaN(Number(val)) && val !== '' ? Number(val) : val;
        }
      });

      table.rows = table.rows || [];
      table.rows.push(newRow);
      StorageAdapter.saveTable(table);

      showToast('تمت إضافة الصف بنجاح.', { type: 'success' });
      onSuccess();
    }
  });
}

