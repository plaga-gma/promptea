import type { ModelAdapter } from '../types';
import { bodySentences, editIntro, leadSentence, ratioWords } from './shared';

/** Gemini (Nano Banana): narrativa en positivo; en edición, verbo fuerte al inicio. */
export const gemini: ModelAdapter = {
  id: 'gemini',
  name: 'Gemini',
  version: 'Nano Banana 2 / Pro',
  description: { es: 'Generador de imágenes de Google (Nano Banana). Muy bueno editando fotos y con texto.' },
  url: 'https://gemini.google.com/app',
  supportsNegative: false,
  format(spec, { lang }) {
    const intro = spec.mode === 'edit' && spec.needsSecondImage ? editIntro(spec, lang) : '';
    const parts = [intro, leadSentence(spec, lang), ...bodySentences(spec, lang), ratioWords(spec.ratio, lang)];
    return {
      prompt: parts.filter(Boolean).join(' '),
      notes: [
        { es: 'Gemini entiende mejor lo que querés que lo que no querés: todo está descrito en positivo.' },
        { es: 'Podés seguir ajustando en el mismo chat con frases cortas ("hacé el fondo más cálido").' },
      ],
    };
  },
};
