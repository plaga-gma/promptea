import type { Section } from '../../engine/types';
import { diseno } from './areas/diseno';
import { edicion } from './areas/edicion';
import { generacion } from './areas/generacion';

export const imagenes: Section = {
  id: 'imagenes',
  title: { es: 'Imágenes' },
  tagline: { es: 'Prompts expertos para generar, editar y diseñar imágenes' },
  description: {
    es: 'Generá ilustraciones y fotos, editá las imágenes que ya tenés o diseñá logos y flyers. Vos elegís viendo ejemplos; Promptea escribe el prompt.',
  },
  seo: {
    title: 'Prompts para imágenes con IA: generar, editar y diseñar',
    description:
      'Generador de prompts para imágenes: ilustraciones, fotos, edición, logos, flyers y portadas. Para ChatGPT, Gemini, Meta AI, Midjourney, FLUX, Ideogram y Stable Diffusion.',
  },
  areas: [generacion, edicion, diseno],
};
