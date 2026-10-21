/**
 * Filtros SVG para las demos (se usan desde CSS con `filter: url(#pf-…)`).
 * Hacen lo que los filtros de CSS no pueden: curvas por canal (teal & orange, proceso cruzado),
 * duotonos, separación RGB y resplandor. FilterDefs.tsx los inserta una sola vez por página.
 */
const curve = (r: string, g: string, b: string) =>
  `<feComponentTransfer><feFuncR type="table" tableValues="${r}"/><feFuncG type="table" tableValues="${g}"/><feFuncB type="table" tableValues="${b}"/></feComponentTransfer>`;
const same = (v: string) => curve(v, v, v);
const saturate = (v: number) => `<feColorMatrix type="saturate" values="${v}"/>`;
const matrix = (v: string) => `<feColorMatrix type="matrix" values="${v}"/>`;
const LUMA = matrix('.2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 0 0 0 1 0');
const S_CURVE = '0 .08 .5 .92 1';
/** Duotono: las sombras pasan a `dark` y las luces a `light` (colores HEX). */
const duo = (dark: string, light: string) => {
  const ch = (hex: string, i: number) => (parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255).toFixed(2);
  const pair = (i: number) => `${ch(dark, i)} ${ch(light, i)}`;
  return LUMA + curve(pair(0), pair(1), pair(2));
};
/** Mezcla la foto con una copia corrida: el "doble contorno" de una foto movida. */
const SHAKE =
  '<feOffset in="SourceGraphic" dx="5" dy="2" result="o"/>' +
  '<feComposite in="SourceGraphic" in2="o" operator="arithmetic" k2=".55" k3=".45"/>' +
  '<feGaussianBlur stdDeviation="1.4 .7" edgeMode="duplicate"/>';

export const FILTERS: Record<string, string> = {
  bn: saturate(0) + same('0 .06 .5 .94 1'),
  vintage:
    matrix('.9 .1 .05 0 .06 .05 .85 .05 0 .04 .05 .1 .7 0 .05 0 0 0 1 0') + curve('.1 .95', '.08 .9', '.12 .8'),
  film: curve('.04 .28 .62 .94', '.03 .27 .6 .9', '.08 .28 .55 .85') + saturate(1.1),
  teal: saturate(1.2) + curve('0 .15 .5 .85 1', '.05 .28 .52 .74 .92', '.15 .38 .5 .58 .68'),
  warm: matrix('1.1 0 0 0 .02 0 1.02 0 0 .01 0 0 .82 0 0 0 0 0 1 0'),
  cool: matrix('.88 0 0 0 0 0 1 0 0 .01 0 0 1.15 0 .03 0 0 0 1 0'),
  contrast: same(S_CURVE) + saturate(1.2),
  matte: same('.13 .38 .62 .86') + saturate(0.85),
  duo: LUMA + curve('.17 1', '.1 .71', '.43 .54'),
  hdr:
    '<feConvolveMatrix order="3" kernelMatrix="0 -.6 0 -.6 3.4 -.6 0 -.6 0" preserveAlpha="true"/>' +
    saturate(1.35) +
    same('0 .2 .52 .85 1'),
  cross: curve('0 .1 .55 .95 1', '0 .12 .55 .92 1', '.22 .36 .5 .62 .72') + saturate(1.3),
  glitch:
    '<feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="r"/>' +
    '<feOffset in="r" dx="5" result="r2"/>' +
    '<feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="g"/>' +
    '<feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="b"/>' +
    '<feOffset in="b" dx="-5" result="b2"/>' +
    '<feBlend in="r2" in2="g" mode="screen" result="rg"/><feBlend in="rg" in2="b2" mode="screen"/>' +
    saturate(1.3),
  vhs:
    '<feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="r"/>' +
    '<feOffset in="r" dx="3" result="r2"/>' +
    '<feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0" result="gb"/>' +
    '<feBlend in="r2" in2="gb" mode="screen" result="m"/><feGaussianBlur in="m" stdDeviation=".6 0"/>' +
    curve('.08 .95', '.05 .9', '.1 .95') +
    saturate(1.4),
  ir: matrix('.3 .9 0 0 0 .7 .1 0 0 0 0 .1 .9 0 0 0 0 0 1 0') + same('0 .1 .55 .95 1'),
  lomo: same('0 .04 .5 .96 1') + saturate(1.55),
  polaroid: curve('.08 .35 .68 .95', '.1 .38 .66 .92', '.16 .38 .6 .82') + saturate(0.9),
  noir: saturate(0) + same('0 .02 .35 .9 1'),
  glow:
    '<feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"/>' +
    '<feBlend in="SourceGraphic" in2="blur" mode="screen" result="s"/>' +
    '<feComposite in="s" in2="SourceGraphic" operator="arithmetic" k2=".75" k3=".25"/>' +
    saturate(1.15),
  bleach: saturate(0.45) + same('0 .02 .55 .98 1'),
  poster:
    saturate(1.3) +
    '<feComponentTransfer><feFuncR type="discrete" tableValues="0 .25 .5 .75 1"/><feFuncG type="discrete" tableValues="0 .25 .5 .75 1"/><feFuncB type="discrete" tableValues="0 .25 .5 .75 1"/></feComponentTransfer>',
  motion: '<feGaussianBlur stdDeviation="7 0" edgeMode="duplicate"/>',
  night: matrix('.25 .2 .05 0 0 .2 .35 .1 0 .02 .2 .3 .55 0 .1 0 0 0 1 0') + same('0 .05 .4 .8'),
  vapor: LUMA + curve('.18 1 .55', '.04 .25 .95', '.35 .75 1'),
  halftone: same('0 .1 .5 .9 1') + saturate(1.3),
  // Looks de cámaras y rollos (paso "Cámara y película")
  portra: curve('.06 .32 .64 .95', '.04 .29 .6 .9', '.06 .26 .52 .82') + saturate(0.95),
  velvia: saturate(1.7) + same('0 .06 .5 .94 1'),
  cinestill:
    '<feColorMatrix in="SourceGraphic" type="matrix" values=".85 0 0 0 0 0 .95 0 0 .01 0 0 1.15 0 .04 0 0 0 1 0" result="c"/>' +
    '<feComponentTransfer in="SourceGraphic" result="hi"><feFuncR type="linear" slope="4" intercept="-3"/><feFuncG type="linear" slope="4" intercept="-3"/><feFuncB type="linear" slope="4" intercept="-3"/></feComponentTransfer>' +
    '<feColorMatrix in="hi" type="matrix" values=".33 .33 .33 0 0 .04 .04 .04 0 0 0 0 0 0 0 0 0 0 1 0" result="red"/>' +
    '<feGaussianBlur in="red" stdDeviation="4" result="glow"/><feBlend in="c" in2="glow" mode="screen"/>',
  flash: same('.02 .22 .62 1 1') + matrix('1.04 0 0 0 0 0 1 0 0 0 0 0 .95 0 0 0 0 0 1 0') + saturate(1.15),
  cctv: LUMA + curve('.05 .8', '.1 .95', '.05 .8') + '<feGaussianBlur stdDeviation=".5"/>',
  // Duotonos con colores concretos (paso "Colores del duotono")
  'duo-azul-rosa': duo('#1b1464', '#ff4fa3'),
  'duo-violeta-naranja': duo('#3b1a6b', '#ffa23a'),
  'duo-verde-lima': duo('#0d3b2e', '#d4f25a'),
  'duo-rojo-crema': duo('#7a0f1c', '#f7ecd7'),
  'duo-azul-cian': duo('#0b1f4a', '#4fe3ff'),
  'duo-negro-amarillo': duo('#111111', '#ffe14a'),
  anaglyph:
    '<feColorMatrix in="SourceGraphic" type="matrix" values=".2126 .7152 .0722 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="r"/>' +
    '<feOffset in="r" dx="-4" result="r2"/>' +
    '<feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0 .2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 0 0 0 1 0" result="c"/>' +
    '<feOffset in="c" dx="4" result="c2"/><feBlend in="r2" in2="c2" mode="screen"/>',
  // Arreglos: cómo se ve la foto antes (dañada, movida, pixelada) y después (nítida)
  sharp: '<feConvolveMatrix order="3" kernelMatrix="0 -.5 0 -.5 3 -.5 0 -.5 0" preserveAlpha="true"/>' + saturate(1.08),
  shake: SHAKE,
  pixel:
    '<feFlood x="3" y="3" width="1" height="1"/><feComposite width="7" height="7"/><feTile result="grid"/>' +
    '<feComposite in="SourceGraphic" in2="grid" operator="in"/><feMorphology operator="dilate" radius="3.5"/>',
  faded: same('.22 .8') + saturate(0.5),
  // Paso del tiempo (paso "Época")
  aged: matrix('.39 .77 .19 0 0 .35 .69 .17 0 0 .27 .53 .13 0 0 0 0 0 1 0') + curve('.16 .92', '.12 .84', '.1 .7'),
  seventies: curve('.14 .46 .78 .97', '.09 .38 .7 .9', '.05 .25 .55 .74') + saturate(0.8),
  dag: LUMA + curve('.07 .5 .86', '.08 .53 .88', '.1 .57 .92'),
  // Efectos creativos
  selective:
    '<feColorMatrix in="SourceGraphic" type="saturate" values="0" result="bw"/>' +
    '<feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 3 -3.2 -.6 0 -.12" result="mask"/>' +
    '<feComposite in="SourceGraphic" in2="mask" operator="in" result="col"/>' +
    '<feMerge><feMergeNode in="bw"/><feMergeNode in="col"/></feMerge>',
  neon:
    LUMA +
    '<feGaussianBlur stdDeviation=".8"/>' +
    '<feConvolveMatrix order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" preserveAlpha="true" result="edge"/>' +
    '<feColorMatrix in="edge" type="matrix" values="3 0 0 0 0 .5 0 0 0 0 3 0 0 0 0 0 0 0 1 0" result="pink"/>' +
    '<feGaussianBlur in="pink" stdDeviation="2" result="glow"/>' +
    '<feComponentTransfer in="SourceGraphic" result="dark"><feFuncR type="linear" slope=".22"/><feFuncG type="linear" slope=".2"/><feFuncB type="linear" slope=".3"/></feComponentTransfer>' +
    '<feBlend in="glow" in2="dark" mode="screen" result="lit"/><feBlend in="pink" in2="lit" mode="screen"/>',
  double: LUMA + same('.12 .55 1 1'),
  // Pósters estilo trap (paso "Estilo del póster")
  trap: LUMA + curve('.04 .12 .6 1', '0 .03 .52 .97', '0 .03 .5 .95'),
  chrome: LUMA + curve('0 .7 .2 .85 .35 .95', '0 .74 .26 .9 .42 1', '.1 .88 .38 1 .55 1'),
  xerox: LUMA + '<feComponentTransfer><feFuncR type="discrete" tableValues=".08 .95"/><feFuncG type="discrete" tableValues=".07 .93"/><feFuncB type="discrete" tableValues=".06 .88"/></feComponentTransfer>',
  gold: duo('#0b0906', '#f4cf6b'),
};

/** Marcado listo para insertar dentro de un <svg>. */
export const FILTER_MARKUP = Object.entries(FILTERS)
  .map(([id, body]) => `<filter id="pf-${id}" color-interpolation-filters="sRGB" x="0" y="0" width="100%" height="100%">${body}</filter>`)
  .join('');
