/**
 * formula-tools.js - أدوات منشئ المعادلات (المرحلة 11)
 * شريط مساعد + معاينة حية + معرض صور + أسهم الترتيب
 */
import { StorageAdapter } from '../store/adapter.js';
import { evaluateFormula } from '../engine/evaluate.js';
import { openMediaPicker } from '../media/picker.js';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const FUNCS = ['sqrt()', 'abs()', 'sin()', 'cos()', 'tan()', 'log()', 'exp()', 'pow(,)', 'min(,)', 'max(,)', 'round(,2)', 'pi', 'e'];

export function mountBuilderTools(editorEl, draft, syncDraftFromUI, renderEditor) {
  draft.galleryAssetIds = draft.galleryAssetIds || [];

  // ── 1) أسهم ▲▼ لترتيب المدخلات والمخرجات ──
  function addMoveButtons(selector, listName) {
    editorEl.querySelectorAll(selector).forEach(removeBtn => {
      const idx = parseInt(removeBtn.getAttribute('data-idx'), 10);
      [['▲', -1, 30], ['▼', 1, 54]].forEach(([sym, dir, left]) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = sym;
        b.title = dir < 0 ? 'تحريك للأعلى' : 'تحريك للأسفل';
        b.style.cssText = `position:absolute; top:6px; left:${left}px; background:none; border:none; cursor:pointer; color:var(--ink-soft);`;
        b.addEventListener('click', () => {
          const list = draft[listName];
          const to = idx + dir;
          if (to < 0 || to >= list.length) return;
          syncDraftFromUI();
          [list[idx], list[to]] = [list[to], list[idx]];
          renderEditor();
        });
        removeBtn.parentElement.appendChild(b);
      });
    });
  }
  addMoveButtons('.fe-remove-input', 'inputs');
  addMoveButtons('.fe-remove-output', 'outputs');

  // ── 2) قراءة المعادلة الحالية من الحقول مباشرة ──
  function readFormula() {
    const num = (v, d = null) => (v === '' || v == null ? d : parseFloat(v));
    const val = (r, sel) => r.querySelector(sel)?.value.trim() || '';
    const inputs = [...editorEl.querySelectorAll('.fe-input-row')].map(r => ({
      key: val(r, '.inp-key'), label: val(r, '.inp-label'), unit: val(r, '.inp-unit'),
      default: num(r.querySelector('.inp-default')?.value, 0),
      min: num(r.querySelector('.inp-min')?.value), max: num(r.querySelector('.inp-max')?.value)
    })).filter(i => i.key);
    const outputs = [...editorEl.querySelectorAll('.fe-output-row')].map(r => {
      const dec = parseInt(r.querySelector('.out-decimals')?.value, 10);
      return { key: val(r, '.out-key'), label: val(r, '.out-label'), unit: val(r, '.out-unit'),
        expression: val(r, '.out-expr'), latex: '', decimals: Number.isNaN(dec) ? 2 : dec };
    }).filter(o => o.key);
    return { inputs, outputs };
  }

  // ── 3) لوحة الشريط المساعد والمعاينة الحية ──
  const panel = document.createElement('fieldset');
  panel.style.cssText = 'border:1px solid var(--line); border-radius:var(--radius); padding:16px;';
  panel.innerHTML = `
    <legend style="font-weight:700; color:var(--violet-700); padding:0 8px;">المساعد والمعاينة الحية</legend>
    <div style="font-size:.8rem; color:var(--ink-soft); margin-bottom:6px;">اضغط داخل حقل «الصيغة» ثم اضغط على أي زر لإدراجه.</div>
    <div id="ft-chips" style="display:flex; flex-wrap:wrap; gap:6px;"></div>
    <div id="ft-hint" style="font-size:.78rem; color:var(--error); min-height:1.1em;"></div>
    <div style="margin-top:12px; font-weight:600;">المعاينة (بالقيم الابتدائية للمدخلات):</div>
    <div id="ft-preview" style="margin-top:6px; padding:10px; background:var(--violet-50); border-radius:var(--radius); display:grid; gap:4px;"></div>`;

  function chipsHtml() {
    const f = readFormula();
    const group = (title, items) => items.length
      ? `<div style="width:100%; font-size:.75rem; color:var(--ink-soft); margin-top:4px;">${title}</div>` +
        items.map(([label, ins, tip]) => `<button type="button" class="btn btn-secondary btn-sm" data-ins="${esc(ins)}" title="${esc(tip || '')}" style="font-family:var(--font-mono); padding:2px 8px;">${esc(label)}</button>`).join('')
      : '';
    return group('الدوال', FUNCS.map(x => [x, x])) +
      group('المدخلات', f.inputs.map(i => [i.key, i.key, i.label])) +
      group('مخرجات سابقة', f.outputs.map(o => [o.key, o.key, o.label])) +
      group('الثوابت', StorageAdapter.getConstants().map(c => [c.key, c.key, `${c.label} = ${c.value} ${c.unit || ''}`]));
  }

  function renderPreview() {
    const box = panel.querySelector('#ft-preview');
    const f = readFormula();
    if (!f.outputs.length) {
      box.innerHTML = '<span style="color:var(--ink-soft);">أضف مُخرجاً بصيغة لتظهر النتيجة هنا.</span>';
      return;
    }
    const values = {};
    f.inputs.forEach(i => { values[i.key] = i.default; });
    const res = evaluateFormula(f, values, { constants: StorageAdapter.getConstants(), tables: StorageAdapter.getTables() });
    if (!res.success) {
      box.innerHTML = `<span style="color:var(--error);">✗ ${esc(res.errorMessage || 'خطأ في الصيغة')}</span>`;
      return;
    }
    box.innerHTML = Object.values(res.outputs).map(o =>
      `<div><strong>${esc(o.label)}</strong> = <span style="font-family:var(--font-mono); color:var(--violet-700);">${esc(o.value)} ${esc(o.unit)}</span></div>`
    ).join('');
  }

  function refresh() {
    panel.querySelector('#ft-chips').innerHTML = chipsHtml();
    renderPreview();
  }

  function insertAtCursor(text) {
    const el = editorEl._lastExpr;
    const hint = panel.querySelector('#ft-hint');
    if (!el || !el.isConnected) { hint.textContent = 'اضغط داخل حقل الصيغة أولاً ثم اختر الزر.'; return; }
    hint.textContent = '';
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? start;
    el.value = el.value.slice(0, start) + text + el.value.slice(end);
    const caret = start + (text.includes('(') ? text.indexOf('(') + 1 : text.length);
    el.focus();
    el.setSelectionRange(caret, caret);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }

  const chipsBox = panel.querySelector('#ft-chips');
  chipsBox.addEventListener('mousedown', e => { if (e.target.closest('[data-ins]')) e.preventDefault(); }); // يبقي المؤشر بالحقل
  chipsBox.addEventListener('click', e => {
    const b = e.target.closest('[data-ins]');
    if (b) insertAtCursor(b.dataset.ins);
  });

  // مستمعات تُربط مرة واحدة فقط على العنصر الثابت editorEl
  editorEl._toolsRefresh = refresh;
  if (!editorEl._toolsBound) {
    editorEl._toolsBound = true;
    editorEl.addEventListener('focusin', e => {
      if (e.target.classList?.contains('out-expr')) editorEl._lastExpr = e.target;
    });
    editorEl.addEventListener('input', () => editorEl._toolsRefresh && editorEl._toolsRefresh());
  }

  // ── 4) معرض الصور ──
  const gallery = document.createElement('fieldset');
  gallery.style.cssText = 'border:1px solid var(--line); border-radius:var(--radius); padding:16px;';
  gallery.innerHTML = `
    <legend style="font-weight:700; color:var(--violet-700); padding:0 8px;">معرض الصور (${draft.galleryAssetIds.length})</legend>
    <div id="ft-gallery" style="display:flex; flex-wrap:wrap; gap:10px;"></div>
    <button type="button" class="btn btn-secondary btn-sm" id="ft-add-gallery" style="margin-top:10px;">+ إضافة صورة للمعرض</button>`;

  const galleryBox = gallery.querySelector('#ft-gallery');
  draft.galleryAssetIds.forEach((id, i) => {
    const item = document.createElement('div');
    item.style.cssText = 'position:relative; width:90px; height:68px; border:1px solid var(--line); border-radius:var(--radius); overflow:hidden; background:var(--bg-soft);';
    item.innerHTML = `<button type="button" data-i="${i}" title="إزالة" style="position:absolute; top:2px; left:2px; z-index:1; border:none; background:#fff; border-radius:50%; width:20px; height:20px; cursor:pointer; color:var(--error);">×</button>`;
    galleryBox.appendChild(item);
    StorageAdapter.getMediaAsset(id).then(a => {
      if (a) item.insertAdjacentHTML('beforeend', `<img src="${a.thumbUrl || a.dataUrl}" alt="" style="width:100%; height:100%; object-fit:cover;">`);
    });
    item.querySelector('button').addEventListener('click', () => {
      syncDraftFromUI();
      draft.galleryAssetIds.splice(i, 1);
      renderEditor();
    });
  });
  gallery.querySelector('#ft-add-gallery').addEventListener('click', () => {
    openMediaPicker({
      onSelect: (asset) => {
        if (asset && !draft.galleryAssetIds.includes(asset.id)) {
          syncDraftFromUI();
          draft.galleryAssetIds.push(asset.id);
          renderEditor();
        }
      }
    });
  });

  editorEl.appendChild(gallery);
  editorEl.appendChild(panel);
  refresh();
}