/**
 * Utilidades de color: armonías del círculo cromático y contraste WCAG.
 * Ver docs/03-diseno-grafico.md §4.
 */

import type { PromptText } from './types';

export type Harmony = 'monocromatica' | 'analoga' | 'complementaria' | 'complementaria-dividida' | 'triadica' | 'tetradica';

export const HARMONIES: { id: Harmony; label: string; hint: string; prompt: PromptText }[] = [
  { id: 'monocromatica', label: 'Monocromática', hint: 'Un solo color en varias intensidades: elegante y coherente.', prompt: { en: 'monochromatic color scheme', es: 'esquema de color monocromático' } },
  { id: 'analoga', label: 'Análoga', hint: 'Colores vecinos en el círculo: armónica y natural.', prompt: { en: 'analogous color scheme', es: 'esquema de colores análogos' } },
  { id: 'complementaria', label: 'Complementaria', hint: 'Colores opuestos: máximo contraste y energía.', prompt: { en: 'complementary color scheme', es: 'esquema de colores complementarios' } },
  { id: 'complementaria-dividida', label: 'Complementaria dividida', hint: 'Contraste fuerte pero más fácil de equilibrar.', prompt: { en: 'split-complementary color scheme', es: 'esquema complementario dividido' } },
  { id: 'triadica', label: 'Triádica', hint: 'Tres colores equidistantes: lúdica y equilibrada.', prompt: { en: 'triadic color scheme', es: 'esquema de color triádico' } },
  { id: 'tetradica', label: 'Tetrádica', hint: 'Cuatro colores: rica, pero difícil de equilibrar.', prompt: { en: 'tetradic color scheme', es: 'esquema de color tetrádico' } },
];

interface Hsl {
  h: number;
  s: number;
  l: number;
}

export function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('');
}

export function hexToHsl(hex: string): Hsl {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

export function hslToHex({ h, s, l }: Hsl): string {
  const hh = ((h % 360) + 360) % 360;
  const ss = Math.min(100, Math.max(0, s)) / 100;
  const ll = Math.min(100, Math.max(0, l)) / 100;
  const k = (n: number) => (n + hh / 30) % 12;
  const a = ss * Math.min(ll, 1 - ll);
  const f = (n: number) => ll - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return rgbToHex(f(0) * 255, f(8) * 255, f(4) * 255);
}

/** Paleta de 4 o 5 colores a partir de un color base y una armonía. */
export function harmonyPalette(base: string, harmony: Harmony): string[] {
  const c = hexToHsl(base);
  const at = (dh: number, dl = 0, ds = 0) => hslToHex({ h: c.h + dh, s: c.s + ds, l: c.l + dl });
  switch (harmony) {
    case 'monocromatica':
      return [hslToHex({ ...c, l: 15 }), hslToHex({ ...c, l: 32 }), base, hslToHex({ ...c, l: 70 }), hslToHex({ ...c, l: 92, s: c.s * 0.6 })];
    case 'analoga':
      return [at(-30), base, at(30), at(0, 30, -20)];
    case 'complementaria':
      return [base, at(0, -25), at(180), at(180, 30, -25)];
    case 'complementaria-dividida':
      return [base, at(150), at(210), at(0, 35, -30)];
    case 'triadica':
      return [base, at(120), at(240), at(0, 38, -35)];
    case 'tetradica':
      return [base, at(90), at(180), at(270)];
  }
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Relación de contraste WCAG entre dos colores (1 a 21). */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** El mejor par para texto dentro de una paleta (el de mayor contraste). */
export function bestTextPair(colors: string[]): { fg: string; bg: string; ratio: number } | undefined {
  let best: { fg: string; bg: string; ratio: number } | undefined;
  for (const bg of colors) {
    for (const fg of colors) {
      if (fg === bg) continue;
      const ratio = contrastRatio(fg, bg);
      if (!best || ratio > best.ratio) best = { fg, bg, ratio };
    }
  }
  return best;
}
