/**
 * picker.js - نافذة منتقي الصور والوسائط (Media Picker Modal)
 * تُستخدم لاختيار أو رفع الصور داخل النماذج (غلاف المعادلة، غلاف التصنيف، الشعار)
 */

import { StorageAdapter } from '../store/adapter.js';
import { openModal } from '../components/modal.js';
import { processImageFile } from './compress.js';
import { showToast } from '../components/toast.js';

/**
 * فتح نافذة منتقي الصور
 * @param {Object} options
 * @param {string|null} [options.currentAssetId] - المعرف الحالي إن وُجد
 * @param {Function} options.onSelect - دالة رد النداء عند الاختيار { id, thumbUrl, name, alt }
 */
export async function openMediaPicker({ currentAssetId = null, onSelect } = {}) {
  const assets = await StorageAdapter.listMediaAssets();

  const pickerContainer = document.createElement('div');
  pickerContainer.style.cssText = 'display: flex; flex-direction: column; gap: 16px;';

  pickerContainer.innerHTML = `
    <!-- شريط البحث والرفع السريع -->
    <div style="display: flex; gap: 10px; align-items: center; justify-content: space-between; flex-wrap: wrap;">
      <input 
        type="text" 
        id="picker-search-input" 
        class="form-input" 
        placeholder="ابحث في الصور..." 
        style="max-width: 260px; padding: 8px 12px; font-size: 0.88rem;"
      />
      
      <label class="btn btn-primary btn-sm" style="cursor: pointer;">
        + رفع صورة جديدة
        <input type="file" id="picker-file-upload" accept="image/*" style="display: none;" />
      </label>
    </div>

    <!-- شبكة استعراض الصور -->
    <div id="picker-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 12px; max-height: 340px; overflow-y: auto; padding: 4px;">
      <!-- تُملأ ديناميكياً -->
    </div>
  `;

  let activeModal = null;

  function renderGrid(searchTerm = '') {
    const gridEl = pickerContainer.querySelector('#picker-grid');
    if (!gridEl) return;

    const filtered = assets.filter(a => {
      const q = searchTerm.toLowerCase();
      return (a.name || '').toLowerCase().includes(q) ||
             (a.alt || '').toLowerCase().includes(q) ||
             (a.tags || []).some(t => t.toLowerCase().includes(q));
    });

    if (filtered.length === 0) {
      gridEl.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 30px 10px; color: var(--ink-soft); font-size: 0.9rem;">
          لا توجد صور مطابقة. يمكنك رفع صورة جديدة بالزر أعلاه.
        </div>
      `;
      return;
    }

    gridEl.innerHTML = filtered.map(asset => {
      const isSelected = asset.id === currentAssetId;
      return `
        <div class="picker-asset-item" data-id="${asset.id}" style="
          border: 2px solid ${isSelected ? 'var(--violet-600)' : 'var(--line)'};
          border-radius: var(--radius);
          padding: 4px;
          cursor: pointer;
          background-color: #FFFFFF;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: border-color var(--transition-fast), transform var(--transition-fast);
        ">
          <div style="width: 100%; height: 80px; overflow: hidden; border-radius: 4px; background: var(--bg-soft); display: flex; align-items: center; justify-content: center;">
            <img src="${asset.thumbUrl || asset.dataUrl}" alt="${asset.alt || asset.name}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <span style="font-size: 0.72rem; color: var(--ink); margin-top: 4px; width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: center;">
            ${asset.name}
          </span>
        </div>
      `;
    }).join('');

    gridEl.querySelectorAll('.picker-asset-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-id');
        const selected = assets.find(a => a.id === id);
        if (selected && onSelect) {
          onSelect(selected);
        }
        if (activeModal) activeModal.close();
      });
    });
  }

  // ربط البحث
  pickerContainer.querySelector('#picker-search-input')?.addEventListener('input', (e) => {
    renderGrid(e.target.value.trim());
  });

  // ربط رفع صورة جديدة مباشرة من الـ Picker
  pickerContainer.querySelector('#picker-file-upload')?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showToast('جاري ضغط ومعالجة الصورة...', { type: 'info', duration: 2000 });
      const processed = await processImageFile(file);

      const newAsset = {
        id: 'asset-' + Date.now(),
        name: file.name,
        alt: file.name.replace(/\.[^/.]+$/, ''),
        mimeType: processed.mimeType,
        dataUrl: processed.dataUrl,
        thumbUrl: processed.thumbUrl,
        width: processed.width,
        height: processed.height,
        size: processed.compressedSize,
        tags: []
      };

      await StorageAdapter.saveMediaAsset(newAsset);
      assets.unshift(newAsset);
      renderGrid();
      showToast('تم رفع وضغط الصورة بنجاح!', { type: 'success' });
    } catch (err) {
      showToast(err.message || 'فشل رفع الصورة.', { type: 'error' });
    }
  });

  renderGrid();

  activeModal = openModal({
    title: 'اختيار صورة من مكتبة الوسائط',
    content: pickerContainer,
    cancelText: 'إلغاء التحديد',
    showFooter: true,
    confirmText: 'إغلاق',
    onCancel: () => {
      if (onSelect) onSelect(null);
    }
  });
}

