import type { PromptText } from '../../../engine/types';

/**
 * Familias de opciones que combinan: cada opción de una familia combina con todas las demás.
 * Es más fácil de leer y mantener que una tabla de parejas.
 */
export function fromFamilies(families: string[][]): Record<string, string[]> {
  const out: Record<string, Set<string>> = {};
  for (const family of families) {
    for (const id of family) {
      out[id] ??= new Set();
      for (const other of family) if (other !== id) out[id]!.add(other);
    }
  }
  return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, [...v]]));
}

/** Atajo para frases en inglés y español. */
export const q = (en: string, es: string): PromptText => ({ en, es });

/**
 * Cómo se nombran las paletas. Van con la clave "color/…" porque las etiquetas de las paletas
 * ("Bosque", "Océano") casi siempre son el lugar de la imagen y no el color: solo cuentan estas frases.
 */
export const PALETAS_KW: Record<string, string[]> = {
  'color/pastel': ['pastel', 'pasteles', 'colores pastel', 'tonos pastel'],
  'color/tierra': ['tonos tierra', 'colores tierra', 'terroso', 'terrosos'],
  'color/neon': ['colores neon', 'colores fluo', 'fluo', 'fluor', 'fluorescente'],
  'color/monocromo': ['monocromatico', 'monocromatica', 'un solo color'],
  'color/blanco-negro': ['blanco y negro', 'byn', 'b n'],
  'color/vintage': ['colores vintage', 'colores retro', 'tonos vintage'],
  'color/retro70': ['colores setentosos', 'colores de los 70'],
  'color/lujo': ['dorado y negro', 'negro y dorado', 'colores de lujo'],
  'color/oceano': ['colores del mar', 'colores del oceano', 'tonos azules', 'azules'],
  'color/bosque': ['tonos de bosque', 'tonos verdes', 'verdes', 'verde bosque'],
  'color/atardecer': ['colores de atardecer', 'tonos de atardecer'],
  'color/vibrante': ['colores vivos', 'colores primarios', 'vibrante', 'colorido', 'colorida', 'muy colorido'],
  'color/corporativo': ['colores corporativos', 'azul corporativo'],
  'color/joya': ['tonos joya', 'colores joya'],
  'color/mediterraneo': ['mediterraneo', 'azul y blanco'],
  'color/tropical': ['colores tropicales', 'tropical'],
  'color/nordico': ['tonos nordicos', 'colores nordicos'],
  'color/otono-paleta': ['colores de otono', 'tonos otonales', 'colores otonales'],
  'color/caramelo': ['colores caramelo', 'colores dulces', 'colores de caramelo'],
  'color/cyberpunk-paleta': ['colores cyberpunk'],
  'color/cafe': ['colores cafe', 'tonos cafe', 'marron y crema', 'tonos marrones'],
  'color/gotico': ['colores oscuros', 'tonos oscuros'],
  'color/salvia': ['verde salvia', 'salvia'],
  'color/terracota': ['terracota'],
  'color/mocha': ['mocha', 'moka'],
  'color/azul-klein': ['azul klein', 'azul electrico'],
  'color/rosa-barbie': ['rosa barbie', 'barbie', 'rosa intenso', 'fucsia'],
  'color/desierto': ['colores del desierto', 'tonos arena'],
  'color/hielo': ['tonos helados', 'colores frios', 'celestes'],
  'color/rojo-mono': ['todo rojo', 'rojo monocromo'],
  'color/verde-acido': ['verde acido', 'verde lima'],
  'color/halloween': ['halloween', 'naranja y negro'],
  'color/navidad': ['navidad', 'navideno', 'navidena', 'rojo y verde'],
  'color/primavera-paleta': ['colores de primavera', 'colores primaverales'],
};
