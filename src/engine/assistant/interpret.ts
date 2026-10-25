import { isStepVisible } from '../build';
import type { Area, Option, Selections, Step } from '../types';
import { labelVariants, normalize, trimFillers } from './text';

export interface IdeaMatch {
  stepId: string;
  optionId: string;
  /** Lo que escribió el usuario y disparó la elección. */
  phrase: string;
}

export interface IdeaResult {
  /** Solo lo que el asistente entendió: se suma a lo que ya estaba elegido. */
  selections: Selections;
  matches: IdeaMatch[];
  /** Textos libres que completó (sujeto, acción, lugar, objetivo de una edición). */
  texts: { key: string; value: string }[];
}

/**
 * Roles cuyas etiquetas son palabras demasiado comunes ("Ropa", "Fondo", "Sutil") o nombres de cosas
 * ("Bosque", "Océano" son paletas, pero casi siempre la gente habla del lugar): solo cuentan sus palabras clave.
 */
const KEYWORDS_ONLY = new Set(['preserve', 'intensity', 'avoid', 'color']);

/** Lugares frecuentes: "en un bosque" es el entorno, "en llamas" no. */
const PLACES = new Set(
  (
    'bosque selva jungla playa mar oceano montana montanas desierto ciudad calle callejon pueblo campo granja jardin parque plaza lago rio cascada isla cueva ' +
    'espacio luna marte planeta galaxia cielo nubes castillo palacio templo iglesia ruinas biblioteca cocina living sala habitacion cuarto dormitorio oficina estudio ' +
    'bar cafe cafeteria restaurante tienda mercado escuela aula laboratorio fabrica taller estacion tren subte metro aeropuerto puerto barco nave submarino ' +
    'escenario estadio cancha gimnasio hospital museo galeria azotea terraza balcon ventana puente tunel carretera ruta autopista nieve hielo volcan pradera ' +
    'valle colina acantilado arrecife fondo agua lluvia tormenta noche dia atardecer amanecer mundo universo tokio paris nueva york buenos aires londres'
  ).split(' '),
);
const PREPOSITIONS = new Set(['en', 'sobre', 'bajo', 'dentro', 'entre', 'frente', 'junto', 'cerca', 'arriba', 'debajo', 'encima', 'adentro']);
const ARTICLES = new Set(['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'mi', 'su', 'de', 'del', 'al']);

const isGerund = (w: string) => w.length > 4 && /(ando|iendo|yendo)$/.test(w);

interface Candidate {
  step: Step;
  stepIndex: number;
  option: Option;
  start: number;
  end: number;
}

/** Busca la frase (lista de palabras normalizadas) en `words` a partir de cualquier posición. Acepta plural en la última palabra. */
function* occurrences(words: string[], phrase: string[]) {
  outer: for (let i = 0; i + phrase.length <= words.length; i++) {
    for (let j = 0; j < phrase.length; j++) {
      const w = words[i + j]!;
      const p = phrase[j]!;
      const last = j === phrase.length - 1;
      if (w !== p && !(last && (w === `${p}s` || w === `${p}es`))) continue outer;
    }
    yield i;
  }
}

/**
 * Frases que nombran una opción: sus palabras clave y las variantes de su etiqueta.
 * Las claves pueden ser "paso/opción" cuando el mismo id existe en dos pasos (pastel como estilo y como paleta).
 * Una palabra clave "!" apaga la etiqueta (por ejemplo, "Retrato (85 mm)" no se elige al leer "un retrato").
 */
function phrasesFor(step: Step, option: Option, keywords: Record<string, string[]>): string[][] {
  const own = keywords[`${step.id}/${option.id}`] ?? keywords[option.id] ?? [];
  // Las palabras clave pueden ser cortas ("3d", "b n"); las etiquetas, no.
  const out = own.filter((k) => k !== '!').map(normalize).filter((p) => p.length > 1);
  if (!KEYWORDS_ONLY.has(step.role) && !own.includes('!')) out.push(...labelVariants(option.label.es));
  return [...new Set(out)].map((p) => p.split(' '));
}

/** Parte el texto sobrante en sujeto, acción ("corriendo…") y lugar ("en la playa…"). */
function splitScene(words: string[]): { subject: string[]; action: string[]; setting: string[] } {
  const norm = words.map(normalize);
  let g = norm.findIndex(isGerund);
  let p = -1;
  for (let i = 1; i < norm.length - 1; i++) {
    if (!PREPOSITIONS.has(norm[i]!)) continue;
    let k = i + 1;
    while (k < norm.length && (ARTICLES.has(norm[k]!) || norm[k] === 'de')) k++;
    const next = norm[k];
    if ((next && PLACES.has(next)) || (k > i + 1 && norm.length - k >= 1 && norm[i] === 'en')) {
      p = i;
      break;
    }
  }
  if (g === 0) g = -1;
  const cut = [g, p].filter((x) => x > 0);
  const first = cut.length ? Math.min(...cut) : words.length;
  const subject = words.slice(0, first);
  let action: string[] = [];
  let setting: string[] = [];
  if (g > 0) action = words.slice(g, p > g ? p : words.length);
  if (p > 0) setting = words.slice(p, g > p ? g : words.length);
  return { subject, action, setting };
}

/**
 * Lee una idea escrita con palabras comunes ("un gato astronauta en acuarela, con luz de atardecer,
 * para una historia de Instagram") y la convierte en elecciones del constructor.
 * Funciona con reglas y palabras clave: no necesita internet ni descargar nada.
 */
export function interpretIdea(area: Area, idea: string, current: Selections = {}, advanced = true): IdeaResult {
  const keywords = area.assistant?.keywords ?? {};
  const quotes: string[] = [];
  const text = idea.replace(/["“”«»]([^"“”«»]{1,80})["“”«»]/g, (_, q: string) => {
    quotes.push(q.trim());
    return ' , ';
  });
  const raw = text.split(/\s+/).filter(Boolean);
  const words = raw.map(normalize);

  const candidates: Candidate[] = [];
  area.steps.forEach((step, stepIndex) => {
    if (!step.options || step.type === 'text' || step.type === 'copy') return;
    // Los pasos del modo avanzado no se ven en el modo simple: sus palabras quedan para el texto libre.
    if (!advanced && step.level === 'advanced') return;
    for (const option of step.options) {
      for (const phrase of phrasesFor(step, option, keywords)) {
        for (const start of occurrences(words, phrase)) candidates.push({ step, stepIndex, option, start, end: start + phrase.length });
      }
    }
  });
  // Las frases más largas ganan ("luz de neón" antes que "neón"); a igual largo, el paso que va primero.
  candidates.sort((a, b) => b.end - b.start - (a.end - a.start) || a.stepIndex - b.stepIndex || a.start - b.start);

  const used = new Array<boolean>(words.length).fill(false);
  const chosen = new Map<string, string[]>();
  const matches: IdeaMatch[] = [];
  for (const c of candidates) {
    if (used.slice(c.start, c.end).some(Boolean)) continue;
    const ids = chosen.get(c.step.id) ?? [];
    if (ids.includes(c.option.id)) {
      used.fill(true, c.start, c.end);
      continue;
    }
    const cap = c.step.type === 'multi' ? (c.step.max ?? 4) : 1;
    if (ids.length >= cap) continue;
    chosen.set(c.step.id, [...ids, c.option.id]);
    used.fill(true, c.start, c.end);
    matches.push({ stepId: c.step.id, optionId: c.option.id, phrase: raw.slice(c.start, c.end).join(' ') });
  }

  const selections: Selections = {};
  for (const step of area.steps) {
    const ids = chosen.get(step.id);
    if (!ids) continue;
    if (step.type === 'color') {
      const o = step.options!.find((x) => x.id === ids[0]);
      const colors = o?.demo?.kind === 'swatch' ? o.demo.colors.join(',') : '';
      selections[step.id] = { palette: ids[0]!, colors };
    } else selections[step.id] = step.type === 'multi' ? ids : ids[0]!;
  }
  // Una elección que depende de otra (un estilo nuevo depende de "Cambiar el estilo") activa esa otra
  // si es la única que la habilita: "pasala a acuarela" elige la operación y el estilo.
  for (const step of area.steps) {
    if (selections[step.id] === undefined || !step.showIf || step.showIf.in.length !== 1) continue;
    const merged0 = { ...current, ...selections };
    if (isStepVisible(step, advanced, area, merged0)) continue;
    const parent = area.steps.find((s) => s.id === step.showIf!.step);
    const need = step.showIf.in[0]!;
    if (!parent?.options?.some((o) => o.id === need)) continue;
    const prev = merged0[parent.id];
    const ids = Array.isArray(prev) ? prev : typeof prev === 'string' ? [prev] : [];
    const cap = parent.type === 'multi' ? (parent.max ?? 4) : 1;
    if (ids.length >= cap && parent.type === 'multi') continue;
    selections[parent.id] = parent.type === 'multi' ? [...ids, need] : need;
    chosen.set(parent.id, parent.type === 'multi' ? [...ids, need] : [need]);
    matches.push({ stepId: parent.id, optionId: need, phrase: '' });
  }
  // Una elección que depende de otra que no se eligió (por ejemplo, colores de duotono sin duotono) no cuenta.
  const merged = { ...current, ...selections };
  for (const step of area.steps) {
    if (selections[step.id] !== undefined && !isStepVisible(step, advanced, area, merged)) {
      delete selections[step.id];
      for (let i = matches.length - 1; i >= 0; i--) if (matches[i]!.stepId === step.id) matches.splice(i, 1);
    }
  }

  // Lo que no se entendió como opción es el sujeto (y, si se puede, la acción y el lugar).
  const segments: string[][] = [];
  let run: string[] = [];
  raw.forEach((w, i) => {
    if (used[i] || w === ',') {
      if (run.length) segments.push(run);
      run = [];
    } else {
      run.push(w.replace(/[,;.]+$/, ''));
      // Una coma corta el tramo: "con plantas, que se lea…" son dos pedidos.
      if (/[,;.]$/.test(w)) {
        segments.push(run);
        run = [];
      }
    }
  });
  if (run.length) segments.push(run);
  const rest = segments.map((s) => trimFillers(s)).filter((s) => s.length).flat();

  const texts: { key: string; value: string }[] = [];
  const textStep = (role: string) => area.steps.find((s) => s.type === 'text' && s.role === role);
  const subjectStep = textStep('subject');
  const actionStep = textStep('action');
  const settingStep = textStep('setting');
  if (rest.length) {
    if (area.mode === 'edit') {
      // En edición, lo que sobra es el "qué": va al recuadro de la primera operación que lo pide.
      const ops = area.steps.find((s) => s.role === 'operation' && s.options);
      const id = ops && (chosen.get(ops.id) ?? []).find((oid) => ops.options!.find((o) => o.id === oid)?.meta?.needsTarget);
      // Solo el primer tramo: lo que viene después de una coma suele ser otro pedido ("…, que se lea la etiqueta").
      const target = segments.map((s) => trimFillers(s, false)).find((s) => s.length);
      if (ops && id && target) texts.push({ key: `${ops.id}/${id}/target`, value: target.join(' ') });
    } else if (subjectStep && actionStep && settingStep) {
      const { subject, action, setting } = splitScene(rest);
      if (subject.length) texts.push({ key: subjectStep.id, value: subject.join(' ') });
      else if (!action.length) texts.push({ key: subjectStep.id, value: rest.join(' ') });
      if (action.length) texts.push({ key: actionStep.id, value: action.join(' ') });
      if (setting.length) texts.push({ key: settingStep.id, value: setting.join(' ') });
    } else if (subjectStep) texts.push({ key: subjectStep.id, value: rest.join(' ') });
  }

  // Los textos entre comillas son textos de la pieza (titular, subtítulo…) o, si no hay dónde, van con el sujeto.
  if (quotes.length) {
    const copy = area.steps.find((s) => s.type === 'copy' && s.fields?.length && isStepVisible(s, advanced, area, merged));
    if (copy) {
      const fields: Record<string, string> = {};
      copy.fields!.forEach((f, i) => {
        if (quotes[i]) fields[f.id] = quotes[i]!;
      });
      selections[copy.id] = fields;
    } else if (subjectStep) {
      const said = quotes.map((q) => `"${q}"`).join(', ');
      const i = texts.findIndex((t) => t.key === subjectStep.id);
      if (i >= 0) texts[i] = { key: subjectStep.id, value: `${texts[i]!.value} con el texto ${said}` };
      else texts.push({ key: subjectStep.id, value: `el texto ${said}` });
    }
  }
  for (const t of texts) selections[t.key] = t.value;
  return { selections, matches, texts };
}

/**
 * Suma lo que entendió el asistente a lo que ya estaba elegido: en los pasos de varias opciones
 * agrega (sin pasarse del máximo); en los de una sola, reemplaza.
 */
export function mergeSelections(area: Area, current: Selections, extra: Selections): Selections {
  const next: Selections = { ...current };
  for (const [key, value] of Object.entries(extra)) {
    const step = area.steps.find((s) => s.id === key);
    const prev = next[key];
    if (step?.type === 'multi' && Array.isArray(value) && Array.isArray(prev)) {
      const all = [...prev, ...value.filter((v) => !prev.includes(v))];
      next[key] = all.slice(-(step.max ?? all.length));
    } else next[key] = value;
  }
  return next;
}
