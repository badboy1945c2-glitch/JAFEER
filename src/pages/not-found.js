/**
 * not-found.js - صفحة 404 بتصميم هندسي (مخطط ناقص / Broken Blueprint)
 */

export function renderNotFoundPage({ path, navigate }) {
  const container = document.createElement('div');
  container.className = 'container';
  container.style.padding = '80px 20px 120px';
  container.style.textAlign = 'center';

  container.innerHTML = `
    <div style="max-width: 580px; margin: 0 auto;">
      <!-- رسم هندسي SVG لمخطط ناقص / مسند وعمود بدون عتبة -->
      <div style="margin-bottom: 28px; display: flex; justify-content: center;">
        <svg viewBox="0 0 320 180" width="300" height="170" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- خلفية شبكية خفيفة للمخطط -->
          <pattern id="nf-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--line)" stroke-width="0.8"/>
          </pattern>
          <rect width="320" height="180" fill="url(#nf-grid)" rx="6" stroke="var(--line-strong)" stroke-width="1.2"/>
          
          <!-- العمود الأيمن -->
          <rect x="50" y="80" width="24" height="80" fill="var(--violet-100)" stroke="var(--violet-600)" stroke-width="2"/>
          <!-- العمود الأيسر -->
          <rect x="246" y="80" width="24" height="80" fill="var(--violet-100)" stroke="var(--violet-600)" stroke-width="2"/>
          
          <!-- مسار العتبة المفقودة (خط متقطع للدلالة على عنصر ناقص) -->
          <rect x="74" y="80" width="172" height="20" fill="none" stroke="var(--violet-400)" stroke-width="1.5" stroke-dasharray="6 4"/>
          
          <!-- خط البعد الهندسي مع علامة استفهام -->
          <line x1="74" y1="55" x2="246" y2="55" stroke="var(--error)" stroke-width="1.5" stroke-dasharray="3 3"/>
          <line x1="74" y1="50" x2="74" y2="60" stroke="var(--error)" stroke-width="1.5"/>
          <line x1="246" y1="50" x2="246" y2="60" stroke="var(--error)" stroke-width="1.5"/>
          
          <!-- وسم 404 الهندسي -->
          <rect x="135" y="40" width="50" height="26" rx="4" fill="var(--error-bg)" stroke="var(--error)" stroke-width="1"/>
          <text x="160" y="58" font-family="var(--font-mono)" font-size="14" font-weight="700" fill="var(--error)" text-anchor="middle">404</text>
          
          <!-- علامة تنبيه هندسية في المنتصف -->
          <text x="160" y="95" font-family="var(--font-mono)" font-size="12" fill="var(--ink-muted)" text-anchor="middle">[عنصر مفقود // MISSING ELEMENT]</text>
        </svg>
      </div>

      <div class="badge badge-sample" style="color: var(--error); border-color: var(--error); background-color: var(--error-bg); margin-bottom: 12px;">
        خطأ 404: مخطط غير مكتمل
      </div>

      <h1 style="font-size: 1.8rem; margin-bottom: 12px; color: var(--ink);">
        الصفحة أو المعادلة المطلوبة غير موجودة
      </h1>

      <p style="font-size: 1rem; line-height: 1.7; color: var(--ink-soft); margin-bottom: 30px;">
        يبدو أن المسار الذي تحاول الوصول إليه (<code>${path || window.location.hash}</code>) غير معرّف في مخططات الموقع، أو تم نقله.
      </p>

      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
        <button class="btn btn-primary" id="btn-back-home">
          العودة للرئيسية
        </button>
        <button class="btn btn-secondary" id="btn-search-formulas">
          تصفح مكتبة المعادلات
        </button>
      </div>
    </div>
  `;

  container.querySelector('#btn-back-home')?.addEventListener('click', () => {
    navigate('/');
  });

  container.querySelector('#btn-search-formulas')?.addEventListener('click', () => {
    navigate('/library');
  });

  return container;
}

