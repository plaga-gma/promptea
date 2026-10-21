import type { ModelAdapter } from '../types';
import { bodySentences, editIntro, leadSentence, ratioWords } from './shared';

/** FLUX.2 / Kontext: lenguaje natural, lo crítico primero, colores en HEX, sin negativos. */
export const flux: ModelAdapter = {
  id: 'flux',
  name: 'FLUX',
  version: 'FLUX.2 / Kontext',
  description: { es: 'Modelo de Black Forest Labs. Muy fiel a lo que pedís, acepta colores exactos en HEX.' },
  url: 'https://playground.bfl.ai/',
  supportsNegative: false,
  format(spec, { lang }) {
    const parts = [editIntro(spec, lang), leadSentence(spec, lang), ...bodySentences(spec, lang), ratioWords(spec.ratio, lang)];
    return {
      prompt: parts.filter(Boolean).join(' '),
      notes: [
        { es: 'FLUX no tiene campo negativo: lo que querías evitar está escrito en positivo.' },
        { es: 'Elegí la proporción también en el selector de tamaño de la app.' },
      ],
    };
  },
};
