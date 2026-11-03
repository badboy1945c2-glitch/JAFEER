/**
 * backup.js (واجهة) - تبويب «النسخ الاحتياطي» في لوحة التحكم (المرحلة 13)
 */
import { downloadBackupZip, downloadBackupJson, downloadPublishPackage, parseBackupFile, analyzeImport, importBackupPackage, resetSite } from '../store/backup.js';
import { getBackupSections } from '../store/backup-sections.js';
import { showToast } from '../components/toast.js';

const COLL_AR = { formulas: 'المعادلات', categories: 'التصنيفات', sources: 'المصادر', constants: 'الثوابت', tables: 'الجداول', assets: 'الصور' };
const MOD_AR = { added: 'جديد', same: 'مطابق', changed: 'مختلف' };

export function renderBackupManager(refresh) {
  const el = document.createElement('div');
  const modules = getBackupSections().map((s) => `<li>${s.label}</li>`).join('');
  el.innerHTML = `
    <div class="admin-card-header"><div>
      <h2 style="font-size:1.4rem; color:var(--ink); margin-bottom:4px;">النسخ الاحتياطي</h2>
      <p style="margin:0; font-size:.88rem; color:var(--ink-soft);">كل بيانات الموقع تُحفظ في متصفحك. نزّل نسخة بانتظام.</p>
    </div></div>
    <div style="display:grid; gap:16px; max-width:760px;">
      <div class="card" style="padding:20px; display:grid; gap:10px;">
        <h3 style="margin:0;">تصدير</h3>
        <p style="margin:0; font-size:.88rem; color:var(--ink-soft);">ملف ZIP واحد يحوي: المعادلات والتصنيفات والمصادر والثوابت والجداول والإعدادات وأقسام الرئيسية والصور (ملفات حقيقية)، ومعها:</p>
        <ul style="margin:0; font-size:.88rem;">${modules || '<li>لا توجد وحدات مسجلة</li>'}</ul>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button type="button" class="btn btn-primary" id="bk-zip">تنزيل حزمة الموقع (ZIP)</button>
          <button type="button" class="btn btn-secondary btn-sm" id="bk-json">نسخة JSON (قديمة)</button>
        </div>
        <div id="bk-export-msg" style="font-size:.85rem; color:var(--ink-soft);"></div>
      </div>
            <div class="card" style="padding:20px; display:grid; gap:10px;">
        <h3 style="margin:0;">نشر التغييرات</h3>
        <p style="margin:0; font-size:.88rem; color:var(--ink-soft);">ينشئ ملفات الزوّار (بدون رمز المشرف). الخطوات:</p>
        <ol style="margin:0; font-size:.88rem; line-height:1.9; padding-inline-start:20px;">
          <li>اضغط الزر ونزّل الحزمة وفك ضغطها.</li>
          <li>انسخ <b dir="ltr">seed.json</b> فوق <b dir="ltr">src/data/seed.json</b>.</li>
          <li>انسخ مجلد <b dir="ltr">uploads</b> إلى <b dir="ltr">public/uploads</b> (استبدل ما فيه).</li>
          <li>في الترمنال: <b dir="ltr">git add . ثم git commit -m "تحديث المحتوى" ثم git push</b></li>
          <li>انتظر دقيقة، فيُنشر الموقع تلقائياً على GitHub Pages (تبويب Actions).</li>
        </ol>
        <div><button type="button" class="btn btn-primary" id="bk-publish">تنزيل حزمة النشر</button></div>
        <div id="bk-publish-msg" style="font-size:.85rem; color:var(--ink-soft);"></div>
      </div>
      <div class="card" style="padding:20px; display:grid; gap:10px;">
        <h3 style="margin:0;">استيراد</h3>
        <input type="file" id="bk-file" accept=".zip,.json,application/zip,application/json">
        <div id="bk-analysis"></div>
      </div>
      <div class="card" style="padding:20px; display:grid; gap:10px;">
        <h3 style="margin:0;">إعادة الضبط</h3>
        <p style="margin:0; font-size:.88rem; color:var(--ink-soft);">تمسح كل بياناتك وصورك وتعيد المحتوى الابتدائي. نزّل نسخة قبلها.</p>
        <div><button type="button" class="btn btn-ghost" id="bk-reset" style="color:var(--error);">إعادة ضبط الموقع</button></div>
      </div>
    </div>`;
  const $ = (s) => el.querySelector(s);

  $('#bk-zip').addEventListener('click', async () => {
    try {
      const r = await downloadBackupZip();
      $('#bk-export-msg').textContent = `نُزّلت الحزمة (${r.assets} صورة، ${(r.bytes / 1024).toFixed(0)} ك.ب).`;
    } catch (err) { showToast('تعذر إنشاء الحزمة: ' + err.message, { type: 'error' }); }
  });
  $('#bk-json').addEventListener('click', () => downloadBackupJson());
  $('#bk-publish').addEventListener('click', async () => {
    try {
      const r = await downloadPublishPackage();
      $('#bk-publish-msg').textContent = `نُزّلت حزمة النشر (${r.assets} صورة، ${(r.bytes / 1024).toFixed(0)} ك.ب).`;
    } catch (err) { showToast('تعذر إنشاء حزمة النشر: ' + err.message, { type: 'error' }); }
  });
  let current = null;
  $('#bk-file').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    const box = $('#bk-analysis');
    box.innerHTML = '';
    if (!file) return;
    try {
      const res = await analyzeImport(await parseBackupFile(file));
      if (!res.ok) { box.innerHTML = `<div class="soil-warn" role="alert" style="color:var(--error);">${res.errors.join('<br>')}</div>`; return; }
      current = res;
      const c = res.conflicts;
      const rows = Object.entries(c.collections).map(([k, v]) =>
        `<tr><td>${COLL_AR[k]}</td><td>${v.added.length}</td><td>${v.same.length}</td><td style="${v.changed.length ? 'color:var(--error);font-weight:700;' : ''}">${v.changed.length}</td></tr>`).join('');
      const mods = Object.entries(c.modules).map(([k, v]) => `<li>${k}: ${MOD_AR[v]}</li>`).join('');
      box.innerHTML = `
        <table style="width:100%; font-size:.88rem; border-collapse:collapse;"><thead><tr><th style="text-align:start">العنصر</th><th style="text-align:start">جديد</th><th style="text-align:start">مطابق</th><th style="text-align:start">متعارض</th></tr></thead><tbody>${rows}</tbody></table>
        <div style="font-size:.85rem; margin-top:6px;">الإعدادات: ${c.settingsChanged ? '<b style="color:var(--error)">مختلفة</b>' : 'مطابقة'} | أقسام الرئيسية: ${c.homeChanged ? '<b style="color:var(--error)">مختلفة</b>' : 'مطابقة'}</div>
        ${mods ? `<ul style="font-size:.85rem; margin:6px 0;">${mods}</ul>` : ''}
        <div style="display:grid; gap:6px; margin-top:10px;">
          <label><input type="radio" name="bk-mode" value="merge" checked> <b>دمج</b>: يضيف الجديد ويحدّث المتعارض بقيمة الحزمة، ولا يحذف شيئاً عندك.</label>
          <label><input type="radio" name="bk-mode" value="replace"> <b>استبدال</b>: يمسح كل بيانات الموقع الحالية ويضع بدلها ما في الحزمة.</label>
        </div>
        <div style="margin-top:10px;"><button type="button" class="btn btn-primary" id="bk-apply">تطبيق الاستيراد</button></div>`;
      $('#bk-apply').addEventListener('click', applyImport);
    } catch (err) { box.innerHTML = `<div style="color:var(--error);" role="alert">${err.message}</div>`; }
  });

  async function applyImport() {
    const mode = el.querySelector('input[name="bk-mode"]:checked').value;
    if (mode === 'replace') {
      if (!confirm('الاستبدال يمسح كل بيانات الموقع وصوره الحالية. هل تريد المتابعة؟')) return;
      if (!confirm('تأكيد أخير: لا يمكن التراجع عن الاستبدال (إلا بنسخة احتياطية). متابعة؟')) return;
    }
    const r = await importBackupPackage(current.pkg, { mode });
    if (!r.success) { showToast(r.message, { type: 'error' }); return; }
    showToast(r.message, { type: 'success' });
    window.dispatchEvent(new Event('site-settings-changed'));
    setTimeout(() => location.reload(), 700);
  }

  $('#bk-reset').addEventListener('click', async () => {
    if (!confirm('سيُمسح كل شيء (معادلات، تصنيفات، صور، إعدادات) ويعود المحتوى الابتدائي. متابعة؟')) return;
    if (!confirm('تأكيد أخير: هل نزّلت نسخة احتياطية؟ سيتم المسح الآن.')) return;
    await resetSite();
    location.reload();
  });

  return el;
}