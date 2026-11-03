/**
 * scroll-progress.js - شريط تقدم رفيع بنفسجي في أعلى الشاشة عند التمرير
 */

import { isReducedMotion } from './reveal.js';

export function initScrollProgressBar() {
  if (isReducedMotion()) return;

  let progressBar = document.querySelector('.scroll-progress-bar');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.appendChild(progressBar);
  }

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${progress}%`;
      ticking = false;
    });
  }, { passive: true });
}

