# Arquitectura

> Cómo está organizado el código y cómo se extiende. Pensado para colaboradores y para chats futuros.

## Mapa

```
promptea/
├── .github/workflows/deploy.yml   Publica en GitHub Pages en cada push a main
├── docs/                          Investigación y decisiones (este folder)
├── public/                        Archivos estáticos (favicon, demos/: fotos de muestra para los filtros)
├── publicar.bat                   Doble clic: sube los cambios a GitHub
├── src/
│   ├── config/site.ts             Nombre, descripción, idioma (todo lo "de marca")
│   ├── engine/                    Motor de prompts: no sabe nada de la interfaz
│   │   ├── types.ts               Tipos: Section, Area, Step, Option, PromptSpec, ModelAdapter
│   │   ├── build.ts               Elecciones → PromptSpec (especificación neutral)
│   │   ├── color.ts               Armonías de color y contraste WCAG
│   │   ├── assistant/             Asistente: entender ideas, completar, Poder del prompt, prompt óptimo
│   │   └── adapters/              Un archivo por IA (generic, chatgpt, gemini, meta, midjourney…)
│   ├── sections/
│   │   ├── index.ts               Registro de secciones (las páginas salen de acá)
│   │   └── imagenes/
│   │       ├── section.ts         La sección y sus áreas
│   │       ├── areas/             generacion.ts, edicion.ts, diseno.ts (pasos de cada área)
│   │       ├── asistente/         Niveles, recetas y datos del asistente de cada área
│   │       └── library/           Catálogo: estilos, luz, cámara, color, tipografía, diseño, edición,
│   │                                  detalles.ts (subopciones), extra.ts (opciones del rediseño)
│   ├── components/
│   │   ├── builder/               Constructor (Preact): Builder, StepView, PromptPanel, Game (mapa, poder, idea, recetas, logros)
│   │   ├── preview/               Vista previa: scene.ts (elecciones → escena), Preview.tsx (la dibuja), Backdrop.tsx (siluetas del fondo)
│   │   ├── studio/                Escena 3D: Studio.tsx (el set, los marcadores y el panel) y studio.css
│   │   ├── demos/                 Demos visuales: Demo.tsx, esquemas SVG, filtros SVG, fotos de muestra
│   │   └── *.astro                Header, Footer, Logo, AreaCard
│   ├── i18n/es.ts                 Textos de la interfaz
│   ├── lib/                       storage.ts (historial/favoritos), url.ts (base del sitio), browser-ai.ts (traductor de Chrome)
│   ├── layouts/Base.astro         HTML base + SEO (canonical, Open Graph, JSON-LD)
│   └── pages/                     Rutas: /, /[section]/, /[section]/[area]/, /mis-prompts/, 404, robots.txt
└── tests/                         engine (motor y catálogo), assistant (asistente y recetas), preview (vista previa)
```

## Flujo de datos

```
Usuario elige (botones / texto)
        │  Selections  { pasoId: id | ids | texto | campos,
        │                "paso/opción/detalle": ids, "paso/opción/nota" y "paso/opción/target": texto }
        ▼
buildSpec(area, selections)            src/engine/build.ts
        │  PromptSpec  { segmentos por rol, formato, evitar, colores, textos }
        ▼
adapter.format(spec, {lang, creativity})   src/engine/adapters/<ia>.ts
        │  { prompt, negative?, notes[] }
        ▼
PromptPanel: copiar · abrir la IA · favoritos · historial
```

Con el rediseño (T19 a T24) el constructor suma tres pasos alrededor de ese flujo:

```
idea escrita ──interpretIdea──► Selections del usuario
                                   │ autofill (Asistente por detrás) → Selections completas
                                   ├─► buildSpec → enhanceSpec (Prompt óptimo) → adapter.format
                                   ├─► scorePrompt (Poder del prompt, próximo paso)
                                   └─► buildScene → Preview (vista previa)
```

El asistente nunca cambia `selections`: calcula aparte lo que completaría (`auto.selections`) y el constructor lo mezcla al armar el prompt y la vista previa. Así "No, gracias" y apagar el asistente no dejan rastros.

Los **roles** (`SegmentRole`) siguen la anatomía de un prompt de [01-ingenieria-de-prompts.md](01-ingenieria-de-prompts.md) §2 y se ordenan por prioridad (`ROLE_ORDER`). Cada adaptador decide cómo escribirlos: oraciones (Genérico, Gemini, FLUX, Meta), líneas etiquetadas (ChatGPT), etiquetas con pesos (Stable Diffusion) o texto + parámetros (Midjourney).

## Cómo extender

### Agregar una opción al catálogo
En el archivo de `library/` que corresponda:
```ts
o('id-unico', 'Nombre visible', 'fragment in English', 'fragmento en español', {
  hint: 'Para qué sirve, en una línea.',
  demo: { kind: 'swatch', colors: ['#...'] },   // o font, light, filter, compare, texture, diagram, ratio, gradient, image
});
```
`npm test` verifica que no haya ids repetidos y que tenga ambos idiomas.

### Subopciones y notas
Una opción puede abrir **subopciones** (`Detail`): chips más específicos que se muestran debajo cuando la opción está elegida. Se declaran en `library/detalles.ts` con `d(id, 'Nombre', [opciones], extra)` y se enganchan:
- a opciones puntuales con `withDetails(LISTA, { 'id-opcion': [detalles] })` en el área, o
- a todas las opciones de un paso con `details: [...]` en el paso (con `except` para las que no aplican).

Cómo entran al prompt (`refineOption` en `build.ts`):
- por defecto se suman después del fragmento de la opción, con una coma (`template` cambia la redacción);
- si el prompt de la opción tiene `{d:<id>}`, el valor va ahí (y `default` si no se eligió nada);
- `fillsTarget: true` completa el `{target}` de una operación de Edición y vuelve opcional su texto libre;
- `role` lo manda a otro bloque del prompt (se usa en el tipo de imagen y de pieza, que van pegados al sujeto).

Las subopciones admiten varias por defecto; `one: true` en `d()` (o `type: 'single'`) las deja en una sola cuando dos se contradicen. Las que reemplazan un `{d:…}` tienen que ser de una sola (lo verifica `npm test`).

Los pasos también: `type: 'multi'` con `max`, o `type: 'single'` con `one: { es: 'por qué' }`, que la interfaz muestra junto al cartel "Elegí una" (`npm test` exige el porqué). `join: 'sentences'` une varias opciones como oraciones separadas (operaciones de Edición) en vez de "a, b y c".

Las operaciones de Edición con `meta.needsTarget` muestran su propio "Contalo con tus palabras" dentro del recuadro, guardado en `paso/opción/target` (`targetOf` en `build.ts`; los prompts guardados con el viejo paso `target` siguen funcionando). `missingTargets` lista las que faltan.

Cada opción elegida tiene además una **nota** libre que va tal cual, pegada a su fragmento (ver decisión T15). Las claves en `Selections` son `paso/opción/detalle` y `paso/opción/nota`; al desmarcar una opción se borran (`pruneDetails`). `npm test` verifica que cada `{d:…}` tenga su subopción y que no haya ids repetidos.

### Categorías
Las listas largas se dividen con `groups` en el paso. En la vista "Todos" se ven todas las categorías con su título (con más de 40 opciones, las 4 primeras de cada una). `npm test` exige categorías en toda lista de más de 10 opciones y que cada opción esté en alguna.

### Agregar una imagen de ejemplo a un estilo
Guardar la imagen en `public/demos/estilos/<id>.webp` (≈ 400×300, < 40 KB) y pasar la ruta como tercer argumento de `img()`:
`img('Acuarela', ['#9ad1d4', '#f7c59f'], 'demos/estilos/acuarela.webp')`.

### Demos de filtros sobre fotos
Los filtros (Edición › Filtro, Generación › Filtro, Cámara y película, Texturas que se pueden ver sobre una foto) usan `demo: { kind: 'filter', css, overlay? }`:
- `css` es un `filter` de CSS. Lo que CSS no puede hacer (curvas por canal, duotonos, separación RGB, resplandor, halos) está en `src/components/demos/filters.ts` como filtros SVG y se usa con `url(#pf-<id>)`. `FilterDefs.tsx` los inserta una vez por página.
- `overlay` suma una capa: viñeta, grano, líneas de escaneo, bruma, trama, papel, lienzo, grunge, destello, daños de foto vieja (`aged`, `scratches`, `stains`, `tear`), fecha de cámara descartable (`date`), texto de póster (`trap`), paisaje de doble exposición (`double`), o una copia desenfocada de la foto (`bokeh`, `tilt`, `motion`) con una máscara que deja nítido el punto de foco.
- **Antes y después**: `demo: { kind: 'compare', before: { css, overlay? }, after: { css, overlay? } }` parte la foto al medio (izquierda antes, derecha después). Se usa en los **arreglos** (mejorar, ampliar, foto movida, exposición, restaurar, colorear, desenfocar el fondo, daños). Los **efectos** creativos (duotono, póster, foto antigua…) muestran solo el resultado con `kind: 'filter'`. Si la operación no se puede simular sobre una foto (cambiar el cielo, sticker, dispersión, enderezar), usa un esquema SVG.
- Las fotos de muestra están en `public/demos/fotos/` (dominio público o CC0, ver `CREDITOS.md`) y se listan en `src/components/demos/photos.ts` con su punto de foco. El usuario elige sobre cuál ver los filtros. Las tarjetas de filtros van siempre enteras; el paso "Intensidad" usa demos `{ kind: 'strength' }`, que muestran el efecto elegido en el área (el último paso a la vista con un filtro o un antes y después elegido; si no hay, uno de muestra) a esa fuerza.
- `npm test` verifica que cada `url(#pf-…)` (también los de `compare`) y cada esquema usado exista.

### Agregar una IA
1. Crear `src/engine/adapters/<id>.ts` que implemente `ModelAdapter`.
2. Sumarlo a `ADAPTERS` en `src/engine/adapters/index.ts`.
3. Documentar sus reglas en [02-modelos-de-ia.md](02-modelos-de-ia.md) y agregar un caso en los tests.

### Agregar un área (por ejemplo, "Mockups")
Crear `src/sections/imagenes/areas/mockups.ts` con sus pasos y sumarla a `areas` en `section.ts`. La página `/imagenes/mockups/` se genera sola.

### Agregar una sección nueva (por ejemplo, "Video")
1. Crear `src/sections/video/section.ts` con sus áreas y su catálogo.
2. Registrarla en `src/sections/index.ts`.
3. Si necesita un tipo de prompt nuevo, sumar un `AreaMode` y adaptadores para sus IAs (Sora, Veo, Kling…).
La portada, el menú, las rutas y el sitemap se actualizan solos.

### Niveles, recetas y asistente de un área
En `src/sections/imagenes/asistente/<area>.ts`: `stages` (cada paso en un solo nivel: lo verifica un test), `presets` (recetas, con `selections` como las guarda el constructor) y `assistant` (palabras clave, familias, autocompletado, refuerzos, pesos, ideas). Ver [09-asistente-ia.md](09-asistente-ia.md).

### Vista previa
`buildScene` (`src/components/preview/scene.ts`) es una función pura: se prueba sin navegador. Para que la vista previa reconozca un sujeto o un lugar nuevo, sumar la palabra (sin tildes, en singular) a `SUBJECT_GLYPHS` o `PLACES` en `glyphs.ts`. Las posiciones van en % y los tamaños en `cqh` (alto del cuadro), así escala igual en la columna y en la barra del celular.

### Escena 3D

Un área con `studio` (lista de `StudioZone`: id, título, ícono, frase y pasos) se arma como un set en una sola pantalla (`src/components/studio/Studio.tsx`). El constructor (`Builder.tsx`) sigue teniendo todo el estado; le pasa a `Studio` las zonas ya calculadas (pasos a la vista, cuántos tienen algo, lo elegido en pocas palabras) y una función que dibuja cada paso con el mismo `StepView` de siempre. El set usa CSS 3D: el escenario (`.st-stage`) da la perspectiva en `cqh`; el mundo (`.st-world`) gira; cada cosa se para en el piso con `translateZ` (más negativo = más lejos). Las cajas 3D no reciben toques (`pointer-events: none`), solo los marcadores. Para sumar una zona: agregarla a `ZONAS_GENERACION` (un test exige que las zonas cubran todos los pasos una sola vez) y, si tiene un objeto propio en el set, dibujarlo en `Stage` con su `Pin`.

### Traducir la web
Los textos de interfaz están en `src/i18n/es.ts`; el catálogo usa `{ es, en? }`. Para traducir: crear `en.ts`, completar los `en` del catálogo y agregar rutas por idioma (Astro i18n routing). Los prompts ya están en inglés.

## Rendimiento y SEO
- Páginas estáticas prerenderizadas, con el contenido del catálogo en el HTML (indexable).
- JS solo en el constructor y en "Mis prompts" (islas de Preact).
- Fuentes de las demos cargadas a demanda y recortadas a las letras de la muestra.
- Metadatos por página, canonical, Open Graph, JSON-LD (WebSite, WebApplication, FAQ, BreadcrumbList), sitemap y robots.txt.
