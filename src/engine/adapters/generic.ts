import type { ModelAdapter } from '../types';
import { bodySentences, editIntro, leadSentence, ratioWords } from './shared';

/**
 * Genérico: lenguaje natural sin ninguna sintaxis especial, para que funcione
 * en cualquier IA (de un modelo de difusión viejo a un chat multimodal).
 */
export const generic: ModelAdapter = {
  id: 'generico',
  name: 'Genérico',
  version: 'Cualquier IA',
  description: { es: 'Para cualquier IA que no esté en la lista. Lenguaje claro, sin códigos especiales.' },
  supportsNegative: false,
  format(spec, { lang }) {
    const parts = [editIntro(spec, lang), leadSentence(spec, lang), ...bodySentences(spec, lang)];
    if (spec.avoid.length) {
      const terms = spec.avoid.slice(0, 4).join(', ');
      parts.push(lang === 'en' ? `Avoid: ${terms}.` : `Evitá: ${terms}.`);
    }
    parts.push(ratioWords(spec.ratio, lang));
    return {
      prompt: parts.filter(Boolean).join(' '),
      notes: [
        { es: 'Pegalo tal cual en el chat o en el campo de texto de tu IA.' },
        { es: 'Si tu IA tiene un selector de formato o tamaño, elegí ahí la misma proporción.' },
      ],
    };
  },
};
