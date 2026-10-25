import type { Demo, Option, OptionMeta } from '../../../engine/types';

interface Extra {
  hint?: string;
  demo?: Demo;
  meta?: OptionMeta;
  conflicts?: string[];
}

/**
 * Para opciones que piden desenfoque a propósito (bokeh, tilt-shift, barrido): con `meta.allow`
 * el prompt deja de pedir "sin desenfoque" y "foco nítido" (Stable Diffusion los agrega por defecto).
 */
export const BLUR = ['blurry', 'out of focus'];

/** Atajo para declarar opciones del catálogo: id, nombre, fragmento en inglés y en español. */
export function o(id: string, label: string, en: string, es: string, extra: Extra = {}): Option {
  return {
    id,
    label: { es: label },
    prompt: { en, es },
    ...(extra.hint ? { hint: { es: extra.hint } } : {}),
    ...(extra.demo ? { demo: extra.demo } : {}),
    ...(extra.meta ? { meta: extra.meta } : {}),
    ...(extra.conflicts ? { conflicts: extra.conflicts } : {}),
  };
}

/**
 * Ejemplo con imagen real. Mientras `src` no exista (las imágenes de muestra están pendientes),
 * se muestra un degradé con los colores característicos del estilo.
 * `src` es relativo a public/, por ejemplo "demos/estilos/acuarela.webp".
 */
export function img(alt: string, fallback: string[], src?: string): Demo {
  return { kind: 'image', alt, fallback, ...(src ? { src } : {}) };
}

type Groups = NonNullable<import('../../../engine/types').Step['groups']>;

/**
 * Suma ids a categorías existentes y crea las que no existen (con su nombre en `labels`).
 * Sirve para agregar opciones nuevas sin reescribir las listas de categorías.
 */
export function mergeGroups(groups: Groups, extra: Record<string, string[]>, labels: Record<string, string> = {}): Groups {
  const out = groups.map((g) => ({ ...g, optionIds: [...g.optionIds, ...(extra[g.id] ?? [])] }));
  for (const [id, ids] of Object.entries(extra)) {
    if (out.some((g) => g.id === id)) continue;
    out.push({ id, label: { es: labels[id] ?? id }, optionIds: ids });
  }
  return out;
}
