import { describe, expect, it } from 'vitest';
import { ADAPTERS, getAdapter } from '../src/engine/adapters';
import { buildSpec, detailKey, detailsOf, findConflicts, missingTargets, noteKey, pruneDetails, targetKey } from '../src/engine/build';
import { contrastRatio, harmonyPalette } from '../src/engine/color';
import { SECTIONS, findArea } from '../src/sections';
import { DIAGRAMS } from '../src/components/demos/diagrams';
import { FILTERS } from '../src/components/demos/filters';

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
          if (step.groups) {
            const grouped = step.groups.flatMap((g) => g.optionIds);
            for (const id of ids) expect(grouped, `${step.id}: ${id} no está en ningún grupo`).toContain(id);
          }
        }
  });

  it('cada demo apunta a un esquema o filtro que existe', () => {
    for (const section of SECTIONS)
      for (const area of section.areas)
        for (const step of area.steps)
          for (const o of step.options ?? []) {
            const demo = o.demo;
            if (demo?.kind === 'diagram') expect(DIAGRAMS[demo.name], `${o.id}: esquema ${demo.name}`).toBeTruthy();
            const looks = demo?.kind === 'filter' ? [demo] : demo?.kind === 'compare' ? [demo.before, demo.after] : [];
            for (const look of looks)
              for (const [, id] of look.css.matchAll(/url\(#pf-([\w-]+)\)/g)) expect(FILTERS[id!], `${o.id}: filtro ${id}`).toBeTruthy();
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

describe('opciones nuevas', () => {
  it('encadena época y clima en la primera oración con comas', () => {
    const spec = buildSpec(gen, { ...genSel, epoca: 'anos20', clima: 'lluvia', expresion: ['sonrisa'] }, { advanced: true });
    const generic = getAdapter('generico').format(spec, { lang: 'en', creativity: 1 }).prompt;
    expect(generic).toContain('reading a book, with a natural warm smile, in a snowy forest at dawn, set in the roaring 1920s, in the rain');
    expect(generic).not.toMatch(/;\s*set in/);
  });

  it('un mockup pedido a propósito no queda en la lista de evitar', () => {
    const plain = buildSpec(design, { pieza: 'logo', tema: 'a coffee shop' }, { advanced: true });
    expect(plain.avoid).toContain('mockup');
    const mock = buildSpec(design, { pieza: 'logo', tema: 'a coffee shop', presentacion: 'm-pared' }, { advanced: true });
    expect(mock.avoid).not.toContain('mockup');
    expect(getAdapter('midjourney').format(mock, { lang: 'en', creativity: 1 }).prompt).toContain('framed mockup hanging on a wall');
  });

  it('el patrón continuo activa --tile en Midjourney', () => {
    const spec = buildSpec(design, { pieza: 'patron', tema: 'lemons and leaves' }, { advanced: false });
    expect(spec.tile).toBe(true);
    expect(getAdapter('midjourney').format(spec, { lang: 'en', creativity: 1 }).prompt).toMatch(/--tile/);
    expect(getAdapter('generico').format(spec, { lang: 'en', creativity: 1 }).prompt).not.toContain('--tile');
  });

  it('las operaciones nuevas de edición usan lo que escribe el usuario', () => {
    const spec = buildSpec(edit, { operacion: 'ropa', target: 'a navy blue suit', preservar: ['p-rostro'] }, { advanced: false });
    const prompt = getAdapter('chatgpt').format(spec, { lang: 'en', creativity: 1 }).prompt;
    expect(prompt).toContain('Change the outfit to a navy blue suit');
  });
});

describe('combinaciones que se contradecían', () => {
  const en = { lang: 'en' as const, creativity: 1 as const };

  it('un desenfoque pedido a propósito no se cancela en Stable Diffusion', () => {
    const spec = buildSpec(gen, { ...genSel, medio: 'foto', filtro: 'tilt', lente: 'gran-apertura' }, { advanced: true });
    const sd = getAdapter('stable-diffusion').format(spec, en);
    expect(sd.prompt).not.toContain('sharp focus');
    expect(sd.negative).not.toContain('blurry');
    expect(findConflicts(gen, { lente: 'gran-apertura', evitar: ['sin-borroso'] })).toHaveLength(1);
    const plain = getAdapter('stable-diffusion').format(buildSpec(gen, genSel, { advanced: true }), en);
    expect(plain.prompt).toContain('sharp focus');
    expect(plain.negative).toContain('blurry');
  });

  it('un logo no pide evitar logos', () => {
    const spec = buildSpec(design, { pieza: 'logo', tema: 'a bakery', evitar: ['sin-marca-agua'] }, { advanced: true });
    expect(spec.avoid).toContain('watermark');
    expect(spec.avoid).not.toContain('logo');
    expect(getAdapter('midjourney').format(spec, en).prompt).not.toMatch(/--no[^]*\blogo\b/);
  });

  it('un mockup no lleva --tile y avisa si el fondo es transparente', () => {
    const spec = buildSpec(design, { pieza: 'patron', tema: 'lemons', presentacion: 'm-pared' }, { advanced: true });
    expect(spec.tile).toBe(false);
    expect(getAdapter('midjourney').format(spec, en).prompt).not.toContain('--tile');
    expect(findConflicts(design, { pieza: 'sticker', fondo: 'f-transparente', presentacion: 'm-mano' })).toHaveLength(1);
  });

  it('la personalidad de marca se lee bien', () => {
    const spec = buildSpec(design, { pieza: 'logo', tema: 'a bakery', personalidad: ['elegante', 'innovadora'] }, { advanced: false });
    const p = getAdapter('generico').format(spec, en).prompt;
    expect(p).toContain('Brand personality: elegant, refined and innovative, forward-thinking.');
    expect(p).not.toMatch(/with a elegant| and .* and .* and /);
  });

  it('ChatGPT conserva el sentido de cada paso en sus líneas', () => {
    const spec = buildSpec(gen, { medio: 'foto', sujeto: 'a red vase', material: ['vidrio'], textura: ['grano'], camara: 'portra' }, { advanced: true });
    const p = getAdapter('chatgpt').format(spec, en).prompt;
    expect(p).toMatch(/Finish: .*made of transparent glass/);
    expect(p).toMatch(/Camera: Shot on Kodak Portra/);
  });

  it('los filtros y cámaras se leen bien al generar desde cero', () => {
    const night = getAdapter('generico').format(buildSpec(gen, { medio: 'render3d', sujeto: 'a teapot', filtro: 'semitono' }, { advanced: true }), en).prompt;
    expect(night).not.toContain('over the photo');
    const cam = getAdapter('generico').format(buildSpec(gen, { medio: 'foto', sujeto: 'a street', camara: 'camara-seguridad' }, { advanced: true }), en).prompt;
    expect(cam).toMatch(/shot on a grainy CCTV security camera/i);
  });

  it('avisa si una edición cambia justo lo que se pidió conservar', () => {
    expect(findConflicts(edit, { operacion: 'edad', preservar: ['p-rostro'] })).toHaveLength(1);
    expect(findConflicts(edit, { operacion: 'retrato-pro', preservar: ['p-fondo', 'p-ropa'] })).toHaveLength(2);
    expect(findConflicts(edit, { operacion: 'ropa', preservar: ['p-rostro'] })).toHaveLength(0);
  });

  it('desenfocar el fondo no pide evitar el desenfoque', () => {
    const spec = buildSpec(edit, { operacion: 'desenfocar-fondo' }, { advanced: true });
    expect(getAdapter('stable-diffusion').format(spec, en).negative ?? '').not.toContain('blurry');
    expect(findConflicts(edit, { operacion: 'desenfocar-fondo', evitar: ['sin-borroso'] })).toHaveLength(1);
  });
});

describe('efectos de edición', () => {
  const en = { lang: 'en' as const, creativity: 1 as const };
  const prompt = (sel: Record<string, unknown>) => getAdapter('generico').format(buildSpec(edit, sel as never, { advanced: true }), en).prompt;

  it('el duotono lleva sus colores, y "Mis colores" usa lo que escribe el usuario', () => {
    expect(prompt({ operacion: 'duotono', 'duo-colores': 'duo-azul-rosa' })).toContain('Duotone colors: deep navy blue shadows and hot pink highlights.');
    expect(prompt({ operacion: 'duotono', 'duo-colores': 'duo-propio', target: 'teal shadows and gold highlights' })).toContain(
      'Duotone colors: teal shadows and gold highlights.',
    );
  });

  it('la restauración nombra los daños dentro de la instrucción', () => {
    const p = prompt({ operacion: 'restaurar', danos: ['d-rayas', 'd-roturas'] });
    expect(p).toMatch(/^Edit the attached image\. Restore this old photo: .+; pay special attention to the scratches and dust specks and the tears/);
  });

  it('el póster trap suma estilo y textos', () => {
    const p = prompt({ operacion: 'poster-trap', 'estilo-poster': 'trap-cromo', 'textos-poster': { titulo: 'NOCHE ETERNA', artista: 'LUCA' } });
    expect(p).toContain('Poster style: Y2K chrome');
    expect(p).toContain('"NOCHE ETERNA" as the big title and "LUCA" as the artist name');
  });

  it('foto antigua y color selectivo', () => {
    expect(prompt({ operacion: 'envejecer', epoca: 'epoca-1990' })).toContain('Make it look like a 1990s disposable camera snapshot');
    expect(prompt({ operacion: 'color-selectivo', target: 'the red umbrella' })).toContain('black and white except the red umbrella');
  });
});

describe('subopciones y notas', () => {
  it('el catálogo de subopciones está completo y bien armado', () => {
    for (const section of SECTIONS)
      for (const area of section.areas)
        for (const step of area.steps) {
          const ids = (step.options ?? []).map((o) => o.id);
          for (const d of step.details ?? []) for (const id of d.except ?? []) expect(ids, `${step.id}/${d.id} except`).toContain(id);
          for (const o of step.options ?? []) {
            const details = detailsOf(step, o);
            const dids = details.map((d) => d.id);
            expect(new Set(dids).size, `${step.id}/${o.id}: subopciones repetidas`).toBe(dids.length);
            for (const [, id] of `${o.prompt.en} ${o.prompt.es}`.matchAll(/\{d:([\w-]+)\}/g))
              expect(dids, `${o.id}: {d:${id}} sin subopción`).toContain(id);
            for (const d of details) {
              const oids = d.options.map((x) => x.id);
              expect(new Set(oids).size, `${o.id}/${d.id}`).toBe(oids.length);
              expect(d.options.length, `${o.id}/${d.id}`).toBeGreaterThan(1);
              for (const x of d.options) expect(x.prompt.en.trim() && x.prompt.es.trim(), `${o.id}/${d.id}/${x.id}`).toBeTruthy();
              if (d.fillsTarget) expect(o.meta?.needsTarget, `${o.id}/${d.id}: completa un objetivo que no existe`).toBe(true);
            }
          }
        }
  });

  it('toda lista de más de 10 opciones está dividida en categorías', () => {
    for (const section of SECTIONS)
      for (const area of section.areas)
        for (const step of area.steps)
          if ((step.options?.length ?? 0) > 10) expect(step.groups, `${area.id}/${step.id}`).toBeTruthy();
  });

  it('suma las subopciones a la opción y la nota tal cual', () => {
    const sel = {
      ...genSel,
      [detailKey('iluminacion', 'hora-dorada', 'direccion')]: ['ld-costado'],
      [noteKey('iluminacion', 'hora-dorada')]: '  que entre por la ventana.  ',
    };
    const spec = buildSpec(gen, sel, { advanced: false });
    const p = getAdapter('generico').format(spec, { lang: 'en', creativity: 1 }).prompt;
    expect(p).toContain('Warm golden hour sunlight with long soft shadows, coming from the side, sculpting the shapes, que entre por la ventana.');
    expect(spec.notes).toEqual(['que entre por la ventana']);
    expect(getAdapter('midjourney').format(spec, { lang: 'en', creativity: 1 }).notes.some((n) => n.es.includes('inglés'))).toBe(true);
    expect(getAdapter('chatgpt').format(spec, { lang: 'en', creativity: 1 }).notes.some((n) => n.es.includes('Tus notas'))).toBe(false);
  });

  it('una subopción reemplaza su lugar en el prompt, o usa el valor por defecto', () => {
    const base = buildSpec(edit, { operacion: 'quitar-fondo' }, { advanced: false });
    expect(base.segments[0]!.text.en).toContain('isolated on a plain white background');
    const png = buildSpec(edit, { operacion: 'quitar-fondo', [detailKey('operacion', 'quitar-fondo', 'fondo')]: ['qf-transparente'] }, { advanced: false });
    expect(png.segments[0]!.text.en).toContain('isolated on a transparent background (PNG with alpha channel)');
    expect(png.segments[0]!.text.en).not.toContain('{d:');
    const blur = buildSpec(edit, { operacion: 'desenfocar-fondo', [detailKey('operacion', 'desenfocar-fondo', 'cuanto')]: ['df-fuerte'] }, { advanced: false });
    expect(blur.segments[0]!.text.en).toContain('like a fast lens at f/1.2');
    expect(blur.segments[0]!.text.en).not.toContain('f/1.8');
  });

  it('una subopción puede completar el objetivo: el texto libre pasa a ser opcional', () => {
    const sel = { operacion: ['cambiar-cielo'], [detailKey('operacion', 'cambiar-cielo', 'cielo')]: ['cielo-tormenta'] };
    expect(missingTargets(edit, sel, false)).toHaveLength(0);
    expect(missingTargets(edit, { operacion: ['cambiar-cielo'] }, false).map((o) => o.id)).toEqual(['cambiar-cielo']);
    const p = getAdapter('generico').format(buildSpec(edit, sel, { advanced: false }), { lang: 'en', creativity: 1 }).prompt;
    expect(p).toContain('Replace the sky with a dramatic, dark stormy sky with heavy clouds, adjusting');
    const both = buildSpec(edit, { ...sel, [targetKey('operacion', 'cambiar-cielo')]: 'with lightning' }, { advanced: false });
    expect(both.segments[0]!.text.en).toContain('heavy clouds, with lightning, adjusting');
  });

  it('varias operaciones: cada una con su objetivo y en su propia oración', () => {
    const sel = {
      operacion: ['quitar-objeto', 'cambiar-cielo', 'retoque'],
      [targetKey('operacion', 'quitar-objeto')]: 'the lamp post',
      [detailKey('operacion', 'cambiar-cielo', 'cielo')]: ['cielo-atardecer'],
    };
    expect(missingTargets(edit, sel, false)).toHaveLength(0);
    const p = getAdapter('generico').format(buildSpec(edit, sel, { advanced: false }), { lang: 'en', creativity: 1 }).prompt;
    expect(p).toContain('Remove the lamp post from the photo and fill the area naturally so no trace remains. Replace the sky with a warm orange and pink sunset sky');
    expect(p).toContain('match the new sky. Retouch the portrait naturally');
    expect(findConflicts(edit, { operacion: ['quitar-fondo', 'cambiar-fondo'] })).toHaveLength(1);
  });

  it('varias subopciones y varias opciones por paso se combinan en una lista', () => {
    const sel = {
      ...genSel,
      iluminacion: ['hora-dorada', 'neon'],
      [detailKey('iluminacion', 'hora-dorada', 'direccion')]: ['ld-costado', 'ld-atras'],
    };
    const p = getAdapter('generico').format(buildSpec(gen, sel, { advanced: false }), { lang: 'en', creativity: 1 }).prompt;
    expect(p).toContain('coming from the side, sculpting the shapes and coming from behind, with a glowing rim and ');
  });

  it('los pasos de una sola opción dicen por qué, y las subopciones de un solo valor son únicas', () => {
    for (const section of SECTIONS)
      for (const area of section.areas)
        for (const step of area.steps) {
          if ((step.type === 'single' || step.type === 'color') && step.options) expect(step.one?.es, `${area.id}/${step.id}`).toBeTruthy();
          for (const o of step.options ?? [])
            for (const d of detailsOf(step, o))
              if (`${o.prompt.en}`.includes(`{d:${d.id}}`)) expect(d.type, `${o.id}/${d.id}`).toBe('single');
        }
  });

  it('el tipo de imagen no se separa del sujeto', () => {
    const sel = {
      ...genSel,
      medio: 'foto',
      [detailKey('medio', 'foto', 'tipo')]: ['fm-retrato'],
      [noteKey('medio', 'foto')]: 'para un fondo de presentación',
    };
    const p = getAdapter('generico').format(buildSpec(gen, sel, { advanced: false }), { lang: 'en', creativity: 1 }).prompt;
    expect(p.startsWith('A portrait photograph of a red fox wearing a green wool scarf, reading a book, in a snowy forest at dawn, para un fondo de presentación.')).toBe(true);
    const ill = { ...genSel, [detailKey('medio', 'ilustracion', 'acabado')]: ['im-lineal'] };
    const q = getAdapter('generico').format(buildSpec(gen, ill, { advanced: false }), { lang: 'en', creativity: 1 }).prompt;
    expect(q.startsWith('A digital illustration of a red fox')).toBe(true);
    expect(q).toContain('textured paper; with clean ink lines and flat colors.');
    const sinTipo = getAdapter('generico').format(buildSpec(gen, { ...genSel, medio: 'foto' }, { advanced: false }), { lang: 'en', creativity: 1 }).prompt;
    expect(sinTipo.startsWith('A photograph of a red fox')).toBe(true);
  });

  it('las subopciones de una opción desmarcada se borran', () => {
    const sel = {
      estilo: ['acuarela'],
      [detailKey('estilo', 'acuarela', 'manera')]: ['ac-suelta'],
      [noteKey('estilo', 'acuarela')]: 'x',
      [detailKey('estilo', 'anime', 'epoca')]: ['an-90'],
      [noteKey('iluminacion', 'neon')]: 'y',
    };
    expect(Object.keys(pruneDetails(sel, 'estilo', ['acuarela'])).sort()).toEqual(
      ['estilo', 'estilo/acuarela/manera', 'estilo/acuarela/nota', 'iluminacion/neon/nota'].sort(),
    );
    expect(Object.keys(pruneDetails(sel, 'estilo', []))).toEqual(['estilo', 'iluminacion/neon/nota']);
  });

  it('las subopciones de diseño van después del rubro', () => {
    const sel = { pieza: 'post', tema: 'an artisan bakery', [detailKey('pieza', 'post', 'red')]: ['pr-linkedin'] };
    const p = getAdapter('generico').format(buildSpec(design, sel, { advanced: false }), { lang: 'en', creativity: 1 }).prompt;
    expect(p).toContain('A social media post design for an artisan bakery, for LinkedIn, with a professional tone.');
  });
});
