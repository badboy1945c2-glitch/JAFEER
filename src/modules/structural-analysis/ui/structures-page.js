/**
 * structures-page.js - استوديو التحليل الإنشائي التفاعلي المتقدم (بدون تقطيع)
 */

import {
  analyzeBeamStability,
  analyzeTrussStability,
  calculateInfluenceLine
} from '../engine/statics-engine.js';
import { LECTURE_PRESETS } from '../data/presets.js';

// المحرك الحسابي الداخلي (لضمان دقة العزوم والقص مع المساند المتحركة)
function localSolveAndDiagrams(beam) {
  let Ax = 0, Ay = 0, By = 0, Ma = 0;
  let steps = [];
  
  let pin = beam.supports.find(s => s.type === 'pin');
  let rol = beam.supports.find(s => s.type === 'roller');
  let fix = beam.supports.find(s => s.type === 'fixed');
  
  if (!fix && (!pin || !rol)) {
    return { Ax, Ay, By, Ma, steps: ["النظام غير مستقر أو المساند غير مكتملة، لا يمكن الحساب."], sfd: [], bmd: [] };
  }
  
  let totalFy = 0;
  beam.loads.forEach(l => {
    if (l.type === 'point') totalFy += l.value;
    if (l.type === 'udl') totalFy += l.w * l.length;
  });

  if (fix) {
    Ay = totalFy;
    beam.loads.forEach(l => {
      if (l.type === 'point') Ma += l.value * (l.x - fix.x);
      if (l.type === 'udl') Ma += l.w * l.length * ((l.xStart + l.length/2) - fix.x);
    });
    steps.push(`ΣFy = 0 ⟹ R_y = ${Ay.toFixed(2)} kN`);
    steps.push(`ΣM = 0 ⟹ M_fixed = ${Ma.toFixed(2)} kN·m`);
  } else if (pin && rol) {
    let dist = rol.x - pin.x;
    let sumM_pin = 0;
    beam.loads.forEach(l => {
      if (l.type === 'point') sumM_pin += l.value * (l.x - pin.x);
      if (l.type === 'udl') sumM_pin += l.w * l.length * ((l.xStart + l.length/2) - pin.x);
    });
    if (Math.abs(dist) > 0.01) {
      By = sumM_pin / dist;
      Ay = totalFy - By;
    }
    steps.push(`ΣM_pin = 0 ⟹ R_roller = ${By.toFixed(2)} kN`);
    steps.push(`ΣFy = 0 ⟹ R_pin = ${Ay.toFixed(2)} kN`);
  }

  // رسم المخططات (SFD & BMD)
  let sfd = [], bmd = [];
  let points = 200; 
  let dx = beam.length / points;
  
  for (let i = 0; i <= points; i++) {
    let x = i * dx;
    let V = 0, M = 0;
    let eps = 0.0001; // التغلب على قفزة القص

    if (fix && x + eps >= fix.x) {
      V += Ay;
      M += Ay * (x - fix.x);
      if (fix.x <= x + eps) M -= Ma;
    }
    if (pin && x + eps >= pin.x) {
      V += Ay;
      M += Ay * (x - pin.x);
    }
    if (rol && x + eps >= rol.x) {
      V += By;
      M += By * (x - rol.x);
    }
    
    beam.loads.forEach(l => {
      if (l.type === 'point' && x + eps >= l.x) {
        V -= l.value;
        M -= l.value * (x - l.x);
      } else if (l.type === 'udl' && x > l.xStart) {
        let cov = Math.min(x - l.xStart, l.length);
        let W = l.w * cov;
        V -= W;
        M -= W * (cov/2 + Math.max(0, x - (l.xStart + l.length)));
      }
    });
    
    sfd.push({x, V});
    bmd.push({x, M}); 
  }
  
  return { Ax, Ay, By, Ma, steps, sfd, bmd };
}

export function renderStructuresPage({ query = {} } = {}) {
  const container = document.createElement('div');
  container.className = 'container page-container';
  container.style.padding = '40px 20px 100px';
  container.style.maxWidth = '1250px';

  let activeTab = query.tab || 'calc';
  let beamState = JSON.parse(JSON.stringify(LECTURE_PRESETS[0].beam));
  let ilPositionX = 2; 

  function renderHeader() {
    return `
      <div style="border-bottom: 1px solid var(--line); padding-bottom: 20px; margin-bottom: 24px;">
        <div class="badge badge-category" style="margin-bottom: 10px; background: #DCE8FD; color: #133B80;">Structural Analysis</div>
        <h1 style="font-size: 2rem; margin-bottom: 6px;">وحدة التحليل الإنشائي والتصميم</h1>
        <p style="margin: 0; color: var(--ink-soft); font-size: 0.95rem;">
          مساحة عمل تفاعلية لحساب ردود الأفعال، رسم مخططات (S.F.D & B.M.D)، وخطوط التأثير.
        </p>
      </div>
      <div role="tablist" style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px;">
        <button class="btn btn-sm ${activeTab === 'calc' ? 'btn-primary' : 'btn-secondary'}" data-tab="calc">1. الاستوديو التفاعلي</button>
        <button class="btn btn-sm ${activeTab === 'presets' ? 'btn-primary' : 'btn-secondary'}" data-tab="presets">2. النماذج الجاهزة</button>
        <button class="btn btn-sm ${activeTab === 'stability' ? 'btn-primary' : 'btn-secondary'}" data-tab="stability">3. فحص الاستقرارية</button>
        <button class="btn btn-sm ${activeTab === 'influence' ? 'btn-primary' : 'btn-secondary'}" data-tab="influence">4. خطوط التأثير (IL)</button>
      </div>
    `;
  }

  function renderBeamSvg(beam, isThumbnail = false) {
    const svgWidth = isThumbnail ? 400 : 900;
    const svgHeight = isThumbnail ? 100 : 250;
    const padding = isThumbnail ? 20 : 60;
    const drawL = svgWidth - padding * 2;
    const scale = drawL / (beam.length || 10);
    const beamY = isThumbnail ? 60 : 100;

    let html = `<svg ${!isThumbnail ? 'id="interactive-beam-svg"' : ''} viewBox="0 0 ${svgWidth} ${svgHeight}" width="100%" height="${svgHeight}" fill="none" xmlns="http://www.w3.org/2000/svg" style="background:#fff; border-radius: var(--radius-sm); border:1px solid var(--line); touch-action: none; user-select: none;">`;

    if (!isThumbnail) {
      html += `<pattern id="str-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--line)" stroke-width="0.5"/></pattern>`;
      html += `<rect width="100%" height="100%" fill="url(#str-grid)" pointer-events="none" />`;
    }

    html += `<rect x="${padding}" y="${beamY - (isThumbnail?4:6)}" width="${drawL}" height="${isThumbnail?8:12}" rx="3" fill="var(--violet-100)" stroke="var(--ink)" stroke-width="2" />`;

    (beam.supports || []).forEach((sup, idx) => {
      const x = padding + sup.x * scale;
      if (!isThumbnail) {
        html += `<g class="draggable-item" data-type="support" data-idx="${idx}" transform="translate(${x}, 0)" style="cursor: grab;">`;
        html += `<rect x="-30" y="${beamY - 20}" width="60" height="70" fill="rgba(0,0,0,0)" pointer-events="all"/>`; 
      }
      
      const cx = isThumbnail ? x : 0; 
      
      if (sup.type === 'pin') {
        html += `<polygon points="${cx},${beamY + (isThumbnail?4:6)} ${cx - 12},${beamY + 26} ${cx + 12},${beamY + 26}" fill="var(--violet-600)" stroke="var(--ink)" stroke-width="1.5" pointer-events="none" />`;
        html += `<line x1="${cx - 16}" y1="${beamY + 26}" x2="${cx + 16}" y2="${beamY + 26}" stroke="var(--ink)" stroke-width="2" pointer-events="none" />`;
      } else if (sup.type === 'roller') {
        html += `<polygon points="${cx},${beamY + (isThumbnail?4:6)} ${cx - 10},${beamY + 20} ${cx + 10},${beamY + 20}" fill="none" stroke="var(--ink)" stroke-width="1.5" pointer-events="none" />`;
        html += `<circle cx="${cx - 6}" cy="${beamY + 25}" r="4" fill="var(--violet-600)" pointer-events="none" />`;
        html += `<circle cx="${cx + 6}" cy="${beamY + 25}" r="4" fill="var(--violet-600)" pointer-events="none" />`;
        html += `<line x1="${cx - 14}" y1="${beamY + 30}" x2="${cx + 14}" y2="${beamY + 30}" stroke="var(--ink)" stroke-width="2" pointer-events="none" />`;
      } else if (sup.type === 'fixed') {
        html += `<rect x="${cx - 8}" y="${beamY - 25}" width="8" height="50" fill="var(--ink-muted)" stroke="var(--ink)" stroke-width="1.5" pointer-events="none" />`;
      } else if (sup.type === 'hinge') {
        html += `<circle cx="${cx}" cy="${beamY}" r="6" fill="#fff" stroke="#D44862" stroke-width="2" pointer-events="none" />`;
      }

      if (!isThumbnail) {
        html += `<text class="label-x" x="0" y="${beamY + 45}" font-family="var(--font-mono)" font-size="11" font-weight="bold" fill="var(--violet-900)" text-anchor="middle" pointer-events="none">${sup.label || ''} (x=${sup.x}m)</text>`;
        html += `</g>`;
      }
    });

    (beam.loads || []).forEach((load, idx) => {
      if (load.type === 'point') {
        const lx = padding + load.x * scale;
        if (!isThumbnail) {
          html += `<g class="draggable-item" data-type="point" data-idx="${idx}" transform="translate(${lx}, 0)" style="cursor: grab;">`;
          html += `<rect x="-30" y="${beamY - 80}" width="60" height="85" fill="rgba(0,0,0,0)" pointer-events="all"/>`;
          html += `<line x1="0" y1="${beamY - 45}" x2="0" y2="${beamY - 8}" stroke="#D44862" stroke-width="3" pointer-events="none" />`;
          html += `<polygon points="0,${beamY - 6} -6,${beamY - 16} 6,${beamY - 16}" fill="#D44862" pointer-events="none" />`;
          html += `<rect x="-25" y="${beamY - 70}" width="50" height="20" fill="#fff" rx="4" stroke="#D44862" pointer-events="none" />`;
          html += `<text x="0" y="${beamY - 56}" font-family="var(--font-mono)" font-size="11" font-weight="bold" fill="#D44862" text-anchor="middle" pointer-events="none">${load.value} kN</text>`;
          html += `<text class="label-x" x="0" y="${beamY - 30}" font-family="var(--font-mono)" font-size="10" fill="var(--ink-soft)" text-anchor="middle" pointer-events="none">x=${load.x}m</text>`;
          html += `</g>`;
        } else {
          html += `<line x1="${lx}" y1="${beamY - 30}" x2="${lx}" y2="${beamY - 4}" stroke="#D44862" stroke-width="2" />`;
          html += `<polygon points="${lx},${beamY - 4} ${lx-4},${beamY - 10} ${lx+4},${beamY - 10}" fill="#D44862" />`;
        }
      } else if (load.type === 'udl') {
        const xStart = padding + load.xStart * scale;
        const wWidth = load.length * scale;
        if (!isThumbnail) {
          html += `<g class="draggable-item" data-type="udl" data-idx="${idx}" transform="translate(${xStart}, 0)" style="cursor: grab;">`;
          html += `<rect x="0" y="${beamY - 35}" width="${wWidth}" height="35" fill="rgba(212,72,98,0.12)" stroke="#D44862" stroke-dasharray="3 2" pointer-events="all" />`;
          for (let ix = 10; ix <= wWidth - 5; ix += 14) {
            html += `<line x1="${ix}" y1="${beamY - 35}" x2="${ix}" y2="${beamY - 8}" stroke="#D44862" stroke-width="1.2" pointer-events="none" />`;
          }
          html += `<rect x="${wWidth/2 - 30}" y="${beamY - 48}" width="60" height="18" fill="#fff" rx="4" stroke="#D44862" pointer-events="none" />`;
          html += `<text x="${wWidth/2}" y="${beamY - 36}" font-family="var(--font-mono)" font-size="11" font-weight="bold" fill="#D44862" text-anchor="middle" pointer-events="none">${load.w} kN/m</text>`;
          html += `<text class="label-x" x="${wWidth/2}" y="${beamY - 15}" font-family="var(--font-mono)" font-size="10" fill="var(--ink-soft)" text-anchor="middle" pointer-events="none">x=${load.xStart}m</text>`;
          html += `</g>`;
        } else {
          html += `<rect x="${xStart}" y="${beamY - 30}" width="${wWidth}" height="22" fill="rgba(212,72,98,0.12)" stroke="#D44862" stroke-dasharray="3 2" />`;
        }
      }
    });

    if (!isThumbnail) {
      let keyXs = [0, beam.length];
      beam.supports.forEach(s => keyXs.push(s.x));
      beam.loads.forEach(l => {
        if (l.type === 'point') keyXs.push(l.x);
        if (l.type === 'udl') { keyXs.push(l.xStart); keyXs.push(l.xStart + l.length); }
      });
      const uniqueXs = [...new Set(keyXs.map(v => Math.round(v * 10) / 10))].sort((a,b) => a-b);
      const dimY = beamY + 80;
      
      for (let i = 0; i < uniqueXs.length - 1; i++) {
        let x1 = padding + uniqueXs[i] * scale;
        let x2 = padding + uniqueXs[i+1] * scale;
        let dist = uniqueXs[i+1] - uniqueXs[i];
        if (dist > 0) {
          html += `<line x1="${x1}" y1="${dimY}" x2="${x2}" y2="${dimY}" stroke="var(--violet-500)" stroke-width="1.2"/>`;
          html += `<line x1="${x1}" y1="${dimY - 5}" x2="${x1}" y2="${dimY + 5}" stroke="var(--violet-600)" stroke-width="1.5"/>`;
          html += `<text x="${(x1+x2)/2}" y="${dimY - 6}" font-family="var(--font-mono)" font-size="11" fill="var(--violet-900)" text-anchor="middle">${dist.toFixed(1)}m</text>`;
        }
      }
      const endX = padding + beam.length * scale;
      html += `<line x1="${endX}" y1="${dimY - 5}" x2="${endX}" y2="${dimY + 5}" stroke="var(--violet-600)" stroke-width="1.5"/>`;
      html += `<text x="${svgWidth/2}" y="${dimY + 25}" font-family="var(--font-mono)" font-size="12" font-weight="bold" fill="var(--ink-soft)" text-anchor="middle">الطول الكلي (L) = ${beam.length}m</text>`;
    }

    html += `</svg>`;
    return html;
  }

  function renderDiagramCanvas(sfd, bmd, L) {
    const svgWidth = 900;
    const svgHeight = 150;
    const padding = 60;
    const drawL = svgWidth - padding * 2;

    const maxV = Math.max(...sfd.map(d => Math.abs(d.V)), 0.1);
    const maxM = Math.max(...bmd.map(d => Math.abs(d.M)), 0.1);

    // S.F.D
    let sfdHtml = `<svg viewBox="0 0 ${svgWidth} ${svgHeight}" width="100%" height="${svgHeight}" fill="none" xmlns="http://www.w3.org/2000/svg" style="background:#F9F8FC; border-radius: var(--radius-sm); border:1px solid var(--line);">`;
    sfdHtml += `<line x1="${padding}" y1="75" x2="${padding + drawL}" y2="75" stroke="var(--ink-muted)" stroke-width="1"/>`;
    let pathV = `M ${padding} 75`;
    sfd.forEach(pt => {
      const x = padding + (pt.x / L) * drawL;
      const y = 75 - (pt.V / maxV) * 50;
      pathV += ` L ${x} ${y}`;
    });
    pathV += ` L ${padding + drawL} 75 Z`;
    sfdHtml += `<path d="${pathV}" fill="rgba(31,95,204,0.12)" stroke="#1F5FCC" stroke-width="2"/>`;
    sfdHtml += `<text x="${padding + 10}" y="25" font-family="var(--font-mono)" font-size="13" font-weight="bold" fill="#1F5FCC">S.F.D (Max: ${maxV.toFixed(1)} kN)</text></svg>`;

    // B.M.D
    let bmdHtml = `<svg viewBox="0 0 ${svgWidth} ${svgHeight}" width="100%" height="${svgHeight}" fill="none" xmlns="http://www.w3.org/2000/svg" style="background:#F9F8FC; border-radius: var(--radius-sm); border:1px solid var(--line); margin-top:10px;">`;
    bmdHtml += `<line x1="${padding}" y1="75" x2="${padding + drawL}" y2="75" stroke="var(--ink-muted)" stroke-width="1"/>`;
    let pathM = `M ${padding} 75`;
    bmd.forEach(pt => {
      const x = padding + (pt.x / L) * drawL;
      const y = 75 - (pt.M / maxM) * 50; // رسم العزم الموجب للأعلى كما هو معتاد
      pathM += ` L ${x} ${y}`;
    });
    pathM += ` L ${padding + drawL} 75 Z`;
    bmdHtml += `<path d="${pathM}" fill="rgba(102,54,204,0.12)" stroke="var(--violet-600)" stroke-width="2"/>`;
    bmdHtml += `<text x="${padding + 10}" y="25" font-family="var(--font-mono)" font-size="13" font-weight="bold" fill="var(--violet-800)">B.M.D (Max: ${maxM.toFixed(1)} kN·m)</text></svg>`;

    return sfdHtml + bmdHtml;
  }

  // تسريع السحب عن طريق تحديث واجهة الـ SVG فقط بدون إعادة رسم الصفحة
  function attachDragEvents(bodyElement) {
    const svg = bodyElement.querySelector('#interactive-beam-svg');
    if (!svg) return;

    let activeObj = null; 
    const padding = 60;
    const svgWidth = 900;
    const drawL = svgWidth - padding * 2;

    function getPointerX(e) {
      if (e.touches && e.touches.length > 0) return e.touches[0].clientX;
      if (e.changedTouches && e.changedTouches.length > 0) return e.changedTouches[0].clientX;
      return e.clientX;
    }

    function startDrag(e) {
      const g = e.target.closest('.draggable-item');
      if (g) {
        e.preventDefault(); 
        activeObj = {
          type: g.getAttribute('data-type'),
          idx: parseInt(g.getAttribute('data-idx'), 10),
          element: g
        };
        g.style.cursor = 'grabbing';
      }
    }

    function doDrag(e) {
      if (activeObj) {
        e.preventDefault();
        const pt = svg.createSVGPoint();
        pt.x = getPointerX(e);
        pt.y = 0;
        
        const ctm = svg.getScreenCTM();
        if (!ctm) return;
        
        const svgP = pt.matrixTransform(ctm.inverse());
        const scale = drawL / (beamState.length || 10);
        let newX = (svgP.x - padding) / scale;
        
        // قفل ضمن حدود العتبة
        if (activeObj.type === 'udl') {
          const udlLen = beamState.loads[activeObj.idx].length;
          newX = Math.max(0, Math.min(newX, beamState.length - udlLen));
          beamState.loads[activeObj.idx].xStart = Math.round(newX * 10) / 10;
        } else if (activeObj.type === 'point') {
          newX = Math.max(0, Math.min(newX, beamState.length));
          beamState.loads[activeObj.idx].x = Math.round(newX * 10) / 10;
        } else if (activeObj.type === 'support') {
          newX = Math.max(0, Math.min(newX, beamState.length));
          beamState.supports[activeObj.idx].x = Math.round(newX * 10) / 10;
        }

        // تحريك الشكل على الشاشة فوراً
        const newLx = padding + newX * scale;
        activeObj.element.setAttribute('transform', `translate(${newLx}, 0)`);
        const label = activeObj.element.querySelector('.label-x');
        if (label) {
          if (activeObj.type === 'support') {
            const lblTxt = beamState.supports[activeObj.idx].label || '';
            label.textContent = `${lblTxt} (x=${newX}m)`;
          } else {
            label.textContent = `x=${newX}m`;
          }
        }
      }
    }

    function stopDrag() {
      if (activeObj) {
        activeObj.element.style.cursor = 'grab';
        activeObj = null;
        draw(); // إعادة حساب وتحديث كل النتائج فور إفلات الإصبع (عشان الأداء الصاروخي)
      }
    }

    // دعم كامل لكل الأجهزة بدون تقطيع
    svg.addEventListener('mousedown', startDrag, { passive: false });
    window.addEventListener('mousemove', doDrag, { passive: false });
    window.addEventListener('mouseup', stopDrag);

    svg.addEventListener('touchstart', startDrag, { passive: false });
    window.addEventListener('touchmove', doDrag, { passive: false });
    window.addEventListener('touchend', stopDrag);
  }

  function draw() {
    container.innerHTML = renderHeader();
    const body = document.createElement('div');
    container.appendChild(body);

    if (activeTab === 'calc') {
      const { Ax, Ay, By, Ma, steps, sfd, bmd } = localSolveAndDiagrams(beamState);

      body.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 2.5fr; gap: 20px; align-items: start;">
          <div class="card" style="padding: 20px; display: flex; flex-direction: column; gap: 16px;">
            <h3 style="font-size: 1.1rem; margin-bottom: 4px;">إعدادات وتعديل العتبة</h3>
            <div class="form-group" style="margin-bottom: 10px;">
              <label class="form-label">طول العتبة الكلي L (متر)</label>
              <input type="number" id="input-beam-length" class="form-input" value="${beamState.length}" step="0.5" min="1">
            </div>

            <div style="border-top: 1px solid var(--line); padding-top: 12px;">
              <h4 style="font-size: 0.95rem; margin-bottom: 10px;">إضافة مسند / مفصل (Supports)</h4>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <select id="new-sup-type" class="form-input">
                  <option value="pin">Pin (ثابت)</option>
                  <option value="roller">Roller (متحرك)</option>
                  <option value="fixed">Fixed (كابولي)</option>
                  <option value="hinge">Hinge (مفصل داخلي - وصلة)</option>
                </select>
                <div style="display: flex; gap: 8px;">
                  <input type="number" id="new-sup-x" class="form-input" placeholder="الموقع x(m)" value="0">
                  <button class="btn btn-secondary btn-sm" id="btn-add-support">+ إضافة</button>
                </div>
              </div>
            </div>

            <div style="border-top: 1px solid var(--line); padding-top: 12px;">
              <h4 style="font-size: 0.95rem; margin-bottom: 10px;">إضافة حمل مركز (P)</h4>
              <div style="display: flex; gap: 8px;">
                <input type="number" id="new-load-val" class="form-input" placeholder="القيمة (kN)" value="15">
                <input type="number" id="new-load-x" class="form-input" placeholder="الموقع x" value="3">
                <button class="btn btn-secondary btn-sm" id="btn-add-point-load">+ إضافة</button>
              </div>
            </div>

            <div style="border-top: 1px solid var(--line); padding-top: 12px;">
              <h4 style="font-size: 0.95rem; margin-bottom: 10px;">إضافة حمل موزع (UDL)</h4>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <input type="number" id="new-udl-w" class="form-input" placeholder="الحمل w (kN/m)" value="5">
                <div style="display: flex; gap: 8px;">
                  <input type="number" id="new-udl-xstart" class="form-input" placeholder="بداية x" value="0">
                  <input type="number" id="new-udl-len" class="form-input" placeholder="الطول" value="4">
                </div>
                <button class="btn btn-secondary btn-sm" id="btn-add-udl-load">+ إضافة</button>
              </div>
            </div>
            
            <button class="btn btn-ghost btn-sm" id="btn-clear-all" style="color: #D44862;">🗑️ مسح الأشكال والبدء من الصفر</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 18px; min-width: 0;">
            <div class="card" style="padding: 16px; background: #fff; overflow-x: auto;">
              <h4 style="font-size: 0.95rem; color: var(--ink-soft); margin-bottom: 10px;">شاشة الرسم التفاعلي (اسحب الأحمال أو المساند بلمس الشاشة يمين ويسار)</h4>
              <div id="beam-svg-container">
                ${renderBeamSvg(beamState)}
              </div>
            </div>

            <div class="result-panel">
              <div class="result-info">
                <span class="result-label">ردود الأفعال المحسوبة (Reactions)</span>
                <div style="display: flex; gap: 20px; font-family: var(--font-mono); font-size: 1.1rem; font-weight: bold; color: var(--violet-900); margin-top: 6px;">
                  <span>Ax = ${Ax.toFixed(2)} kN</span>
                  <span>Ay = ${Ay.toFixed(2)} kN</span>
                  <span>By = ${By.toFixed(2)} kN</span>
                  ${Ma ? `<span>Ma = ${Ma.toFixed(2)} kN·m</span>` : ''}
                </div>
              </div>
            </div>

            <div id="live-diagrams" class="card" style="padding: 16px; background: #fff; overflow-x: auto;">
              ${renderDiagramCanvas(sfd, bmd, beamState.length)}
            </div>

            <div class="card" style="padding: 20px; background-color: var(--bg-soft); border-right: 4px solid var(--violet-600);">
              <h4 style="font-size: 1.05rem; color: var(--violet-900); margin-bottom: 12px;">مسودة الحل الرياضي التفصيلية</h4>
              <div style="display: flex; flex-direction: column; gap: 8px; font-family: var(--font-mono); font-size: 0.88rem; color: var(--ink);">
                ${steps.map((st) => `<div style="padding: 6px 10px; background:#fff; border-radius: var(--radius-sm); border: 1px solid var(--line);">${st}</div>`).join('')}
              </div>
            </div>
          </div>
        </div>
      `;

      attachDragEvents(body);

      body.querySelector('#input-beam-length').addEventListener('change', (e) => {
        beamState.length = Number(e.target.value) || 10;
        draw();
      });

      body.querySelector('#btn-add-support').addEventListener('click', () => {
        const type = body.querySelector('#new-sup-type').value;
        const x = Number(body.querySelector('#new-sup-x').value) || 0;
        let label = type === 'pin' ? 'Pin' : type === 'roller' ? 'Roller' : type === 'fixed' ? 'Fixed' : 'Hinge';
        beamState.supports.push({ type, x, label });
        draw();
      });

      body.querySelector('#btn-add-point-load').addEventListener('click', () => {
        const val = Number(body.querySelector('#new-load-val').value) || 10;
        const x = Number(body.querySelector('#new-load-x').value) || 0;
        beamState.loads.push({ type: 'point', value: val, x, angle: 90 });
        draw();
      });

      body.querySelector('#btn-add-udl-load').addEventListener('click', () => {
        const w = Number(body.querySelector('#new-udl-w').value) || 5;
        const xStart = Number(body.querySelector('#new-udl-xstart').value) || 0;
        const length = Number(body.querySelector('#new-udl-len').value) || 2;
        beamState.loads.push({ type: 'udl', w, xStart, length });
        draw();
      });

      body.querySelector('#btn-clear-all').addEventListener('click', () => {
        beamState.loads = [];
        beamState.supports = [];
        draw();
      });

    } else if (activeTab === 'presets') {
      body.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
          ${LECTURE_PRESETS.map(
            (pr) => `
            <div class="card card-interactive" data-preset-id="${pr.id}" style="padding: 10px; cursor: pointer; display: flex; flex-direction: column; align-items: center; border: 1px solid var(--line);">
              <div style="width: 100%; border-radius: var(--radius-sm); overflow: hidden; background: #fff; margin-bottom: 8px;">
                ${renderBeamSvg(pr.beam, true)}
              </div>
              <div style="align-self: flex-start; margin-left: 8px;">
                <span class="badge badge-published" style="font-size: 0.75rem;">${pr.reference}</span>
              </div>
            </div>
          `
          ).join('')}
        </div>
      `;

      body.querySelectorAll('[data-preset-id]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const pid = btn.getAttribute('data-preset-id');
          const found = LECTURE_PRESETS.find((p) => p.id === pid);
          if (found) {
            beamState = JSON.parse(JSON.stringify(found.beam));
            activeTab = 'calc';
            draw();
          }
        });
      });
    } else if (activeTab === 'stability') {
      body.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div class="card" style="padding: 20px;">
            <h3 style="font-size: 1.1rem; margin-bottom: 12px; color: var(--violet-900);">فحص استقرارية العتبات (Beams)</h3>
            <p style="font-size: 0.85rem; color: var(--ink-soft); margin-bottom: 16px;">المعادلة: r = c + 3</p>
            <div class="form-group">
              <label class="form-label">عدد ردود الأفعال (r)</label>
              <input type="number" id="stab-r" class="form-input" value="3">
            </div>
            <div class="form-group">
              <label class="form-label">عدد المفاصل c (Interior Hinges)</label>
              <input type="number" id="stab-c" class="form-input" value="0">
            </div>
            <button class="btn btn-primary btn-sm" id="btn-check-beam-stab">فحص الاستقرارية</button>
            <div id="res-beam-stab" style="margin-top: 14px;"></div>
          </div>
          <div class="card" style="padding: 20px;">
            <h3 style="font-size: 1.1rem; margin-bottom: 12px; color: var(--violet-900);">فحص استقرارية الجمالونات (Trusses)</h3>
            <p style="font-size: 0.85rem; color: var(--ink-soft); margin-bottom: 16px;">المعادلة: b + r = 2j</p>
            <div class="form-group">
              <label class="form-label">عدد الأضلاع (b)</label>
              <input type="number" id="truss-b" class="form-input" value="9">
            </div>
            <div class="form-group">
              <label class="form-label">ردود الأفعال (r)</label>
              <input type="number" id="truss-r" class="form-input" value="3">
            </div>
            <div class="form-group">
              <label class="form-label">عدد المفاصل (j)</label>
              <input type="number" id="truss-j" class="form-input" value="6">
            </div>
            <button class="btn btn-primary btn-sm" id="btn-check-truss-stab">فحص الجمالون</button>
            <div id="res-truss-stab" style="margin-top: 14px;"></div>
          </div>
        </div>
      `;
      body.querySelector('#btn-check-beam-stab').addEventListener('click', () => {
        const r = Number(body.querySelector('#stab-r').value) || 0;
        const c = Number(body.querySelector('#stab-c').value) || 0;
        const res = analyzeBeamStability(r, c);
        body.querySelector('#res-beam-stab').innerHTML = `<div class="badge badge-published" style="width:100%; padding:10px;">${res.reason}</div>`;
      });
      body.querySelector('#btn-check-truss-stab').addEventListener('click', () => {
        const b = Number(body.querySelector('#truss-b').value) || 0;
        const r = Number(body.querySelector('#truss-r').value) || 0;
        const j = Number(body.querySelector('#truss-j').value) || 0;
        const res = analyzeTrussStability(b, r, j);
        body.querySelector('#res-truss-stab').innerHTML = `<div class="badge badge-published" style="width:100%; padding:10px;">${res.reason}</div>`;
      });
    } else if (activeTab === 'influence') {
      const ilRes = calculateInfluenceLine(10, 2, ilPositionX);
      body.innerHTML = `
        <div class="card" style="padding: 24px;">
          <h3 style="font-size: 1.15rem; color: var(--violet-900); margin-bottom: 8px;">خطوط التأثير (Influence Lines)</h3>
          <p style="font-size: 0.9rem; color: var(--ink-soft); margin-bottom: 20px;">حرّك الحمل المركز P=1 لمعاينة التغير.</p>
          <div class="form-group" style="max-width: 400px; margin-bottom: 24px;">
            <label class="form-label">موقع الحمل x: <b style="color:var(--violet-700);">${ilPositionX}m</b></label>
            <input type="range" id="input-il-x" min="0" max="10" step="0.5" value="${ilPositionX}" class="form-input">
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
            <div class="result-panel" style="padding:16px;"><span class="result-label">Ra</span><span class="result-value">${ilRes.Ra.toFixed(2)}</span></div>
            <div class="result-panel" style="padding:16px;"><span class="result-label">Rb</span><span class="result-value">${ilRes.Rb.toFixed(2)}</span></div>
            <div class="result-panel" style="padding:16px;"><span class="result-label">Vc</span><span class="result-value">${ilRes.Vc.toFixed(2)}</span></div>
            <div class="result-panel" style="padding:16px;"><span class="result-label">Mc</span><span class="result-value">${ilRes.Mc.toFixed(2)}</span></div>
          </div>
        </div>
      `;
      body.querySelector('#input-il-x').addEventListener('input', (e) => {
        ilPositionX = Number(e.target.value);
        draw();
      });
    }

    container.querySelectorAll('[data-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeTab = btn.getAttribute('data-tab');
        draw();
      });
    });
  }

  draw();
  return container;
}