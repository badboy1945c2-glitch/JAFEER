// اختبارات تخطيط شجرة USCS وخطوات الحركة (S7/S8) - بلا DOM
import { describe, it, expect } from 'vitest';
import { getUscsTree, USCS_ROOT } from '../src/modules/soil-mechanics/engine/uscs-tree.js';
import { layoutTree, wrapText } from '../src/modules/soil-mechanics/ui/charts/uscs-tree-layout.js';
import { buildSteps, describeFinal, signature, candidateLeafIds } from '../src/modules/soil-mechanics/ui/charts/tree-steps.js';
import { classifyUSCS as U } from '../src/modules/soil-mechanics/engine/classify.js';

const tree = getUscsTree();
const overlaps = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

function checkLayout(L) {
  expect(L.edges.length).toBe(L.nodes.length - 1);            // شجرة: كل عقدة ما عدا الجذر لها فرع داخل
  for (let i = 0; i < L.nodes.length; i++) {
    const n = L.nodes[i];
    expect(n.x).toBeGreaterThanOrEqual(0);
    expect(n.x + n.w).toBeLessThanOrEqual(L.width);
    expect(n.y).toBeGreaterThanOrEqual(0);
    expect(n.y + n.h).toBeLessThanOrEqual(L.height);
    for (let j = i + 1; j < L.nodes.length; j++) expect(overlaps(n, L.nodes[j])).toBe(false);
  }
}

describe('تخطيط الشجرة', () => {
  it('wrapText يقسم الأسطر', () => {
    expect(wrapText('a bb ccc', 4)).toEqual(['a bb', 'ccc']);
    expect(wrapText('', 5)).toEqual(['']);
  });
  it('شجرة الرمز: 19 عقدة داخلية وكل الأوراق، بلا تداخل', () => {
    const L = layoutTree(tree, USCS_ROOT);
    expect(L.nodes.filter((n) => !n.leaf).length).toBe(19);
    expect(L.nodes.filter((n) => n.leaf).length).toBe(L.nodes.filter((n) => n.leaf && n.stage === 'symbol').length);
    checkLayout(L);
  });
  it('كل شجرة اسم لها تخطيط سليم', () => {
    const roots = Object.keys(tree).filter((id) => /^name\.[A-Za-z-]+$/.test(id));
    expect(roots.length).toBe(26);
    for (const r of roots) checkLayout(layoutTree(tree, r));
  });
});

describe('خطوات الحركة', () => {
  it('Example 14: تنتهي بورقة الاسم، والفرع الداخل يطابق الفرع السابق', () => {
    const r = U({ P10: 100, P40: 80, F200: 58, LL: 30, PI: 10 });
    const s = buildSteps(r);
    expect(s.length).toBe(r.path.length);
    expect(s[0].edgeIn).toBe(null);
    expect(s[1].edgeIn).toBe(`${r.path[0].nodeId}>${r.path[0].branchId}`);
    expect(s[s.length - 1].kind).toBe('name');
    expect(describeFinal(r, tree)).toContain('Sandy lean clay');
    s.forEach((x) => expect(tree[x.nodeId]).toBeTruthy());
  });
  it('جزئي: F200=58 فقط يصف العقدة المعلقة وما ينقص', () => {
    const r = U({ F200: 58 });
    expect(describeFinal(r, tree)).toContain('الحد السائل');
    expect(candidateLeafIds(tree, r.candidates).length).toBe(5);
  });
  it('البصمة: نفس المدخلات نفس البصمة، وتغيّر LL يغيّرها', () => {
    expect(signature(U({ F200: 58, LL: 30 }))).toBe(signature(U({ LL: 30, F200: 58 })));
    expect(signature(U({ F200: 58, LL: 30 }))).not.toBe(signature(U({ F200: 58, LL: 60 })));
  });
});
