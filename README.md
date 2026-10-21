# Promptea

**Pedile a la IA exactamente lo que imaginás.**

Promptea es una web que traduce lo que elegís con botones y ejemplos visuales en prompts expertos para inteligencias artificiales de imágenes. No es lo mismo pedir "un flyer lindo" que "un flyer minimalista con tipografía condensada, paleta tierra y mucho espacio en blanco": Promptea te da ese vocabulario de diseñador y fotógrafo.

## Qué hace (fase 1: Imágenes)

- **Generación**: ilustraciones y fotos de cualquier tipo.
- **Edición**: prompts para retocar y transformar imágenes que ya tenés (quitar fondos, filtros, restaurar, montajes).
- **Diseño**: logos, flyers, posts, portadas, íconos y piezas de marca.

Cada opción (estilos, luz, cámara, composición, paletas, tipografías, filtros, texturas) tiene un ejemplo visual y una explicación corta. El prompt se adapta a la IA elegida: **Genérico** (cualquier IA), ChatGPT, Gemini, Meta AI, Midjourney, FLUX, Ideogram y Stable Diffusion.

Promptea no genera imágenes, no usa IA y no guarda nada en servidores: el historial y los favoritos quedan en tu navegador.

## Tecnología

[Astro](https://astro.build) (sitio estático) + [Preact](https://preactjs.com) en las partes interactivas, TypeScript, publicado en GitHub Pages.

```bash
npm install      # instalar dependencias (Node.js 22 o superior)
npm run dev      # servidor local en http://localhost:4321
npm test         # tests del motor de prompts
npm run build    # verificar tipos y construir el sitio en dist/
```

## Documentación

Toda la investigación y las decisiones están en [`docs/`](docs/README.md):
ingeniería de prompts, reglas de cada IA, fundamentos de diseño gráfico, decisiones, arquitectura y cómo publicar.

## Publicar

En Windows: doble clic en `publicar.bat`. GitHub Actions construye y publica la web en GitHub Pages. Detalles en [docs/06-github.md](docs/06-github.md).

## Contribuir

Promptea está pensado para crecer con nuevas secciones (video, webs, juegos, cursos…). Mirá [CONTRIBUTING.md](CONTRIBUTING.md) y [docs/05-arquitectura.md](docs/05-arquitectura.md).

## Licencia

[MIT](LICENSE)
