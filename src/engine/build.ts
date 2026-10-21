import type {
  Area,
  Lang,
  Option,
  PromptSpec,
  PromptText,
  Segment,
  Selections,
  Step,
} from './types';
import { ROLE_ORDER } from './types';

export interface BuildOptions {
  /** En modo simple, los pasos avanzados no entran al prompt aunque tengan algo elegido. */
  advanced: boolean;
}

const AND: Record<Lang, string> = { en: 'and', es: 'y' };

/** "a, b and c" / "a, b y c". */
export function joinList(items: string[], lang: Lang): string {
  const clean = items.map((i) => i.trim()).filter(Boolean);
  if (clean.length <= 1) return clean[0] ?? '';
  return `${clean.slice(0, -1).join(', ')} ${AND[lang]} ${clean[clean.length - 1]}`;
}

function joinParts(parts: PromptText[]): PromptText {
  return {
    en: joinList(parts.map((p) => p.en), 'en'),
    es: joinList(parts.map((p) => p.es), 'es'),
  };
}

function applyTemplate(template: PromptText | undefined, value: PromptText): PromptText {
  if (!template) return value;
  return {
    en: template.en.replaceAll('{value}', value.en),
    es: template.es.replaceAll('{value}', value.es),
  };
}

function fillTarget(text: PromptText, target: string | undefined): PromptText {
  const t = target?.trim();
  return {
    en: text.en.replaceAll('{target}', t || 'the selected element'),
    es: text.es.replaceAll('{target}', t || 'el elemento indicado'),
  };
}

export function selectedOptions(step: Step, selections: Selections): Option[] {
  const value = selections[step.id];
  if (!step.options) return [];
  let ids: string[] = [];
  if (Array.isArray(value)) ids = value;
  else if (typeof value === 'string') ids = [value];
  else if (value && typeof value === 'object' && typeof value.palette === 'string') ids = [value.palette];
  return ids
    .map((id) => step.options!.find((o) => o.id === id))
    .filter((o): o is Option => Boolean(o));
}

/** Un paso entra al prompt (y se muestra) si corresponde al modo y a lo elegido en otros pasos. */
export function isStepVisible(step: Step, advanced: boolean, area?: Area, selections?: Selections): boolean {
  if (!advanced && step.level === 'advanced') return false;
  if (!selections) return true;
  if (step.showIf) {
    const v = selections[step.showIf.step];
    const ids = Array.isArray(v) ? v : typeof v === 'string' ? [v] : [];
    if (!ids.some((id) => step.showIf!.in.includes(id))) return false;
  }
  if (step.showIfMeta && area) {
    const flag = step.showIfMeta;
    const any = area.steps.some((s) => s !== step && selectedOptions(s, selections).some((o) => Boolean(o.meta?.[flag])));
    if (!any) return false;
  }
  return true;
}

/**
 * Convierte las elecciones del usuario en una especificación neutral.
 * No sabe nada de ninguna IA en particular: eso lo resuelven los adaptadores.
 */
export function buildSpec(area: Area, selections: Selections, options: BuildOptions): PromptSpec {
  const spec: PromptSpec = {
    mode: area.mode,
    segments: [],
    avoid: [],
    colors: [],
    literal: false,
    copy: [],
    needsSecondImage: false,
    tile: false,
    allowed: [],
  };
  const allowed = spec.allowed;

  // En edición, el texto "qué cambiar" se inyecta en la operación elegida.
  const targetStep = area.steps.find((s) => s.id === 'target');
  const targetValue = targetStep ? selections[targetStep.id] : undefined;
  const target = typeof targetValue === 'string' ? targetValue : undefined;

  for (const step of area.steps) {
    if (!isStepVisible(step, options.advanced, area, selections)) continue;
    const value = selections[step.id];
    let parts: PromptText[] = [];

    if (step.type === 'text') {
      if (step.id === 'target') continue; // ya usado dentro de la operación
      const text = typeof value === 'string' ? value.trim() : '';
      if (text) parts = [{ en: text, es: text }];
    } else if (step.type === 'copy') {
      const fields = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
      for (const field of step.fields ?? []) {
        const v = fields[field.id]?.trim();
        if (v) spec.copy.push({ role: field.role, value: v });
      }
      continue;
    } else if (step.type === 'color') {
      const record = value && typeof value === 'object' && !Array.isArray(value) ? value : undefined;
      const colors = (record?.colors ?? '')
        .split(',')
        .map((c) => c.trim())
        .filter((c) => /^#[0-9a-f]{6}$/i.test(c));
      spec.colors = colors;
      const chosen = selectedOptions(step, selections);
      if (chosen.length) parts = chosen.map((o) => o.prompt);
      else if (record?.harmony_en && record.harmony_es) parts = [{ en: record.harmony_en, es: record.harmony_es }];
      for (const o of chosen) collectMeta(o, spec, allowed);
    } else {
      const chosen = selectedOptions(step, selections);
      for (const o of chosen) collectMeta(o, spec, allowed);
      parts = chosen.map((o) => fillTarget(o.prompt, target));
    }

    if (!parts.length) continue;
    const segment: Segment = {
      role: step.role,
      stepId: step.id,
      parts,
      text: applyTemplate(step.template, joinParts(parts)),
    };
    spec.segments.push(segment);
  }

  spec.segments.sort((a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role));
  spec.avoid = [...new Set(spec.avoid)].filter((a) => !allowed.includes(a));
  // Un mockup es una foto de un ambiente: --tile la volvería un mosaico.
  if (allowed.includes('mockup')) spec.tile = false;
  // Si se pidió texto en la imagen, no tiene sentido evitar "texto".
  if (spec.copy.length) spec.avoid = spec.avoid.filter((a) => !/^(text|letters|lettering|words)$/i.test(a));
  return spec;
}

function collectMeta(option: Option, spec: PromptSpec, allowed: string[]) {
  const meta = option.meta;
  if (!meta) return;
  if (meta.allow) allowed.push(...meta.allow);
  if (meta.tile) spec.tile = true;
  if (meta.ratio) spec.ratio = meta.ratio;
  if (meta.avoid) spec.avoid.push(...meta.avoid);
  if (meta.literal) spec.literal = true;
  if (meta.purpose) spec.purpose = meta.purpose;
  if (meta.needsSecondImage) spec.needsSecondImage = true;
}

/** Devuelve los conflictos entre las opciones elegidas: pares [a, b] de etiquetas. */
export function findConflicts(area: Area, selections: Selections): [Option, Option][] {
  const chosen = area.steps.flatMap((s) => selectedOptions(s, selections));
  const byId = new Map(chosen.map((o) => [o.id, o]));
  const pairs: [Option, Option][] = [];
  const seen = new Set<string>();
  for (const o of chosen) {
    for (const c of o.conflicts ?? []) {
      const other = byId.get(c);
      const key = [o.id, c].sort().join('|');
      if (other && !seen.has(key)) {
        seen.add(key);
        pairs.push([o, other]);
      }
    }
  }
  return pairs;
}
