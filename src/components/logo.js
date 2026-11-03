/**
 * logo.js - الشعار الأصلي لموقع «المهندس الصغير»
 * 
 * يتضمن:
 * 1. أيقونة SVG هندسية أصلية (مسطرة مثلث هندسية + خوذة ومربع قياس بنفسجي)
 * 2. حركة خفيفة عند التحويم (Subtle hover animation)
 * 3. اسم الموقع بخط Reem Kufi
 */
import { StorageAdapter } from '../store/adapter.js';
export function renderLogo({ showTagline = false, size = 'normal' } = {}) {
  const iconSize = size === 'large' ? 44 : 36;
  const fontSize = size === 'large' ? '1.5rem' : '1.25rem';
  const settings = StorageAdapter.getSettings();
  return `
    <a href="#/" class="brand-logo" aria-label="المهندس الصغير - الصفحة الرئيسية">
      <div class="brand-icon-wrapper" style="width: ${iconSize}px; height: ${iconSize}px;">
         ${settings.logoAssetId ? `<img data-asset-id="${settings.logoAssetId}" alt="شعار الموقع" style="width:100%; height:100%; object-fit:contain; border-radius:8px;" />` : `
        <svg class="brand-svg" viewBox="0 0 40 40" width="${iconSize}" height="${iconSize}" xmlns="http://www.w3.org/2000/svg">
                `}
          <!-- خلفية الحاوية الهندسية -->
          <rect class="brand-rect" width="40" height="40" rx="8" fill="var(--violet-600)" />
          
          <!-- مسطرة المثلث الهندسي (Set square) -->
          <polygon class="brand-triangle" points="10,31 31,31 10,10" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linejoin="round"/>
          <polygon points="14,27 25,27 14,16" fill="none" stroke="var(--violet-200)" stroke-width="1.5" stroke-linejoin="round"/>
          
          <!-- درجات وتدريجات المسطرة -->
          <line x1="15" y1="27" x2="15" y2="24" stroke="var(--violet-200)" stroke-width="1.2"/>
          <line x1="19" y1="27" x2="19" y2="24" stroke="var(--violet-200)" stroke-width="1.2"/>
          <line x1="23" y1="27" x2="23" y2="24" stroke="var(--violet-200)" stroke-width="1.2"/>
          
          <!-- مربع القياس الدقيق -->
          <rect class="brand-dot" x="25" y="10" width="5" height="5" rx="1" fill="#FFFFFF"/>
        </svg>
      </div>
      <div class="brand-text-col">
        <span class="brand-name" style="font-size: ${fontSize};"${settings.siteName || 'المهندس الصغير'}</span>
        ${showTagline ? `<span class="brand-tagline"${settings.tagline || 'حاسبات ومعادلات هندسية'}</span>` : ''}
      </div>
    </a>
  `;
}

