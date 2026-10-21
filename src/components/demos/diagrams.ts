/**
 * Esquemas en SVG para explicar conceptos que no necesitan una foto:
 * planos, ángulos, composición, piezas de diseño, tipos de logo, diagramación y operaciones de edición.
 * Lienzo de 120×90. Clases: a (color principal), b (acento), m (gris suave), d (gris oscuro),
 * w (blanco), l (línea), la (línea principal), t (texto).
 */

const person = (x: number, y: number, s: number, cls = 'a') =>
  `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="-22" r="7" class="${cls}"/><path d="M-11 12v-14a11 11 0 0 1 22 0v14z" class="${cls}"/></g>`;
const ground = '<path d="M0 72h120v18H0z" class="m"/>';
const tree = (x: number, y: number, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-1.5" y="0" width="3" height="10" class="d"/><circle cx="0" cy="-4" r="8" class="m2"/></g>`;
const mountains = '<path d="M0 72l28-30 18 16 22-26 26 28 26-14v26z" class="m2"/>';
const bars = (x: number, y: number, widths: number[], h = 4, gap = 4, cls = 'd') =>
  widths.map((w, i) => `<rect x="${x}" y="${y + i * (h + gap)}" width="${w}" height="${h}" rx="2" class="${cls}"/>`).join('');
const camera = (x: number, y: number, rot = 0) =>
  `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-8" y="-5" width="14" height="10" rx="2" class="d"/><path d="M6 -3l5 -3v12l-5 -3z" class="d"/></g>`;
const sight = (x1: number, y1: number, x2: number, y2: number) =>
  `<path d="M${x1} ${y1}L${x2} ${y2}" class="la" stroke-dasharray="3 3"/>`;
const arrow = '<path d="M55 45h10m-4-4l4 4-4 4" class="l"/>';
const frameL = '<rect x="8" y="22" width="40" height="46" rx="4" class="m"/>';
const frameR = '<rect x="72" y="22" width="40" height="46" rx="4" class="m"/>';

export const DIAGRAMS: Record<string, string> = {
  // Planos
  'shot-xcu': `<circle cx="60" cy="45" r="30" class="a"/><ellipse cx="60" cy="45" rx="16" ry="9" class="w"/><circle cx="60" cy="45" r="6" class="d"/>`,
  'shot-cu': `${person(60, 96, 2.6)}`,
  'shot-ms': `${person(60, 92, 1.7)}`,
  'shot-fs': `${ground}${person(60, 62, 1.05)}<rect x="52" y="62" width="4" height="10" class="a"/><rect x="64" y="62" width="4" height="10" class="a"/>`,
  'shot-ws': `${ground}${tree(22, 58, 1.4)}${tree(98, 60, 1.1)}${person(60, 66, 0.55)}`,
  'shot-xws': `${mountains}${ground}${person(60, 70, 0.18)}`,

  // Ángulos
  'angle-eye': `${ground}${person(85, 62, 0.9)}${camera(25, 40)}${sight(36, 40, 76, 40)}`,
  'angle-low': `${ground}${person(80, 62, 0.9)}${camera(25, 68, -30)}${sight(34, 63, 76, 30)}`,
  'angle-high': `${ground}${person(85, 66, 0.7)}${camera(25, 14, 35)}${sight(34, 20, 80, 52)}`,
  'angle-top': `<rect x="20" y="15" width="80" height="60" rx="6" class="m"/><circle cx="60" cy="45" r="14" class="a"/><circle cx="60" cy="45" r="7" class="b"/><rect x="28" y="22" width="12" height="12" rx="2" class="m2"/><rect x="82" y="56" width="10" height="10" rx="5" class="m2"/>`,
  'angle-aerial': `${mountains}<path d="M0 72h120v18H0z" class="m"/><path d="M10 84c30-10 70-4 100-14" class="la"/>${camera(60, 14, 90)}`,
  'angle-dutch': `<g transform="rotate(-14 60 45)"><rect x="14" y="10" width="92" height="70" rx="4" class="m"/>${person(60, 80, 1.2)}</g>`,
  'angle-ots': `${person(90, 74, 1.2)}<path d="M0 90V58c0-12 10-20 24-20s24 8 24 20v32z" class="d"/><circle cx="24" cy="30" r="12" class="d"/>`,

  // Lentes
  'lens-wide': `${camera(14, 45)}<path d="M24 45L116 6M24 45l92 39" class="la"/><path d="M116 6v78" class="l"/>`,
  'lens-normal': `${camera(14, 45)}<path d="M24 45l92-24M24 45l92 24" class="la"/><path d="M116 21v48" class="l"/>`,
  'lens-tele': `${camera(14, 45)}<path d="M24 45l92-8M24 45l92 8" class="la"/><path d="M116 37v16" class="l"/>`,
  'lens-portrait': `<circle cx="22" cy="24" r="10" class="m2 blur"/><circle cx="98" cy="20" r="12" class="b2 blur"/><circle cx="96" cy="70" r="9" class="m2 blur"/><circle cx="20" cy="70" r="8" class="b2 blur"/>${person(60, 92, 1.5)}`,
  'lens-macro': `<circle cx="60" cy="45" r="10" class="b"/>${[0, 60, 120, 180, 240, 300].map((r) => `<ellipse cx="60" cy="22" rx="10" ry="16" class="a" transform="rotate(${r} 60 45)" opacity=".85"/>`).join('')}<circle cx="60" cy="45" r="8" class="b"/>`,
  'lens-fisheye': `<circle cx="60" cy="45" r="38" class="m"/><path d="M22 45h76M60 7v76M30 22c20 14 40 14 60 0M30 68c20-14 40-14 60 0M37 12c-8 22-8 44 0 66M83 12c8 22 8 44 0 66" class="l"/>`,
  'lens-tiltshift': `<rect x="0" y="0" width="120" height="90" class="m"/>${[18, 36, 54, 72, 90].map((x, i) => `<rect x="${x}" y="${38 + (i % 2) * 4}" width="12" height="12" class="${i % 2 ? 'a' : 'b'}"/><path d="M${x - 1} ${38 + (i % 2) * 4}l7-6 7 6z" class="d"/>`).join('')}<rect x="0" y="0" width="120" height="26" class="fog"/><rect x="0" y="64" width="120" height="26" class="fog"/>`,
  'lens-deep': `${mountains}${ground}${tree(18, 62, 1.6)}${person(70, 66, 0.6)}${tree(104, 60, 0.9)}`,

  // Composición
  'comp-thirds': `<path d="M40 0v90M80 0v90M0 30h120M0 60h120" class="l"/><circle cx="80" cy="30" r="9" class="a"/>`,
  'comp-center': `<path d="M60 0v90" class="l" stroke-dasharray="3 3"/><path d="M60 18l22 50H38z" class="a"/><circle cx="60" cy="40" r="6" class="w"/>`,
  'comp-golden': `<path d="M8 82V8h74v74H8M82 82V36h30v46M82 36h30M96 36v20h16M96 56h16" class="l"/><path d="M8 82C8 40 40 8 82 8c22 0 30 14 30 28 0 12-8 20-16 20-6 0-10-4-10-10" class="la"/><circle cx="98" cy="48" r="5" class="a"/>`,
  'comp-leading': `<path d="M0 90L56 40M120 90L64 40M30 90l28-50M90 90L62 40" class="la"/>${person(60, 42, 0.35)}`,
  'comp-diagonal': `<path d="M0 90L120 0" class="la"/><rect x="62" y="20" width="22" height="22" rx="3" class="a" transform="rotate(-37 73 31)"/><circle cx="34" cy="62" r="8" class="b"/>`,
  'comp-frame': `<rect x="0" y="0" width="120" height="90" class="d"/><path d="M28 90V40a32 32 0 0 1 64 0v50z" class="m"/>${person(60, 82, 0.8)}`,
  'comp-negative': `<circle cx="96" cy="66" r="6" class="a"/>`,
  'comp-pattern': [10, 34, 58, 82, 106].flatMap((x) => [15, 45, 75].map((y) => `<circle cx="${x}" cy="${y}" r="8" class="${(x + y) % 4 ? 'a' : 'b'}"/>`)).join(''),
  'comp-layers': `<path d="M0 60c30-18 60-18 120-6v36H0z" class="m2"/><path d="M0 74c40-12 80-10 120 0v16H0z" class="m"/>${person(70, 72, 0.6)}${tree(16, 74, 2)}`,

  // Piezas de diseño
  'piece-logo': `<circle cx="60" cy="38" r="16" class="a"/><path d="M52 38l6 6 10-12" class="wl"/>${bars(36, 62, [48], 6)}`,
  'piece-icon': `<rect x="36" y="21" width="48" height="48" rx="12" class="a"/><path d="M60 31l9 17H51z" class="w"/><circle cx="60" cy="56" r="5" class="w"/>`,
  'piece-post': `<rect x="38" y="8" width="44" height="55" rx="3" class="m"/><rect x="38" y="8" width="44" height="34" rx="3" class="a"/>${bars(43, 47, [30, 20], 4, 4)}<path d="M38 70h44" class="l"/>`,
  'piece-story': `<rect x="44" y="4" width="32" height="82" rx="6" class="d"/><rect x="47" y="10" width="26" height="70" rx="2" class="a"/>${bars(51, 50, [18, 12], 4, 4, 'w')}`,
  'piece-flyer': `<rect x="36" y="6" width="48" height="60" rx="2" class="m"/>${bars(41, 12, [38, 26], 7, 4, 'a')}<rect x="41" y="36" width="38" height="18" rx="2" class="b2"/>${bars(41, 58, [20], 4)}`,
  'piece-poster': `<rect x="38" y="4" width="44" height="66" rx="2" class="d"/><circle cx="60" cy="30" r="15" class="b"/>${bars(43, 52, [34, 18], 5, 4, 'w')}`,
  'piece-book': `<rect x="40" y="5" width="40" height="62" rx="2" class="a"/><rect x="40" y="5" width="5" height="62" class="d"/>${bars(49, 14, [26, 18], 5, 4, 'w')}<circle cx="62" cy="45" r="9" class="b"/>`,
  'piece-album': `<rect x="30" y="10" width="54" height="54" rx="2" class="a"/><circle cx="84" cy="37" r="24" class="d"/><circle cx="84" cy="37" r="5" class="m"/><rect x="30" y="10" width="54" height="54" rx="2" class="a"/><path d="M38 52l12-18 10 12 8-8 10 14z" class="w"/>`,
  'piece-thumb': `<rect x="10" y="16" width="100" height="56" rx="4" class="d"/>${person(88, 86, 1.4, 'b')}${bars(18, 26, [44, 34], 9, 5, 'w')}`,
  'piece-banner': `<rect x="4" y="24" width="112" height="42" rx="3" class="m"/>${bars(12, 32, [40, 28], 6, 4, 'a')}<rect x="12" y="52" width="22" height="7" rx="3" class="b"/><circle cx="90" cy="45" r="14" class="a"/>`,
  'piece-card': `<rect x="20" y="22" width="80" height="46" rx="4" class="m"/><circle cx="36" cy="38" r="7" class="a"/>${bars(28, 52, [40, 26], 3, 3)}`,
  'piece-sticker': `<path d="M60 12c20 0 34 12 34 30s-14 34-34 34-34-14-34-32 14-32 34-32z" class="w" stroke="#ccc"/><path d="M60 20c14 0 26 9 26 23s-12 26-26 26-26-11-26-24 12-25 26-25z" class="a"/><circle cx="52" cy="40" r="3" class="w"/><circle cx="68" cy="40" r="3" class="w"/><path d="M52 52c5 4 11 4 16 0" class="wl"/>`,
  'piece-label': `<rect x="44" y="8" width="32" height="10" rx="2" class="d"/><rect x="38" y="18" width="44" height="64" rx="8" class="m"/><rect x="40" y="36" width="40" height="28" class="a"/>${bars(46, 44, [28, 18], 4, 4, 'w')}`,

  // Tipos de logo
  'logo-wordmark': `<text x="60" y="54" text-anchor="middle" class="t" font-size="26" font-weight="800">marca</text>`,
  'logo-lettermark': `<circle cx="60" cy="45" r="28" class="a"/><text x="60" y="55" text-anchor="middle" class="wt" font-size="28" font-weight="800">MA</text>`,
  'logo-pictorial': `<path d="M60 18c18 10 22 32 6 52-20-6-28-28-6-52z" class="a"/><path d="M60 26v40" class="wl"/>`,
  'logo-abstract': `<circle cx="50" cy="45" r="20" class="a" opacity=".9"/><circle cx="70" cy="45" r="20" class="b" opacity=".85"/><rect x="52" y="27" width="16" height="36" class="d" opacity=".25"/>`,
  'logo-mascot': `<circle cx="60" cy="48" r="26" class="b"/><circle cx="42" cy="26" r="9" class="b"/><circle cx="78" cy="26" r="9" class="b"/><circle cx="51" cy="44" r="4" class="d"/><circle cx="69" cy="44" r="4" class="d"/><ellipse cx="60" cy="56" rx="8" ry="5" class="w"/>`,
  'logo-emblem': `<circle cx="60" cy="45" r="34" class="d"/><circle cx="60" cy="45" r="26" class="w"/><circle cx="60" cy="45" r="24" class="a"/><text x="60" y="50" text-anchor="middle" class="wt" font-size="9" font-weight="800">EST. 2026</text>`,
  'logo-combo': `<circle cx="28" cy="45" r="14" class="a"/><text x="48" y="52" class="t" font-size="20" font-weight="800">marca</text>`,

  // Diagramación
  'layout-center': `<rect x="20" y="8" width="80" height="74" rx="3" class="m"/><circle cx="60" cy="32" r="12" class="a"/>${bars(36, 52, [48], 6, 4, 'd')}${bars(44, 64, [32], 4)}`,
  'layout-grid': `<rect x="14" y="8" width="92" height="74" rx="3" class="m"/>${[0, 1, 2].flatMap((c) => [0, 1].map((r) => `<rect x="${20 + c * 29}" y="${14 + r * 33}" width="24" height="28" rx="2" class="${(c + r) % 2 ? 'b2' : 'a'}"/>`)).join('')}`,
  'layout-asym': `<rect x="14" y="8" width="92" height="74" rx="3" class="m"/><rect x="50" y="14" width="50" height="44" rx="2" class="a"/>${bars(20, 62, [44, 30], 6, 4, 'd')}`,
  'layout-split': `<rect x="14" y="8" width="92" height="74" rx="3" class="m"/><rect x="14" y="8" width="46" height="74" rx="3" class="a"/>${bars(66, 30, [32, 24, 28], 5, 5, 'd')}`,
  'layout-type': `<rect x="14" y="8" width="92" height="74" rx="3" class="m"/><text x="60" y="64" text-anchor="middle" class="t" font-size="46" font-weight="900">Aa</text>`,
  'layout-fullbleed': `<rect x="14" y="8" width="92" height="74" rx="3" class="a"/>${mountains.replace('M0 72', 'M14 72').replace('v26z', 'v10H14z')}${bars(24, 18, [50, 32], 7, 4, 'w')}`,
  'layout-space': `<rect x="14" y="8" width="92" height="74" rx="3" class="m"/><rect x="20" y="14" width="80" height="26" rx="2" class="w" stroke-dasharray="3 3" stroke="#999"/><rect x="14" y="46" width="92" height="36" class="a"/>`,

  // Elementos gráficos
  'el-shapes': `<circle cx="34" cy="46" r="16" class="a"/><rect x="54" y="28" width="30" height="30" class="b"/><path d="M96 26l14 32H82z" class="d"/>`,
  'el-blobs': `<path d="M30 30c16-14 34 4 28 18s-26 22-36 10 0-20 8-28z" class="a"/><path d="M76 24c18-6 30 14 20 30s-30 8-30-6 0-20 10-24z" class="b"/>`,
  'el-illustration': `${mountains}<circle cx="88" cy="26" r="9" class="b"/>${tree(36, 60, 1.5)}`,
  'el-photo': `<rect x="20" y="14" width="80" height="62" rx="3" class="d"/><path d="M28 68l20-26 14 16 10-10 20 20z" class="m"/><circle cx="84" cy="30" r="6" class="b"/>`,
  'el-pattern': Array.from({ length: 6 }, (_, r) => Array.from({ length: 8 }, (_, c) => `<circle cx="${10 + c * 14 + (r % 2) * 7}" cy="${10 + r * 14}" r="3" class="${(r + c) % 3 ? 'm2' : 'a'}"/>`).join('')).join(''),
  'el-gradient': `<defs><linearGradient id="eg" x1="0" x2="1"><stop offset="0" stop-color="#6d4aff"/><stop offset="1" stop-color="#ff6b5b"/></linearGradient></defs><rect x="10" y="14" width="100" height="62" rx="8" fill="url(#eg)"/>`,
  'el-lines': `<rect x="16" y="12" width="88" height="66" class="l"/><rect x="24" y="20" width="72" height="50" class="l"/><path d="M30 45h60" class="la"/>`,
  'el-icons': `<circle cx="30" cy="45" r="12" class="a"/><path d="M52 34h20v22H52z" class="b"/><path d="M90 33l12 24H78z" class="d"/>`,

  // Operaciones de edición (antes → después)
  'op-remove': `${frameL}${person(22, 64, 0.5)}${person(36, 64, 0.5, 'b')}${arrow}${frameR}${person(86, 64, 0.5)}`,
  'op-cutout': `${frameL}<rect x="8" y="22" width="40" height="46" rx="4" class="m2"/>${person(28, 66, 0.7)}${arrow}<rect x="72" y="22" width="40" height="46" rx="4" class="w" stroke="#ccc"/>${person(92, 66, 0.7)}`,
  'op-background': `${frameL}${person(28, 66, 0.7)}${arrow}<rect x="72" y="22" width="40" height="46" rx="4" class="b2"/><circle cx="102" cy="32" r="5" class="b"/>${person(92, 66, 0.7)}`,
  'op-add': `${frameL}${person(28, 66, 0.7)}${arrow}${frameR}${person(88, 66, 0.7)}<path d="M104 34v12M98 40h12" class="la"/>`,
  'op-change': `${frameL}${person(28, 66, 0.7)}${arrow}${frameR}${person(92, 66, 0.7, 'b')}`,
  'op-style': `${frameL}${person(28, 66, 0.7)}${arrow}<rect x="72" y="22" width="40" height="46" rx="4" class="b2"/><path d="M80 60c6-14 16-20 24-24" class="la" stroke-width="5" stroke-linecap="round"/><circle cx="92" cy="40" r="6" class="a"/>`,
  'op-filter': `${frameL}<circle cx="28" cy="45" r="12" class="b"/>${arrow}${frameR}<circle cx="92" cy="45" r="12" class="d"/>`,
  'op-relight': `${frameL}${person(28, 66, 0.7, 'd')}${arrow}<rect x="72" y="22" width="40" height="46" rx="4" class="b2"/>${person(92, 66, 0.7, 'b')}<circle cx="106" cy="28" r="5" class="b"/>`,
  'op-retouch': `${frameL}<circle cx="28" cy="45" r="15" class="b"/>${[0, 1, 2, 3].map((i) => `<circle cx="${22 + i * 4}" cy="${40 + (i % 2) * 8}" r="1.6" class="d"/>`).join('')}${arrow}${frameR}<circle cx="92" cy="45" r="15" class="b"/><path d="M104 28l3 3 6-7" class="la"/>`,
  'op-restore': `${frameL}${person(28, 66, 0.7, 'd')}<path d="M12 30l30 30M40 26L18 54" class="wl"/>${arrow}${frameR}${person(92, 66, 0.7, 'd')}`,
  'op-colorize': `${frameL}${person(28, 66, 0.7, 'd')}${arrow}${frameR}${person(92, 66, 0.7, 'b')}<circle cx="104" cy="30" r="4" class="a"/>`,
  'op-expand': `<rect x="10" y="10" width="100" height="70" rx="4" class="m" stroke-dasharray="4 3" stroke="#999"/><rect x="38" y="28" width="44" height="34" rx="3" class="a"/><path d="M36 26l-12-8M84 26l12-8M36 64l-12 8M84 64l12 8" class="la"/>`,
  'op-enhance': `${frameL}<circle cx="28" cy="45" r="12" class="a blur"/>${arrow}${frameR}<circle cx="92" cy="45" r="12" class="a"/><path d="M104 26l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" class="b"/>`,
  'op-composite': `<rect x="6" y="14" width="30" height="30" rx="3" class="m"/>${person(21, 40, 0.45)}<text x="40" y="34" class="t" font-size="14" font-weight="800">+</text><rect x="50" y="14" width="30" height="30" rx="3" class="b2"/>${arrow.replace('M55 45', 'M84 45').replace('m-4-4l4 4-4 4', 'm-4-4l4 4-4 4')}<rect x="98" y="30" width="18" height="30" rx="3" class="b2"/>${person(107, 56, 0.4)}`,
  'op-text': `${frameL}${arrow}${frameR}<rect x="78" y="38" width="28" height="14" rx="2" class="a"/><text x="92" y="48.5" text-anchor="middle" class="wt" font-size="8" font-weight="800">ABC</text>`,
};
