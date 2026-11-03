/**
 * constants.js - إدارة الثوابت الهندسية والفيزيائية في لوحة التحكم
 */

import { StorageAdapter } from '../store/adapter.js';
import { openModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

export function renderConstantsManager(refreshDashboard) {
  const container = document.createElement('div');
  const constants = StorageAdapter.getConstants();

  container.innerHTML = `
    <div class="admin-card-header">
      <div>
        <h2 style="font-size: 1.4rem; color: var(--ink); margin-bottom: 4px;">إدارة الثوابت المركزية</h2>
        <p style="margin: 0; font-size: 0.88rem; color: var(--ink-soft);">الثوابت الفيزيائية والرياضية التي تُتاح لكافة المعادلات باسمها مباشرة.</p>
      </div>
      <button class="btn btn-primary btn-sm" id="btn-add-constant">
        + إضافة ثابت جديد
      </button>
    </div>

    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>رمز الثابت</th>
            <th>اسم الثابت</th>
            <th>القيمة الرقمية</th>
            <th>الوحدة</th>
            <th>الوصف</th>
            <th style="text-align: left;">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          ${constants.map(c => `
            <tr>
              <td><code style="font-size: 1rem; color: var(--violet-700); font-weight: 700;">${c.key}</code></td>
              <td style="font-weight: 600;">${c.label || c.key}</td>
              <td class="font-mono" style="font-weight: 600;">${c.value}</td>
              <td class="font-mono" style="color: var(--violet-800);">${c.unit || '—'}</td>
              <td style="color: var(--ink-soft); font-size: 0.85rem;">${c.description || '—'}</td>
              <td style="text-align: left;">
                <button class="btn btn-secondary btn-sm btn-edit-con" data-key="${c.key}">تعديل</button>
                <button class="btn btn-danger btn-sm btn-delete-con" data-key="${c.key}">حذف</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  // إضافة ثابت
  container.querySelector('#btn-add-constant')?.addEventListener('click', () => {
    openConstantFormModal(null, refreshDashboard);
  });

  // تعديل ثابت
  container.querySelectorAll('.btn-edit-con').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-key');
      const con = StorageAdapter.getConstant(key);
      openConstantFormModal(con, refreshDashboard);
    });
  });

  // حذف ثابت
  container.querySelectorAll('.btn-delete-con').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-key');
      const con = StorageAdapter.getConstant(key);
      if (!con) return;

      openModal({
        title: `حذف الثابت: ${con.key}`,
        content: `<p>هل أنت متأكد من حذف الثابت <code>${con.key}</code>؟ قد يؤثر ذلك على المعادلات التي تستخدمه في صيغتها.</p>`,
        confirmText: 'نعم، احذف',
        onConfirm: () => {
          StorageAdapter.deleteConstant(key);
          refreshDashboard();
          showToast(`تم حذف الثابت "${key}".`, {
            type: 'info',
            duration: 10000,
            onUndo: () => {
              StorageAdapter.saveConstant(con);
              refreshDashboard();
              showToast('تمت استعادة الثابت.', { type: 'success' });
            }
          });
        }
      });
    });
  });

  return container;
}

function openConstantFormModal(existingCon, onSuccess) {
  const isEdit = Boolean(existingCon);
  const formHtml = `
    <form id="con-form">
      <div class="form-group">
        <label class="form-label" for="con-key-inp">رمز الثابت بالإنجليزية (مثل: g, rho, E_steel)</label>
        <input type="text" id="con-key-inp" class="form-input font-mono" value="${existingCon ? existingCon.key : ''}" ${isEdit ? 'disabled' : ''} required />
      </div>
      <div class="form-group">
        <label class="form-label" for="con-label-inp">الاسم بالعربية</label>
        <input type="text" id="con-label-inp" class="form-input" value="${existingCon ? existingCon.label || '' : ''}" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="con-val-inp">القيمة الرقمية</label>
        <input type="number" step="any" id="con-val-inp" class="form-input font-mono" value="${existingCon ? existingCon.value : ''}" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="con-unit-inp">وحدة القياس (اختياري)</label>
        <input type="text" id="con-unit-inp" class="form-input font-mono" value="${existingCon ? existingCon.unit || '' : ''}" />
      </div>
      <div class="form-group">
        <label class="form-label" for="con-desc-inp">الوصف والتوضيح</label>
        <textarea id="con-desc-inp" class="form-textarea" rows="2">${existingCon ? existingCon.description || '' : ''}</textarea>
      </div>
    </form>
  `;

  openModal({
    title: isEdit ? 'تعديل الثابت المركزي' : 'إضافة ثابت مركزي جديد',
    content: formHtml,
    confirmText: 'حفظ',
    onConfirm: () => {
      const key = document.getElementById('con-key-inp').value.trim();
      const label = document.getElementById('con-label-inp').value.trim();
      const value = parseFloat(document.getElementById('con-val-inp').value);
      const unit = document.getElementById('con-unit-inp').value.trim();
      const description = document.getElementById('con-desc-inp').value.trim();

      if (!key || isNaN(value)) {
        showToast('يرجى التأكد من كتابة رمز الثابت وقيمة رقمية صحيحة.', { type: 'error' });
        return;
      }

      StorageAdapter.saveConstant({
        key,
        label,
        value,
        unit,
        description
      });

      showToast(`تم حفظ الثابت "${key}" بنجاح.`, { type: 'success' });
      onSuccess();
    }
  });
}

