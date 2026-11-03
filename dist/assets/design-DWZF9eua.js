import{c as a,b,i as x,d as u,e as o,o as h}from"./index-DEbd_JFn.js";import{s as i}from"./toast-CnxnsvgL.js";function z(){const t=document.createElement("div");t.className="container page-container",t.style.padding="40px 20px 100px",t.innerHTML=`
    <!-- الترويسة العلوية لصفحة التصميم -->
    <div style="border-bottom: 1px solid var(--line); padding-bottom: 24px; margin-bottom: 40px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
      <div>
        <div style="display: flex; gap: 8px; margin-bottom: 10px;">
          <span class="badge badge-published">المرحلة 1: نظام التصميم</span>
          <span class="badge badge-sample">المرحلة 2: نظام الحركات</span>
        </div>
        <h1 style="font-size: 2rem; margin-bottom: 6px;">دليل مكونات وحركات «المهندس الصغير»</h1>
        <p style="margin: 0; font-size: 0.95rem;">نظام التصميم الهندسي ونظام الحركات (Reveal, Count-up, Drawing, Parallax) جاهز للمعاينة</p>
      </div>
      <div style="display: flex; gap: 10px; align-items: center;">
        <button class="btn btn-secondary btn-sm" id="btn-toggle-motion">
          محاكاة إيقاف الحركات (Reduced Motion)
        </button>
        <a href="#/" class="btn btn-secondary btn-sm">العودة للرئيسية</a>
      </div>
    </div>

    <!-- 1. الشعار والهوية البصرية -->
    <section class="reveal" style="margin-bottom: 50px;">
      <div style="margin-bottom: 16px;">
        ${a("01 // الشعار الأصلي والهوية البصرية",340)}
      </div>
      <div class="card" style="padding: 28px; background-color: var(--bg-soft);">
        <div style="display: flex; gap: 36px; align-items: center; flex-wrap: wrap;">
          <div>
            <div style="font-size: 0.82rem; color: var(--ink-soft); margin-bottom: 8px;">الشعار الأساسي (تحويم SVG تفاعلي):</div>
            ${b({showTagline:!0,size:"large"})}
          </div>
          <div style="border-right: 1px solid var(--line); padding-right: 28px;">
            <div style="font-size: 0.82rem; color: var(--ink-soft); margin-bottom: 8px;">الحجم القياسي لشريط الترويسة:</div>
            ${b({showTagline:!1,size:"normal"})}
          </div>
        </div>
      </div>
    </section>

    <!-- 2. تجربة حركات عداد الأرقام (Count-Up) -->
    <section class="reveal" style="margin-bottom: 50px;">
      <div style="margin-bottom: 16px;">
        ${a("02 // عداد الأرقام التفاعلي (Count-Up Animation)",420)}
      </div>
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
          <p style="margin: 0; font-size: 0.9rem;">تعدّ الإحصائيات بسلاسة من 0 إلى القيمة المستهدفة عند الظهور أو عند استدعائها برمجياً:</p>
          <button class="btn btn-secondary btn-sm" id="btn-retrigger-count">إعادة تشغيل العدّادات</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
          <div style="padding: 16px; background-color: var(--violet-50); border: 1px solid var(--line); border-radius: var(--radius); text-align: center;">
            <div style="font-size: 0.85rem; color: var(--ink-soft); margin-bottom: 4px;">المعادلات المتاحة</div>
            <div style="font-size: 2.2rem; font-weight: 700; font-family: var(--font-mono); color: var(--violet-700);" 
                 id="stat-formulas" data-countup="48" data-duration="1100">0</div>
          </div>
          <div style="padding: 16px; background-color: var(--violet-50); border: 1px solid var(--line); border-radius: var(--radius); text-align: center;">
            <div style="font-size: 0.85rem; color: var(--ink-soft); margin-bottom: 4px;">المراجع والأكواد</div>
            <div style="font-size: 2.2rem; font-weight: 700; font-family: var(--font-mono); color: var(--violet-700);" 
                 id="stat-sources" data-countup="16" data-duration="900">0</div>
          </div>
          <div style="padding: 16px; background-color: var(--violet-50); border: 1px solid var(--line); border-radius: var(--radius); text-align: center;">
            <div style="font-size: 0.85rem; color: var(--ink-soft); margin-bottom: 4px;">ثوابت المواد والجداول</div>
            <div style="font-size: 2.2rem; font-weight: 700; font-family: var(--font-mono); color: var(--violet-700);" 
                 id="stat-constants" data-countup="124" data-duration="1300">0</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. الظهور المتتابع للبطاقات (Staggered Grid) -->
    <section class="reveal" style="margin-bottom: 50px;">
      <div style="margin-bottom: 16px;">
        ${a("03 // الظهور المتتابع للبطاقات (Stagger 60ms Delay)",460)}
      </div>
      <div class="stagger-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px;">
        <div class="card card-interactive reveal-item">
          <div class="card-header">
            <span class="badge badge-category">المنشآت</span>
            <span class="badge badge-sample">تجريبي</span>
          </div>
          <h3 class="card-title">عزم الانحناء الأقصى</h3>
          <p class="card-desc">حساب العزم الأقصى لعتبة بسيطة الإسناد تحت حمل منتظم.</p>
          <div class="card-footer">
            <span style="font-family: var(--font-mono); color: var(--violet-600);">M = w·L²/8</span>
            <span>2 مدخلات</span>
          </div>
        </div>

        <div class="card card-interactive reveal-item">
          <div class="card-header">
            <span class="badge badge-category">خرسانة مسلحة</span>
            <span class="badge badge-sample">تجريبي</span>
          </div>
          <h3 class="card-title">حجم ووزن البلاطة الخرسانية</h3>
          <p class="card-desc">حساب الحجم المكعب والوزن الذاتي من الأبعاد والكثافة النوعية.</p>
          <div class="card-footer">
            <span style="font-family: var(--font-mono); color: var(--violet-600);">V = L·B·t</span>
            <span>4 مدخلات</span>
          </div>
        </div>

        <div class="card card-interactive reveal-item">
          <div class="card-header">
            <span class="badge badge-category">ميكانيكا المواد</span>
            <span class="badge badge-sample">تجريبي</span>
          </div>
          <h3 class="card-title">الإجهاد العمودي المحوري</h3>
          <p class="card-desc">حساب الإجهاد المؤثر على مقطع مستعرض تحت قوة عمودية.</p>
          <div class="card-footer">
            <span style="font-family: var(--font-mono); color: var(--violet-600);">σ = P / A</span>
            <span>2 مدخلات</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. خلفية الهيرو والبارالاكس الهندسي -->
    <section class="reveal" style="margin-bottom: 50px;">
      <div style="margin-bottom: 16px;">
        ${a("04 // خلفية الهيرو التفاعلية (Blueprint Grid & Parallax)",480)}
      </div>
      <div class="card" id="demo-hero-box" style="position: relative; height: 260px; overflow: hidden; background-color: var(--bg-soft); display: flex; align-items: center; justify-content: center; text-align: center;">
        
        <!-- خلفية الرسم الهندسي الشبكية مع علامات التقاطع -->
        <div class="hero-blueprint-bg">
          <svg class="hero-grid-svg" viewBox="0 0 800 260" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="demo-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--line)" stroke-width="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#demo-grid)" />
            <!-- خطوط تركيز أرجوانية متقطعة -->
            <line x1="80" y1="0" x2="80" y2="260" class="hero-grid-accent" />
            <line x1="0" y1="120" x2="800" y2="120" class="hero-grid-accent" />
            <!-- علامة تقاطع هندسية تطفو بنبض هادئ -->
            <g class="grid-cross" transform="translate(80, 120)">
              <circle cx="0" cy="0" r="4" fill="var(--violet-600)"/>
              <circle cx="0" cy="0" r="12" fill="none" stroke="var(--violet-500)" stroke-width="1" stroke-dasharray="2 2"/>
            </g>
          </svg>
        </div>

        <div style="position: relative; z-index: 1; max-width: 500px; padding: 20px;">
          <span class="badge badge-category" style="margin-bottom: 8px;">معاينة الهيرو التفاعلي</span>
          <h2 style="font-size: 1.4rem; margin-bottom: 6px;">حرك مؤشر الماوس داخل المربع</h2>
          <p style="font-size: 0.9rem; margin: 0; color: var(--ink-soft);">
            تتفاعل خطوط الشبكة بخفة وتأثير Parallax هادئ لا يتجاوز 10px لإعطاء لمسة المخططات الهندسية.
          </p>
        </div>
      </div>
    </section>

    <!-- 5. الحقول مع حساب تفاعلي وخطوات الحل المتتابعة -->
    <section class="reveal" style="margin-bottom: 50px;">
      <div style="margin-bottom: 16px;">
        ${a("05 // نتيجة الحساب مع انتقال الأرقام وخطوات الحل",460)}
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
        <div class="card">
          <h3 style="font-size: 1.05rem; margin-bottom: 14px; color: var(--violet-800);">المدخلات</h3>
          
          <div class="form-group">
            <label class="form-label">الحمل الموزع (w)</label>
            <div class="input-wrapper input-with-unit">
              <input type="text" class="form-input" id="demo-w" value="10" />
              <span class="input-unit-badge">kN/m</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">طول العتبة (L)</label>
            <div class="input-wrapper input-with-unit">
              <input type="text" class="form-input" id="demo-l" value="5" />
              <span class="input-unit-badge">m</span>
            </div>
          </div>

          <button class="btn btn-primary" id="btn-calc-demo" style="width: 100%;">
            احسب واعرض خطوات الحل
          </button>
        </div>

        <div>
          <div class="result-panel" id="demo-result-panel">
            <div class="result-info">
              <span class="result-label">العزم الأقصى (M)</span>
              <div class="result-value-container">
                <span class="result-value" id="demo-result-val">31.25</span>
                <span class="result-unit">kN.m</span>
              </div>
            </div>
            <button class="btn btn-secondary btn-sm" id="btn-copy-demo">نسخ النتيجة</button>
          </div>

          <!-- خطوات الحل المتتابعة -->
          <div class="card" id="demo-steps-container" style="background-color: var(--bg-soft);">
            <div style="font-weight: 600; font-size: 0.95rem; margin-bottom: 10px; color: var(--ink);">خطوات الحل الموثقة:</div>
            <div class="step-item" style="padding: 10px 14px; background: #fff; border: 1px solid var(--line); border-radius: var(--radius-sm); margin-bottom: 8px;">
              <span style="font-size: 0.8rem; color: var(--ink-soft); display: block;">1. القانون الرياضي المطبق:</span>
              <code style="color: var(--violet-700); font-size: 0.95rem;">M = (w × L²) / 8</code>
            </div>
            <div class="step-item" style="padding: 10px 14px; background: #fff; border: 1px solid var(--line); border-radius: var(--radius-sm); animation-delay: 150ms;">
              <span style="font-size: 0.8rem; color: var(--ink-soft); display: block;">2. التعويض بالقيم المدخلة:</span>
              <code style="color: var(--violet-700); font-size: 0.95rem;" id="step-substitution">M = (10 × 5²) / 8 = 31.25 kN.m</code>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. النوافذ المنبثقة والإشعارات مع التراجع -->
    <section class="reveal" style="margin-bottom: 50px;">
      <div style="margin-bottom: 16px;">
        ${a("06 // النوافذ والإشعارات السلسة",340)}
      </div>
      <div class="card" style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
        <div>
          <div style="font-weight: 600; margin-bottom: 4px;">اختبر النوافذ المنبثقة والإشعارات العائمة</div>
          <div style="font-size: 0.88rem; color: var(--ink-soft);">تتميز بحركة انسيابية سريعة ودعم كامل لزر التراجع وتجاوب لوحة المفاتيح.</div>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn btn-secondary" id="btn-trigger-modal">نافذة تأكيد (Modal)</button>
          <button class="btn btn-secondary" id="btn-trigger-toast-undo">إشعار مع تراجع (Toast)</button>
        </div>
      </div>
    </section>
  `;const n=t.querySelector("#demo-hero-box");n&&x(n);const r=t.querySelector("#btn-toggle-motion");r&&r.addEventListener("click",()=>{const e=document.body.classList.toggle("animations-disabled");r.textContent=e?"✓ الحركات معطّلة (إعادة تفعيل)":"محاكاة إيقاف الحركات (Reduced Motion)",i(e?"تم تعطيل الحركات بالكامل":"تم تفعيل الحركات",{type:"info"}),u(t)});const l=t.querySelector("#btn-retrigger-count");l&&l.addEventListener("click",()=>{o(t.querySelector("#stat-formulas"),48,{duration:1e3}),o(t.querySelector("#stat-sources"),16,{duration:800}),o(t.querySelector("#stat-constants"),124,{duration:1200})});const d=t.querySelector("#btn-calc-demo");d&&d.addEventListener("click",()=>{const e=parseFloat(t.querySelector("#demo-w").value)||0,s=parseFloat(t.querySelector("#demo-l").value)||0,y=parseFloat(t.querySelector("#demo-result-val").textContent)||0,m=e*Math.pow(s,2)/8,f=t.querySelector("#demo-result-val");o(f,m,{startValue:y,decimals:2,duration:500});const g=t.querySelector("#step-substitution");g&&(g.textContent=`M = (${e} × ${s}²) / 8 = ${m.toFixed(2)} kN.m`),i("تم تحديث الحساب وخطوات الحل",{type:"success"})});const c=t.querySelector("#btn-copy-demo");c&&c.addEventListener("click",()=>{var s;const e=t.querySelector("#demo-result-val").textContent;(s=navigator.clipboard)==null||s.writeText(e),i(`تم نسخ النتيجة (${e} kN.m) للحافظة`,{type:"info"})});const p=t.querySelector("#btn-trigger-modal");p&&p.addEventListener("click",()=>{h({title:"تأكيد العملية",content:`
          <p style="margin-bottom: 12px;">نافذة حوارية تتوافق مع نظام التصميم الهندسي وتغلق بزر <code>Escape</code> أو زر الإلغاء.</p>
          <div style="padding: 10px 14px; background: var(--violet-50); border: 1px solid var(--line); border-radius: var(--radius-sm); font-size: 0.88rem;">
            تنويه: الحركة سريعة وخفيفة (200ms) وتلغى تلقائياً عند تفعيل Reduced Motion.
          </div>
        `,confirmText:"تأكيد",cancelText:"إغلاق",onConfirm:()=>i("تم التأكيد",{type:"success"})})});const v=t.querySelector("#btn-trigger-toast-undo");return v&&v.addEventListener("click",()=>{i("تم حذف معادلة تجريبية من القائمة.",{type:"info",duration:8e3,onUndo:()=>{i("تم التراجع عن الحذف بنجاح!",{type:"success"})}})}),requestAnimationFrame(()=>{u(t)}),t}export{z as renderDesignPage};
