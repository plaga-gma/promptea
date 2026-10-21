import type {
  Area,
  Detail,
  Lang,
  Option,
  PromptSpec,
  PromptText,
  Segment,
  SegmentRole,
  SelectionValue,
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

function fillTarget(text: PromptText, target: PromptText | undefined): PromptText {
  return {
    en: text.en.replaceAll('{target}', target?.en || 'the selected element'),
    es: text.es.replaceAll('{target}', target?.es || 'el elemento indicado'),
  };
}

/** Clave de una subopción dentro de `Selections`: `paso/opción/detalle`. */
export function detailKey(stepId: string, optionId: string, detailId: string): string {
  return `${stepId}/${optionId}/${detailId}`;
}

/** Clave de la nota libre de una opción dentro de `Selections`. */
export function noteKey(stepId: string, optionId: string): string {
  return `${stepId}/${optionId}/nota`;
}

/** Largo máximo de una nota. */
export const NOTE_MAX = 140;

/** La nota tal cual, en una línea y sin el punto final (va en medio de una oración). */
export function cleanNote(text: string | undefined): string {
  return (text ?? '').replace(/\s+/g, ' ').trim().slice(0, NOTE_MAX).replace(/[.;,\s]+$/, '');
}

export function noteOf(selections: Selections, stepId: string, optionId: string): string {
  const v = selections[noteKey(stepId, optionId)];
  return typeof v === 'string' ? cleanNote(v) : '';
}

/** Subopciones que se abren al elegir `option` en `step`: las del paso (salvo excepciones) y las propias. */
export function detailsOf(step: Step, option: Option): Detail[] {
  const shared = (step.details ?? []).filter((d) => !d.except?.includes(option.id));
  return [...shared, ...(option.details ?? [])];
}

function chosenDetail(step: Step, option: Option, detail: Detail, selections: Selections): Option[] {
  const v = selections[detailKey(step.id, option.id, detail.id)];
  const ids = Array.isArray(v) ? v : typeof v === 'string' ? [v] : [];
  return ids.map((id) => detail.options.find((o) => o.id === id)).filter((o): o is Option => Boolean(o));
}

/** Lo elegido en una subopción que completa el `{target}` (por ejemplo, un tipo de cielo). */
function targetFromDetails(step: Step, option: Option, selections: Selections): PromptText | undefined {
  const chosen = detailsOf(step, option)
    .filter((d) => d.fillsTarget)
    .flatMap((d) => chosenDetail(step, option, d, selections));
  return chosen.length ? joinParts(chosen.map((o) => o.prompt)) : undefined;
}

/** Une la subopción que completa el objetivo con lo que el usuario escribió. */
function mergeTarget(fromDetail: PromptText | undefined, text: string | undefined): PromptText | undefined {
  const t = text?.trim();
  if (!fromDetail) return t ? { en: t, es: t } : undefined;
  return t ? { en: `${fromDetail.en}, ${t}`, es: `${fromDetail.es}, ${t}` } : fromDetail;
}

/**
 * El fragmento de una opción elegida con sus subopciones y su nota:
 * `{target}` y `{d:<id>}` se reemplazan, el resto de las subopciones se suma con comas
 * y la nota del usuario va al final, tal cual (ver docs/04-decisiones.md, T15).
 */
export function refineOption(
  step: Step,
  option: Option,
  selections: Selections,
  target?: PromptText,
  metaSink?: Option[],
  split?: (role: SegmentRole, text: PromptText) => void,
): PromptText {
  let text = fillTarget(option.prompt, target);
  const extras: PromptText[] = [];
  for (const detail of detailsOf(step, option)) {
    const chosen = chosenDetail(step, option, detail, selections);
    metaSink?.push(...chosen);
    if (detail.fillsTarget) continue;
    const placeholder = `{d:${detail.id}}`;
    const value = chosen.length ? applyTemplate(detail.template, joinParts(chosen.map((o) => o.prompt))) : undefined;
    if (text.en.includes(placeholder) || text.es.includes(placeholder)) {
      const fill = value ?? detail.default ?? { en: '', es: '' };
      text = { en: text.en.replaceAll(placeholder, fill.en), es: text.es.replaceAll(placeholder, fill.es) };
    } else if (value && detail.role && split) split(detail.role, value);
    else if (value) extras.push(value);
  }
  const note = noteOf(selections, step.id, option.id);
  // El tipo de imagen va pegado al sujeto: su nota va después, junto al entorno.
  if (note && step.role === 'medium' && split) split('setting', { en: note, es: note });
  else if (note) extras.push({ en: note, es: note });
  // Un `{d:…}` sin subopción conocida no puede quedar a la vista.
  const tidy = (s: string) => s.replace(/\{d:[\w-]+\}/g, '').replace(/\s+,/g, ',').replace(/\s{2,}/g, ' ').trim();
  return {
    en: tidy([text.en, ...extras.map((x) => x.en)].join(', ')),
    es: tidy([text.es, ...extras.map((x) => x.es)].join(', ')),
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
    notes: [],
  };
  const allowed = spec.allowed;

  // En edición, el texto "qué cambiar" se inyecta en la operación elegida.
  const targetStep = area.steps.find((s) => s.id === 'target');
  const targetValue = targetStep ? selections[targetStep.id] : undefined;
  const targetText = typeof targetValue === 'string' ? targetValue : undefined;
  // Una subopción puede completar el objetivo (por ejemplo, "Tipo de cielo"): se busca en las opciones elegidas.
  const fromDetail = area.steps
    .filter((s) => isStepVisible(s, options.advanced, area, selections))
    .flatMap((s) => selectedOptions(s, selections).map((o) => targetFromDetails(s, o, selections)))
    .find(Boolean);
  const target = mergeTarget(fromDetail, targetText);

  const separate: Segment[] = [];
  for (const step of area.steps) {
    if (!isStepVisible(step, options.advanced, area, selections)) continue;
    const value = selections[step.id];
    // Subopciones que van en su propio bloque (ver Detail.role): al final de su rol, después de los pasos.
    const split = (role: SegmentRole, text: PromptText) => separate.push({ role, stepId: `${step.id}/detalle`, parts: [text], text });
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
      const sub: Option[] = [];
      if (chosen.length) parts = chosen.map((o) => refineOption(step, o, selections, target, sub, split));
      else if (record?.harmony_en && record.harmony_es) parts = [{ en: record.harmony_en, es: record.harmony_es }];
      for (const o of [...chosen, ...sub]) collectMeta(o, spec, allowed);
    } else {
      const chosen = selectedOptions(step, selections);
      const sub: Option[] = [];
      parts = chosen.map((o) => refineOption(step, o, selections, target, sub, split));
      for (const o of [...chosen, ...sub]) collectMeta(o, spec, allowed);
    }
    for (const o of selectedOptions(step, selections)) {
      const note = noteOf(selections, step.id, o.id);
      if (note) spec.notes.push(note);
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

  spec.segments.push(...separate);
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

/** El texto libre de "qué cambiar" es opcional si una subopción ya lo completa. */
export function targetFilled(area: Area, selections: Selections, advanced: boolean): boolean {
  return area.steps
    .filter((s) => isStepVisible(s, advanced, area, selections))
    .some((s) => selectedOptions(s, selections).some((o) => targetFromDetails(s, o, selections)));
}

/** Pasos obligatorios a la vista que todavía no tienen nada elegido. */
export function missingSteps(area: Area, selections: Selections, advanced: boolean): Step[] {
  const filled = targetFilled(area, selections, advanced);
  return area.steps.filter(
    (s) => s.required && isStepVisible(s, advanced, area, selections) && !hasValue(selections[s.id]) && !(s.id === 'target' && filled),
  );
}

export function hasValue(v: SelectionValue | undefined): boolean {
  if (v === undefined) return false;
  if (typeof v === 'string') return v.trim() !== '';
  if (Array.isArray(v)) return v.length > 0;
  return Object.values(v).some((x) => x?.trim());
}

/** Saca las subopciones y notas de opciones que ya no están elegidas en el paso. */
export function pruneDetails(selections: Selections, stepId: string, keep: string[]): Selections {
  const prefix = `${stepId}/`;
  const next: Selections = {};
  for (const [k, v] of Object.entries(selections)) {
    if (k.startsWith(prefix) && !keep.includes(k.slice(prefix.length).split('/')[0]!)) continue;
    next[k] = v;
  }
  return next;
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
