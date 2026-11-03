/**
 * reveal.js - محرك ظهور العناصر التلقائي عند التمرير باستخدام IntersectionObserver
 * 
 * القواعد:
 * - فحص prefers-reduced-motion وإلغاء الحركة عند تفعيله
 * - تنفيذ الظهور مرة واحدة لكل عنصر
 * - دعم الظهور المتتابع (stagger) للعناصر الفرعية بفارق 60ms
 */

/**
 * فحص ما إذا كان المستخدم يفضل تقليل الحركة
 * @returns {boolean}
 */
export function isReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
         document.body.classList.contains('animations-disabled');
}

let observer = null;

/**
 * تهيئة مراقب التمرير للعناصر في الصفحة
 * @param {HTMLElement|Document} rootEl
 */
export function initScrollReveal(rootEl = document) {
  if (isReducedMotion()) {
    // إذا كان تقليل الحركة مفعلاً، نظهر كل العناصر فوراً بدون حركات
    const allRevealElements = rootEl.querySelectorAll('.reveal, .stagger-container');
    allRevealElements.forEach((el) => {
      el.classList.add('is-revealed');
      el.querySelectorAll('.reveal-item').forEach((item) => {
        item.style.opacity = '1';
        item.style.transform = 'none';
      });
    });
    return;
  }

  if (!observer) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('is-revealed');
          
          // إذا كان العنصر حاوية متتابعة، نرتب عناصرها بفارق زمني
          if (el.classList.contains('stagger-container')) {
            const items = el.querySelectorAll('.reveal-item');
            items.forEach((item, idx) => {
              item.style.setProperty('--stagger-idx', idx);
            });
          }

          // نتوقف عن مراقبته بعد ظهوره لتقليل استهلاك المعالج
          observer.unobserve(el);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });
  }

  const elements = rootEl.querySelectorAll('.reveal:not(.is-revealed), .stagger-container:not(.is-revealed)');
  elements.forEach((el) => observer.observe(el));
}

/**
 * إظهار عنصر فوراً دون انتظار التمرير (للمحتوى المضاف ديناميكياً)
 * @param {HTMLElement} el 
 */
export function revealImmediately(el) {
  if (!el) return;
  el.classList.add('is-revealed');
  if (el.classList.contains('stagger-container')) {
    const items = el.querySelectorAll('.reveal-item');
    items.forEach((item, idx) => {
      item.style.setProperty('--stagger-idx', idx);
    });
  }
}

