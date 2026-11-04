/**
 * lecture-1.js - Introduction + Lecture 1: Properties of Concrete and Reinforcing Steel
 */
import { num, sel, out, tx } from './helpers.js';

const BAR_DIAMETERS = [6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 25, 26, 28, 30, 32];
const fcIn = (key = 'fcp', def = 24) =>
  num(key, 'Concrete compressive strength', "f'_c", 'MPa', def, { min: 0 });

export default {
  groups: [
    {
      title: 'Concrete Strength',
      equations: [
        {
          id: 'cyl-cube',
          title: 'Cylinder vs. Cube Strength',
          page: 'p. 9',
          latex: tx`f'_c \approx 0.80\, f_{cu}`,
          inputs: [num('fcu', 'Cube strength (150 mm)', 'f_{cu}', 'MPa', 30, { min: 0 })],
          outputs: [out('fc', 'Cylinder strength', "f'_c", 'MPa', 2, { expr: '0.80 * fcu' })]
        },
        {
          id: 'tensile-range',
          title: 'Tensile Strength Range',
          page: 'p. 9',
          latex: tx`0.08\, f'_c \;\le\; f_t \;\le\; 0.15\, f'_c`,
          inputs: [fcIn('fc')],
          outputs: [
            out('ftmin', 'Minimum tensile strength', 'f_{t,min}', 'MPa', 2, { expr: '0.08 * fc' }),
            out('ftmax', 'Maximum tensile strength', 'f_{t,max}', 'MPa', 2, { expr: '0.15 * fc' })
          ]
        },
        {
          id: 'split-cylinder',
          title: 'Split Cylinder Test (ASTM 496)',
          page: 'p. 10',
          latex: tx`f_{ct} = \dfrac{2P}{\pi\, L\, d}`,
          inputs: [
            num('P', 'Applied load', 'P', 'N', 200000, { min: 0 }),
            num('L', 'Cylinder length', 'L', 'mm', 300, { min: 0.001 }),
            num('d', 'Cylinder diameter', 'd', 'mm', 150, { min: 0.001 })
          ],
          outputs: [out('fct', 'Splitting tensile strength', 'f_{ct}', 'MPa', 2, { expr: '2 * P / (pi * L * d)' })]
        },
        {
          id: 'modulus-rupture-test',
          title: 'Modulus of Rupture Test (ASTM C78)',
          page: 'p. 10',
          latex: tx`f_r = \dfrac{M\,C}{I} = \dfrac{P\,L}{b\,h^2}`,
          inputs: [
            num('P', 'Applied load', 'P', 'N', 10000, { min: 0 }),
            num('L', 'Span length', 'L', 'mm', 600, { min: 0 }),
            num('b', 'Specimen width', 'b', 'mm', 150, { min: 0.001 }),
            num('h', 'Specimen depth', 'h', 'mm', 150, { min: 0.001 })
          ],
          outputs: [out('fr', 'Modulus of rupture', 'f_r', 'MPa', 2, { expr: 'P * L / (b * h^2)' })]
        },
        {
          id: 'fr-aci',
          title: 'Modulus of Rupture (ACI 19.2.3)',
          page: 'p. 11',
          latex: tx`f_r = 0.62\,\lambda\,\sqrt{f'_c}`,
          inputs: [
            fcIn('fcp'),
            sel('lam', 'Concrete type', '\\lambda', '', 1, [
              { value: 1, label: '1.0 — Normal-weight' },
              { value: 0.85, label: '0.85 — Sand-lightweight' },
              { value: 0.75, label: '0.75 — All-lightweight' }
            ])
          ],
          outputs: [out('fr', 'Modulus of rupture', 'f_r', 'MPa', 2, { expr: '0.62 * lam * sqrt(fcp)' })]
        }
      ]
    },
    {
      title: 'Modulus of Elasticity',
      equations: [
        {
          id: 'ec',
          title: 'Modulus of Elasticity of Concrete',
          page: 'p. 12',
          latex: tx`\begin{aligned}
            E_c &= 0.043\, w^{1.5}\sqrt{f'_c} \\[0.9em]
            E_c &= 4780\sqrt{f'_c} \quad (w \approx 2320\ \text{kg/m}^3) \\[0.9em]
            E_c &= 4700\sqrt{f'_c}
          \end{aligned}`,
          inputs: [
            fcIn('fc'),
            num('w', 'Unit weight of concrete', 'w', 'kg/m³', 2320, { min: 1400, max: 2600 })
          ],
          outputs: [
            out('ec1', 'Eq. 0.043 w^1.5 √f′c', 'E_c', 'MPa', 0, { expr: '0.043 * w^1.5 * sqrt(fc)' }),
            out('ec2', 'Eq. 4780 √f′c', 'E_c', 'MPa', 0, { expr: '4780 * sqrt(fc)' }),
            out('ec3', 'Eq. 4700 √f′c (ACI)', 'E_c', 'MPa', 0, { expr: '4700 * sqrt(fc)' })
          ]
        }
      ]
    },
    {
      title: 'Reinforcing Steel',
      equations: [
        {
          id: 'steel-stress',
          title: 'Steel Stress',
          page: 'p. 14',
          latex: tx`f_s = \varepsilon\, E_s \le f_y \qquad E_s = 200000\ \text{MPa}`,
          inputs: [
            num('strain', 'Steel strain', '\\varepsilon', '', 0.001, { min: 0 }),
            sel('fy', 'Steel grade (yield strength)', 'f_y', 'MPa', 420,
              [300, 350, 420, 520].map((g) => ({ value: g, label: `Grade ${g}` })))
          ],
          outputs: [out('fs', 'Steel stress', 'f_s', 'MPa', 1, { expr: 'min(strain * 200000, fy)' })]
        },
        {
          id: 'bar-area',
          title: 'Steel Bar Area (EN 10080 table)',
          page: 'p. 15',
          latex: tx`A_s = n\,\dfrac{\pi\, d^2}{4}`,
          note: 'Reproduces the bar-size table on p. 15.',
          inputs: [
            num('n', 'Number of bars', 'n', '', 4, { min: 1, max: 10 }),
            sel('d', 'Bar diameter', 'd', 'mm', 16, BAR_DIAMETERS.map((x) => ({ value: x, label: `${x} mm` })))
          ],
          outputs: [out('As', 'Total steel area', 'A_s', 'mm²', 0, { expr: 'n * pi * d^2 / 4' })]
        }
      ]
    }
  ]
};