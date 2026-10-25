import { isStepVisible } from '../build';
import type { Area, PromptSpec, SegmentRole, Selections, Step } from '../types';
import { suggestFor } from './autofill';

export interface Level {
  min: number;
  label: string;
  icon: string;
}

/** Rangos del "Poder del prompt", como niveles de un juego. */
export const LEVELS: Level[] = [
  { min: 0, label: 'Chispa', icon: '✨' },
  { min: 20, label: 'Boceto', icon: '✏️' },
  { min: 40, label: 'Buen pedido', icon: '👍' },
  { min: 60, label: 'Pro', icon: '🎯' },
  { min: 80, label: 'Maestro', icon: '🏆' },
  { min: 95, label: 'Leyenda', icon: '👑' },
];

export const levelOf = (score: number): Level => [...LEVELS].reverse().find((l) => score >= l.min) ?? LEVELS[0]!;

export interface PowerPart {
  role: SegmentRole;
  weight: number;
  /** El usuario lo eligió. */
  done: boolean;
  /** Lo completó el asistente. */
  auto: boolean;
}

export interface Power {
  /** 0 a 100. */
  score: number;
  level: Level;
  parts: PowerPart[];
  /** El paso que más sumaría ahora, con opciones que combinan con lo elegido. */
  next?: { step: Step; suggestions: string[] };
}

const has = (spec: PromptSpec, role: SegmentRole) => (role === 'text' ? spec.copy.length > 0 : spec.segments.some((s) => s.role === role));

/** Palabras del texto libre principal: "un gato" vale menos que "un gato naranja con bufanda verde". */
function subjectFactor(spec: PromptSpec): number {
  const words = spec.segments
    .filter((s) => s.role === 'subject' || (spec.mode === 'edit' && s.role === 'operation'))
    .map((s) => s.text.es)
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  if (spec.mode === 'edit') return 1;
  return words >= 6 ? 1 : words >= 3 ? 0.75 : words > 0 ? 0.5 : 0;
}

/**
 * Qué tan completo y preciso es el pedido. Cuenta los roles del prompt que pesan en el área
 * (lo que completa el asistente vale un poco menos que lo elegido a mano) y suma un extra por
 * subopciones y notas, que son las que vuelven único un prompt.
 */
export function scorePrompt(area: Area, userSpec: PromptSpec, fullSpec: PromptSpec, selections: Selections, advanced: boolean): Power {
  const weights = area.assistant?.weights ?? {};
  const visibleRoles = new Set(area.steps.filter((s) => isStepVisible(s, advanced, area, selections)).map((s) => s.role));
  const parts: PowerPart[] = [];
  for (const [role, weight] of Object.entries(weights) as [SegmentRole, number][]) {
    if (!weight || (!visibleRoles.has(role) && role !== 'quality')) continue;
    const done = has(userSpec, role);
    parts.push({ role, weight, done, auto: !done && has(fullSpec, role) });
  }
  const total = parts.reduce((n, p) => n + p.weight, 0) || 1;
  let got = 0;
  for (const p of parts) {
    const factor = p.role === 'subject' ? subjectFactor(fullSpec) : 1;
    if (p.done) got += p.weight * factor;
    else if (p.auto) got += p.weight * 0.6 * factor;
  }
  const extras = Object.entries(selections).filter(([k, v]) => k.split('/').length === 3 && (Array.isArray(v) ? v.length : typeof v === 'string' && v.trim())).length;
  const score = Math.min(100, Math.round((got / total) * 92 + Math.min(8, extras * 2)));

  let next: Power['next'];
  const missing = parts.filter((p) => !p.done).sort((a, b) => b.weight - a.weight);
  for (const p of missing) {
    const step = area.steps.find((s) => s.role === p.role && isStepVisible(s, advanced, area, selections) && s.type !== 'copy');
    if (!step) continue;
    next = { step, suggestions: suggestFor(area, step, selections, 3).map((x) => x.option.id) };
    break;
  }
  return { score, level: levelOf(score), parts, next };
}
