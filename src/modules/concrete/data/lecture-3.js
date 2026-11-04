/**
 * lecture-3.js - Lecture 3: Behavior of Reinforced Concrete Beam under Load
 */
import { num, sel, out, tx } from './helpers.js';
import { crackingMoment, beamStage, allowableMoment } from '../engine/rc.js';

const STAGE_TEXT = {
  1: 'Stage 1: Uncracked',
  2: 'Stage 2: Cracked, elastic',
  3: 'Stage 3: Cracked, inelastic (ultimate)'
};

const fcp = (def = 25) => num('fcp', 'Concrete compressive strength', "f'_c", 'MPa', def, { min: 0 });
const M = num('M', 'Bending moment', 'M', 'kN·m', 100);
const I = num('I', 'Moment of inertia', 'I', 'mm⁴', 1880000000, { min: 1 });

export default {
  groups: [
    {
      title: 'Stresses in the Beam Section',
      equations: [
        {
          id: 'bending-stresses',
          title: 'Bending Stresses',
          page: 'p. 2',
          latex: tx`\begin{aligned}
            f_c &= \dfrac{M\, y_c}{I} \\[0.9em]
            f_t &= \dfrac{M\, y_t}{I} \\[0.9em]
            f_s &= \dfrac{M\, y_s}{I}
          \end{aligned}`,
          inputs: [
            M, I,
            num('yc', 'Distance to compression fiber', 'y_c', 'mm', 168, { min: 0 }),
            num('yt', 'Distance to tension fiber', 'y_t', 'mm', 382, { min: 0 }),
            num('ys', 'Distance to steel', 'y_s', 'mm', 332, { min: 0 })
          ],
          outputs: [
            out('fc', 'Compressive stress', 'f_c', 'MPa', 2, { expr: 'M * 1000000 * yc / I' }),
            out('ft', 'Tensile stress', 'f_t', 'MPa', 2, { expr: 'M * 1000000 * yt / I' }),
            out('fs', 'Steel stress (uncracked)', 'f_s', 'MPa', 2, { expr: 'M * 1000000 * ys / I' })
          ]
        },
        {
          id: 'modular-ratio',
          title: 'Modular Ratio',
          page: 'p. 5',
          latex: tx`\begin{aligned}
            n &= \dfrac{E_s}{E_c} \\[0.9em]
            E_s &= 200000\ \text{MPa} \\[0.9em]
            E_c &= 4700\sqrt{f'_c}
          \end{aligned}`,
          inputs: [fcp()],
          outputs: [
            out('Ec', 'Modulus of elasticity of concrete', 'E_c', 'MPa', 0, { expr: '4700 * sqrt(fcp)' }),
            out('n', 'Modular ratio', 'n', '', 2, { expr: '200000 / Ec' })
          ]
        },
        {
          id: 'transformed-stresses',
          title: 'Transformed-Section Stresses',
          page: 'p. 6',
          latex: tx`\begin{aligned}
            f_c &= \dfrac{M\, y_c}{I} \\[0.9em]
            f_s &= n\,\dfrac{M\, y_s}{I}
          \end{aligned}`,
          inputs: [
            M, I,
            num('yc', 'Distance to compression fiber', 'y_c', 'mm', 168, { min: 0 }),
            num('ys', 'Distance to steel', 'y_s', 'mm', 332, { min: 0 }),
            num('n', 'Modular ratio', 'n', '', 8.51, { min: 0 })
          ],
          outputs: [
            out('fc', 'Concrete compressive stress', 'f_c', 'MPa', 2, { expr: 'M * 1000000 * yc / I' }),
            out('fs', 'Steel tensile stress', 'f_s', 'MPa', 2, { expr: 'n * M * 1000000 * ys / I' })
          ]
        },
        {
          id: 'allowable-moment',
          title: 'Allowable Moment (minimum governs)',
          page: 'p. 6',
          latex: tx`\begin{aligned}
            M_1 &= \dfrac{f_{c,all}\, I}{y_c} \\[0.9em]
            M_2 &= \dfrac{f_{s,all}\, I}{n\, y_s} \\[0.9em]
            M &= \min(M_1,\, M_2)
          \end{aligned}`,
          inputs: [
            num('fcAll', 'Allowable concrete stress', 'f_{c,all}', 'MPa', 11.25, { min: 0 }),
            num('fsAll', 'Allowable steel stress', 'f_{s,all}', 'MPa', 170, { min: 0 }),
            I,
            num('yc', 'Distance to compression fiber', 'y_c', 'mm', 168, { min: 1 }),
            num('ys', 'Distance to steel', 'y_s', 'mm', 332, { min: 1 }),
            num('n', 'Modular ratio', 'n', '', 8.51, { min: 0.001 })
          ],
          outputs: [
            out('M1', 'Moment from concrete stress', 'M_1', 'kN·m'),
            out('M2', 'Moment from steel stress', 'M_2', 'kN·m'),
            out('M', 'Allowable moment', 'M', 'kN·m')
          ],
          compute: (v) => allowableMoment(v)
        }
      ]
    },
    {
      title: 'Cracking and Beam Stages',
      equations: [
        {
          id: 'cracking-moment',
          title: 'Cracking Moment',
          page: 'p. 3–4',
          latex: tx`\begin{aligned}
            f_r &= 0.62\,\lambda\sqrt{f'_c} \\[0.9em]
            M_{cr} &= \dfrac{f_r\, I_g}{y_t}
          \end{aligned}`,
          note: 'Rectangular section: I_g = b·h³/12 and y_t = h/2.',
          inputs: [
            num('b', 'Beam width', 'b', 'mm', 300, { min: 1 }),
            num('h', 'Beam depth', 'h', 'mm', 550, { min: 1 }),
            fcp(),
            sel('lam', 'Concrete type', '\\lambda', '', 1, [
              { value: 1, label: '1.0 — Normal-weight' },
              { value: 0.85, label: '0.85 — Sand-lightweight' },
              { value: 0.75, label: '0.75 — All-lightweight' }
            ])
          ],
          outputs: [
            out('fr', 'Modulus of rupture', 'f_r', 'MPa'),
            out('Ig', 'Gross moment of inertia', 'I_g', 'mm⁴', 0),
            out('Mcr', 'Cracking moment', 'M_{cr}', 'kN·m')
          ],
          compute: (v) => crackingMoment({ b: v.b, h: v.h, fc: v.fcp, lam: v.lam })
        },
        {
          id: 'beam-stage',
          title: 'Beam Stage Identification',
          page: 'p. 7',
          latex: tx`\begin{aligned}
            \text{Stage 1:}&\quad f_t \le f_r \ \text{ and } \ f_c < f'_c/2 \\[0.9em]
            \text{Stage 2:}&\quad f_t > f_r \ \text{ and } \ f_c < f'_c/2 \\[0.9em]
            \text{Stage 3:}&\quad f_c \ge f'_c/2 \ \text{ and } \ f_s = f_y
          \end{aligned}`,
          inputs: [
            num('ft', 'Tensile stress', 'f_t', 'MPa', 2, { min: 0 }),
            num('fr', 'Modulus of rupture', 'f_r', 'MPa', 3.1, { min: 0 }),
            num('fc', 'Compressive stress', 'f_c', 'MPa', 5, { min: 0 }),
            fcp(),
            num('fs', 'Steel stress', 'f_s', 'MPa', 40, { min: 0 }),
            num('fy', 'Yield strength', 'f_y', 'MPa', 420, { min: 0 })
          ],
          outputs: [out('stage', 'Beam stage', '', '')],
          compute: (v) => ({ stage: STAGE_TEXT[beamStage(v)] })
        }
      ]
    }
  ]
};