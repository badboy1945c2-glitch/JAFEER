/**
 * categories.js - إدارة التصنيفات الهندسية في لوحة التحكم
 */

import { StorageAdapter } from '../store/adapter.js';
import { openModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import { openMediaPicker } from '../media/picker.js';

export function renderCategoriesManager(refreshDashboard) {
  const container = document.createElement('div');
  const categories = StorageAdapter.getCategories();
  const formulas = StorageAdapter.getFormulas();

  container.innerHTML = `
    <div class="admin-card-header">
      <div>
        <h2 style="font-size: 1.4rem; color: var(--ink); margin-bottom: 4px;">إدارة التصنيفات الهندسية</h2>
        <p style="margin: 0; font-size: 0.88rem; color: var(--ink-soft);">إضافة وتعديل وترتيب الأقسام التخصصية في الموقع.</p>
      </div>
      <button class="btn btn-primary btn-sm" id="btn-add-category">
        + إضافة تصنيف جديد
      </button>
    </div>

    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th style="width: 60px;">الترتيب</th>
            <th>معرّف التصنيف</th>
            <th>اسم التصنيف</th>
            <th>الوصف</th>
            <th>عدد المعادلات</th>
            <th style="text-align: left;">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          ${categories.map(cat => {
            const count = formulas.filter(f => f.categoryId === cat.id).length;
            return `
              <tr>
                <td style="font-family: var(--font-mono); font-weight: 600;">${cat.order || 0}</td>
                <td><code style="color: var(--violet-700);">${cat.id}</code></td>
                <td style="font-weight: 600;">${cat.title}</td>
                <td style="color: var(--ink-soft); font-size: 0.85rem;">${cat.description || '—'}</td>
                <td><span class="badge badge-category">${count}</span></td>
                <td style="text-align: left;">
                  <button class="btn btn-secondary btn-sm btn-edit-cat" data-id="${cat.id}">تعديل</button>
                  <button class="btn btn-danger btn-sm btn-delete-cat" data-id="${cat.id}">حذف</button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;

  // إضافة تصنيف جديد
  container.querySelector('#btn-add-category')?.addEventListener('click', () => {
    openCategoryFormModal(null, refreshDashboard);
  });

  // تعديل تصنيف
  container.querySelectorAll('.btn-edit-cat').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const cat = StorageAdapter.getCategory(id);
      openCategoryFormModal(cat, refreshDashboard);
    });
  });

  // حذف تصنيف
  container.querySelectorAll('.btn-delete-cat').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const cat = StorageAdapter.getCategory(id);
      if (!cat) return;

      const linked = formulas.filter(f => f.categoryId === id);
      if (linked.length > 0) {
        showToast(`لا يمكن حذف التصنيف لأنه يحتوي على ${linked.length} معادلة. يرجى نقلها أولاً.`, { type: 'error' });
        return;
      }

      openModal({
        title: `حذف تصنيف: ${cat.title}`,
        content: `<p>هل أنت متأكد من حذف هذا التصنيف؟ لا يمكن التراجع عن هذه الخطوة إلا خلال 10 ثوانٍ.</p>`,
        confirmText: 'نعم، احذف',
        onConfirm: () => {
          StorageAdapter.deleteCategory(id);
          refreshDashboard();
          showToast(`تم حذف التصنيف "${cat.title}".`, {
            type: 'info',
            duration: 10000,
            onUndo: () => {
              StorageAdapter.saveCategory(cat);
              refreshDashboard();
              showToast('تمت استعادة التصنيف بنجاح.', { type: 'success' });
            }
          });
        }
      });
    });
  });

  return container;
}

function openCategoryFormModal(existingCat, onSuccess) {
  const isEdit = Boolean(existingCat);
  let coverAssetId = existingCat ? existingCat.coverAssetId || null : null;

  const formContainer = document.createElement('div');

  function renderForm() {
    formContainer.innerHTML = `
      <form id="cat-form">
        <div class="form-group">
          <label class="form-label" for="cat-id-inp">المعرّف الفريد (ID بالإنجليزية)</label>
          <input type="text" id="cat-id-inp" class="form-input" value="${existingCat ? existingCat.id : 'cat-'}" ${isEdit ? 'disabled' : ''} required />
        </div>
        <div class="form-group">
          <label class="form-label" for="cat-title-inp">اسم التصنيف (بالعربية)</label>
          <input type="text" id="cat-title-inp" class="form-input" value="${existingCat ? existingCat.title : ''}" required />
        </div>
        <div class="form-group">
          <label class="form-label" for="cat-desc-inp">الوصف المختصر</label>
          <textarea id="cat-desc-inp" class="form-textarea" rows="2">${existingCat ? existingCat.description || '' : ''}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label" for="cat-order-inp">ترتيب الظهور (رقم)</label>
          <input type="number" id="cat-order-inp" class="form-input" value="${existingCat ? existingCat.order || 1 : 5}" />
        </div>
        <div class="form-group">
          <label class="form-label">صورة غلاف التصنيف</label>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div id="cat-cover-preview" style="width: 80px; height: 60px; border-radius: var(--radius); border: 1px dashed var(--line); display: flex; align-items: center; justify-content: center; overflow: hidden; background: var(--bg-soft);">
              ${coverAssetId
                ? '<span style="font-size: 0.72rem; color: var(--violet-700);">جاري التحميل...</span>'
                : '<span style="font-size: 0.72rem; color: var(--ink-soft);">بدون صورة</span>'
              }
            </div>
            <button type="button" class="btn btn-secondary btn-sm" id="cat-pick-cover">اختر صورة</button>
            ${coverAssetId ? '<button type="button" class="btn btn-ghost btn-sm" id="cat-remove-cover" style="color: var(--error);">إزالة</button>' : ''}
          </div>
        </div>
      </form>
    `;

    // تحميل معاينة صورة الغلاف
    if (coverAssetId) {
      (async () => {
        try {
          const asset = await StorageAdapter.getMediaAsset(coverAssetId);
          const previewEl = formContainer.querySelector('#cat-cover-preview');
          if (asset && asset.thumbUrl && previewEl) {
            previewEl.innerHTML = `<img src="${asset.thumbUrl}" alt="غلاف" style="width: 100%; height: 100%; object-fit: cover;" />`;
          }
        } catch { /* تجاهل */ }
      })();
    }

    // اختيار صورة
    formContainer.querySelector('#cat-pick-cover')?.addEventListener('click', () => {
      openMediaPicker({
        currentAssetId: coverAssetId,
        onSelect: (asset) => {
          coverAssetId = asset ? asset.id : null;
          renderForm();
        }
      });
    });

    // إزالة صورة
    formContainer.querySelector('#cat-remove-cover')?.addEventListener('click', () => {
      coverAssetId = null;
      renderForm();
    });
  }

  renderForm();

  openModal({
    title: isEdit ? 'تعديل التصنيف' : 'إضافة تصنيف جديد',
    content: formContainer,
    confirmText: 'حفظ',
    onConfirm: () => {
      const id = formContainer.querySelector('#cat-id-inp').value.trim();
      const title = formContainer.querySelector('#cat-title-inp').value.trim();
      const description = formContainer.querySelector('#cat-desc-inp').value.trim();
      const order = parseInt(formContainer.querySelector('#cat-order-inp').value, 10) || 1;

      if (!id || !title) {
        showToast('يرجى ملء الحقول المطلوبة.', { type: 'error' });
        return;
      }

      StorageAdapter.saveCategory({
        ...(existingCat || {}),
        id,
        title,
        description,
        order,
        coverAssetId
      });

      showToast(`تم حفظ التصنيف "${title}" بنجاح.`, { type: 'success' });
      onSuccess();
    }
  });
}

