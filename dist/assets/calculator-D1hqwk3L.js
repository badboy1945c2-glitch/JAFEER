import{k as q}from"./katex-Dc8nsIP1.js";import{S as c,r as L,a as C}from"./index-DEbd_JFn.js";import{e as T}from"./evaluate-B0-ofPa3.js";import{s as m}from"./toast-CnxnsvgL.js";import"./mathjs-DR_SeBty.js";function A({params:z,query:f={},navigate:F}){const s=document.createElement("div");s.className="container page-container",s.style.padding="40px 20px 100px";const p=z.id,a=c.getFormula(p);if(!a)return s.innerHTML=`
      <div class="empty-state" style="margin-top: 40px;">
        <h3 class="empty-state-title">المعادلة غير موجودة</h3>
        <p class="empty-state-desc">لم نتمكن من العثور على المعادلة المطلوبة برقم المعرف: <code>${p}</code>.</p>
        <button class="btn btn-primary" onclick="window.location.hash = '#/library'">العودة للمكتبة</button>
      </div>
    `,s;const b=c.getCategory(a.categoryId),g=c.getSources().filter(e=>(a.sourceIds||[]).includes(e.id)),x=c.getTables(),E={constants:c.getConstants(),tables:x};let u="";if(a.outputs&&a.outputs[0]){const e=a.outputs[0].latex||`${a.outputs[0].key} = ${a.outputs[0].expression}`;try{u=q.renderToString(e,{throwOnError:!1,displayMode:!0})}catch{u=`<div style="font-family: var(--font-mono); text-align: center;">${e}</div>`}}let v="";p==="beam-simple-moment"?v=`<div style="max-width: 440px; margin: 0 auto 20px; border-radius: var(--radius-sm); overflow: hidden; border: 1px solid var(--line);">${L()}</div>`:p==="slab-concrete-volume"&&(v=`<div style="max-width: 360px; margin: 0 auto 20px; border-radius: var(--radius-sm); overflow: hidden; border: 1px solid var(--line);">${C()}</div>`),s.innerHTML=`
    <!-- ترويسة خاصة بالطباعة (تظهر فقط عند طباعة التقرير) -->
    <div class="print-header" style="display: none;">
      <div style="font-size: 1.4rem; font-weight: 700; color: #6636CC; margin-bottom: 4px;">المهندس الصغير | تقرير حسابي هندسي</div>
      <div style="font-size: 0.9rem; color: #555;">تاريخ التقرير: ${new Date().toLocaleDateString("ar-SA")} - المعادلة: ${a.title}</div>
    </div>

    <!-- الترويسة والمسار -->
    <div style="border-bottom: 1px solid var(--line); padding-bottom: 20px; margin-bottom: 30px;">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <a href="#/library" class="btn btn-ghost btn-sm" style="padding: 4px 8px;">← العودة للمكتبة</a>
          <span style="color: var(--line-strong);">/</span>
          <span class="badge badge-category">${b?b.title:"عام"}</span>
          ${a.isSample?'<span class="badge badge-sample">مثال تجريبي</span>':""}
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-secondary btn-sm" id="btn-print-calc">طباعة / حفظ PDF</button>
          <button class="btn btn-secondary btn-sm" id="btn-share-calc">مشاركة الرابط</button>
        </div>
      </div>

      <h1 style="font-size: 2rem; margin-bottom: 8px;">${a.title}</h1>
      <p style="margin: 0; font-size: 1rem; color: var(--ink-soft);">${a.description||""}</p>
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
          ${(a.inputs||[]).map(e=>{const r=f[e.key]!==void 0?f[e.key]:e.default!==void 0?e.default:"";if(e.lookupTableId){const o=x.find(t=>t.id===e.lookupTableId),d=o?o.rows||[]:[],l=o&&o.columns?(o.columns.find(t=>t.key==="key"||t.key==="id")||o.columns[0]).key:"grade";return`
                <div class="form-group">
                  <label class="form-label" for="inp-${e.key}">${e.label||e.key} (${e.key})</label>
                  <select id="inp-${e.key}" name="${e.key}" class="form-select">
                    ${d.map(t=>`
                      <option value="${t[l]}" ${String(t[l])===String(r)?"selected":""}>
                        ${t[l]} ${t.fc?`(fc = ${t.fc} MPa)`:""}
                      </option>
                    `).join("")}
                  </select>
                  <div class="form-error" id="err-${e.key}" style="display: none;"></div>
                </div>
              `}return`
              <div class="form-group">
                <label class="form-label" for="inp-${e.key}">
                  <span>${e.label||e.key} (${e.key})</span>
                  ${e.min!==void 0||e.max!==void 0?`
                    <span class="form-label-optional">
                      ${e.min!==void 0?`الحد الأدنى: ${e.min}`:""}
                      ${e.max!==void 0?` | الحد الأقصى: ${e.max}`:""}
                    </span>
                  `:""}
                </label>
                <div class="input-wrapper ${e.unit?"input-with-unit":""}">
                  <input 
                    type="text" 
                    id="inp-${e.key}" 
                    name="${e.key}"
                    class="form-input" 
                    value="${r}"
                    placeholder="0.0"
                  />
                  ${e.unit?`<span class="input-unit-badge">${e.unit}</span>`:""}
                </div>
                ${e.hint?`<span class="form-hint">${e.hint}</span>`:""}
                <div class="form-error" id="err-${e.key}" style="display: none;"></div>
              </div>
            `}).join("")}

          <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 10px;">
            احسب واعرض خطوات الحل
          </button>
        </form>
      </div>

      <!-- عمود النتائج والصيغة وخطوات الحل -->
      <div>
        ${v}

        <!-- عرض الصيغة الرياضية بـ KaTeX -->
        <div class="card" style="margin-bottom: 20px; padding: 20px; text-align: center; background-color: var(--bg-soft);">
          <div style="font-size: 0.82rem; color: var(--ink-soft); margin-bottom: 8px;">الصيغة الرياضية المعتمدة:</div>
          <div style="font-size: 1.3rem; color: var(--ink); overflow-x: auto;">${u}</div>
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
            ${a.notes||"يُفترض تطبيق المعادلة وفق الشروط المحددة في الكود المعتمد وأن المواد المستخدمة خطية مرنة."}
          </p>
        </div>

        <!-- المصادر المرجعية -->
        <div class="card" style="background-color: var(--bg-soft);">
          <h4 style="font-size: 1rem; color: var(--violet-900); margin-bottom: 8px;">المصادر والمراجع المرتبطة</h4>
          ${g.length>0?g.map(e=>`
            <div style="font-size: 0.88rem; margin-bottom: 6px;">
              <strong>${e.title}</strong> - ${e.author||""}
              ${e.pages?`<div style="color: var(--violet-700); font-size: 0.82rem;">${e.pages}</div>`:""}
            </div>
          `).join(""):'<span style="font-size: 0.85rem; color: var(--ink-soft);">لم يتم إرفاق مراجع خاصة لهذه المعادلة.</span>'}
        </div>
      </div>
    </div>
  `;function y(){const e={};(a.inputs||[]).forEach(t=>{const n=s.querySelector(`#inp-${t.key}`);e[t.key]=n?n.value:"";const i=s.querySelector(`#err-${t.key}`);i&&(i.style.display="none",i.textContent=""),n&&n.classList.remove("has-error")});const r=T(a,e,E);if(!r.success){r.errors&&Object.entries(r.errors).forEach(([t,n])=>{const i=s.querySelector(`#err-${t}`),S=s.querySelector(`#inp-${t}`);i&&(i.textContent=n,i.style.display="flex"),S&&S.classList.add("has-error")}),m(r.errorMessage||"يرجى مراجعة قيم المدخلات",{type:"error"});return}const o=s.querySelector("#results-container"),d=Object.values(r.outputs);o.innerHTML=d.map(t=>`
      <div class="result-panel">
        <div class="result-info">
          <span class="result-label">${t.label||t.key}</span>
          <div class="result-value-container">
            <span class="result-value" id="val-${t.key}">${t.value}</span>
            <span class="result-unit">${t.unit}</span>
          </div>
        </div>
        <button class="btn btn-secondary btn-sm btn-copy-result" data-val="${t.value} ${t.unit}">
          نسخ النتيجة
        </button>
      </div>
    `).join(""),o.querySelectorAll(".btn-copy-result").forEach(t=>{t.addEventListener("click",()=>{var i;const n=t.getAttribute("data-val");(i=navigator.clipboard)==null||i.writeText(n),m(`تم نسخ (${n}) إلى الحافظة.`,{type:"info"})})});const l=s.querySelector("#steps-container");r.steps&&r.steps.length>0&&(l.innerHTML=`
        <div class="card" style="background-color: var(--bg-soft);">
          <div style="font-weight: 600; font-size: 0.95rem; margin-bottom: 12px; color: var(--ink);">
            خطوات الحل المتسلسلة:
          </div>
          ${r.steps.map((t,n)=>`
            <div class="step-item" style="padding: 12px 16px; background: #FFFFFF; border: 1px solid var(--line); border-radius: var(--radius-sm); margin-bottom: 10px; animation-delay: ${n*80}ms;">
              <span style="font-size: 0.8rem; color: var(--ink-soft); display: block; margin-bottom: 4px;">
                خطوة ${n+1}: التعويض في معادلة ${t.label||t.key}
              </span>
              <div style="font-family: var(--font-mono); color: var(--violet-800); font-size: 0.95rem; direction: ltr; text-align: right;">
                ${t.substitutedExpression} = <strong>${t.resultFormatted}</strong>
              </div>
            </div>
          `).join("")}
        </div>
      `)}const $=s.querySelector("#calculator-form");$&&$.addEventListener("submit",e=>{e.preventDefault(),y()});const k=s.querySelector("#btn-reset-inputs");k&&k.addEventListener("click",()=>{(a.inputs||[]).forEach(e=>{const r=s.querySelector(`#inp-${e.key}`);r&&(r.value=e.default!==void 0?e.default:"")}),y(),m("تمت استعادة القيم الافتراضية.",{type:"info"})});const h=s.querySelector("#btn-print-calc");h&&h.addEventListener("click",()=>{window.print()});const w=s.querySelector("#btn-share-calc");return w&&w.addEventListener("click",()=>{var o;const e=new URLSearchParams;(a.inputs||[]).forEach(d=>{const l=s.querySelector(`#inp-${d.key}`);l&&l.value!==""&&e.set(d.key,l.value)});const r=`${window.location.origin}${window.location.pathname}#/calc/${a.id}?${e.toString()}`;(o=navigator.clipboard)==null||o.writeText(r),m("تم نسخ رابط الحاسبة بالقيم المدخلة.",{type:"info"})}),requestAnimationFrame(()=>{y()}),s}export{A as renderCalculatorPage};
