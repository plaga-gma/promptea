import { joinList } from '../build';
import type { Lang, PromptSpec, PromptText, Segment, SegmentRole } from '../types';

export function cap(s: string): string {
  const t = s.trim();
  return t ? t[0].toLocaleUpperCase() + t.slice(1) : t;
}

export function sentence(s: string): string {
  const t = cap(s);
  if (!t) return '';
  return /[.!?"]$/.test(t) ? t : `${t}.`;
}

export function segmentsOf(spec: PromptSpec, role: SegmentRole): Segment[] {
  return spec.segments.filter((s) => s.role === role);
}

/** Texto ya armado con la plantilla del paso (para prompts en lenguaje natural). */
export function roleText(spec: PromptSpec, role: SegmentRole, lang: Lang, separator = '; '): string {
  return segmentsOf(spec, role)
    .map((s) => s.text[lang])
    .join(separator);
}

/** Solo las partes elegidas, sin plantilla (para prompts etiquetados o por etiquetas). */
export function roleParts(spec: PromptSpec, role: SegmentRole, lang: Lang): string[] {
  return segmentsOf(spec, role).flatMap((s) => s.parts.map((p) => p[lang]));
}

export function has(spec: PromptSpec, role: SegmentRole): boolean {
  return spec.segments.some((s) => s.role === role);
}

const CONNECTOR: Record<'generate' | 'design', PromptText> = {
  generate: { en: 'of', es: 'de' },
  design: { en: 'for', es: 'para' },
};

/** Primera oración: tipo + sujeto + acción + entorno. En edición, la operación. */
export function leadSentence(spec: PromptSpec, lang: Lang): string {
  if (spec.mode === 'edit') return sentence(roleText(spec, 'operation', lang));
  const medium = roleText(spec, 'medium', lang);
  const subject = roleText(spec, 'subject', lang);
  let lead = medium && subject ? `${medium} ${CONNECTOR[spec.mode][lang]} ${subject}` : medium || subject;
  // Dentro de la primera oración, los pasos se encadenan con comas: "…, leyendo, con una sonrisa, en un bosque, ambientado en los años 20".
  const action = roleText(spec, 'action', lang, ', ');
  const setting = roleText(spec, 'setting', lang, ', ');
  if (action) lead += `, ${action}`;
  if (setting) lead += `, ${setting}`;
  return sentence(lead);
}

export function ratioWords(ratio: [number, number] | undefined, lang: Lang): string {
  if (!ratio) return '';
  const [w, h] = ratio;
  const label = `${w}:${h}`;
  if (lang === 'es') {
    const o = w === h ? 'cuadrado' : w > h ? 'horizontal' : 'vertical';
    return `Formato ${o} ${label}.`;
  }
  const o = w === h ? 'Square' : w > h ? 'Horizontal' : 'Vertical';
  return `${o} ${label} aspect ratio.`;
}

/** Texto literal de la pieza: 'el titular "X", el subtítulo "Y" y …'. */
export function copyList(spec: PromptSpec, lang: Lang): string {
  return joinList(
    spec.copy.map((c) => (lang === 'en' ? `"${c.value}" as ${c.role.en}` : `"${c.value}" como ${c.role.es}`)),
    lang,
  );
}

export function colorsWithHex(spec: PromptSpec, lang: Lang): string {
  const text = roleText(spec, 'color', lang);
  if (!spec.colors.length) return text;
  const hex = spec.colors.join(', ');
  if (!text) return lang === 'en' ? `color palette: ${hex}` : `paleta de colores: ${hex}`;
  return `${text} (${hex})`;
}

/** Oraciones del cuerpo en lenguaje natural, en el orden de prioridad. */
export function bodySentences(
  spec: PromptSpec,
  lang: Lang,
  opts: { hexInline?: boolean; skip?: SegmentRole[] } = {},
): string[] {
  const skip = new Set<SegmentRole>([
    'operation',
    'medium',
    'subject',
    'action',
    'setting',
    'format',
    ...(opts.skip ?? []),
  ]);
  const out: string[] = [];
  const roles: SegmentRole[] = [
    'layout',
    'composition',
    'camera',
    'lighting',
    'color',
    'style',
    'mood',
    'texture',
    'typography',
    'text',
    'background',
    'preserve',
    'intensity',
    'avoid',
  ];
  for (const role of roles) {
    if (skip.has(role)) continue;
    if (role === 'text') {
      if (spec.copy.length) {
        out.push(
          lang === 'en'
            ? `Include the text ${copyList(spec, lang)}, spelled exactly as written`
            : `Incluí el texto ${copyList(spec, lang)}, escrito exactamente así`,
        );
      }
      continue;
    }
    if (role === 'color') {
      const c = opts.hexInline === false ? roleText(spec, 'color', lang) : colorsWithHex(spec, lang);
      if (c) out.push(c);
      continue;
    }
    const t = roleText(spec, role, lang);
    if (t) out.push(t);
  }
  return out.map(sentence).filter(Boolean);
}

export function editIntro(spec: PromptSpec, lang: Lang): string {
  if (spec.mode !== 'edit') return '';
  if (spec.needsSecondImage) {
    return lang === 'en'
      ? 'Edit the attached images. Image 1 is the base photo; image 2 is the reference.'
      : 'Editá las imágenes adjuntas. La imagen 1 es la foto base; la imagen 2 es la referencia.';
  }
  return lang === 'en' ? 'Edit the attached image.' : 'Editá la imagen adjunta.';
}

export const NOTE_FREE_TEXT = {
  es: 'Lo que escribiste con tus palabras queda tal cual. Si lo escribís en inglés, el resultado suele ser más preciso.',
};

/** Una nota parece escrita en español (tildes, ñ o palabras muy comunes). */
export function looksSpanish(text: string): boolean {
  return /[áéíóúñ¿¡]/i.test(text) || /\b(que|con|sin|del|las|los|una|para|más|muy|pero|como|esté|tiene)\b/i.test(text);
}

/** Consejo para IAs que entienden poco el español cuando alguna nota está en español. */
export function spanishNotesTip(spec: PromptSpec, name: string): { es: string }[] {
  if (!spec.notes.some(looksSpanish)) return [];
  return [{ es: `Tus notas van tal cual en el prompt. ${name} entiende mucho mejor el inglés: si podés, escribilas en inglés.` }];
}
