/**
 * lecture-wsd.js - Working Stress Design Method (lectures 1-5, with the solved examples)
 */
import { num, sel, out, tx } from './helpers.js';
import {
  modularRatio, fcAllowable, fsAllowable,
  singlyUncracked, singlyCracked, doublyUncracked, doublyCracked,
  kjSingly, kjDoubly, analyzeSection, loadFromMoment
} from '../engine/rc.js';
import { sectionSvg } from '../ui/section-svg.js';

const b = num('b', 'Beam width', 'b', 'mm', 300, { min: 1 });
const h = num('h', 'Overall depth', 'h', 'mm', 550, { min: 1 });
const d = num('d', 'Effective depth', 'd', 'mm', 500, { min: 1 });
const dp = num('dp', 'Compression steel depth', "d'", 'mm', 50, { min: 1 });
const As = num('As', 'Tension steel area', 'A_s', 'mm²', 1500, { min: 0 });
const Asp = num('Asp', 'Compression steel area', "A'_s", 'mm²', 600, { min: 0 });
const n = num('n', 'Modular ratio', 'n', '', 8, { min: 1 });
const M = num('M', 'Bending moment', 'M', 'kN·m', 100, { min: 0 });

const o = {
  y: out('y', 'Neutral axis depth', 'y', 'mm', 1),
  Iu: out('I', 'Moment of inertia (uncracked)', 'I_{unc}', 'mm⁴', 0),
  Ic: out('I', 'Moment of inertia (cracked)', 'I_{cr}', 'mm⁴', 0),
  fc: out('fc', 'Concrete compressive stress', 'f_c', 'MPa'),
  ft: out('ft', 'Concrete tensile stress', 'f_t', 'MPa'),
  fs: out('fs', 'Steel tensile stress', 'f_s', 'MPa'),
  fsp: out('fsp', 'Compression steel stress', "f'_s", 'MPa')
};

const ex = (name, values) => ({ name, values });

/* ---- General section: stacked rectangles ---- */
const BASE = { t1: 0, w1: 0, t2: 0, w2: 0, t3: 0, w3: 0, d: 0, As: 0, dp: 0, Asp: 0, n: 8, M: 0, mode: 0, fcp: 0, fcAll: 0, fsAll: 0 };
const gex = (name, v) => ex(name, { ...BASE, ...v });
const BOX = { t1: 100, w1: 500, t2: 450, w2: 200, d: 500, As: 981.2, n: 7.77 };

const layer = (i, t, w) => [
  num(`t${i}`, `Layer ${i} thickness`, `t_${i}`, 'mm', t, { min: 0 }),
  num(`w${i}`, `Layer ${i} width`, `w_${i}`, 'mm', w, { min: 0 })
];

export default {
  groups: [
    {
      title: 'Fundamentals',
      equations: [
        {
          id: 'wsd-allowable',
          title: 'Allowable Stresses and Modular Ratio',
          page: 'WSD-1 · p. 3',
          latex: tx`\begin{aligned}
            f_c &= 0.45\, f'_c \\[0.9em]
            f_s &= 140\ \text{MPa} \quad (f_y = 300\text{–}350) \\[0.9em]
            f_s &= 170\ \text{MPa} \quad (f_y = 400) \\[0.9em]
            E_c &= 4700\sqrt{f'_c},\qquad E_s = 200000\ \text{MPa}
          \end{aligned}`,
          inputs: [
            num('fcp', 'Concrete compressive strength', "f'_c", 'MPa', 25, { min: 1 }),
            sel('fy', 'Steel yield strength', 'f_y', 'MPa', 400, [300, 350, 400].map((g) => ({ value: g, label: `${g}` })))
          ],
          outputs: [
            out('fcA', 'Allowable concrete stress', 'f_{c,all}', 'MPa'),
            out('fsA', 'Allowable steel stress', 'f_{s,all}', 'MPa', 0),
            out('Ec', 'Modulus of elasticity of concrete', 'E_c', 'MPa', 0),
            out('n', 'Modular ratio', 'n', '', 2)
          ],
          compute: (v) => ({
            fcA: fcAllowable(v.fcp),
            fsA: fsAllowable(v.fy),
            Ec: 4700 * Math.sqrt(v.fcp),
            n: modularRatio(v.fcp)
          })
        }
      ]
    },
    {
      title: 'Rectangular Section — Singly Reinforced',
      equations: [
        {
          id: 'singly-uncracked',
          title: 'Uncracked Section',
          page: 'WSD-1 · p. 4',
          latex: tx`\begin{aligned}
            \tfrac{1}{2}\, b\, y^2 &= (n-1)A_s(d-y) + b\,\dfrac{(h-y)^2}{2} \\[0.9em]
            I_{unc} &= \dfrac{b\,y^3}{3} + (n-1)A_s(d-y)^2 + b\,\dfrac{(h-y)^3}{3} \\[0.9em]
            f_c &= \dfrac{M\,y}{I_{unc}} \\[0.9em]
            f_t &= \dfrac{M\,(h-y)}{I_{unc}} \\[0.9em]
            f_s &= n\,\dfrac{M\,(d-y)}{I_{unc}}
          \end{aligned}`,
          examples: [ex('Ex-1 · Case 1 (P = 17 kN)', { b: 250, h: 500, d: 450, As: 2119.5, n: 8, M: 34 })],
          inputs: [b, h, d, As, n, M],
          outputs: [o.y, o.Iu, o.fc, o.ft, o.fs],
          compute: (v) => {
            if (v.d > v.h) throw new Error('d > h');
            return singlyUncracked(v);
          }
        },
        {
          id: 'singly-cracked',
          title: 'Cracked Section',
          page: 'WSD-1 · p. 5',
          latex: tx`\begin{aligned}
            \tfrac{1}{2}\, b\, y^2 &= n\,A_s\,(d-y) \\[0.9em]
            I_{cr} &= \dfrac{b\,y^3}{3} + n\,A_s\,(d-y)^2 \\[0.9em]
            f_c &= \dfrac{M\,y}{I_{cr}} \\[0.9em]
            f_s &= n\,\dfrac{M\,(d-y)}{I_{cr}}
          \end{aligned}`,
          examples: [
            ex('Ex-1 · Case 2 (P = 32 kN)', { b: 250, d: 450, As: 2119.5, n: 8, M: 64 }),
            ex('Ex-2', { b: 250, d: 500, As: 1963.5, n: 9, M: 150 })
          ],
          inputs: [b, d, As, n, M],
          outputs: [o.y, o.Ic, o.fc, o.fs],
          compute: (v) => singlyCracked(v)
        }
      ]
    },
    {
      title: 'Rectangular Section — Doubly Reinforced',
      equations: [
        {
          id: 'doubly-uncracked',
          title: 'Uncracked Section',
          page: 'WSD-1 · p. 6–7',
          latex: tx`\begin{aligned}
            \tfrac{1}{2}\, b\, y^2 + (2n-1)A'_s(y-d') &= (n-1)A_s(d-y) + b\,\dfrac{(h-y)^2}{2} \\[0.9em]
            I_{unc} &= \dfrac{b\,y^3}{3} + (2n-1)A'_s(y-d')^2 + (n-1)A_s(d-y)^2 + b\,\dfrac{(h-y)^3}{3} \\[0.9em]
            f_c &= \dfrac{M\,y}{I_{unc}},\qquad f_t = \dfrac{M\,(h-y)}{I_{unc}} \\[0.9em]
            f_s &= n\,\dfrac{M\,(d-y)}{I_{unc}},\qquad f'_s = 2n\,\dfrac{M\,(y-d')}{I_{unc}}
          \end{aligned}`,
          inputs: [b, h, d, dp, As, Asp, n, M],
          outputs: [o.y, o.Iu, o.fc, o.ft, o.fs, o.fsp],
          compute: (v) => {
            if (v.dp >= v.d || v.d > v.h) throw new Error('dimensions');
            return doublyUncracked(v);
          }
        },
        {
          id: 'doubly-cracked',
          title: 'Cracked Section',
          page: 'WSD-1 · p. 7',
          latex: tx`\begin{aligned}
            \tfrac{1}{2}\, b\, y^2 + (2n-1)A'_s(y-d') &= n\,A_s(d-y) \\[0.9em]
            I_{cr} &= \dfrac{b\,y^3}{3} + (2n-1)A'_s(y-d')^2 + n\,A_s(d-y)^2 \\[0.9em]
            f_c &= \dfrac{M\,y}{I_{cr}},\qquad f_s = n\,\dfrac{M\,(d-y)}{I_{cr}} \\[0.9em]
            f'_s &= 2n\,\dfrac{M\,(y-d')}{I_{cr}}
          \end{aligned}`,
          examples: [ex('Ex-5', { b: 350, d: 630, dp: 70, As: 1963.5, Asp: 981, n: 10, M: 200 })],
          inputs: [b, d, dp, As, Asp, n, M],
          outputs: [o.y, o.Ic, o.fc, o.fs, o.fsp],
          compute: (v) => {
            if (v.dp >= v.d) throw new Error("d' >= d");
            return doublyCracked(v);
          }
        }
      ]
    },
    {
      title: 'Alternative Method (k, j) — Cracked Rectangular Section',
      equations: [
        {
          id: 'kj-singly',
          title: 'Singly Reinforced',
          page: 'WSD-2 · p. 1',
          latex: tx`\begin{aligned}
            \rho &= \dfrac{A_s}{b\,d} \\[0.9em]
            k &= \sqrt{2n\rho + (n\rho)^2} - n\rho \\[0.9em]
            y &= k\,d,\qquad j = 1 - \dfrac{k}{3} \\[0.9em]
            M &= C\,jd = \dfrac{f_c\,k\,d}{2}\,b\,jd \\[0.9em]
            M &= T\,jd = A_s\, f_s\, jd
          \end{aligned}`,
          examples: [ex('Ex-2 (check)', { b: 250, d: 500, As: 1963.5, n: 9, M: 150 })],
          inputs: [b, d, As, n, M],
          outputs: [
            out('rho', 'Steel ratio', '\\rho', '', 5),
            out('k', 'Neutral axis ratio', 'k', '', 4),
            out('j', 'Lever arm ratio', 'j', '', 4),
            o.y, o.fc, o.fs
          ],
          compute: (v) => kjSingly(v)
        },
        {
          id: 'kj-doubly',
          title: 'Doubly Reinforced',
          page: 'WSD-2 · p. 2',
          latex: tx`\begin{aligned}
            \rho &= \dfrac{A_s}{b\,d},\qquad \rho' = \dfrac{A'_s}{b\,d} \\[0.9em]
            k &= \sqrt{2(2n-1)\rho'\dfrac{d'}{d} + 2n\rho + n^2\!\left(2\rho' + \rho - \dfrac{\rho'}{n}\right)^2} - n\!\left(2\rho' + \rho - \dfrac{\rho'}{n}\right) \\[0.9em]
            z &= \dfrac{\dfrac{k^2 d}{6} + (2n-1)\rho' d'\left(1 - \dfrac{d'}{kd}\right)}{\dfrac{k}{2} + (2n-1)\rho'\left(1 - \dfrac{d'}{kd}\right)} \\[0.9em]
            jd &= d - z \\[0.9em]
            M &= T\,jd = A_s\, f_s\, jd
          \end{aligned}`,
          examples: [ex('Ex-5 (check)', { b: 350, d: 630, dp: 70, As: 1963.5, Asp: 981, n: 10, M: 200 })],
          inputs: [b, d, dp, As, Asp, n, M],
          outputs: [
            out('k', 'Neutral axis ratio', 'k', '', 4),
            o.y,
            out('z', 'Compression resultant depth', 'z', 'mm', 1),
            out('jd', 'Lever arm', 'jd', 'mm', 1),
            o.fc, o.fs, o.fsp
          ],
          compute: (v) => {
            if (v.dp >= v.d) throw new Error("d' >= d");
            return kjDoubly(v);
          }
        }
      ]
    },
    {
      title: 'General Section Analysis (T-sections, hollow sections, solved examples)',
      equations: [
        {
          id: 'section-analysis',
          title: 'Section Analysis — Procedure of Solution',
          page: 'WSD-3 · p. 1',
          wide: true,
          latex: tx`\begin{aligned}
            f_r &= 0.62\sqrt{f'_c},\qquad M_{cr} = \dfrac{f_r\, I_{unc}}{h - y_{unc}} \\[0.9em]
            \text{Cracked:}&\quad \textstyle\sum A_c\,\bar{y} = n\,A_s\,(d-y) \\[0.9em]
            f_c &= \dfrac{M\,y}{I},\qquad f_s = n\,\dfrac{M\,(d-y)}{I},\qquad f_t = \dfrac{M\,(h-y)}{I} \\[0.9em]
            M_{allow} &= \min\!\left(\dfrac{f_{c,all}\, I}{y},\ \dfrac{f_{s,all}\, I}{n\,(d-y)}\right)
          \end{aligned}`,
          note: 'The section is built from up to 3 stacked rectangles, top to bottom (T-section: flange then web). Set an unused layer to 0. Mode "Auto" assumes uncracked, then cracks if f_t > f_r (f′c = 0 means unknown → cracked).',
          examples: [
            gex('Ex-1 · Case 1', { t1: 500, w1: 250, d: 450, As: 2119.5, n: 8, M: 34, fcp: 30, fcAll: 13.5, fsAll: 170 }),
            gex('Ex-1 · Case 2', { t1: 500, w1: 250, d: 450, As: 2119.5, n: 8, M: 64, fcp: 30, fcAll: 13.5, fsAll: 170 }),
            gex('Ex-1 · Case 3', { t1: 500, w1: 250, d: 450, As: 2119.5, n: 8, M: 180, fcp: 30, fcAll: 13.5, fsAll: 170 }),
            gex('Ex-2', { t1: 570, w1: 250, d: 500, As: 1963.5, n: 9, M: 150, mode: 1 }),
            gex('Ex-3 / Ex-4', { t1: 100, w1: 1000, t2: 300, w2: 250, t3: 100, w3: 1000, d: 430, As: 4000, n: 8, M: 255.82, mode: 1, fcAll: 12.5, fsAll: 165 }),
            gex('Ex-5', { t1: 700, w1: 350, d: 630, dp: 70, As: 1963.5, Asp: 981, n: 10, M: 200, mode: 1 }),
            gex('Ex-6', { t1: 100, w1: 600, t2: 500, w2: 300, d: 538, As: 2413, n: 8, M: 200.75, mode: 1, fcp: 30, fcAll: 13.5, fsAll: 170 }),
            gex('Ex-7 (first crack)', { ...BOX, M: 48.8, mode: 2, fcp: 30 }),
            gex('Ex-8 (maximum load)', { ...BOX, M: 50, mode: 1, fcp: 30, fcAll: 13.5, fsAll: 170 })
          ],
          inputs: [
            ...layer(1, 500, 250), ...layer(2, 0, 0), ...layer(3, 0, 0),
            d, As, dp, Asp, n, M,
            sel('mode', 'Analysis mode', '', '', 0, [
              { value: 0, label: 'Auto (procedure of solution)' },
              { value: 1, label: 'Cracked' },
              { value: 2, label: 'Uncracked' }
            ]),
            num('fcp', "Concrete strength (0 = unknown)", "f'_c", 'MPa', 30, { min: 0 }),
            num('fcAll', 'Allowable concrete stress (0 = skip)', 'f_{c,all}', 'MPa', 13.5, { min: 0 }),
            num('fsAll', 'Allowable steel stress (0 = skip)', 'f_{s,all}', 'MPa', 170, { min: 0 })
          ].map((i) => (i.key === 'd' ? { ...i, def: 450 } : i.key === 'As' ? { ...i, def: 2119.5 } : i.key === 'dp' || i.key === 'Asp' ? { ...i, def: 0, min: 0 } : i)),
          outputs: [
            out('state', 'Section state', '', ''),
            out('y', 'Neutral axis depth', 'y', 'mm', 1),
            out('I', 'Moment of inertia', 'I', 'mm⁴', 0),
            out('fc', 'Concrete compressive stress', 'f_c', 'MPa'),
            out('fs', 'Steel tensile stress', 'f_s', 'MPa'),
            out('fsp', 'Compression steel stress', "f'_s", 'MPa'),
            out('ft', 'Concrete tensile stress (nominal)', 'f_t', 'MPa'),
            out('yUn', 'Neutral axis depth (uncracked)', 'y_{unc}', 'mm', 1, { head: 'Cracking check' }),
            out('IUn', 'Moment of inertia (uncracked)', 'I_{unc}', 'mm⁴', 0),
            out('fr', 'Modulus of rupture', 'f_r', 'MPa'),
            out('Mcr', 'Cracking moment', 'M_{cr}', 'kN·m'),
            out('Mc', 'Moment from concrete limit', 'M_c', 'kN·m', 2, { head: 'Allowable moment' }),
            out('Ms', 'Moment from steel limit', 'M_s', 'kN·m'),
            out('Mallow', 'Allowable moment', 'M_{allow}', 'kN·m'),
            out('control', 'Governing limit', '', ''),
            out('h', 'Total depth', 'h', 'mm', 0, { head: 'Geometry' }),
            out('Ag', 'Gross area', 'A_g', 'mm²', 0),
            out('wd', 'Self-weight (24 kN/m³)', 'w_d', 'kN/m', 2)
          ],
          compute: (v) =>
            analyzeSection({
              segs: [{ t: v.t1, w: v.w1 }, { t: v.t2, w: v.w2 }, { t: v.t3, w: v.w3 }],
              d: v.d, As: v.As, dp: v.dp, Asp: v.Asp, n: v.n, M: v.M,
              mode: v.mode, fcp: v.fcp, fcAll: v.fcAll, fsAll: v.fsAll
            }),
          draw: (v, r) =>
            sectionSvg({ rects: r.rects, h: r.h, d: v.d, dp: v.dp, As: v.As, Asp: v.Asp, y: r.y })
        },
        {
          id: 'load-from-moment',
          title: 'Load from Moment (Simply Supported Beam)',
          page: 'WSD-3 · p. 4 / WSD-5 · p. 3',
          latex: tx`\begin{aligned}
            W &= \dfrac{8\,M}{L^2} \\[0.9em]
            P &= \dfrac{4\,M}{L} \\[0.9em]
            W_L &= W - w_d
          \end{aligned}`,
          examples: [
            ex('Ex-3 / Ex-4', { M: 255.82, L: 3, wd: 6.6 }),
            ex('Ex-6', { M: 200.75, L: 8, wd: 5.04 }),
            ex('Ex-7', { M: 48.8, L: 4, wd: 0 })
          ],
          inputs: [
            num('M', 'Moment capacity', 'M', 'kN·m', 100, { min: 0 }),
            num('L', 'Span length', 'L', 'm', 5, { min: 0.001 }),
            num('wd', 'Self-weight', 'w_d', 'kN/m', 0, { min: 0 })
          ],
          outputs: [
            out('W', 'Total uniform load', 'W', 'kN/m'),
            out('WL', 'Live load (W − self-weight)', 'W_L', 'kN/m'),
            out('P', 'Midspan point load', 'P', 'kN')
          ],
          compute: (v) => loadFromMoment(v)
        }
      ]
    }
  ]
};