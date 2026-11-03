/**
 * asset-image.js - عرض صور المكتبة للزوار
 * الاستخدام: ضع في HTML العنصر <img data-asset-id="..."> ثم نادِ hydrateAssetImages(العنصر)
 * إذا لم توجد الصورة يُزال الوسم ويبقى الرسم البديل خلفه.
 */

import { StorageAdapter } from '../store/adapter.js';

export async function hydrateAssetImages(root) {
  const imgs = root.querySelectorAll('img[data-asset-id]');
    for (const img of imgs) {
    if (img.dataset.hydrated) continue;
    img.dataset.hydrated = '1';
    const id = img.getAttribute('data-asset-id');
    try {
      const asset = await StorageAdapter.getMediaAsset(id);
      if (asset && (asset.thumbUrl || asset.dataUrl)) {
        img.src = asset.thumbUrl || asset.dataUrl;
        img.alt = asset.alt || asset.name || '';
        img.closest('.asset-cover')?.classList.add('is-loaded');
      } else {
        img.remove(); // صورة محذوفة: يبقى البديل
      }
    } catch {
      img.remove();
    }
  }
}

// يرجع HTML لصورة الغلاف مع بديل هندسي مرسوم (SVG) إذا لا توجد صورة
export function coverHtml(assetId) {
  const fallback = `
    <svg viewBox="0 0 200 100" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="200" height="100" fill="#F5F1FE"/>
      <path d="M0 20H200M0 40H200M0 60H200M0 80H200M40 0V100M80 0V100M120 0V100M160 0V100" stroke="#D8C9F8" stroke-width="0.6"/>
      <path d="M30 75L100 25L170 75Z" fill="none" stroke="#7B4FE0" stroke-width="1.2"/>
    </svg>`;
  return `
    <div class="asset-cover" style="height: 130px; margin: -4px -4px 12px; border-radius: var(--radius-sm); overflow: hidden; background: var(--violet-50); position: relative;">
      ${fallback}
      ${assetId ? `<img data-asset-id="${assetId}" alt="" loading="lazy" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; background: var(--violet-50);" />` : ''}
    </div>`;
}