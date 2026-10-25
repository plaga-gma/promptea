# Investigación para el rediseño (25/10/2026)

> Base del rediseño "modo juego" de Promptea: cómo se escriben hoy los prompts largos y óptimos, qué se edita en las fotos, qué tendencias de diseño pide la gente y qué IA puede correr gratis dentro de una web estática. Las decisiones que salen de acá están en [04-decisiones.md](04-decisiones.md) (T19 a T25).

## 1. Cómo se escribe un prompt largo y óptimo (2026)

**Google, Nano Banana (Gemini 2.5/3 Image).** Fórmula: **sujeto + acción + lugar + composición + estilo**, en frases descriptivas, no en listas de palabras sueltas. Pedir en positivo ("una calle vacía" en vez de "sin autos"). El texto que tiene que aparecer va entre comillas, con la tipografía descripta. En edición: decir qué cambia y, sobre todo, **qué tiene que quedar igual**, y una instrucción por oración.

**OpenAI, GPT Image 2.** Orden que mejor funciona: **escena o fondo → sujeto → detalles → restricciones**. Decir para qué se va a usar la imagen (un póster, una miniatura de YouTube) porque cambia la composición. En edición: "cambiá solo X; mantené todo lo demás igual" y repetir lo que se preserva en cada vuelta. Los textos, deletreados y entre comillas. Para logos: formas simples, que funcionen a un color y en tamaño chico.

**Frases de calidad que los modelos siguen bien** (las usa el "Prompt largo y óptimo", ver T21):
- Foto: texturas naturales y proporciones realistas, materiales fieles, punto focal claro.
- Render 3D: materiales físicamente correctos, iluminación global suave.
- Ilustración y pintura: trazo limpio y seguro, pincelada visible.
- Edición: edición prolija e invisible; respetar luz, perspectiva, color y grano originales; conservar la resolución.
- Diseño: jerarquía visual clara, espacio en blanco y márgenes parejos, tipografía legible con la ortografía correcta, paleta limitada.
- Por pieza: un logo simple y recordable; una miniatura de alto contraste que se lea de un vistazo; un flyer con la información clave legible a distancia; un patrón continuo sin bordes visibles.

Más de 6 frases de calidad diluyen lo importante: el asistente pone primero las específicas de lo elegido y corta ahí.

Fuentes: [Google Cloud, guía de Nano Banana](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-nano-banana) · [OpenAI Cookbook, guía de prompts de imagen](https://developers.openai.com/cookbook/examples/multimodal/image-gen-models-prompting-guide) · [i-scoop, GPT Image 2](https://www.i-scoop.eu/prompting-gpt-image-2-like-a-pro-guide/) · [Pixelbin, guía Nano Banana](https://www.pixelbin.io/blog/nano-banana-prompt-guide).

## 2. Qué se le edita a las fotos (tendencias 2026)

Lo más pedido en ChatGPT, Gemini y apps de edición, además de los arreglos clásicos (quitar objetos, fondo, cielo, restaurar):
- **Look imperfecto de rollo**: grano, flash, desenfoque, nada "demasiado perfecto".
- **Muñeco en caja** (action figure con accesorios y packaging).
- **Viaje en el tiempo**: ponerse en otra época con ropa y peinado de esa época.
- **Afiche de película** y **página de scrapbook**.
- **Efecto de velocidad** y **look de videocámara Y2K**.
- **Personaje coherente** en varias imágenes (hoja de personaje).
- Ambientes: **amueblar un ambiente vacío**, ordenar el desorden, pintar paredes.
- Producto: **producto en una escena** de estilo de vida, **mi diseño sobre un producto** (mockup).
- Arreglos chicos que la gente busca por nombre: quitar gente del fondo, quitar cables, quitar reflejos de anteojos, abrir ojos cerrados.

Se sumaron 24 operaciones con estos nombres (grupos nuevos "Tendencias virales" y "Casas y ambientes").

Fuentes: [TechRepublic, tendencias de edición con IA 2026](https://www.techrepublic.com/article/news-ai-photo-editing-trends-2026/) · [TechRepublic, edición con ChatGPT](https://www.techrepublic.com/article/news-chatgpt-photo-editing-trends-2026/) · [eWeek](https://www.eweek.com/news/ai-photo-editing-trends-2026/).

## 3. Tendencias de diseño gráfico 2026

Íconos propios, tipografías mono, stickers y parches, fotografía cinematográfica, tipografía expresiva y gigante, degradados, formas orgánicas, diseño lúdico, minimalismo audaz, retro-futurismo, maximalismo, 3D y claymorphism, mezcla de técnicas (collage, zine, riso), regreso de las serif y estética eco.

Se sumaron 16 estilos de diseño (bento, claymorphism, neumorfismo, anti-diseño, collage zine, web de los 90, art nouveau, art déco, pop art, tech/HUD, eco, lujo oscuro, holográfico, risografía, monolínea, stickers), 10 tipografías reales de Google Fonts, 18 piezas (carrusel, packaging, ticket, afiche de película, pack de stickers…) y elementos gráficos nuevos.

Fuentes: [Jukebox, 20 tendencias de diseño 2026](https://www.jukeboxprint.com/blog/20-of-the-biggest-graphic-design-trends-for-2026) · [Adobe Express](https://www.adobe.com/express/learn/blog/graphic-design-trends-2026) · [DesignRush](https://www.designrush.com/trends/state-of-design).

## 4. Conceptos de imagen sumados

Además de lo anterior: tipos de imagen nuevos (escultura, figura coleccionable, sticker, ícono 3D, página de cómic, hoja de personaje, storyboard, mapa ilustrado, emoji, mundo en miniatura), 36 estilos (con un grupo "Tendencias 2026"), 10 luces (borde, neón de dos colores, linterna, cáusticas, aurora, relámpago, fluorescente, vitral, estroboscópica, tres puntos), 12 paletas, 8 atmósferas, 8 texturas, 12 materiales, 6 cámaras, 5 composiciones, **técnicas fotográficas** (larga exposición, barrido, congelado, light painting…) y **vestuario**. En total el catálogo pasó a unas **1.150 opciones** (456 en Generación, 299 en Edición, 392 en Diseño), sin contar subopciones.

## 5. IA dentro de una web estática y gratis

| Opción | Qué es | Peso para el usuario | Dónde anda | Costo |
|---|---|---|---|---|
| **Asistente de reglas** (propio) | Palabras clave, familias de opciones que combinan y puntaje | 0 (es parte del sitio, ~30 KB) | En todos lados | 0 |
| **Chrome Translator API** | Traductor que trae Chrome | Paquete de idioma, una vez | Chrome de escritorio | 0 |
| **Chrome Prompt API (Gemini Nano)** | Modelo de lenguaje del navegador | 2,7 a 4 GB, una vez; pide 16 GB de RAM o 4 GB de video | Chrome de escritorio, no iPhone | 0 |
| **WebLLM / Transformers.js** (Qwen3 0,6B) | Modelo chico que baja la web | ~335 MB por usuario | Navegadores con WebGPU | 0 |
| API en la nube (OpenAI, Gemini…) | Modelo grande en un servidor | 0 | En todos lados | Pago por uso + clave secreta: no entra en GitHub Pages sin servidor |

Conclusión: el corazón tiene que ser un **asistente de reglas** que anda en cualquier celular sin descargar nada; la IA del navegador se usa solo donde las reglas no alcanzan (traducir lo que el usuario escribe con sus palabras) y solo si ya está disponible o el usuario la activa. Ver [09-asistente-ia.md](09-asistente-ia.md).

Fuentes: [Chrome, IA integrada](https://developer.chrome.com/docs/ai/get-started) · [Chrome, traducción en el dispositivo](https://developer.chrome.com/docs/ai/translate-on-device) · [Gemini Nano en Chrome](https://pasqualepillitteri.it/en/news/3145/gemini-nano-chrome-built-in-ai-client-side-en) · [Pinggy, LLM en el navegador con WebGPU](https://pinggy.io/blog/run_llm_in_browser_webgpu/).

## 6. Que parezca un juego (sin perder lo fácil)

Lo que hace que un formulario largo se sienta como juego, aplicado a Promptea:
- **Niveles** en vez de una lista eterna: un mapa con 4 a 6 paradas por área y un final.
- **Barra de energía** ("Poder del prompt") que sube con cada elección, con rangos (Chispa → Leyenda) y papelitos al subir.
- **Atajos**: "Contale tu idea", "Sorprendeme" y recetas de un toque, para no empezar en blanco.
- **Logros** chicos que enseñan a usar las funciones (notas, subopciones, recorrer todos los niveles).
- **Respuesta inmediata**: la vista previa cambia con cada toque.
- Siempre se puede saltar de nivel, deshacer y ver el prompt: el juego no frena a quien ya sabe.
