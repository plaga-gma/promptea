import { describe, expect, it } from 'vitest';
import { ADAPTERS, getAdapter } from '../src/engine/adapters';
import { buildSpec, findConflicts } from '../src/engine/build';
import { contrastRatio, harmonyPalette } from '../src/engine/color';
import { SECTIONS, findArea } from '../src/sections';

const gen = findArea('imagenes', 'generacion')!.area;
const edit = findArea('imagenes', 'edicion')!.area;
const design = findArea('imagenes', 'diseno')!.area;

const genSel = {
  medio: 'ilustracion',
  sujeto: 'a red fox wearing a green wool scarf',
  accion: 'reading a book',
  entorno: 'in a snowy forest at dawn',
  estilo: ['acuarela'],
  iluminacion: 'hora-dorada',
  color: { palette: 'pastel', colors: '#ffd6e0,#c1e7e3' },
  formato: '4-5',
  evitar: ['sin-texto'],
};

describe('catálogo', () => {
  it('no repite ids dentro de un paso y toda opción tiene prompt en inglés y español', () => {
    for (const section of SECTIONS)
      for (const area of section.areas)
        for (const step of area.steps) {
          const ids = (step.options ?? []).map((o) => o.id);
          expect(new Set(ids).size, `${area.id}/${step.id}`).toBe(ids.length);
          for (const o of step.options ?? []) {
            expect(o.prompt.en.trim(), o.id).not.toBe('');
            expect(o.prompt.es.trim(), o.id).not.toBe('');
          }
          for (const g of step.groups ?? [])
            for (const id of g.optionIds) expect(ids, `${step.id} grupo ${g.id}`).toContain(id);
        }
  });
});

describe('motor', () => {
  it('ordena el prompt y respeta la sintaxis de cada IA', () => {
    const spec = buildSpec(gen, genSel, { advanced: true });
    expect(spec.ratio).toEqual([4, 5]);
    expect(spec.avoid).toContain('text');

    const generic = getAdapter('generico').format(spec, { lang: 'en', creativity: 1 }).prompt;
    expect(generic.startsWith('A digital illustration of a red fox')).toBe(true);
    expect(generic).toContain('Vertical 4:5 aspect ratio.');
    expect(generic).not.toContain('--');

    const mj = getAdapter('midjourney').format(spec, { lang: 'en', creativity: 1 }).prompt;
    expect(mj).toMatch(/--ar 4:5 --no text, letters, watermark$/);

    const sd = getAdapter('stable-diffusion').format(spec, { lang: 'en', creativity: 1 });
    expect(sd.prompt).toContain('(a red fox wearing a green wool scarf:1.2)');
    expect(sd.negative).toContain('text');

    const flux = getAdapter('flux').format(spec, { lang: 'en', creativity: 1 }).prompt;
    expect(flux).toContain('#ffd6e0');
  });

  it('todas las IAs devuelven algo para las tres áreas', () => {
    const sels = [
      [gen, genSel],
      [edit, { operacion: 'quitar-objeto', target: 'the lamp post', preservar: ['p-rostro', 'p-luz'], intensidad: 'sutil' }],
      [design, { pieza: 'flyer', tema: 'an artisan bakery called Miga', textos: { titular: 'GRAN APERTURA' }, tipografia: ['condensada'] }],
    ] as const;
    for (const [area, sel] of sels)
      for (const a of ADAPTERS) {
        const r = a.format(buildSpec(area, sel as never, { advanced: true }), { lang: 'en', creativity: 1 });
        expect(r.prompt.length, `${a.id}/${area.id}`).toBeGreaterThan(20);
      }
  });

  it('edición: inyecta el objetivo y la lista de preservación', () => {
    const spec = buildSpec(edit, { operacion: 'quitar-objeto', target: 'the lamp post', preservar: ['p-rostro'] }, { advanced: false });
    const p = getAdapter('gemini').format(spec, { lang: 'en', creativity: 1 }).prompt;
    expect(p).toContain('Remove the lamp post from the photo');
    expect(p).toContain('Keep the face and identity of every person exactly as in the original.');
  });

  it('diseño: no evita "texto" si la pieza lleva texto y toma la proporción de la pieza', () => {
    const spec = buildSpec(design, { pieza: 'poster', tema: 'a jazz night', textos: { titular: 'JAZZ' }, evitar: ['sin-gente'] }, { advanced: true });
    expect(spec.ratio).toEqual([2, 3]);
    const p = getAdapter('chatgpt').format(spec, { lang: 'en', creativity: 1 }).prompt;
    expect(p).toContain('"JAZZ" as the main text');
    expect(p).not.toContain('no extra text');
  });

  it('modo simple: ignora los pasos avanzados', () => {
    const spec = buildSpec(gen, { ...genSel, lente: 'macro' }, { advanced: false });
    expect(spec.segments.some((s) => s.stepId === 'lente')).toBe(false);
  });

  it('detecta estilos incompatibles', () => {
    expect(findConflicts(gen, { estilo: ['minimalista', 'maximalista'] })).toHaveLength(1);
  });

  it('traduce al español a pedido', () => {
    const spec = buildSpec(gen, genSel, { advanced: false });
    const p = getAdapter('generico').format(spec, { lang: 'es', creativity: 1 }).prompt;
    expect(p.startsWith('Una ilustración digital de')).toBe(true);
    expect(p).toContain('Formato vertical 4:5.');
  });
});

describe('color', () => {
  it('calcula armonías y contraste', () => {
    expect(harmonyPalette('#ff0000', 'complementaria')[2]).toBe('#00ffff');
    expect(Math.round(contrastRatio('#000000', '#ffffff'))).toBe(21);
  });
});
