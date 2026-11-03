/**
 * diagrams.js - رسومات ومخططات هندسية أصلية بصيغة SVG لموقع «المهندس الصغير»
 * رسومات معمارية وإنشائية خفيفة ونظيفة بديلة للصور المخزونية
 */

/**
 * مخطط العتبة البسيطة مع مخطط عزم الانحناء والقص (Beam & Moment Diagram)
 */
export function renderBeamMomentDiagramSvg() {
  return `
    <svg viewBox="0 0 400 240" width="100%" height="240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- شبكة رسم هندسي خفيفة -->
      <pattern id="diag-grid-1" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--line)" stroke-width="0.8"/>
      </pattern>
      <rect width="400" height="240" fill="url(#diag-grid-1)" rx="8" stroke="var(--line-strong)" stroke-width="1"/>

      <!-- الحمل الموزع المنتظم w -->
      <line x1="60" y1="36" x2="340" y2="36" stroke="var(--violet-600)" stroke-width="2" />
      ${[60, 100, 140, 180, 220, 260, 300, 340].map(x => `
        <line x1="${x}" y1="36" x2="${x}" y2="60" stroke="var(--violet-600)" stroke-width="1.5" />
        <polygon points="${x-3},56 ${x+3},56 ${x},62" fill="var(--violet-600)" />
      `).join('')}
      <text x="200" y="26" font-family="var(--font-mono)" font-size="12" font-weight="600" fill="var(--violet-700)" text-anchor="middle">الحمل الموزع w = q</text>

      <!-- العتبة -->
      <rect x="60" y="64" width="280" height="14" rx="2" fill="var(--violet-100)" stroke="var(--ink)" stroke-width="2" />

      <!-- الركائز: ركيزة مفصلية (يسار) وركيزة منزلقة (يمين) -->
      <!-- مفصلية Pin -->
      <polygon points="60,78 50,96 70,96" fill="none" stroke="var(--ink)" stroke-width="2" />
      <line x1="44" y1="96" x2="76" y2="96" stroke="var(--ink)" stroke-width="2" />

      <!-- منزلقة Roller -->
      <polygon points="340,78 330,94 350,94" fill="none" stroke="var(--ink)" stroke-width="2" />
      <circle cx="334" cy="98" r="3" fill="none" stroke="var(--ink)" stroke-width="1.5"/>
      <circle cx="346" cy="98" r="3" fill="none" stroke="var(--ink)" stroke-width="1.5"/>
      <line x1="324" y1="102" x2="356" y2="102" stroke="var(--ink)" stroke-width="2" />

      <!-- خط البعد لطول العتبة L -->
      <line x1="60" y1="114" x2="340" y2="114" stroke="var(--line-strong)" stroke-width="1.2" stroke-dasharray="3 3"/>
      <line x1="60" y1="108" x2="60" y2="120" stroke="var(--line-strong)" stroke-width="1.2"/>
      <line x1="340" y1="108" x2="340" y2="120" stroke="var(--line-strong)" stroke-width="1.2"/>
      <text x="200" y="128" font-family="var(--font-mono)" font-size="12" fill="var(--ink-soft)" text-anchor="middle">الطول L</text>

      <!-- مخطط عزم الانحناء (BMD) -->
      <line x1="60" y1="160" x2="340" y2="160" stroke="var(--ink-muted)" stroke-width="1"/>
      <path d="M 60 160 Q 200 220 340 160" fill="rgba(102, 54, 204, 0.08)" stroke="var(--violet-600)" stroke-width="2.5" />
      <text x="200" y="195" font-family="var(--font-mono)" font-size="12" font-weight="700" fill="var(--violet-800)" text-anchor="middle">M_max = w·L² / 8</text>
      <text x="200" y="152" font-family="var(--font-mono)" font-size="10" fill="var(--ink-muted)" text-anchor="middle">[مخطط عزم الانحناء BMD]</text>
    </svg>
  `;
}

/**
 * مقطع عرضي لعتبة خرسانية مسلحة (Reinforced Concrete Section)
 */
export function renderConcreteSectionDiagramSvg() {
  return `
    <svg viewBox="0 0 320 240" width="100%" height="240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <pattern id="diag-grid-2" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--line)" stroke-width="0.8"/>
      </pattern>
      <rect width="320" height="240" fill="url(#diag-grid-2)" rx="8" stroke="var(--line-strong)" stroke-width="1"/>

      <!-- المقطع الخرساني المستطيل (b × h) -->
      <rect x="90" y="30" width="140" height="170" fill="var(--violet-50)" stroke="var(--ink)" stroke-width="2.5" rx="4" />

      <!-- كانة التسليح العرضية (Stirrup) -->
      <rect x="105" y="45" width="110" height="140" fill="none" stroke="var(--violet-500)" stroke-width="2" rx="6" />

      <!-- قضبان التسليح السفلية الرئيسية (3 قضبان) -->
      <circle cx="120" cy="170" r="7" fill="var(--violet-700)" stroke="var(--ink)" stroke-width="1.5"/>
      <circle cx="160" cy="170" r="7" fill="var(--violet-700)" stroke="var(--ink)" stroke-width="1.5"/>
      <circle cx="200" cy="170" r="7" fill="var(--violet-700)" stroke="var(--ink)" stroke-width="1.5"/>

      <!-- قضبان التعليق العلوية (قضيبين) -->
      <circle cx="120" cy="60" r="5" fill="var(--violet-300)" stroke="var(--ink)" stroke-width="1.5"/>
      <circle cx="200" cy="60" r="5" fill="var(--violet-300)" stroke="var(--ink)" stroke-width="1.5"/>

      <!-- أبعاد العرض b -->
      <line x1="90" y1="215" x2="230" y2="215" stroke="var(--line-strong)" stroke-width="1.2" stroke-dasharray="3 2"/>
      <line x1="90" y1="210" x2="90" y2="220" stroke="var(--line-strong)" stroke-width="1.2"/>
      <line x1="230" y1="210" x2="230" y2="220" stroke="var(--line-strong)" stroke-width="1.2"/>
      <text x="160" y="228" font-family="var(--font-mono)" font-size="11" fill="var(--ink-soft)" text-anchor="middle">العرض b</text>

      <!-- أبعاد الارتفاع h -->
      <line x1="65" y1="30" x2="65" y2="200" stroke="var(--line-strong)" stroke-width="1.2" stroke-dasharray="3 2"/>
      <line x1="60" y1="30" x2="70" y2="30" stroke="var(--line-strong)" stroke-width="1.2"/>
      <line x1="60" y1="200" x2="70" y2="200" stroke="var(--line-strong)" stroke-width="1.2"/>
      <text x="50" y="118" font-family="var(--font-mono)" font-size="11" fill="var(--ink-soft)" text-anchor="middle">الارتفاع h</text>

      <!-- مؤشر التسليح -->
      <text x="250" y="174" font-family="var(--font-mono)" font-size="11" font-weight="600" fill="var(--violet-700)">As (رئيسي)</text>
      <line x1="208" y1="170" x2="242" y2="170" stroke="var(--violet-600)" stroke-width="1.2"/>
    </svg>
  `;
}

/**
 * مخطط ضغط التربة الجانبي على جدار استنادي (Retaining Wall Pressure)
 */
export function renderSoilPressureDiagramSvg() {
  return `
    <svg viewBox="0 0 340 240" width="100%" height="240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <pattern id="diag-grid-3" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--line)" stroke-width="0.8"/>
      </pattern>
      <rect width="340" height="240" fill="url(#diag-grid-3)" rx="8" stroke="var(--line-strong)" stroke-width="1"/>

      <!-- الجدار الاستنادي الكابولي (Stem & Footing) -->
      <polygon points="120,40 138,40 144,180 80,180 80,200 200,200 200,180 144,180" fill="var(--violet-100)" stroke="var(--ink)" stroke-width="2" />

      <!-- خط منسوب الردم الترابي (Ground Surface) -->
      <line x1="138" y1="40" x2="300" y2="40" stroke="var(--ink)" stroke-width="2"/>
      ${[160, 190, 220, 250, 280].map(x => `
        <line x1="${x}" y1="40" x2="${x-10}" y2="50" stroke="var(--ink-muted)" stroke-width="1.5"/>
      `).join('')}

      <!-- مثلث ضغط التربة الفعال (Active Earth Pressure Triangle) -->
      <polygon points="144,40 144,180 230,180" fill="rgba(102, 54, 204, 0.12)" stroke="var(--violet-600)" stroke-width="2" />
      
      <!-- أسهم توزيع الضغط -->
      ${[75, 110, 145, 175].map((y, idx) => {
        const len = (idx + 1) * 20;
        return `
          <line x1="144" y1="${y}" x2="${144 + len}" y2="${y}" stroke="var(--violet-600)" stroke-width="1.5"/>
          <polygon points="${144 + len - 4},${y-3} ${144 + len - 4},${y+3} ${144 + len},${y}" fill="var(--violet-600)"/>
        `;
      }).join('')}

      <text x="240" y="195" font-family="var(--font-mono)" font-size="11" font-weight="600" fill="var(--violet-800)">pa = Ka·γ·H</text>
      <text x="185" y="115" font-family="var(--font-mono)" font-size="10" fill="var(--violet-700)">Pa (المحصلة)</text>
    </svg>
  `;
}

