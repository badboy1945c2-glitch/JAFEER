/**
 * home-card.js - بطاقة وحدة ميكانيك التربة في الصفحة الرئيسية (S10 دفعة 2)
 * دالة نقية: ترجع عنصر DOM ولا تعتمد على أي ملف آخر.
 */
const STYLE_ID = 'soil-home-card-styles';

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const st = document.createElement('style');
  st.id = STYLE_ID;
  st.textContent = `
  .soil-home-card{display:grid;grid-template-columns:minmax(0,1fr) 180px;gap:24px;align-items:center;
    border:1px solid var(--line);border-radius:var(--radius-lg);padding:24px;background:var(--bg);
    transition:transform 250ms cubic-bezier(.2,.7,.2,1),box-shadow 250ms,border-color 250ms}
  .soil-home-card:hover{transform:translateY(-3px);box-shadow:var(--shadow-soft);border-color:var(--violet-500)}
  .soil-home-card h3{margin:0 0 8px;font-size:1.4rem;color:var(--ink)}
  .soil-home-card p{margin:0 0 14px;color:var(--ink-soft);font-size:.95rem;line-height:1.8}
  .soil-home-card .shc-src{font-size:.78rem;color:var(--ink-soft);margin-top:10px}
  .soil-home-card .shc-actions{display:flex;gap:8px;flex-wrap:wrap}
  @media(max-width:640px){
    .soil-home-card{grid-template-columns:1fr}
    .soil-home-card svg{max-width:150px;margin:0 auto;order:-1}
  }
  @media (prefers-reduced-motion:reduce){
    .soil-home-card{transition:none}.soil-home-card:hover{transform:none}
  }`;
  document.head.appendChild(st);
}

// مخطط الأطوار: هواء + ماء + حبيبات صلبة (رسم أصلي بالكود)
const PHASE_SVG = `
<svg viewBox="0 0 180 200" role="img" aria-label="مخطط أطوار التربة: هواء وماء وحبيبات صلبة" style="width:100%;height:auto;direction:ltr;">
  <rect x="40" y="10"  width="90" height="40" fill="var(--violet-50)"  stroke="var(--violet-300)" stroke-width="1.5"/>
  <rect x="40" y="50"  width="90" height="50" fill="var(--violet-100)" stroke="var(--violet-300)" stroke-width="1.5"/>
  <rect x="40" y="100" width="90" height="90" fill="var(--violet-300)" stroke="var(--violet-600)" stroke-width="1.5"/>
  <text x="85" y="34"  text-anchor="middle" font-size="12" fill="var(--violet-800)">Air</text>
  <text x="85" y="79"  text-anchor="middle" font-size="12" fill="var(--violet-800)">Water</text>
  <text x="85" y="150" text-anchor="middle" font-size="12" fill="var(--violet-800)">Solids</text>
  <text x="138" y="34"  font-size="12" fill="var(--ink-soft)">Va</text>
  <text x="138" y="79"  font-size="12" fill="var(--ink-soft)">Vw</text>
  <text x="138" y="150" font-size="12" fill="var(--ink-soft)">Vs</text>
  <text x="32" y="79"  text-anchor="end" font-size="12" fill="var(--ink-soft)">Ww</text>
  <text x="32" y="150" text-anchor="end" font-size="12" fill="var(--ink-soft)">Ws</text>
</svg>`;

export function renderSoilHomeCard() {
  ensureStyles();
  const card = document.createElement('div');
  card.className = 'soil-home-card';
  card.innerHTML = `
    <div>
      <h3>ميكانيك التربة</h3>
      <p>حاسبة ذكية لعلاقات الأطوار وحدود أتربرغ، وتحليل حبيبي بمنحنى التدرج، وكشف نوع التربة
         (USCS وAASHTO وUSDA) بمخططات متحركة من أول الشجرة إلى اسم التربة.</p>
      <div class="shc-actions">
        <a class="btn btn-primary btn-sm" href="#/soil">فتح الوحدة</a>
        <a class="btn btn-secondary btn-sm" href="#/soil?tab=detect">كشف نوع التربة</a>
      </div>
      <div class="shc-src">مبنية حرفياً من المحاضرة، ص1 إلى ص45</div>
    </div>
    ${PHASE_SVG}`;
  return card;
}