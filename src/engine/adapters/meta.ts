import type { ModelAdapter } from '../types';
import { bodySentences, editIntro, leadSentence, ratioWords } from './shared';

/** Meta AI (Muse Image): pedido conversacional directo, pensado para pegarlo desde el celular. */
export const meta: ModelAdapter = {
  id: 'meta',
  name: 'Meta AI',
  version: 'Muse Image',
  description: { es: 'La IA de WhatsApp, Instagram, Facebook y Messenger.' },
  url: 'https://www.meta.ai/',
  supportsNegative: false,
  format(spec, { lang }) {
    const en = lang === 'en';
    const opener =
      spec.mode === 'edit' ? editIntro(spec, lang) : en ? 'Create an image:' : 'Creá una imagen:';
    const parts = [opener, leadSentence(spec, lang), ...bodySentences(spec, lang), ratioWords(spec.ratio, lang)];
    return {
      prompt: parts.filter(Boolean).join(' '),
      notes: [
        { es: 'En WhatsApp, abrí el chat con Meta AI y pegá el prompt. Si es una edición, adjuntá la foto en el mismo mensaje.' },
        { es: 'Si te responde con texto en vez de imagen, empezá el mensaje con "Imagine".' },
      ],
    };
  },
};
