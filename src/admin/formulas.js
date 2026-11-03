/**
 * formulas.js - محرر المعادلات الهندسية في لوحة التحكم
 * 
 * يُتيح إضافة وتعديل وحذف المعادلات مع بناء المدخلات والمخرجات بصرياً،
 * وربط التصنيفات والمصادر والوسائط، وفحص صحة التعبيرات الرياضية فورياً.
 */

import { StorageAdapter } from '../store/adapter.js';
import { openModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import { openMediaPicker } from '../media/picker.js';
import { compile } from 'mathjs';
import { mountBuilderTools } from './formula-tools.js';
// ─── ثوابت الحالات ──────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { value: 'published', label: 'منشور', badgeClass: 'badge-published' },
  { value: 'draft', label: 'مسودة', badgeClass: 'badge-sample' },
];

// ─── عرض جدول المعادلات الرئيسي ─────────────────────────────────────────────
export function renderFormulasManager(refreshDashboard) {
  const container = document.createElement('div');
  const formulas = StorageAdapter.getFormulas();
  const categories = StorageAdapter.getCategories();

  // حالة الفلتر والبحث
  let searchTerm = '';
  let filterCategory = '';

  function getFiltered() {
    return formulas.filter(f => {
      const matchSearch = !searchTerm ||
        f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.tags || []).some(t => t.includes(searchTerm));
      const matchCat = !filterCategory || f.categoryId === filterCategory;
      return matchSearch && matchCat;
    });
  }

  function render() {
    const filtered = getFiltered();

    container.innerHTML = `
      <div class="admin-card-header">
        <div>
          <h2 style="font-size: 1.4rem; color: var(--ink); margin-bottom: 4px;">محرر المعادلات الهندسية</h2>
          <p style="margin: 0; font-size: 0.88rem; color: var(--ink-soft);">إنشاء وتعديل وحذف المعادلات والصيغ الحسابية في الموقع.</p>
        </div>
        <button class="btn btn-primary btn-sm" id="btn-add-formula">
          + إضافة معادلة جديدة
        </button>
      </div>

      <!-- شريط البحث والفلترة -->
      <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 20px; flex-wrap: wrap;">
        <input 
          type="text" 
          id="formula-search" 
          class="form-input" 
          placeholder="ابحث بالعنوان أو المعرّف أو الوسم..." 
          style="max-width: 280px; padding: 8px 12px; font-size: 0.88rem;"
          value="${searchTerm}"
        />
        <select id="formula-filter-cat" class="form-input" style="max-width: 200px; padding: 8px 12px; font-size: 0.88rem;">
          <option value="">جميع التصنيفات</option>
          ${categories.map(c => `<option value="${c.id}" ${filterCategory === c.id ? 'selected' : ''}>${c.title}</option>`).join('')}
        </select>
        <span style="font-size: 0.82rem; color: var(--ink-soft);">عرض ${filtered.length} من ${formulas.length}</span>
      </div>

      <!-- جدول المعادلات -->
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th style="width: 60px;">الحالة</th>
              <th>المعرّف</th>
              <th>عنوان المعادلة</th>
              <th>التصنيف</th>
              <th>المدخلات</th>
              <th>المخرجات</th>
              <th style="text-align: left;">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.length === 0 ? `
              <tr>
                <td colspan="7" style="text-align: center; padding: 30px; color: var(--ink-soft);">
                  ${searchTerm || filterCategory ? 'لا توجد نتائج مطابقة للبحث.' : 'لا توجد معادلات بعد. ابدأ بإضافة معادلتك الأولى!'}
                </td>
              </tr>
            ` : filtered.map(f => {
              const cat = categories.find(c => c.id === f.categoryId);
              const statusOpt = STATUS_OPTIONS.find(s => s.value === f.status) || STATUS_OPTIONS[0];
              return `
                <tr>
                  <td>
                    ${f.isSample
                      ? '<span class="badge badge-sample">تجريبي</span>'
                      : `<span class="badge ${statusOpt.badgeClass}">${statusOpt.label}</span>`
                    }
                  </td>
                  <td><code style="color: var(--violet-700); font-size: 0.82rem;">${f.id}</code></td>
                  <td style="font-weight: 600;">${f.title}</td>
                  <td><span class="badge badge-category">${cat ? cat.title : 'بدون تصنيف'}</span></td>
                  <td style="font-family: var(--font-mono); font-weight: 600;">${(f.inputs || []).length}</td>
                  <td style="font-family: var(--font-mono); font-weight: 600;">${(f.outputs || []).length}</td>
                  <td style="text-align: left;">
                    <button class="btn btn-secondary btn-sm btn-edit-formula" data-id="${f.id}">تعديل</button>
                    <button class="btn btn-sm btn-duplicate-formula" data-id="${f.id}" style="background: var(--violet-50); color: var(--violet-700); border: 1px solid var(--violet-200);">نسخ</button>
                    <button class="btn btn-danger btn-sm btn-delete-formula" data-id="${f.id}">حذف</button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    // أحداث البحث والفلترة
    container.querySelector('#formula-search')?.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim();
      render();
    });

    container.querySelector('#formula-filter-cat')?.addEventListener('change', (e) => {
      filterCategory = e.target.value;
      render();
    });

    // إضافة معادلة
    container.querySelector('#btn-add-formula')?.addEventListener('click', () => {
      openFormulaEditor(null, refreshDashboard);
    });

    // تعديل
    container.querySelectorAll('.btn-edit-formula').forEach(btn => {
      btn.addEventListener('click', () => {
        const f = StorageAdapter.getFormula(btn.getAttribute('data-id'));
        if (f) openFormulaEditor(f, refreshDashboard);
      });
    });

    // نسخ / تكرار
    container.querySelectorAll('.btn-duplicate-formula').forEach(btn => {
      btn.addEventListener('click', () => {
        const original = StorageAdapter.getFormula(btn.getAttribute('data-id'));
        if (!original) return;
        const clone = {
          ...JSON.parse(JSON.stringify(original)),
          id: original.id + '-copy-' + Date.now().toString(36).slice(-4),
          title: original.title + ' (نسخة)',
          status: 'draft',
          isSample: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        try {
          StorageAdapter.saveFormula(clone);
          showToast(`تم نسخ المعادلة "${original.title}" بنجاح.`, { type: 'success' });
          refreshDashboard();
        } catch (err) {
          showToast(err.message, { type: 'error' });
        }
      });
    });

    // حذف
    container.querySelectorAll('.btn-delete-formula').forEach(btn => {
      btn.addEventListener('click', () => {
        const f = StorageAdapter.getFormula(btn.getAttribute('data-id'));
        if (!f) return;

        openModal({
          title: `حذف المعادلة: ${f.title}`,
          content: `<p>هل أنت متأكد من حذف هذه المعادلة؟ لا يمكن التراجع عن هذه الخطوة إلا خلال 10 ثوانٍ.</p>`,
          confirmText: 'نعم، احذف',
          onConfirm: () => {
            StorageAdapter.deleteFormula(f.id);
            refreshDashboard();
            showToast(`تم حذف المعادلة "${f.title}".`, {
              type: 'info',
              duration: 10000,
              onUndo: () => {
                StorageAdapter.saveFormula(f);
                refreshDashboard();
                showToast('تمت استعادة المعادلة بنجاح.', { type: 'success' });
              }
            });
          }
        });
      });
    });
  }

  render();
  return container;
}

// ─── فحص صحة تعبير رياضي ─────────────────────────────────────────────────────
function testExpression(expression, availableKeys = []) {
  try {
    const scope = {};
    availableKeys.forEach(k => { scope[k] = 1; });
    scope.lookup = () => 1;
    const compiled = compile(expression);
    compiled.evaluate(scope);
    return { valid: true, error: null };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}

// ─── محرر المعادلة الكامل (نافذة منبثقة كبيرة) ──────────────────────────────
function openFormulaEditor(existingFormula, onSuccess) {
  const isEdit = Boolean(existingFormula);
  const categories = StorageAdapter.getCategories();
  const sources = StorageAdapter.getSources();

  // بيانات العمل (نسخة عميقة للتعديل أو كائن جديد)
  const draft = existingFormula
    ? JSON.parse(JSON.stringify(existingFormula))
    : {
        id: '',
        title: '',
        categoryId: categories.length > 0 ? categories[0].id : '',
        description: '',
        coverAssetId: null,
        galleryAssetIds: [],
        inputs: [],
        outputs: [],
        sourceIds: [],
        tags: [],
        notes: '',
        status: 'draft',
        isSample: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

  // عنصر الحاوية الرئيسية
  const editorEl = document.createElement('div');
  editorEl.style.cssText = 'display: flex; flex-direction: column; gap: 20px; max-height: 70vh; overflow-y: auto; padding: 4px;';

  let activeModal = null;

  function renderEditor() {
    // جمع جميع مفاتيح المدخلات المتاحة للمخرجات
    const inputKeys = draft.inputs.map(i => i.key).filter(Boolean);
    const outputKeys = draft.outputs.map(o => o.key).filter(Boolean);
    const allKeys = [...inputKeys, ...outputKeys];

    editorEl.innerHTML = `
      <!-- ═══ القسم 1: البيانات الأساسية ═══ -->
      <fieldset style="border: 1px solid var(--line); border-radius: var(--radius); padding: 16px;">
        <legend style="font-weight: 700; color: var(--violet-700); padding: 0 8px;">البيانات الأساسية</legend>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          <div class="form-group">
            <label class="form-label">المعرّف الفريد (ID بالإنجليزية)</label>
            <input type="text" class="form-input" id="fe-id" value="${draft.id}" ${isEdit ? 'disabled' : ''} placeholder="beam-moment-max" required />
            <small style="color: var(--ink-soft);">يُستخدم في الرابط، مثال: beam-moment-max</small>
          </div>

          <div class="form-group">
            <label class="form-label">الحالة</label>
            <select class="form-input" id="fe-status">
              ${STATUS_OPTIONS.map(s => `<option value="${s.value}" ${draft.status === s.value ? 'selected' : ''}>${s.label}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">عنوان المعادلة (بالعربية)</label>
          <input type="text" class="form-input" id="fe-title" value="${draft.title}" placeholder="العزم الأقصى في عتبة بسيطة الإسناد" required />
        </div>

        <div class="form-group">
          <label class="form-label">الوصف</label>
          <textarea class="form-textarea" id="fe-desc" rows="2" placeholder="وصف مختصر لما تحسبه هذه المعادلة...">${draft.description || ''}</textarea>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          <div class="form-group">
            <label class="form-label">التصنيف</label>
            <select class="form-input" id="fe-category">
              <option value="">— بدون تصنيف —</option>
              ${categories.map(c => `<option value="${c.id}" ${draft.categoryId === c.id ? 'selected' : ''}>${c.title}</option>`).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">المصادر المرجعية</label>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              ${sources.map(s => `
                <label style="display: flex; align-items: center; gap: 4px; font-size: 0.85rem; cursor: pointer;">
                  <input type="checkbox" class="fe-source-check" value="${s.id}" ${(draft.sourceIds || []).includes(s.id) ? 'checked' : ''} />
                  ${s.title}
                </label>
              `).join('')}
              ${sources.length === 0 ? '<span style="font-size: 0.82rem; color: var(--ink-soft);">لا توجد مصادر. أضف مصادر من تبويب المصادر أولاً.</span>' : ''}
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">الوسوم (اضغط Enter لإضافة وسم)</label>
          <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center; border: 1px solid var(--line); border-radius: var(--radius); padding: 6px 10px; min-height: 38px;">
            ${(draft.tags || []).map((tag, idx) => `
              <span class="badge badge-category" style="display: inline-flex; align-items: center; gap: 4px;">
                ${tag}
                <button type="button" class="fe-remove-tag" data-idx="${idx}" style="background: none; border: none; cursor: pointer; color: var(--error); font-size: 1rem; line-height: 1; padding: 0;">×</button>
              </span>
            `).join('')}
            <input type="text" id="fe-tag-input" placeholder="أضف وسمًا..." style="border: none; outline: none; flex: 1; min-width: 100px; font-size: 0.85rem; background: transparent;" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">ملاحظات وفرضيات</label>
          <textarea class="form-textarea" id="fe-notes" rows="2" placeholder="ملاحظات عن شروط الاستخدام والفرضيات...">${draft.notes || ''}</textarea>
        </div>

        <!-- صورة الغلاف -->
        <div class="form-group">
          <label class="form-label">صورة الغلاف</label>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div id="fe-cover-preview" style="width: 80px; height: 60px; border-radius: var(--radius); border: 1px dashed var(--line); display: flex; align-items: center; justify-content: center; overflow: hidden; background: var(--bg-soft);">
              ${draft.coverAssetId 
                ? '<span style="font-size: 0.72rem; color: var(--violet-700);">جاري التحميل...</span>'
                : '<span style="font-size: 0.72rem; color: var(--ink-soft);">بدون صورة</span>'
              }
            </div>
            <button type="button" class="btn btn-secondary btn-sm" id="fe-pick-cover">اختر صورة</button>
            ${draft.coverAssetId ? '<button type="button" class="btn btn-ghost btn-sm" id="fe-remove-cover" style="color: var(--error);">إزالة</button>' : ''}
          </div>
        </div>
      </fieldset>

      <!-- ═══ القسم 2: المدخلات ═══ -->
      <fieldset style="border: 1px solid var(--line); border-radius: var(--radius); padding: 16px;">
        <legend style="font-weight: 700; color: var(--violet-700); padding: 0 8px;">
          المدخلات (${draft.inputs.length})
        </legend>
        
        <div id="fe-inputs-list" style="display: flex; flex-direction: column; gap: 10px;">
          ${draft.inputs.map((inp, idx) => renderInputRow(inp, idx)).join('')}
        </div>

        <button type="button" class="btn btn-secondary btn-sm" id="fe-add-input" style="margin-top: 10px;">
          + إضافة مُدخل جديد
        </button>
      </fieldset>

      <!-- ═══ القسم 3: المخرجات ═══ -->
      <fieldset style="border: 1px solid var(--line); border-radius: var(--radius); padding: 16px;">
        <legend style="font-weight: 700; color: var(--violet-700); padding: 0 8px;">
          المخرجات والصيغ الحسابية (${draft.outputs.length})
        </legend>

        <div id="fe-outputs-list" style="display: flex; flex-direction: column; gap: 14px;">
          ${draft.outputs.map((out, idx) => renderOutputRow(out, idx, allKeys)).join('')}
        </div>

        <button type="button" class="btn btn-secondary btn-sm" id="fe-add-output" style="margin-top: 10px;">
          + إضافة مُخرج جديد
        </button>

        <div style="margin-top: 12px;">
          <button type="button" class="btn btn-sm" id="fe-test-expressions" style="background: var(--success); color: #fff;">
            🧪 فحص صحة جميع الصيغ
          </button>
          <span id="fe-test-result" style="font-size: 0.82rem; margin-right: 10px;"></span>
        </div>
      </fieldset>
    `;

    // ─── ربط الأحداث ───────────────────────────────────────────────────────

    // تحميل معاينة صورة الغلاف
    if (draft.coverAssetId) {
      loadCoverPreview(draft.coverAssetId, editorEl.querySelector('#fe-cover-preview'));
    }

    // اختيار صورة غلاف
    editorEl.querySelector('#fe-pick-cover')?.addEventListener('click', () => {
      syncDraftFromUI();
      openMediaPicker({
        currentAssetId: draft.coverAssetId,
        onSelect: (asset) => {
          draft.coverAssetId = asset ? asset.id : null;
          renderEditor();
        }
      });
    });

    // إزالة صورة الغلاف
    editorEl.querySelector('#fe-remove-cover')?.addEventListener('click', () => {
      draft.coverAssetId = null;
      renderEditor();
    });

    // الوسوم
    editorEl.querySelector('#fe-tag-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const val = e.target.value.trim();
        if (val && !(draft.tags || []).includes(val)) {
          syncDraftFromUI();
          draft.tags = [...(draft.tags || []), val];
          renderEditor();
        }
      }
    });

    editorEl.querySelectorAll('.fe-remove-tag').forEach(btn => {
      btn.addEventListener('click', () => {
        syncDraftFromUI();
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        draft.tags.splice(idx, 1);
        renderEditor();
      });
    });

    // إضافة مُدخل
    editorEl.querySelector('#fe-add-input')?.addEventListener('click', () => {
      syncDraftFromUI();
      draft.inputs.push({
        key: '',
        label: '',
        unit: '',
        default: 0,
        min: null,
        max: null,
        hint: ''
      });
      renderEditor();
    });

    // حذف مُدخل
    editorEl.querySelectorAll('.fe-remove-input').forEach(btn => {
      btn.addEventListener('click', () => {
        syncDraftFromUI();
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        draft.inputs.splice(idx, 1);
        renderEditor();
      });
    });

    // إضافة مُخرج
    editorEl.querySelector('#fe-add-output')?.addEventListener('click', () => {
      syncDraftFromUI();
      draft.outputs.push({
        key: '',
        label: '',
        unit: '',
        expression: '',
        latex: '',
        decimals: 2
      });
      renderEditor();
    });

    // حذف مُخرج
    editorEl.querySelectorAll('.fe-remove-output').forEach(btn => {
      btn.addEventListener('click', () => {
        syncDraftFromUI();
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        draft.outputs.splice(idx, 1);
        renderEditor();
      });
    });

    // فحص صحة الصيغ
    editorEl.querySelector('#fe-test-expressions')?.addEventListener('click', () => {
      syncDraftFromUI();
      const keys = draft.inputs.map(i => i.key).filter(Boolean);
      const allAvailable = [...keys];
      let allValid = true;
      let firstError = '';

      for (const out of draft.outputs) {
        if (!out.expression) {
          allValid = false;
          firstError = `المخرج "${out.key || '؟'}" بدون صيغة.`;
          break;
        }
        const result = testExpression(out.expression, allAvailable);
        if (!result.valid) {
          allValid = false;
          firstError = `خطأ في "${out.key || '؟'}": ${result.error}`;
          break;
        }
        if (out.key) allAvailable.push(out.key);
      }

      const resultEl = editorEl.querySelector('#fe-test-result');
      if (resultEl) {
        if (allValid) {
          resultEl.innerHTML = '<span style="color: var(--success);">✓ جميع الصيغ صالحة!</span>';
        } else {
          resultEl.innerHTML = `<span style="color: var(--error);">✗ ${firstError}</span>`;
        }      }
    });

    mountBuilderTools(editorEl, draft, syncDraftFromUI, renderEditor);
  }

  // مزامنة بيانات الـ draft من حقول الـ UI
  function syncDraftFromUI() {
    const getId = (sel) => editorEl.querySelector(sel)?.value?.trim() || '';

    draft.id = getId('#fe-id') || draft.id;
    draft.title = getId('#fe-title');
    draft.description = getId('#fe-desc');
    draft.categoryId = getId('#fe-category');
    draft.status = getId('#fe-status');
    draft.notes = getId('#fe-notes');

    // المصادر
    draft.sourceIds = [];
    editorEl.querySelectorAll('.fe-source-check:checked').forEach(cb => {
      draft.sourceIds.push(cb.value);
    });

    // المدخلات
    editorEl.querySelectorAll('.fe-input-row').forEach((row, idx) => {
      if (!draft.inputs[idx]) draft.inputs[idx] = {};
      draft.inputs[idx].key = row.querySelector('.inp-key')?.value.trim() || '';
      draft.inputs[idx].label = row.querySelector('.inp-label')?.value.trim() || '';
      draft.inputs[idx].unit = row.querySelector('.inp-unit')?.value.trim() || '';
      const defVal = row.querySelector('.inp-default')?.value;
      draft.inputs[idx].default = defVal !== '' && defVal !== undefined ? parseFloat(defVal) || 0 : 0;
      const minVal = row.querySelector('.inp-min')?.value;
      draft.inputs[idx].min = minVal !== '' && minVal !== undefined ? parseFloat(minVal) : null;
      const maxVal = row.querySelector('.inp-max')?.value;
      draft.inputs[idx].max = maxVal !== '' && maxVal !== undefined ? parseFloat(maxVal) : null;
      draft.inputs[idx].hint = row.querySelector('.inp-hint')?.value.trim() || '';
    });

    // المخرجات
    editorEl.querySelectorAll('.fe-output-row').forEach((row, idx) => {
      if (!draft.outputs[idx]) draft.outputs[idx] = {};
      draft.outputs[idx].key = row.querySelector('.out-key')?.value.trim() || '';
      draft.outputs[idx].label = row.querySelector('.out-label')?.value.trim() || '';
      draft.outputs[idx].unit = row.querySelector('.out-unit')?.value.trim() || '';
      draft.outputs[idx].expression = row.querySelector('.out-expr')?.value.trim() || '';
      draft.outputs[idx].latex = row.querySelector('.out-latex')?.value.trim() || '';
      const dec = row.querySelector('.out-decimals')?.value;
      draft.outputs[idx].decimals = dec !== '' && dec !== undefined ? parseInt(dec, 10) : 2;
    });
  }

  renderEditor();

  // فتح النافذة المنبثقة
  activeModal = openModal({
    title: isEdit ? `تعديل: ${existingFormula.title}` : 'إضافة معادلة جديدة',
    content: editorEl,
    confirmText: 'حفظ المعادلة',
    cancelText: 'إلغاء',
    onConfirm: () => {
      syncDraftFromUI();

      // التحقق الأساسي
      if (!draft.id) {
        showToast('يرجى إدخال معرّف فريد للمعادلة.', { type: 'error' });
        return;
      }
      if (!draft.title) {
        showToast('يرجى إدخال عنوان المعادلة.', { type: 'error' });
        return;
      }
      if (draft.inputs.length === 0) {
        showToast('يجب إضافة مُدخل واحد على الأقل.', { type: 'error' });
        return;
      }
      if (draft.outputs.length === 0) {
        showToast('يجب إضافة مُخرج واحد على الأقل.', { type: 'error' });
        return;
      }

      // التأكد من وجود مفاتيح للمدخلات والمخرجات
      for (const inp of draft.inputs) {
        if (!inp.key) {
          showToast('كل مُدخل يجب أن يحتوي على مفتاح (key).', { type: 'error' });
          return;
        }
      }
      for (const out of draft.outputs) {
        if (!out.key || !out.expression) {
          showToast('كل مُخرج يجب أن يحتوي على مفتاح وصيغة رياضية.', { type: 'error' });
          return;
        }
      }

      // تعيين التواريخ
      draft.updatedAt = new Date().toISOString();
      if (!isEdit) {
        draft.createdAt = new Date().toISOString();
      }

      try {
        StorageAdapter.saveFormula(draft);
        showToast(`تم حفظ المعادلة "${draft.title}" بنجاح!`, { type: 'success' });
        onSuccess();
      } catch (err) {
        showToast(`خطأ في حفظ المعادلة: ${err.message}`, { type: 'error' });
      }
    }
  });
}

// ─── مساعدات بناء الصفوف ─────────────────────────────────────────────────────

function renderInputRow(inp, idx) {
  return `
    <div class="fe-input-row" style="border: 1px solid var(--line); border-radius: var(--radius); padding: 12px; background: var(--bg-soft); position: relative;">
      <button type="button" class="fe-remove-input" data-idx="${idx}" style="position: absolute; top: 6px; left: 6px; background: none; border: none; cursor: pointer; color: var(--error); font-size: 1.2rem;">×</button>
      
      <div style="display: grid; grid-template-columns: 1fr 2fr 1fr; gap: 10px; margin-bottom: 8px;">
        <div>
          <label class="form-label" style="font-size: 0.78rem;">المفتاح (key)</label>
          <input type="text" class="form-input inp-key" value="${inp.key || ''}" placeholder="w" style="font-family: var(--font-mono);" />
        </div>
        <div>
          <label class="form-label" style="font-size: 0.78rem;">الاسم (بالعربية)</label>
          <input type="text" class="form-input inp-label" value="${inp.label || ''}" placeholder="الحمل الموزع" />
        </div>
        <div>
          <label class="form-label" style="font-size: 0.78rem;">الوحدة</label>
          <input type="text" class="form-input inp-unit" value="${inp.unit || ''}" placeholder="kN/m" />
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 2fr; gap: 10px;">
        <div>
          <label class="form-label" style="font-size: 0.78rem;">القيمة الابتدائية</label>
          <input type="number" class="form-input inp-default" value="${inp.default ?? 0}" step="any" />
        </div>
        <div>
          <label class="form-label" style="font-size: 0.78rem;">الحد الأدنى</label>
          <input type="number" class="form-input inp-min" value="${inp.min ?? ''}" step="any" placeholder="—" />
        </div>
        <div>
          <label class="form-label" style="font-size: 0.78rem;">الحد الأقصى</label>
          <input type="number" class="form-input inp-max" value="${inp.max ?? ''}" step="any" placeholder="—" />
        </div>
        <div>
          <label class="form-label" style="font-size: 0.78rem;">تلميح / شرح</label>
          <input type="text" class="form-input inp-hint" value="${inp.hint || ''}" placeholder="توضيح لهذا المُدخل" />
        </div>
      </div>
    </div>
  `;
}

function renderOutputRow(out, idx, allKeys) {
  return `
    <div class="fe-output-row" style="border: 1px solid var(--violet-100); border-radius: var(--radius); padding: 12px; background: var(--violet-50); position: relative;">
      <button type="button" class="fe-remove-output" data-idx="${idx}" style="position: absolute; top: 6px; left: 6px; background: none; border: none; cursor: pointer; color: var(--error); font-size: 1.2rem;">×</button>

      <div style="display: grid; grid-template-columns: 1fr 2fr 1fr 1fr; gap: 10px; margin-bottom: 8px;">
        <div>
          <label class="form-label" style="font-size: 0.78rem;">مفتاح المخرج (key)</label>
          <input type="text" class="form-input out-key" value="${out.key || ''}" placeholder="M" style="font-family: var(--font-mono);" />
        </div>
        <div>
          <label class="form-label" style="font-size: 0.78rem;">الاسم</label>
          <input type="text" class="form-input out-label" value="${out.label || ''}" placeholder="العزم الأقصى" />
        </div>
        <div>
          <label class="form-label" style="font-size: 0.78rem;">الوحدة</label>
          <input type="text" class="form-input out-unit" value="${out.unit || ''}" placeholder="kN.m" />
        </div>
        <div>
          <label class="form-label" style="font-size: 0.78rem;">الخانات العشرية</label>
          <input type="number" class="form-input out-decimals" value="${out.decimals ?? 2}" min="0" max="10" />
        </div>
      </div>

      <div class="form-group" style="margin-bottom: 8px;">
        <label class="form-label" style="font-size: 0.78rem;">
          الصيغة الرياضية (expression) — المتاح: 
          <code style="color: var(--violet-700); font-size: 0.75rem;">${allKeys.join(', ') || 'أضف مدخلات أولاً'}</code>
        </label>
        <input type="text" class="form-input out-expr" value="${escapeHtml(out.expression || '')}" placeholder="w * L^2 / 8" style="font-family: var(--font-mono);" />
      </div>

      <div class="form-group" style="margin-bottom: 0;">
        <label class="form-label" style="font-size: 0.78rem;">صيغة LaTeX (اختيارية — للعرض الرياضي)</label>
        <input type="text" class="form-input out-latex" value="${escapeHtml(out.latex || '')}" placeholder="M = \\frac{w L^2}{8}" style="font-family: var(--font-mono); direction: ltr;" />
      </div>
    </div>
  `;
}

// ─── تحميل معاينة صورة الغلاف ──────────────────────────────────────────────
async function loadCoverPreview(assetId, containerEl) {
  if (!assetId || !containerEl) return;
  try {
    const asset = await StorageAdapter.getMediaAsset(assetId);
    if (asset && asset.thumbUrl) {
      containerEl.innerHTML = `<img src="${asset.thumbUrl}" alt="غلاف" style="width: 100%; height: 100%; object-fit: cover;" />`;
    }
  } catch {
    containerEl.innerHTML = '<span style="font-size: 0.72rem; color: var(--error);">خطأ في التحميل</span>';
  }
}

// ─── أدوات مساعدة ────────────────────────────────────────────────────────────
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

