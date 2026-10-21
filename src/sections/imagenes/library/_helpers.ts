import type { Demo, Option, OptionMeta } from '../../../engine/types';

interface Extra {
  hint?: string;
  demo?: Demo;
  meta?: OptionMeta;
  conflicts?: string[];
}

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
