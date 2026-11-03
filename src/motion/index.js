/**
 * index.js - نقطة التصدير والتهيئة المركزية لنظام الحركات
 */

import { initScrollReveal, isReducedMotion, revealImmediately } from './reveal.js';
import { initCountUps, animateCountUp } from './countup.js';
import { initLineDrawing, createDimensionLineSvg } from './draw-lines.js';
import { initHeroParallax } from './parallax.js';
import { initScrollProgressBar } from './scroll-progress.js';

/**
 * تهيئة كافة مؤثرات الحركة على الصفحة أو الحاوية المحددة
 * @param {HTMLElement|Document} rootEl 
 */
export function initAllMotions(rootEl = document) {
  initScrollReveal(rootEl);
  initCountUps(rootEl);
  initLineDrawing(rootEl);
  initScrollProgressBar();
}

export {
  initScrollReveal,
  revealImmediately,
  isReducedMotion,
  initCountUps,
  animateCountUp,
  initLineDrawing,
  createDimensionLineSvg,
  initHeroParallax,
  initScrollProgressBar
};

