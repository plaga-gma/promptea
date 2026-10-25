import { isStepVisible, selectedOptions } from '../../engine/build';
import { normalize } from '../../engine/assistant';
import type { Area, Demo, FilterOverlay, Option, Selections } from '../../engine/types';
import { MEDIUM_GLYPHS, OPERATION_GLYPHS, PIECE_GLYPHS, PLACES, SUBJECT_GLYPHS, type Place } from './glyphs';

/**
 * Vista previa: un resumen gráfico y simplificado del pedido, no la imagen final.
 * Este archivo traduce las elecciones a una "escena" (colores, íconos, posiciones);
 * Preview.tsx solo la dibuja. Así se puede probar sin navegador.
 */

export interface Tag {
  icon: string;
  label: string;
  stepId: string;
  /** Lo eligió el asistente. */
  auto: boolean;
}

export interface Sprite {
  glyph: string;
  /** Centro, en % del cuadro. */
  x: number;
  y: number;
  /** Alto, en % del alto del cuadro. */
  size: number;
}

export type Weather = 'rain' | 'snow' | 'fog' | 'storm' | 'leaves' | 'stars' | 'petals' | 'sparkles';
export type LightKind = 'sun' | 'moon' | 'neon' | 'studio' | 'fire' | 'rays' | 'none';

export interface Scene {
  mode: 'generate' | 'edit' | 'design';
  empty: boolean;
  ratio: [number, number];
  /** Fondo CSS del cielo o del fondo de la pieza. */
  sky: string;
  palette: string[];
  /** Suelo (color) y altura del horizonte en %; sin suelo el sujeto flota. */
  ground?: string;
  horizon: number;
  subject?: Sprite & { label: string; known: boolean };
  companion?: Sprite;
  props: Sprite[];
  light: { kind: LightKind; x: number; y: number; color: string; glow: string };
  weather: Weather[];
  /** Filtro CSS de toda la escena y su capa (viñeta, grano…). */
  filter: string;
  overlay?: FilterOverlay;
  texture?: string;
  /** Inclinación (ángulo holandés) y punto de vista. */
  tilt: number;
  view: 'eye' | 'low' | 'high';
  /** Clase de estilo para el sujeto: dibujado, pintado, 3D… */
  look: string;
  /** Palabra del clima de ánimo, para el brillo general. */
  mood?: { glyph: string; label: string };
  tags: Tag[];
  design?: DesignScene;
  edit?: EditScene;
}

export interface DesignScene {
  piece: string;
  glyph: string;
  layout: string;
  title: string;
  subtitle: string;
  cta: string;
  font?: { family: string; weight?: number; upper?: boolean; italic?: boolean };
  background: string;
  ink: string;
  accent: string;
  elements: string[];
  mockup?: string;
  checker: boolean;
}

export interface EditScene {
  ops: { id: string; glyph: string; label: string }[];
  /** Cómo queda la foto después (filtro y capa). */
  after: { css: string; overlay?: FilterOverlay };
  checker: boolean;
  blurBackground: boolean;
  newBackground?: string;
  /** 0 a 1. */
  strength: number;
  keep: string[];
  title?: string;
}

const DEFAULT_SKY = 'linear-gradient(180deg,#cfe8ff,#eef6ff 70%)';

/** Busca la primera palabra conocida de un texto: acepta plurales ("gatos") y diminutivos ("zorrito"). */
export function findGlyph(text: string, dict: Record<string, string>, skip = 0): { glyph: string; word: string } | undefined {
  const words = normalize(text).split(' ').filter(Boolean);
  let found = 0;
  for (let i = 0; i < words.length; i++) {
    const w = words[i]!;
    const two = i + 1 < words.length ? `${w}_${words[i + 1]}` : '';
    const candidates = [
      two,
      w,
      w.replace(/(es|s)$/, ''),
      w.replace(/(it|cit)(o|a)s?$/, '$2'),
      w.replace(/(it|cit)(o|a)s?$/, 'o'),
      w.replace(/(it|cit)(o|a)s?$/, 'a'),
    ];
    const hit = candidates.find((c) => c && dict[c] !== undefined);
    if (hit) {
      if (found++ === skip) return { glyph: dict[hit]!, word: hit };
    }
  }
  return undefined;
}

function findPlace(text: string): Place | undefined {
  const words = normalize(text).split(' ');
  for (const w of words) {
    const p = PLACES[w] ?? PLACES[w.replace(/(es|s)$/, '')];
    if (p) return p;
  }
  return undefined;
}

const firstColors = (d?: Demo): string[] => {
  if (!d) return [];
  if (d.kind === 'swatch' || d.kind === 'gradient') return d.colors;
  if (d.kind === 'image') return d.fallback;
  return [];
};

/** Las primeras opciones elegidas de un paso, solo si el paso está a la vista. */
function picked(area: Area, selections: Selections, advanced: boolean, stepId: string): Option[] {
  const step = area.steps.find((s) => s.id === stepId);
  if (!step || !isStepVisible(step, advanced, area, selections)) return [];
  return selectedOptions(step, selections);
}

const text = (selections: Selections, key: string) => (typeof selections[key] === 'string' ? (selections[key] as string).trim() : '');

/** Glifo que muestra una opción en las etiquetas. */
function glyphOf(o: Option, fallback: string): string {
  const d = o.demo;
  if (d?.kind === 'gradient' && d.glyph && d.glyph.length <= 4 && !/^\d/.test(d.glyph)) return d.glyph;
  return fallback;
}

const LIGHT_POS: Record<string, { kind: LightKind; x: number; y: number }> = {
  'hora-dorada': { kind: 'sun', x: 78, y: 58 },
  'hora-azul': { kind: 'moon', x: 80, y: 22 },
  mediodia: { kind: 'sun', x: 55, y: 10 },
  contraluz: { kind: 'sun', x: 50, y: 42 },
  luna: { kind: 'moon', x: 80, y: 16 },
  aurora: { kind: 'moon', x: 82, y: 14 },
  neon: { kind: 'neon', x: 15, y: 30 },
  'neon-dual': { kind: 'neon', x: 15, y: 30 },
  estudio: { kind: 'studio', x: 18, y: 18 },
  'tres-puntos': { kind: 'studio', x: 18, y: 18 },
  mariposa: { kind: 'studio', x: 50, y: 6 },
  rembrandt: { kind: 'studio', x: 15, y: 15 },
  'clave-alta': { kind: 'studio', x: 50, y: 10 },
  flash: { kind: 'studio', x: 50, y: 40 },
  aro: { kind: 'studio', x: 50, y: 35 },
  velas: { kind: 'fire', x: 25, y: 78 },
  fogata: { kind: 'fire', x: 30, y: 80 },
  linterna: { kind: 'fire', x: 30, y: 60 },
  volumetrica: { kind: 'rays', x: 20, y: 6 },
  ventana: { kind: 'rays', x: 10, y: 20 },
  persiana: { kind: 'rays', x: 10, y: 20 },
};

const SHOT_SIZE: Record<string, number> = {
  'plano-detalle': 95,
  'primer-plano': 78,
  'plano-medio': 60,
  'plano-americano': 52,
  'plano-entero': 44,
  'plano-general': 30,
  'gran-plano-general': 24,
};

const WEATHER: Record<string, Weather> = {
  lluvia: 'rain',
  'post-lluvia': 'rain',
  nieve: 'snow',
  invierno: 'snow',
  niebla: 'fog',
  'nublado-clima': 'fog',
  tormenta: 'storm',
  otono: 'leaves',
  primavera: 'petals',
  estrellas: 'stars',
  magica: 'sparkles',
  festiva: 'sparkles',
  bioluminiscente: 'sparkles',
};

/** Filtro y capa de un ejemplo de foto (filtros, cámaras, técnicas). */
function lookOf(options: Option[]): { css: string; overlay?: FilterOverlay } | undefined {
  for (const o of options) {
    const d = o.demo;
    if (d?.kind === 'filter') return { css: d.css, overlay: d.overlay };
    if (d?.kind === 'compare') return { css: d.after.css, overlay: d.after.overlay };
  }
  return undefined;
}

function ratioOf(options: Option[]): [number, number] | undefined {
  return options.find((o) => o.meta?.ratio)?.meta?.ratio;
}

export function buildScene(area: Area, selections: Selections, advanced: boolean, auto: Set<string> = new Set()): Scene {
  const pick = (id: string) => picked(area, selections, advanced, id);
  const tags: Tag[] = [];
  const tag = (stepId: string, o: Option, icon: string) =>
    tags.push({ icon: glyphOf(o, icon), label: o.label.es.replace(/\s*\(.*\)$/, ''), stepId, auto: auto.has(stepId) });
  /** Una etiqueta por opción elegida en cada paso. */
  const tagSteps = (stepIds: string[], icon: string) => {
    for (const id of stepIds) for (const o of pick(id)) tag(id, o, icon);
  };

  const mode = area.mode === 'edit' ? 'edit' : area.id === 'diseno' ? 'design' : 'generate';
  const palette = (() => {
    const v = selections.color;
    if (v && typeof v === 'object' && !Array.isArray(v) && typeof v.colors === 'string' && v.colors) return v.colors.split(',').filter(Boolean);
    return firstColors(pick('color')[0]?.demo);
  })();

  // Luz
  const lights = pick('iluminacion').length ? pick('iluminacion') : pick('nueva-luz');
  const mainLight = lights[0];
  const lightDemo = mainLight?.demo?.kind === 'light' ? mainLight.demo : undefined;
  const pos = (mainLight && LIGHT_POS[mainLight.id]) ?? { kind: lightDemo ? ('sun' as LightKind) : ('none' as LightKind), x: 78, y: 18 };
  tagSteps(['iluminacion', 'nueva-luz'], '💡');

  // Ánimo, estilo y época: también tiñen el cielo cuando no hay luz ni paleta.
  const moods = pick('atmosfera').concat(pick('personalidad'));
  const styles = pick('estilo').concat(pick('estilo-diseno'), pick('nuevo-estilo'));
  const moodColors = firstColors(moods[0]?.demo);
  const styleColors = firstColors(styles[0]?.demo);

  // Tipo de imagen o pieza
  const medium = pick('medio')[0] ?? pick('pieza')[0];
  if (medium) tag(pick('medio')[0] ? 'medio' : 'pieza', medium, MEDIUM_GLYPHS[medium.id] ?? PIECE_GLYPHS[medium.id] ?? '🖼️');
  tagSteps(['estilo', 'estilo-diseno', 'nuevo-estilo'], '🎨');
  tagSteps(['atmosfera', 'personalidad'], '💫');

  // Formato
  const format = pick('formato')[0];
  const ratio = ratioOf(pick('formato')) ?? ratioOf(pick('pieza')) ?? (mode === 'edit' ? [4, 3] : [4, 5]);
  if (format) tag('formato', format, '📐');
  tagSteps(['color'], '🎨');

  // Filtro, cámara, técnica y textura
  const filterOpts = pick('filtro').concat(pick('camara'), pick('tecnica'), pick('lente').filter((o) => o.demo?.kind === 'filter'), pick('epoca').filter((o) => o.demo?.kind === 'filter'));
  const look = lookOf(filterOpts);
  tagSteps(['filtro'], '🎞️');
  tagSteps(['camara', 'lente', 'tecnica'], '📷');
  const textures = pick('textura');
  const textureName = textures.map((o) => (o.demo?.kind === 'texture' ? o.demo.name : undefined)).find(Boolean);
  const textureLook = lookOf(textures);
  tagSteps(['textura', 'material'], '🧶');

  // Cámara: plano, ángulo, composición
  const shot = pick('plano')[0];
  const angle = pick('angulo')[0];
  const comps = pick('composicion');
  tagSteps(['plano'], '🎬');
  tagSteps(['angulo'], '🎥');
  tagSteps(['composicion'], '📏');

  // Clima y época
  const weather = new Set<Weather>();
  tagSteps(['clima'], '🌦️');
  for (const o of pick('clima').concat(pick('tecnica'), moods, lights)) {
    const w = WEATHER[o.id];
    if (w) weather.add(w);
  }
  tagSteps(['epoca'], '⏳');
  tagSteps(['expresion'], '🙂');
  tagSteps(['vestuario'], '👕');

  // Sujeto y lugar
  const subjectText = text(selections, 'sujeto') || text(selections, 'tema');
  const settingText = [text(selections, 'entorno'), text(selections, 'accion')].join(' ');
  const found = subjectText ? findGlyph(subjectText, SUBJECT_GLYPHS) : undefined;
  const second = subjectText ? findGlyph(subjectText, SUBJECT_GLYPHS, 1) : undefined;
  const place = findPlace(settingText) ?? findPlace(subjectText);
  const night = Boolean(place?.night) || pos.kind === 'moon' || pos.kind === 'neon' || moods.some((m) => ['misteriosa', 'aterradora'].includes(m.id));

  const sky = (() => {
    if (lightDemo) return lightDemo.bg;
    if (night) return 'linear-gradient(180deg,#0b1026,#1d2b53 70%)';
    const c = palette.length >= 2 ? palette : moodColors.length >= 2 ? moodColors : styleColors;
    if (c.length >= 2) return `linear-gradient(180deg, ${c[0]}, ${c[1]})`;
    return DEFAULT_SKY;
  })();

  const shotSize = shot ? SHOT_SIZE[shot.id] ?? 44 : 44;
  const compIds = comps.map((c) => c.id);
  const x = compIds.includes('tercios') || compIds.includes('aurea') ? 34 : compIds.includes('espacio-negativo') ? 28 : 50;
  const view: Scene['view'] = angle && ['contrapicado', 'gusano'].includes(angle.id) ? 'low' : angle && ['picado', 'cenital', 'aerea'].includes(angle.id) ? 'high' : 'eye';
  const horizon = place?.float ? 100 : view === 'low' ? 82 : view === 'high' ? 40 : compIds.includes('horizonte-bajo') ? 80 : 66;
  const size = compIds.includes('espacio-negativo') ? shotSize * 0.75 : shotSize;
  const subjectY = Math.min(horizon, 92) - size / 2 + (shotSize > 70 ? size * 0.25 : 2);

  const scene: Scene = {
    mode,
    empty: !tags.length && !subjectText,
    ratio,
    sky,
    palette,
    ground: place?.float ? undefined : place?.ground ?? (palette[2] ? palette[2] : night ? '#1b2340' : '#9bc59d'),
    horizon,
    subject: found || subjectText ? { glyph: found?.glyph ?? '❔', label: subjectText, known: Boolean(found), x, y: subjectY, size } : undefined,
    companion: second ? { glyph: second.glyph, x: x + size * 0.45, y: subjectY + size * 0.2, size: size * 0.45 } : undefined,
    props: (place?.props ?? []).slice(0, 3).map((g, i) => ({ glyph: g, x: [82, 14, 66][i]!, y: horizon - 9 - i * 3, size: 16 - i * 3 })),
    light: { kind: pos.kind, x: pos.x, y: pos.y, color: lightDemo?.sphere ?? 'radial-gradient(circle,#fff6d5,#ffcf56)', glow: lightDemo?.glow ?? '0 0 40px #ffd16688' },
    weather: [...weather],
    filter: [look?.css, textureLook?.css].filter(Boolean).join(' ') || 'none',
    overlay: look?.overlay ?? textureLook?.overlay,
    texture: textureName,
    tilt: angle?.id === 'holandes' || compIds.includes('diagonal') ? -8 : 0,
    view,
    look: medium ? `look-${medium.id}` : styles[0] ? `look-${styles[0].id}` : '',
    mood: moods[0] ? { glyph: glyphOf(moods[0], '💫'), label: moods[0].label.es } : undefined,
    tags,
  };

  if (mode === 'design') scene.design = designScene(selections, palette, pick, scene, tagSteps);
  if (mode === 'edit') {
    tagSteps(['duo-colores', 'estilo-poster'], '🎨');
    tagSteps(['preservar'], '🛡️');
    tagSteps(['intensidad'], '🎚️');
    scene.edit = editScene(selections, pick, tags);
  }
  scene.empty = !scene.tags.length && !subjectText && !scene.edit?.ops.length;
  return scene;
}

function designScene(
  selections: Selections,
  palette: string[],
  pick: (id: string) => Option[],
  scene: Scene,
  tagSteps: (stepIds: string[], icon: string) => void,
): DesignScene {
  const piece = pick('pieza')[0];
  const copy = (selections.textos && typeof selections.textos === 'object' && !Array.isArray(selections.textos) ? selections.textos : {}) as Record<string, string>;
  const font = pick('tipografia').map((o) => (o.demo?.kind === 'font' ? o.demo : undefined)).find(Boolean);
  tagSteps(['tipografia'], '🔤');
  tagSteps(['diagramacion', 'tipo-logo'], '📐');
  tagSteps(['fondo'], '🧱');
  tagSteps(['presentacion'], '🖼️');
  const bg = pick('fondo')[0];
  const layout = pick('diagramacion')[0]?.id ?? 'l-centrado';
  const elements = pick('elementos').map((o) => o.id);
  tagSteps(['elementos'], '🔶');
  const mock = pick('presentacion')[0];
  const colors = palette.length ? palette : firstColors(pick('estilo-diseno')[0]?.demo).concat(firstColors(pick('personalidad')[0]?.demo));
  const c = colors.length ? colors : ['#6d4aff', '#ff6b5b', '#ffffff', '#1d1b2f'];
  const dark = bg?.id === 'f-oscuro';
  const background = (() => {
    if (!bg) return colors.length >= 3 ? c[2]! : '#ffffff';
    if (bg.id === 'f-blanco') return '#ffffff';
    if (bg.id === 'f-oscuro') return '#111118';
    if (bg.id === 'f-degradado') return `linear-gradient(135deg, ${c[0]}, ${c[1] ?? c[0]})`;
    if (bg.id === 'f-color') return c[0]!;
    if (bg.id === 'f-foto') return scene.sky;
    return '#f4efe6';
  })();
  const subject = text(selections, 'tema');
  const fallbackGlyph = piece ? glyphOf(piece, PIECE_GLYPHS[piece.id] ?? '🖼️') : '🖼️';
  return {
    piece: piece?.id ?? 'post',
    glyph: findGlyph(subject, SUBJECT_GLYPHS)?.glyph ?? fallbackGlyph,
    layout,
    title: copy.titular || (piece?.id === 'logo' ? 'MARCA' : subject ? subject.slice(0, 28) : 'TITULAR'),
    subtitle: copy.subtitulo ?? '',
    cta: copy.cta ?? '',
    font: font ? { family: font.family, weight: font.weight, upper: font.upper, italic: font.italic } : undefined,
    background,
    ink: dark ? '#ffffff' : c.find((x) => x !== background && x.toLowerCase() !== '#ffffff') ?? '#1d1b2f',
    accent: c[1] ?? c[0]!,
    elements,
    mockup: mock && mock.id !== 'm-plano' ? glyphOf(mock, '🖼️') : undefined,
    checker: bg?.id === 'f-transparente',
  };
}

function editScene(selections: Selections, pick: (id: string) => Option[], tags: Tag[]): EditScene {
  const ops = pick('operacion');
  const after =
    lookOf(pick('filtro')) ??
    lookOf(pick('epoca')) ??
    lookOf(pick('estilo-poster')) ??
    lookOf(pick('duo-colores')) ??
    lookOf(ops.filter((o) => o.demo?.kind === 'filter' || o.demo?.kind === 'compare')) ??
    (ops.some((o) => o.id === 'estilo') ? { css: 'url(#pf-poster) saturate(1.3)' } : { css: 'none' });
  const intensity = pick('intensidad')[0];
  const strength = intensity?.demo?.kind === 'strength' ? intensity.demo.value : 0.75;
  const keep = pick('preservar').map((o) => o.label.es);
  for (const o of ops) tags.unshift({ icon: OPERATION_GLYPHS[o.id] ?? '🛠️', label: o.label.es, stepId: 'operacion', auto: false });
  const ids = ops.map((o) => o.id);
  const target = (id: string) => text(selections, `operacion/${id}/target`);
  const bgText = target('cambiar-fondo') || target('cambiar-cielo') || target('producto-escena');
  const place = bgText ? findPlace(bgText) : undefined;
  const copy = (k: string) => {
    const v = selections[k];
    return v && typeof v === 'object' && !Array.isArray(v) ? Object.values(v as Record<string, string>).find(Boolean) : undefined;
  };
  return {
    ops: ops.map((o) => ({ id: o.id, glyph: OPERATION_GLYPHS[o.id] ?? '🛠️', label: o.label.es })),
    after,
    checker: ids.includes('quitar-fondo') || ids.includes('sticker'),
    blurBackground: ids.includes('desenfocar-fondo') || ids.includes('retrato-pro'),
    newBackground: bgText ? place?.props[0] ?? findGlyph(bgText, SUBJECT_GLYPHS)?.glyph ?? '🖼️' : undefined,
    strength,
    keep,
    title: copy('textos-poster') ?? copy('textos'),
  };
}
