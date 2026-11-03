/**
 * router.js - نظام التوجيه بالـ Hash لموقع «المهندس الصغير»
 * 
 * المزايا:
 * - مطابقة المسارات الثابتة والديناميكية (مثل #/calc/:id و #/category/:id)
 * - انتقال تلاشي انسيابي (Fade Transition 150ms)
 * - دعم زر الرجوع والتقدم بالمتصفح بشكل طبيعي
 * - التمرير التلقائي لأعلى الصفحة عند التبديل
 * - معالجة المسارات غير المعروفة وعرض صفحة 404
 */

export class Router {
  constructor({ rootEl, routes = {}, notFoundView }) {
    this.rootEl = rootEl;
    this.routes = [];
    this.notFoundView = notFoundView;
    this.currentPath = null;
    this.currentCleanup = null;

    // تسجيل المسارات
    Object.entries(routes).forEach(([pattern, handler]) => {
      this.addRoute(pattern, handler);
    });

    this.init();
  }

  /**
   * إضافة مسار بنمط معين
   * @param {string} pattern - مثل '/calc/:id' أو '/'
   * @param {Function} handler - دالة ترجع عنصر DOM أو وعد به
   */
  addRoute(pattern, handler) {
    const cleanPattern = pattern.replace(/^#/, '');
    const paramNames = [];
    
    // تحويل نمط المسار إلى تعبير منتظم regex
    const regexPattern = cleanPattern
      .replace(/:([a-zA-Z0-9_]+)/g, (_, paramName) => {
        paramNames.push(paramName);
        return '([^/]+)';
      })
      .replace(/\//g, '\\/');

    const regex = new RegExp(`^${regexPattern}$`);
    this.routes.push({ pattern: cleanPattern, regex, paramNames, handler });
  }

  /**
   * استخراج المسار الحالي من الـ hash
   * @returns {string}
   */
  getPath() {
    let hash = window.location.hash || '#/';
    if (!hash.startsWith('#')) hash = '#' + hash;
    const path = hash.substring(1).split('?')[0];
    return path.startsWith('/') ? path : '/' + path;
  }

  /**
   * استخراج معلمات الاستعلام من الرابط (Query Params)
   * @returns {Object}
   */
  getQueryParams() {
    const hash = window.location.hash || '';
    const queryIdx = hash.indexOf('?');
    if (queryIdx === -1) return {};
    const queryString = hash.substring(queryIdx + 1);
    const params = {};
    new URLSearchParams(queryString).forEach((val, key) => {
      params[key] = val;
    });
    return params;
  }

  /**
   * الانتقال إلى مسار جديد برمجياً
   * @param {string} path 
   */
  navigate(path) {
    const cleanPath = path.startsWith('#') ? path : '#' + (path.startsWith('/') ? path : '/' + path);
    window.location.hash = cleanPath;
  }

  /**
   * معالجة تغيير المسار
   */
  async handleRoute() {
    const path = this.getPath();
    const query = this.getQueryParams();

    // البحث عن المسار المطابق
    let matchedRoute = null;
    let params = {};

    for (const route of this.routes) {
      const match = path.match(route.regex);
      if (match) {
        matchedRoute = route;
        route.paramNames.forEach((name, idx) => {
          params[name] = decodeURIComponent(match[idx + 1]);
        });
        break;
      }
    }

    if (this.currentCleanup && typeof this.currentCleanup === 'function') {
      try { this.currentCleanup(); } catch (e) { console.error(e); }
      this.currentCleanup = null;
    }

    // إعداد حاوية الصفحة مع حركة الانتقال
    this.rootEl.innerHTML = '';
    const pageWrapper = document.createElement('div');
    pageWrapper.className = 'page-container';

    let viewResult;
    if (matchedRoute) {
      viewResult = await matchedRoute.handler({ params, query, navigate: this.navigate.bind(this) });
    } else if (this.notFoundView) {
      viewResult = await this.notFoundView({ path, navigate: this.navigate.bind(this) });
    }

    if (viewResult instanceof HTMLElement) {
      pageWrapper.appendChild(viewResult);
    } else if (viewResult && typeof viewResult === 'object' && viewResult.element instanceof HTMLElement) {
      pageWrapper.appendChild(viewResult.element);
      if (typeof viewResult.cleanup === 'function') {
        this.currentCleanup = viewResult.cleanup;
      }
    }

    this.rootEl.appendChild(pageWrapper);
    window.scrollTo({ top: 0, behavior: 'instant' });
    this.currentPath = path;

    // بث حدث مخصص لتحديث الروابط النشطة في الترويسة
    window.dispatchEvent(new CustomEvent('app:route-changed', { detail: { path, params, query } }));
  }

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    // معالجة فورية عند التحميل
    this.handleRoute();
  }
}

