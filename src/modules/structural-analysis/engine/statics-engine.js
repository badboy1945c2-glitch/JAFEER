/**
 * statics-engine.js - محرك التحليل الإنشائي لموقع «المهندس الصغير»
 * مستخرج ومبني من محاضرات الاستقرارية والتحديد والتحليل الإنشائي (د. علي الرفاعي - جامعة المثنى)
 */

/**
 * 1. فحص استقرارية وتحديد العتبات (Beams Stability & Determinacy)
 * r: عدد ردود الأفعال (Reactions)
 * c: عدد معادلات الشرط الداخلية (Interior Hinges: c=1, Interior Rollers: c=2)
 */
export function analyzeBeamStability(r, c = 0, isParallel = false, hasMechanism = false) {
  const req = c + 3;
  const degree = r - req;

  if (isParallel) {
    return { status: 'unstable', reason: 'غير مستقر: جميع ردود الأفعال متوازية (Parallel Reactions)', degree: 0 };
  }
  if (hasMechanism) {
    return { status: 'unstable', reason: 'غير مستقر: وجود آلية حركة هندسية داخلية (Internal Geometric Mechanism)', degree: 0 };
  }
  if (r < req) {
    return { status: 'unstable', reason: `غير مستقر: عدد ردود الأفعال (${r}) أقل من المطلوب (${req})`, degree: 0 };
  }
  if (degree === 0) {
    return { status: 'determinate', reason: 'محدد إنشائياً ومستقر (Statically Determinate & Stable)', degree: 0 };
  }
  return { status: 'indeterminate', reason: `غير محدد إنشائياً ومستقر من الدرجة ${degree} (Indeterminate to degree ${degree})`, degree };
}

/**
 * 2. فحص استقرارية وتحديد الجمالونات (Trusses Stability & Determinacy)
 * b: عدد الأضلاع (Bars/Members)
 * r: عدد ردود الأفعال (Reactions)
 * j: عدد المفاصل (Joints)
 */
export function analyzeTrussStability(b, r, j, hasMechanism = false) {
  const left = b + r;
  const right = 2 * j;
  const degree = left - right;

  if (hasMechanism || left < right) {
    return { status: 'unstable', reason: `غير مستقر: b + r (${left}) < 2j (${right}) أو يمثل آلية حركة`, degree: 0 };
  }
  if (degree === 0) {
    return { status: 'determinate', reason: 'جمالون محدد إنشائياً ومستقر (Statically Determinate Truss)', degree: 0 };
  }
  return { status: 'indeterminate', reason: `جمالون غير محدد إنشائياً ومستقر من الدرجة ${degree}`, degree };
}

/**
 * 3. فحص استقرارية وتحديد الإطارات (Frames Stability & Determinacy)
 * b: عدد الأعضاء، r: ردود الأفعال، j: المفاصل، c: الشروط الداخلية
 */
export function analyzeFrameStability(b, r, j, c = 0, isUnstableGeo = false) {
  const left = 3 * b + r;
  const right = 3 * j + c;
  const degree = left - right;

  if (isUnstableGeo || left < right) {
    return { status: 'unstable', reason: `إطار غير مستقر: 3b + r (${left}) < 3j + c (${right})`, degree: 0 };
  }
  if (degree === 0) {
    return { status: 'determinate', reason: 'إطار محدد إنشائياً ومستقر (Statically Determinate Frame)', degree: 0 };
  }
  return { status: 'indeterminate', reason: `إطار غير محدد إنشائياً ومستقر من الدرجة ${degree}`, degree };
}

/**
 * 4. محرك حساب ردود الأفعال للجسور البسيطة والكابولية (Simply Supported & Cantilever Reactions)
 */
export function solveBeamReactions(beam) {
  const L = beam.length || 10;
  let Ax = 0;
  let Ay = 0;
  let By = 0;
  let Ma = 0;

  const steps = [];

  // جمع الأحمال المكافئة
  let sumFy = 0;
  let sumFx = 0;
  let sumMomentA = 0;

  (beam.loads || []).forEach((load, idx) => {
    if (load.type === 'point') {
      const angleRad = ((load.angle || 90) * Math.PI) / 180;
      const Fy = load.value * Math.sin(angleRad);
      const Fx = load.value * Math.cos(angleRad);
      sumFy += Fy;
      sumFx += Fx;
      sumMomentA += Fy * load.x;
      steps.push(`حمل مركز P${idx + 1} = ${load.value} kN عند x = ${load.x}m (مكون رأسي = ${Fy.toFixed(2)} kN)`);
    } else if (load.type === 'udl') {
      const W = load.w * load.length;
      const xCenter = load.xStart + load.length / 2;
      sumFy += W;
      sumMomentA += W * xCenter;
      steps.push(`حمل موزع منتظم UDL w = ${load.w} kN/m من x=${load.xStart} إلى x=${load.xStart + load.length} (المحصلة W = ${W.toFixed(2)} kN عند x = ${xCenter.toFixed(2)}m)`);
    } else if (load.type === 'moment') {
      sumMomentA += load.value; // عزم مركز
      steps.push(`عزم مركز M${idx + 1} = ${load.value} kN·m عند x = ${load.x}m`);
    }
  });

  const pinSup = (beam.supports || []).find((s) => s.type === 'pin' || s.type === 'fixed');
  const rollerSup = (beam.supports || []).find((s) => s.type === 'roller');
  const isCantilever = (beam.supports || []).some((s) => s.type === 'fixed');

  if (isCantilever) {
    Ay = sumFy;
    Ax = -sumFx;
    Ma = sumMomentA;
    steps.push(`تطبيق معادلات التوازن للعتبة الكابولية:`);
    steps.push(`ΣFx = 0 ⟹ Ax = ${Ax.toFixed(2)} kN`);
    steps.push(`ΣFy = 0 ⟹ Ay = ${Ay.toFixed(2)} kN`);
    steps.push(`ΣMA = 0 ⟹ MA = ${Ma.toFixed(2)} kN·m`);
  } else if (pinSup && rollerSup) {
    const distB = rollerSup.x - pinSup.x;
    if (distB !== 0) {
      By = sumMomentA / distB;
      Ay = sumFy - By;
      Ax = -sumFx;
    }
    steps.push(`تطبيق معادلات التوازن:`);
    steps.push(`ΣMB = 0 ⟹ Ay = (${sumMomentA.toFixed(2)}) / ${distB} = ${Ay.toFixed(2)} kN`);
    steps.push(`ΣFy = 0 ⟹ By = ${sumFy.toFixed(2)} - ${Ay.toFixed(2)} = ${By.toFixed(2)} kN`);
    steps.push(`ΣFx = 0 ⟹ Ax = ${Ax.toFixed(2)} kN`);
  }

  return { Ax, Ay, By, Ma, steps };
}

/**
 * 5. حساب قيم مخططات القص والعزم (SFD & BMD) عند نقاط العتبة
 */
export function calculateDiagramPoints(beam, reactions, pointsCount = 50) {
  const L = beam.length || 10;
  const dx = L / pointsCount;
  const sfd = [];
  const bmd = [];

  for (let i = 0; i <= pointsCount; i++) {
    const x = i * dx;
    let V = reactions.Ay;
    let M = reactions.Ay * x - reactions.Ma;

    // طرح تاثير الأحمال عند النقطة x
    (beam.loads || []).forEach((load) => {
      if (load.type === 'point' && x >= load.x) {
        const Fy = load.value * Math.sin(((load.angle || 90) * Math.PI) / 180);
        V -= Fy;
        M -= Fy * (x - load.x);
      } else if (load.type === 'udl') {
        if (x > load.xStart) {
          const coveredL = Math.min(x - load.xStart, load.length);
          const W = load.w * coveredL;
          V -= W;
          M -= W * (coveredL / 2 + Math.max(0, x - (load.xStart + load.length)));
        }
      } else if (load.type === 'moment' && x >= load.x) {
        M -= load.value;
      }
    });

    sfd.push({ x: Number(x.toFixed(2)), V: Number(V.toFixed(2)) });
    bmd.push({ x: Number(x.toFixed(2)), M: Number(M.toFixed(2)) });
  }

  return { sfd, bmd };
}

/**
 * 6. حساب خطوط التأثير (Influence Line Values) لعتبة بسيطة
 */
export function calculateInfluenceLine(L, cPosition, xVal) {
  // خط التأثير لرد الفعل A: Ra = 1 - x/L
  const Ra = 1 - xVal / L;
  // خط التأثير لرد الفعل B: Rb = x/L
  const Rb = xVal / L;

  // خط التأثير للقص عند النقطة C
  let Vc = 0;
  if (xVal < cPosition) {
    Vc = -xVal / L;
  } else {
    Vc = 1 - xVal / L;
  }

  // خط التأثير للعزم عند النقطة C
  let Mc = 0;
  if (xVal < cPosition) {
    Mc = (1 - cPosition / L) * xVal;
  } else {
    Mc = (cPosition / L) * (L - xVal);
  }

  return { Ra, Rb, Vc, Mc };
}