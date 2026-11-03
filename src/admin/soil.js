/**
 * soil.js (لوحة التحكم) - تحرير بيانات وحدة ميكانيك التربة: الترجمات، الملاحظات، الأمثلة الإضافية
 * القواعد والقوانين مقفلة ولا تظهر هنا. كل تعديل يُحفظ فوراً.
 */
import { getSoilCustom, saveSoilCustom } from '../modules/soil-mechanics/custom-store.js';
import names from '../modules/soil-mechanics/data/uscs-names.json';
import usda from '../modules/soil-mechanics/data/usda.json';
import { showToast } from '../components/toast.js';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const SUGGEST = [...new Set([...Object.values(names.coarseNames).flat(), ...Object.values(names.fineBaseNames), ...usda.rules.map((r) => r.name)])];
const uid = (p) => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

export function renderSoilAdmin() {
  const data = getSoilCustom();
  const el = document.createElement('div');
  const save = () => { saveSoilCustom(data); showToast('حُفظ.', { type: 'success' }); };

  function draw() {
    el.innerHTML = `
      <div class="admin-card-header"><div>
        <h2 style="font-size:1.4rem; color:var(--ink); margin-bottom:4px;">وحدة ميكانيك التربة</h2>
        <p style="margin:0; font-size:.88rem; color:var(--ink-soft);">تحرير الترجمات والملاحظات والأمثلة الإضافية. القوانين وقواعد التصنيف مقفلة (من المحاضرة).</p>
      </div></div>
      <div style="display:grid; gap:16px; max-width:820px;">
        <div class="card" style="padding:20px; display:grid; gap:10px;">
          <h3 style="margin:0;">الترجمات العربية للأسماء</h3>
          <datalist id="sa-en">${SUGGEST.map((n) => `<option value="${esc(n)}">`).join('')}</datalist>
          ${Object.entries(data.translations).map(([en, ar]) => `
            <div style="display:flex; gap:8px; align-items:center;">
              <span dir="ltr" style="flex:1; font-size:.9rem;">${esc(en)}</span>
              <input class="form-input" style="flex:1;" data-tr="${esc(en)}" value="${esc(ar)}">
              <button type="button" class="btn btn-ghost btn-sm" data-del-tr="${esc(en)}" style="color:var(--error);">حذف</button>
            </div>`).join('') || '<div style="font-size:.85rem; color:var(--ink-soft);">لا ترجمات معدّلة بعد، فيُستخدم الاسم المترجم تلقائياً.</div>'}
          <div style="display:flex; gap:8px;">
            <input class="form-input" dir="ltr" list="sa-en" id="sa-new-en" placeholder="الاسم الإنجليزي (مثل Sandy lean clay)" style="flex:1;">
            <input class="form-input" id="sa-new-ar" placeholder="الترجمة العربية" style="flex:1;">
            <button type="button" class="btn btn-secondary btn-sm" id="sa-add-tr">إضافة</button>
          </div>
        </div>
        <div class="card" style="padding:20px; display:grid; gap:10px;">
          <h3 style="margin:0;">الملاحظات</h3>
          ${data.notes.map((n) => `
            <div style="display:grid; gap:6px; border:1px solid var(--line); border-radius:var(--radius); padding:10px;">
              <input class="form-input" data-note="${n.id}" data-f="title" value="${esc(n.title)}" placeholder="عنوان الملاحظة">
              <textarea class="form-textarea" rows="2" data-note="${n.id}" data-f="text" placeholder="نص الملاحظة">${esc(n.text)}</textarea>
              <div><button type="button" class="btn btn-ghost btn-sm" data-del-note="${n.id}" style="color:var(--error);">حذف</button></div>
            </div>`).join('')}
          <div><button type="button" class="btn btn-secondary btn-sm" id="sa-add-note">+ ملاحظة</button></div>
        </div>
        <div class="card" style="padding:20px; display:grid; gap:10px;">
          <h3 style="margin:0;">أمثلة إضافية</h3>
          <div style="font-size:.85rem; color:var(--ink-soft);">اكتب المعطيات بصيغة <span dir="ltr">P4=70, F200=30, LL=33, PL=12</span> (للتصنيف) أو <span dir="ltr">gamma=19.8, G=2.7, w=11</span> (للقوانين).</div>
          ${data.examples.map((x) => `
            <div style="display:grid; gap:6px; border:1px solid var(--line); border-radius:var(--radius); padding:10px;">
              <input class="form-input" data-ex="${x.id}" data-f="title" value="${esc(x.title)}" placeholder="اسم المثال">
              <input class="form-input" dir="ltr" data-ex="${x.id}" data-f="inputs" value="${esc(x.inputs)}" placeholder="P4=70, F200=30, LL=33, PL=12">
              <div><button type="button" class="btn btn-ghost btn-sm" data-del-ex="${x.id}" style="color:var(--error);">حذف</button></div>
            </div>`).join('')}
          <div><button type="button" class="btn btn-secondary btn-sm" id="sa-add-ex">+ مثال</button></div>
        </div>
      </div>`;
  }

  el.addEventListener('change', (e) => {
    const d = e.target.dataset;
    if (d.tr) { data.translations[d.tr] = e.target.value.trim(); save(); }
    else if (d.note) { data.notes.find((n) => n.id === d.note)[d.f] = e.target.value; save(); }
    else if (d.ex) { data.examples.find((x) => x.id === d.ex)[d.f] = e.target.value; save(); }
  });
  el.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return; const d = b.dataset;
    if (b.id === 'sa-add-tr') {
      const en = el.querySelector('#sa-new-en').value.trim(), ar = el.querySelector('#sa-new-ar').value.trim();
      if (!en || !ar) { showToast('اكتب الاسم الإنجليزي والترجمة.', { type: 'error' }); return; }
      data.translations[en] = ar; save(); draw();
    } else if (d.delTr) { delete data.translations[d.delTr]; save(); draw(); }
    else if (b.id === 'sa-add-note') { data.notes.push({ id: uid('note'), title: '', text: '' }); save(); draw(); }
    else if (d.delNote) { data.notes = data.notes.filter((n) => n.id !== d.delNote); save(); draw(); }
    else if (b.id === 'sa-add-ex') { data.examples.push({ id: uid('ex'), title: '', inputs: '' }); save(); draw(); }
    else if (d.delEx) { data.examples = data.examples.filter((x) => x.id !== d.delEx); save(); draw(); }
  });

  draw();
  return el;
}