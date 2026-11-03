/**
 * media.js - إدارة مكتبة الوسائط في لوحة التحكم لموقع «المهندس الصغير»
 */

import { StorageAdapter } from '../store/adapter.js';
import { processImageFile } from '../media/compress.js';
import { openModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

export async function renderMediaLibrary(refreshDashboard) {
  const container = document.createElement('div');
  const assets = await StorageAdapter.listMediaAssets();
  const storageUsageBytes = await StorageAdapter.getMediaStorageUsage();
  const formulas = StorageAdapter.getFormulas();
  const categories = StorageAdapter.getCategories();
  const settings = StorageAdapter.getSettings();

  // تحويل البايت إلى تنسيق مقروء (KB أو MB)
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 كيلوبايت';
    const k = 1024;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  /**
   * فحص الأماكن التي تستخدم هذه الصورة
   * @param {string} assetId 
   * @returns {string[]}
   */
  const findAssetUsages = (assetId) => {
    const usages = [];
    formulas.forEach(f => {
      if (f.coverAssetId === assetId) usages.push(`غلاف معادلة: "${f.title}"`);
      if (f.galleryAssetIds && f.galleryAssetIds.includes(assetId)) usages.push(`معرض معادلة: "${f.title}"`);
    });
    categories.forEach(c => {
      if (c.coverAssetId === assetId) usages.push(`غلاف تصنيف: "${c.title}"`);
    });
    if (settings.logoAssetId === assetId) usages.push('شعار الموقع الأساسي');
    if (settings.faviconAssetId === assetId) usages.push('أيقونة الموقع Favicon');
    if (settings.heroBackgroundAssetIds && settings.heroBackgroundAssetIds.includes(assetId)) usages.push('خلفية الهيرو');
    return usages;
  };

  container.innerHTML = `
    <div class="admin-card-header">
      <div>
        <h2 style="font-size: 1.4rem; color: var(--ink); margin-bottom: 4px;">مكتبة الوسائط والصور</h2>
        <p style="margin: 0; font-size: 0.88rem; color: var(--ink-soft);">
          رفع وضغط وتخزين الصور محلياً في IndexedDB مع إنشاء نسخ مصغرة تلقائية.
        </p>
      </div>

      <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
        <span style="font-size: 0.82rem; font-family: var(--font-mono); color: var(--violet-700); background-color: var(--violet-50); border: 1px solid var(--violet-100); padding: 4px 10px; border-radius: var(--radius-sm);">
          المساحة المستخدمة: ${formatBytes(storageUsageBytes)}
        </span>
        <label class="btn btn-primary btn-sm" style="cursor: pointer;">
          + رفع صورة جديدة
          <input type="file" id="media-upload-input" accept="image/*" style="display: none;" />
        </label>
      </div>
    </div>

    <!-- منطقة السحب والإفلات Drop Zone -->
    <div id="media-drop-zone" style="
      border: 2px dashed var(--line-strong); 
      border-radius: var(--radius-lg); 
      padding: 32px 20px; 
      text-align: center; 
      background-color: #FFFFFF; 
      margin-bottom: 24px;
      cursor: pointer;
      transition: background-color var(--transition-fast), border-color var(--transition-fast);
    ">
      <div style="color: var(--violet-600); margin-bottom: 8px;">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
      </div>
      <div style="font-weight: 600; color: var(--ink); margin-bottom: 4px;">اسحب الصور وأفلتها هنا، أو اضغط للاختيار من جهازك</div>
      <div style="font-size: 0.8rem; color: var(--ink-soft);">
        الصيغ المدعومة: JPG, PNG, WebP, SVG (الحد الأقصى 8MB - يتم الضغط تلقائياً إلى 1600px WebP)
      </div>
    </div>

    <!-- شريط البحث -->
    <div style="margin-bottom: 20px; max-width: 400px;">
      <input type="text" id="media-search" class="form-input" placeholder="ابحث باسم الصورة أو الوصف البديل..." />
    </div>

    <!-- شبكة استعراض الوسائط -->
    <div id="media-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 18px;">
      <!-- تُملأ ديناميكياً -->
    </div>
  `;

  function renderGrid(searchTerm = '') {
    const gridEl = container.querySelector('#media-grid');
    if (!gridEl) return;

    const filtered = assets.filter(a => {
      const q = searchTerm.toLowerCase();
      return (a.name || '').toLowerCase().includes(q) ||
             (a.alt || '').toLowerCase().includes(q) ||
             (a.tags || []).some(t => t.toLowerCase().includes(q));
    });

    if (filtered.length === 0) {
      gridEl.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <h4 class="empty-state-title">لا توجد صور مخزنة</h4>
          <p class="empty-state-desc">قم برفع أول رسم هندسي أو صورة إلى مكتبة الوسائط أعلاه.</p>
        </div>
      `;
      return;
    }

    gridEl.innerHTML = filtered.map(asset => {
      const usages = findAssetUsages(asset.id);
      return `
        <div class="card" style="padding: 12px; display: flex; flex-direction: column;">
          <div style="
            width: 100%; 
            height: 140px; 
            border-radius: var(--radius-sm); 
            overflow: hidden; 
            background: var(--bg-soft); 
            display: flex; 
            align-items: center; 
            justify-content: center;
            border: 1px solid var(--line);
            margin-bottom: 10px;
          ">
            <img src="${asset.thumbUrl || asset.dataUrl}" alt="${asset.alt || asset.name}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>

          <div style="font-weight: 600; font-size: 0.9rem; color: var(--ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 2px;">
            ${asset.name}
          </div>

          <div style="font-size: 0.78rem; color: var(--ink-soft); margin-bottom: 8px;">
            الحجم: <strong>${formatBytes(asset.size || 0)}</strong> ${asset.width ? `(${asset.width}×${asset.height})` : ''}
          </div>

          <div style="margin-bottom: 12px; font-size: 0.75rem;">
            ${usages.length > 0 
              ? `<span class="badge badge-published">مستخدمة في ${usages.length} مواضع</span>` 
              : '<span class="badge badge-draft">غير مستخدمة</span>'}
          </div>

          <div style="display: flex; gap: 6px; margin-top: auto; border-top: 1px solid var(--line); padding-top: 10px;">
            <button class="btn btn-secondary btn-sm btn-edit-asset" data-id="${asset.id}" style="flex-grow: 1;">تفاصيل</button>
            <button class="btn btn-danger btn-sm btn-delete-asset" data-id="${asset.id}">حذف</button>
          </div>
        </div>
      `;
    }).join('');

    // تفاصيل وتعديل الصورة
    gridEl.querySelectorAll('.btn-edit-asset').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const asset = assets.find(a => a.id === id);
        if (asset) openAssetDetailsModal(asset, () => refreshDashboard());
      });
    });

    // حذف الصورة بأمان
    gridEl.querySelectorAll('.btn-delete-asset').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const asset = assets.find(a => a.id === id);
        if (!asset) return;

        const usages = findAssetUsages(id);
        let confirmMsg = `<p>هل أنت متأكد من حذف الصورة <strong>${asset.name}</strong> نهائياً من التخزين؟</p>`;
        if (usages.length > 0) {
          confirmMsg = `
            <div style="padding: 12px; background: var(--warn-bg); border: 1px solid #F5DEB3; border-radius: var(--radius-sm); margin-bottom: 12px; color: var(--warn);">
              ⚠️ <strong>تحذير:</strong> هذه الصورة مستخدمة حالياً في: <br/>${usages.join('<br/>')}
            </div>
            <p>سيؤدي حذفها إلى استبدالها برسم هندسي بديل تلقائياً في تلك الصفحات.</p>
          `;
        }

        openModal({
          title: `حذف الصورة: ${asset.name}`,
          content: confirmMsg,
          confirmText: 'نعم، احذف نهائياً',
          onConfirm: async () => {
            await StorageAdapter.deleteMediaAsset(id);
            showToast(`تم حذف الصورة "${asset.name}".`, { type: 'info' });
              refreshDashboard();
          }
        });
      });
    });
  }

  // معالجة رفع الملف
  async function handleFileUpload(file) {
    if (!file) return;
    try {
      showToast('جاري ضغط ومعالجة الصورة في المتصفح...', { type: 'info', duration: 2500 });
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
      showToast(`تم ضغط الصورة وحفظها بنجاح (${formatBytes(processed.compressedSize)})!`, { type: 'success' });
      refreshDashboard();
    } catch (err) {
      showToast(err.message || 'فشل رفع وضغط الصورة.', { type: 'error' });
    }
  }

  const uploadInput = container.querySelector('#media-upload-input');
  uploadInput?.addEventListener('change', (e) => {
    handleFileUpload(e.target.files?.[0]);
  });

  // معالجة السحب والإفلات Drop Zone
  const dropZone = container.querySelector('#media-drop-zone');
  if (dropZone) {
    dropZone.addEventListener('click', () => uploadInput?.click());
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.style.backgroundColor = 'var(--violet-50)';
      dropZone.style.borderColor = 'var(--violet-600)';
    });
    dropZone.addEventListener('dragleave', () => {
      dropZone.style.backgroundColor = '#FFFFFF';
      dropZone.style.borderColor = 'var(--line-strong)';
    });
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.style.backgroundColor = '#FFFFFF';
      dropZone.style.borderColor = 'var(--line-strong)';
      const file = e.dataTransfer?.files?.[0];
      if (file) handleFileUpload(file);
    });
  }

  // البحث
  container.querySelector('#media-search')?.addEventListener('input', (e) => {
    renderGrid(e.target.value.trim());
  });

  renderGrid();
  return container;
}

function openAssetDetailsModal(asset, onSuccess) {
  const formHtml = `
    <div style="display: flex; gap: 16px; margin-bottom: 16px;">
      <div style="width: 120px; height: 100px; border-radius: var(--radius-sm); overflow: hidden; background: var(--bg-soft); border: 1px solid var(--line); flex-shrink: 0;">
        <img src="${asset.thumbUrl || asset.dataUrl}" alt="${asset.alt}" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>
      <div>
        <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--violet-700); margin-bottom: 4px;">المعرف: ${asset.id}</div>
        <div style="font-size: 0.82rem; color: var(--ink-soft);">الأبعاد: ${asset.width || '—'} × ${asset.height || '—'} بكسل</div>
        <div style="font-size: 0.82rem; color: var(--ink-soft);">الصيغة: ${asset.mimeType}</div>
      </div>
    </div>

    <form id="asset-edit-form">
      <div class="form-group">
        <label class="form-label" for="asset-name-inp">اسم الصورة</label>
        <input type="text" id="asset-name-inp" class="form-input" value="${asset.name || ''}" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="asset-alt-inp">النص البديل Alt (إلزامي للوصولية)</label>
        <input type="text" id="asset-alt-inp" class="form-input" value="${asset.alt || ''}" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="asset-tags-inp">الوسوم (مفصولة بفواصل)</label>
        <input type="text" id="asset-tags-inp" class="form-input" value="${(asset.tags || []).join(', ')}" />
      </div>
    </form>
  `;

  openModal({
    title: 'تفاصيل وتعديل بيانات الصورة',
    content: formHtml,
    confirmText: 'حفظ التعديلات',
    onConfirm: async () => {
      const name = document.getElementById('asset-name-inp').value.trim();
      const alt = document.getElementById('asset-alt-inp').value.trim();
      const rawTags = document.getElementById('asset-tags-inp').value.trim();
      const tags = rawTags.split(',').map(t => t.trim()).filter(Boolean);

      if (!name || !alt) {
        showToast('اسم الصورة والنص البديل كلاهما مطلوب.', { type: 'error' });
        return;
      }

      await StorageAdapter.saveMediaAsset({
        ...asset,
        name,
        alt,
        tags
      });

      showToast('تم تحديث بيانات الصورة بنجاح.', { type: 'success' });
      onSuccess();
    }
  });
}

