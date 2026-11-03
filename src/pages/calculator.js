/**
 * calculator.js - صفحة حاسبة المعادلة الهندسية وتفاصيل الحل المتقدمة
 * 
 * المزايا:
 * - توليد الخانات تلقائياً مع دعم القوائم المنسدلة المرتبطة بالجداول
 * - دعم تعبئة المدخلات من معلمات الرابط (URL Query Params) لسهولة المشاركة
 * - عرض صيغة KaTeX الرياضية
 * - حساب فوري واستعراض خطوات الحل بالتعويض العددي
 * - نسخ النتيجة ومشاركة الرابط بالقيم
 * - تنسيق طباعة وحفظ PDF نظيف
 */

import katex from 'katex';
import { StorageAdapter } from '../store/adapter.js';
import { evaluateFormula } from '../engine/evaluate.js';
import { showToast } from '../components/toast.js';
import { animateCountUp } from '../motion/countup.js';
import { renderBeamMomentDiagramSvg, renderConcreteSectionDiagramSvg, renderSoilPressureDiagramSvg } from '../components/diagrams.js';

export function renderCalculatorPage({ params, query = {}, navigate }) {
  const container = document.createElement('div');
  container.className = 'container page-container';
  container.style.padding = '40px 20px 100px';

  const formulaId = params.id;
  const formula = StorageAdapter.getFormula(formulaId);

  if (!formula) {
    container.innerHTML = `
      <div class="empty-state" style="margin-top: 40px;">
        <h3 class="empty-state-title">المعادلة غير موجودة</h3>
        <p class="empty-state-desc">لم نتمكن من العثور على المعادلة المطلوبة برقم المعرف: <code>${formulaId}</code>.</p>
        <button class="btn btn-primary" onclick="window.location.hash = '#/library'">العودة للمكتبة</button>
      </div>
    `;
    return container;
  }

  const category = StorageAdapter.getCategory(formula.categoryId);
  const sources = StorageAdapter.getSources().filter(s => (formula.sourceIds || []).includes(s.id));
  const tables = StorageAdapter.getTables();
  const context = {
    constants: StorageAdapter.getConstants(),
    tables: tables
  };

  // صياغة وعرض KaTeX
  let katexHtml = '';
  if (formula.outputs && formula.outputs[0]) {
    const rawLatex = formula.outputs[0].latex || `${formula.outputs[0].key} = ${formula.outputs[0].expression}`;
    try {
      katexHtml = katex.renderToString(rawLatex, {
        throwOnError: false,
        displayMode: true
      });
    } catch {
      katexHtml = `<div style="font-family: var(--font-mono); text-align: center;">${rawLatex}</div>`;
    }
  }

  // رسم توضيحي مرتبط بالمعادلة إن وُجد
  let diagramHtml = '';
  if (formulaId === 'beam-simple-moment') {
    diagramHtml = `<div style="max-width: 440px; margin: 0 auto 20px; border-radius: var(--radius-sm); overflow: hidden; border: 1px solid var(--line);">${renderBeamMomentDiagramSvg()}</div>`;
  } else if (formulaId === 'slab-concrete-volume') {
    diagramHtml = `<div style="max-width: 360px; margin: 0 auto 20px; border-radius: var(--radius-sm); overflow: hidden; border: 1px solid var(--line);">${renderConcreteSectionDiagramSvg()}</div>`;
  }

  container.innerHTML = `
    <!-- ترويسة خاصة بالطباعة (تظهر فقط عند طباعة التقرير) -->
    <div class="print-header" style="display: none;">
      <div style="font-size: 1.4rem; font-weight: 700; color: #6636CC; margin-bottom: 4px;">المهندس الصغير | تقرير حسابي هندسي</div>
      <div style="font-size: 0.9rem; color: #555;">تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')} - المعادلة: ${formula.title}</div>
    </div>

    <!-- الترويسة والمسار -->
    <div style="border-bottom: 1px solid var(--line); padding-bottom: 20px; margin-bottom: 30px;">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <a href="#/library" class="btn btn-ghost btn-sm" style="padding: 4px 8px;">← العودة للمكتبة</a>
          <span style="color: var(--line-strong);">/</span>
          <span class="badge badge-category">${category ? category.title : 'عام'}</span>
          ${formula.isSample ? '<span class="badge badge-sample">مثال تجريبي</span>' : ''}
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-secondary btn-sm" id="btn-print-calc">طباعة / حفظ PDF</button>
          <button class="btn btn-secondary btn-sm" id="btn-share-calc">مشاركة الرابط</button>
        </div>
      </div>

      <h1 style="font-size: 2rem; margin-bottom: 8px;">${formula.title}</h1>
      <p style="margin: 0; font-size: 1rem; color: var(--ink-soft);">${formula.description || ''}</p>
    </div>

    <!-- شبكة الحاسبة: المدخلات على اليمين والنتائج على اليسار -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; align-items: start;">
      
      <!-- عمود المدخلات -->
      <div class="card" style="padding: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; border-bottom: 1px solid var(--line); padding-bottom: 10px;">
          <h3 style="font-size: 1.1rem; color: var(--ink); margin: 0;">مدخلات الحساب</h3>
          <button class="btn btn-ghost btn-sm" id="btn-reset-inputs" style="font-size: 0.8rem; color: var(--ink-soft);">إعادة ضبط</button>
        </div>

        <form id="calculator-form">
          ${(formula.inputs || []).map(inp => {
            // القيمة المبدئية: تفضيل ما في الرابط query ثم الافتراضي
            const initVal = query[inp.key] !== undefined ? query[inp.key] : (inp.default !== undefined ? inp.default : '');

            // فحص إذا كان الحقل مرتبطاً بجدول مرجعي
            if (inp.lookupTableId) {
              const table = tables.find(t => t.id === inp.lookupTableId);
              const rows = table ? table.rows || [] : [];
              const keyCol = table && table.columns ? (table.columns.find(c => c.key === 'key' || c.key === 'id') || table.columns[0]).key : 'grade';
              return `
                <div class="form-group">
                  <label class="form-label" for="inp-${inp.key}">${inp.label || inp.key} (${inp.key})</label>
                  <select id="inp-${inp.key}" name="${inp.key}" class="form-select">
                    ${rows.map(r => `
                      <option value="${r[keyCol]}" ${String(r[keyCol]) === String(initVal) ? 'selected' : ''}>
                        ${r[keyCol]} ${r.fc ? `(fc = ${r.fc} MPa)` : ''}
                      </option>
                    `).join('')}
                  </select>
                  <div class="form-error" id="err-${inp.key}" style="display: none;"></div>
                </div>
              `;
            }

            return `
              <div class="form-group">
                <label class="form-label" for="inp-${inp.key}">
                  <span>${inp.label || inp.key} (${inp.key})</span>
                  ${inp.min !== undefined || inp.max !== undefined ? `
                    <span class="form-label-optional">
                      ${inp.min !== undefined ? `الحد الأدنى: ${inp.min}` : ''}
                      ${inp.max !== undefined ? ` | الحد الأقصى: ${inp.max}` : ''}
                    </span>
                  ` : ''}
                </label>
                <div class="input-wrapper ${inp.unit ? 'input-with-unit' : ''}">
                  <input 
                    type="text" 
                    id="inp-${inp.key}" 
                    name="${inp.key}"
                    class="form-input" 
                    value="${initVal}"
                    placeholder="0.0"
                  />
                  ${inp.unit ? `<span class="input-unit-badge">${inp.unit}</span>` : ''}
                </div>
                ${inp.hint ? `<span class="form-hint">${inp.hint}</span>` : ''}
                <div class="form-error" id="err-${inp.key}" style="display: none;"></div>
              </div>
            `;
          }).join('')}

          <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 10px;">
            احسب واعرض خطوات الحل
          </button>
        </form>
      </div>

      <!-- عمود النتائج والصيغة وخطوات الحل -->
      <div>
        ${diagramHtml}

        <!-- عرض الصيغة الرياضية بـ KaTeX -->
        <div class="card" style="margin-bottom: 20px; padding: 20px; text-align: center; background-color: var(--bg-soft);">
          <div style="font-size: 0.82rem; color: var(--ink-soft); margin-bottom: 8px;">الصيغة الرياضية المعتمدة:</div>
          <div style="font-size: 1.3rem; color: var(--ink); overflow-x: auto;">${katexHtml}</div>
        </div>

        <!-- لوحة النتيجة الرئيسية -->
        <div id="results-container"></div>

        <!-- خطوات الحل الموثقة -->
        <div id="steps-container" style="margin-top: 20px;"></div>
      </div>
    </div>

    <!-- أسفل الصفحة: الملاحظات والمصادر -->
    <div style="margin-top: 50px; border-top: 1px solid var(--line); padding-top: 30px;">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
        <!-- الملاحظات الهندسية -->
        <div class="card" style="background-color: var(--bg-soft);">
          <h4 style="font-size: 1rem; color: var(--violet-900); margin-bottom: 8px;">ملاحظات وفرضيات الحل</h4>
          <p style="font-size: 0.9rem; color: var(--ink-soft); line-height: 1.7; margin: 0;">
            ${formula.notes || 'يُفترض تطبيق المعادلة وفق الشروط المحددة في الكود المعتمد وأن المواد المستخدمة خطية مرنة.'}
          </p>
        </div>

        <!-- المصادر المرجعية -->
        <div class="card" style="background-color: var(--bg-soft);">
          <h4 style="font-size: 1rem; color: var(--violet-900); margin-bottom: 8px;">المصادر والمراجع المرتبطة</h4>
          ${sources.length > 0 ? sources.map(src => `
            <div style="font-size: 0.88rem; margin-bottom: 6px;">
              <strong>${src.title}</strong> - ${src.author || ''}
              ${src.pages ? `<div style="color: var(--violet-700); font-size: 0.82rem;">${src.pages}</div>` : ''}
            </div>
          `).join('') : '<span style="font-size: 0.85rem; color: var(--ink-soft);">لم يتم إرفاق مراجع خاصة لهذه المعادلة.</span>'}
        </div>
      </div>
    </div>
  `;

  // دالة الحساب وتحديث الواجهة
  function performCalculation() {
    const inputValues = {};
    (formula.inputs || []).forEach(inp => {
      const el = container.querySelector(`#inp-${inp.key}`);
      inputValues[inp.key] = el ? el.value : '';
      const errEl = container.querySelector(`#err-${inp.key}`);
      if (errEl) {
        errEl.style.display = 'none';
        errEl.textContent = '';
      }
      if (el) el.classList.remove('has-error');
    });

    const evalResult = evaluateFormula(formula, inputValues, context);

    if (!evalResult.success) {
      if (evalResult.errors) {
        Object.entries(evalResult.errors).forEach(([k, err]) => {
          const errEl = container.querySelector(`#err-${k}`);
          const inputEl = container.querySelector(`#inp-${k}`);
          if (errEl) {
            errEl.textContent = err;
            errEl.style.display = 'flex';
          }
          if (inputEl) inputEl.classList.add('has-error');
        });
      }
      showToast(evalResult.errorMessage || 'يرجى مراجعة قيم المدخلات', { type: 'error' });
      return;
    }

    // عرض النتائج مع حركة Count-up
    const resultsContainer = container.querySelector('#results-container');
    const outputs = Object.values(evalResult.outputs);

    resultsContainer.innerHTML = outputs.map(out => `
      <div class="result-panel">
        <div class="result-info">
          <span class="result-label">${out.label || out.key}</span>
          <div class="result-value-container">
            <span class="result-value" id="val-${out.key}">${out.value}</span>
            <span class="result-unit">${out.unit}</span>
          </div>
        </div>
        <button class="btn btn-secondary btn-sm btn-copy-result" data-val="${out.value} ${out.unit}">
          نسخ النتيجة
        </button>
      </div>
    `).join('');

    resultsContainer.querySelectorAll('.btn-copy-result').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-val');
        navigator.clipboard?.writeText(text);
        showToast(`تم نسخ (${text}) إلى الحافظة.`, { type: 'info' });
      });
    });

    // عرض خطوات الحل المتسلسلة
    const stepsContainer = container.querySelector('#steps-container');
    if (evalResult.steps && evalResult.steps.length > 0) {
      stepsContainer.innerHTML = `
        <div class="card" style="background-color: var(--bg-soft);">
          <div style="font-weight: 600; font-size: 0.95rem; margin-bottom: 12px; color: var(--ink);">
            خطوات الحل المتسلسلة:
          </div>
          ${evalResult.steps.map((st, idx) => `
            <div class="step-item" style="padding: 12px 16px; background: #FFFFFF; border: 1px solid var(--line); border-radius: var(--radius-sm); margin-bottom: 10px; animation-delay: ${idx * 80}ms;">
              <span style="font-size: 0.8rem; color: var(--ink-soft); display: block; margin-bottom: 4px;">
                خطوة ${idx + 1}: التعويض في معادلة ${st.label || st.key}
              </span>
              <div style="font-family: var(--font-mono); color: var(--violet-800); font-size: 0.95rem; direction: ltr; text-align: right;">
                ${st.substitutedExpression} = <strong>${st.resultFormatted}</strong>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
  }

  // ربط النموذج
  const form = container.querySelector('#calculator-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      performCalculation();
    });
  }

  // إعادة ضبط المدخلات للقيم الافتراضية
  const btnReset = container.querySelector('#btn-reset-inputs');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      (formula.inputs || []).forEach(inp => {
        const el = container.querySelector(`#inp-${inp.key}`);
        if (el) el.value = inp.default !== undefined ? inp.default : '';
      });
      performCalculation();
      showToast('تمت استعادة القيم الافتراضية.', { type: 'info' });
    });
  }

  // زر الطباعة وحفظ PDF
  const btnPrint = container.querySelector('#btn-print-calc');
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }

  // زر مشاركة الرابط مع تضمين القيم المدخلة
  const btnShare = container.querySelector('#btn-share-calc');
  if (btnShare) {
    btnShare.addEventListener('click', () => {
      const queryParams = new URLSearchParams();
      (formula.inputs || []).forEach(inp => {
        const el = container.querySelector(`#inp-${inp.key}`);
        if (el && el.value !== '') {
          queryParams.set(inp.key, el.value);
        }
      });
      const shareUrl = `${window.location.origin}${window.location.pathname}#/calc/${formula.id}?${queryParams.toString()}`;
      navigator.clipboard?.writeText(shareUrl);
      showToast('تم نسخ رابط الحاسبة بالقيم المدخلة.', { type: 'info' });
    });
  }

  requestAnimationFrame(() => {
    performCalculation();
  });

  return container;
}
