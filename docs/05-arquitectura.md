# Arquitectura

> Cómo está organizado el código y cómo se extiende. Pensado para colaboradores y para chats futuros.

## Mapa

```
promptea/
├── .github/workflows/deploy.yml   Publica en GitHub Pages en cada push a main
├── docs/                          Investigación y decisiones (este folder)
├── public/                        Archivos estáticos (favicon, imagen de muestra de filtros, demos/)
├── publicar.bat                   Doble clic: sube los cambios a GitHub
├── src/
│   ├── config/site.ts             Nombre, descripción, idioma (todo lo "de marca")
│   ├── engine/                    Motor de prompts: no sabe nada de la interfaz
│   │   ├── types.ts               Tipos: Section, Area, Step, Option, PromptSpec, ModelAdapter
│   │   ├── build.ts               Elecciones → PromptSpec (especificación neutral)
│   │   ├── color.ts               Armonías de color y contraste WCAG
│   │   └── adapters/              Un archivo por IA (generic, chatgpt, gemini, meta, midjourney…)
│   ├── sections/
│   │   ├── index.ts               Registro de secciones (las páginas salen de acá)
│   │   └── imagenes/
│   │       ├── section.ts         La sección y sus áreas
│   │       ├── areas/             generacion.ts, edicion.ts, diseno.ts (pasos de cada área)
│   │       └── library/           Catálogo: estilos, luz, cámara, color, tipografía, diseño, edición
│   ├── components/
│   │   ├── builder/               Constructor (Preact): Builder, StepView, PromptPanel
│   │   ├── demos/                 Demos visuales y esquemas SVG
│   │   └── *.astro                Header, Footer, Logo, AreaCard
│   ├── i18n/es.ts                 Textos de la interfaz
│   ├── lib/                       storage.ts (historial/favoritos), url.ts (base del sitio)
│   ├── layouts/Base.astro         HTML base + SEO (canonical, Open Graph, JSON-LD)
│   └── pages/                     Rutas: /, /[section]/, /[section]/[area]/, /mis-prompts/, 404, robots.txt
└── tests/engine.test.ts           Tests del motor y del catálogo
```

## Flujo de datos

```
Usuario elige (botones / texto)
        │  Selections  { pasoId: id | ids | texto | campos }
        ▼
buildSpec(area, selections)            src/engine/build.ts
        │  PromptSpec  { segmentos por rol, formato, evitar, colores, textos }
        ▼
adapter.format(spec, {lang, creativity})   src/engine/adapters/<ia>.ts
        │  { prompt, negative?, notes[] }
        ▼
PromptPanel: copiar · abrir la IA · favoritos · historial
```

Los **roles** (`SegmentRole`) siguen la anatomía de un prompt de [01-ingenieria-de-prompts.md](01-ingenieria-de-prompts.md) §2 y se ordenan por prioridad (`ROLE_ORDER`). Cada adaptador decide cómo escribirlos: oraciones (Genérico, Gemini, FLUX, Meta), líneas etiquetadas (ChatGPT), etiquetas con pesos (Stable Diffusion) o texto + parámetros (Midjourney).

## Cómo extender

### Agregar una opción al catálogo
En el archivo de `library/` que corresponda:
```ts
o('id-unico', 'Nombre visible', 'fragment in English', 'fragmento en español', {
  hint: 'Para qué sirve, en una línea.',
  demo: { kind: 'swatch', colors: ['#...'] },   // o font, light, filter, texture, diagram, ratio, gradient, image
});
```
`npm test` verifica que no haya ids repetidos y que tenga ambos idiomas.

### Agregar una imagen de ejemplo a un estilo
Guardar la imagen en `public/demos/estilos/<id>.webp` (≈ 400×300, < 40 KB) y pasar la ruta como tercer argumento de `img()`:
`img('Acuarela', ['#9ad1d4', '#f7c59f'], 'demos/estilos/acuarela.webp')`.

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

### Traducir la web
Los textos de interfaz están en `src/i18n/es.ts`; el catálogo usa `{ es, en? }`. Para traducir: crear `en.ts`, completar los `en` del catálogo y agregar rutas por idioma (Astro i18n routing). Los prompts ya están en inglés.

## Rendimiento y SEO
- Páginas estáticas prerenderizadas, con el contenido del catálogo en el HTML (indexable).
- JS solo en el constructor y en "Mis prompts" (islas de Preact).
- Fuentes de las demos cargadas a demanda y recortadas a las letras de la muestra.
- Metadatos por página, canonical, Open Graph, JSON-LD (WebSite, WebApplication, FAQ, BreadcrumbList), sitemap y robots.txt.
