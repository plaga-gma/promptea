# El asistente de Promptea

> La "pequeña IA que asiste por detrás". Código en `src/engine/assistant/` (lógica) y `src/sections/imagenes/asistente/` (datos de cada área). Investigación en [08-investigacion-rediseno.md](08-investigacion-rediseno.md) §5.

## Qué hace

| Función | Archivo | Qué hace |
|---|---|---|
| `interpretIdea` | `interpret.ts` | Lee una idea escrita ("un gato astronauta en acuarela, luz de atardecer, para historia de Instagram") y elige opciones. Lo que no es una opción se reparte en sujeto, acción ("flotando…") y lugar ("en el espacio"); en Edición va al recuadro "Contalo con tus palabras" de la operación; lo que está entre comillas va a los textos de la pieza. |
| `autofill` | `autofill.ts` | Con el **Asistente por detrás** prendido, completa los pasos vacíos (luz, color, atmósfera, composición, plano; en Edición qué cuidar y la intensidad; en Diseño estilo, tipografía, diagramación) con la opción que mejor combina con lo elegido. Lo marca con "IA" y se puede aceptar o rechazar en cada paso. No toca lo que eligió el usuario y no hace nada si no hay nada elegido. |
| `suggestFor` | `autofill.ts` | Ordena las opciones de un paso por cuánto combinan con lo elegido (para el "Lo que más sumaría ahora"). |
| `scorePrompt` | `score.ts` | El **Poder del prompt** (0 a 100) y su rango: Chispa, Boceto, Buen pedido, Pro, Maestro, Leyenda. Cada rol del prompt pesa distinto por área; lo que completó el asistente vale el 60 %; un sujeto de 6 palabras o más vale entero; subopciones y notas suman hasta 8 puntos. También elige el paso que más sumaría. |
| `enhanceSpec` | `enhance.ts` | El **Prompt largo y óptimo**: suma un bloque de calidad (hasta 6 frases) elegido según lo pedido. Si se pidió desenfoque a propósito, no pide nitidez. |

## Los datos de cada área

Cada área tiene un `assistant: AssistantData` (en `src/sections/imagenes/asistente/<area>.ts`):

- `keywords`: cómo nombra la gente cada opción, además de su etiqueta. Todo se compara sin tildes ni mayúsculas, con plural en la última palabra. La clave puede ser `"paso/opción"` cuando el mismo id existe en dos pasos (pastel como estilo y como paleta). `'!'` apaga la etiqueta (para que "un retrato" no elija el lente "Retrato (85 mm)"). Las paletas, lo que se cuida, la intensidad y lo que se evita **solo** se eligen por palabra clave: sus etiquetas ("Bosque", "Fondo", "Sutil") casi siempre son otra cosa en la frase. Las paletas compartidas están en `PALETAS_KW` (`_util.ts`).
- `pairs`: qué combina con qué, armado con **familias** (`fromFamilies`): cada opción de una familia combina con todas las demás. Ejemplo: misteriosa + clave baja + niebla + luna + cine negro.
- `autofill`: qué pasos completa y con qué opción segura si nada decide (`''` = no completar si nada combina).
- `boosters`: frases de calidad generales y por opción.
- `weights`: cuánto pesa cada rol en el Poder del prompt.
- `ideas`: ejemplos para el recuadro y para "Sorprendeme".

Los tests (`tests/assistant.test.ts`) verifican que todo nombre opciones reales, que las recetas queden completas y lleguen a "Buen pedido", y que las ideas de ejemplo se entiendan.

## IA del navegador (opcional)

`src/lib/browser-ai.ts` usa el **traductor de Chrome** (Translator API) para pasar al inglés lo que el usuario escribe con sus palabras (sujeto, lugar, acción, objetivo de una edición y notas). Nunca traduce los textos de la pieza (titular, subtítulo): van tal cual.
- Si el idioma ya está en el navegador, se usa solo.
- Si hay que descargarlo, aparece "Activar traductor" en el recuadro de la idea (el navegador exige un clic).
- Si el navegador no lo tiene (Firefox, Safari, celulares), no aparece nada y todo sigue igual.

No usamos modelos de lenguaje que se descargan (Gemini Nano pesa 2,7 a 4 GB; un modelo WebLLM chico ~335 MB) ni APIs pagas. Si más adelante se quiere un asistente que "converse", el lugar para enchufarlo es `interpretIdea`: el modelo devolvería las mismas elecciones (`Selections`) y el resto de la web no cambia.

## Cómo mejorarlo

- **Una idea no se entiende bien**: agregar la frase a `keywords` de la opción (sin tildes). Probar con `npx vitest run tests/assistant.test.ts`.
- **El asistente completa algo raro**: revisar las familias donde aparece esa opción en `FAMILIAS`.
- **El Poder del prompt sube muy rápido o muy lento**: ajustar `weights`.
