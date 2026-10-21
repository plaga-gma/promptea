import type { ModelAdapter } from '../types';
import { bodySentences, leadSentence } from './shared';

/** Ideogram: resumen primero, texto entre comillas cerca del sujeto, menos de 150 palabras. */
export const ideogram: ModelAdapter = {
  id: 'ideogram',
  name: 'Ideogram',
  version: '3.0 / 4.5',
  description: { es: 'El especialista en texto dentro de la imagen: ideal para flyers, pósters y logos.' },
  url: 'https://ideogram.ai/',
  supportsNegative: true,
  format(spec, { lang }) {
    // El texto y la tipografía suben justo después del resumen, que es lo que más pesa en Ideogram.
    const body = bodySentences(spec, lang, { skip: ['avoid'] });
    const textFirst = body.filter((s) => s.startsWith('Include the text') || s.startsWith('Incluí el texto'));
    const rest = body.filter((s) => !textFirst.includes(s));
    const prompt = [leadSentence(spec, lang), ...textFirst, ...rest].filter(Boolean).join(' ');
    const words = prompt.split(/\s+/).length;
    const notes = [{ es: 'Elegí la proporción y pegá el negativo en la configuración de la imagen (Image settings).' }];
    if (words > 150) notes.push({ es: `El prompt tiene ${words} palabras: en Ideogram 3.0 conviene quedarse debajo de 150. Probá sacar algún detalle.` });
    return { prompt, negative: spec.avoid.join(', ') || undefined, notes };
  },
};
