/**
 * lecture-2.js - Lecture 2: Design Methods and Requirements
 */
import { num, sel, out, tx } from './helpers.js';
import { loadCombinations } from '../engine/rc.js';

// Minimum live load values on slabs (p. 3), kN/m²
const LIVE = [
  ['Residential', 2], ['Residential balconies', 3], ['Computer use', 5], ['Offices', 2],
  ['Warehouses: Light storage', 6], ['Warehouses: Heavy storage', 12],
  ['Schools: Classrooms', 2], ['Libraries: Rooms', 3], ['Libraries: Stack rooms', 6],
  ['Hospitals', 2], ['Assembly halls: Fixed seating', 2.5], ['Assembly halls: Movable seating', 5],
  ['Garages (cars)', 2.5], ['Stores: Retail', 4], ['Stores: Wholesale', 5],
  ['Exit facilities', 5], ['Manufacturing: Light', 4], ['Manufacturing: Heavy', 6]
];

const load = (key, name, tex, def = 0) => num(key, name, tex, 'kN/m²', def, { min: 0 });
const KEYS = ['ua', 'ub', 'uc1', 'uc2', 'ud', 'ue', 'uf', 'ug'];
const COMBO_NAMES = [
  'Eq. 5.3.1a', 'Eq. 5.3.1b', 'Eq. 5.3.1c (with 1.0L)', 'Eq. 5.3.1c (with 0.5W)',
  'Eq. 5.3.1d', 'Eq. 5.3.1e', 'Eq. 5.3.1f', 'Eq. 5.3.1g'
];

export default {
  groups: [
    {
      title: 'Loads',
      equations: [
        {
          id: 'live-load-table',
          title: 'Minimum Live Load on Slabs',
          page: 'p. 3',
          latex: tx`L = \text{Table: Minimum live load values on slabs}`,
          inputs: [sel('type', 'Type of use', '', '', 0, LIVE.map(([name], i) => ({ value: i, label: name })))],
          outputs: [out('L', 'Uniform live load', 'L', 'kN/m²', 1)],
          compute: (v) => ({ L: LIVE[v.type][1] })
        },
        {
          id: 'load-combinations',
          title: 'Load Combinations (ACI 5.3.1)',
          page: 'p. 4–5',
          wide: true,
          latex: tx`\begin{aligned}
            U &= 1.4D \\[0.8em]
            U &= 1.2D + 1.6L + 0.5\,(L_r \text{ or } S \text{ or } R) \\[0.8em]
            U &= 1.2D + 1.6\,(L_r \text{ or } S \text{ or } R) + (1.0L \text{ or } 0.5W) \\[0.8em]
            U &= 1.2D + 1.0W + 1.0L + 0.5\,(L_r \text{ or } S \text{ or } R) \\[0.8em]
            U &= 1.2D + 1.0E + 1.0L + 0.2S \\[0.8em]
            U &= 0.9D + 1.0W \\[0.8em]
            U &= 0.9D + 1.0E
          \end{aligned}`,
          inputs: [
            load('D', 'Dead load', 'D', 5),
            load('L', 'Live load', 'L', 2),
            load('Lr', 'Roof live / snow / rain load', 'L_r|S|R'),
            load('S', 'Snow load', 'S'),
            load('W', 'Wind load', 'W'),
            load('E', 'Seismic load', 'E')
          ],
          outputs: [
            ...COMBO_NAMES.map((nm, i) => out(KEYS[i], nm, 'U', '', 2)),
            out('U', 'Governing required strength', 'U_{max}', '', 2, { head: 'Result' }),
            out('eq', 'Governing equation', '', '')
          ],
          compute: (v) => {
            const { list, governing } = loadCombinations(v);
            const r = {};
            KEYS.forEach((k, i) => { r[k] = list[i].U; });
            r.U = governing.U;
            r.eq = governing.id;
            return r;
          }
        }
      ]
    }
  ]
};