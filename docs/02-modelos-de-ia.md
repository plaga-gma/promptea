# Modelos de IA destino y sus adaptadores

> Cómo escribe Promptea el mismo prompt para cada IA. Última revisión: 21/10/2026.
> Los modelos cambian rápido: revisar esta tabla cada vez que salga una versión nueva.

## Resumen

| Selector | Modelos (oct. 2026) | Estilo de prompt | Negativos | Aspecto | Texto |
|---|---|---|---|---|---|
| **Genérico** | Cualquier IA no listada | Lenguaje natural, frases claras, sin sintaxis especial | En positivo + una frase "Avoid:" corta | En palabras ("vertical 4:5") | Entre comillas dobles |
| **ChatGPT** | GPT Image 2 (`gpt-image-2`) | Segmentos etiquetados en líneas; uso declarado; restricciones explícitas | Frase de restricciones ("no watermark, no extra text") | En palabras + tamaño sugerido | Comillas, "verbatim, once" |
| **Gemini** | Nano Banana 2 (Gemini 3.1 Flash Image), Nano Banana Pro | Párrafo narrativo; verbo fuerte al inicio en edición | Solo en positivo | En palabras (acepta 1:1 a 21:9 y extremos 1:8) | Comillas + fuente nombrada |
| **Meta AI** | Muse Image (jul. 2026), dentro de WhatsApp, Instagram, Facebook, Messenger y meta.ai | Pedido conversacional en narrativa clara, empezando con "Create an image of…" | Solo en positivo | En palabras | Comillas dobles |
| **Midjourney** | V8.2 (default desde jul. 2026) | Descripción natural, más larga y específica que en V7; parámetros al final | `--no a, b` | `--ar W:H` | Solo comillas dobles; 2–4 palabras |
| **FLUX** | FLUX.2 (pro, flex, dev, klein), FLUX Kontext | Lenguaje natural; lo crítico primero; acepta HEX y JSON | No soporta: todo en positivo | En palabras (se fija en la app) | Comillas + tipografía + ubicación |
| **Stable Diffusion** | SDXL, SD 3.5 y derivados (A1111, ComfyUI, Forge) | Etiquetas separadas por comas; pesos `(x:1.2)` | Campo aparte "Negative prompt" | Se fija en la app | Débil: se recomienda agregar el texto después |
| **Ideogram** | Ideogram 3.0 / 4.5 | Resumen de una oración, luego detalles; < 150 palabras en 3.0 | Campo aparte (negative prompt) | Se fija en la app | Su fuerte: comillas dentro del sujeto |

Las IAs que no están en la lista (Adobe Firefly, Leonardo, Grok, Seedream, Qwen-Image, Recraft, Canva, Copilot/Designer, etc.) usan **Genérico**. Más adelante se pueden sumar adaptadores propios: es un archivo nuevo en `src/engine/adapters/`.

## Reglas por adaptador

### Genérico (seguro para cualquier IA)
Objetivo: que funcione igual en un modelo de difusión antiguo que en un LLM multimodal.
- Lenguaje natural en inglés, oraciones cortas, una idea por oración.
- Orden fijo: tipo + sujeto → acción → entorno → composición → luz → color → estilo → mood → acabado → texto → formato.
- Nada de `--parámetros`, pesos, JSON ni etiquetas de bloque.
- Relación de aspecto en palabras: "Vertical format, 4:5 aspect ratio."
- Lo que hay que evitar, primero redactado en positivo dentro de la descripción; si queda algo, una sola frase final "Avoid: …" con 3 términos como máximo.
- Texto literal entre comillas dobles, corto.
- Longitud objetivo: 40 a 120 palabras.

### ChatGPT (GPT Image 2)
- Bloques etiquetados en líneas: `Purpose`, `Scene`, `Subject`, `Style`, `Composition`, `Lighting`, `Color`, `Text`, `Constraints`.
- Declarar el uso: "Purpose: Instagram flyer for a bakery opening."
- Texto: "Render the text exactly as written, once: "…"".
- Restricciones explícitas: "No watermark, no extra text, no logos except the requested one."
- Edición: "Change only … Keep everything else the same: …" y repetir la lista de preservación.
- Tamaños sugeridos: 1024×1024, 1024×1536 (vertical), 1536×1024 (horizontal).
- Fondo transparente: pedir "transparent background, isolated subject, no shadow" (disponible en la API).

### Gemini (Nano Banana)
- Fórmula de generación: sujeto + acción + lugar + composición + estilo, escrita como **narrativa**, no como lista.
- Encuadre positivo siempre ("empty street", nunca "no cars").
- Edición: empezar con verbo ("Remove…", "Replace…", "Transform…") y nombrar lo que se mantiene.
- Texto: entre comillas, con fuente nombrada o descrita.
- Controles de "director creativo": luz, cámara, lente, gradación de color y materialidad, con vocabulario fotográfico.

### Meta AI (Muse Image)
Es la IA que más gente tiene a mano sin saberlo: está en WhatsApp, Instagram, Facebook y Messenger. Desde julio de 2026 usa **Muse Image**, el primer modelo de imagen de Meta Superintelligence Labs, que razona el pedido antes de generar, edita por conversación, mezcla varias fotos de referencia y renderiza texto (incluso infografías).
- Abrir con una orden explícita: "Create an image of…" (en el chat también sirve "Imagine…"). Sin esa orden, en WhatsApp a veces responde con texto en vez de imagen.
- Narrativa breve y concreta (40–90 palabras): el usuario lo pega desde el celular, y los chats premian pedidos directos.
- Encuadre positivo, sin parámetros ni pesos.
- Formato en palabras ("vertical 9:16 format for a story").
- Edición: adjuntar la foto en el chat y empezar con el verbo ("Remove…", "Change only…"), con lista de preservación.
- Texto literal entre comillas dobles y corto.
- Sugerencia para el usuario: iterar en el mismo chat con frases cortas ("make the background warmer").

### Midjourney (V8)
- Descripción natural específica (V8 rinde mejor con prompts más largos que V7).
- Parámetros al final, sin puntuación ni texto después: `--ar 4:5 --no text, watermark`.
- `--raw` cuando se busca un resultado literal o fotográfico sin "embellecer".
- `--s` (stylize, 0–1000, default 100): Promptea lo mapea al control "Libertad creativa" (baja = 50, media = 100, alta = 400).
- Texto: solo comillas dobles; 2–4 palabras; sumar contexto ("a sign that says…"). Si el texto sale ilegible, bajar `--s` o usar `--raw`.
- No usar: multi-prompt `::` (no soportado desde V7), `--q 4`, `--cref` (V6).
- Edición: Midjourney no edita por texto puro. Promptea genera el prompt del resultado final y le indica al usuario usar el Editor o `--sref` / `--oref` con su imagen.

### FLUX (FLUX.2 / Kontext)
- Estructura sujeto → acción → estilo → contexto, lo crítico primero.
- Colores en HEX junto al nombre ("warm terracotta #C8553D").
- Sin prompt negativo: todo lo que se quiera evitar se reescribe en positivo.
- Edición (Kontext / FLUX.2 con referencia): instrucción directa + preservación explícita.

### Stable Diffusion (SDXL / SD 3.5)
- Prompt de etiquetas: `subject, attributes, setting, style, lighting, color, quality tags`.
- Pesos solo en lo central: sujeto `(…:1.2)`, estilo `(…:1.1)`.
- Etiquetas de calidad moderadas: `highly detailed, sharp focus` (evitar las listas infinitas de "masterpiece, best quality…", que en SDXL aportan poco).
- Negativo por defecto: `blurry, low quality, deformed, extra fingers, watermark, text` (sin `text` si se pidió texto).
- Bloques de 77 tokens: lo importante en los primeros ~60 tokens.
- Edición: img2img o inpainting; el prompt describe la imagen final.

### Ideogram
- Primera oración = resumen de la imagen (es lo que expande "Magic Prompt").
- Orden: resumen → sujeto (con texto entre comillas) → pose/acción → elementos secundarios → fondo → luz → encuadre → acabado.
- Menos de 150 palabras en Ideogram 3.0.
- Aspecto y negativo se configuran en la interfaz; Promptea los muestra como notas aparte.

## Enlaces "Abrir en…"

| IA | Enlace | ¿Acepta el prompt por URL? |
|---|---|---|
| ChatGPT | https://chatgpt.com/ | Sí, `?q=` (se copia también al portapapeles) |
| Gemini | https://gemini.google.com/app | No: se copia al portapapeles |
| Meta AI | https://www.meta.ai/ (o el chat de Meta AI en WhatsApp) | No: se copia al portapapeles |
| Midjourney | https://www.midjourney.com/imagine | No: se copia al portapapeles |
| FLUX | https://playground.bfl.ai/ | No |
| Ideogram | https://ideogram.ai/ | No |
| Stable Diffusion | (local) | No |

## Fuentes
Ver [01-ingenieria-de-prompts.md](01-ingenieria-de-prompts.md#fuentes), y para Meta AI:
- Mediaweek, *Meta rolls out Muse Image across Meta AI* (8/7/2026) — https://www.mediaweek.com.au/meta-rolls-out-muse-image-across-meta-ai/
- Bloomberg, *Meta debuts AI image-generation model inside chatbot, Instagram* — https://news.bloomberglaw.com/tech-and-telecom-law/meta-debuts-ai-image-generation-model-inside-chatbot-instagram
