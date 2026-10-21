# Decisiones del proyecto

> Registro de decisiones de producto y técnicas. Cada una con su motivo, para no volver a discutirlas en chats futuros.
> Formato: fecha · decisión · por qué. Las más nuevas, abajo.

## Producto (21/10/2026, respuestas de Gonzalo)

| # | Decisión | Por qué |
|---|---|---|
| P1 | **Selector de IA** con opción **Genérico** para IAs no listadas. IAs: Genérico, ChatGPT, Gemini, Meta AI, Midjourney, FLUX, Ideogram, Stable Diffusion. | Cada IA tiene su sintaxis; Genérico garantiza que el prompt sirva en cualquier otra. Meta AI se sumó porque mucha gente la usa desde WhatsApp e Instagram. |
| P2 | Web **en español**, preparada para traducir (inglés y otros) **más adelante**. No se traduce nada por ahora. | Público inicial hispanohablante; la arquitectura de textos ya separa la interfaz (`src/i18n/`). |
| P3 | Prompt **en inglés**. Español solo si el usuario lo pide, con aviso de que no se recomienda. | Los modelos de imagen siguen mejor el inglés. |
| P4 | La web **solo arma prompts**. No genera imágenes, no tiene IA ni API, no recibe imágenes del usuario. | Simplicidad, costo cero, privacidad. El usuario prueba el prompt en la IA que ya usa. |
| P5 | Todo se arma con **botones y plantillas** (más campos de texto libre para el sujeto). | Coherente con P4: sin IA en la web. |
| P6 | **Ejemplos visuales** de cada opción (tipografía, estilo, color, luz, filtros, texturas, composición). | Elegir viendo, no leyendo: es el corazón del producto. |
| P7 | **Sin login.** Historial y favoritos en el navegador (localStorage). | Cero fricción y cero datos personales. |
| P8 | **Sin monetización** por ahora. | Foco en el producto. |
| P9 | Público: principiantes y diseñadores, pero el objetivo es que **alguien sin conocimientos de diseño logre un buen resultado**. La web enseña en contexto (cada paso explica por qué importa; cada opción, para qué sirve). Hay modo **Simple** y **Avanzado**. | El manual completo queda para más adelante (no gastar tokens ahora). |
| P10 | **Identidad visual provisoria** (violeta + coral, globo de diálogo con destello). Se pule después. | Prioridad: funcionalidad. Cambiar los tokens de `src/styles/global.css` y `src/components/Logo.astro` alcanza para rediseñar. |
| P11 | Proyecto **open source y modular**: nuevas secciones (video, juegos, webs, cursos) sin reescribir lo existente. | Ver [05-arquitectura.md](05-arquitectura.md). |

## Técnicas (21/10/2026)

| # | Decisión | Por qué |
|---|---|---|
| T1 | **Astro 7** (sitio estático) + **Preact** solo en las partes interactivas (constructor y "Mis prompts"). TypeScript estricto. | HTML estático = SEO y velocidad excelentes. Preact pesa ~4 KB y usa la misma sintaxis que React (fácil para colaboradores). Todo el JS del sitio pesa ~70 KB sin comprimir. |
| T2 | **GitHub Pages** con GitHub Actions (`.github/workflows/deploy.yml`). Dominio propio después: alcanza con crear `public/CNAME`. | Gratis. `astro.config.mjs` detecta solo la URL (usuario, repo o dominio). |
| T3 | **`publicar.bat`**: doble clic para subir los cambios; GitHub publica la web solo. | Pedido de Gonzalo: un ejecutable que publique automáticamente. |
| T4 | **Motor desacoplado**: elecciones → especificación neutral (`PromptSpec`) → **adaptador por IA**. | Sumar una IA = un archivo. El conocimiento experto (catálogo) no se duplica. |
| T5 | **Catálogo como datos** (`src/sections/imagenes/library/`), con fragmento en inglés y español, explicación y demo. | Contenido editable sin tocar la lógica; fácil de revisar y ampliar. |
| T6 | Demos **generadas con código** cuando se puede: tipografías reales de Google Fonts (cargadas solo al verse y solo con las letras de la muestra), paletas, esferas iluminadas con CSS, filtros CSS sobre una imagen de muestra, texturas SVG y esquemas SVG. | Cero imágenes pesadas, cero licencias de terceros, se ven bien en modo claro y oscuro. |
| T7 | Los **estilos artísticos y de diseño** muestran por ahora un degradado con los colores del estilo y el cartel "ejemplo en preparación". | Necesitan imágenes reales. Pendiente decidir la fuente (ver "Pendientes"). Cada opción ya tiene el lugar para su imagen (`demo.src`). |
| T8 | **Texto libre del usuario** (sujeto, lugar, acción) va tal cual al prompt. Se le sugiere escribir en inglés si puede. | Sin IA no hay traducción automática (P4). Los modelos actuales entienden bien mezclas de idiomas. |
| T9 | **Tests** del motor con Vitest (`npm test`). | Cada IA tiene reglas finas (por ejemplo, `--ar` al final en Midjourney): los tests evitan romperlas. |
| T10 | Licencia **MIT**. | La más simple y permisiva para un proyecto abierto. |

## Pendientes (a decidir con Gonzalo)

1. **Imágenes de ejemplo** para estilos artísticos y de diseño (~65 imágenes): generarlas con IA una sola vez con prompts de Promptea (coherentes entre sí), usar fotos libres (Unsplash/Pexels) o una mezcla.
2. **Nombre definitivo** y dominio.
3. **Traducción en el navegador** (API Translator de Chrome, local y gratis) para traducir el texto libre del usuario: ¿cuenta como "IA dentro de la web"?
