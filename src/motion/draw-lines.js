/**
 * draw-lines.js - رسم خطوط الأبعاد والأسهم الهندسية تدريجياً
 */

import { isReducedMotion } from './reveal.js';

/**
 * توليد وسم SVG لخط بعد هندسي مع أسهم قياس وعلامات
 * @param {string} label - التسمية الهندسية
 * @param {number} width - العرض الافتراضي
 * @returns {string} - كود SVG
 */
export function createDimensionLineSvg(label = '', width = 240) {
  return `
    <div class="dimension-line-wrapper" style="display: flex; align-items: center; gap: 8px; width: 100%; max-width: ${width}px;">
      <svg class="dimension-svg" viewBox="0 0 200 16" width="100%" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
        <!-- علامة البداية العمودية -->
        <line class="draw-line" x1="2" y1="2" x2="2" y2="14" stroke="var(--violet-500)" stroke-width="1.5" />
        <!-- سهم البداية -->
        <path class="draw-line" d="M 2 8 L 8 5 L 8 11 Z" fill="var(--violet-500)" stroke="var(--violet-500)" />
        
        <!-- خط البعد الأفقي -->
        <line class="draw-line" x1="2" y1="8" x2="198" y2="8" stroke="var(--line-strong)" stroke-width="1.5" stroke-dasharray="4 2" />
        
        <!-- سهم النهاية -->
        <path class="draw-line" d="M 198 8 L 192 5 L 192 11 Z" fill="var(--violet-500)" stroke="var(--violet-500)" />
        <!-- علامة النهاية العمودية -->
        <line class="draw-line" x1="198" y1="2" x2="198" y2="14" stroke="var(--violet-500)" stroke-width="1.5" />
      </svg>
      ${label ? `<span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--violet-600); white-space: nowrap;">${label}</span>` : ''}
    </div>
  `;
}

/**
 * مراقبة وتحريك جميع عناصر draw-line عند ظهورها
 * @param {HTMLElement|Document} rootEl 
 */
export function initLineDrawing(rootEl = document) {
  const lineWrappers = rootEl.querySelectorAll('.dimension-line-wrapper:not([data-drawn])');

  if (isReducedMotion()) {
    lineWrappers.forEach((wrapper) => {
      wrapper.querySelectorAll('.draw-line').forEach((line) => line.classList.add('is-drawn'));
      wrapper.setAttribute('data-drawn', 'true');
    });
    return;
  }

  const lineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const wrapper = entry.target;
        const lines = wrapper.querySelectorAll('.draw-line');
        lines.forEach((line) => line.classList.add('is-drawn'));
        wrapper.setAttribute('data-drawn', 'true');
        lineObserver.unobserve(wrapper);
      }
    });
  }, { threshold: 0.2 });

  lineWrappers.forEach((wrapper) => lineObserver.observe(wrapper));
}

