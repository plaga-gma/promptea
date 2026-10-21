import type { ModelAdapter } from '../types';
import { bodySentences, leadSentence, spanishNotesTip } from './shared';

const STYLIZE = [50, 100, 400] as const;

/** Midjourney V8: descripción natural específica y parámetros al final. */
export const midjourney: ModelAdapter = {
  id: 'midjourney',
  name: 'Midjourney',
  version: 'V8',
  description: { es: 'Muy estético y artístico. Usa parámetros al final del prompt (--ar, --no, --s).' },
  url: 'https://www.midjourney.com/imagine',
  supportsNegative: true,
  format(spec, { lang, creativity }) {
    const text = [leadSentence(spec, lang), ...bodySentences(spec, lang, { skip: ['avoid', 'preserve'] })]
      .filter(Boolean)
      .join(' ')
      // Los parámetros no admiten "--" dentro del texto.
      .replaceAll('--', '-');
    const params: string[] = [];
    if (spec.ratio) params.push(`--ar ${spec.ratio[0]}:${spec.ratio[1]}`);
    if (spec.avoid.length) params.push(`--no ${spec.avoid.join(', ')}`);
    if (spec.literal || creativity === 0) params.push('--raw');
    if (spec.tile) params.push('--tile');
    if (STYLIZE[creativity] !== 100) params.push(`--s ${STYLIZE[creativity]}`);
    const notes = [
      { es: 'Los parámetros van al final: --ar es la proporción, --no lo que hay que evitar y --s cuánto "embellece" Midjourney.' },
    ];
    if (spec.copy.length) notes.push({ es: 'Si el texto sale ilegible, bajá la libertad creativa (usa --raw).' });
    if (spec.tile) notes.push({ es: '--tile hace que el diseño se repita sin cortes, como un papel tapiz.' });
    if (spec.mode === 'edit') {
      notes.push({ es: 'Midjourney no edita con solo texto: abrí tu imagen en su Editor y usá este prompt ahí.' });
    }
    notes.push(...spanishNotesTip(spec, 'Midjourney'));
    return { prompt: [text, ...params].join(' '), notes };
  },
};
