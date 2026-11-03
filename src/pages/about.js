/**
 * about.js - صفحة عن موقع «المهندس الصغير»
 */

import { renderLogo } from '../components/logo.js';
import { createDimensionLineSvg } from '../motion/draw-lines.js';

export function renderAboutPage({ navigate }) {
  const container = document.createElement('div');
  container.className = 'container page-container';
  container.style.padding = '40px 20px 100px';

  container.innerHTML = `
    <!-- ترويسة الصفحة -->
    <div style="border-bottom: 1px solid var(--line); padding-bottom: 24px; margin-bottom: 40px; text-align: center;">
      <div style="display: flex; justify-content: center; margin-bottom: 16px;">
        ${renderLogo({ showTagline: false, size: 'large' })}
      </div>
      <h1 style="font-size: 2.2rem; margin-bottom: 8px;">عن موقع «المهندس الصغير»</h1>
      <p style="margin: 0 auto; max-width: 600px; font-size: 1.05rem; color: var(--ink-soft); line-height: 1.8;">
        منصة حاسبات ومعادلات هندسية عربية مفتوحة المصدر، مبنية بروح ورقة الرسم الهندسي النظيفة.
      </p>
    </div>

    <!-- بطاقات الرؤية والمعمارية -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin-bottom: 40px;">
      <div class="card">
        <h3 style="font-size: 1.15rem; color: var(--violet-800); margin-bottom: 10px;">الرؤية والهدف</h3>
        <p style="font-size: 0.92rem; line-height: 1.7; color: var(--ink-soft); margin: 0;">
          تسهيل الوصول إلى الحسابات الهندسية المدنية اليومية، وإبراز خطوات الحل الرياضي والفيزيائي بالتفصيل وليس مجرد إعطاء ناتج أعمى (Black Box)، مع ربط كل حساب بمرجعه وكوده الأصلي.
        </p>
      </div>

      <div class="card">
        <h3 style="font-size: 1.15rem; color: var(--violet-800); margin-bottom: 10px;">معمارية ثابتة بميزانية صفرية</h3>
        <p style="font-size: 0.92rem; line-height: 1.7; color: var(--ink-soft); margin: 0;">
          الموقع مبني بالكامل كـ Static Site بدون خادم مدفوع. تُدار البيانات محلياً عبر تقنيات المتصفح الحديثة (LocalStorage و IndexedDB)، وتُرفع التحديثات مجاناً عبر GitHub Pages أو Cloudflare Pages.
        </p>
      </div>

      <div class="card">
        <h3 style="font-size: 1.15rem; color: var(--violet-800); margin-bottom: 10px;">محرك حساب رياضي آمن</h3>
        <p style="font-size: 0.92rem; line-height: 1.7; color: var(--ink-soft); margin: 0;">
          يتم تقييم المعادلات بواسطة مكتبة <code>mathjs</code> الموثوقة مع حظر كامل لدوال <code>eval()</code> و <code>new Function()</code>، وتُعرض الصيغ الرياضية بدقة عبر مكتبة <code>KaTeX</code>.
        </p>
      </div>
    </div>

    <!-- صندوق التنويه الهندسي -->
    <div style="padding: 24px; background-color: var(--violet-50); border: 1px solid var(--line); border-right: 4px solid var(--violet-600); border-radius: var(--radius);">
      <h4 style="font-size: 1rem; color: var(--violet-900); margin-bottom: 8px;">إخلاء مسؤولية وتنويه قانوني</h4>
      <p style="font-size: 0.9rem; color: var(--ink-soft); margin: 0; line-height: 1.7;">
        المعادلات والأرقام المتوفرة في الموقع هي أدوات مساعدة للأغراض التعليمية ومراجعة الحسابات الأولية. تقع مسؤولية التحقق والاعتماد النهائي في المشاريع الإنشائية والتنفيذية على عاتق المهندس المصمم المعتمد وفق الكود المحلي الساري.
      </p>
    </div>
  `;

  return container;
}

