import type { Lang, ModelAdapter, PromptSpec, SegmentRole } from '../types';
import { roleParts } from './shared';

const BASE_NEGATIVE = ['blurry', 'low quality', 'deformed', 'bad anatomy', 'extra fingers', 'watermark', 'signature'];

function tags(spec: PromptSpec, role: SegmentRole, lang: Lang, weight?: number): string[] {
  return roleParts(spec, role, lang)
    .flatMap((p) => p.split(/,\s*/))
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t, i) => (weight && i === 0 ? `(${t}:${weight})` : t));
}

/** Stable Diffusion (SDXL / SD 3.5): etiquetas por comas, pesos en lo central y negativo aparte. */
export const stableDiffusion: ModelAdapter = {
  id: 'stable-diffusion',
  name: 'Stable Diffusion',
  version: 'SDXL / SD 3.5',
  description: { es: 'Modelos abiertos (ComfyUI, Forge, A1111). Funcionan con etiquetas y prompt negativo.' },
  supportsNegative: true,
  format(spec, { lang }) {
    const out = [
      ...tags(spec, 'operation', lang),
      ...tags(spec, 'medium', lang),
      ...tags(spec, 'subject', lang, 1.2),
      ...tags(spec, 'action', lang),
      ...tags(spec, 'setting', lang),
      ...tags(spec, 'style', lang, 1.1),
      ...tags(spec, 'layout', lang),
      ...tags(spec, 'composition', lang),
      ...tags(spec, 'camera', lang),
      ...tags(spec, 'lighting', lang),
      ...tags(spec, 'color', lang),
      ...spec.colors,
      ...tags(spec, 'mood', lang),
      ...tags(spec, 'texture', lang),
      ...tags(spec, 'typography', lang),
      ...spec.copy.map((c) => `text "${c.value}"`),
      ...tags(spec, 'background', lang),
      ...tags(spec, 'preserve', lang),
      lang === 'en' ? 'highly detailed' : 'muy detallado',
      // Si se pidió desenfoque a propósito (bokeh, tilt-shift), no pedir lo contrario.
      ...(spec.allowed.includes('blurry') ? [] : [lang === 'en' ? 'sharp focus' : 'foco nítido']),
    ];
    const negative = [...BASE_NEGATIVE.filter((n) => !spec.allowed.includes(n)), ...spec.avoid];
    if (!spec.copy.length) negative.push('text');
    const notes = [
      { es: 'Pegá el prompt en el campo positivo y el negativo en "Negative prompt".' },
      { es: 'Los números como (gato:1.2) suben la importancia de esa palabra.' },
    ];
    if (spec.copy.length) notes.push({ es: 'Stable Diffusion escribe mal los textos: conviene agregarlos después en un editor.' });
    if (spec.ratio) notes.push({ es: `Configurá el tamaño en la app con proporción ${spec.ratio[0]}:${spec.ratio[1]} (por ejemplo 832×1216 para vertical).` });
    if (spec.mode === 'edit') notes.push({ es: 'Para editar usá img2img o inpainting con tu imagen cargada.' });
    return { prompt: [...new Set(out)].join(', '), negative: [...new Set(negative)].join(', '), notes };
  },
};
