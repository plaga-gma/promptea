import type { ModelAdapter } from '../types';
import { chatgpt } from './chatgpt';
import { flux } from './flux';
import { gemini } from './gemini';
import { generic } from './generic';
import { ideogram } from './ideogram';
import { meta } from './meta';
import { midjourney } from './midjourney';
import { stableDiffusion } from './stable-diffusion';

/** Orden del selector. Para sumar una IA: crear su adaptador y agregarlo acá. */
export const ADAPTERS: ModelAdapter[] = [generic, chatgpt, gemini, meta, midjourney, flux, ideogram, stableDiffusion];

export function getAdapter(id: string): ModelAdapter {
  return ADAPTERS.find((a) => a.id === id) ?? generic;
}
