import { joinList } from '../build';
import type { Lang, ModelAdapter, PromptSpec, SegmentRole } from '../types';
import { cap, copyList, colorsWithHex, editIntro, leadSentence, roleParts, roleText } from './shared';

const LABELS: Partial<Record<SegmentRole, [string, string]>> = {
  setting: ['Scene', 'Escena'],
  layout: ['Layout', 'Diagramación'],
  composition: ['Composition', 'Composición'],
  camera: ['Camera', 'Cámara'],
  lighting: ['Lighting', 'Iluminación'],
  style: ['Style', 'Estilo'],
  mood: ['Mood', 'Atmósfera'],
  texture: ['Finish', 'Acabado'],
  typography: ['Typography', 'Tipografía'],
  background: ['Background', 'Fondo'],
  intensity: ['Intensity', 'Intensidad'],
};

function sizeFor(ratio?: [number, number]): string {
  if (!ratio || ratio[0] === ratio[1]) return '1024x1024';
  return ratio[0] > ratio[1] ? '1536x1024' : '1024x1536';
}

function line(label: [string, string], value: string, lang: Lang) {
  return value ? `${label[lang === 'en' ? 0 : 1]}: ${cap(value)}` : '';
}

function list(spec: PromptSpec, role: SegmentRole, lang: Lang) {
  return joinList(roleParts(spec, role, lang), lang);
}

/** ChatGPT (GPT Image 2): segmentos etiquetados, uso declarado y restricciones explícitas. */
export const chatgpt: ModelAdapter = {
  id: 'chatgpt',
  name: 'ChatGPT',
  version: 'GPT Image 2',
  description: { es: 'Generador de imágenes de ChatGPT (OpenAI). Entiende instrucciones detalladas y texto.' },
  url: 'https://chatgpt.com/',
  urlWithPrompt: 'https://chatgpt.com/?q={q}',
  supportsNegative: false,
  format(spec, { lang }) {
    const en = lang === 'en';
    const lines: string[] = [];
    if (spec.mode === 'edit') {
      lines.push(editIntro(spec, lang));
      lines.push(line(['Change', 'Cambio'], roleText(spec, 'operation', lang), lang));
    } else {
      if (spec.purpose) lines.push(line(['Purpose', 'Uso'], spec.purpose, lang));
      lines.push(line(['Image', 'Imagen'], leadSentence(spec, lang).replace(/\.$/, ''), lang));
    }
    for (const role of Object.keys(LABELS) as SegmentRole[]) {
      if (role === 'setting' && spec.mode !== 'edit') continue; // ya está en la primera línea
      lines.push(line(LABELS[role]!, list(spec, role, lang), lang));
      if (role === 'lighting') lines.push(line(['Color palette', 'Paleta de color'], colorsWithHex(spec, lang), lang));
    }
    if (spec.copy.length) {
      lines.push(
        en
          ? `Text (render exactly as written, each one once): ${copyList(spec, lang)}`
          : `Texto (escribilo exactamente así, una sola vez cada uno): ${copyList(spec, lang)}`,
      );
    }
    const preserve = list(spec, 'preserve', lang);
    if (preserve) {
      lines.push(
        en
          ? `Keep everything else exactly the same, especially: ${preserve}`
          : `Mantené todo lo demás exactamente igual, en especial: ${preserve}`,
      );
    }
    const constraints = [
      ...spec.avoid.map((a) => (en ? `no ${a}` : `sin ${a}`)),
      en ? 'no watermark' : 'sin marca de agua',
    ];
    if (!spec.copy.length && spec.mode !== 'edit') constraints.push(en ? 'no extra text' : 'sin texto extra');
    lines.push(line(['Constraints', 'Restricciones'], [...new Set(constraints)].join(', '), lang));
    if (spec.ratio) {
      const [w, h] = spec.ratio;
      lines.push(line(['Format', 'Formato'], `${w}:${h} (${sizeFor(spec.ratio)})`, lang));
    }
    return {
      prompt: lines.filter(Boolean).join('\n'),
      notes: [
        { es: 'Pegalo en ChatGPT. Si no genera la imagen, empezá el mensaje con "Creá una imagen:".' },
        { es: 'Para ajustar, pedí un solo cambio por mensaje y repetí lo que debe mantenerse.' },
      ],
    };
  },
};
