/**
 * sources.js - إدارة المصادر والمراجع الهندسية في لوحة التحكم
 */

import { StorageAdapter } from '../store/adapter.js';
import { openModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

export function renderSourcesManager(refreshDashboard) {
  const container = document.createElement('div');
  const sources = StorageAdapter.getSources();
  const formulas = StorageAdapter.getFormulas();

  container.innerHTML = `
    <div class="admin-card-header">
      <div>
        <h2 style="font-size: 1.4rem; color: var(--ink); margin-bottom: 4px;">إدارة المراجع والأكواد</h2>
        <p style="margin: 0; font-size: 0.88rem; color: var(--ink-soft);">إضافة وتعديل الكتب والمراجع والأكواد المعتمدة في الموقع.</p>
      </div>
      <button class="btn btn-primary btn-sm" id="btn-add-source">
        + إضافة مصدر جديد
      </button>
    </div>

    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>المعرّف</th>
            <th>عنوان الكتاب / الكود</th>
            <th>المؤلف / الجهة</th>
            <th>الطبعة / السنة</th>
            <th>الصفحات أو البند</th>
            <th>المعادلات المرتبطة</th>
            <th style="text-align: left;">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          ${sources.map(src => {
            const linked = formulas.filter(f => f.sourceIds && f.sourceIds.includes(src.id));
            return `
              <tr>
                <td><code style="color: var(--violet-700);">${src.id}</code></td>
                <td style="font-weight: 600;">${src.title}</td>
                <td>${src.author || '—'}</td>
                <td style="font-size: 0.85rem; color: var(--ink-soft);">${src.edition || '—'}</td>
                <td style="font-size: 0.85rem; color: var(--violet-800);">${src.pages || '—'}</td>
                <td>
                  <span class="badge ${linked.length > 0 ? 'badge-published' : 'badge-draft'}">
                    ${linked.length} معادلة
                  </span>
                </td>
                <td style="text-align: left;">
                  <button class="btn btn-secondary btn-sm btn-edit-src" data-id="${src.id}">تعديل</button>
                  <button class="btn btn-danger btn-sm btn-delete-src" data-id="${src.id}">حذف</button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;

  // إضافة مصدر جديد
  container.querySelector('#btn-add-source')?.addEventListener('click', () => {
    openSourceFormModal(null, refreshDashboard);
  });

  // تعديل مصدر
  container.querySelectorAll('.btn-edit-src').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const src = StorageAdapter.getSource(id);
      openSourceFormModal(src, refreshDashboard);
    });
  });

  // حذف مصدر
  container.querySelectorAll('.btn-delete-src').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const src = StorageAdapter.getSource(id);
      if (!src) return;

      const linked = formulas.filter(f => f.sourceIds && f.sourceIds.includes(id));
      if (linked.length > 0) {
        const titles = linked.map(f => `"${f.title}"`).join('، ');
        showToast(`لا يمكن حذف المصدر لأنه مرتبط بـ ${linked.length} معادلة: ${titles}`, { type: 'error' });
        return;
      }

      openModal({
        title: `حذف المصدر: ${src.title}`,
        content: `<p>هل أنت متأكد من حذف هذا المصدر من قاعدة البيانات؟</p>`,
        confirmText: 'نعم، احذف',
        onConfirm: () => {
          try {
            StorageAdapter.deleteSource(id);
            refreshDashboard();
            showToast(`تم حذف المصدر "${src.title}".`, {
              type: 'info',
              duration: 10000,
              onUndo: () => {
                StorageAdapter.saveSource(src);
                refreshDashboard();
                showToast('تمت استعادة المصدر بنجاح.', { type: 'success' });
              }
            });
          } catch (err) {
            showToast(err.message, { type: 'error' });
          }
        }
      });
    });
  });

  return container;
}

function openSourceFormModal(existingSrc, onSuccess) {
  const isEdit = Boolean(existingSrc);
  const formHtml = `
    <form id="src-form">
      <div class="form-group">
        <label class="form-label" for="src-id-inp">معرّف المصدر (ID)</label>
        <input type="text" id="src-id-inp" class="form-input" value="${existingSrc ? existingSrc.id : 'src-'}" ${isEdit ? 'disabled' : ''} required />
      </div>
      <div class="form-group">
        <label class="form-label" for="src-title-inp">عنوان الكتاب أو الكود</label>
        <input type="text" id="src-title-inp" class="form-input" value="${existingSrc ? existingSrc.title : ''}" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="src-author-inp">المؤلف أو الجهة المصدرة</label>
        <input type="text" id="src-author-inp" class="form-input" value="${existingSrc ? existingSrc.author || '' : ''}" />
      </div>
      <div class="form-group">
        <label class="form-label" for="src-edition-inp">الطبعة أو سنة الإصدار</label>
        <input type="text" id="src-edition-inp" class="form-input" value="${existingSrc ? existingSrc.edition || '' : ''}" />
      </div>
      <div class="form-group">
        <label class="form-label" for="src-pages-inp">الصفحات أو رقم البند</label>
        <input type="text" id="src-pages-inp" class="form-input" value="${existingSrc ? existingSrc.pages || '' : ''}" />
      </div>
    </form>
  `;

  openModal({
    title: isEdit ? 'تعديل المصدر المرجعي' : 'إضافة مصدر مرجعي جديد',
    content: formHtml,
    confirmText: 'حفظ',
    onConfirm: () => {
      const id = document.getElementById('src-id-inp').value.trim();
      const title = document.getElementById('src-title-inp').value.trim();
      const author = document.getElementById('src-author-inp').value.trim();
      const edition = document.getElementById('src-edition-inp').value.trim();
      const pages = document.getElementById('src-pages-inp').value.trim();

      if (!id || !title) {
        showToast('يرجى ملء الحقول المطلوبة.', { type: 'error' });
        return;
      }

      StorageAdapter.saveSource({
        ...(existingSrc || {}),
        id,
        title,
        author,
        edition,
        pages
      });

      showToast(`تم حفظ المصدر "${title}" بنجاح.`, { type: 'success' });
      onSuccess();
    }
  });
}

