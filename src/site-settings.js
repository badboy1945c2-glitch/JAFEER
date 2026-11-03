/**
 * site-settings.js - تطبيق إعدادات المظهر على الموقع (المرحلة 12)
 */
import { StorageAdapter } from './store/adapter.js';
import { hydrateAssetImages } from './media/asset-image.js';

// لوحات ألوان محددة مسبقاً (حتى ما ينكسر التباين)
export const COLOR_PRESETS = {
  violet: { label: 'بنفسجي (الافتراضي)', vars: { 50: '#F5F1FE', 100: '#EAE2FC', 200: '#D8C9F8', 300: '#B9A1F0', 500: '#7B4FE0', 600: '#6636CC', 700: '#522AA6', 800: '#3F1F8A' } },
  blue:   { label: 'أزرق', vars: { 50: '#EEF4FE', 100: '#DCE8FD', 200: '#BCD3FB', 300: '#8FB5F6', 500: '#3F7DE8', 600: '#1F5FCC', 700: '#184BA3', 800: '#133B80' } },
  green:  { label: 'أخضر زمردي', vars: { 50: '#EDF8F3', 100: '#D6F0E4', 200: '#AEE0C9', 300: '#7ACBA8', 500: '#2FA877', 600: '#1B8A5E', 700: '#156F4C', 800: '#115A3E' } },
  orange: { label: 'برتقالي محروق', vars: { 50: '#FEF3EC', 100: '#FCE4D3', 200: '#F8C9A7', 300: '#F2A672', 500: '#E0782F', 600: '#C25E1A', 700: '#9C4A14', 800: '#7C3B10' } },
  crimson:{ label: 'عنابي', vars: { 50: '#FDF0F2', 100: '#FADCE1', 200: '#F4B7C1', 300: '#EC8798', 500: '#D44862', 600: '#B52C48', 700: '#912239', 800: '#741B2E' } }
};

export function applySiteSettings() {
  const s = StorageAdapter.getSettings();
  const preset = COLOR_PRESETS[s.colorPreset] || COLOR_PRESETS.violet;
  Object.entries(preset.vars).forEach(([k, v]) => document.documentElement.style.setProperty(`--violet-${k}`, v));
  document.title = s.siteName || 'المهندس الصغير';
  document.body.classList.toggle('animations-disabled', s.animationsEnabled === false);
  applyFavicon(s.faviconAssetId);
}

async function applyFavicon(assetId) {
  let link = document.querySelector('link[rel="icon"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  if (!link.dataset.default) link.dataset.default = link.getAttribute('href') || '';
  let asset = null;
  if (assetId) {
    try { asset = await StorageAdapter.getMediaAsset(assetId); } catch { /* تجاهل */ }
  }
  if (asset) {
    link.href = asset.thumbUrl || asset.dataUrl;
    link.type = asset.mimeType || 'image/png';
  } else {
    link.href = link.dataset.default;
  }
}

// يملأ تلقائياً أي <img data-asset-id> يظهر في الصفحة (شعار، خلفية الهيرو...)
export function watchAssetImages() {
  let queued = false;
  const run = () => { queued = false; hydrateAssetImages(document.body); };
  new MutationObserver(() => {
    if (!queued) { queued = true; requestAnimationFrame(run); }
  }).observe(document.body, { childList: true, subtree: true });
  run();
}