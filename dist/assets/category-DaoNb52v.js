import{S as n}from"./index-DEbd_JFn.js";function p({params:o,navigate:r}){const e=document.createElement("div");e.className="container page-container",e.style.padding="40px 20px 100px";const s=o.id,a=n.getCategory(s);if(!a)return e.innerHTML=`
      <div class="empty-state" style="margin-top: 40px;">
        <h3 class="empty-state-title">التصنيف غير موجود</h3>
        <p class="empty-state-desc">لم نتمكن من العثور على التصنيف المطلوب: <code>${s}</code>.</p>
        <button class="btn btn-primary" onclick="window.location.hash = '#/library'">العودة للمكتبة</button>
      </div>
    `,e;const i=n.getFormulas().filter(t=>t.categoryId===s);return e.innerHTML=`
    <!-- ترويسة التصنيف -->
    <div style="border-bottom: 1px solid var(--line); padding-bottom: 24px; margin-bottom: 30px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
        <a href="#/library" class="btn btn-ghost btn-sm" style="padding: 4px 8px;">← جميع التصنيفات</a>
        <span style="color: var(--line-strong);">/</span>
        <span class="badge badge-category">قسم تخصصي</span>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 14px;">
        <div>
          <h1 style="font-size: 2.1rem; margin-bottom: 8px;">${a.title}</h1>
          <p style="margin: 0; font-size: 1rem; color: var(--ink-soft); max-width: 650px;">
            ${a.description||"تصفح جميع القوانين والمعادلات الحسابية الخاصة بهذا القسم."}
          </p>
        </div>
        <div style="font-family: var(--font-mono); font-size: 1rem; color: var(--violet-700); font-weight: 600;">
          ${i.length} معادلة
        </div>
      </div>
    </div>

    <!-- شبكة معادلات هذا التصنيف -->
    ${i.length>0?`
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
        ${i.map(t=>`
          <div class="card card-interactive" onclick="window.location.hash = '#/calc/${t.id}'">
            <div class="card-header">
              <span class="badge badge-category">${a.title}</span>
              ${t.isSample?'<span class="badge badge-sample">تجريبي</span>':""}
            </div>
            <h3 class="card-title">${t.title}</h3>
            <p class="card-desc">${t.description||"معادلة حسابية موثقة."}</p>
            <div class="card-footer">
              <span style="font-family: var(--font-mono); color: var(--violet-600); font-weight: 500;">
                ${t.outputs&&t.outputs[0]?`${t.outputs[0].key} = ${t.outputs[0].expression}`:""}
              </span>
              <span style="color: var(--ink-soft); font-size: 0.82rem;">${(t.inputs||[]).length} مدخلات</span>
            </div>
          </div>
        `).join("")}
      </div>
    `:`
      <div class="empty-state">
        <h4 class="empty-state-title">لا توجد معادلات في هذا القسم بعد</h4>
        <p class="empty-state-desc">لم تتم إضافة معادلات تابعة لقسم "${a.title}" حتى الآن. يمكنك إضافة معادلة من لوحة التحكم.</p>
        <a href="#/library" class="btn btn-secondary btn-sm">العودة للمكتبة</a>
      </div>
    `}
  `,e}export{p as renderCategoryPage};
