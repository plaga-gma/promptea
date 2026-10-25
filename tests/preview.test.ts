import { describe, expect, it } from 'vitest';
import { buildScene, findGlyph } from '../src/components/preview/scene';
import { SUBJECT_GLYPHS } from '../src/components/preview/glyphs';
import { SECTIONS, findArea } from '../src/sections';

const gen = findArea('imagenes', 'generacion')!.area;
const edit = findArea('imagenes', 'edicion')!.area;
const design = findArea('imagenes', 'diseno')!.area;

describe('vista previa', () => {
  it('reconoce sujetos con plural y diminutivo', () => {
    expect(findGlyph('un zorrito explorador', SUBJECT_GLYPHS)?.glyph).toBe('🦊');
    expect(findGlyph('dos gatitos', SUBJECT_GLYPHS)?.glyph).toBe('🐱');
    expect(findGlyph('una veterinaria con su perro', SUBJECT_GLYPHS, 1)?.glyph).toBe('🐶');
    expect(findGlyph('algo raro', SUBJECT_GLYPHS)).toBeUndefined();
  });

  it('sin elecciones está vacía', () => {
    for (const area of SECTIONS.flatMap((s) => s.areas)) expect(buildScene(area, {}, false).empty).toBe(true);
  });

  it('dibuja cada receta sin errores', () => {
    for (const area of SECTIONS.flatMap((s) => s.areas))
      for (const p of area.presets ?? []) {
        const scene = buildScene(area, p.selections, true);
        expect(scene.empty, `${area.id}/${p.id}`).toBe(false);
        expect(scene.tags.length, `${area.id}/${p.id}`).toBeGreaterThan(1);
      }
  });

  it('generación: lugar, luz, formato y clima', () => {
    const s = buildScene(gen, { sujeto: 'un gato', entorno: 'en la playa', iluminacion: ['luna'], formato: '9-16', clima: ['lluvia'] }, true);
    expect(s.subject?.glyph).toBe('🐱');
    expect(s.props.map((p) => p.glyph)).toContain('🌴');
    expect(s.light.kind).toBe('moon');
    expect(s.ratio).toEqual([9, 16]);
    expect(s.weather).toContain('rain');
  });

  it('las elecciones del asistente se marcan', () => {
    const s = buildScene(gen, { sujeto: 'un gato', iluminacion: ['luna'] }, true, new Set(['iluminacion']));
    expect(s.tags.find((t) => t.stepId === 'iluminacion')?.auto).toBe(true);
  });

  it('edición: operaciones y fondo transparente', () => {
    const s = buildScene(edit, { operacion: ['quitar-fondo'], preservar: ['p-texto'] }, true);
    expect(s.edit?.ops.map((o) => o.id)).toEqual(['quitar-fondo']);
    expect(s.edit?.checker).toBe(true);
  });

  it('diseño: textos, pieza y fondo', () => {
    const s = buildScene(design, { pieza: 'logo', textos: { titular: 'GRANO' }, fondo: 'f-oscuro' }, true);
    expect(s.design?.title).toBe('GRANO');
    expect(s.design?.background).toBe('#111118');
    expect(s.ratio).toBeDefined();
  });
});
