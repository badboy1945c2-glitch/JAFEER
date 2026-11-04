/**
 * concrete-page.js - صفحة وحدة «الكونكريت»: بطاقات المحاضرات، وحاسبات كل محاضرة
 * الروابط: #/concrete  أو  #/concrete?topic=<id>
 */
import topics from '../data/topics.json';
import { lectures } from '../data/lectures.js';
import { ensureConcreteSource } from '../index.js';
import { createCalcCard } from './calc-card.js';

const BADGE = { soon: 'Coming soon' };

function ensureStyles() {
  if (document.getElementById('concrete-styles')) return;
  const s = document.createElement('style');
  s.id = 'concrete-styles';
  s.textContent = `
  .cn-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px}
  .cn-card{display:grid;gap:8px;align-content:start;padding:22px;border:1px solid var(--line);border-radius:var(--radius-lg);background:var(--bg);color:var(--ink);text-decoration:none;transition:transform .25s,box-shadow .25s,border-color .25s}
  a.cn-card:hover,a.cn-card:focus-visible{transform:translateY(-3px);box-shadow:var(--shadow-soft,0 6px 18px rgba(80,50,160,.12));border-color:var(--violet-300)}
  .cn-card.is-soon{opacity:.55;cursor:default}
  .cn-num{font-size:1.6rem;font-weight:800;color:var(--violet-600);line-height:1}
  .cn-title{font-size:1.05rem;font-weight:700;margin:0}
  .cn-sub{font-size:.88rem;color:var(--ink-soft)}
  .cn-meta{font-size:.78rem;color:var(--ink-soft)}
  .cn-badge{justify-self:start;font-size:.72rem;padding:2px 10px;border-radius:12px;border:1px solid var(--line);background:var(--bg-soft)}
  .cn-note{margin:16px 0;padding:12px 14px;border:1px dashed var(--violet-300);background:var(--violet-50);border-radius:var(--radius);font-size:.9rem}
  .cn-head{border-bottom:1px solid var(--line);padding:16px 0 22px;margin-bottom:32px}
  .cn-head h1{font-size:1.9rem;margin:0 0 6px}
  .cn-group{margin-bottom:48px}
  .cn-group-title{font-size:1.15rem;font-weight:700;margin:0 0 20px;padding-inline-start:12px;border-inline-start:4px solid var(--violet-600)}
  .cn-calcs{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,440px),1fr));gap:24px}
  .cn-calc{display:grid;gap:18px;align-content:start;padding:24px;border:1px solid var(--line);border-radius:var(--radius-lg);background:var(--bg);box-shadow:0 1px 3px rgba(0,0,0,.04)}
  .cn-calc.is-wide{grid-column:1/-1}
  .cn-calc-head{display:flex;justify-content:space-between;align-items:baseline;gap:12px}
  .cn-formula{padding:20px 16px;background:var(--violet-50);border-radius:var(--radius);overflow-x:auto;font-size:1.08em;text-align:center}
  .cn-formula .katex-display{margin:0}
  .cn-body{display:grid;gap:22px}
  .cn-calc.is-wide .cn-body{grid-template-columns:1.25fr 1fr;gap:32px}
  .cn-fields{display:grid;gap:12px;align-content:start}
  .cn-calc.is-wide .cn-fields{grid-template-columns:1fr 1fr;gap:12px 24px}
  .cn-field{display:grid;grid-template-columns:1fr 120px;align-items:center;gap:10px;font-size:.9rem}
  .cn-lbl{display:grid;gap:1px}
  .cn-nm{font-weight:500}
  .cn-sym{color:var(--ink-soft);margin-inline-start:4px}
  .cn-lbl em,.cn-res em{font-style:normal;color:var(--ink-soft);font-size:.78rem}
  .cn-field input,.cn-field select{padding:7px 9px;border:1px solid var(--line);border-radius:var(--radius);background:var(--bg);color:var(--ink);font:inherit;width:100%;box-sizing:border-box}
  .cn-field .is-bad{border-color:#d33;background:#fff0f0;color:#900}
  .cn-out{display:grid;gap:14px;align-content:start}
  .cn-results{display:grid;gap:9px}
  .cn-subhead{font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-soft);margin-top:8px;padding-top:12px;border-top:1px dashed var(--line)}
  .cn-res{display:grid;grid-template-columns:1fr auto auto;gap:10px;align-items:baseline;font-size:.92rem}
  .cn-res b{font-size:1.05rem;color:var(--violet-600);text-align:end}
  .cn-examples{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
  .cn-svg{width:100%;max-width:240px;display:block;margin:0 auto;color:var(--ink)}
  @media (max-width:760px){.cn-calc.is-wide .cn-body,.cn-calc.is-wide .cn-fields{grid-template-columns:1fr}}
  @media (prefers-reduced-motion:reduce){.cn-card{transition:none}a.cn-card:hover{transform:none}}`;
  document.head.appendChild(s);
}

function cardHtml(t) {
  const soon = t.status === 'soon';
  const inner = `
    <span class="cn-num">${t.n}</span>
    <h3 class="cn-title">${t.title}</h3>
    ${t.sub ? `<span class="cn-sub">${t.sub}</span>` : ''}
    ${BADGE[t.status] ? `<span class="cn-badge">${BADGE[t.status]}</span>` : ''}`;
  return soon
    ? `<div class="cn-card is-soon" aria-disabled="true">${inner}</div>`
    : `<a class="cn-card" href="#/concrete?topic=${t.id}">${inner}</a>`;
}

function cardsView() {
  return `
    <div class="cn-head">
      <div class="badge badge-category" style="margin-bottom:10px;">Concrete Module</div>
      <h1>Reinforced Concrete</h1>
    </div>
    <div class="cn-grid">${topics.map(cardHtml).join('')}</div>`;
}

function topicView(t) {
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <a href="#/concrete" class="btn btn-sm btn-ghost">← All lectures</a>
    <div class="cn-head" style="margin-top:12px;">
      <h1>${t.title}</h1>
      ${t.sub ? `<div class="cn-sub">${t.sub}</div>` : ''}
    </div>`;
  const lec = lectures[t.id];
  if (!lec) {
    wrap.insertAdjacentHTML('beforeend', '<div class="cn-note">Content coming soon.</div>');
    return wrap;
  }
  lec.groups.forEach((g) => {
    const sec = document.createElement('section');
    sec.className = 'cn-group';
    if (g.title) sec.innerHTML = `<h2 class="cn-group-title">${g.title}</h2>`;
    const grid = document.createElement('div');
    grid.className = 'cn-calcs';
    g.equations.forEach((eq) => grid.appendChild(createCalcCard(eq)));
    sec.appendChild(grid);
    wrap.appendChild(sec);
  });
  return wrap;
}

export function renderConcretePage({ query = {} } = {}) {
  ensureConcreteSource();
  ensureStyles();
  const container = document.createElement('div');
  container.className = 'container page-container';
  container.setAttribute('dir', 'ltr');
  container.style.padding = '40px 20px 100px';
  const topic = topics.find((t) => t.id === query.topic);
  if (topic && topic.status !== 'soon') {
    container.appendChild(topicView(topic));
  } else {
    container.innerHTML = cardsView();
  }
  return container;
}