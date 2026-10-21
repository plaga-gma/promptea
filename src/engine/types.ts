/**
 * Tipos del motor de prompts.
 *
 * El motor es independiente de la interfaz y de la sección: recibe la definición
 * de un área (pasos y opciones) y las elecciones del usuario, arma una
 * especificación neutral (PromptSpec) y un adaptador la escribe para cada IA.
 */

/** Texto visible para el usuario. Hoy solo español; `en` queda listo para traducir la web. */
export interface LocalizedText {
  es: string;
  en?: string;
}

/** Fragmento que se inserta en el prompt. El prompt sale en inglés; `es` se usa solo si el usuario lo pide. */
export interface PromptText {
  en: string;
  es: string;
}

/**
 * Bloques de la anatomía de un prompt, en orden de prioridad.
 * Ver docs/01-ingenieria-de-prompts.md §2.
 */
export type SegmentRole =
  | 'operation' // edición: qué operación hacer (quitar, reemplazar…)
  | 'medium' // tipo de imagen o pieza
  | 'subject'
  | 'action'
  | 'setting'
  | 'composition'
  | 'camera'
  | 'lighting'
  | 'color'
  | 'style'
  | 'mood'
  | 'texture'
  | 'typography'
  | 'text'
  | 'layout'
  | 'background'
  | 'preserve' // edición: qué no tocar
  | 'intensity'
  | 'avoid'
  | 'format';

export const ROLE_ORDER: SegmentRole[] = [
  'operation',
  'medium',
  'subject',
  'action',
  'setting',
  'layout',
  'composition',
  'camera',
  'lighting',
  'color',
  'style',
  'mood',
  'texture',
  'typography',
  'text',
  'background',
  'preserve',
  'intensity',
  'avoid',
  'format',
];

/**
 * Capa que se suma sobre la foto de muestra en las demos de filtros.
 * `bokeh`, `tilt` y `motion` usan una copia desenfocada de la foto; el resto son capas de CSS.
 */
export type FilterOverlay =
  | 'vignette'
  | 'lomo'
  | 'grain'
  | 'scan'
  | 'bokeh'
  | 'tilt'
  | 'motion'
  | 'light-leak'
  | 'haze'
  | 'halftone'
  | 'paper'
  | 'canvas'
  | 'grunge'
  | 'streak'
  // Daños y paso del tiempo (foto antigua, restauración)
  | 'aged'
  | 'scratches'
  | 'stains'
  | 'tear'
  | 'date'
  // Efectos creativos
  | 'trap'
  | 'double';

/** Un filtro sobre la foto de muestra: CSS (o `url(#pf-…)`) más una capa opcional. */
export interface PhotoLook {
  css: string;
  overlay?: FilterOverlay;
}

/** Cómo se muestra el ejemplo visual de una opción. Ver src/components/demos. */
export type Demo =
  | { kind: 'swatch'; colors: string[] }
  | { kind: 'font'; family: string; weight?: number; sample?: string; upper?: boolean; italic?: boolean }
  | { kind: 'filter'; css: string; overlay?: FilterOverlay }
  /** Antes y después sobre la foto de muestra, partida al medio: para arreglos (restaurar, enfocar, ampliar…). */
  | { kind: 'compare'; before: PhotoLook; after: PhotoLook }
  /** El filtro elegido en el área (o uno de muestra) a una intensidad: 0 = la foto original, 1 = el filtro entero. */
  | { kind: 'strength'; value: number }
  | { kind: 'light'; bg: string; sphere: string; glow?: string }
  | { kind: 'texture'; name: string }
  | { kind: 'diagram'; name: string }
  | { kind: 'ratio'; w: number; h: number }
  | { kind: 'gradient'; colors: string[]; glyph?: string }
  /** Ejemplo con imagen real (public/demos/...). `fallback` se muestra mientras no exista la imagen. */
  | { kind: 'image'; src?: string; alt: string; fallback: string[] };

export interface Option {
  id: string;
  label: LocalizedText;
  /** Una línea que enseña qué es y cuándo usarlo. */
  hint?: LocalizedText;
  prompt: PromptText;
  demo?: Demo;
  /** Ids de opciones del mismo paso u otros con las que choca. */
  conflicts?: string[];
  /** Datos extra para el motor (relación de aspecto, términos a evitar, etc.). */
  meta?: OptionMeta;
}

export interface OptionMeta {
  ratio?: [number, number];
  /** Términos que el motor agrega a la lista de "evitar". */
  avoid?: string[];
  /** Sugiere activar --raw en Midjourney (resultados literales/fotográficos). */
  literal?: boolean;
  /** Pieza de diseño: relación de aspecto sugerida y uso declarado. */
  purpose?: string;
  /** Edición: la operación necesita una segunda imagen (montaje, referencia de estilo). */
  needsSecondImage?: boolean;
  /** Paso de texto libre: el usuario debe escribir qué cambiar o qué agregar. */
  needsTarget?: boolean;
  /** Ejemplo que se muestra en el paso de texto libre cuando se elige esta opción. */
  targetHint?: string;
  /** Términos que esta opción saca de la lista de "evitar" (por ejemplo, un mockup pedido a propósito). */
  allow?: string[];
  /** Diseño que se repite sin cortes (Midjourney usa --tile). */
  tile?: boolean;
}

export type StepType =
  /** Una opción. */
  | 'single'
  /** Varias opciones, hasta `max`. */
  | 'multi'
  /** Texto libre del usuario. */
  | 'text'
  /** Herramienta de color (paletas + armonías). */
  | 'color'
  /** Textos que deben aparecer en la pieza (titular, subtítulo, llamado a la acción). */
  | 'copy';

export interface CopyField {
  id: string;
  label: LocalizedText;
  placeholder: LocalizedText;
  /** Cómo se describe en el prompt, en inglés y español. */
  role: PromptText;
}

export interface Step {
  id: string;
  title: LocalizedText;
  /** Por qué importa este paso: se muestra para enseñar. */
  why: LocalizedText;
  role: SegmentRole;
  type: StepType;
  options?: Option[];
  max?: number;
  required?: boolean;
  /** 'advanced' oculta el paso en modo simple. */
  level?: 'basic' | 'advanced';
  placeholder?: LocalizedText;
  fields?: CopyField[];
  /** Cómo agrupar las opciones en la interfaz (por ejemplo, "Ilustración", "Fotografía"). */
  groups?: { id: string; label: LocalizedText; optionIds: string[] }[];
  /** Plantilla para unir varias opciones o el texto libre: `{value}`. */
  template?: PromptText;
  /** Mostrar el paso solo si en otro paso se eligió alguna de estas opciones. */
  showIf?: { step: string; in: string[] };
  /** Mostrar el paso solo si alguna opción elegida tiene esta marca en `meta`. */
  showIfMeta?: keyof OptionMeta;
}

/** Tipo de prompt que produce un área. */
export type AreaMode = 'generate' | 'edit' | 'design';

export interface Area {
  id: string;
  mode: AreaMode;
  title: LocalizedText;
  tagline: LocalizedText;
  description: LocalizedText;
  seo: { title: string; description: string };
  steps: Step[];
}

export interface Section {
  id: string;
  title: LocalizedText;
  tagline: LocalizedText;
  description: LocalizedText;
  seo: { title: string; description: string };
  areas: Area[];
}

/** Elecciones del usuario: por paso, una lista de ids, un texto o un mapa de campos. */
export type SelectionValue = string[] | string | Record<string, string>;
export type Selections = Record<string, SelectionValue>;

export interface ColorSelection {
  /** Colores HEX elegidos (paleta o armonía). */
  colors: string[];
  /** Descripción de la paleta en inglés y español (por ejemplo, "warm earth tones"). */
  description?: PromptText;
}

export interface Segment {
  role: SegmentRole;
  stepId: string;
  text: PromptText;
  /** Partes individuales (cada opción elegida), para adaptadores que trabajan con etiquetas. */
  parts: PromptText[];
}

export interface PromptSpec {
  mode: AreaMode;
  segments: Segment[];
  ratio?: [number, number];
  avoid: string[];
  colors: string[];
  literal: boolean;
  /** Textos literales a renderizar, en orden de jerarquía. */
  copy: { role: PromptText; value: string }[];
  purpose?: string;
  needsSecondImage: boolean;
  /** Patrón continuo: se repite sin cortes. */
  tile: boolean;
  /** Lo que alguna opción elegida pide no evitar (meta.allow), también en los negativos fijos de cada IA. */
  allowed: string[];
}

export type Lang = 'en' | 'es';

export interface AdapterOptions {
  lang: Lang;
  /** 0 = literal, 1 = equilibrado, 2 = libre. Se usa en Midjourney (--s) y en el tono del prompt. */
  creativity: 0 | 1 | 2;
}

export interface AdapterResult {
  prompt: string;
  /** Solo para IAs con campo negativo aparte. */
  negative?: string;
  /** Consejos para el usuario sobre cómo usar el prompt en esa IA. */
  notes: LocalizedText[];
}

export interface ModelAdapter {
  id: string;
  name: string;
  /** Modelo de referencia que se tuvo en cuenta (se revisa en docs/02-modelos-de-ia.md). */
  version: string;
  description: LocalizedText;
  url?: string;
  /** Si la IA acepta el prompt por URL (`{q}` se reemplaza por el prompt codificado). */
  urlWithPrompt?: string;
  supportsNegative: boolean;
  format(spec: PromptSpec, options: AdapterOptions): AdapterResult;
}
