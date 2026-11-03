/**
 * parallax.js - تحريك هادئ جداً لشبكة الرسم الهندسي بخلفية الهيرو مع حركة الماوس
 * يعمل فقط على الشاشات الكبيرة وفقط عند عدم تفعيل تقليل الحركة.
 */

import { isReducedMotion } from './reveal.js';

export function initHeroParallax(heroEl) {
  if (!heroEl || isReducedMotion()) return;

  // فحص الشاشة: لا داعي للمحاكاة على شاشات اللمس الصغيرة
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const gridSvg = heroEl.querySelector('.hero-blueprint-bg');
  if (!gridSvg) return;

  let ticking = false;

  heroEl.addEventListener('mousemove', (e) => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const rect = heroEl.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // حركة هادئة ومحدودة جداً لا تتجاوز 8px
      const moveX = (x / rect.width) * 10;
      const moveY = (y / rect.height) * 10;

      gridSvg.style.transform = `translate(${moveX}px, ${moveY}px)`;
      ticking = false;
    });
  });

  heroEl.addEventListener('mouseleave', () => {
    gridSvg.style.transform = 'translate(0px, 0px)';
    gridSvg.style.transition = 'transform 600ms cubic-bezier(.2, .7, .2, 1)';
    setTimeout(() => {
      gridSvg.style.transition = '';
    }, 600);
  });
}

