/**
 * home.js - الصفحة الرئيسية المبنية ديناميكياً من إعدادات وأقسام الموقع (Home Sections)
 */

import { renderLogo } from '../components/logo.js';
import { StorageAdapter } from '../store/adapter.js';
import { initAllMotions, createDimensionLineSvg, initHeroParallax } from '../motion/index.js';
import { openModal } from '../components/modal.js';
import { renderSoilHomeCard } from '../modules/soil-mechanics/home-card.js';
import {
  renderBeamMomentDiagramSvg,
  renderConcreteSectionDiagramSvg,
  renderSoilPressureDiagramSvg
} from '../components/diagrams.js';

export function renderHomePage({ navigate }) {
  const container = document.createElement('div');
  container.className = 'container page-container';
  container.style.padding = '40px 20px 100px';

  // يضمن وجود قسم «الوحدات» لمن حُفظت أقسام رئيسيته قبل إضافته
  const storedSections = StorageAdapter.getHomeSections();
  if (storedSections.length && !storedSections.some((s) => s.type === 'modules')) {
    const anchor = storedSections.find((s) => s.type === 'stats') || storedSections.find((s) => s.type === 'hero');
    StorageAdapter.saveHomeSections([
      ...storedSections,
      { id: 'sec-modules', type: 'modules', enabled: true, order: (anchor ? anchor.order : 0) + 0.5, title: 'وحدات متخصصة' }
    ]);
  }

  // جلب البيانات من المخزن
  const homeSections = StorageAdapter.getHomeSections()
    .filter(sec => sec.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const formulas = StorageAdapter.getFormulas();
  const categories = StorageAdapter.getCategories();
  const sources = StorageAdapter.getSources();
  const tables = StorageAdapter.getTables();
  const constants = StorageAdapter.getConstants();
  const settings = StorageAdapter.getSettings();

  // معالجات توليد كل نوع من الأقسام
  const sectionRenderers = {
    // 1. قسم الهيرو الرئيسي
    'hero': (sec) => `
      <section class="hero-section" id="main-hero" style="position: relative; overflow: hidden; border-radius: var(--radius-lg); border: 1px solid var(--line); padding: 50px 24px; margin-bottom: 50px; background-color: var(--bg-soft); text-align: center;">
        ${settings.heroBackgroundAssetIds && settings.heroBackgroundAssetIds[0] ? `
          <img data-asset-id="${settings.heroBackgroundAssetIds[0]}" alt="" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;" />
          <div style="position:absolute; inset:0; background:rgba(245,241,254,${settings.heroOverlayOpacity ?? 0.55});"></div>` : ''}
        
        <div class="hero-blueprint-bg">
          <svg class="hero-grid-svg" viewBox="0 0 1000 400" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="main-hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--line)" stroke-width="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#main-hero-grid)" />
            <line x1="120" y1="0" x2="120" y2="400" class="hero-grid-accent" />
            <line x1="0" y1="180" x2="1000" y2="180" class="hero-grid-accent" />
            <g class="grid-cross" transform="translate(120, 180)">
              <circle cx="0" cy="0" r="4" fill="var(--violet-600)"/>
              <circle cx="0" cy="0" r="14" fill="none" stroke="var(--violet-500)" stroke-width="1.2" stroke-dasharray="2 2"/>
            </g>
          </svg>
        </div>

        <div style="position: relative; z-index: 1; max-width: 760px; margin: 0 auto;">
          <div style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 18px;">
            <span class="badge badge-category">منصة هندسية مفتوحة</span>
            <span class="badge badge-published">نظام حاسبات قابل للتوسعة</span>
          </div>

          <div style="display: flex; justify-content: center; margin-bottom: 20px;">
            ${renderLogo({ showTagline: false, size: 'large' })}
          </div>

          <h1 style="font-size: 2.2rem; margin-bottom: 16px; font-weight: 700; color: var(--ink);">
            ${sec.title || settings.siteName || 'حاسبات ومعادلات هندسية مرجعية'}
          </h1>
          <p style="font-size: 1.05rem; line-height: 1.8; color: var(--ink-soft); margin-bottom: 30px; max-width: 640px; margin-inline: auto;">
            ${settings.tagline || 'أداة حسابية هندسية دقيقة للمهندس والباحث المدني. إدخال قيم، خطوات حل موثقة، ومراجع معيارية بدون تعقيد.'}
          </p>

          <!-- شريط البحث السريع -->
          <div style="max-width: 520px; margin: 0 auto 20px;">
            <form id="hero-search-form" style="display: flex; gap: 8px;">
              <input 
                type="text" 
                id="hero-search-input" 
                class="form-input" 
                placeholder="ابحث عن معادلة (مثال: عزم، إجهاد، هطول، خرسانة)..." 
                style="padding: 12px 16px; font-size: 1rem; border-radius: var(--radius); box-shadow: 0 2px 8px rgba(63,31,138,0.06);"
              />
              <button type="submit" class="btn btn-primary" style="padding: 0 22px;">بحث</button>
            </form>
          </div>
        </div>
      </section>
    `,


    // قسم الوحدات المتخصصة
    'modules': (sec) => `
      <section class="reveal" style="margin-bottom: 50px;">
        <div style="margin-bottom: 16px;">
          ${createDimensionLineSvg(sec.title || 'وحدات متخصصة', 320)}
        </div>
        <div data-modules-slot></div>
      </section>
    `,

    // 3. قسم التصنيفات الهندسية
    'categories': (sec) => `
      <section class="reveal" style="margin-bottom: 50px;">
        <div style="margin-bottom: 16px;">
          ${createDimensionLineSvg(sec.title || 'التصنيفات الهندسية المعتمدة', 320)}
        </div>
        <div class="stagger-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
          ${categories.map(cat => `
            <a href="#/library?category=${cat.id}" class="card card-interactive reveal-item" style="text-decoration: none;">
              <div class="card-header">
                <span class="badge badge-category">${cat.title}</span>
              </div>
              <p class="card-desc" style="font-size: 0.88rem; margin: 0;">${cat.description || 'تصفح المعادلات التابعة لهذا القسم.'}</p>
            </a>
          `).join('')}
        </div>
      </section>
    `,

    // 4. أحدث المعادلات
    'latest-formulas': (sec) => `
      <section class="reveal" style="margin-bottom: 50px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>${createDimensionLineSvg(sec.title || 'أحدث المعادلات المضافة', 320)}</div>
          <a href="#/library" class="btn btn-secondary btn-sm">عرض كل المعادلات ←</a>
        </div>
        <div class="stagger-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
          ${formulas.slice(0, 6).map(f => {
            const cat = categories.find(c => c.id === f.categoryId);
            return `
              <div class="card card-interactive reveal-item" onclick="window.location.hash = '#/calc/${f.id}'">
                <div class="card-header">
                  <span class="badge badge-category">${cat ? cat.title : 'عام'}</span>
                  ${f.isSample ? '<span class="badge badge-sample">تجريبي</span>' : ''}
                </div>
                <h3 class="card-title">${f.title}</h3>
                <p class="card-desc">${f.description || 'معادلة حسابية موثقة.'}</p>
                <div class="card-footer">
                  <span style="font-family: var(--font-mono); color: var(--violet-600); font-weight: 500;">
                    ${f.outputs && f.outputs[0] ? `${f.outputs[0].key} = ${f.outputs[0].expression}` : ''}
                  </span>
                  <span style="color: var(--ink-soft); font-size: 0.82rem;">${(f.inputs || []).length} مدخلات</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>
    `,

    // 5. معرض المخططات
    'gallery': (sec) => `
      <section class="reveal" style="margin-bottom: 50px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>${createDimensionLineSvg(sec.title || 'معرض المخططات والرسومات الهندسية', 360)}</div>
          <span style="font-size: 0.82rem; color: var(--ink-muted);">انقر على المخطط للتكبير والفحص</span>
        </div>
        <div class="stagger-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
          <div class="card card-interactive reveal-item btn-zoom-diagram" data-diagram="beam" style="padding: 16px;">
            <div style="border-radius: var(--radius-sm); overflow: hidden; margin-bottom: 12px; background: #fff;">
              ${renderBeamMomentDiagramSvg()}
            </div>
            <div style="font-weight: 600; font-size: 0.95rem; color: var(--ink); margin-bottom: 4px;">عتبة بسيطة الإسناد ومخطط العزوم BMD</div>
            <div style="font-size: 0.82rem; color: var(--ink-soft);">توزيع الحمل المنتظم وقيمة العزم الأقصى في المنتصف wL²/8.</div>
          </div>

          <div class="card card-interactive reveal-item btn-zoom-diagram" data-diagram="concrete" style="padding: 16px;">
            <div style="border-radius: var(--radius-sm); overflow: hidden; margin-bottom: 12px; background: #fff;">
              ${renderConcreteSectionDiagramSvg()}
            </div>
            <div style="font-weight: 600; font-size: 0.95rem; color: var(--ink); margin-bottom: 4px;">مقطع عرضي لجسور الخرسانة المسلحة</div>
            <div style="font-size: 0.82rem; color: var(--ink-soft);">تفاصيل كانات القص وتسليح الشد السفلي والتعليق العلوي.</div>
          </div>

          <div class="card card-interactive reveal-item btn-zoom-diagram" data-diagram="soil" style="padding: 16px;">
            <div style="border-radius: var(--radius-sm); overflow: hidden; margin-bottom: 12px; background: #fff;">
              ${renderSoilPressureDiagramSvg()}
            </div>
            <div style="font-weight: 600; font-size: 0.95rem; color: var(--ink); margin-bottom: 4px;">مثلث ضغط التربة الجانبي الفعال</div>
            <div style="font-size: 0.82rem; color: var(--ink-soft);">حساب محصلة الضغط Pa على الجدران الاستنادية الكابولية.</div>
          </div>
        </div>
      </section>
    `,

    // 6. قسم عن الموقع
    'about': (sec) => `
      <section class="reveal" style="margin-bottom: 50px;">
        <div style="margin-bottom: 16px;">
          ${createDimensionLineSvg(sec.title || 'عن موقع المهندس الصغير', 280)}
        </div>
        <div class="card" style="padding: 30px; background-color: var(--bg-soft);">
          <div style="max-width: 780px;">
            <h3 style="font-size: 1.25rem; color: var(--violet-900); margin-bottom: 12px;">منصة عربية للمهندس والباحث الإنشائي</h3>
            <p style="font-size: 0.95rem; line-height: 1.8; color: var(--ink-soft); margin-bottom: 20px;">
              صُمم «المهندس الصغير» ليكون أكثر من مجرد آلة حاسبة رقمية؛ إنه مرجع عملي يوضح خطوات التعويض الحسابي والرياضي، ويوثق المرجع الأكاديمي أو البند المعياري لكل معادلة، مع معمارية ثابتة خفيفة تتيح إضافة المعادلات والمراجع محلياً وتحديثها مجاناً.
            </p>
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
              <a href="#/about" class="btn btn-secondary btn-sm">قراءة المزيد عن الموقع والمنهجية ←</a>
              <a href="#/admin" class="btn btn-ghost btn-sm" style="color: var(--violet-700);">دخول لوحة التحكم المشرف</a>
            </div>
          </div>
        </div>
      </section>
    `,

    // 7. معاينة المصادر
    'sources-preview': (sec) => `
      <section class="reveal" style="margin-bottom: 50px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>${createDimensionLineSvg(sec.title || 'المصادر والمراجع المعتمدة', 320)}</div>
          <a href="#/sources" class="btn btn-secondary btn-sm">عرض كل المصادر ←</a>
        </div>
        <div class="stagger-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
          ${sources.map(src => `
            <div class="card">
              <div class="card-header">
                <span class="badge badge-category">${src.edition || 'مرجع معتمد'}</span>
              </div>
              <h4 style="font-size: 1.05rem; margin-bottom: 6px; color: var(--ink);">${src.title}</h4>
              <div style="font-size: 0.85rem; color: var(--ink-soft);">${src.author || ''}</div>
            </div>
          `).join('')}
        </div>
      </section>
    `,

    // 8. نص مخصص
    'custom-text': (sec) => `
      <section class="reveal" style="margin-bottom: 50px;">
        <div class="card" style="padding: 24px; border-right: 4px solid var(--violet-600);">
          <h3 style="font-size: 1.1rem; color: var(--ink); margin-bottom: 8px;">${sec.title || 'تنويه هندسي'}</h3>
          <p style="font-size: 0.92rem; color: var(--ink-soft); margin: 0; line-height: 1.7;">${sec.content || ''}</p>
        </div>
      </section>
    `
  };

  // توليد كود الـ HTML للأقسام النشطة بالترتيب المحدد
  container.innerHTML = homeSections.map(sec => {
    const renderer = sectionRenderers[sec.type];
    return renderer ? renderer(sec) : '';
  }).join('');

  // إدراج بطاقات الوحدات (عناصر DOM جاهزة)
  container.querySelectorAll('[data-modules-slot]').forEach((slot) => {
    slot.appendChild(renderSoilHomeCard());
  });

  // ربط البحث السريع
  const searchForm = container.querySelector('#hero-search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = container.querySelector('#hero-search-input').value.trim();
      if (q) {
        navigate(`/library?q=${encodeURIComponent(q)}`);
      } else {
        navigate('/library');
      }
    });
  }

  // ربط Parallax للهيرو
  const heroEl = container.querySelector('#main-hero');
  if (heroEl) {
    initHeroParallax(heroEl);
  }

  // ربط تكبير المخططات في نافذة Modal (Lightbox Zoom)
  container.querySelectorAll('.btn-zoom-diagram').forEach(card => {
    card.addEventListener('click', () => {
      const diagramType = card.getAttribute('data-diagram');
      let title = 'معاينة المخطط الهندسي';
      let svgHtml = '';

      if (diagramType === 'beam') {
        title = 'عتبة بسيطة الإسناد ومخطط العزم BMD';
        svgHtml = renderBeamMomentDiagramSvg();
      } else if (diagramType === 'concrete') {
        title = 'مقطع عرضي لعتبة خرسانية مسلحة وتفاصيل التسليح';
        svgHtml = renderConcreteSectionDiagramSvg();
      } else if (diagramType === 'soil') {
        title = 'مثلث ضغط التربة الجانبي الفعال على جدار استنادي';
        svgHtml = renderSoilPressureDiagramSvg();
      }

      openModal({
        title,
        content: `
          <div style="padding: 10px; text-align: center;">
            <div style="max-width: 520px; margin: 0 auto; border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; background: #fff;">
              ${svgHtml}
            </div>
            <p style="margin-top: 14px; font-size: 0.85rem; color: var(--ink-soft); text-align: right; line-height: 1.6;">
              رسم تخطيطي هندسي ناقل للمتغيرات والمعادلات المعتمدة في كودات التصميم الإنشائي.
            </p>
          </div>
        `,
        confirmText: 'إغلاق',
        showFooter: false
      });
    });
  });

  // تشغيل الحركات
  requestAnimationFrame(() => {
    initAllMotions(container);
  });

  return container;
}