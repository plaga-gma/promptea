import { describe, expect, it } from 'vitest';
import { getAdapter } from '../src/engine/adapters';
import { buildSpec, missingSteps, missingTargets } from '../src/engine/build';
import { autofill, enhanceSpec, interpretIdea, mergeSelections, scorePrompt } from '../src/engine/assistant';
import type { Area, Selections } from '../src/engine/types';
import { SECTIONS, findArea } from '../src/sections';

const gen = findArea('imagenes', 'generacion')!.area;
const edit = findArea('imagenes', 'edicion')!.area;
const design = findArea('imagenes', 'diseno')!.area;
const AREAS = SECTIONS.flatMap((s) => s.areas);

/** Todos los ids de opción del área, solos y como "paso/opción". */
function idsOf(area: Area): Set<string> {
  const out = new Set<string>();
  for (const step of area.steps)
    for (const o of step.options ?? []) {
      out.add(o.id);
      out.add(`${step.id}/${o.id}`);
    }
  return out;
}

describe('etapas', () => {
  it('cada paso está en una sola etapa y toda etapa nombra pasos reales', () => {
    for (const area of AREAS) {
      if (!area.stages) continue;
      const listed = area.stages.flatMap((s) => s.steps);
      expect(new Set(listed).size, area.id).toBe(listed.length);
      expect([...listed].sort(), area.id).toEqual(area.steps.map((s) => s.id).sort());
    }
  });
});

describe('recetas', () => {
  it('usan pasos y opciones que existen y quedan completas', () => {
    for (const area of AREAS)
      for (const preset of area.presets ?? []) {
        for (const [key, value] of Object.entries(preset.selections)) {
          const [stepId, optionId] = key.split('/');
          const step = area.steps.find((s) => s.id === stepId);
          expect(step, `${preset.id}: ${key}`).toBeDefined();
          if (optionId) expect(step!.options?.some((o) => o.id === optionId), `${preset.id}: ${key}`).toBe(true);
          if (key.includes('/') || !step!.options) continue;
          const ids = step!.type === 'color' ? [(value as { palette: string }).palette] : Array.isArray(value) ? value : [value as string];
          for (const id of ids) expect(step!.options.some((o) => o.id === id), `${preset.id}: ${stepId}=${id}`).toBe(true);
        }
        expect(missingSteps(area, preset.selections, true).map((s) => s.id), preset.id).toEqual([]);
        expect(missingTargets(area, preset.selections, true).map((o) => o.id), preset.id).toEqual([]);
      }
  });
});

describe('datos del asistente', () => {
  it('palabras clave, parejas, autocompletado y refuerzos nombran opciones reales', () => {
    for (const area of AREAS) {
      const a = area.assistant;
      if (!a) continue;
      const ids = idsOf(area);
      for (const key of Object.keys(a.keywords)) expect(ids.has(key), `${area.id} palabra clave: ${key}`).toBe(true);
      for (const [key, list] of Object.entries(a.pairs)) {
        expect(ids.has(key), `${area.id} pareja: ${key}`).toBe(true);
        for (const id of list) expect(ids.has(id), `${area.id} pareja de ${key}: ${id}`).toBe(true);
      }
      for (const { step, fallback } of a.autofill) {
        const s = area.steps.find((x) => x.id === step);
        expect(s, `${area.id} autocompletar: ${step}`).toBeDefined();
        if (fallback) expect(s!.options?.some((o) => o.id === fallback), `${area.id} ${step}: ${fallback}`).toBe(true);
      }
      for (const key of Object.keys(a.boosters.byOption)) expect(ids.has(key), `${area.id} refuerzo: ${key}`).toBe(true);
      expect(a.ideas.length).toBeGreaterThan(5);
    }
  });
});

describe('interpretar una idea', () => {
  it('generación: elige tipo, estilo, luz y formato, y deja el resto como sujeto', () => {
    const r = interpretIdea(gen, 'un gato astronauta flotando en el espacio, estilo acuarela, luz de atardecer, para historia de Instagram');
    expect(r.selections.estilo).toEqual(['acuarela']);
    expect(r.selections.iluminacion).toEqual(['hora-dorada']);
    expect(r.selections.formato).toBe('9-16');
    expect(String(r.selections.sujeto)).toContain('gato astronauta');
    expect(String(r.selections.accion ?? '')).toContain('flotando');
  });

  it('generación: no confunde palabras del sujeto con opciones', () => {
    const r = interpretIdea(gen, 'un retrato de una abuela riendo en su cocina');
    expect(r.selections.lente).toBeUndefined();
    expect(String(r.selections.sujeto)).toContain('abuela');
  });

  it('edición: entiende la operación, lo que hay que cuidar y la intensidad', () => {
    const r = interpretIdea(edit, 'convertime en un muñeco en caja, que se me parezca, exagerado');
    expect(r.selections.operacion).toContain('muneco');
    expect(r.selections.preservar).toContain('p-rostro');
    expect(r.selections.intensidad).toBe('fuerte');
  });

  it('edición: lo que sobra va como objetivo de la operación', () => {
    const r = interpretIdea(edit, 'cambiar el cielo por un atardecer naranja');
    expect(r.selections.operacion).toContain('cambiar-cielo');
    expect(String(r.selections['operacion/cambiar-cielo/target'])).toContain('atardecer naranja');
  });

  it('edición: nombrar un estilo activa "Cambiar el estilo"', () => {
    const r = interpretIdea(edit, 'mi foto estilo Ghibli, misma pose');
    expect(r.selections.operacion).toContain('estilo');
    expect(r.selections['nuevo-estilo']).toContain('anime-pintado');
    expect(r.selections.preservar).toContain('p-pose');
  });

  it('diseño: pieza, texto entre comillas y estilo', () => {
    const r = interpretIdea(design, 'un logo para mi cafetería "GRANO", estilo retro, colores café');
    expect(r.selections.pieza).toBe('logo');
    expect(r.selections['estilo-diseno']).toContain('d-retro');
    expect((r.selections.textos as Record<string, string>).titular).toBe('GRANO');
    expect(String(r.selections.tema)).toContain('cafeteria'.slice(0, 4));
  });

  it('todas las ideas de ejemplo eligen algo y arman un prompt sin errores', () => {
    for (const area of AREAS)
      for (const idea of area.assistant?.ideas ?? []) {
        const r = interpretIdea(area, idea);
        expect(r.matches.length, `${area.id}: ${idea}`).toBeGreaterThan(0);
        const spec = buildSpec(area, r.selections, { advanced: true });
        expect(getAdapter('generic').format(spec, { lang: 'en', creativity: 1 }).prompt.length).toBeGreaterThan(20);
      }
  });

  it('suma a lo elegido sin pasarse del máximo', () => {
    const merged = mergeSelections(gen, { estilo: ['acuarela'], formato: '1-1' }, { estilo: ['anime', 'pixel'], formato: '9-16' });
    // Lo último que pidió gana: quedan las dos más nuevas.
    expect(merged.estilo).toEqual(['anime', 'pixel']);
    expect(merged.formato).toBe('9-16');
  });
});

describe('autocompletar', () => {
  it('no hace nada si no hay nada elegido', () => {
    expect(autofill(gen, {}, true).picks).toEqual([]);
  });

  it('completa pasos vacíos con opciones que combinan y no pisa lo elegido', () => {
    const sel: Selections = { medio: 'foto', sujeto: 'un faro', atmosfera: ['misteriosa'], formato: '16-9' };
    const r = autofill(gen, sel, true);
    expect(r.selections.formato).toBeUndefined();
    expect(r.selections.atmosfera).toBeUndefined();
    expect(r.picks.some((p) => p.stepId === 'iluminacion')).toBe(true);
    const luz = r.selections.iluminacion as string[];
    expect(['clave-baja', 'niebla', 'luna', 'volumetrica', 'hora-azul']).toContain(luz[0]);
  });

  it('en edición elige qué cuidar según la operación', () => {
    const r = autofill(edit, { operacion: ['retoque'] }, true);
    expect(r.selections.preservar).toContain('p-rostro');
    expect(r.selections.intensidad).toBe('sutil');
  });
});

describe('poder del prompt', () => {
  const power = (area: Area, sel: Selections) => {
    const spec = buildSpec(area, sel, { advanced: true });
    return scorePrompt(area, spec, spec, sel, true);
  };

  it('sube a medida que el pedido se completa y propone el próximo paso', () => {
    const a = power(gen, { sujeto: 'un gato' });
    const b = power(gen, { medio: 'foto', sujeto: 'un gato naranja con bufanda verde', estilo: ['cinematografico'] });
    const c = power(gen, gen.presets![0]!.selections);
    expect(a.score).toBeLessThan(b.score);
    expect(b.score).toBeLessThan(c.score);
    expect(a.next).toBeDefined();
    expect(c.score).toBeLessThanOrEqual(100);
  });

  it('las recetas llegan por lo menos a "Buen pedido"', () => {
    for (const area of AREAS)
      for (const preset of area.presets ?? []) expect(power(area, preset.selections).score, `${area.id}/${preset.id}`).toBeGreaterThanOrEqual(40);
  });
});

describe('prompt largo y óptimo', () => {
  it('agrega refuerzos de calidad según lo elegido', () => {
    const sel: Selections = { medio: 'foto', sujeto: 'un faro en una isla' };
    const spec = enhanceSpec(gen, buildSpec(gen, sel, { advanced: true }), sel);
    const quality = spec.segments.filter((s) => s.role === 'quality');
    expect(quality.length).toBe(1);
    expect(quality[0]!.text.en).toContain('photorealistic');
    expect(getAdapter('generic').format(spec, { lang: 'en', creativity: 1 }).prompt.toLowerCase()).toContain('photorealistic');
  });
});
