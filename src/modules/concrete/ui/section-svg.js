/**
 * section-svg.js - رسم تخطيطي للمقطع (مستطيلات متراصة) مع الحديد والمحور المحايد
 */
export function sectionSvg({ rects, h, d, dp, As, Asp, y }) {
  if (!rects || !rects.length) return '';
  const W = 240;
  const H = 260;
  const pad = 16;
  const maxW = Math.max(...rects.map((r) => r.w));
  const s = Math.min((W - 2 * pad) / maxW, (H - 2 * pad) / h);
  const cx = W / 2;
  const py = (z) => pad + z * s;
  const widthAt = (z) => (rects.find((r) => z >= r.z0 && z <= r.z1) || { w: maxW }).w;
  const dots = (z, k, r) => {
    const w = widthAt(z) * s;
    return Array.from(
      { length: k },
      (_, i) =>
        `<circle cx="${cx - w / 2 + (w * (i + 1)) / (k + 1)}" cy="${py(z)}" r="${r}" fill="var(--violet-600,#6d4bd1)"/>`
    ).join('');
  };
  const body = rects
    .map(
      (r) =>
        `<rect x="${cx - (r.w * s) / 2}" y="${py(r.z0)}" width="${r.w * s}" height="${(r.z1 - r.z0) * s}" fill="currentColor" fill-opacity=".10" stroke="currentColor" stroke-width="1.5"/>`
    )
    .join('');
  const na = Number.isFinite(y)
    ? `<line x1="6" x2="${W - 6}" y1="${py(y)}" y2="${py(y)}" stroke="#d33" stroke-width="1.3" stroke-dasharray="5 4"/>
       <text x="${W - 8}" y="${py(y) - 5}" text-anchor="end" font-size="11" fill="#d33">N.A.</text>`
    : '';
  return `<svg class="cn-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Cross section">${body}${
    As > 0 ? dots(d, 3, 4.5) : ''
  }${Asp > 0 ? dots(dp, 2, 3.5) : ''}${na}</svg>`;
}