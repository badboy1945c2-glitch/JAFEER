import{S as m,o as S,C as R,v as Q,m as W,f as ee,g as ce,h as pe,j as ue,k as me,s as fe}from"./index-DEbd_JFn.js";import{s as h}from"./toast-CnxnsvgL.js";import{s as T,z as te,u as ve,a as N}from"./fflate-EV1LHJOo.js";import{n as D}from"./uscs-names-B6qDO2uH.js";import{e as be}from"./evaluate-B0-ofPa3.js";import{c as ye}from"./mathjs-DR_SeBty.js";const I="almuhandis_admin_session",ge=30*60*1e3;async function ae(t){const a=String(t).trim();if(typeof crypto<"u"&&crypto.subtle){const i=new TextEncoder().encode(a),r=await crypto.subtle.digest("SHA-256",i);return Array.from(new Uint8Array(r)).map(n=>n.toString(16).padStart(2,"0")).join("")}let s=0;for(let i=0;i<a.length;i++)s=(s<<5)-s+a.charCodeAt(i),s|=0;return"simple_"+Math.abs(s)}function he(){const t=m.getSettings();return!!(t&&t.adminPinHash)}async function xe(t){if(!t||t.length<4||t.length>8)throw new Error("يجب أن يتكون رمز PIN من 4 إلى 8 أرقام.");const a=await ae(t);return m.updateSettings({adminPinHash:a}),ne(),!0}async function $e(t){const a=m.getSettings();if(!a||!a.adminPinHash)return!1;const i=await ae(t)===a.adminPinHash;return i&&ne(),i}function ne(){try{const t={authenticated:!0,lastActive:Date.now()};sessionStorage.setItem(I,JSON.stringify(t))}catch{}}function we(){try{const t=sessionStorage.getItem(I);if(!t)return!1;const a=JSON.parse(t);if(!a||!a.authenticated)return!1;const s=Date.now();return s-a.lastActive>ge?(re(),!1):(a.lastActive=s,sessionStorage.setItem(I,JSON.stringify(a)),!0)}catch{return!1}}function re(){try{sessionStorage.removeItem(I)}catch{}}const ke=8*1024*1024;async function ie(t,{maxWidth:a=1600,maxHeight:s=1600,quality:i=.82,thumbWidth:r=400}={}){if(!t)throw new Error("لم يتم تحديد أي ملف.");if(t.size>ke)throw new Error(`حجم الصورة (${(t.size/(1024*1024)).toFixed(1)} ميجابايت) يتجاوز الحد الأقصى المسموح وهو 8 ميجابايت.`);return t.type==="image/svg+xml"?new Promise((e,n)=>{const o=new FileReader;o.onload=()=>{const l=o.result;e({dataUrl:l,thumbUrl:l,width:800,height:600,originalSize:t.size,compressedSize:t.size,mimeType:"image/svg+xml"})},o.onerror=()=>n(new Error("تعذر قراءة ملف SVG.")),o.readAsDataURL(t)}):new Promise((e,n)=>{const o=URL.createObjectURL(t),l=new Image;l.onload=()=>{URL.revokeObjectURL(o);let{width:d,height:y}=l;(d>a||y>s)&&(d/y>a/s?(y=Math.round(y*a/d),d=a):(d=Math.round(d*s/y),y=s));const f=document.createElement("canvas");f.width=d,f.height=y,f.getContext("2d").drawImage(l,0,0,d,y);let x="image/webp",u=f.toDataURL(x,i);u.startsWith("data:image/webp")||(x="image/jpeg",u=f.toDataURL(x,i));let p=Math.round(y*r/d);const b=document.createElement("canvas");b.width=r,b.height=p,b.getContext("2d").drawImage(l,0,0,r,p);const c=b.toDataURL(x,.75),$=Math.round(u.length*.75);e({dataUrl:u,thumbUrl:c,width:d,height:y,originalSize:t.size,compressedSize:$,mimeType:x})},l.onerror=()=>{URL.revokeObjectURL(o),n(new Error("تعذر تحميل الصورة. تأكد من أن الملف سليم وبصيغة مدعومة (JPG, PNG, WebP, SVG)."))},l.src=o})}async function M({currentAssetId:t=null,onSelect:a}={}){var n,o;const s=await m.listMediaAssets(),i=document.createElement("div");i.style.cssText="display: flex; flex-direction: column; gap: 16px;",i.innerHTML=`
    <!-- شريط البحث والرفع السريع -->
    <div style="display: flex; gap: 10px; align-items: center; justify-content: space-between; flex-wrap: wrap;">
      <input 
        type="text" 
        id="picker-search-input" 
        class="form-input" 
        placeholder="ابحث في الصور..." 
        style="max-width: 260px; padding: 8px 12px; font-size: 0.88rem;"
      />
      
      <label class="btn btn-primary btn-sm" style="cursor: pointer;">
        + رفع صورة جديدة
        <input type="file" id="picker-file-upload" accept="image/*" style="display: none;" />
      </label>
    </div>

    <!-- شبكة استعراض الصور -->
    <div id="picker-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 12px; max-height: 340px; overflow-y: auto; padding: 4px;">
      <!-- تُملأ ديناميكياً -->
    </div>
  `;let r=null;function e(l=""){const d=i.querySelector("#picker-grid");if(!d)return;const y=s.filter(f=>{const v=l.toLowerCase();return(f.name||"").toLowerCase().includes(v)||(f.alt||"").toLowerCase().includes(v)||(f.tags||[]).some(x=>x.toLowerCase().includes(v))});if(y.length===0){d.innerHTML=`
        <div style="grid-column: 1 / -1; text-align: center; padding: 30px 10px; color: var(--ink-soft); font-size: 0.9rem;">
          لا توجد صور مطابقة. يمكنك رفع صورة جديدة بالزر أعلاه.
        </div>
      `;return}d.innerHTML=y.map(f=>{const v=f.id===t;return`
        <div class="picker-asset-item" data-id="${f.id}" style="
          border: 2px solid ${v?"var(--violet-600)":"var(--line)"};
          border-radius: var(--radius);
          padding: 4px;
          cursor: pointer;
          background-color: #FFFFFF;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: border-color var(--transition-fast), transform var(--transition-fast);
        ">
          <div style="width: 100%; height: 80px; overflow: hidden; border-radius: 4px; background: var(--bg-soft); display: flex; align-items: center; justify-content: center;">
            <img src="${f.thumbUrl||f.dataUrl}" alt="${f.alt||f.name}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <span style="font-size: 0.72rem; color: var(--ink); margin-top: 4px; width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: center;">
            ${f.name}
          </span>
        </div>
      `}).join(""),d.querySelectorAll(".picker-asset-item").forEach(f=>{f.addEventListener("click",()=>{const v=f.getAttribute("data-id"),x=s.find(u=>u.id===v);x&&a&&a(x),r&&r.close()})})}(n=i.querySelector("#picker-search-input"))==null||n.addEventListener("input",l=>{e(l.target.value.trim())}),(o=i.querySelector("#picker-file-upload"))==null||o.addEventListener("change",async l=>{var y;const d=(y=l.target.files)==null?void 0:y[0];if(d)try{h("جاري ضغط ومعالجة الصورة...",{type:"info",duration:2e3});const f=await ie(d),v={id:"asset-"+Date.now(),name:d.name,alt:d.name.replace(/\.[^/.]+$/,""),mimeType:f.mimeType,dataUrl:f.dataUrl,thumbUrl:f.thumbUrl,width:f.width,height:f.height,size:f.compressedSize,tags:[]};await m.saveMediaAsset(v),s.unshift(v),e(),h("تم رفع وضغط الصورة بنجاح!",{type:"success"})}catch(f){h(f.message||"فشل رفع الصورة.",{type:"error"})}}),e(),r=S({title:"اختيار صورة من مكتبة الوسائط",content:i,cancelText:"إلغاء التحديد",showFooter:!0,confirmText:"إغلاق",onCancel:()=>{a&&a(null)}})}function Se(t){var r;const a=document.createElement("div"),s=m.getCategories(),i=m.getFormulas();return a.innerHTML=`
    <div class="admin-card-header">
      <div>
        <h2 style="font-size: 1.4rem; color: var(--ink); margin-bottom: 4px;">إدارة التصنيفات الهندسية</h2>
        <p style="margin: 0; font-size: 0.88rem; color: var(--ink-soft);">إضافة وتعديل وترتيب الأقسام التخصصية في الموقع.</p>
      </div>
      <button class="btn btn-primary btn-sm" id="btn-add-category">
        + إضافة تصنيف جديد
      </button>
    </div>

    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th style="width: 60px;">الترتيب</th>
            <th>معرّف التصنيف</th>
            <th>اسم التصنيف</th>
            <th>الوصف</th>
            <th>عدد المعادلات</th>
            <th style="text-align: left;">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          ${s.map(e=>{const n=i.filter(o=>o.categoryId===e.id).length;return`
              <tr>
                <td style="font-family: var(--font-mono); font-weight: 600;">${e.order||0}</td>
                <td><code style="color: var(--violet-700);">${e.id}</code></td>
                <td style="font-weight: 600;">${e.title}</td>
                <td style="color: var(--ink-soft); font-size: 0.85rem;">${e.description||"—"}</td>
                <td><span class="badge badge-category">${n}</span></td>
                <td style="text-align: left;">
                  <button class="btn btn-secondary btn-sm btn-edit-cat" data-id="${e.id}">تعديل</button>
                  <button class="btn btn-danger btn-sm btn-delete-cat" data-id="${e.id}">حذف</button>
                </td>
              </tr>
            `}).join("")}
        </tbody>
      </table>
    </div>
  `,(r=a.querySelector("#btn-add-category"))==null||r.addEventListener("click",()=>{J(null,t)}),a.querySelectorAll(".btn-edit-cat").forEach(e=>{e.addEventListener("click",()=>{const n=e.getAttribute("data-id"),o=m.getCategory(n);J(o,t)})}),a.querySelectorAll(".btn-delete-cat").forEach(e=>{e.addEventListener("click",()=>{const n=e.getAttribute("data-id"),o=m.getCategory(n);if(!o)return;const l=i.filter(d=>d.categoryId===n);if(l.length>0){h(`لا يمكن حذف التصنيف لأنه يحتوي على ${l.length} معادلة. يرجى نقلها أولاً.`,{type:"error"});return}S({title:`حذف تصنيف: ${o.title}`,content:"<p>هل أنت متأكد من حذف هذا التصنيف؟ لا يمكن التراجع عن هذه الخطوة إلا خلال 10 ثوانٍ.</p>",confirmText:"نعم، احذف",onConfirm:()=>{m.deleteCategory(n),t(),h(`تم حذف التصنيف "${o.title}".`,{type:"info",duration:1e4,onUndo:()=>{m.saveCategory(o),t(),h("تمت استعادة التصنيف بنجاح.",{type:"success"})}})}})})}),a}function J(t,a){const s=!!t;let i=t&&t.coverAssetId||null;const r=document.createElement("div");function e(){var n,o;r.innerHTML=`
      <form id="cat-form">
        <div class="form-group">
          <label class="form-label" for="cat-id-inp">المعرّف الفريد (ID بالإنجليزية)</label>
          <input type="text" id="cat-id-inp" class="form-input" value="${t?t.id:"cat-"}" ${s?"disabled":""} required />
        </div>
        <div class="form-group">
          <label class="form-label" for="cat-title-inp">اسم التصنيف (بالعربية)</label>
          <input type="text" id="cat-title-inp" class="form-input" value="${t?t.title:""}" required />
        </div>
        <div class="form-group">
          <label class="form-label" for="cat-desc-inp">الوصف المختصر</label>
          <textarea id="cat-desc-inp" class="form-textarea" rows="2">${t&&t.description||""}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label" for="cat-order-inp">ترتيب الظهور (رقم)</label>
          <input type="number" id="cat-order-inp" class="form-input" value="${t?t.order||1:5}" />
        </div>
        <div class="form-group">
          <label class="form-label">صورة غلاف التصنيف</label>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div id="cat-cover-preview" style="width: 80px; height: 60px; border-radius: var(--radius); border: 1px dashed var(--line); display: flex; align-items: center; justify-content: center; overflow: hidden; background: var(--bg-soft);">
              ${i?'<span style="font-size: 0.72rem; color: var(--violet-700);">جاري التحميل...</span>':'<span style="font-size: 0.72rem; color: var(--ink-soft);">بدون صورة</span>'}
            </div>
            <button type="button" class="btn btn-secondary btn-sm" id="cat-pick-cover">اختر صورة</button>
            ${i?'<button type="button" class="btn btn-ghost btn-sm" id="cat-remove-cover" style="color: var(--error);">إزالة</button>':""}
          </div>
        </div>
      </form>
    `,i&&(async()=>{try{const l=await m.getMediaAsset(i),d=r.querySelector("#cat-cover-preview");l&&l.thumbUrl&&d&&(d.innerHTML=`<img src="${l.thumbUrl}" alt="غلاف" style="width: 100%; height: 100%; object-fit: cover;" />`)}catch{}})(),(n=r.querySelector("#cat-pick-cover"))==null||n.addEventListener("click",()=>{M({currentAssetId:i,onSelect:l=>{i=l?l.id:null,e()}})}),(o=r.querySelector("#cat-remove-cover"))==null||o.addEventListener("click",()=>{i=null,e()})}e(),S({title:s?"تعديل التصنيف":"إضافة تصنيف جديد",content:r,confirmText:"حفظ",onConfirm:()=>{const n=r.querySelector("#cat-id-inp").value.trim(),o=r.querySelector("#cat-title-inp").value.trim(),l=r.querySelector("#cat-desc-inp").value.trim(),d=parseInt(r.querySelector("#cat-order-inp").value,10)||1;if(!n||!o){h("يرجى ملء الحقول المطلوبة.",{type:"error"});return}m.saveCategory({...t||{},id:n,title:o,description:l,order:d,coverAssetId:i}),h(`تم حفظ التصنيف "${o}" بنجاح.`,{type:"success"}),a()}})}function Ee(t){var r;const a=document.createElement("div"),s=m.getSources(),i=m.getFormulas();return a.innerHTML=`
    <div class="admin-card-header">
      <div>
        <h2 style="font-size: 1.4rem; color: var(--ink); margin-bottom: 4px;">إدارة المراجع والأكواد</h2>
        <p style="margin: 0; font-size: 0.88rem; color: var(--ink-soft);">إضافة وتعديل الكتب والمراجع والأكواد المعتمدة في الموقع.</p>
      </div>
      <button class="btn btn-primary btn-sm" id="btn-add-source">
        + إضافة مصدر جديد
      </button>
    </div>

    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>المعرّف</th>
            <th>عنوان الكتاب / الكود</th>
            <th>المؤلف / الجهة</th>
            <th>الطبعة / السنة</th>
            <th>الصفحات أو البند</th>
            <th>المعادلات المرتبطة</th>
            <th style="text-align: left;">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          ${s.map(e=>{const n=i.filter(o=>o.sourceIds&&o.sourceIds.includes(e.id));return`
              <tr>
                <td><code style="color: var(--violet-700);">${e.id}</code></td>
                <td style="font-weight: 600;">${e.title}</td>
                <td>${e.author||"—"}</td>
                <td style="font-size: 0.85rem; color: var(--ink-soft);">${e.edition||"—"}</td>
                <td style="font-size: 0.85rem; color: var(--violet-800);">${e.pages||"—"}</td>
                <td>
                  <span class="badge ${n.length>0?"badge-published":"badge-draft"}">
                    ${n.length} معادلة
                  </span>
                </td>
                <td style="text-align: left;">
                  <button class="btn btn-secondary btn-sm btn-edit-src" data-id="${e.id}">تعديل</button>
                  <button class="btn btn-danger btn-sm btn-delete-src" data-id="${e.id}">حذف</button>
                </td>
              </tr>
            `}).join("")}
        </tbody>
      </table>
    </div>
  `,(r=a.querySelector("#btn-add-source"))==null||r.addEventListener("click",()=>{_(null,t)}),a.querySelectorAll(".btn-edit-src").forEach(e=>{e.addEventListener("click",()=>{const n=e.getAttribute("data-id"),o=m.getSource(n);_(o,t)})}),a.querySelectorAll(".btn-delete-src").forEach(e=>{e.addEventListener("click",()=>{const n=e.getAttribute("data-id"),o=m.getSource(n);if(!o)return;const l=i.filter(d=>d.sourceIds&&d.sourceIds.includes(n));if(l.length>0){const d=l.map(y=>`"${y.title}"`).join("، ");h(`لا يمكن حذف المصدر لأنه مرتبط بـ ${l.length} معادلة: ${d}`,{type:"error"});return}S({title:`حذف المصدر: ${o.title}`,content:"<p>هل أنت متأكد من حذف هذا المصدر من قاعدة البيانات؟</p>",confirmText:"نعم، احذف",onConfirm:()=>{try{m.deleteSource(n),t(),h(`تم حذف المصدر "${o.title}".`,{type:"info",duration:1e4,onUndo:()=>{m.saveSource(o),t(),h("تمت استعادة المصدر بنجاح.",{type:"success"})}})}catch(d){h(d.message,{type:"error"})}}})})}),a}function _(t,a){const s=!!t,i=`
    <form id="src-form">
      <div class="form-group">
        <label class="form-label" for="src-id-inp">معرّف المصدر (ID)</label>
        <input type="text" id="src-id-inp" class="form-input" value="${t?t.id:"src-"}" ${s?"disabled":""} required />
      </div>
      <div class="form-group">
        <label class="form-label" for="src-title-inp">عنوان الكتاب أو الكود</label>
        <input type="text" id="src-title-inp" class="form-input" value="${t?t.title:""}" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="src-author-inp">المؤلف أو الجهة المصدرة</label>
        <input type="text" id="src-author-inp" class="form-input" value="${t&&t.author||""}" />
      </div>
      <div class="form-group">
        <label class="form-label" for="src-edition-inp">الطبعة أو سنة الإصدار</label>
        <input type="text" id="src-edition-inp" class="form-input" value="${t&&t.edition||""}" />
      </div>
      <div class="form-group">
        <label class="form-label" for="src-pages-inp">الصفحات أو رقم البند</label>
        <input type="text" id="src-pages-inp" class="form-input" value="${t&&t.pages||""}" />
      </div>
    </form>
  `;S({title:s?"تعديل المصدر المرجعي":"إضافة مصدر مرجعي جديد",content:i,confirmText:"حفظ",onConfirm:()=>{const r=document.getElementById("src-id-inp").value.trim(),e=document.getElementById("src-title-inp").value.trim(),n=document.getElementById("src-author-inp").value.trim(),o=document.getElementById("src-edition-inp").value.trim(),l=document.getElementById("src-pages-inp").value.trim();if(!r||!e){h("يرجى ملء الحقول المطلوبة.",{type:"error"});return}m.saveSource({...t||{},id:r,title:e,author:n,edition:o,pages:l}),h(`تم حفظ المصدر "${e}" بنجاح.`,{type:"success"}),a()}})}function Le(t){var i;const a=document.createElement("div"),s=m.getConstants();return a.innerHTML=`
    <div class="admin-card-header">
      <div>
        <h2 style="font-size: 1.4rem; color: var(--ink); margin-bottom: 4px;">إدارة الثوابت المركزية</h2>
        <p style="margin: 0; font-size: 0.88rem; color: var(--ink-soft);">الثوابت الفيزيائية والرياضية التي تُتاح لكافة المعادلات باسمها مباشرة.</p>
      </div>
      <button class="btn btn-primary btn-sm" id="btn-add-constant">
        + إضافة ثابت جديد
      </button>
    </div>

    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>رمز الثابت</th>
            <th>اسم الثابت</th>
            <th>القيمة الرقمية</th>
            <th>الوحدة</th>
            <th>الوصف</th>
            <th style="text-align: left;">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          ${s.map(r=>`
            <tr>
              <td><code style="font-size: 1rem; color: var(--violet-700); font-weight: 700;">${r.key}</code></td>
              <td style="font-weight: 600;">${r.label||r.key}</td>
              <td class="font-mono" style="font-weight: 600;">${r.value}</td>
              <td class="font-mono" style="color: var(--violet-800);">${r.unit||"—"}</td>
              <td style="color: var(--ink-soft); font-size: 0.85rem;">${r.description||"—"}</td>
              <td style="text-align: left;">
                <button class="btn btn-secondary btn-sm btn-edit-con" data-key="${r.key}">تعديل</button>
                <button class="btn btn-danger btn-sm btn-delete-con" data-key="${r.key}">حذف</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `,(i=a.querySelector("#btn-add-constant"))==null||i.addEventListener("click",()=>{V(null,t)}),a.querySelectorAll(".btn-edit-con").forEach(r=>{r.addEventListener("click",()=>{const e=r.getAttribute("data-key"),n=m.getConstant(e);V(n,t)})}),a.querySelectorAll(".btn-delete-con").forEach(r=>{r.addEventListener("click",()=>{const e=r.getAttribute("data-key"),n=m.getConstant(e);n&&S({title:`حذف الثابت: ${n.key}`,content:`<p>هل أنت متأكد من حذف الثابت <code>${n.key}</code>؟ قد يؤثر ذلك على المعادلات التي تستخدمه في صيغتها.</p>`,confirmText:"نعم، احذف",onConfirm:()=>{m.deleteConstant(e),t(),h(`تم حذف الثابت "${e}".`,{type:"info",duration:1e4,onUndo:()=>{m.saveConstant(n),t(),h("تمت استعادة الثابت.",{type:"success"})}})}})})}),a}function V(t,a){const s=!!t,i=`
    <form id="con-form">
      <div class="form-group">
        <label class="form-label" for="con-key-inp">رمز الثابت بالإنجليزية (مثل: g, rho, E_steel)</label>
        <input type="text" id="con-key-inp" class="form-input font-mono" value="${t?t.key:""}" ${s?"disabled":""} required />
      </div>
      <div class="form-group">
        <label class="form-label" for="con-label-inp">الاسم بالعربية</label>
        <input type="text" id="con-label-inp" class="form-input" value="${t&&t.label||""}" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="con-val-inp">القيمة الرقمية</label>
        <input type="number" step="any" id="con-val-inp" class="form-input font-mono" value="${t?t.value:""}" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="con-unit-inp">وحدة القياس (اختياري)</label>
        <input type="text" id="con-unit-inp" class="form-input font-mono" value="${t&&t.unit||""}" />
      </div>
      <div class="form-group">
        <label class="form-label" for="con-desc-inp">الوصف والتوضيح</label>
        <textarea id="con-desc-inp" class="form-textarea" rows="2">${t&&t.description||""}</textarea>
      </div>
    </form>
  `;S({title:s?"تعديل الثابت المركزي":"إضافة ثابت مركزي جديد",content:i,confirmText:"حفظ",onConfirm:()=>{const r=document.getElementById("con-key-inp").value.trim(),e=document.getElementById("con-label-inp").value.trim(),n=parseFloat(document.getElementById("con-val-inp").value),o=document.getElementById("con-unit-inp").value.trim(),l=document.getElementById("con-desc-inp").value.trim();if(!r||isNaN(n)){h("يرجى التأكد من كتابة رمز الثابت وقيمة رقمية صحيحة.",{type:"error"});return}m.saveConstant({key:r,label:e,value:n,unit:o,description:l}),h(`تم حفظ الثابت "${r}" بنجاح.`,{type:"success"}),a()}})}function Ae(t){var i;const a=document.createElement("div"),s=m.getTables();return a.innerHTML=`
    <div class="admin-card-header">
      <div>
        <h2 style="font-size: 1.4rem; color: var(--ink); margin-bottom: 4px;">إدارة الجداول المرجعية</h2>
        <p style="margin: 0; font-size: 0.88rem; color: var(--ink-soft);">جداول خواص المواد ودرجات الخرسانة والتسليح التي ترتبط بها المعادلات.</p>
      </div>
      <button class="btn btn-primary btn-sm" id="btn-add-table">
        + إنشاء جدول جديد
      </button>
    </div>

    ${s.map(r=>`
      <div class="card" style="margin-bottom: 24px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
          <div>
            <h3 style="font-size: 1.15rem; color: var(--violet-800); margin-bottom: 2px;">${r.title}</h3>
            <span style="font-family: var(--font-mono); font-size: 0.82rem; color: var(--ink-muted);">معرّف الجدول: <code>${r.id}</code></span>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary btn-sm btn-add-row" data-id="${r.id}">+ إضافة صف</button>
            <button class="btn btn-danger btn-sm btn-delete-table" data-id="${r.id}">حذف الجدول</button>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                ${(r.columns||[]).map(e=>`
                  <th>${e.label||e.key} ${e.unit?`[${e.unit}]`:""}</th>
                `).join("")}
                <th style="width: 80px; text-align: left;">حذف</th>
              </tr>
            </thead>
            <tbody>
              ${(r.rows||[]).map((e,n)=>`
                <tr>
                  ${(r.columns||[]).map((o,l)=>`
                    <td class="${o.type==="number"?"font-mono":""}" style="${l===0?"font-weight: 600;":""}">
                      ${e[o.key]!==void 0?e[o.key]:"—"}
                    </td>
                  `).join("")}
                  <td style="text-align: left;">
                    <button class="btn btn-ghost btn-sm btn-delete-row" data-table="${r.id}" data-row="${n}" style="color: var(--error); padding: 2px 6px;">
                      ✕
                    </button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `).join("")}
  `,(i=a.querySelector("#btn-add-table"))==null||i.addEventListener("click",()=>{ze(t)}),a.querySelectorAll(".btn-add-row").forEach(r=>{r.addEventListener("click",()=>{const e=r.getAttribute("data-id"),n=m.getTable(e);n&&qe(n,t)})}),a.querySelectorAll(".btn-delete-row").forEach(r=>{r.addEventListener("click",()=>{const e=r.getAttribute("data-table"),n=parseInt(r.getAttribute("data-row"),10),o=m.getTable(e);o&&o.rows&&(o.rows.splice(n,1),m.saveTable(o),t(),h("تم حذف الصف بنجاح.",{type:"info"}))})}),a.querySelectorAll(".btn-delete-table").forEach(r=>{r.addEventListener("click",()=>{const e=r.getAttribute("data-id"),n=m.getTable(e);n&&S({title:`حذف الجدول: ${n.title}`,content:"<p>هل أنت متأكد من حذف هذا الجدول وجميع صفوفه؟</p>",confirmText:"نعم، احذف",onConfirm:()=>{m.deleteTable(e),t(),h(`تم حذف الجدول "${n.title}".`,{type:"info",duration:1e4,onUndo:()=>{m.saveTable(n),t(),h("تمت استعادة الجدول.",{type:"success"})}})}})})}),a}function ze(t){S({title:"إنشاء جدول مرجعي جديد",content:`
    <form id="new-table-form">
      <div class="form-group">
        <label class="form-label" for="tbl-id">معرّف الجدول (ID بالإنجليزية)</label>
        <input type="text" id="tbl-id" class="form-input font-mono" placeholder="rebar_diameters" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="tbl-title">اسم الجدول بالعربية</label>
        <input type="text" id="tbl-title" class="form-input" placeholder="أقطار ومساحات حديد التسليح" required />
      </div>
      <div class="form-group">
        <label class="form-label">الأعمدة (مفتاح:اسم:وحدة مفصولة بفاصلة)</label>
        <textarea id="tbl-cols" class="form-textarea font-mono" rows="3" placeholder="bar:القطر:mm, area:المساحة:mm2, weight:الوزن:kg/m"></textarea>
        <span class="form-hint">اكتب كل عمود بصيغة <code>المفتاح:الاسم:الوحدة</code>، وافصل بين الأعمدة بفاصلة.</span>
      </div>
    </form>
  `,confirmText:"إنشاء",onConfirm:()=>{const s=document.getElementById("tbl-id").value.trim(),i=document.getElementById("tbl-title").value.trim(),r=document.getElementById("tbl-cols").value.trim();if(!s||!i||!r){h("يرجى ملء جميع الحقول المطلوبة.",{type:"error"});return}const e=r.split(",").map(n=>{const[o,l,d]=n.split(":").map(y=>y?y.trim():"");return{key:o,label:l||o,unit:d||"",type:"text"}}).filter(n=>n.key);m.saveTable({id:s,title:i,columns:e,rows:[]}),h(`تم إنشاء الجدول "${i}" بنجاح.`,{type:"success"}),t()}})}function qe(t,a){const s=`
    <form id="add-row-form">
      ${(t.columns||[]).map(i=>`
        <div class="form-group">
          <label class="form-label" for="row-col-${i.key}">
            <span>${i.label||i.key}</span>
            ${i.unit?`<span class="form-label-optional">[${i.unit}]</span>`:""}
          </label>
          <input type="text" id="row-col-${i.key}" class="form-input" required />
        </div>
      `).join("")}
    </form>
  `;S({title:`إضافة صف إلى: ${t.title}`,content:s,confirmText:"إضافة الصف",onConfirm:()=>{const i={};(t.columns||[]).forEach(r=>{const e=document.getElementById(`row-col-${r.key}`);if(e){const n=e.value.trim();i[r.key]=!isNaN(Number(n))&&n!==""?Number(n):n}}),t.rows=t.rows||[],t.rows.push(i),m.saveTable(t),h("تمت إضافة الصف بنجاح.",{type:"success"}),a()}})}async function Te(t){var x;const a=document.createElement("div"),s=await m.listMediaAssets(),i=await m.getMediaStorageUsage(),r=m.getFormulas(),e=m.getCategories(),n=m.getSettings(),o=u=>{if(u===0)return"0 كيلوبايت";const p=1024,b=["بايت","كيلوبايت","ميجابايت","جيجابايت"],g=Math.floor(Math.log(u)/Math.log(p));return parseFloat((u/Math.pow(p,g)).toFixed(2))+" "+b[g]},l=u=>{const p=[];return r.forEach(b=>{b.coverAssetId===u&&p.push(`غلاف معادلة: "${b.title}"`),b.galleryAssetIds&&b.galleryAssetIds.includes(u)&&p.push(`معرض معادلة: "${b.title}"`)}),e.forEach(b=>{b.coverAssetId===u&&p.push(`غلاف تصنيف: "${b.title}"`)}),n.logoAssetId===u&&p.push("شعار الموقع الأساسي"),n.faviconAssetId===u&&p.push("أيقونة الموقع Favicon"),n.heroBackgroundAssetIds&&n.heroBackgroundAssetIds.includes(u)&&p.push("خلفية الهيرو"),p};a.innerHTML=`
    <div class="admin-card-header">
      <div>
        <h2 style="font-size: 1.4rem; color: var(--ink); margin-bottom: 4px;">مكتبة الوسائط والصور</h2>
        <p style="margin: 0; font-size: 0.88rem; color: var(--ink-soft);">
          رفع وضغط وتخزين الصور محلياً في IndexedDB مع إنشاء نسخ مصغرة تلقائية.
        </p>
      </div>

      <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
        <span style="font-size: 0.82rem; font-family: var(--font-mono); color: var(--violet-700); background-color: var(--violet-50); border: 1px solid var(--violet-100); padding: 4px 10px; border-radius: var(--radius-sm);">
          المساحة المستخدمة: ${o(i)}
        </span>
        <label class="btn btn-primary btn-sm" style="cursor: pointer;">
          + رفع صورة جديدة
          <input type="file" id="media-upload-input" accept="image/*" style="display: none;" />
        </label>
      </div>
    </div>

    <!-- منطقة السحب والإفلات Drop Zone -->
    <div id="media-drop-zone" style="
      border: 2px dashed var(--line-strong); 
      border-radius: var(--radius-lg); 
      padding: 32px 20px; 
      text-align: center; 
      background-color: #FFFFFF; 
      margin-bottom: 24px;
      cursor: pointer;
      transition: background-color var(--transition-fast), border-color var(--transition-fast);
    ">
      <div style="color: var(--violet-600); margin-bottom: 8px;">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
      </div>
      <div style="font-weight: 600; color: var(--ink); margin-bottom: 4px;">اسحب الصور وأفلتها هنا، أو اضغط للاختيار من جهازك</div>
      <div style="font-size: 0.8rem; color: var(--ink-soft);">
        الصيغ المدعومة: JPG, PNG, WebP, SVG (الحد الأقصى 8MB - يتم الضغط تلقائياً إلى 1600px WebP)
      </div>
    </div>

    <!-- شريط البحث -->
    <div style="margin-bottom: 20px; max-width: 400px;">
      <input type="text" id="media-search" class="form-input" placeholder="ابحث باسم الصورة أو الوصف البديل..." />
    </div>

    <!-- شبكة استعراض الوسائط -->
    <div id="media-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 18px;">
      <!-- تُملأ ديناميكياً -->
    </div>
  `;function d(u=""){const p=a.querySelector("#media-grid");if(!p)return;const b=s.filter(g=>{const c=u.toLowerCase();return(g.name||"").toLowerCase().includes(c)||(g.alt||"").toLowerCase().includes(c)||(g.tags||[]).some($=>$.toLowerCase().includes(c))});if(b.length===0){p.innerHTML=`
        <div class="empty-state" style="grid-column: 1 / -1;">
          <h4 class="empty-state-title">لا توجد صور مخزنة</h4>
          <p class="empty-state-desc">قم برفع أول رسم هندسي أو صورة إلى مكتبة الوسائط أعلاه.</p>
        </div>
      `;return}p.innerHTML=b.map(g=>{const c=l(g.id);return`
        <div class="card" style="padding: 12px; display: flex; flex-direction: column;">
          <div style="
            width: 100%; 
            height: 140px; 
            border-radius: var(--radius-sm); 
            overflow: hidden; 
            background: var(--bg-soft); 
            display: flex; 
            align-items: center; 
            justify-content: center;
            border: 1px solid var(--line);
            margin-bottom: 10px;
          ">
            <img src="${g.thumbUrl||g.dataUrl}" alt="${g.alt||g.name}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>

          <div style="font-weight: 600; font-size: 0.9rem; color: var(--ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 2px;">
            ${g.name}
          </div>

          <div style="font-size: 0.78rem; color: var(--ink-soft); margin-bottom: 8px;">
            الحجم: <strong>${o(g.size||0)}</strong> ${g.width?`(${g.width}×${g.height})`:""}
          </div>

          <div style="margin-bottom: 12px; font-size: 0.75rem;">
            ${c.length>0?`<span class="badge badge-published">مستخدمة في ${c.length} مواضع</span>`:'<span class="badge badge-draft">غير مستخدمة</span>'}
          </div>

          <div style="display: flex; gap: 6px; margin-top: auto; border-top: 1px solid var(--line); padding-top: 10px;">
            <button class="btn btn-secondary btn-sm btn-edit-asset" data-id="${g.id}" style="flex-grow: 1;">تفاصيل</button>
            <button class="btn btn-danger btn-sm btn-delete-asset" data-id="${g.id}">حذف</button>
          </div>
        </div>
      `}).join(""),p.querySelectorAll(".btn-edit-asset").forEach(g=>{g.addEventListener("click",()=>{const c=g.getAttribute("data-id"),$=s.find(w=>w.id===c);$&&Ie($,()=>t())})}),p.querySelectorAll(".btn-delete-asset").forEach(g=>{g.addEventListener("click",()=>{const c=g.getAttribute("data-id"),$=s.find(L=>L.id===c);if(!$)return;const w=l(c);let k=`<p>هل أنت متأكد من حذف الصورة <strong>${$.name}</strong> نهائياً من التخزين؟</p>`;w.length>0&&(k=`
            <div style="padding: 12px; background: var(--warn-bg); border: 1px solid #F5DEB3; border-radius: var(--radius-sm); margin-bottom: 12px; color: var(--warn);">
              ⚠️ <strong>تحذير:</strong> هذه الصورة مستخدمة حالياً في: <br/>${w.join("<br/>")}
            </div>
            <p>سيؤدي حذفها إلى استبدالها برسم هندسي بديل تلقائياً في تلك الصفحات.</p>
          `),S({title:`حذف الصورة: ${$.name}`,content:k,confirmText:"نعم، احذف نهائياً",onConfirm:async()=>{await m.deleteMediaAsset(c),h(`تم حذف الصورة "${$.name}".`,{type:"info"}),t()}})})})}async function y(u){if(u)try{h("جاري ضغط ومعالجة الصورة في المتصفح...",{type:"info",duration:2500});const p=await ie(u),b={id:"asset-"+Date.now(),name:u.name,alt:u.name.replace(/\.[^/.]+$/,""),mimeType:p.mimeType,dataUrl:p.dataUrl,thumbUrl:p.thumbUrl,width:p.width,height:p.height,size:p.compressedSize,tags:[]};await m.saveMediaAsset(b),h(`تم ضغط الصورة وحفظها بنجاح (${o(p.compressedSize)})!`,{type:"success"}),t()}catch(p){h(p.message||"فشل رفع وضغط الصورة.",{type:"error"})}}const f=a.querySelector("#media-upload-input");f==null||f.addEventListener("change",u=>{var p;y((p=u.target.files)==null?void 0:p[0])});const v=a.querySelector("#media-drop-zone");return v&&(v.addEventListener("click",()=>f==null?void 0:f.click()),v.addEventListener("dragover",u=>{u.preventDefault(),v.style.backgroundColor="var(--violet-50)",v.style.borderColor="var(--violet-600)"}),v.addEventListener("dragleave",()=>{v.style.backgroundColor="#FFFFFF",v.style.borderColor="var(--line-strong)"}),v.addEventListener("drop",u=>{var b,g;u.preventDefault(),v.style.backgroundColor="#FFFFFF",v.style.borderColor="var(--line-strong)";const p=(g=(b=u.dataTransfer)==null?void 0:b.files)==null?void 0:g[0];p&&y(p)})),(x=a.querySelector("#media-search"))==null||x.addEventListener("input",u=>{d(u.target.value.trim())}),d(),a}function Ie(t,a){const s=`
    <div style="display: flex; gap: 16px; margin-bottom: 16px;">
      <div style="width: 120px; height: 100px; border-radius: var(--radius-sm); overflow: hidden; background: var(--bg-soft); border: 1px solid var(--line); flex-shrink: 0;">
        <img src="${t.thumbUrl||t.dataUrl}" alt="${t.alt}" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>
      <div>
        <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--violet-700); margin-bottom: 4px;">المعرف: ${t.id}</div>
        <div style="font-size: 0.82rem; color: var(--ink-soft);">الأبعاد: ${t.width||"—"} × ${t.height||"—"} بكسل</div>
        <div style="font-size: 0.82rem; color: var(--ink-soft);">الصيغة: ${t.mimeType}</div>
      </div>
    </div>

    <form id="asset-edit-form">
      <div class="form-group">
        <label class="form-label" for="asset-name-inp">اسم الصورة</label>
        <input type="text" id="asset-name-inp" class="form-input" value="${t.name||""}" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="asset-alt-inp">النص البديل Alt (إلزامي للوصولية)</label>
        <input type="text" id="asset-alt-inp" class="form-input" value="${t.alt||""}" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="asset-tags-inp">الوسوم (مفصولة بفواصل)</label>
        <input type="text" id="asset-tags-inp" class="form-input" value="${(t.tags||[]).join(", ")}" />
      </div>
    </form>
  `;S({title:"تفاصيل وتعديل بيانات الصورة",content:s,confirmText:"حفظ التعديلات",onConfirm:async()=>{const i=document.getElementById("asset-name-inp").value.trim(),r=document.getElementById("asset-alt-inp").value.trim(),n=document.getElementById("asset-tags-inp").value.trim().split(",").map(o=>o.trim()).filter(Boolean);if(!i||!r){h("اسم الصورة والنص البديل كلاهما مطلوب.",{type:"error"});return}await m.saveMediaAsset({...t,name:i,alt:r,tags:n}),h("تم تحديث بيانات الصورة بنجاح.",{type:"success"}),a()}})}function O(t,a,s,i){let r=s;t.innerHTML=`
    <label class="form-label">${a}</label>
    <div style="display:flex; gap:10px; align-items:center;">
      <div class="ap-thumb" style="width:64px; height:48px; border:1px dashed var(--line); border-radius:var(--radius); overflow:hidden; background:var(--bg-soft);"></div>
      <button type="button" class="btn btn-secondary btn-sm ap-pick">اختر صورة</button>
      <button type="button" class="btn btn-ghost btn-sm ap-clear" style="color:var(--error);">إزالة</button>
    </div>`;const e=t.querySelector(".ap-thumb");async function n(){if(e.innerHTML="",!r)return;const o=await m.getMediaAsset(r);o&&(e.innerHTML=`<img src="${o.thumbUrl||o.dataUrl}" alt="" style="width:100%; height:100%; object-fit:cover;">`)}t.querySelector(".ap-pick").addEventListener("click",()=>{M({currentAssetId:r,onSelect:o=>{o&&(r=o.id,i(r),n())}})}),t.querySelector(".ap-clear").addEventListener("click",()=>{r=null,i(null),n()}),n()}function je(t){const a=m.getSettings(),s={logo:a.logoAssetId||null,favicon:a.faviconAssetId||null,hero:a.heroBackgroundAssetIds&&a.heroBackgroundAssetIds[0]||null},i=document.createElement("div"),r=Object.entries(R).map(([o,l])=>`
    <label style="display:flex; align-items:center; gap:6px; cursor:pointer; padding:6px 10px; border:1px solid var(--line); border-radius:var(--radius);">
      <input type="radio" name="ap-color" value="${o}" ${(a.colorPreset||"violet")===o?"checked":""}>
      <span style="width:18px; height:18px; border-radius:50%; background:${l.vars[600]};"></span>${l.label}
    </label>`).join("");i.innerHTML=`
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
      <div class="form-group"><label class="form-label">اللون الأساسي</label><div style="display:flex; flex-wrap:wrap; gap:8px;">${r}</div></div>
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
    </div>`,i.querySelector("#ap-name").value=a.siteName||"",i.querySelector("#ap-tagline").value=a.tagline||"",i.querySelector("#ap-footer").value=a.footerText||"",i.querySelector("#ap-anim").checked=a.animationsEnabled!==!1;const e=i.querySelector("#ap-overlay"),n=i.querySelector("#ap-overlay-val");return e.value=Math.round((a.heroOverlayOpacity??.55)*100),n.textContent=e.value,e.addEventListener("input",()=>{n.textContent=e.value}),O(i.querySelector("#ap-logo"),"الشعار (يستبدل الأيقونة الافتراضية)",s.logo,o=>{s.logo=o}),O(i.querySelector("#ap-favicon"),"أيقونة المتصفح (Favicon)",s.favicon,o=>{s.favicon=o}),O(i.querySelector("#ap-hero"),"خلفية الهيرو في الرئيسية",s.hero,o=>{s.hero=o}),i.querySelector("#ap-save").addEventListener("click",()=>{var d;const o=i.querySelector("#ap-name").value.trim();if(!o){h("اسم الموقع مطلوب.",{type:"error"});return}const l=((d=i.querySelector('input[name="ap-color"]:checked'))==null?void 0:d.value)||"violet";m.updateSettings({siteName:o,tagline:i.querySelector("#ap-tagline").value.trim(),footerText:i.querySelector("#ap-footer").value.trim(),colorPreset:l,primaryColor:R[l].vars[600],logoAssetId:s.logo,faviconAssetId:s.favicon,heroBackgroundAssetIds:s.hero?[s.hero]:[],heroOverlayOpacity:Number(e.value)/100,animationsEnabled:i.querySelector("#ap-anim").checked}),window.dispatchEvent(new Event("site-settings-changed")),h("تم حفظ مظهر الموقع.",{type:"success"})}),i}const Ce={hero:"الهيرو",stats:"الإحصائيات",categories:"التصنيفات","latest-formulas":"أحدث المعادلات",gallery:"المعرض",about:"عن الموقع","sources-preview":"معاينة المصادر","custom-text":"نص مخصص",modules:"الوحدات المتخصصة"};function G(t){let a=m.getHomeSections().map(r=>({...r})).sort((r,e)=>(r.order||0)-(e.order||0));const s=document.createElement("div");function i(){s.innerHTML=`
      <div class="admin-card-header">
        <div>
          <h2 style="font-size:1.4rem; color:var(--ink); margin-bottom:4px;">أقسام الصفحة الرئيسية</h2>
          <p style="margin:0; font-size:.88rem; color:var(--ink-soft);">رتّب الأقسام بالأسهم، أخفِ ما لا تريده، وعدّل عناوينها.</p>
        </div>
        <button type="button" class="btn btn-primary btn-sm" id="hs-save">حفظ الترتيب</button>
      </div>
      <div style="display:grid; gap:10px; max-width:720px;">
        ${a.map((e,n)=>`
          <div class="card" style="padding:12px; display:flex; gap:10px; align-items:center; ${e.enabled===!1?"opacity:.55;":""}">
            <div style="display:flex; flex-direction:column; gap:2px;">
              <button type="button" class="btn btn-ghost btn-sm" data-up="${n}" ${n===0?"disabled":""}>▲</button>
              <button type="button" class="btn btn-ghost btn-sm" data-down="${n}" ${n===a.length-1?"disabled":""}>▼</button>
            </div>
            <div style="flex:1;">
              <div style="font-size:.75rem; color:var(--violet-700); margin-bottom:4px;">${Ce[e.type]||e.type}</div>
              <input class="form-input" data-title="${n}" placeholder="عنوان القسم">
            </div>
            <label style="display:flex; align-items:center; gap:6px; cursor:pointer; white-space:nowrap;">
              <input type="checkbox" data-enabled="${n}" ${e.enabled!==!1?"checked":""}> ظاهر
            </label>
          </div>`).join("")}
      </div>`,s.querySelectorAll("[data-title]").forEach(e=>{const n=Number(e.dataset.title);e.value=a[n].title||"",e.addEventListener("input",()=>{a[n].title=e.value})}),s.querySelectorAll("[data-enabled]").forEach(e=>{e.addEventListener("change",()=>{a[Number(e.dataset.enabled)].enabled=e.checked,i()})});const r=(e,n)=>{[a[e],a[n]]=[a[n],a[e]],i()};s.querySelectorAll("[data-up]").forEach(e=>e.addEventListener("click",()=>r(Number(e.dataset.up),Number(e.dataset.up)-1))),s.querySelectorAll("[data-down]").forEach(e=>e.addEventListener("click",()=>r(Number(e.dataset.down),Number(e.dataset.down)+1))),s.querySelector("#hs-save").addEventListener("click",()=>{a.forEach((e,n)=>{e.order=n+1}),m.saveHomeSections(a),h("تم حفظ ترتيب أقسام الرئيسية.",{type:"success"})})}return i(),s}const se="almuhandis-bundle",oe=1,le=["formulas","categories","sources","constants","tables"],j={"image/webp":"webp","image/png":"png","image/jpeg":"jpg","image/svg+xml":"svg"},de=t=>String(t).replace(/[^\w.-]/g,"_");function C(t){const a=/^data:([^;,]+)((?:;[^;,]+)*),(.*)$/s.exec(t||"");if(!a)throw new Error("رابط صورة غير صالح");const s=a[1];if(a[2].includes(";base64")){const i=atob(a[3]),r=new Uint8Array(i.length);for(let e=0;e<i.length;e++)r[e]=i.charCodeAt(e);return{mime:s,bytes:r}}return{mime:s,bytes:T(decodeURIComponent(a[3]))}}function Z(t,a){let s="";for(let i=0;i<a.length;i+=32768)s+=String.fromCharCode.apply(null,a.subarray(i,i+32768));return`data:${t};base64,${btoa(s)}`}function Me(t){const a={},{assets:s=[],...i}=t,r=[];for(const n of s){const{dataUrl:o,thumbUrl:l,...d}=n,y=de(n.id),f=C(o),v=j[f.mime]||"bin",x={...d,mimeType:n.mimeType||f.mime,file:`media/${y}.${v}`};if(a[x.file]=[f.bytes,{level:0}],l&&l!==o){const u=C(l);x.thumbFile=`media/${y}.thumb.${j[u.mime]||"bin"}`,a[x.thumbFile]=[u.bytes,{level:0}]}r.push(x)}const e=Object.fromEntries(le.map(n=>[n,(i[n]||[]).length]));return e.assets=s.length,a["manifest.json"]=T(JSON.stringify({format:se,version:oe,schemaVersion:i.schemaVersion,exportedAt:i.exportedAt||new Date().toISOString(),generator:i.generator||"",counts:e},null,2)),a["data.json"]=T(JSON.stringify(i)),a["media/index.json"]=T(JSON.stringify(r)),te(a,{level:6})}function Fe(t){let a;try{a=ve(t)}catch{throw new Error("الملف ليس حزمة ZIP صالحة.")}if(!a["manifest.json"]||!a["data.json"])throw new Error("هذه ليست حزمة موقع (ينقصها manifest.json أو data.json).");let s,i,r;try{s=JSON.parse(N(a["manifest.json"])),i=JSON.parse(N(a["data.json"])),r=a["media/index.json"]?JSON.parse(N(a["media/index.json"])):[]}catch{throw new Error("ملفات الحزمة تالفة (JSON غير صالح).")}if(s.format!==se)throw new Error("صيغة الحزمة غير معروفة.");if(s.version>oe)throw new Error("الحزمة من إصدار أحدث من هذا الموقع.");const e=r.map(n=>{const{file:o,thumbFile:l,...d}=n;if(!a[o])throw new Error(`ملف الصورة مفقود داخل الحزمة: ${o}`);const y=Z(d.mimeType,a[o]),f=l&&a[l]?Z(l.endsWith(".svg")?"image/svg+xml":d.mimeType,a[l]):y;return{...d,dataUrl:y,thumbUrl:f}});return{pkg:{...i,assets:e},manifest:s}}const Ne=new Set(["updatedAt","createdAt"]);function A(t){return Array.isArray(t)?`[${t.map(A).join(",")}]`:t&&typeof t=="object"?`{${Object.keys(t).filter(a=>!Ne.has(a)).sort().map(a=>`${JSON.stringify(a)}:${A(t[a])}`).join(",")}}`:JSON.stringify(t)}function Oe(t=[],a=[]){const s=new Map(t.map(r=>[r.id,A(r)])),i={added:[],same:[],changed:[]};for(const r of a)s.has(r.id)?s.get(r.id)===A(r)?i.same.push(r.id):i.changed.push(r.id):i.added.push(r.id);return i}function Ue(t,a){const s={};for(const o of[...le,"assets"])s[o]=Oe(t[o],a[o]);const i=A(t.settings||{})!==A(a.settings||{}),r=A(t.homeSections||[])!==A(a.homeSections||[]),e={};for(const o of Object.keys(a.modules||{})){const l=(t.modules||{})[o];e[o]=l===void 0?"added":A(l)===A(a.modules[o])?"same":"changed"}const n=i||r||Object.values(s).some(o=>o.changed.length>0)||Object.values(e).includes("changed");return{collections:s,settingsChanged:i,homeChanged:r,modules:e,hasConflicts:n}}function Be(t){const{assets:a=[],settings:s={},exportedAt:i,generator:r,...e}=t,{adminPinHash:n,...o}=s,l={},d=[];for(const y of a){const{dataUrl:f,thumbUrl:v,...x}=y,u=de(y.id),p=C(f),b={...x,mimeType:y.mimeType||p.mime,file:`${u}.${j[p.mime]||"bin"}`};if(l[`uploads/${b.file}`]=[p.bytes,{level:0}],v&&v!==f){const g=C(v);b.thumbFile=`${u}.thumb.${j[g.mime]||"bin"}`,l[`uploads/${b.thumbFile}`]=[g.bytes,{level:0}]}d.push(b)}return l["uploads/index.json"]=T(JSON.stringify(d)),l["seed.json"]=T(JSON.stringify({...e,settings:o,seedVersion:Date.now()},null,2)),te(l,{level:6})}async function F(){const t=m.getAllDataSync(),a=await m.listMediaAssets();return{...t,exportedAt:new Date().toISOString(),generator:"almuhandis-alsaghir-v2",modules:pe(),assets:a}}function B(t,a){const s=URL.createObjectURL(t),i=document.createElement("a");i.href=s,i.download=a,document.body.appendChild(i),i.click(),document.body.removeChild(i),setTimeout(()=>URL.revokeObjectURL(s),1e3)}const H=()=>new Date().toISOString().slice(0,10);async function He(t=`almuhandis-backup-${H()}.zip`){const a=await F(),s=Me(a);return B(new Blob([s],{type:"application/zip"}),t),{assets:a.assets.length,bytes:s.length}}async function Pe(t=`almuhandis-backup-${H()}.json`){const a=await F();B(new Blob([JSON.stringify(a,null,2)],{type:"application/json;charset=utf-8"}),t)}async function Re(t){const a=new Uint8Array(await t.arrayBuffer());if(a[0]===80&&a[1]===75)return Fe(a).pkg;try{return JSON.parse(new TextDecoder().decode(a))}catch{throw new Error("الملف ليس حزمة ZIP ولا JSON سليماً.")}}async function De(t){const a=Q(t);if(!a.isValid)return{ok:!1,errors:a.errors};const s=W(t,t.schemaVersion||0),i=await F();return{ok:!0,pkg:s,conflicts:Ue(i,s),errors:[]}}async function Je(t,{mode:a="merge"}={}){let s=t;if(typeof t=="string")try{s=JSON.parse(t)}catch{return{success:!1,message:"الملف تالف: ليس بصيغة JSON صالحة.",errors:[]}}const i=Q(s);if(!i.isValid)return{success:!1,message:"فشل التحقق من محتوى الحزمة.",errors:i.errors};const r=W(s,s.schemaVersion||0);if(a==="replace"){m.clearAllData(),ee();for(const e of await m.listMediaAssets())await m.deleteMediaAsset(e.id);m.restoreAllData(r)}else if((r.formulas||[]).forEach(e=>m.saveFormula(e)),(r.categories||[]).forEach(e=>m.saveCategory(e)),(r.sources||[]).forEach(e=>m.saveSource(e)),(r.constants||[]).forEach(e=>m.saveConstant(e)),(r.tables||[]).forEach(e=>m.saveTable(e)),r.settings&&m.updateSettings(r.settings),Array.isArray(r.homeSections)&&r.homeSections.length){const e=new Map(m.getHomeSections().map(n=>[n.id,n]));r.homeSections.forEach(n=>e.set(n.id,n)),m.saveHomeSections([...e.values()].sort((n,o)=>(n.order||0)-(o.order||0)))}for(const e of r.assets||[])await m.saveMediaAsset(e);return ce(r.modules,a),{success:!0,message:a==="replace"?"تم استبدال بيانات الموقع بالكامل.":"تم دمج البيانات المستوردة.",errors:[]}}async function _e(t=`almuhandis-publish-${H()}.zip`){const a=await F(),s=Be(a);return B(new Blob([s],{type:"application/zip"}),t),{assets:a.assets.length,bytes:s.length}}async function Ve(){m.clearAllData(),ee();for(const t of await m.listMediaAssets())await m.deleteMediaAsset(t.id);m.loadSeedData()}const Ge={formulas:"المعادلات",categories:"التصنيفات",sources:"المصادر",constants:"الثوابت",tables:"الجداول",assets:"الصور"},Ze={added:"جديد",same:"مطابق",changed:"مختلف"};function Ke(t){const a=document.createElement("div"),s=ue().map(n=>`<li>${n.label}</li>`).join("");a.innerHTML=`
    <div class="admin-card-header"><div>
      <h2 style="font-size:1.4rem; color:var(--ink); margin-bottom:4px;">النسخ الاحتياطي</h2>
      <p style="margin:0; font-size:.88rem; color:var(--ink-soft);">كل بيانات الموقع تُحفظ في متصفحك. نزّل نسخة بانتظام.</p>
    </div></div>
    <div style="display:grid; gap:16px; max-width:760px;">
      <div class="card" style="padding:20px; display:grid; gap:10px;">
        <h3 style="margin:0;">تصدير</h3>
        <p style="margin:0; font-size:.88rem; color:var(--ink-soft);">ملف ZIP واحد يحوي: المعادلات والتصنيفات والمصادر والثوابت والجداول والإعدادات وأقسام الرئيسية والصور (ملفات حقيقية)، ومعها:</p>
        <ul style="margin:0; font-size:.88rem;">${s||"<li>لا توجد وحدات مسجلة</li>"}</ul>
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
    </div>`;const i=n=>a.querySelector(n);i("#bk-zip").addEventListener("click",async()=>{try{const n=await He();i("#bk-export-msg").textContent=`نُزّلت الحزمة (${n.assets} صورة، ${(n.bytes/1024).toFixed(0)} ك.ب).`}catch(n){h("تعذر إنشاء الحزمة: "+n.message,{type:"error"})}}),i("#bk-json").addEventListener("click",()=>Pe()),i("#bk-publish").addEventListener("click",async()=>{try{const n=await _e();i("#bk-publish-msg").textContent=`نُزّلت حزمة النشر (${n.assets} صورة، ${(n.bytes/1024).toFixed(0)} ك.ب).`}catch(n){h("تعذر إنشاء حزمة النشر: "+n.message,{type:"error"})}});let r=null;i("#bk-file").addEventListener("change",async n=>{const o=n.target.files[0],l=i("#bk-analysis");if(l.innerHTML="",!!o)try{const d=await De(await Re(o));if(!d.ok){l.innerHTML=`<div class="soil-warn" role="alert" style="color:var(--error);">${d.errors.join("<br>")}</div>`;return}r=d;const y=d.conflicts,f=Object.entries(y.collections).map(([x,u])=>`<tr><td>${Ge[x]}</td><td>${u.added.length}</td><td>${u.same.length}</td><td style="${u.changed.length?"color:var(--error);font-weight:700;":""}">${u.changed.length}</td></tr>`).join(""),v=Object.entries(y.modules).map(([x,u])=>`<li>${x}: ${Ze[u]}</li>`).join("");l.innerHTML=`
        <table style="width:100%; font-size:.88rem; border-collapse:collapse;"><thead><tr><th style="text-align:start">العنصر</th><th style="text-align:start">جديد</th><th style="text-align:start">مطابق</th><th style="text-align:start">متعارض</th></tr></thead><tbody>${f}</tbody></table>
        <div style="font-size:.85rem; margin-top:6px;">الإعدادات: ${y.settingsChanged?'<b style="color:var(--error)">مختلفة</b>':"مطابقة"} | أقسام الرئيسية: ${y.homeChanged?'<b style="color:var(--error)">مختلفة</b>':"مطابقة"}</div>
        ${v?`<ul style="font-size:.85rem; margin:6px 0;">${v}</ul>`:""}
        <div style="display:grid; gap:6px; margin-top:10px;">
          <label><input type="radio" name="bk-mode" value="merge" checked> <b>دمج</b>: يضيف الجديد ويحدّث المتعارض بقيمة الحزمة، ولا يحذف شيئاً عندك.</label>
          <label><input type="radio" name="bk-mode" value="replace"> <b>استبدال</b>: يمسح كل بيانات الموقع الحالية ويضع بدلها ما في الحزمة.</label>
        </div>
        <div style="margin-top:10px;"><button type="button" class="btn btn-primary" id="bk-apply">تطبيق الاستيراد</button></div>`,i("#bk-apply").addEventListener("click",e)}catch(d){l.innerHTML=`<div style="color:var(--error);" role="alert">${d.message}</div>`}});async function e(){const n=a.querySelector('input[name="bk-mode"]:checked').value;if(n==="replace"&&(!confirm("الاستبدال يمسح كل بيانات الموقع وصوره الحالية. هل تريد المتابعة؟")||!confirm("تأكيد أخير: لا يمكن التراجع عن الاستبدال (إلا بنسخة احتياطية). متابعة؟")))return;const o=await Je(r.pkg,{mode:n});if(!o.success){h(o.message,{type:"error"});return}h(o.message,{type:"success"}),window.dispatchEvent(new Event("site-settings-changed")),setTimeout(()=>location.reload(),700)}return i("#bk-reset").addEventListener("click",async()=>{confirm("سيُمسح كل شيء (معادلات، تصنيفات، صور، إعدادات) ويعود المحتوى الابتدائي. متابعة؟")&&confirm("تأكيد أخير: هل نزّلت نسخة احتياطية؟ سيتم المسح الآن.")&&(await Ve(),location.reload())}),a}const Xe=[{order:1,name:"Sand",condition:"(silt + 1.5*clay < 15)"},{order:2,name:"Loamy sand",condition:"(silt + 1.5*clay >= 15 and silt + 2*clay < 30)"},{order:3,name:"Sandy loam",condition:"((7 <= clay < 20 and sand > 52 and silt + 2*clay >= 30) or (clay < 7 and silt < 50 and silt + 2*clay >= 30))"},{order:4,name:"Loam",condition:"(7 <= clay < 27 and 28 <= silt < 50 and sand <= 52)"},{order:5,name:"Silt loam",condition:"((silt >= 50 and 12 <= clay < 27) or (50 <= silt < 80 and clay < 12))"},{order:6,name:"Silt",condition:"(silt >= 80 and clay < 12)"},{order:7,name:"Sandy clay loam",condition:"(20 <= clay < 35 and silt < 28 and sand > 45)"},{order:8,name:"Clay loam",condition:"(27 <= clay < 40 and 20 < sand <= 45)"},{order:9,name:"Silty clay loam",condition:"(27 <= clay < 40 and sand <= 20)"},{order:10,name:"Sandy clay",condition:"(clay >= 35 and sand > 45)"},{order:11,name:"Silty clay",condition:"(clay >= 40 and silt >= 40)"},{order:12,name:"Clay",condition:"(clay >= 40 and sand <= 45 and silt < 40)"}],Ye={rules:Xe},z=t=>String(t??"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a]),Qe=[...new Set([...Object.values(D.coarseNames).flat(),...Object.values(D.fineBaseNames),...Ye.rules.map(t=>t.name)])],K=t=>`${t}-${Date.now().toString(36)}${Math.random().toString(36).slice(2,5)}`;function We(){const t=me(),a=document.createElement("div"),s=()=>{fe(t),h("حُفظ.",{type:"success"})};function i(){a.innerHTML=`
      <div class="admin-card-header"><div>
        <h2 style="font-size:1.4rem; color:var(--ink); margin-bottom:4px;">وحدة ميكانيك التربة</h2>
        <p style="margin:0; font-size:.88rem; color:var(--ink-soft);">تحرير الترجمات والملاحظات والأمثلة الإضافية. القوانين وقواعد التصنيف مقفلة (من المحاضرة).</p>
      </div></div>
      <div style="display:grid; gap:16px; max-width:820px;">
        <div class="card" style="padding:20px; display:grid; gap:10px;">
          <h3 style="margin:0;">الترجمات العربية للأسماء</h3>
          <datalist id="sa-en">${Qe.map(r=>`<option value="${z(r)}">`).join("")}</datalist>
          ${Object.entries(t.translations).map(([r,e])=>`
            <div style="display:flex; gap:8px; align-items:center;">
              <span dir="ltr" style="flex:1; font-size:.9rem;">${z(r)}</span>
              <input class="form-input" style="flex:1;" data-tr="${z(r)}" value="${z(e)}">
              <button type="button" class="btn btn-ghost btn-sm" data-del-tr="${z(r)}" style="color:var(--error);">حذف</button>
            </div>`).join("")||'<div style="font-size:.85rem; color:var(--ink-soft);">لا ترجمات معدّلة بعد، فيُستخدم الاسم المترجم تلقائياً.</div>'}
          <div style="display:flex; gap:8px;">
            <input class="form-input" dir="ltr" list="sa-en" id="sa-new-en" placeholder="الاسم الإنجليزي (مثل Sandy lean clay)" style="flex:1;">
            <input class="form-input" id="sa-new-ar" placeholder="الترجمة العربية" style="flex:1;">
            <button type="button" class="btn btn-secondary btn-sm" id="sa-add-tr">إضافة</button>
          </div>
        </div>
        <div class="card" style="padding:20px; display:grid; gap:10px;">
          <h3 style="margin:0;">الملاحظات</h3>
          ${t.notes.map(r=>`
            <div style="display:grid; gap:6px; border:1px solid var(--line); border-radius:var(--radius); padding:10px;">
              <input class="form-input" data-note="${r.id}" data-f="title" value="${z(r.title)}" placeholder="عنوان الملاحظة">
              <textarea class="form-textarea" rows="2" data-note="${r.id}" data-f="text" placeholder="نص الملاحظة">${z(r.text)}</textarea>
              <div><button type="button" class="btn btn-ghost btn-sm" data-del-note="${r.id}" style="color:var(--error);">حذف</button></div>
            </div>`).join("")}
          <div><button type="button" class="btn btn-secondary btn-sm" id="sa-add-note">+ ملاحظة</button></div>
        </div>
        <div class="card" style="padding:20px; display:grid; gap:10px;">
          <h3 style="margin:0;">أمثلة إضافية</h3>
          <div style="font-size:.85rem; color:var(--ink-soft);">اكتب المعطيات بصيغة <span dir="ltr">P4=70, F200=30, LL=33, PL=12</span> (للتصنيف) أو <span dir="ltr">gamma=19.8, G=2.7, w=11</span> (للقوانين).</div>
          ${t.examples.map(r=>`
            <div style="display:grid; gap:6px; border:1px solid var(--line); border-radius:var(--radius); padding:10px;">
              <input class="form-input" data-ex="${r.id}" data-f="title" value="${z(r.title)}" placeholder="اسم المثال">
              <input class="form-input" dir="ltr" data-ex="${r.id}" data-f="inputs" value="${z(r.inputs)}" placeholder="P4=70, F200=30, LL=33, PL=12">
              <div><button type="button" class="btn btn-ghost btn-sm" data-del-ex="${r.id}" style="color:var(--error);">حذف</button></div>
            </div>`).join("")}
          <div><button type="button" class="btn btn-secondary btn-sm" id="sa-add-ex">+ مثال</button></div>
        </div>
      </div>`}return a.addEventListener("change",r=>{const e=r.target.dataset;e.tr?(t.translations[e.tr]=r.target.value.trim(),s()):e.note?(t.notes.find(n=>n.id===e.note)[e.f]=r.target.value,s()):e.ex&&(t.examples.find(n=>n.id===e.ex)[e.f]=r.target.value,s())}),a.addEventListener("click",r=>{const e=r.target.closest("button");if(!e)return;const n=e.dataset;if(e.id==="sa-add-tr"){const o=a.querySelector("#sa-new-en").value.trim(),l=a.querySelector("#sa-new-ar").value.trim();if(!o||!l){h("اكتب الاسم الإنجليزي والترجمة.",{type:"error"});return}t.translations[o]=l,s(),i()}else n.delTr?(delete t.translations[n.delTr],s(),i()):e.id==="sa-add-note"?(t.notes.push({id:K("note"),title:"",text:""}),s(),i()):n.delNote?(t.notes=t.notes.filter(o=>o.id!==n.delNote),s(),i()):e.id==="sa-add-ex"?(t.examples.push({id:K("ex"),title:"",inputs:""}),s(),i()):n.delEx&&(t.examples=t.examples.filter(o=>o.id!==n.delEx),s(),i())}),i(),a}const q=t=>String(t??"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a]),et=["sqrt()","abs()","sin()","cos()","tan()","log()","exp()","pow(,)","min(,)","max(,)","round(,2)","pi","e"];function tt(t,a,s,i){a.galleryAssetIds=a.galleryAssetIds||[];function r(u,p){t.querySelectorAll(u).forEach(b=>{const g=parseInt(b.getAttribute("data-idx"),10);[["▲",-1,30],["▼",1,54]].forEach(([c,$,w])=>{const k=document.createElement("button");k.type="button",k.textContent=c,k.title=$<0?"تحريك للأعلى":"تحريك للأسفل",k.style.cssText=`position:absolute; top:6px; left:${w}px; background:none; border:none; cursor:pointer; color:var(--ink-soft);`,k.addEventListener("click",()=>{const L=a[p],E=g+$;E<0||E>=L.length||(s(),[L[g],L[E]]=[L[E],L[g]],i())}),b.parentElement.appendChild(k)})})}r(".fe-remove-input","inputs"),r(".fe-remove-output","outputs");function e(){const u=(c,$=null)=>c===""||c==null?$:parseFloat(c),p=(c,$)=>{var w;return((w=c.querySelector($))==null?void 0:w.value.trim())||""},b=[...t.querySelectorAll(".fe-input-row")].map(c=>{var $,w,k;return{key:p(c,".inp-key"),label:p(c,".inp-label"),unit:p(c,".inp-unit"),default:u(($=c.querySelector(".inp-default"))==null?void 0:$.value,0),min:u((w=c.querySelector(".inp-min"))==null?void 0:w.value),max:u((k=c.querySelector(".inp-max"))==null?void 0:k.value)}}).filter(c=>c.key),g=[...t.querySelectorAll(".fe-output-row")].map(c=>{var w;const $=parseInt((w=c.querySelector(".out-decimals"))==null?void 0:w.value,10);return{key:p(c,".out-key"),label:p(c,".out-label"),unit:p(c,".out-unit"),expression:p(c,".out-expr"),latex:"",decimals:Number.isNaN($)?2:$}}).filter(c=>c.key);return{inputs:b,outputs:g}}const n=document.createElement("fieldset");n.style.cssText="border:1px solid var(--line); border-radius:var(--radius); padding:16px;",n.innerHTML=`
    <legend style="font-weight:700; color:var(--violet-700); padding:0 8px;">المساعد والمعاينة الحية</legend>
    <div style="font-size:.8rem; color:var(--ink-soft); margin-bottom:6px;">اضغط داخل حقل «الصيغة» ثم اضغط على أي زر لإدراجه.</div>
    <div id="ft-chips" style="display:flex; flex-wrap:wrap; gap:6px;"></div>
    <div id="ft-hint" style="font-size:.78rem; color:var(--error); min-height:1.1em;"></div>
    <div style="margin-top:12px; font-weight:600;">المعاينة (بالقيم الابتدائية للمدخلات):</div>
    <div id="ft-preview" style="margin-top:6px; padding:10px; background:var(--violet-50); border-radius:var(--radius); display:grid; gap:4px;"></div>`;function o(){const u=e(),p=(b,g)=>g.length?`<div style="width:100%; font-size:.75rem; color:var(--ink-soft); margin-top:4px;">${b}</div>`+g.map(([c,$,w])=>`<button type="button" class="btn btn-secondary btn-sm" data-ins="${q($)}" title="${q(w||"")}" style="font-family:var(--font-mono); padding:2px 8px;">${q(c)}</button>`).join(""):"";return p("الدوال",et.map(b=>[b,b]))+p("المدخلات",u.inputs.map(b=>[b.key,b.key,b.label]))+p("مخرجات سابقة",u.outputs.map(b=>[b.key,b.key,b.label]))+p("الثوابت",m.getConstants().map(b=>[b.key,b.key,`${b.label} = ${b.value} ${b.unit||""}`]))}function l(){const u=n.querySelector("#ft-preview"),p=e();if(!p.outputs.length){u.innerHTML='<span style="color:var(--ink-soft);">أضف مُخرجاً بصيغة لتظهر النتيجة هنا.</span>';return}const b={};p.inputs.forEach(c=>{b[c.key]=c.default});const g=be(p,b,{constants:m.getConstants(),tables:m.getTables()});if(!g.success){u.innerHTML=`<span style="color:var(--error);">✗ ${q(g.errorMessage||"خطأ في الصيغة")}</span>`;return}u.innerHTML=Object.values(g.outputs).map(c=>`<div><strong>${q(c.label)}</strong> = <span style="font-family:var(--font-mono); color:var(--violet-700);">${q(c.value)} ${q(c.unit)}</span></div>`).join("")}function d(){n.querySelector("#ft-chips").innerHTML=o(),l()}function y(u){const p=t._lastExpr,b=n.querySelector("#ft-hint");if(!p||!p.isConnected){b.textContent="اضغط داخل حقل الصيغة أولاً ثم اختر الزر.";return}b.textContent="";const g=p.selectionStart??p.value.length,c=p.selectionEnd??g;p.value=p.value.slice(0,g)+u+p.value.slice(c);const $=g+(u.includes("(")?u.indexOf("(")+1:u.length);p.focus(),p.setSelectionRange($,$),p.dispatchEvent(new Event("input",{bubbles:!0}))}const f=n.querySelector("#ft-chips");f.addEventListener("mousedown",u=>{u.target.closest("[data-ins]")&&u.preventDefault()}),f.addEventListener("click",u=>{const p=u.target.closest("[data-ins]");p&&y(p.dataset.ins)}),t._toolsRefresh=d,t._toolsBound||(t._toolsBound=!0,t.addEventListener("focusin",u=>{var p;(p=u.target.classList)!=null&&p.contains("out-expr")&&(t._lastExpr=u.target)}),t.addEventListener("input",()=>t._toolsRefresh&&t._toolsRefresh()));const v=document.createElement("fieldset");v.style.cssText="border:1px solid var(--line); border-radius:var(--radius); padding:16px;",v.innerHTML=`
    <legend style="font-weight:700; color:var(--violet-700); padding:0 8px;">معرض الصور (${a.galleryAssetIds.length})</legend>
    <div id="ft-gallery" style="display:flex; flex-wrap:wrap; gap:10px;"></div>
    <button type="button" class="btn btn-secondary btn-sm" id="ft-add-gallery" style="margin-top:10px;">+ إضافة صورة للمعرض</button>`;const x=v.querySelector("#ft-gallery");a.galleryAssetIds.forEach((u,p)=>{const b=document.createElement("div");b.style.cssText="position:relative; width:90px; height:68px; border:1px solid var(--line); border-radius:var(--radius); overflow:hidden; background:var(--bg-soft);",b.innerHTML=`<button type="button" data-i="${p}" title="إزالة" style="position:absolute; top:2px; left:2px; z-index:1; border:none; background:#fff; border-radius:50%; width:20px; height:20px; cursor:pointer; color:var(--error);">×</button>`,x.appendChild(b),m.getMediaAsset(u).then(g=>{g&&b.insertAdjacentHTML("beforeend",`<img src="${g.thumbUrl||g.dataUrl}" alt="" style="width:100%; height:100%; object-fit:cover;">`)}),b.querySelector("button").addEventListener("click",()=>{s(),a.galleryAssetIds.splice(p,1),i()})}),v.querySelector("#ft-add-gallery").addEventListener("click",()=>{M({onSelect:u=>{u&&!a.galleryAssetIds.includes(u.id)&&(s(),a.galleryAssetIds.push(u.id),i())}})}),t.appendChild(v),t.appendChild(n),d()}const U=[{value:"published",label:"منشور",badgeClass:"badge-published"},{value:"draft",label:"مسودة",badgeClass:"badge-sample"}];function at(t){const a=document.createElement("div"),s=m.getFormulas(),i=m.getCategories();let r="",e="";function n(){return s.filter(l=>{const d=!r||l.title.toLowerCase().includes(r.toLowerCase())||l.id.toLowerCase().includes(r.toLowerCase())||(l.tags||[]).some(f=>f.includes(r)),y=!e||l.categoryId===e;return d&&y})}function o(){var d,y,f;const l=n();a.innerHTML=`
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
          value="${r}"
        />
        <select id="formula-filter-cat" class="form-input" style="max-width: 200px; padding: 8px 12px; font-size: 0.88rem;">
          <option value="">جميع التصنيفات</option>
          ${i.map(v=>`<option value="${v.id}" ${e===v.id?"selected":""}>${v.title}</option>`).join("")}
        </select>
        <span style="font-size: 0.82rem; color: var(--ink-soft);">عرض ${l.length} من ${s.length}</span>
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
            ${l.length===0?`
              <tr>
                <td colspan="7" style="text-align: center; padding: 30px; color: var(--ink-soft);">
                  ${r||e?"لا توجد نتائج مطابقة للبحث.":"لا توجد معادلات بعد. ابدأ بإضافة معادلتك الأولى!"}
                </td>
              </tr>
            `:l.map(v=>{const x=i.find(p=>p.id===v.categoryId),u=U.find(p=>p.value===v.status)||U[0];return`
                <tr>
                  <td>
                    ${v.isSample?'<span class="badge badge-sample">تجريبي</span>':`<span class="badge ${u.badgeClass}">${u.label}</span>`}
                  </td>
                  <td><code style="color: var(--violet-700); font-size: 0.82rem;">${v.id}</code></td>
                  <td style="font-weight: 600;">${v.title}</td>
                  <td><span class="badge badge-category">${x?x.title:"بدون تصنيف"}</span></td>
                  <td style="font-family: var(--font-mono); font-weight: 600;">${(v.inputs||[]).length}</td>
                  <td style="font-family: var(--font-mono); font-weight: 600;">${(v.outputs||[]).length}</td>
                  <td style="text-align: left;">
                    <button class="btn btn-secondary btn-sm btn-edit-formula" data-id="${v.id}">تعديل</button>
                    <button class="btn btn-sm btn-duplicate-formula" data-id="${v.id}" style="background: var(--violet-50); color: var(--violet-700); border: 1px solid var(--violet-200);">نسخ</button>
                    <button class="btn btn-danger btn-sm btn-delete-formula" data-id="${v.id}">حذف</button>
                  </td>
                </tr>
              `}).join("")}
          </tbody>
        </table>
      </div>
    `,(d=a.querySelector("#formula-search"))==null||d.addEventListener("input",v=>{r=v.target.value.trim(),o()}),(y=a.querySelector("#formula-filter-cat"))==null||y.addEventListener("change",v=>{e=v.target.value,o()}),(f=a.querySelector("#btn-add-formula"))==null||f.addEventListener("click",()=>{X(null,t)}),a.querySelectorAll(".btn-edit-formula").forEach(v=>{v.addEventListener("click",()=>{const x=m.getFormula(v.getAttribute("data-id"));x&&X(x,t)})}),a.querySelectorAll(".btn-duplicate-formula").forEach(v=>{v.addEventListener("click",()=>{const x=m.getFormula(v.getAttribute("data-id"));if(!x)return;const u={...JSON.parse(JSON.stringify(x)),id:x.id+"-copy-"+Date.now().toString(36).slice(-4),title:x.title+" (نسخة)",status:"draft",isSample:!1,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};try{m.saveFormula(u),h(`تم نسخ المعادلة "${x.title}" بنجاح.`,{type:"success"}),t()}catch(p){h(p.message,{type:"error"})}})}),a.querySelectorAll(".btn-delete-formula").forEach(v=>{v.addEventListener("click",()=>{const x=m.getFormula(v.getAttribute("data-id"));x&&S({title:`حذف المعادلة: ${x.title}`,content:"<p>هل أنت متأكد من حذف هذه المعادلة؟ لا يمكن التراجع عن هذه الخطوة إلا خلال 10 ثوانٍ.</p>",confirmText:"نعم، احذف",onConfirm:()=>{m.deleteFormula(x.id),t(),h(`تم حذف المعادلة "${x.title}".`,{type:"info",duration:1e4,onUndo:()=>{m.saveFormula(x),t(),h("تمت استعادة المعادلة بنجاح.",{type:"success"})}})}})})})}return o(),a}function nt(t,a=[]){try{const s={};return a.forEach(r=>{s[r]=1}),s.lookup=()=>1,ye(t).evaluate(s),{valid:!0,error:null}}catch(s){return{valid:!1,error:s.message}}}function X(t,a){const s=!!t,i=m.getCategories(),r=m.getSources(),e=t?JSON.parse(JSON.stringify(t)):{id:"",title:"",categoryId:i.length>0?i[0].id:"",description:"",coverAssetId:null,galleryAssetIds:[],inputs:[],outputs:[],sourceIds:[],tags:[],notes:"",status:"draft",isSample:!1,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()},n=document.createElement("div");n.style.cssText="display: flex; flex-direction: column; gap: 20px; max-height: 70vh; overflow-y: auto; padding: 4px;";function o(){var v,x,u,p,b,g;const d=e.inputs.map(c=>c.key).filter(Boolean),y=e.outputs.map(c=>c.key).filter(Boolean),f=[...d,...y];n.innerHTML=`
      <!-- ═══ القسم 1: البيانات الأساسية ═══ -->
      <fieldset style="border: 1px solid var(--line); border-radius: var(--radius); padding: 16px;">
        <legend style="font-weight: 700; color: var(--violet-700); padding: 0 8px;">البيانات الأساسية</legend>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          <div class="form-group">
            <label class="form-label">المعرّف الفريد (ID بالإنجليزية)</label>
            <input type="text" class="form-input" id="fe-id" value="${e.id}" ${s?"disabled":""} placeholder="beam-moment-max" required />
            <small style="color: var(--ink-soft);">يُستخدم في الرابط، مثال: beam-moment-max</small>
          </div>

          <div class="form-group">
            <label class="form-label">الحالة</label>
            <select class="form-input" id="fe-status">
              ${U.map(c=>`<option value="${c.value}" ${e.status===c.value?"selected":""}>${c.label}</option>`).join("")}
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">عنوان المعادلة (بالعربية)</label>
          <input type="text" class="form-input" id="fe-title" value="${e.title}" placeholder="العزم الأقصى في عتبة بسيطة الإسناد" required />
        </div>

        <div class="form-group">
          <label class="form-label">الوصف</label>
          <textarea class="form-textarea" id="fe-desc" rows="2" placeholder="وصف مختصر لما تحسبه هذه المعادلة...">${e.description||""}</textarea>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          <div class="form-group">
            <label class="form-label">التصنيف</label>
            <select class="form-input" id="fe-category">
              <option value="">— بدون تصنيف —</option>
              ${i.map(c=>`<option value="${c.id}" ${e.categoryId===c.id?"selected":""}>${c.title}</option>`).join("")}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">المصادر المرجعية</label>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              ${r.map(c=>`
                <label style="display: flex; align-items: center; gap: 4px; font-size: 0.85rem; cursor: pointer;">
                  <input type="checkbox" class="fe-source-check" value="${c.id}" ${(e.sourceIds||[]).includes(c.id)?"checked":""} />
                  ${c.title}
                </label>
              `).join("")}
              ${r.length===0?'<span style="font-size: 0.82rem; color: var(--ink-soft);">لا توجد مصادر. أضف مصادر من تبويب المصادر أولاً.</span>':""}
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">الوسوم (اضغط Enter لإضافة وسم)</label>
          <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center; border: 1px solid var(--line); border-radius: var(--radius); padding: 6px 10px; min-height: 38px;">
            ${(e.tags||[]).map((c,$)=>`
              <span class="badge badge-category" style="display: inline-flex; align-items: center; gap: 4px;">
                ${c}
                <button type="button" class="fe-remove-tag" data-idx="${$}" style="background: none; border: none; cursor: pointer; color: var(--error); font-size: 1rem; line-height: 1; padding: 0;">×</button>
              </span>
            `).join("")}
            <input type="text" id="fe-tag-input" placeholder="أضف وسمًا..." style="border: none; outline: none; flex: 1; min-width: 100px; font-size: 0.85rem; background: transparent;" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">ملاحظات وفرضيات</label>
          <textarea class="form-textarea" id="fe-notes" rows="2" placeholder="ملاحظات عن شروط الاستخدام والفرضيات...">${e.notes||""}</textarea>
        </div>

        <!-- صورة الغلاف -->
        <div class="form-group">
          <label class="form-label">صورة الغلاف</label>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div id="fe-cover-preview" style="width: 80px; height: 60px; border-radius: var(--radius); border: 1px dashed var(--line); display: flex; align-items: center; justify-content: center; overflow: hidden; background: var(--bg-soft);">
              ${e.coverAssetId?'<span style="font-size: 0.72rem; color: var(--violet-700);">جاري التحميل...</span>':'<span style="font-size: 0.72rem; color: var(--ink-soft);">بدون صورة</span>'}
            </div>
            <button type="button" class="btn btn-secondary btn-sm" id="fe-pick-cover">اختر صورة</button>
            ${e.coverAssetId?'<button type="button" class="btn btn-ghost btn-sm" id="fe-remove-cover" style="color: var(--error);">إزالة</button>':""}
          </div>
        </div>
      </fieldset>

      <!-- ═══ القسم 2: المدخلات ═══ -->
      <fieldset style="border: 1px solid var(--line); border-radius: var(--radius); padding: 16px;">
        <legend style="font-weight: 700; color: var(--violet-700); padding: 0 8px;">
          المدخلات (${e.inputs.length})
        </legend>
        
        <div id="fe-inputs-list" style="display: flex; flex-direction: column; gap: 10px;">
          ${e.inputs.map((c,$)=>rt(c,$)).join("")}
        </div>

        <button type="button" class="btn btn-secondary btn-sm" id="fe-add-input" style="margin-top: 10px;">
          + إضافة مُدخل جديد
        </button>
      </fieldset>

      <!-- ═══ القسم 3: المخرجات ═══ -->
      <fieldset style="border: 1px solid var(--line); border-radius: var(--radius); padding: 16px;">
        <legend style="font-weight: 700; color: var(--violet-700); padding: 0 8px;">
          المخرجات والصيغ الحسابية (${e.outputs.length})
        </legend>

        <div id="fe-outputs-list" style="display: flex; flex-direction: column; gap: 14px;">
          ${e.outputs.map((c,$)=>it(c,$,f)).join("")}
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
    `,e.coverAssetId&&st(e.coverAssetId,n.querySelector("#fe-cover-preview")),(v=n.querySelector("#fe-pick-cover"))==null||v.addEventListener("click",()=>{l(),M({currentAssetId:e.coverAssetId,onSelect:c=>{e.coverAssetId=c?c.id:null,o()}})}),(x=n.querySelector("#fe-remove-cover"))==null||x.addEventListener("click",()=>{e.coverAssetId=null,o()}),(u=n.querySelector("#fe-tag-input"))==null||u.addEventListener("keydown",c=>{if(c.key==="Enter"){c.preventDefault();const $=c.target.value.trim();$&&!(e.tags||[]).includes($)&&(l(),e.tags=[...e.tags||[],$],o())}}),n.querySelectorAll(".fe-remove-tag").forEach(c=>{c.addEventListener("click",()=>{l();const $=parseInt(c.getAttribute("data-idx"),10);e.tags.splice($,1),o()})}),(p=n.querySelector("#fe-add-input"))==null||p.addEventListener("click",()=>{l(),e.inputs.push({key:"",label:"",unit:"",default:0,min:null,max:null,hint:""}),o()}),n.querySelectorAll(".fe-remove-input").forEach(c=>{c.addEventListener("click",()=>{l();const $=parseInt(c.getAttribute("data-idx"),10);e.inputs.splice($,1),o()})}),(b=n.querySelector("#fe-add-output"))==null||b.addEventListener("click",()=>{l(),e.outputs.push({key:"",label:"",unit:"",expression:"",latex:"",decimals:2}),o()}),n.querySelectorAll(".fe-remove-output").forEach(c=>{c.addEventListener("click",()=>{l();const $=parseInt(c.getAttribute("data-idx"),10);e.outputs.splice($,1),o()})}),(g=n.querySelector("#fe-test-expressions"))==null||g.addEventListener("click",()=>{l();const $=[...e.inputs.map(E=>E.key).filter(Boolean)];let w=!0,k="";for(const E of e.outputs){if(!E.expression){w=!1,k=`المخرج "${E.key||"؟"}" بدون صيغة.`;break}const P=nt(E.expression,$);if(!P.valid){w=!1,k=`خطأ في "${E.key||"؟"}": ${P.error}`;break}E.key&&$.push(E.key)}const L=n.querySelector("#fe-test-result");L&&(w?L.innerHTML='<span style="color: var(--success);">✓ جميع الصيغ صالحة!</span>':L.innerHTML=`<span style="color: var(--error);">✗ ${k}</span>`)}),tt(n,e,l,o)}function l(){const d=y=>{var f,v;return((v=(f=n.querySelector(y))==null?void 0:f.value)==null?void 0:v.trim())||""};e.id=d("#fe-id")||e.id,e.title=d("#fe-title"),e.description=d("#fe-desc"),e.categoryId=d("#fe-category"),e.status=d("#fe-status"),e.notes=d("#fe-notes"),e.sourceIds=[],n.querySelectorAll(".fe-source-check:checked").forEach(y=>{e.sourceIds.push(y.value)}),n.querySelectorAll(".fe-input-row").forEach((y,f)=>{var p,b,g,c,$,w,k;e.inputs[f]||(e.inputs[f]={}),e.inputs[f].key=((p=y.querySelector(".inp-key"))==null?void 0:p.value.trim())||"",e.inputs[f].label=((b=y.querySelector(".inp-label"))==null?void 0:b.value.trim())||"",e.inputs[f].unit=((g=y.querySelector(".inp-unit"))==null?void 0:g.value.trim())||"";const v=(c=y.querySelector(".inp-default"))==null?void 0:c.value;e.inputs[f].default=v!==""&&v!==void 0&&parseFloat(v)||0;const x=($=y.querySelector(".inp-min"))==null?void 0:$.value;e.inputs[f].min=x!==""&&x!==void 0?parseFloat(x):null;const u=(w=y.querySelector(".inp-max"))==null?void 0:w.value;e.inputs[f].max=u!==""&&u!==void 0?parseFloat(u):null,e.inputs[f].hint=((k=y.querySelector(".inp-hint"))==null?void 0:k.value.trim())||""}),n.querySelectorAll(".fe-output-row").forEach((y,f)=>{var x,u,p,b,g,c;e.outputs[f]||(e.outputs[f]={}),e.outputs[f].key=((x=y.querySelector(".out-key"))==null?void 0:x.value.trim())||"",e.outputs[f].label=((u=y.querySelector(".out-label"))==null?void 0:u.value.trim())||"",e.outputs[f].unit=((p=y.querySelector(".out-unit"))==null?void 0:p.value.trim())||"",e.outputs[f].expression=((b=y.querySelector(".out-expr"))==null?void 0:b.value.trim())||"",e.outputs[f].latex=((g=y.querySelector(".out-latex"))==null?void 0:g.value.trim())||"";const v=(c=y.querySelector(".out-decimals"))==null?void 0:c.value;e.outputs[f].decimals=v!==""&&v!==void 0?parseInt(v,10):2})}o(),S({title:s?`تعديل: ${t.title}`:"إضافة معادلة جديدة",content:n,confirmText:"حفظ المعادلة",cancelText:"إلغاء",onConfirm:()=>{if(l(),!e.id){h("يرجى إدخال معرّف فريد للمعادلة.",{type:"error"});return}if(!e.title){h("يرجى إدخال عنوان المعادلة.",{type:"error"});return}if(e.inputs.length===0){h("يجب إضافة مُدخل واحد على الأقل.",{type:"error"});return}if(e.outputs.length===0){h("يجب إضافة مُخرج واحد على الأقل.",{type:"error"});return}for(const d of e.inputs)if(!d.key){h("كل مُدخل يجب أن يحتوي على مفتاح (key).",{type:"error"});return}for(const d of e.outputs)if(!d.key||!d.expression){h("كل مُخرج يجب أن يحتوي على مفتاح وصيغة رياضية.",{type:"error"});return}e.updatedAt=new Date().toISOString(),s||(e.createdAt=new Date().toISOString());try{m.saveFormula(e),h(`تم حفظ المعادلة "${e.title}" بنجاح!`,{type:"success"}),a()}catch(d){h(`خطأ في حفظ المعادلة: ${d.message}`,{type:"error"})}}})}function rt(t,a){return`
    <div class="fe-input-row" style="border: 1px solid var(--line); border-radius: var(--radius); padding: 12px; background: var(--bg-soft); position: relative;">
      <button type="button" class="fe-remove-input" data-idx="${a}" style="position: absolute; top: 6px; left: 6px; background: none; border: none; cursor: pointer; color: var(--error); font-size: 1.2rem;">×</button>
      
      <div style="display: grid; grid-template-columns: 1fr 2fr 1fr; gap: 10px; margin-bottom: 8px;">
        <div>
          <label class="form-label" style="font-size: 0.78rem;">المفتاح (key)</label>
          <input type="text" class="form-input inp-key" value="${t.key||""}" placeholder="w" style="font-family: var(--font-mono);" />
        </div>
        <div>
          <label class="form-label" style="font-size: 0.78rem;">الاسم (بالعربية)</label>
          <input type="text" class="form-input inp-label" value="${t.label||""}" placeholder="الحمل الموزع" />
        </div>
        <div>
          <label class="form-label" style="font-size: 0.78rem;">الوحدة</label>
          <input type="text" class="form-input inp-unit" value="${t.unit||""}" placeholder="kN/m" />
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 2fr; gap: 10px;">
        <div>
          <label class="form-label" style="font-size: 0.78rem;">القيمة الابتدائية</label>
          <input type="number" class="form-input inp-default" value="${t.default??0}" step="any" />
        </div>
        <div>
          <label class="form-label" style="font-size: 0.78rem;">الحد الأدنى</label>
          <input type="number" class="form-input inp-min" value="${t.min??""}" step="any" placeholder="—" />
        </div>
        <div>
          <label class="form-label" style="font-size: 0.78rem;">الحد الأقصى</label>
          <input type="number" class="form-input inp-max" value="${t.max??""}" step="any" placeholder="—" />
        </div>
        <div>
          <label class="form-label" style="font-size: 0.78rem;">تلميح / شرح</label>
          <input type="text" class="form-input inp-hint" value="${t.hint||""}" placeholder="توضيح لهذا المُدخل" />
        </div>
      </div>
    </div>
  `}function it(t,a,s){return`
    <div class="fe-output-row" style="border: 1px solid var(--violet-100); border-radius: var(--radius); padding: 12px; background: var(--violet-50); position: relative;">
      <button type="button" class="fe-remove-output" data-idx="${a}" style="position: absolute; top: 6px; left: 6px; background: none; border: none; cursor: pointer; color: var(--error); font-size: 1.2rem;">×</button>

      <div style="display: grid; grid-template-columns: 1fr 2fr 1fr 1fr; gap: 10px; margin-bottom: 8px;">
        <div>
          <label class="form-label" style="font-size: 0.78rem;">مفتاح المخرج (key)</label>
          <input type="text" class="form-input out-key" value="${t.key||""}" placeholder="M" style="font-family: var(--font-mono);" />
        </div>
        <div>
          <label class="form-label" style="font-size: 0.78rem;">الاسم</label>
          <input type="text" class="form-input out-label" value="${t.label||""}" placeholder="العزم الأقصى" />
        </div>
        <div>
          <label class="form-label" style="font-size: 0.78rem;">الوحدة</label>
          <input type="text" class="form-input out-unit" value="${t.unit||""}" placeholder="kN.m" />
        </div>
        <div>
          <label class="form-label" style="font-size: 0.78rem;">الخانات العشرية</label>
          <input type="number" class="form-input out-decimals" value="${t.decimals??2}" min="0" max="10" />
        </div>
      </div>

      <div class="form-group" style="margin-bottom: 8px;">
        <label class="form-label" style="font-size: 0.78rem;">
          الصيغة الرياضية (expression) — المتاح: 
          <code style="color: var(--violet-700); font-size: 0.75rem;">${s.join(", ")||"أضف مدخلات أولاً"}</code>
        </label>
        <input type="text" class="form-input out-expr" value="${Y(t.expression||"")}" placeholder="w * L^2 / 8" style="font-family: var(--font-mono);" />
      </div>

      <div class="form-group" style="margin-bottom: 0;">
        <label class="form-label" style="font-size: 0.78rem;">صيغة LaTeX (اختيارية — للعرض الرياضي)</label>
        <input type="text" class="form-input out-latex" value="${Y(t.latex||"")}" placeholder="M = \\frac{w L^2}{8}" style="font-family: var(--font-mono); direction: ltr;" />
      </div>
    </div>
  `}async function st(t,a){if(!(!t||!a))try{const s=await m.getMediaAsset(t);s&&s.thumbUrl&&(a.innerHTML=`<img src="${s.thumbUrl}" alt="غلاف" style="width: 100%; height: 100%; object-fit: cover;" />`)}catch{a.innerHTML='<span style="font-size: 0.72rem; color: var(--error);">خطأ في التحميل</span>'}}function Y(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function vt({navigate:t}){const a=document.createElement("div");a.className="page-container";let s="overview";async function i(){var l;if(a.innerHTML="",!we()){a.appendChild(lt(()=>i()));return}const r=document.createElement("div");r.className="admin-layout";const e=document.createElement("aside");e.className="admin-sidebar",e.innerHTML=`
      <div class="admin-sidebar-header">
        <div style="font-weight: 700; font-size: 1.1rem; color: var(--violet-700);">لوحة المشرف</div>
        <div style="font-size: 0.78rem; color: var(--ink-soft);">المهندس الصغير v2.0</div>
      </div>

      <nav class="admin-sidebar-nav">
        <a href="javascript:void(0)" class="admin-nav-item ${s==="overview"?"is-active":""}" data-tab="overview">
          <span>نظرة عامة</span>
        </a>
        <a href="javascript:void(0)" class="admin-nav-item ${s==="formulas"?"is-active":""}" data-tab="formulas">
          <span>المعادلات (${m.getFormulas().length})</span>
        </a>
        <a href="javascript:void(0)" class="admin-nav-item ${s==="categories"?"is-active":""}" data-tab="categories">
          <span>التصنيفات (${m.getCategories().length})</span>
        </a>
        <a href="javascript:void(0)" class="admin-nav-item ${s==="sources"?"is-active":""}" data-tab="sources">
          <span>المصادر (${m.getSources().length})</span>
        </a>
        <a href="javascript:void(0)" class="admin-nav-item ${s==="constants"?"is-active":""}" data-tab="constants">
          <span>الثوابت المركزية (${m.getConstants().length})</span>
        </a>
        <a href="javascript:void(0)" class="admin-nav-item ${s==="tables"?"is-active":""}" data-tab="tables">
          <span>الجداول المرجعية (${m.getTables().length})</span>
        </a>
        <a href="javascript:void(0)" class="admin-nav-item ${s==="media"?"is-active":""}" data-tab="media">
          <span>مكتبة الوسائط والصور</span>
        </a>
                <a href="javascript:void(0)" class="admin-nav-item ${s==="appearance"?"is-active":""}" data-tab="appearance">
          <span>مظهر الموقع</span>
        </a>
        <a href="javascript:void(0)" class="admin-nav-item ${s==="home"?"is-active":""}" data-tab="home">
                <a href="javascript:void(0)" class="admin-nav-item ${s==="backup"?"is-active":""}" data-tab="backup">
          <span>النسخ الاحتياطي</span>
                  <a href="javascript:void(0)" class="admin-nav-item ${s==="soil"?"is-active":""}" data-tab="soil">
          <span>وحدة التربة</span>
        </a>
        </a>
          <span>أقسام الرئيسية</span>
        </a>
      </nav>

      <div class="admin-sidebar-footer">
        <a href="#/" class="btn btn-secondary btn-sm" style="width: 100%; margin-bottom: 8px;">
          العودة للموقع
        </a>
        <button class="btn btn-ghost btn-sm" id="btn-admin-logout" style="width: 100%; color: var(--error);">
          تسجيل الخروج
        </button>
      </div>
    `,e.querySelectorAll(".admin-nav-item").forEach(d=>{d.addEventListener("click",()=>{s=d.getAttribute("data-tab"),i()})}),(l=e.querySelector("#btn-admin-logout"))==null||l.addEventListener("click",()=>{re(),h("تم تسجيل الخروج بنجاح.",{type:"info"}),i()});const n=document.createElement("main");n.className="admin-main";const o=document.createElement("div");o.style.cssText=`
      padding: 14px 18px; 
      background-color: var(--violet-50); 
      border: 1px solid var(--violet-100); 
      border-right: 4px solid var(--violet-600); 
      border-radius: var(--radius); 
      margin-bottom: 24px;
      font-size: 0.88rem;
      color: var(--ink-soft);
      line-height: 1.6;
    `,o.innerHTML=`
      <strong style="color: var(--violet-900);">تنويه عن لوحة التحكم:</strong> 
      الموقع بدون سيرفر مدفوع (Static Site). التغييرات تُحفظ في هذا المتصفح فوراً. ولنشرها للزوار، يُستخدم زر «نشر التغييرات» ثم رفع الملفات إلى GitHub.
    `,n.appendChild(o),s==="overview"?n.appendChild(ot()):s==="formulas"?n.appendChild(at(()=>i())):s==="categories"?n.appendChild(Se(()=>i())):s==="sources"?n.appendChild(Ee(()=>i())):s==="constants"?n.appendChild(Le(()=>i())):s==="tables"?n.appendChild(Ae(()=>i())):s==="media"?n.appendChild(await Te(()=>i())):s==="appearance"?n.appendChild(je()):s==="home"||s==="home"?n.appendChild(G()):s==="backup"?n.appendChild(Ke()):s==="soil"&&n.appendChild(We()),r.appendChild(e),r.appendChild(n),a.appendChild(r)}return i(),a}function ot(t){const a=document.createElement("div"),s=m.getFormulas(),i=m.getCategories(),r=m.getSources(),e=m.getConstants(),n=m.getTables();return a.innerHTML=`
    <div class="admin-card-header">
      <div>
        <h2 style="font-size: 1.4rem; color: var(--ink); margin-bottom: 4px;">لوحة النظرة العامة</h2>
        <p style="margin: 0; font-size: 0.88rem; color: var(--ink-soft);">ملخص حالة النظام والمحتوى المخزن محلياً.</p>
      </div>
      <div>
        <span class="badge badge-published">الحالة: متصل محلياً</span>
      </div>
    </div>

    <!-- شبكة بطاقات الإحصائيات -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 30px;">
      <div class="card" style="padding: 18px;">
        <span style="font-size: 0.8rem; color: var(--ink-soft);">إجمالي المعادلات</span>
        <div style="font-size: 2rem; font-weight: 700; font-family: var(--font-mono); color: var(--violet-700);">${s.length}</div>
      </div>
      <div class="card" style="padding: 18px;">
        <span style="font-size: 0.8rem; color: var(--ink-soft);">التصنيفات</span>
        <div style="font-size: 2rem; font-weight: 700; font-family: var(--font-mono); color: var(--violet-700);">${i.length}</div>
      </div>
      <div class="card" style="padding: 18px;">
        <span style="font-size: 0.8rem; color: var(--ink-soft);">المصادر المرجعية</span>
        <div style="font-size: 2rem; font-weight: 700; font-family: var(--font-mono); color: var(--violet-700);">${r.length}</div>
      </div>
      <div class="card" style="padding: 18px;">
        <span style="font-size: 0.8rem; color: var(--ink-soft);">الثوابت المسجلة</span>
        <div style="font-size: 2rem; font-weight: 700; font-family: var(--font-mono); color: var(--violet-700);">${e.length}</div>
      </div>
      <div class="card" style="padding: 18px;">
        <span style="font-size: 0.8rem; color: var(--ink-soft);">الجداول المرجعية</span>
        <div style="font-size: 2rem; font-weight: 700; font-family: var(--font-mono); color: var(--violet-700);">${n.length}</div>
      </div>
    </div>

    <!-- بطاقة سريعة للمعادلات المتاحة -->
    <div class="card">
      <div class="card-header">
        <h3 style="font-size: 1.1rem; color: var(--ink);">أحدث المعادلات المسجلة في النظام</h3>
        <span class="badge badge-category">${s.length} معادلة</span>
      </div>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>المعرّف</th>
              <th>عنوان المعادلة</th>
              <th>التصنيف</th>
              <th>عدد المدخلات</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            ${s.map(o=>{const l=i.find(d=>d.id===o.categoryId);return`
                <tr>
                  <td><code style="color: var(--violet-700);">${o.id}</code></td>
                  <td style="font-weight: 600;">${o.title}</td>
                  <td><span class="badge badge-category">${l?l.title:"عام"}</span></td>
                  <td>${(o.inputs||[]).length}</td>
                  <td>
                    ${o.isSample?'<span class="badge badge-sample">تجريبي</span>':'<span class="badge badge-published">منشور</span>'}
                  </td>
                </tr>
              `}).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `,a}function lt(t){var o,l;const a=document.createElement("div");a.className="container",a.style.padding="40px 20px 80px";const s=!he();let i="";a.innerHTML=`
    <div class="pin-screen-container">
      <div style="display: flex; justify-content: center; margin-bottom: 16px;">
        <div style="width: 52px; height: 52px; border-radius: 50%; background-color: var(--violet-50); border: 1px solid var(--violet-200); display: flex; align-items: center; justify-content: center; color: var(--violet-700);">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
      </div>

      <h2 style="font-size: 1.4rem; color: var(--ink); margin-bottom: 6px;">
        ${s?"إنشاء رمز PIN المشرف":"الدخول إلى لوحة التحكم"}
      </h2>
      <p style="font-size: 0.88rem; color: var(--ink-soft); margin-bottom: 20px;">
        ${s?"اختر رمز PIN مكون من 4 إلى 8 أرقام لحماية لوحة التحكم لأول مرة.":"أدخل رمز PIN للمتابعة. تنتهي الجلسة تلقائياً بعد 30 دقيقة خمول."}
      </p>

      <!-- نقاط عرض الـ PIN -->
      <div class="pin-display-dots">
        <div class="pin-dot" id="dot-0"></div>
        <div class="pin-dot" id="dot-1"></div>
        <div class="pin-dot" id="dot-2"></div>
        <div class="pin-dot" id="dot-3"></div>
      </div>

      <div style="margin-bottom: 20px;">
        <input 
          type="password" 
          id="pin-direct-input" 
          class="form-input font-mono" 
          placeholder="أو اكتب الرمز هنا..." 
          style="text-align: center; font-size: 1.3rem; letter-spacing: 8px; max-width: 260px; margin: 0 auto;"
          maxlength="8"
        />
      </div>

      <!-- لوحة الأرقام الرقمية -->
      <div class="pin-keypad">
        ${[1,2,3,4,5,6,7,8,9].map(d=>`
          <button class="pin-key btn-num" data-num="${d}">${d}</button>
        `).join("")}
        <button class="pin-key" id="btn-pin-clear" style="font-size: 0.9rem; color: var(--error);">مسح</button>
        <button class="pin-key btn-num" data-num="0">0</button>
        <button class="pin-key" id="btn-pin-submit" style="background-color: var(--violet-600); color: #fff; font-size: 1.1rem;">↵</button>
      </div>

      <div style="margin-top: 24px;">
        <a href="#/" class="btn btn-ghost btn-sm" style="color: var(--ink-soft);">← العودة للموقع</a>
      </div>
    </div>
  `;const r=a.querySelector("#pin-direct-input");function e(){const d=i.length;for(let y=0;y<4;y++){const f=a.querySelector(`#dot-${y}`);f&&f.classList.toggle("is-filled",y<d)}r&&(r.value=i)}async function n(){if(i.length<4){h("يجب ألا يقل رمز PIN عن 4 أرقام.",{type:"error"});return}s?(await xe(i),h("تم إنشاء رمز PIN وحفظه بنجاح!",{type:"success"}),t()):await $e(i)?(h("تم تسجيل الدخول بنجاح.",{type:"success"}),t()):(h("رمز PIN غير صحيح.",{type:"error"}),i="",e())}return a.querySelectorAll(".btn-num").forEach(d=>{d.addEventListener("click",()=>{i.length<8&&(i+=d.getAttribute("data-num"),e(),!s&&i.length===4&&n())})}),(o=a.querySelector("#btn-pin-clear"))==null||o.addEventListener("click",()=>{i="",e()}),(l=a.querySelector("#btn-pin-submit"))==null||l.addEventListener("click",()=>{n()}),r==null||r.addEventListener("input",d=>{i=d.target.value.replace(/[^0-9]/g,""),e()}),r==null||r.addEventListener("keydown",d=>{d.key==="Enter"&&n()}),a}export{vt as renderAdminDashboard};
