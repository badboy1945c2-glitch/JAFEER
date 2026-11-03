/**
 * countup.js - عداد الأرقام التفاعلي للإحصائيات ونتائج الحساب
 */

import { isReducedMotion } from './reveal.js';

/**
 * دالة التباطؤ (Ease Out Cubic)
 * @param {number} t (0 to 1)
 * @returns {number}
 */
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * تشغيل عداد رقمي على عنصر محدد
 * @param {HTMLElement} element 
 * @param {number} endValue 
 * @param {Object} options 
 */
export function animateCountUp(element, endValue, {
  startValue = 0,
  duration = 900,
  decimals = 0,
  suffix = '',
  prefix = ''
} = {}) {
  if (!element) return;

  const target = parseFloat(endValue) || 0;
  const start = parseFloat(startValue) || 0;

  if (isReducedMotion() || duration <= 0) {
    element.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
    return;
  }

  let startTime = null;

  function step(currentTime) {
    if (!startTime) startTime = currentTime;
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easedProgress = easeOutCubic(progress);
    const currentValue = start + (target - start) * easedProgress;

    element.textContent = `${prefix}${currentValue.toFixed(decimals)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
    }
  }

  requestAnimationFrame(step);
}

/**
 * تهيئة جميع عناصر العد التلقائي في الصفحة عند ظهورها في مجال الرؤية
 * @param {HTMLElement|Document} rootEl 
 */
export function initCountUps(rootEl = document) {
  const elements = rootEl.querySelectorAll('[data-countup]:not([data-counted])');

  if (isReducedMotion()) {
    elements.forEach((el) => {
      const target = parseFloat(el.getAttribute('data-countup')) || 0;
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      const suffix = el.getAttribute('data-suffix') || '';
      el.textContent = `${target.toFixed(decimals)}${suffix}`;
      el.setAttribute('data-counted', 'true');
    });
    return;
  }

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-countup')) || 0;
        const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        const duration = parseInt(el.getAttribute('data-duration') || '1000', 10);
        const suffix = el.getAttribute('data-suffix') || '';

        animateCountUp(el, target, { decimals, duration, suffix });
        el.setAttribute('data-counted', 'true');
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  elements.forEach((el) => countObserver.observe(el));
}

