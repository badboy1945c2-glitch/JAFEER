let e=null;function u(){return e||(e=document.getElementById("toast-root"),e?e.className="toast-container":(e=document.createElement("div"),e.id="toast-root",e.className="toast-container",document.body.appendChild(e))),e}function m(l,{type:c="info",duration:s=4e3,onUndo:n=null}={}){const d=u(),t=document.createElement("div");t.className=`toast toast-${c}`,t.setAttribute("role","alert");let a="";n&&(a=`
      <button class="btn btn-sm btn-ghost toast-undo-btn" style="color: var(--violet-700); font-weight: 600; padding: 2px 8px; margin-right: auto;">
        تراجع
      </button>
    `),t.innerHTML=`
    <div style="flex-grow: 1;">${l}</div>
    ${a}
    <button class="toast-close-btn" style="color: var(--ink-muted); font-size: 1.1rem; line-height: 1;" aria-label="إغلاق الإشعار">
      ×
    </button>
  `;const o=()=>{t.style.opacity="0",t.style.transform="translateY(10px)",t.style.transition="opacity 150ms ease, transform 150ms ease",setTimeout(()=>{t.parentNode&&t.parentNode.removeChild(t)},150)},i=t.querySelector(".toast-close-btn");if(i&&i.addEventListener("click",o),n){const r=t.querySelector(".toast-undo-btn");r&&r.addEventListener("click",()=>{n(),o()})}return d.appendChild(t),s>0&&setTimeout(o,s),{remove:o}}export{m as s};
