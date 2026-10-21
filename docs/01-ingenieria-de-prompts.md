# Ingeniería de prompts para imágenes

> Investigación base de Promptea (pilar 1). Última revisión: 21/10/2026.
> Las reglas específicas de cada IA están en [02-modelos-de-ia.md](02-modelos-de-ia.md).

## 1. Cómo "leen" un prompt los modelos de imagen

Hoy conviven dos familias de modelos, y escribir bien depende de saber a cuál le hablamos.

| Familia | Ejemplos | Cómo entiende el texto | Consecuencia para el prompt |
|---|---|---|---|
| **Difusión con codificador de texto clásico** | Stable Diffusion 1.5 / SDXL, Midjourney (versiones viejas) | Un codificador tipo CLIP convierte el texto en un vector. CLIP procesa bloques de 77 tokens y da más peso a lo que aparece primero. | Funcionan bien las listas de palabras clave separadas por comas, los pesos `(palabra:1.3)` y el prompt negativo. Las frases largas se diluyen. |
| **Difusión/transformer con codificador de lenguaje grande** | FLUX, Stable Diffusion 3.5, Ideogram, Midjourney V8 | Un modelo de lenguaje (tipo T5 o un LLM) entiende gramática, relaciones espaciales y texto literal. | Conviene lenguaje natural descriptivo y concreto. El orden sigue importando: lo primero pesa más. |
| **Modelos multimodales nativos (conversacionales)** | GPT Image (ChatGPT), Gemini / Nano Banana, Meta AI (Muse Image) | La generación de imagen es parte de un LLM, que razona sobre la instrucción, sigue restricciones y mantiene el contexto de la charla. | Rinden mejor con instrucciones claras, segmentos etiquetados, la intención de uso y restricciones explícitas ("cambiá solo X"). Iteran por conversación. |

**Regla de oro para Promptea:** el contenido experto es el mismo para todos (qué estilo, qué luz, qué paleta); lo que cambia por modelo es el *formato* en que se entrega. Por eso el motor arma primero una estructura neutral y después un *adaptador* la escribe en el dialecto de cada IA.

## 2. Anatomía de un buen prompt de imagen

Las guías oficiales de OpenAI, Google, Black Forest Labs, Ideogram y Hugging Face coinciden en una estructura de "base primero, decoración después". La anatomía que adopta Promptea, en orden de prioridad:

1. **Tipo de imagen / medio**: foto, ilustración, render 3D, póster, logo. Fija todo lo demás.
2. **Sujeto principal y sus atributos**: qué es, cómo es, materiales, colores propios ("una taza de cerámica esmaltada verde oliva", no "una taza").
3. **Acción o pose**: qué hace, hacia dónde mira, cómo se relaciona con otros elementos.
4. **Entorno y contexto**: dónde está, época, fondo.
5. **Composición y encuadre**: plano, ángulo, ubicación en el cuadro, espacio negativo.
6. **Cámara y lente** (solo fotos/realismo): focal, profundidad de campo, tipo de cámara o película.
7. **Iluminación**: tipo, dirección, temperatura, dureza.
8. **Color**: paleta, armonía, saturación, códigos HEX si el modelo los acepta.
9. **Estilo estético**: movimiento artístico, técnica, época, corriente de diseño.
10. **Atmósfera / mood**: emoción que debe transmitir.
11. **Acabado y textura**: grano de película, papel, brillo, mate.
12. **Texto en la imagen**: literal y entre comillas, con tipografía y ubicación.
13. **Restricciones**: qué no debe aparecer, qué debe preservarse.
14. **Formato**: relación de aspecto y uso final.

No todos los prompts necesitan los 14 bloques. Un prompt corto deja improvisar al modelo (útil para explorar); uno largo da control. Promptea muestra los bloques esenciales en **modo simple** y suma cámara, textura y ajustes finos en **modo avanzado**.

## 3. Principios que aplica el motor de Promptea

1. **Concreto le gana a abstracto.** "Lindo" o "profesional" no le dicen nada visual al modelo. "Paleta pastel de tres colores, tipografía sans geométrica, mucho espacio en blanco" sí. Esta es la premisa del producto: traducir adjetivos vagos en vocabulario visual.
2. **Lo importante, primero.** Todos los modelos ponderan más el inicio del prompt. El motor ordena los segmentos por prioridad y nunca entierra el sujeto al final.
3. **Una idea por imagen.** Mezclar muchas ideas sin relación produce imágenes confusas. Promptea limita las selecciones múltiples en las categorías que se pisan entre sí (por ejemplo, máximo 2 estilos).
4. **Sin contradicciones.** "Minimalista" + "maximalista", o "luz de mediodía" + "noche de neón", se cancelan. El catálogo marca incompatibilidades y avisa al usuario.
5. **Encuadre positivo.** Describir lo que se quiere ("calle vacía") funciona mejor que prohibir ("sin autos"), sobre todo en modelos sin prompt negativo, donde nombrar algo puede invocarlo. Promptea redacta en positivo y usa negativos solo donde el modelo los soporta.
6. **Decir para qué es.** Declarar el uso (flyer, portada, ícono de app) fija el nivel de pulido y el tipo de composición, especialmente en GPT Image y Gemini.
7. **Describir como si ya existiera.** Para resultados realistas, describir el producto o la escena terminada, no "un concepto de".
8. **Vocabulario técnico de cada disciplina.** Fotografía (lentes, planos, esquemas de luz), arte (técnicas y movimientos) y diseño (estilos, retícula, jerarquía) son los atajos más eficientes hacia un resultado preciso.
9. **Dosificar los descriptores.** Más de 2 o 3 descriptores por bloque diluye cada uno. Mejor pocos y precisos.
10. **Iterar de a un cambio.** Al refinar, cambiar una sola variable por vez y repetir lo que debe mantenerse (los modelos "derivan" entre iteraciones).

## 4. Técnicas avanzadas (y dónde aplican)

| Técnica | Qué hace | Dónde sirve |
|---|---|---|
| **Pesos** `(término:1.3)` | Sube o baja la influencia de un concepto. `((x))` ≈ ×1.21. | Stable Diffusion (A1111, ComfyUI, Forge). En FLUX casi no hace falta. |
| **Prompt negativo** | Lista de lo que se quiere evitar, en un campo aparte. | Stable Diffusion, Ideogram, Leonardo. Midjourney con `--no`. |
| **Parámetros** | Relación de aspecto, estilización, variedad, etc. | Midjourney (`--ar`, `--s`, `--raw`, `--no`, `--chaos`…). |
| **Imágenes de referencia** | Transfieren estilo, personaje u objeto. | Midjourney `--sref` / `--oref`, Gemini (hasta 14 referencias), GPT Image, FLUX Kontext/2. |
| **Prompt estructurado (JSON)** | Separa escena, sujetos, paleta, cámara en campos. | FLUX.2 e Ideogram 4.5 lo aceptan; útil para escenas complejas y marcas. |
| **Segmentos etiquetados** | "Escena: … / Sujeto: … / Restricciones: …" en líneas separadas. | GPT Image, Gemini: mejoran la adherencia en pedidos complejos. |
| **Códigos HEX** | Color exacto de marca. | FLUX.2, GPT Image, Gemini, Ideogram lo interpretan bien; SD y Midjourney de forma aproximada (conviene sumar el nombre del color). |
| **Semilla (seed)** | Repite un resultado para variar una sola cosa. | Midjourney `--seed`, Stable Diffusion, FLUX. |
| **Iteración conversacional** | Refinar con mensajes cortos sobre la imagen anterior. | ChatGPT, Gemini. Promptea sugiere frases de seguimiento. |

## 5. Texto dentro de la imagen

Es el punto débil histórico y hoy está mayormente resuelto en GPT Image, Gemini, Ideogram, FLUX.2 y Midjourney V8. Buenas prácticas consolidadas:

- Poner el texto literal **entre comillas dobles** (Midjourney V8 solo reconoce comillas dobles).
- Textos cortos: 2 a 4 palabras se renderizan de forma confiable; frases largas se degradan.
- Indicar **tipografía** (estilo o nombre: "sans serif geométrica gruesa"), **color**, **tamaño relativo** y **ubicación** ("titular arriba al centro").
- Pedir que aparezca **una sola vez** y **sin texto adicional**.
- Deletrear marcas o palabras inusuales.
- Dar contexto físico ("un cartel que dice…") mejora la ubicación.
- Si el texto es largo o crítico, generar la pieza con espacio reservado y agregar el texto después en un editor. Promptea ofrece esta opción como "dejar espacio para texto".

## 6. Prompts de edición

Cuando el usuario ya tiene una imagen y la lleva a otra IA junto con el prompt:

1. **Empezar con un verbo de operación**: quitar, reemplazar, agregar, transformar, restaurar, expandir, colorear.
2. **Delimitar el cambio**: "cambiá solo el fondo".
3. **Lista de preservación**: "mantené sin cambios la cara, la pose, la ropa, la iluminación y el encuadre". Repetirla en cada iteración.
4. **Integración física** al agregar o montar elementos: igualar luz, perspectiva, escala, sombras y grano.
5. **Intensidad**: sutil, moderada o fuerte (los filtros y retoques "a fondo" suelen verse artificiales).
6. **Varias imágenes**: nombrarlas por índice ("Imagen 1: foto del producto; Imagen 2: fondo") y decir cómo interactúan.
7. **Transferencia de estilo**: "conservá exactamente el contenido y la composición y recreala en estilo…".

Modelos con edición real por texto: GPT Image, Gemini/Nano Banana, FLUX Kontext/FLUX.2, Qwen-Image-Edit. Midjourney edita con su Editor y referencias; Stable Diffusion con img2img/inpainting (el prompt describe el resultado final, no la instrucción).

## 7. Particularidades del diseño gráfico con IA

- **Logos**: pedir formas simples, planas, pocas tintas, fondo blanco o transparente, centrado, sin mockup. Las IAs generan mapas de bits: para uso real hay que vectorizar (Recraft genera SVG nativo). Pedir "estilo vectorial" ayuda a que la vectorización salga limpia.
- **Flyers y pósters**: definir jerarquía (un titular, un subtítulo, un llamado a la acción), retícula y paleta acotada. Reservar zonas limpias para el texto.
- **Íconos**: un solo objeto, silueta reconocible a tamaño chico, estilo coherente en el set (mismo grosor de línea, misma perspectiva).
- **Portadas**: respetar el formato real (libro 2:3, álbum 1:1, miniatura de YouTube 16:9) y la zona segura del título.
- **Consistencia de marca**: repetir paleta (HEX), tipografía y estilo en cada pieza; usar imágenes de referencia cuando el modelo lo permita.

## 8. Errores comunes que Promptea debe prevenir

| Error | Cómo lo previene Promptea |
|---|---|
| Adjetivos vagos ("lindo", "moderno") | Opciones visuales concretas en vez de campos libres. |
| Sobrecarga de estilos | Límite de selecciones por categoría y avisos de incompatibilidad. |
| Sujeto al final | El motor ordena los segmentos por prioridad. |
| Pedir texto largo | Contador de palabras y sugerencia de "dejar espacio para texto". |
| Negativos que invocan lo que se quería evitar | Se convierten en frases positivas para modelos sin prompt negativo. |
| Formato equivocado para el uso | La pieza de diseño elegida propone la relación de aspecto correcta. |
| Sintaxis de otra IA (por ejemplo `--ar` en ChatGPT) | Selector de modelo con adaptadores y opción Genérico. |

## 9. Traducción directa al producto

- El prompt se genera **en inglés** (los datos de entrenamiento y la adherencia son mejores). La versión en español existe a pedido, con aviso de que rinde menos.
- Cada opción del catálogo guarda: nombre y explicación en español (para enseñar), fragmento de prompt en inglés (y su versión en español), demo visual y metadatos (incompatibilidades, nivel simple/avanzado).
- El motor arma una estructura neutral de segmentos (los 14 bloques) y un adaptador la escribe para cada IA.

## Fuentes

- OpenAI, *GPT Image Generation Models Prompting Guide* — https://developers.openai.com/cookbook/examples/multimodal/image-gen-models-prompting-guide
- Google Cloud, *Ultimate prompting guide for Nano Banana* — https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-nano-banana
- fal.ai, *FLUX.2 prompt guide* — https://fal.ai/learn/devs/flux-2-prompt-guide
- Ideogram Docs, *Prompt structure* — https://docs.ideogram.ai/prompting/prompt-structure.md
- Hugging Face Diffusers, *Prompting / weighted prompts* — https://huggingface.co/docs/diffusers/main/en/using-diffusers/weighted_prompts
- Evolink, *Midjourney V7 prompt guide* — https://evolink.ai/docs/en/api-manual/image-series/midjourney/midjourney-v7-prompt-guide
- Blake Crosley, *Midjourney V8 prompting: what changed from V7* — https://blakecrosley.com/blog/midjourney-v8-prompting
