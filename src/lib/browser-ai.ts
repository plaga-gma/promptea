/**
 * IA del navegador (mejora opcional). Chrome trae un traductor y un modelo de lenguaje propios
 * (Translator y LanguageModel, Chrome 138 en adelante para el traductor). Funcionan en la compu del
 * usuario: sin servidor, sin claves y sin costo. Si el navegador no los tiene, Promptea sigue igual
 * con su asistente de reglas. Ver docs/09-asistente-ia.md.
 *
 * Lo usamos para una sola cosa que las reglas no pueden: pasar al inglés lo que el usuario escribe
 * con sus palabras (sujeto, lugar, notas), porque las IAs de imagen entienden mejor el inglés.
 */

export type AiStatus = 'unsupported' | 'unavailable' | 'downloadable' | 'downloading' | 'available';

interface TranslatorLike {
  translate(text: string): Promise<string>;
}

interface TranslatorStatic {
  availability(o: { sourceLanguage: string; targetLanguage: string }): Promise<AiStatus>;
  create(o: {
    sourceLanguage: string;
    targetLanguage: string;
    monitor?: (m: EventTarget) => void;
  }): Promise<TranslatorLike>;
}

const api = (): TranslatorStatic | undefined =>
  typeof self !== 'undefined' ? (self as unknown as { Translator?: TranslatorStatic }).Translator : undefined;

const PAIR = { sourceLanguage: 'es', targetLanguage: 'en' };

export async function translatorStatus(): Promise<AiStatus> {
  const T = api();
  if (!T) return 'unsupported';
  try {
    return await T.availability(PAIR);
  } catch {
    return 'unavailable';
  }
}

let translator: Promise<TranslatorLike> | undefined;

/**
 * Crea el traductor. Si hace falta descargar el idioma, el navegador solo lo permite después de un
 * clic del usuario: por eso `start` se llama desde un botón la primera vez.
 */
export function startTranslator(onProgress?: (fraction: number) => void): Promise<TranslatorLike> | undefined {
  const T = api();
  if (!T) return undefined;
  translator ??= T.create({
    ...PAIR,
    monitor(m) {
      m.addEventListener('downloadprogress', (e) => onProgress?.((e as unknown as { loaded: number }).loaded));
    },
  }).catch((err) => {
    translator = undefined;
    throw err;
  });
  return translator;
}

const cache = new Map<string, string>();

/** Traduce un texto (con caché). Devuelve undefined si no se pudo. */
export async function toEnglish(text: string): Promise<string | undefined> {
  const clean = text.trim();
  if (!clean) return undefined;
  if (cache.has(clean)) return cache.get(clean);
  const t = await startTranslator()?.catch(() => undefined);
  if (!t) return undefined;
  try {
    const out = (await t.translate(clean)).trim();
    cache.set(clean, out);
    return out;
  } catch {
    return undefined;
  }
}

/** Si el texto parece estar ya en inglés, no hace falta traducirlo. */
export function looksSpanish(text: string): boolean {
  if (/[áéíóúñ¿¡]/i.test(text)) return true;
  return /\b(el|la|los|las|un|una|con|de|del|en|que|por|para|y|sobre|muy)\b/i.test(text);
}
