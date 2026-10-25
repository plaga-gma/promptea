import { joinList } from '../build';
import type { Area, PromptSpec, PromptText, Selections } from '../types';
import { ROLE_ORDER } from '../types';
import { chosenIds } from './autofill';

/** Máximo de frases de calidad: más de esto diluye lo importante. */
const MAX_BOOSTERS = 6;

/**
 * Prompt largo y óptimo: suma un bloque de calidad con frases que los modelos actuales siguen bien
 * (texturas reales, jerarquía visual, coherencia de luz en una edición…), elegidas según lo pedido.
 * Las de cada opción van primero porque son las más específicas.
 */
export function enhanceSpec(area: Area, spec: PromptSpec, selections: Selections): PromptSpec {
  const data = area.assistant?.boosters;
  if (!data || (!spec.segments.length && !spec.copy.length)) return spec;
  const ids = chosenIds(area, selections);
  const seen = new Set<string>();
  const parts: PromptText[] = [];
  for (const p of [...ids.flatMap((id) => data.byOption[id] ?? []), ...data.base]) {
    if (seen.has(p.en)) continue;
    // Si ya se pidió desenfoque a propósito, no pedir nitidez en todo.
    if (spec.allowed.includes('blurry') && /sharp|crisp/i.test(p.en)) continue;
    seen.add(p.en);
    parts.push(p);
    if (parts.length >= MAX_BOOSTERS) break;
  }
  if (!parts.length) return spec;
  const segment = {
    role: 'quality' as const,
    stepId: 'asistente',
    parts,
    text: { en: joinList(parts.map((p) => p.en), 'en'), es: joinList(parts.map((p) => p.es), 'es') },
  };
  const segments = [...spec.segments.filter((s) => s.role !== 'quality'), segment].sort((a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role));
  return { ...spec, segments };
}
