import { hasValue, isStepVisible, selectedOptions } from '../build';
import type { Area, Option, Selections, Step } from '../types';

export interface AutoPick {
  stepId: string;
  optionId: string;
  /** La opción elegida por el usuario que llevó a esta sugerencia (si la hay). */
  because?: string;
}

/** Ids elegidos en todos los pasos (con las elecciones que se pasen). */
export function chosenIds(area: Area, selections: Selections): string[] {
  return area.steps.flatMap((s) => selectedOptions(s, selections).map((o) => o.id));
}

/** Cuánto combina `option` con lo ya elegido, según las parejas del asistente (en los dos sentidos). */
function affinity(area: Area, option: Option, chosen: string[]): { score: number; because?: string } {
  const pairs = area.assistant?.pairs ?? {};
  let score = 0;
  let because: string | undefined;
  for (const id of chosen) {
    if (pairs[id]?.includes(option.id) || pairs[option.id]?.includes(id)) {
      score++;
      because ??= id;
    }
  }
  return { score, because };
}

/** Las opciones de un paso ordenadas por cuánto combinan con lo elegido. Las que no combinan con nada quedan afuera. */
export function suggestFor(area: Area, step: Step, selections: Selections, limit = 3): { option: Option; because?: string }[] {
  const chosen = chosenIds(area, selections);
  const already = new Set(selectedOptions(step, selections).map((o) => o.id));
  return (step.options ?? [])
    .filter((o) => !already.has(o.id) && !o.conflicts?.some((c) => chosen.includes(c)))
    .map((option) => ({ option, ...affinity(area, option, chosen) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ option, because }) => ({ option, because }));
}

/**
 * Completa por detrás los pasos que el usuario dejó vacíos, con opciones que combinan con lo que sí eligió
 * (o una opción segura si nada decide). No toca lo elegido: devuelve solo lo agregado.
 * `skip` son pasos que el usuario no quiere que se completen.
 */
export function autofill(area: Area, selections: Selections, advanced: boolean, skip: string[] = []): { selections: Selections; picks: AutoPick[] } {
  const rules = area.assistant?.autofill ?? [];
  const out: Selections = {};
  const picks: AutoPick[] = [];
  // Sin nada elegido no hay de qué partir: el prompt sería genérico.
  if (!Object.values(selections).some(hasValue)) return { selections: out, picks };
  for (const rule of rules) {
    if (skip.includes(rule.step)) continue;
    const step = area.steps.find((s) => s.id === rule.step);
    if (!step?.options) continue;
    const merged = { ...selections, ...out };
    if (!isStepVisible(step, advanced, area, merged) || hasValue(merged[step.id])) continue;
    const best = suggestFor(area, step, merged, 1)[0];
    const option = best?.option ?? step.options.find((o) => o.id === rule.fallback);
    if (!option) continue;
    const chosen = chosenIds(area, merged);
    if (option.conflicts?.some((c) => chosen.includes(c))) continue;
    if (step.type === 'color') {
      const colors = option.demo?.kind === 'swatch' ? option.demo.colors.join(',') : '';
      out[step.id] = { palette: option.id, colors };
    } else out[step.id] = step.type === 'multi' ? [option.id] : option.id;
    picks.push({ stepId: step.id, optionId: option.id, because: best?.because });
  }
  return { selections: out, picks };
}
