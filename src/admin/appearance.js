/**
 * appearance.js - لوحة «مظهر الموقع» و«الصفحة الرئيسية» (المرحلة 12)
 */
import { StorageAdapter } from '../store/adapter.js';
import { showToast } from '../components/toast.js';
import { openMediaPicker } from '../media/picker.js';
import { COLOR_PRESETS } from '../site-settings.js';

// صف اختيار صورة (معاينة + اختر + إزالة)
function pickerRow(host, label, initialId, onChange) {
  let id = initialId;
  host.innerHTML = `
    <label class="form-label">${label}</label>
    <div style="display:flex; gap:10px; align-items:center;">
      <div class="ap-thumb" style="width:64px; height:48px; border:1px dashed var(--line); border-radius:var(--radius); overflow:hidden; background:var(--bg-soft);"></div>
      <button type="button" class="btn btn-secondary btn-sm ap-pick">اختر صورة</button>
      <button type="button" class="btn btn-ghost btn-sm ap-clear" style="color:var(--error);">إزالة</button>
    </div>`;
  const thumb = host.querySelector('.ap-thumb');
  async function draw() {
    thumb.innerHTML = '';
    if (!id) return;
    const a = await StorageAdapter.getMediaAsset(id);
    if (a) thumb.innerHTML = `<img src="${a.thumbUrl || a.dataUrl}" alt="" style="width:100%; height:100%; object-fit:cover;">`;
  }
  host.querySelector('.ap-pick').addEventListener('click', () => {
    openMediaPicker({
      currentAssetId: id,
      onSelect: (a) => { if (a) { id = a.id; onChange(id); draw(); } }
    });
  });
  host.querySelector('.ap-clear').addEventListener('click', () => { id = null; onChange(null); draw(); });
  draw();
}

// ───────────── مظهر الموقع ─────────────
export function renderAppearanceManager(refresh) {
  const s = StorageAdapter.getSettings();
  const state = {
    logo: s.logoAssetId || null,
    favicon: s.faviconAssetId || null,
    hero: (s.heroBackgroundAssetIds && s.heroBackgroundAssetIds[0]) || null
  };
  const el = document.createElement('div');

  const palette = Object.entries(COLOR_PRESETS).map(([key, p]) => `
    <label style="display:flex; align-items:center; gap:6px; cursor:pointer; padding:6px 10px; border:1px solid var(--line); border-radius:var(--radius);">
      <input type="radio" name="ap-color" value="${key}" ${(s.colorPreset || 'violet') === key ? 'checked' : ''}>
      <span style="width:18px; height:18px; border-radius:50%; background:${p.vars[600]};"></span>${p.label}
    </label>`).join('');

  el.innerHTML = `
    <div class="admin-card-header">
      <div>
        <h2 style="font-size:1.4rem; color:var(--ink); margin-bottom:4px;">مظهر الموقع</h2>
        <p style="margin:0; font-size:.88rem; color:var(--ink-soft);">أي تغيير هنا يظهر في الموقع بعد الحفظ مباشرة.</p>
      </div>
    </div>
    <div class="card" style="padding:20px; display:grid; gap:16px; max-width:720px;">
      <div class="form-group"><label class="form-label">اسم الموقع</label><input id="ap-name" class="form-input"></div>
      <div class="form-group"><label class="form-label">الوصف المختصر (يظهر بالرئيسية)</label><input id="ap-tagline" class="form-input"></div>
      <div class="form-group"><label class="form-label">نص التذييل</label><textarea id="ap-footer" class="form-textarea" rows="2"></textarea></div>
      <div class="form-group"><label class="form-label">اللون الأساسي</label><div style="display:flex; flex-wrap:wrap; gap:8px;">${palette}</div></div>
      <div class="form-group" id="ap-logo"></div>
      <div class="form-group" id="ap-favicon"></div>
      <div class="form-group" id="ap-hero"></div>
      <div class="form-group">
        <label class="form-label">شدة التغطية فوق خلفية الهيرو: <span id="ap-overlay-val"></span>%</label>
        <input type="range" id="ap-overlay" min="0" max="90" step="5" style="width:100%;">
      </div>
      <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
        <input type="checkbox" id="ap-anim"> تشغيل الحركات والتأثيرات
      </label>
      <div><button type="button" class="btn btn-primary" id="ap-save">حفظ المظهر</button></div>
    </div>`;

  el.querySelector('#ap-name').value = s.siteName || '';
  el.querySelector('#ap-tagline').value = s.tagline || '';
  el.querySelector('#ap-footer').value = s.footerText || '';
  el.querySelector('#ap-anim').checked = s.animationsEnabled !== false;
  const range = el.querySelector('#ap-overlay');
  const rangeVal = el.querySelector('#ap-overlay-val');
  range.value = Math.round((s.heroOverlayOpacity ?? 0.55) * 100);
  rangeVal.textContent = range.value;
  range.addEventListener('input', () => { rangeVal.textContent = range.value; });

  pickerRow(el.querySelector('#ap-logo'), 'الشعار (يستبدل الأيقونة الافتراضية)', state.logo, v => { state.logo = v; });
  pickerRow(el.querySelector('#ap-favicon'), 'أيقونة المتصفح (Favicon)', state.favicon, v => { state.favicon = v; });
  pickerRow(el.querySelector('#ap-hero'), 'خلفية الهيرو في الرئيسية', state.hero, v => { state.hero = v; });

  el.querySelector('#ap-save').addEventListener('click', () => {
    const name = el.querySelector('#ap-name').value.trim();
    if (!name) { showToast('اسم الموقع مطلوب.', { type: 'error' }); return; }
    const preset = el.querySelector('input[name="ap-color"]:checked')?.value || 'violet';
    StorageAdapter.updateSettings({
      siteName: name,
      tagline: el.querySelector('#ap-tagline').value.trim(),
      footerText: el.querySelector('#ap-footer').value.trim(),
      colorPreset: preset,
      primaryColor: COLOR_PRESETS[preset].vars[600],
      logoAssetId: state.logo,
      faviconAssetId: state.favicon,
      heroBackgroundAssetIds: state.hero ? [state.hero] : [],
      heroOverlayOpacity: Number(range.value) / 100,
      animationsEnabled: el.querySelector('#ap-anim').checked
    });
    window.dispatchEvent(new Event('site-settings-changed'));
    showToast('تم حفظ مظهر الموقع.', { type: 'success' });
  });

  return el;
}

// ───────────── أقسام الصفحة الرئيسية ─────────────
const TYPE_LABELS = {
  hero: 'الهيرو', stats: 'الإحصائيات', categories: 'التصنيفات', 'latest-formulas': 'أحدث المعادلات',
  gallery: 'المعرض', about: 'عن الموقع', 'sources-preview': 'معاينة المصادر', 'custom-text': 'نص مخصص',  modules: 'الوحدات المتخصصة',
};

export function renderHomeSectionsManager(refresh) {
  let sections = StorageAdapter.getHomeSections()
    .map(s => ({ ...s }))
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  const el = document.createElement('div');

  function draw() {
    el.innerHTML = `
      <div class="admin-card-header">
        <div>
          <h2 style="font-size:1.4rem; color:var(--ink); margin-bottom:4px;">أقسام الصفحة الرئيسية</h2>
          <p style="margin:0; font-size:.88rem; color:var(--ink-soft);">رتّب الأقسام بالأسهم، أخفِ ما لا تريده، وعدّل عناوينها.</p>
        </div>
        <button type="button" class="btn btn-primary btn-sm" id="hs-save">حفظ الترتيب</button>
      </div>
      <div style="display:grid; gap:10px; max-width:720px;">
        ${sections.map((s, i) => `
          <div class="card" style="padding:12px; display:flex; gap:10px; align-items:center; ${s.enabled === false ? 'opacity:.55;' : ''}">
            <div style="display:flex; flex-direction:column; gap:2px;">
              <button type="button" class="btn btn-ghost btn-sm" data-up="${i}" ${i === 0 ? 'disabled' : ''}>▲</button>
              <button type="button" class="btn btn-ghost btn-sm" data-down="${i}" ${i === sections.length - 1 ? 'disabled' : ''}>▼</button>
            </div>
            <div style="flex:1;">
              <div style="font-size:.75rem; color:var(--violet-700); margin-bottom:4px;">${TYPE_LABELS[s.type] || s.type}</div>
              <input class="form-input" data-title="${i}" placeholder="عنوان القسم">
            </div>
            <label style="display:flex; align-items:center; gap:6px; cursor:pointer; white-space:nowrap;">
              <input type="checkbox" data-enabled="${i}" ${s.enabled !== false ? 'checked' : ''}> ظاهر
            </label>
          </div>`).join('')}
      </div>`;

    el.querySelectorAll('[data-title]').forEach(inp => {
      const i = Number(inp.dataset.title);
      inp.value = sections[i].title || '';
      inp.addEventListener('input', () => { sections[i].title = inp.value; });
    });
    el.querySelectorAll('[data-enabled]').forEach(cb => {
      cb.addEventListener('change', () => { sections[Number(cb.dataset.enabled)].enabled = cb.checked; draw(); });
    });
    const swap = (i, j) => { [sections[i], sections[j]] = [sections[j], sections[i]]; draw(); };
    el.querySelectorAll('[data-up]').forEach(b => b.addEventListener('click', () => swap(Number(b.dataset.up), Number(b.dataset.up) - 1)));
    el.querySelectorAll('[data-down]').forEach(b => b.addEventListener('click', () => swap(Number(b.dataset.down), Number(b.dataset.down) + 1)));

    el.querySelector('#hs-save').addEventListener('click', () => {
      sections.forEach((s, i) => { s.order = i + 1; });
      StorageAdapter.saveHomeSections(sections);
      showToast('تم حفظ ترتيب أقسام الرئيسية.', { type: 'success' });
    });
  }

  draw();
  return el;
}