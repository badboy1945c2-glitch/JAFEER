/**
 * presets.js - أمثلة ونماذج المحاضرات الجاهزة (د. علي الرفاعي)
 */

export const LECTURE_PRESETS = [
  {
    id: 'ex1-compound-beam',
    title: 'جسور مركبة - مثال 1 (المحاضرة 1 ص 7)',
    description: 'عتبة مركبة مثبة عند A ومفصل عند B ورولر عند C مع حمل موزع وعزم مركز.',
    category: 'beam',
    beam: {
      length: 10.5,
      supports: [
        { type: 'fixed', x: 0, label: 'A' },
        { type: 'hinge', x: 6, label: 'B (مفصل داخلي)' },
        { type: 'roller', x: 10.5, label: 'C' }
      ],
      loads: [
        { type: 'udl', xStart: 0, length: 6, w: 6, label: '6 kN/m' },
        { type: 'moment', x: 10.5, value: 8, label: '8 kN·m' }
      ]
    },
    reference: 'المحاضرة 1، صفحة 7'
  },
  {
    id: 'ex2-frame-sfd-bmd',
    title: 'إطار بورتال Portal Frame (المحاضرة 9 ص 2)',
    description: 'إطار إنشائي بأحمال رياح وأحمال ميتة على السقف والعمود.',
    category: 'frame',
    beam: {
      length: 20,
      supports: [
        { type: 'pin', x: 0, label: 'A' },
        { type: 'roller', x: 20, label: 'D' }
      ],
      loads: [
        { type: 'udl', xStart: 0, length: 20, w: 0.8, label: '0.8 k/ft (سقف)' },
        { type: 'point', x: 0, value: 9.6, angle: 0, label: '9.6 k (جانبي)' }
      ]
    },
    reference: 'المحاضرة 9، صفحة 2'
  },
  {
    id: 'ex3-three-hinged-arch',
    title: 'قوس ثلاثي المفصلات Three-Hinged Arch (المحاضرة 7 ص 3)',
    description: 'تحليل القوس الدائري وحساب ردود الأفعال والقوى عند التاج C.',
    category: 'arch',
    beam: {
      length: 40,
      supports: [
        { type: 'pin', x: 0, label: 'A' },
        { type: 'hinge', x: 20, label: 'C (تاج القوس)' },
        { type: 'pin', x: 40, label: 'B' }
      ],
      loads: [
        { type: 'point', x: 10, value: 100, angle: 90, label: '100 kN' },
        { type: 'point', x: 28, value: 60, angle: 90, label: '60 kN' }
      ]
    },
    reference: 'المحاضرة 7، صفحة 3'
  },
  {
    id: 'ex4-truss-warren',
    title: 'جمالون ورين Warren Truss (المحاضرة 5 ص 6)',
    description: 'حساب القوى الداخلية لأعضاء الجمالون باستخدام طريقة المقاطع (Method of Sections).',
    category: 'truss',
    beam: {
      length: 18,
      supports: [
        { type: 'pin', x: 0, label: 'D' },
        { type: 'roller', x: 18, label: 'G' }
      ],
      loads: [
        { type: 'point', x: 3, value: 10, angle: 90, label: '10 kN' },
        { type: 'point', x: 9, value: 20, angle: 90, label: '20 kN' },
        { type: 'point', x: 15, value: 10, angle: 90, label: '10 kN' }
      ]
    },
    reference: 'المحاضرة 5، صفحة 6'
  },
  {
    id: 'ex5-influence-line-beam',
    title: 'خطوط التأثير Influence Lines (المحاضرة 11 ص 3)',
    description: 'حساب خطوط التأثير لردود الأفعال والقص والعزم لعتبة بسيطة طولها 10m.',
    category: 'influence',
    beam: {
      length: 10,
      supports: [
        { type: 'pin', x: 0, label: 'A' },
        { type: 'roller', x: 10, label: 'B' }
      ],
      loads: [
        { type: 'point', x: 2, value: 1, angle: 90, label: 'حمل متحرك P = 1' }
      ]
    },
    reference: 'المحاضرة 11، صفحة 3-5'
  }
];
export const LECTURE_PRESETS2 = [
  {
    id: 'arch-prob1',
    title: 'Example 1: Arch Problem (Dr. Ali Al-Rifaie)',
    category: 'Arches',
    reference: 'Lecture 7 - Prob 1',
    description: 'قوس بثلاثة مفاصل مع أحمال مركزة وتحديد ردود الأفعال والمجومعات.',
    beam: {
      length: 40,
      isArch: true,
      rise: 80,
      hasCrownHinge: true,
      supports: [
        { type: 'pin', x: 0, label: 'A' },
        { type: 'pin', x: 40, label: 'B' }
      ],
      loads: [
        { type: 'point', value: 100, x: 10, angle: 90 },
        { type: 'point', value: 60, x: 28, angle: 90 }
      ]
    }
  },
  {
    id: 'arch-fixed',
    title: 'Fixed Arch (a)',
    category: 'Arches',
    reference: 'Lecture 7 - Fig a',
    description: 'قوس ثابت من الطرفين (Fixed Arch).',
    beam: {
      length: 30,
      isArch: true,
      rise: 60,
      supports: [
        { type: 'fixed', x: 0, label: 'A' },
        { type: 'fixed', x: 30, label: 'B' }
      ],
      loads: [{ type: 'point', value: 50, x: 15, angle: 90 }]
    }
  },
  {
    id: 'arch-two-hinged',
    title: 'Two-Hinged Arch (b)',
    category: 'Arches',
    reference: 'Lecture 7 - Fig b',
    description: 'قوس ذو مفصلين عند القواعد.',
    beam: {
      length: 30,
      isArch: true,
      rise: 60,
      supports: [
        { type: 'pin', x: 0, label: 'A' },
        { type: 'pin', x: 30, label: 'B' }
      ],
      loads: [{ type: 'point', value: 50, x: 15, angle: 90 }]
    }
  },
  {
    id: 'arch-three-hinged',
    title: 'Three-Hinged Arch (c)',
    category: 'Arches',
    reference: 'Lecture 7 - Fig c',
    description: 'قوس ذو ثلاثة مفاصل (عند القواعد وفي التاج).',
    beam: {
      length: 30,
      isArch: true,
      rise: 60,
      hasCrownHinge: true,
      supports: [
        { type: 'pin', x: 0, label: 'A' },
        { type: 'pin', x: 30, label: 'B' }
      ],
      loads: [{ type: 'point', value: 80, x: 15, angle: 90 }]
    }
  },
  {
    id: 'arch-tied',
    title: 'Tied Arch (d)',
    category: 'Arches',
    reference: 'Lecture 7 - Fig d',
    description: 'قوس مشدود (Tied Arch) مع كابل سفلي.',
    beam: {
      length: 30,
      isArch: true,
      rise: 60,
      isTied: true,
      supports: [
        { type: 'pin', x: 0, label: 'A' },
        { type: 'pin', x: 30, label: 'B' }
      ],
      loads: [{ type: 'point', value: 60, x: 15, angle: 90 }]
    }
  }
];