/**
 * Utilidades de texto del asistente: comparar frases sin importar mayúsculas, tildes ni signos.
 */

/** "¡Hora DORADA!" → "hora dorada". Conserva la ñ como n para que "montaña" y "montana" coincidan. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/**
 * Busca `phrase` como palabras enteras dentro de `text` (los dos ya normalizados).
 * Devuelve la posición en caracteres o -1. Acepta plurales simples ("gatos" encuentra "gato").
 */
export function findPhrase(text: string, phrase: string): number {
  if (!phrase) return -1;
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(^| )${escaped}(es|s)?(?= |$)`);
  const m = re.exec(text);
  return m ? m.index + m[1]!.length : -1;
}

/** Variantes de la etiqueta de una opción: "Pastel (tiza)" → ["pastel tiza", "pastel"]; "Chibi / kawaii" → ["chibi kawaii", "chibi", "kawaii"]. */
export function labelVariants(label: string): string[] {
  const out = new Set<string>();
  const full = normalize(label);
  if (full.length > 2) out.add(full);
  const noParen = normalize(label.replace(/\([^)]*\)/g, ''));
  if (noParen.length > 2) out.add(noParen);
  for (const part of label.split(/[/·]| o /)) {
    const n = normalize(part.replace(/\([^)]*\)/g, ''));
    if (n.length > 2) out.add(n);
  }
  return [...out];
}

/** Palabras vacías que se pueden borrar de los bordes de un texto sobrante. */
const FILLER = new Set([
  'y', 'e', 'con', 'de', 'del', 'en', 'el', 'la', 'los', 'las', 'un', 'una', 'estilo', 'luz', 'tipo', 'formato', 'para', 'que', 'sea',
  'quiero', 'quisiera', 'haceme', 'hace', 'hacer', 'crear', 'crea', 'creame', 'genera', 'generar', 'generame', 'dibuja', 'dibujame',
  'una', 'imagen', 'foto', 'de', 'a', 'al', 'colores', 'color', 'paleta', 'tono', 'tonos', 'look', 'efecto', 'como', 'muy', 'bien', 'por', 'favor', 'durante', 'mientras', 'algo', 'este', 'esta',
]);

const ARTICLES = new Set(['un', 'una', 'unos', 'unas', 'el', 'la', 'los', 'las']);
const LEADING_KEEP = new Set(['en', 'por', 'con']);

/** Limpia los conectores sueltos que quedan al principio y al final de un texto. */
export function trimFillers(words: string[], keepPlace = true): string[] {
  let a = 0;
  let b = words.length;
  while (a < b && FILLER.has(normalize(words[a]!))) {
    // "en su cocina" se queda entero: la preposición marca el lugar.
    if (keepPlace && LEADING_KEEP.has(normalize(words[a]!)) && b - a >= 3) break;
    a++;
  }
  while (b > a && FILLER.has(normalize(words[b - 1]!))) b--;
  // "…de un gato" → "un gato": el artículo pegado al sujeto se queda.
  if (a > 0 && a < b && ARTICLES.has(normalize(words[a - 1]!))) a--;
  return words.slice(a, b);
}
