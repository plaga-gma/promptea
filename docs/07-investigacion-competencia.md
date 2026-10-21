# 07. Investigación de la competencia

Fecha: 21 de octubre de 2026. Informe para Gonzalo: [Promptea: qué tienen otras páginas y qué sumar](https://claude.ai/artifact/CaiNC8u1qq3fm89D5sLQ7w).

## Cómo se hizo

Seis búsquedas en paralelo, cada una con un ángulo distinto: constructores de prompts, bibliotecas de estilos, paneles de las IAs, herramientas de diseño (logos, íconos, pósters), edición de fotos (apps y guías oficiales de Google y GPT Image) y páginas en español. Se revisaron 91 páginas y apps (110 links, porque algunas tienen más de una página), más 4 fuentes que sumó la pasada crítica. Cuando una página arma sus opciones con JavaScript y no se podían leer, se usaron su registro de cambios o reseñas; esos casos están marcados abajo.

Una segunda pasada comparó todo contra el catálogo de Promptea. Una tercera, crítica, buscó lo que faltaba y corrigió recomendaciones. La investigación se hizo contra el catálogo de antes de los cambios del 21/10; lo que ya se sumó ese día está marcado como hecho.

## Qué ya diferencia a Promptea

- Ejemplo visual en cada opción: diagramas, tipografías reales y filtros sobre fotos (los estilos todavía muestran degradés hasta resolver las imágenes de muestra). La mayoría de los constructores nuevos (Gud Prompt, Promptrace, Advanced AI Prompts, Vantaige, Miguel.marketing) son solo texto, chips o menús. Entre los constructores, solo promptoMANIA, IMI, AfterShip y en parte PUMPG muestran imágenes; las bibliotecas (Midlibrary) y los paneles de las IAs (Firefly, Ideogram, Canva) usan miniaturas, pero no arman el prompt paso a paso.
- Español rioplatense y pensado para quien no sabe de diseño. Vantaige tiene la interfaz en español pero las opciones en inglés; CodeItBro y Freebeat usan IA con 10 y 5 usos por día.
- Explicación de una línea en cada paso y cada opción, en palabras simples. En la competencia hay tooltips técnicos (PUMPG, Natural 20) y algunas explicaciones por efecto (TheRightGPT, Cinematique, los colores de Looka), pero nadie lo hace en todo el armador.
- Generar, editar y diseñar en un mismo lugar. Casi todos solo generan, y los que editan piden subir la foto.
- "¿Qué tiene que quedar igual?" e Intensidad como botones: es el esquema que recomiendan Google y fal.ai, que en la competencia solo aparece en guías de texto.
- Avisos de opciones incompatibles entre sí. En la competencia solo hay avisos por IA: Gud avisa si el modelo no admite un formato, y PUMPG y TopWebTool marcan qué versión de Midjourney pide cada parámetro.
- 8 IAs, incluidas ChatGPT, Gemini y Meta AI. Muchos competidores solo sirven para Midjourney.
- Prompt en español opcional para entender qué se pide. Ningún competidor revisado lo muestra.
- Armonías de color a partir de un color base, más allá de las paletas fijas.
- Sin login, servidor ni límites; historial y favoritos en el navegador.
- Estilos descritos sin nombres de artistas.
- Modo simple y avanzado, y versión para celular.

## Ya sumado el 21/10 (estaba en la investigación)

Época, clima y estación, material, expresión y pose, cámara y película, mockups ("Cómo se muestra"), patrón continuo con --tile, filtros nuevos sobre fotos (lomo, Polaroid, cine negro, tilt-shift, barrido, día por noche…), luces (ventana, aro, flash, mariposa, mitad y mitad, persiana, pantalla), ángulos (desde el piso, perfil, tres cuartos, selfie, primera persona), knolling y punto de fuga, 10 operaciones de edición (ropa, peinado, expresión, edad, estación, ángulo, mover, foto de perfil profesional, foto de producto, de dibujo a real), 8 piezas de diseño (menú, invitación, infografía, remera, patrón, fondo de pantalla, web, podcast), 30 estilos (impresionismo, cubismo, barroco, graffiti, sumi-e, origami, bordado, tejido, mosaico, chibi, cel shading, boceto, arte lineal…), 8 tipografías (burbuja, contorno, graffiti, grotesca…), personalidad de marca y grupos en las listas largas.

## Opciones que faltan

"Agregar" = vale la pena y cuesta poco. "Quizás" = suma menos o se pisa con algo que ya existe. Los números son los mismos del informe. Cada fila se comparó contra el código del 21/10: lo que ya existe está aclarado en la recomendación.

Cambios respecto de la síntesis de la investigación: O5 y F19 suben a "Agregar" (mascotas de marca y SEO en español); O9, O20, O21 y O35 bajan a "Quizás" porque se pisan con lo sumado el 21/10; O25 baja a "Quizás" porque cada pieza ya trae su uso.

### Generación

| # | Opción | Ejemplos | Recomendación |
|---|---|---|---|
| O1 | Cantidad de detalle (también en Diseño) | Simple y limpio, Equilibrado, Muy detallado, Recargado | Agregar, con aviso si choca con Minimalista o Maximalista. No llamarlo "Nivel de detalle": ese nombre ya lo usa el selector Simple/Avanzado. |
| O2 | Texto dentro de la imagen | Un cartel de neón que dice "…", la etiqueta de un frasco, una pizarra de café | Agregar. ChatGPT, Gemini, Ideogram y FLUX ya escriben bien. |
| O3 | Cantidad de personas | Una sola, dos, un grupo chico, una multitud | Agregar. "Nadie" ya existe como Qué evitar > Sin personas. |
| O4 | Dónde va el espacio libre | A la derecha, a la izquierda, abajo; objeto aislado sobre fondo liso | Agregar. Hoy existen "Espacio negativo" (Composición) y "Espacio para texto" (solo arriba, en Diseño). |
| O5 | Varias vistas en una imagen | Frente, perfil y espalda; grilla de expresiones; tira de 3 viñetas | Agregar. Las variantes quedan en F22. |
| O6 | Ideas rápidas para los campos de texto | "¿Qué querés ver?": un zorro astronauta, una taza humeante. "¿Qué está haciendo?": caminando, leyendo. "¿Dónde está?": playa, bosque, ciudad de noche | Agregar, como botones que completan el texto. |
| O7 | Más variedad en Midjourney (--chaos) | Que las 4 imágenes salgan más distintas | Agregar, solo con Midjourney y en Avanzado. El modo crudo ya existe: --raw sale con "Libertad creativa: Literal" o con opciones fotográficas (midjourney.ts). |
| O8 | Más valores en pasos existentes | Estilos: libro para colorear, cuento infantil, caricatura retro, glam de los 80, anime pintado a mano. Foto: vida silvestre, deportiva, submarina. Luces: de Navidad, luz negra (la luz de borde ya es Contraluz). Colores: negro y dorado, terracota y turquesa, tono general (cálido, frío, apagado, vibrante). Atmósfera: etérea, siniestra, juguetona. Composición: radial, escala épica. Ángulo: heroico, vista satelital. Lente: estenopeica. Textura: aberración cromática, halo de luz. Formatos: A4, banner 3:1. Qué evitar: sin marcos, sin piel plástica (las manos deformes ya están en "Sin deformaciones"). Piezas de Diseño: set de íconos, mascota de marca, pin esmaltado | Agregar. |
| O9 | Movimiento | Congelado en el aire, larga exposición con estelas de luz | Quizás. El paneo ya es el filtro "Barrido de movimiento". |
| O10 | Dentro de… | Bola de nieve, botella, burbuja, palma de una mano | Quizás. |
| O11 | Perspectivas especiales | Corte al medio, piezas separadas, perspectiva forzada | Quizás. |
| O12 | Vestimenta | Urbana, formal, techwear, kimono | Quizás, como ideas dentro de "¿Qué querés ver?". |

### Edición

| # | Opción | Ejemplos | Recomendación |
|---|---|---|---|
| O13 | Transformaciones | Figura coleccionable en su caja, peluche, llavero, Polaroid que se sale del marco, tu foto como sticker | Agregar, sin nombres de marcas. Plastilina y chibi ya se piden con "Cambiar el estilo". |
| O14 | Qué parte tocar | Solo el fondo, la persona, la cara, la ropa, el cielo | Agregar. |
| O15 | Qué aporta cada imagen que adjuntás en la IA | Imagen 1: la persona o el producto. Imagen 2: el lugar, la ropa o el estilo. "El mismo personaje que en la imagen adjunta" | Agregar, en Edición y en Generación (personajes y marca coherentes en una serie), mostrando la frase que se suma por cada imagen, como Google Whisk. "Combinar dos imágenes" ya cubre persona de la 1 + fondo de la 2. |
| O16 | Traducir el texto de una imagen | Un cartel o un folleto al español o al inglés sin tocar el diseño | Agregar, dentro de "Agregar o cambiar texto". Cambiar el color de algo ya se hace con "Cambiar un elemento". |
| O17 | Retoque de retrato en detalle | Dientes, brillo, ojeras, ojos rojos | Agregar. Piel sin efecto plástico y granitos ya están en "Retocar un retrato". |
| O18 | Ideas para "Quitar algo" y "Cambiar el fondo" | Personas del fondo, cables, carteles; oficina desenfocada, pedestal | Agregar, como botones. El fondo blanco ya es "Quitar el fondo". |
| O19 | Más cosas para conservar | Ángulo, peinado, cuerpo, edad, tono de piel, el producto y su etiqueta | Agregar. |
| O20 | Otra época, maquillaje, foto carnet | — | Quizás. |
| O21 | Más filtros | Color selectivo, nórdico, otoñal | Quizás. Desteñido ≈ Vintage o Desaturado; rayones ≈ textura Grunge; la cámara descartable queda solo en Cámara y película. |

### Diseño

| # | Opción | Ejemplos | Recomendación |
|---|---|---|---|
| O22 | Ocasión | Promo, evento, taller, cumpleaños, inauguración, lanzamiento | Agregar. |
| O23 | Rubro | Gastronomía, moda, belleza, tecnología, mascotas, educación | Agregar, como botones que completan "¿Para quién o para qué es?". |
| O24 | Público | Chicos, jóvenes, adultos, mayores, familias, empresas | Agregar, en el mismo campo. |
| O25 | Dónde se va a usar el logo | Redes, web, impresión, ropa, cartel grande | Quizás, solo para Logo. |
| O26 | Disposición del logo | Horizontal, apilado, con eslogan abajo | Agregar. Sello y solo el símbolo ya están en Tipo de logo. |
| O27 | Estilo de ícono | Contorno, relleno, 3D, línea fina o gruesa | Agregar. Ícono de app y sticker ya son piezas; plastilina y vidrio ya están en Técnica y Glassmorphism. |
| O28 | Efecto de texto | En arco, sombra en bloque, chorreado, letras apiladas | Agregar. El 3D inflado ("Inflada / burbuja") y el cromado (Y2K) ya existen. |
| O29 | Más campos de texto | Lugar, precio, web o redes, espacio para QR, fecha y hora por separado | Agregar. Hoy fecha y hora van en "Llamado a la acción o dato". |
| O30 | Idioma del texto | Español con tildes y ñ tal cual, inglés, bilingüe | Agregar. |
| O31 | Cantidad de colores | 1, 2, 3, a todo color | Agregar. |
| O32 | Miniatura de YouTube: tema y cara | Gaming, tutorial, reacción; la cara reusando Expresión y pose | Agregar. |
| O33 | Tipo de infografía | Paso a paso, comparación, línea de tiempo, receta | Agregar. |
| O34 | Más tipos de logo | Firma, figura en el espacio negativo | Agregar. Una inicial sola ya se pide con "Monograma". |
| O35 | Más estilos de diseño | Póster de viaje vintage, estampilla, industrial, neumorfismo, claymorfismo | Quizás. |
| O36 | Tipo de patrón | Lunares, rayas, cuadrillé, damasco, camuflaje | Quizás. |

### IAs

| # | Opción | Recomendación |
|---|---|---|
| O37 | Más IAs gratuitas: Microsoft Copilot / Bing, Grok, Canva | Agregar las tres. Gemini ya se muestra como "Gemini (Nano Banana 2 / Pro)". Recraft, Firefly, Leonardo, Seedream o Krea no le sirven al público principiante. |

## Funciones

Todas respetan las reglas: sin IA en el sitio, sin subir imágenes, sin servidor ni cuentas. Ya existen: elegir hasta N (al pasarse, la opción más vieja se reemplaza), limpiar un paso ("Limpiar") o todo ("Empezar de nuevo"), favoritos e historial que guardan todas las opciones y se abren en el armador, copiar el negativo aparte, --no y --raw en Midjourney, límite de 80 caracteres por texto de Diseño con aviso a partir de 6 palabras, contador de palabras del prompt, lo que transmite cada paleta (en su ayuda) y filtros sobre fotos.

| # | Función | Qué hace | Recomendación |
|---|---|---|---|
| F1 | Plantillas de inicio | "Foto de producto", "Retrato realista", "Logo minimalista", "Flyer de cumple", "Miniatura de YouTube" | Agregar. |
| F2 | Sorprendeme | Todo al azar, y un dado por paso | Agregar. |
| F3 | Semáforo del prompt | Rojo, amarillo o verde con reglas propias | Agregar. |
| F4 | Botones de dirección | "Más realista", "Más cinematográfico", "Más simple" | Agregar. |
| F5 | El prompt para todas las IAs | Una pestaña con las 8 versiones | Agregar. |
| F6 | ¿Qué IA uso? | Recomendación por reglas | Agregar. |
| F7 | Siguiente ajuste | Pedido corto de seguimiento después de una edición | Agregar. |
| F8 | Resumen con etiquetas | Cada opción elegida con una X | Agregar. |
| F9 | Guardar mi estilo | Nombre para una combinación y aplicarla a otro tema | Agregar. Hoy los favoritos guardan todo junto, tema incluido. |
| F10 | Compartir por link | Las opciones van en la dirección | Agregar. |
| F11 | Kit de campaña | Post 1:1, historia 9:16 y banner 16:9 de una vez | Agregar. |
| F12 | Contador por campo | Palabras usadas en cada texto de Diseño mientras se escribe | Agregar. |
| F13 | Qué transmite cada color | En la herramienta de armonías, para el color base | Agregar. |
| F14 | Checklist para revisar el resultado | Por ejemplo, que el logo se lea en chico | Agregar. |
| F15 | Buscador | En las listas largas | Agregar. |
| F16 | Mismo sujeto en todas las muestras | Todos los ejemplos de un paso con el mismo retrato o escena, como Midlibrary | Agregar de a un paso; depende de las imágenes pendientes. ("Limpiar todo o un paso", que estaba en este número, ya existía.) |
| F17 | Instalable y sin internet | PWA | Agregar. |
| F18 | Exportar e importar favoritos | Archivo para otro navegador | Agregar. |
| F19 | Páginas por plantilla | /flyer-cumpleanos con el armador cargado | Agregar junto con F1 (SEO). |
| F20 | Galería de ejemplos | Imagen + prompt + "Usar este prompt" | Más adelante: necesita las imágenes pendientes. |
| F21 | Colores exactos por parte | "fondo #F22E63, letras #FFFFFF" | Quizás. Hoy los códigos ya van, sin decir a qué parte. |
| F22 | Variantes | 3 o 4 versiones cambiando una cosa | Quizás. |
| F23 | Fechas especiales | Navidad, Halloween, Día de la Madre | Quizás. |
| F24 | Formato JSON | Para FLUX e Ideogram, que lo tienen documentado | Agregar, solo para esas dos y en Avanzado. |
| F25 | Código --sref de Midjourney | Campo para pegarlo | Quizás, solo en Avanzado: no le sirve al principiante. |
| F26 | Otros | Carpetas, deshacer, atajos, tutorial, botón de sugerencias, ruleta | Quizás, más adelante. |
| F27 | Antes y después en los filtros | Deslizar sobre la foto de muestra | Agregar. |
| F28 | Avisos por IA | "Esta IA no admite este formato", "con mucho texto conviene Ideogram", "en Midjourney la edición se hace en su Editor" | Agregar. |
| F29 | "Qué evitar" en positivo en todas las IAs | Gemini, Meta AI y FLUX ya lo reciben en positivo; ChatGPT escribe "no X" y el Genérico "Avoid: X" | Agregar (ajuste del armador). |
| F30 | Orden según la guía de cada IA | Gemini: sujeto → escena y acción → contexto → estilo → cámara, luz y formato. Hoy cámara y luz van antes que el estilo (shared.ts) | Agregar (ajuste del armador). |

## Sugerencias propias

| # | Idea | Qué haría |
|---|---|---|
| S1 | Explicame este prompt | Al pasar por una parte del prompt se ilumina la opción que la generó, con su porqué; en "Ver en español", cada parte con su color. |
| S2 | Empezar con 3 preguntas | "¿Tenés una foto o empezás de cero?", "¿Para qué es?", "¿Dónde lo vas a usar?" → área y plantilla. |
| S3 | Mandar por WhatsApp | Abre WhatsApp con el prompt listo para Meta AI. |
| S4 | ¿Dónde lo hago gratis? | Guía corta de IAs gratis, desde dónde y con qué límites. |
| S5 | Glosario visual | Tocar una palabra técnica abre su ejemplo. |
| S6 | Paso a paso en el celular | Una pregunta por pantalla. |
| S7 | Aviso al editar personas | Permiso y límites de las IAs con caras reales. |

## Lo que no conviene copiar

- "Mejorar con IA" u "Optimizar": rompe la regla de no tener IA y cuesta por uso. F4 da algo parecido con reglas.
- Imagen a prompt, lectura de datos de cámara (EXIF) o subir referencias: rompe la regla de no subir imágenes. O15 cubre lo que sí se puede.
- Nombres de artistas, estudios o marcas (Ghibli, LEGO, Funko): derechos y bloqueos. Se describen con palabras.
- Palabras de relleno visibles ("8k, obra maestra"): las IAs nuevas no las necesitan; el adaptador de Stable Diffusion ya las agrega.
- Números técnicos a la vista (pasos, CFG, semilla, pesos, --weird).
- El prefijo /imagine de Discord.
- 35 campos a la vista.
- Comunidad, likes, newsletter, contenido pago o cuentas.
- Controles de video (fuera de la fase 1).

## Top 10 recomendado

1. O13 transformaciones. 2. O22 + O29 ocasión y campos de texto. 3. F1 + F19 plantillas con página propia. 4. O1 + O2 cantidad de detalle y texto en la imagen. 5. O14 + F7 qué parte tocar y siguiente ajuste. 6. F2 Sorprendeme. 7. O26 + O27 disposición del logo y estilo de ícono. 8. S1 Explicame este prompt. 9. F10 compartir por link. 10. O30 idioma del texto.

## Notas para implementar

Correcciones de la pasada crítica, para tener en cuenta cuando se sume cada cosa:

- Momento del día: no crear un paso propio, porque pisa a Iluminación (hora dorada, hora azul, luz de luna). La estación ya está en "Clima y estación".
- Material y Textura: Metálico y Holográfico siguen en Textura y acabado como superficie; el material del objeto va en Material. No repetir valores entre los dos.
- No duplicar: "Transformaciones" (O13) y "convertir en sticker o figura" son lo mismo; "cámara descartable" ya está en Cámara y película, no sumarla también como estilo, filtro o textura; isométrico y tilt-shift ya existen, no repetirlos en Perspectivas especiales.
- "Estilo Ghibli" es lo más pedido: ofrecerlo descriptivo ("anime pintado a mano, fondos de acuarela, película animada japonesa de los 90"), sin nombrar al estudio.
- Nivel de detalle y los límites de "elegí hasta N" necesitan reglas de incompatibilidad nuevas (por ejemplo, Minimalista + Recargado).
- Qué evitar: FLUX no acepta negativos y en ChatGPT, Gemini y Meta AI un "sin X" a veces provoca X. Gemini, Meta AI y FLUX ya reciben el texto en positivo de cada opción; ChatGPT ("Constraints: no X") y el Genérico ("Avoid: X") todavía no (F29). Mantener la regla de escribir cada opción nueva en positivo.
- Ajustes de Midjourney: alcanza con variedad (--chaos), modo crudo, --tile y --no. El modo crudo, --tile y --no ya existen. --weird y la semilla no le sirven al público.
- Salida JSON: FLUX.2 e Ideogram tienen formato JSON documentado, por eso F24 tiene sentido solo para ellas.
- IAs: el público principiante usa Copilot / Bing, Grok y Canva antes que Recraft o Leonardo. Gemini ya se muestra como "Gemini (Nano Banana 2 / Pro)".
- Orden del prompt: la guía de Google pide sujeto → escena y acción → contexto → estilo → cámara, luz y formato. Hoy el cuerpo compartido pone cámara y luz antes que el estilo (F30).
- Texto en la imagen y en Diseño: pedir que se copie letra por letra con tildes y ñ, porque las IAs tienden a traducir o deformar el español.

## Páginas revisadas

### Constructores de prompts

- [promptoMANIA](https://promptomania.com/prompt-builder): El constructor visual de prompts más conocido (Midjourney, Stable Diffusion, DreamStudio y uno genérico). Tiene cajones de detalle con imagen de muestra por opción, pesos por parte, tutorial interactivo, guías y un separador de grillas. El constructor se arma con JS, así que la lista de opciones se sacó del changelog y de reseñas.
- [PromptFolder Midjourney Prompt Helper (ex Noonshot)](https://promptfolder.com/midjourney-prompt-helper/): Ayudante para Midjourney con listas largas de palabras clave (unos 150 estilos, 28 luces, 15 cámaras, 50 artistas, 42 colores, 19 materiales), parámetros de MJ, botón 'Optimize' con IA y carpetas para guardar prompts.
- [PUMPG (Powerusers MidJourney Prompt Generator)](https://powerusers.ai/pumpg-midjourney-prompt-generator/): Generador para Midjourney con todos los parámetros (sref y cref con peso, tile, raw), biblioteca por categorías con miniaturas y partes que se reordenan arrastrando.
- [Promptrace Image Prompt Generator](https://promptrace.ai/image-prompt-generator): Constructor paso a paso, gratis y sin registro: atajos de inicio, selector de modelo y menús de estilo, luz, cámara, composición, paleta y prompt negativo. El resultado sale formateado para cada modelo.
- [Gud Prompt Image Prompt Generator](https://gudprompt.com/tools/image-prompt-generator): Estudio multi-modelo con 16 plantillas por caso de uso. Recompila el mismo pedido para cada modelo y tiene una pestaña que lo muestra para todos a la vez.
- [Advanced AI Prompts](https://www.advanced-ai-prompts.com/): Constructor denso para fotorrealismo: cámaras, lentes, aperturas, luz agrupada, gradación de color, materiales, editor JSON y botón de variación.
- [Make The Prompt](https://maketheprompt.com/): 35 campos en 9 grupos. Sale en lenguaje natural y en JSON, con 'Surprise me', ejemplos precargados y un contador de campos completados.
- [VAKPixel Free AI Image Prompt Generator](https://vakpixel.com/blog/free-ai-image-prompt-generator): Generador de palabras clave en unas 21 categorías (piel, ropa, pose, película, época…). Saca un prompt JSON en vivo y tiene botón Randomize.
- [Midjourney Prompt Generator Pro](https://www.midjourneypromptgen.com/): Menús simples (estilo, artista, luz, cámara, ánimo), parámetros de MJ, presets, historial de los últimos 20 prompts y pesos del 1 al 5.
- [PromptZone Midjourney Prompt Generator](https://www.promptzone.com/midjourney-prompt-generator): Generador para MJ con stylize, chaos y weird numéricos, tile y una casilla para agregar el prefijo /imagine.
- [SpacePrompts Midjourney Prompt Generator](https://www.spaceprompts.com/ai-tools/midjourney-prompt-generator): Menús para sujeto (apariencia, ropa, emoción), entorno, cámara y movimiento, con chips de términos populares.
- [gradually.ai Stable Diffusion Prompt Generator](https://www.gradually.ai/en/stable-diffusion-prompt-generator/): Constructor para SD con modificadores de calidad, prompt negativo y pesos (texto:1.5).
- [Natural 20 Midjourney Prompt Generator](https://natural20.com/midjourney-prompt-generator): Constructor para MJ que corre en el navegador, con listas de medio, pintor, movimiento, motor de render, materiales y filtros, cada una con una explicación corta.
- [Midjourney Prompt Inspiration (cattail.nu)](https://cattail.nu/midjourney/): Biblioteca enorme de modificadores en unas 50 categorías (clima, estaciones, 'dentro de', patrones, armonías de color…), con favoritos y botón Random.
- [Midlibrary](https://midlibrary.io): Biblioteca de más de 5.500 estilos y 3.700 códigos SREF de Midjourney. Cada estilo tiene 4 muestras y comparativas sobre prompts estándar, y hay filtros visuales, Ruleta de estilos y Ruleta de color.
- [IMI Prompt (app iOS/Android y web)](https://apps.apple.com/app/id1658718177): App que arma prompts con una biblioteca de términos con imagen (poses, fondos, efectos…). Se verificó por la ficha de la App Store; la página web imiprompt.com no se pudo leer.
- [Midjourney Prompt Helper (netlify)](https://midjourney-prompt-helper.netlify.app/): Selector mínimo de palabras, de código abierto, con pestañas 'Top' y 'Popular' y botones separadores.
- [TopWebTool Midjourney Command Builder](https://topwebtool.com/midjourney-command-builder/): Constructor de comandos de MJ: los formatos llevan nombre de red social y hay un botón para copiar el comando completo para Discord.
- [GPTPrompts.ai (catálogo de estilos y prompts de edición)](https://gptprompts.ai/ai-image-styles): Catálogo de 45 estilos en 9 grupos con etiqueta de dificultad, y aparte 29 prompts de edición para ChatGPT en 7 categorías.
- [StudioPromptGenerator (Hugging Face)](https://huggingface.co/spaces/TischEins/StudioPromptGenerator): Generador de prompts de foto: al elegir una cámara completa solo el lente, la película y la luz. Arma de 1 a 5 variantes y exporta a TXT/CSV.
- [promptXfactory](https://www.promptxfactory.com/text-to-image): Constructor de texto a imagen según una nota de terceros. La página bloquea la lectura automática. *No se pudo confirmar todo.*
- [MJPromptBuilder (Anorihon)](https://mj-prompt.anorihon.com/): Constructor básico para MJ según Hongkiat. No se pudo abrir. *No se pudo confirmar todo.*
- [Phraser](https://phraser.tech): Constructor paso a paso de 2022 con búsqueda semántica, según un artículo. No se cargó y puede que ya no exista. *No se pudo confirmar todo.*

### Bibliotecas de estilos

- [MidJourney Styles and Keywords Reference (willwulfken, GitHub)](https://github.com/willwulfken/MidJourney-Styles-and-Keywords-Reference): Referencia abierta con miles de palabras clave, cada una mostrada con el mismo prompt base en una grilla de imágenes (temas, materiales, luz, perspectiva, patrones, épocas…). Las páginas largas se leyeron solo en parte.
- [sref-midjourney.com](https://sref-midjourney.com/): Directorio de 5.676 códigos --sref con 4 muestras cada uno, reacciones, botón de copiar y un link al azar. Parte del contenido es pago.
- [SrefHunt](https://srefhunt.com): Biblioteca comunitaria de SREF y prompts, con etiquetas de estilo y color, favoritos, envíos de usuarios y herramientas de IA.
- [Promptsref](https://promptsref.com/): Biblioteca de prompts y SREF para GPT Image, Nano Banana y MJ. Tiene botón Remix, rankings de tendencias e interfaz en 8 idiomas, incluido el español.
- [PromptHero](https://prompthero.com/): Galería grande de imágenes con su prompt exacto, filtrable por modelo y categoría, con secciones Featured, Hot, New y Top y una Academy.
- [Lexica](https://lexica.art/): Buscador de prompts de Stable Diffusion. La portada cargó, pero los filtros y la búsqueda por similitud salen de descripciones de terceros.
- [Stable Diffusion 1.5 Cheat Sheet (SupaGruen)](https://supagruen.github.io/StableDiffusion-CheatSheet/): Hoja visual de estilos y medios con miniaturas, línea de tiempo del arte, favoritos exportables y clic para copiar.
- [SDXL Artist Style Studies (parrotzone)](https://sdxl.parrotzone.art/): Unos 4.387 estilos de artista probados con dos plantillas fijas, con una nube de etiquetas de movimientos, medios y culturas.
- [SDXL Artists Browser (Hugging Face)](https://huggingface.co/spaces/mattthew/SDXL-artists-browser): Navegador de artistas con tres tipos de muestra cada uno, filtros por etiqueta que se cumplen todos o alguno, y favoritos que se exportan e importan.
- [Stable Diffusion Art: guía de anatomía del prompt](https://stable-diffusion-art.com/how-to-come-up-with-good-prompts-for-ai-image-generation): Guía que divide el prompt en partes (sujeto, medio, estilo, resolución, color, luz) con ejemplos de cada una.
- [Midjourney Style Explorer (oficial)](https://updates.midjourney.com/style-explorer-v1): Explorador oficial de estilos con búsqueda por significado y un botón 'Try Style' que prueba tu prompt en ese estilo.
- [OpenArt Stable Diffusion Prompt Book](https://openart.ai/): PDF gratuito de modificadores. Solo se conoce por un resumen de terceros; el PDF no se abrió. *No se pudo confirmar todo.*
- [Parrot Zone (Notion)](https://proximacentaurib.notion.site/parrot-zone-74a5c04d4feb4f12b52a41fc8750b205): Base de estudios de estilo en Notion. No cargó. *No se pudo confirmar todo.*

### Paneles de las IAs

- [Adobe Firefly / Adobe Express](https://firefly.adobe.com): Generador de Adobe con tipo de contenido (foto o arte), unos 150 efectos acumulables en 7 pestañas, menús de color y tono, luz y ángulo, e imágenes de referencia. Express suma plantillas y filtros.
- [Ideogram](https://ideogram.ai): Generador fuerte con el texto. Tiene tipo de estilo (Auto, General, Realista, Diseño), 62 presets, paletas con nombre más hex propio, campo de 'cosas a evitar', fondo transparente, prompt en JSON y Magic Prompt, que también traduce.
- [Leonardo.ai](https://leonardo.ai): Plataforma con presets de estilo distintos según el modelo, control de contraste, 'Elements' acumulables con peso, Prompt Enhance y 13 tipos de guía por imagen.
- [Canva (Magic Media, Dream Lab, efectos de foto, generadores de logo, póster y miniatura)](https://www.canva.com/ai-image-generator/): Generadores con selector de estilo en miniaturas, formatos y botón 'Inspírame', más filtros de foto con control de intensidad.
- [Microsoft Designer / Copilot / Bing Image Creator](https://designer.microsoft.com): Restyle de fotos con 14 presets, botones para reestilizar después de generar y prompts sugeridos con campos para completar que se comparten como plantilla.
- [Krea (docs y blog)](https://www.krea.ai): Suite con controles deslizantes de Intensidad, Complejidad y Movimiento, niveles de creatividad, moodboards y selector automático de modelo. En su blog publica 32 prompts de Nano Banana etiquetados como generar, editar o con referencia.
- [Freepik / Magnific (generador e Icon Generator)](https://www.freepik.com/pikaso/ai-image-generator): Generador con listas exactas de estilo (24), efecto de color (19), luz (12) y encuadre (11), formatos con nombre de uso y hex con peso. Su generador de íconos tiene estilos plano, contorno, 3D, sticker y degradado.
- [NightCafe Creator](https://creator.nightcafe.studio): Generador comunitario con presets (prompt más modificadores, algunos hechos por usuarios), varios prompts con peso y la receta de cada imagen a la vista.
- [Playground](https://playgroundai.com): Herramienta de texto a diseño con 24 categorías de plantilla (remera, logo, sticker, mockups, patrones continuos…) y 'Swap style'.

### Herramientas de diseño

- [Looka](https://looka.com/logo-maker/): Creador de logos tipo asistente: nombre, rubro, logos de ejemplo que te gustan, colores con su significado al pasar el mouse, eslogan y símbolos. Muestra el logo en mockups.
- [Brandmark](https://brandmark.io/): Generador de identidad: nombre, eslogan y palabras clave, rueda de color, combinador de fuentes y kit de marca.
- [Shopify Logo Maker (ex Hatchful)](https://www.shopify.com/tools/logo-maker): Asistente gratis: dónde vas a usar el logo, rubro, hasta 3 palabras de estilo, nombre y eslogan, y después categorías de fuente y disposiciones.
- [Wix Logo Maker](https://wix.com/logo/maker/styles/fun): Creador de logos tipo chat con ánimos en pares de adjetivos ('Calmo y minimalista') y unos 50 estilos de logo.
- [Design.com AI Logo Generator](https://www.digitalcitizen.life/generate-ai-logos-design-com/): Generador de logos con filtros por tipo (logotipo, emblema, abstracto, mascota), eslogan que se prende y apaga, orientación y checklist de legibilidad. Verificado con una reseña.
- [Zoviz](https://zoviz.com/blog/how-to-make-a-logo): Creador de logos y kit de marca con catálogos por rubro y estilo.
- [Turbologo](https://www.unite.ai/turbologo-review/): Asistente de logos: rubro, inspiración, hasta 3 paletas y 5 íconos, y mockups. Verificado con una reseña.
- [Designs.ai](https://designs.ai/logomaker): Arma el kit de marca a partir de la URL de la empresa o de una descripción.
- [Recraft](https://www.recraft.ai/docs/api-reference/styles): Generador orientado a diseño, con biblioteca de estilos (vector, ícono, emblema, foto), paleta, nivel de detalle, opción 'sin texto' y mockups.
- [Kittl](https://help.kittl.com/ai-tools/ai-image-generation): Editor gráfico con constructor visual de prompts (estilo, perspectiva, efectos, colores, entorno, luz), botón 'Surprise me', plantillas y efectos de texto en arco, onda y sombras.
- [Canva (generadores de logo, póster y miniatura, Magic Media)](https://www.canva.com/es_es/generador-de-logos-ia/): Todos sus generadores usan un texto más un estilo elegido de una lista con miniaturas, formato, imagen de referencia y "regenerar". El resultado se abre en el editor de Canva.
- [Adobe Firefly: efectos](https://helpx.adobe.com/ee/firefly/web/work-with-images/generate-images/effects-for-generated-images.html): Lista de efectos por categoría, más listas de color y tono, iluminación y ángulo de cámara, e imágenes de referencia de estilo y composición.
- [Ideogram: ajustes de generación](https://docs.ideogram.ai/create/image-settings.md): Tipos de estilo (Auto, General, Realista, Diseño), 62 estilos predefinidos, paletas, paleta propia con códigos de color, prompt negativo, Magic Prompt y formatos.
- [Dreamina Seedream AI Poster Generator (CapCut)](https://dreamina.capcut.com/seedream/seedream-ai-poster-generator): Generador de pósters con plantillas por ocasión, campos de texto (título, fecha, lugar, llamado a la acción, QR), tamaños A4 y A3 y control de fuerza del estilo.
- [Microsoft Designer: ayuda](https://support.microsoft.com/en-us/topic/welcome-to-microsoft-designer-6cd168f3-1cf0-478e-bd75-31d6526d2504): "Crear con IA" ofrece prompts sugeridos con huecos para completar, que se pueden compartir como plantillas. También edita con IA y tiene plantillas de invitaciones y posts.
- [Magnific (Freepik) Icon Generator](https://www.magnific.com/ai/docs/icon-generator): Generador de íconos con estilos Plano, Contorno, 3D, Sticker y Degradado, 4 variantes por vez y descarga en PNG o SVG.
- [Iconly.ai](https://iconly.ai/docs/icon-generator/): Generador de íconos con estilos, 22 plantillas, color y nivel de detalle mostrado como etiquetas que se pueden quitar.
- [ChatSlide AI Icon Generator](https://www.chatslide.ai/ai-icon-generator): Íconos en sets de 10 a 20 con el mismo trazo y paleta, más de 100 estilos y exportación en SVG o PNG.
- [Morphic AI Icon Generator](https://morphic.com/resources/tools/ai-icon-generator): Íconos y íconos de app con fondo transparente o placa redondeada, y sets coherentes entre sí.
- [Fotor AI Thumbnail Maker / Aragon](https://www.fotor.com/design/ai-thumbnail-maker/): Miniaturas con IA: tipo de canal, estilo, sujeto, texto y letra, onda, foto de la cara y expresión. Salen en 16:9 o 9:16; Aragon elige el fondo según el rubro (gaming, vlog, podcast, tutorial, reacción).

### Edición de fotos y guías oficiales

- [Adobe Lightroom (escritorio y móvil)](https://helpx.adobe.com/lightroom/desktop/edit-photos/presets.html): Presets por grupo (cinematográfico, película, vintage, estaciones, tonos de piel) con vista previa sobre tu foto y control de cantidad de 0 a 200, más edición con IA (borrar, expandir, desenfoque de lente).
- [Adobe Lightroom móvil: novedades](https://lightroom.adobe.com/news/ios?red=a): Registro oficial de cambios: borrar y expandir con IA, desenfoque de lente, reducción de ruido, acciones rápidas, ajustes preestablecidos adaptativos y retoque.
- [VSCO](https://www.vsco.co/features/photo-filters): Más de 200 filtros y packs que imitan películas reales (Kodak Portra, Fuji, Ilford), cada uno mostrado sobre la misma foto. Tiene control de fuerza y 'Recipes' para guardar tu combinación.
- [VSCO: paquetes de presets](https://www.vsco.co/features/photo-filters/preset-packs): Emulaciones de rollos de película (Film 01, 02, 05, 07). Cada rollo se muestra con un antes y después sobre la misma foto.
- [Snapseed](https://support.google.com/snapseed/answer/6183571?hl=en): 11 herramientas y 13 filtros (Drama, Grunge, Retrolux, Noir, Glamour Glow…) con subestilos, más un 'Looks' de un toque y la opción de guardar los tuyos.
- [Picsart (AI Filters, Photo Effects, Imagen a prompt)](https://picsart.com/ai-filters): Filtros de estilo con IA, más de 650 efectos en 15 categorías, secciones de tendencias y fechas especiales, y un pasaje de imagen a prompt en español.
- [Picsart: efectos de foto](https://picsart.com/th/photo-effects/): Más de 650 efectos en 15 categorías (FX, artísticos, acuarela, blanco y negro, desenfoque, colorear) y los modelos de IA que usa.
- [Canva: efectos y filtros de foto](https://www.canva.com/features/photo-effects/): Filtros con nombre, control de intensidad, herramientas de desenfoque y otros efectos.
- [Fotor (efectos, editor IA y AI Thumbnail Maker) / Aragon](https://www.fotor.com/features/photo-effects.html): Biblioteca de efectos por categoría con antes y después y control de intensidad, herramientas de retoque con IA y generador de miniaturas con nicho, cara y texto.
- [Photoroom](https://www.photoroom.com/pp/ai-photo-editing-tools): Herramientas para foto de producto: quitar y cambiar el fondo, sombras instantáneas, modelo virtual, maniquí invisible, expandir y mejorar resolución.
- [Pixlr](https://apps.apple.com/us/app/pixlr-ai-photo-video-editor/id526783584): Editor con relleno y expansión generativa, borrado de objetos, glitch, doble exposición y modos de fusión.
- [Adobe Express: efectos y edición](https://helpx.adobe.com/express/web/add-effects-to-your-designs.html): Agregar, cambiar y borrar objetos con IA, expandir, quitar el fondo y filtros. Solo publica 3 de sus más de 30 nombres de filtros.
- [Techpresso Academy (prompts de Nano Banana, selfies y constructor simple)](https://academy.techpresso.co/prompts/nano-banana-prompts): Galerías numeradas de prompts copiables, con edición conversacional, figuras coleccionables, épocas y retratos profesionales, más un constructor mínimo.
- [Techpresso Academy: 30 prompts de selfies para ChatGPT](https://academy.techpresso.co/prompts/chatgpt-prompts-selfies): 30 transformaciones de selfies en 6 grupos de 5: estilos de arte, coleccionables, profesional, épocas, parejas o grupos y filtros creativos.
- [Google: 4 consejos para Nano Banana](https://blog.google/products/gemini/nano-banana-tips/): Usos de edición oficiales: figuras, ropa, fotos de perfil, carteles, restaurar y colorear, combinar imágenes, y los packs temáticos de PictureMe.
- [Google (blog de Nano Banana, guía para desarrolladores y página de Gemini)](https://developers.googleblog.com/how-to-prompt-gemini-2-5-flash-image-generation-for-the-best-results/): Guías oficiales con plantillas de edición para completar, el esquema 'cambiá solo X, dejá el resto igual', combinación de imágenes y packs temáticos PictureMe.
- [Gemini: generación de imágenes](https://gemini.google/gb/overview/image-generation/): Página oficial con usos de edición (luz, encuadre, cambio de estilo, formato, figuras, looks de cada década, peinados) y la fórmula de prompt.
- [fal.ai: guía de prompts para GPT Image 2](https://fal.ai/learn/tools/prompting-gpt-image-2): Guía de edición: probador de ropa, cambio de luz y clima, reemplazo de objetos, recorte transparente sin halos y un bloque de qué cambia y qué se conserva.
- [GPTPrompts.ai: prompts de edición para ChatGPT](https://gptprompts.ai/chatgpt-photo-editing-prompts): 29 prompts para copiar en 7 grupos: retrato, cambio de estilo, fondo, restaurar, producto, de temporada y creativos.
- [Krea: 32 prompts de Nano Banana (2026)](https://www.krea.ai/blog/30-best-nano-banana-prompts-to-copy-paste-in-2026): 32 prompts en 4 grupos (producto y publicidad, retrato y personaje, edición, estilo y creativos), cada uno marcado como generar, editar o con referencia.
- [awesome-nano-banana (JimmyLv, GitHub)](https://github.com/JimmyLv/awesome-nano-banana): 100 casos comunitarios de Nano Banana: figuras, stickers, dioramas, pósters y estilos 3D.
- [Awesome-Nano-Banana-images (PicoTrex, GitHub)](https://github.com/PicoTrex/Awesome-Nano-Banana-images): 68 casos de edición: cambio de ropa, peinados, control de luz, foto carnet y cambio de ángulo de cámara.
- [Perfect Corp (YouCam): tendencias de Nano Banana](https://www.perfectcorp.com/consumer/blog/generative-AI/nano-banana-trends): Resumen de ediciones virales: Polaroid, abrazo a tu yo de chico, figura 3D, décadas y 16 bits.
- [Lilach Bullock: ediciones virales con ChatGPT](https://www.lilachbullock.com/chatgpt-trending-photo-edits-instagram/): 5 estilos virales: figura en caja, estilo Ghibli, cámara descartable de los 90, plastilina y tapa de revista vintage.

### En español y extras de uso

- [Miguel.marketing: Generador de Prompts para Imágenes IA](https://miguel.marketing/recursos-gratuitos/generador-de-prompts-para-imagenes-ia/): El competidor en español más cercano. Tiene unos 20 grupos de campos que se agregan, selector de plataforma, modos especiales para miniatura de YouTube y para diseño gráfico con contadores de caracteres, y botones de aleatorio y limpiar.
- [Vantaige Prompt Builder (ES)](https://vantaige.io/es/tools/prompt-builder): Constructor por chips con interfaz en español pero opciones en inglés. Tiene 8 casos de uso con página propia, 'Sorpréndeme', un dado por grupo y límites del tipo 'elegí hasta 2'.
- [CodeItBro: Generador de Prompts para Midjourney (ES)](https://www.codeitbro.com/es/tool/midjourney-prompt-generator): Generador en español que usa IA: escribís un concepto y elegís estilo y ambiente. Tiene ejemplos de un clic y un límite de 10 usos por día.
- [AfterShip: Generador de prompts Midjourney (ES)](https://www.aftership.com/es/tools/midjourney-prompt-generator): Página en español con estilos en tarjetas con imagen que se combinan y se les da peso.
- [Digitalcoding Image Prompt Builder](https://tools.digitalcoding.com/tools/image-prompt-builder/): Constructor por menús que corre en el navegador y funciona sin conexión, con calidad, negativo, aleatorio y botones para compartir.
- [TheRightGPT: Cinematic Photo Prompt Generator](https://therightgpt.com/free-ai-prompt-generator/): Asistente de 4 pasos con ISO y obturador explicados por su efecto, indicador de fuerza del prompt, botones para orientar el prompt ('más cinematográfico') y copiar y abrir la IA.
- [ImagePromptGuru](https://imagepromptguru.net): Imagen a prompt y texto a prompt en 19 idiomas de salida, con historial local y sin registro.
- [Picsart: Imagen a prompt (ES)](https://picsart.com/es/image-to-prompt/): Subís una imagen y te da el prompt para Flux, Nano Banana, DALL·E, Midjourney o SD en más de 10 idiomas.
- [OpenArt: Imagen a Prompt (ES-419)](https://openart.ai/es-419/features/image-to-prompt/): Imagen a prompt con el resultado dividido en 6 capas editables.
- [PromptSpace (ES)](https://www.promptspace.in/es): Biblioteca de más de 5.000 prompts copiables con buscador y cantidad de copias por prompt.
- [Opten: AI Prompt Scorer](https://chromeboard.com/extension/opten-—-ai-prompt-scorer-iphkppgbobpilmphloffcalicmejacfl): Extensión que puntúa el prompt en rojo, amarillo o verde con reglas por modelo. Verificada con una ficha de terceros.
- [Prompt Catalyst (Firefox)](https://addons.mozilla.org/firefox/addon/prompt-catalyst/): Extensión con selectores de cámara, luz y estilo, control de creatividad, botones de acortar y alargar, historial y galería de SREF.
- [PromptPerfect (Jina AI)](https://similarlabs.com/es/p/prompt-perfect): Optimizador de prompts con IA para cada modelo. Verificado con una descripción de terceros.
- [Brompter](https://www.brompter.pro/): Constructor fotográfico con películas, cámaras, lentes y gradación, sugerencias de IA para aceptar o rechazar, 'looks' propios guardados y app instalable.
- [Cinematique (vvsvs.pro)](https://vvsvs.pro/cinematique): Más de 150 técnicas de cine y foto explicadas con películas de referencia, con plantilla copiable y filtros por dificultad y ánimo.
- [Jeremy Morgan Midjourney Prompt Generator](https://www.jeremymorgan.com/tools/midjourney-prompt-generator/): Formulario de parámetros de MJ: versión, stylize, chaos, weird y semilla.
- [Freebeat: Imagen a prompt (ES)](https://freebeat.ai/es/tools/image-to-prompt): Imagen a prompt en español con historial, exportación a TXT o JSON y 5 usos gratis por día.
- [Media.io: Biblioteca de prompts IA (ES)](https://www.media.io/ai/es/explore/zone/ai-prompt-library): Plantillas de prompt en español con espacios para completar el sujeto, el estilo y la luz.
- [ImaginPrompt](https://betalist.com/startups/imaginprompt): Imagen a prompt en más de 40 idiomas. Verificado con su ficha en BetaList.
- [Techpresso: constructor de prompts](https://academy.techpresso.co/free-tools/image-prompt-builder): Constructor mínimo: sujeto, 6 estilos, 5 luces y un campo de detalles. No guarda nada.
- [IMI Prompt (web)](https://www.imiprompt.com/): Generador para Midjourney con "miles de opciones" en web, Android e iOS, y temas diarios. No se pudo leer la página, solo su descripción. *No se pudo confirmar todo.*

### Fuentes de la pasada crítica

- [Google Whisk](https://techcrunch.com/2024/12/16/google-experiments-with-a-new-image-generator-that-remixes-three-images-into-one-creation): arma la imagen con tres entradas (sujeto, escena y estilo) y muestra en texto, editable, lo que toma de cada una.
- [Selector de estilos de ChatGPT](https://www.tonyreviewsthings.com/chatgpt-image-style-picker/): estilos de un toque (Cyberpunk, Anime, Retrato dramático, Libro para colorear, Sesión de fotos, Caricatura retro, Glam 80s, Art Nouveau, Synthwave).
- [Guía de prompts de FLUX.2](https://www.atlabs.ai/blog/flux-2-prompting-guide): formato JSON, colores en código asignados a objetos, plantilla de infografía, y que no acepta prompts negativos.
- [Los 7 consejos de Google para Nano Banana Pro](https://www.blogdumoderateur.com/nano-banana-pro-7-conseils-google-prompts-efficaces/): orden sujeto → escena → estilo, texto legible en varios idiomas, infografías, traducir y adaptar, hasta 14 referencias para mantener personajes e identidad de marca.
