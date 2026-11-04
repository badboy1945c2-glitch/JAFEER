/**
 * calc-card.js - بطاقة حاسبة: معادلة + مدخلات + نتائج فورية
 * مواصفات البطاقة: title, page, latex, inputs, outputs, و (expr لكل مخرج) أو compute(scope)
 * اختياري: wide, note, examples: [{ name, values }], draw(scope, results) => svg
 * المدخل/المخرج: { key, name, tex, unit, ... } ، والمخرج يقبل head (عنوان فرعي)
 */
import katex from 'katex';
import { compile } from 'mathjs';

const tex = (s) => katex.renderToString(s, { throwOnError: false });

function fmt(v, dec) {
  if (typeof v === 'string') return v;
  return typeof v === 'number' && Number.isFinite(v)
    ? v.toLocaleString('en-US', { maximumFractionDigits: dec })
    : '—';
}

const nameHtml = (x) =>
  `<span class="cn-nm">${x.name}${x.tex ? ` <span class="cn-sym">${tex(x.tex)}</span>` : ''}</span>`;

function fieldHtml(i) {
  const range = i.min != null && i.max != null ? ` (${i.min}–${i.max})` : '';
  const unit = `${i.unit || ''}${range}`;
  const label = `<span class="cn-lbl">${nameHtml(i)}${unit ? `<em>${unit}</em>` : ''}</span>`;
  if (i.options) {
    let picked = false;
    const opts = i.options
      .map((o) => {
        const sel = !picked && o.value === i.def;
        if (sel) picked = true;
        return `<option value="${o.value}"${sel ? ' selected' : ''}>${o.label}</option>`;
      })
      .join('');
    return `<label class="cn-field">${label}<select data-in="${i.key}">${opts}</select></label>`;
  }
  return `<label class="cn-field">${label}<input type="number" inputmode="decimal" step="any" data-in="${i.key}" value="${i.def}"${i.min != null ? ` min="${i.min}"` : ''}${i.max != null ? ` max="${i.max}"` : ''}></label>`;
}

export function createCalcCard(eq) {
  const card = document.createElement('section');
  card.className = `cn-calc${eq.wide ? ' is-wide' : ''}`;

  const compiled = {};
  if (!eq.compute) eq.outputs.forEach((o) => { compiled[o.key] = compile(o.expr); });

  card.innerHTML = `
    <div class="cn-calc-head">
      <h3 class="cn-title">${eq.title}</h3>
      <span class="cn-meta">${eq.page || ''}</span>
    </div>
    ${eq.latex ? `<div class="cn-formula">${tex(eq.latex)}</div>` : ''}
    ${eq.note ? `<div class="cn-meta">${eq.note}</div>` : ''}
    ${
      eq.examples && eq.examples.length
        ? `<div class="cn-examples"><span class="cn-meta">Ready examples:</span>${eq.examples
            .map((e, idx) => `<button type="button" class="btn btn-sm btn-ghost" data-ex="${idx}">${e.name}</button>`)
            .join('')}</div>`
        : ''
    }
    <div class="cn-body">
      <div class="cn-fields">${eq.inputs.map(fieldHtml).join('')}</div>
      <div class="cn-out">
        ${eq.draw ? '<div class="cn-draw"></div>' : ''}
        <div class="cn-results">
          ${eq.outputs
            .map(
              (o) =>
                `${o.head ? `<div class="cn-subhead">${o.head}</div>` : ''}<div class="cn-res"><span class="cn-lbl">${nameHtml(o)}</span><b data-out="${o.key}">—</b><em>${o.unit || ''}</em></div>`
            )
            .join('')}
        </div>
      </div>
    </div>`;

  const drawEl = card.querySelector('.cn-draw');

  const update = () => {
    const scope = {};
    let ok = true;
    eq.inputs.forEach((i) => {
      const el = card.querySelector(`[data-in="${i.key}"]`);
      const v = Number(el.value);
      const bad =
        el.value === '' ||
        !Number.isFinite(v) ||
        (i.min != null && v < i.min) ||
        (i.max != null && v > i.max);
      el.classList.toggle('is-bad', bad);
      if (bad) ok = false;
      scope[i.key] = v;
    });

    let results = {};
    if (ok) {
      try {
        if (eq.compute) {
          results = eq.compute({ ...scope });
        } else {
          eq.outputs.forEach((o) => {
            results[o.key] = compiled[o.key].evaluate({ ...scope, ...results });
          });
        }
      } catch {
        results = {};
      }
    }
    eq.outputs.forEach((o) => {
      card.querySelector(`[data-out="${o.key}"]`).textContent = fmt(results[o.key], o.dec ?? 2);
    });
    if (drawEl) {
      try {
        drawEl.innerHTML = ok && results.rects ? eq.draw(scope, results) : '';
      } catch {
        drawEl.innerHTML = '';
      }
    }
  };

  card.addEventListener('input', update);
  card.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-ex]');
    if (!btn) return;
    const ex = eq.examples[Number(btn.dataset.ex)];
    Object.entries(ex.values).forEach(([k, val]) => {
      const el = card.querySelector(`[data-in="${k}"]`);
      if (el) el.value = val;
    });
    update();
  });

  update();
  return card;
}