/**
 * rc.js - دوال حساب الخرسانة المسلحة (نقية بدون واجهة)
 * الوحدات: mm و MPa و N، والعزم M بالـ kN·m
 */
export const ES = 200000; // MPa (محاضرة 1 ص15)
export const ecOf = (fc) => 4700 * Math.sqrt(fc);
export const modularRatio = (fc) => ES / ecOf(fc);

// محاضرة 4 ص3: الإجهادات المسموحة
export const fcAllowable = (fcp) => 0.45 * fcp;
export const fsAllowable = (fy) => (fy <= 350 ? 140 : 170);

// محاضرة 2 ص4: توافيق الأحمال ACI Table 5.3.1
// Lr تعني (Lr أو S أو R) كما في الجدول
export function loadCombinations({ D = 0, L = 0, Lr = 0, S = 0, W = 0, E = 0 }) {
  const list = [
    { id: '5.3.1a', U: 1.4 * D },
    { id: '5.3.1b', U: 1.2 * D + 1.6 * L + 0.5 * Lr },
    { id: '5.3.1c (1.0L)', U: 1.2 * D + 1.6 * Lr + 1.0 * L },
    { id: '5.3.1c (0.5W)', U: 1.2 * D + 1.6 * Lr + 0.5 * W },
    { id: '5.3.1d', U: 1.2 * D + 1.0 * W + 1.0 * L + 0.5 * Lr },
    { id: '5.3.1e', U: 1.2 * D + 1.0 * E + 1.0 * L + 0.2 * S },
    { id: '5.3.1f', U: 0.9 * D + 1.0 * W },
    { id: '5.3.1g', U: 0.9 * D + 1.0 * E }
  ];
  const governing = list.reduce((a, c) => (c.U > a.U ? c : a));
  return { list, governing };
}

// محاضرة 3 ص3: fr = 0.62 λ √f'c ، Mcr = fr·Ig / yt
// للمقطع المستطيل: Ig = b·h³/12 و yt = h/2
export function crackingMoment({ b, h, fc, lam = 1 }) {
  const fr = 0.62 * lam * Math.sqrt(fc);
  const Ig = (b * h ** 3) / 12;
  const yt = h / 2;
  return { fr, Ig, yt, Mcr: (fr * Ig) / yt / 1e6 };
}

// محاضرة 3 ص7 (الملخص): مراحل سلوك العتبة
export function beamStage({ ft, fr, fc, fcp, fs, fy }) {
  if (fc >= fcp / 2 || fs >= fy) return 3;
  return ft <= fr ? 1 : 2;
}

// محاضرة 3 ص6 (d): العزم المسموح = الأصغر
export function allowableMoment({ fcAll, fsAll, I, yc, ys, n }) {
  const M1 = (fcAll * I) / yc / 1e6;
  const M2 = (fsAll * I) / (n * ys) / 1e6;
  return { M1, M2, M: Math.min(M1, M2) };
}

// محاضرة 4 ص4: مقطع مسلح من جهة واحدة، غير متشقق
export function singlyUncracked({ b, h, d, As, n, M }) {
  const k = (n - 1) * As;
  const y = ((b * h * h) / 2 + k * d) / (b * h + k);
  const I = (b * y ** 3) / 3 + k * (d - y) ** 2 + (b * (h - y) ** 3) / 3;
  const Mm = M * 1e6;
  return { y, I, fc: (Mm * y) / I, ft: (Mm * (h - y)) / I, fs: (n * Mm * (d - y)) / I };
}

// محاضرة 4 ص5: مقطع مسلح من جهة واحدة، متشقق
export function singlyCracked({ b, d, As, n, M }) {
  const nA = n * As;
  const y = (-nA + Math.sqrt(nA * nA + 2 * b * nA * d)) / b;
  const I = (b * y ** 3) / 3 + nA * (d - y) ** 2;
  const Mm = M * 1e6;
  return { y, I, fc: (Mm * y) / I, fs: (n * Mm * (d - y)) / I };
}

// محاضرة 4 ص6-7: مقطع مزدوج التسليح، غير متشقق (حديد الضغط × 2n)
export function doublyUncracked({ b, h, d, dp, As, Asp, n, M }) {
  const a = (2 * n - 1) * Asp;
  const k = (n - 1) * As;
  const y = (a * dp + k * d + (b * h * h) / 2) / (a + k + b * h);
  const I = (b * y ** 3) / 3 + a * (y - dp) ** 2 + k * (d - y) ** 2 + (b * (h - y) ** 3) / 3;
  const Mm = M * 1e6;
  return {
    y, I,
    fc: (Mm * y) / I,
    ft: (Mm * (h - y)) / I,
    fs: (n * Mm * (d - y)) / I,
    fsp: (2 * n * Mm * (y - dp)) / I
  };
}

// محاضرة 4 ص7: مقطع مزدوج التسليح، متشقق
export function doublyCracked({ b, d, dp, As, Asp, n, M }) {
  const a = (2 * n - 1) * Asp;
  const nA = n * As;
  const B = a + nA;
  const C = a * dp + nA * d;
  const y = (-B + Math.sqrt(B * B + 2 * b * C)) / b;
  const I = (b * y ** 3) / 3 + a * (y - dp) ** 2 + nA * (d - y) ** 2;
  const Mm = M * 1e6;
  return {
    y, I,
    fc: (Mm * y) / I,
    fs: (n * Mm * (d - y)) / I,
    fsp: (2 * n * Mm * (y - dp)) / I
  };
}

// ---------- Generic stacked-rectangle section (WSD lectures 3-5) ----------
function layout(segs) {
  let z = 0;
  const rects = [];
  segs.forEach((s) => {
    if (!(s.t > 0)) return;
    if (!(s.w > 0)) throw new Error('width must be positive');
    rects.push({ z0: z, z1: z + s.t, w: s.w });
    z += s.t;
  });
  if (!rects.length) throw new Error('empty section');
  return { rects, h: z };
}

function uncrackedGen(rects, { d, As, dp, Asp, n }) {
  const k1 = (n - 1) * As;
  const k2 = (2 * n - 1) * Asp;
  let A = k1 + k2;
  let Q = k1 * d + k2 * dp;
  rects.forEach((r) => {
    A += r.w * (r.z1 - r.z0);
    Q += (r.w * (r.z1 ** 2 - r.z0 ** 2)) / 2;
  });
  const y = Q / A;
  let I = k1 * (d - y) ** 2 + k2 * (y - dp) ** 2;
  rects.forEach((r) => {
    I += (r.w * ((r.z1 - y) ** 3 - (r.z0 - y) ** 3)) / 3;
  });
  return { y, I };
}

function crackedGen(rects, h, { d, As, dp, Asp, n }) {
  const layers = [{ A: As, z: d }];
  if (Asp > 0) layers.push({ A: Asp, z: dp });
  const coef = (z, y) => (z < y ? 2 * n - 1 : n);
  const S = (y) =>
    rects.reduce(
      (s, r) => (y > r.z0 ? s + (r.w * ((y - r.z0) ** 2 - (y - Math.min(r.z1, y)) ** 2)) / 2 : s),
      0
    );
  const f = (y) => S(y) + layers.reduce((s, l) => s + coef(l.z, y) * l.A * (y - l.z), 0);
  let lo = 0;
  let hi = h;
  if (f(hi) < 0) throw new Error('no neutral axis inside the section');
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (f(mid) > 0) hi = mid;
    else lo = mid;
  }
  const y = (lo + hi) / 2;
  let I = layers.reduce((s, l) => s + coef(l.z, y) * l.A * (y - l.z) ** 2, 0);
  rects.forEach((r) => {
    if (y > r.z0) {
      const z1 = Math.min(r.z1, y);
      I += (r.w * ((y - r.z0) ** 3 - (y - z1) ** 3)) / 3;
    }
  });
  return { y, I };
}

// mode: 0 = auto (procedure of solution), 1 = cracked, 2 = uncracked ; fcp = 0 means f'c unknown
export function analyzeSection({ segs, d, As, dp = 0, Asp = 0, n, M, mode = 0, fcp = 0, fcAll = 0, fsAll = 0 }) {
  const { rects, h } = layout(segs);
  if (!(d > 0) || d > h) throw new Error('d must be within the section depth');
  if (Asp > 0 && !(dp > 0 && dp < d)) throw new Error("d' must be between 0 and d");
  const p = { d, As, dp, Asp, n };
  const Mm = M * 1e6;
  const Ag = rects.reduce((s, r) => s + r.w * (r.z1 - r.z0), 0);
  const un = uncrackedGen(rects, p);
  const fr = fcp > 0 ? 0.62 * Math.sqrt(fcp) : NaN;
  const ftUn = (Mm * (h - un.y)) / un.I;
  const Mcr = fcp > 0 ? (fr * un.I) / (h - un.y) / 1e6 : NaN;
  const cracked = mode === 1 ? true : mode === 2 ? false : fcp > 0 ? ftUn > fr : true;
  const s = cracked ? crackedGen(rects, h, p) : un;
  const fc = (Mm * s.y) / s.I;
  const inelastic = fcp > 0 && fc >= fcp / 2;
  const Mc = fcAll > 0 ? (fcAll * s.I) / s.y / 1e6 : NaN;
  const Ms = fsAll > 0 ? (fsAll * s.I) / (n * (d - s.y)) / 1e6 : NaN;
  const lim = [Mc, Ms].filter(Number.isFinite);
  const Mallow = lim.length ? Math.min(...lim) : NaN;
  return {
    h, Ag, wd: (Ag * 24) / 1e6,
    yUn: un.y, IUn: un.I, ftUn, fr, Mcr,
    state: `${cracked ? 'Cracked' : 'Uncracked'}, ${inelastic ? 'inelastic' : 'elastic'}`,
    y: s.y, I: s.I, fc,
    ft: (Mm * (h - s.y)) / s.I,
    fs: (n * Mm * (d - s.y)) / s.I,
    fsp: Asp > 0 ? (2 * n * Mm * (s.y - dp)) / s.I : NaN,
    Mc, Ms, Mallow,
    control: !lim.length ? '—' : Mc <= Ms || !Number.isFinite(Ms) ? 'Concrete (fc)' : 'Steel (fs)',
    rects
  };
}

// ---------- Alternative k-j method (WSD lecture 2) ----------
export function kjSingly({ b, d, As, n, M }) {
  const rho = As / (b * d);
  const k = Math.sqrt(2 * n * rho + (n * rho) ** 2) - n * rho;
  const j = 1 - k / 3;
  const Mm = M * 1e6;
  return { rho, k, j, y: k * d, fc: (2 * Mm) / (k * j * b * d * d), fs: Mm / (As * j * d) };
}

export function kjDoubly({ b, d, dp, As, Asp, n, M }) {
  const rho = As / (b * d);
  const rhop = Asp / (b * d);
  const B = n * (2 * rhop + rho - rhop / n);
  const k = Math.sqrt((2 * (2 * n - 1) * rhop * dp) / d + 2 * n * rho + B * B) - B;
  const q = (2 * n - 1) * rhop * (1 - dp / (k * d));
  const z = ((k * k * d) / 6 + (2 * n - 1) * rhop * dp * (1 - dp / (k * d))) / (k / 2 + q);
  const jd = d - z;
  const Mm = M * 1e6;
  const fs = Mm / (As * jd);
  const fc = (As * fs) / ((b * k * d) / 2 + (2 * n - 1) * Asp * (1 - dp / (k * d)));
  return { rho, rhop, k, y: k * d, z, jd, fs, fc, fsp: 2 * n * fc * (1 - dp / (k * d)) };
}

// Simply supported: uniform load W = 8M/L^2, midspan point load P = 4M/L  (M kN.m, L m)
export function loadFromMoment({ M, L, wd = 0 }) {
  const W = (8 * M) / (L * L);
  return { W, WL: W - wd, P: (4 * M) / L };
}