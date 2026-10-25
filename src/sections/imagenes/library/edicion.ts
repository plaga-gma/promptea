import type { Demo, FilterOverlay, Option, Step } from '../../../engine/types';
import { BLUR, mergeGroups, o } from './_helpers';
import { FILTROS_EXTRA, FILTROS_EXTRA_GROUPS, OPERACIONES_EXTRA } from './extra';

const diagram = (name: string): Demo => ({ kind: 'diagram', name });
const f = (css: string, overlay?: FilterOverlay): Demo => ({ kind: 'filter', css, ...(overlay ? { overlay } : {}) });
/** Antes y después sobre la foto de muestra. Para arreglos; los efectos muestran solo el resultado (`f`). */
const vs = (before: string, after: string, beforeOverlay?: FilterOverlay, afterOverlay?: FilterOverlay): Demo => ({
  kind: 'compare',
  before: { css: before, ...(beforeOverlay ? { overlay: beforeOverlay } : {}) },
  after: { css: after, ...(afterOverlay ? { overlay: afterOverlay } : {}) },
});
/** Una foto vieja ya restaurada: limpia, con su tono de época. */
const RESTORED = 'sepia(.45) contrast(1.06)';

/**
 * Operaciones de edición. `{target}` se reemplaza por lo que el usuario escribe en "¿Qué querés cambiar?".
 * Ver docs/01-ingenieria-de-prompts.md §6.
 */
const OPERACIONES_BASE: Option[] = [
  o('quitar-objeto', 'Quitar algo', 'Remove {target} from the photo and fill the area naturally so no trace remains', 'Quitá {target} de la foto y rellená la zona de forma natural, sin dejar rastros', { hint: 'Borrar una persona, un cable, una mancha, un texto…', demo: diagram('op-remove'), meta: { needsTarget: true, targetHint: 'Ej.: la persona de remera azul que está al fondo' } }),
  o('quitar-fondo', 'Quitar el fondo', 'Remove the background and leave the subject cleanly isolated on {d:fondo}', 'Quitá el fondo y dejá al sujeto bien recortado sobre {d:fondo}', { hint: 'Recortar a la persona u objeto.', demo: diagram('op-cutout'), conflicts: ['p-fondo', 'cambiar-fondo', 'desenfocar-fondo', 'cambiar-cielo', 'expandir'] }),
  o('cambiar-fondo', 'Cambiar el fondo', 'Replace the background with {target}, matching the lighting and perspective of the subject', 'Reemplazá el fondo por {target}, igualando la luz y la perspectiva del sujeto', { hint: 'Poner al sujeto en otro lugar.', demo: diagram('op-background'), meta: { needsTarget: true, targetHint: 'Ej.: una playa al atardecer' }, conflicts: ['p-fondo', 'producto-pro'] }),
  o('desenfocar-fondo', 'Desenfocar el fondo', 'Blur the background with a natural, shallow depth of field, {d:cuanto}, keeping the main subject perfectly sharp with clean edges', 'Desenfocá el fondo con una profundidad de campo corta y natural, {d:cuanto}, dejando al sujeto principal perfectamente nítido y con bordes limpios', { hint: 'Modo retrato: el sujeto se destaca y el fondo queda suave.', demo: vs('none', 'saturate(1.05)', undefined, 'bokeh'), meta: { allow: BLUR }, conflicts: ['p-fondo', 'sin-borroso'] }),
  o('cambiar-cielo', 'Cambiar el cielo', 'Replace the sky with {target}, adjusting the light, colors and reflections of the whole scene to match the new sky', 'Reemplazá el cielo por {target}, ajustando la luz, los colores y los reflejos de toda la escena para que coincidan con el cielo nuevo', { hint: 'De un cielo gris a un atardecer, una tormenta o estrellas.', demo: diagram('op-sky'), meta: { needsTarget: true, targetHint: 'Ej.: un atardecer naranja con nubes suaves' }, conflicts: ['p-luz'] }),
  o('agregar', 'Agregar algo', 'Add {target} to the scene, matching the lighting, perspective, scale and shadows', 'Agregá {target} a la escena, igualando la luz, la perspectiva, la escala y las sombras', { hint: 'Sumar un objeto, una persona o un detalle.', demo: diagram('op-add'), meta: { needsTarget: true, targetHint: 'Ej.: un gato durmiendo sobre el sillón' } }),
  o('cambiar', 'Cambiar un elemento', 'Change {target}, keeping its shape, position and the way light falls on it', 'Cambiá {target}, manteniendo su forma, su posición y cómo le da la luz', { hint: 'Otro color de ropa, otro objeto, otro peinado…', demo: diagram('op-change'), meta: { needsTarget: true, targetHint: 'Ej.: el auto, que pase a ser rojo' } }),
  o('estilo', 'Cambiar el estilo', 'Transform the image into a new art style while keeping the exact content and composition', 'Transformá la imagen a un nuevo estilo artístico, conservando exactamente el contenido y la composición', { hint: 'Convertir una foto en acuarela, anime, cómic…', demo: diagram('op-style'), conflicts: ['boceto-real'] }),
  o('filtro', 'Aplicar un filtro', 'Apply a photo filter and color grade to the whole image', 'Aplicá un filtro y una gradación de color a toda la imagen', { hint: 'Blanco y negro, vintage, cinematográfico…', demo: diagram('op-filter') }),
  o('reiluminar', 'Cambiar la luz', 'Relight the scene with new lighting while keeping everything else identical', 'Volvé a iluminar la escena con una luz nueva, dejando todo lo demás idéntico', { hint: 'Pasar de mediodía a atardecer, agregar luz de neón…', demo: diagram('op-relight'), conflicts: ['p-luz'] }),
  o('retoque', 'Retocar un retrato', 'Retouch the portrait naturally: even out the skin tone and remove blemishes while keeping real skin texture', 'Retocá el retrato con naturalidad: emparejá el tono de piel y quitá imperfecciones, conservando la textura real de la piel', { hint: 'Mejorar la piel sin que parezca de plástico.', demo: diagram('op-retouch') }),
  o('restaurar', 'Restaurar foto antigua', 'Restore this old photo: remove scratches, dust and stains, and recover sharpness and detail', 'Restaurá esta foto antigua: quitá rayas, polvo y manchas, y recuperá nitidez y detalle', { hint: 'Arreglar fotos viejas rayadas, rotas o manchadas.', demo: vs('url(#pf-aged)', RESTORED, 'aged') }),
  o('colorear', 'Colorear blanco y negro', 'Colorize this black and white photo with realistic, period-accurate colors', 'Coloreá esta foto en blanco y negro con colores realistas y fieles a la época', { hint: 'Darle color a una foto antigua.', demo: vs('url(#pf-bn)', 'saturate(1.05)'), conflicts: ['p-colores', 'duotono', 'envejecer'] }),
  o('expandir', 'Expandir la imagen', 'Extend the image beyond its borders, continuing the scene seamlessly in the same style and lighting', 'Extendé la imagen más allá de sus bordes, continuando la escena sin cortes con el mismo estilo y luz', { hint: 'Agrandar el encuadre o cambiar el formato (outpainting).', demo: diagram('op-expand'), conflicts: ['p-encuadre'] }),
  o('mejorar', 'Mejorar la calidad', 'Enhance the image quality: sharpen details, reduce noise and improve clarity without changing the content', 'Mejorá la calidad de la imagen: más nitidez, menos ruido y más claridad, sin cambiar el contenido', { hint: 'Más nitidez y menos ruido en fotos de celular o de baja calidad.', demo: vs('blur(1.3px) contrast(.85) saturate(.75)', 'url(#pf-sharp)', 'grain') }),
  o('ampliar', 'Aumentar la resolución', 'Upscale this image to a higher resolution: recreate it larger, with crisp edges and fine, realistic detail, without changing the content, colors or composition', 'Aumentá la resolución de esta imagen: recreala más grande, con bordes nítidos y detalle fino y realista, sin cambiar el contenido, los colores ni la composición', { hint: 'Para imprimir o agrandar una imagen chica o pixelada (upscale).', demo: vs('url(#pf-pixel)', 'url(#pf-sharp)') }),
  o('desmovida', 'Corregir foto movida', 'Fix the motion blur and camera shake: make the photo sharp and steady, with crisp edges and clear details, without changing the content', 'Corregí el desenfoque por movimiento y el temblor de la cámara: que la foto quede nítida y firme, con bordes definidos y detalles claros, sin cambiar el contenido', { hint: 'Cuando la foto salió movida o temblada.', demo: vs('url(#pf-shake)', 'url(#pf-sharp)') }),
  o('exposicion', 'Arreglar foto oscura o quemada', 'Fix the exposure: brighten the dark areas and recover detail in the blown-out highlights, with natural contrast and true-to-life colors', 'Corregí la exposición: aclará las zonas oscuras y recuperá el detalle de las partes quemadas, con un contraste natural y colores fieles', { hint: 'Fotos a contraluz, de noche o con demasiado sol.', demo: vs('brightness(.42) contrast(.9) saturate(.8)', 'contrast(1.04) saturate(1.05)') }),
  o('enderezar', 'Enderezar la foto', 'Straighten the photo: level the horizon and correct the perspective so vertical lines are truly vertical, filling any empty edges naturally', 'Enderezá la foto: nivelá el horizonte y corregí la perspectiva para que las líneas verticales queden rectas, rellenando con naturalidad los bordes vacíos', { hint: 'Horizonte torcido o edificios que "se caen".', demo: diagram('op-straighten'), conflicts: ['p-encuadre'] }),
  o('montaje', 'Combinar dos imágenes', 'Combine the subject from image 1 with the scene from image 2 into one realistic composition, matching light, perspective, scale and color', 'Combiná el sujeto de la imagen 1 con la escena de la imagen 2 en una sola composición realista, igualando luz, perspectiva, escala y color', { hint: 'Montaje: unir partes de dos fotos.', demo: diagram('op-composite'), meta: { needsSecondImage: true } }),
  o('ropa', 'Cambiar la ropa', 'Change the outfit to {target}, keeping the same person, pose and body', 'Cambiá la ropa por {target}, manteniendo la misma persona, pose y cuerpo', { hint: 'Probarte otra ropa sin cambiarte.', demo: diagram('op-outfit'), meta: { needsTarget: true, targetHint: 'Ej.: un traje azul marino con camisa blanca' }, conflicts: ['p-ropa'] }),
  o('peinado', 'Cambiar el peinado', 'Change the hairstyle to {target}, keeping the face exactly the same', 'Cambiá el peinado por {target}, dejando el rostro exactamente igual', { hint: 'Otro corte o color de pelo.', demo: diagram('op-hair'), meta: { needsTarget: true, targetHint: 'Ej.: pelo largo y ondulado, color castaño' } }),
  o('expresion', 'Cambiar la expresión', 'Change the facial expression to {target}, keeping the identity of the person', 'Cambiá la expresión de la cara a {target}, manteniendo la identidad de la persona', { hint: 'Una sonrisa, ojos abiertos, mirada a cámara.', demo: diagram('op-expression'), meta: { needsTarget: true, targetHint: 'Ej.: una sonrisa natural con los ojos abiertos' }, conflicts: ['p-pose'] }),
  o('edad', 'Cambiar la edad', 'Make the person look {target}, keeping them clearly recognizable', 'Hacé que la persona se vea {target}, manteniéndola claramente reconocible', { hint: 'Ver cómo te verías de grande o de chico.', demo: diagram('op-age'), meta: { needsTarget: true, targetHint: 'Ej.: 30 años mayor' }, conflicts: ['p-rostro'] }),
  o('estacion', 'Cambiar estación o clima', 'Change the season and weather of the scene to {target}, keeping everything else the same', 'Cambiá la estación y el clima de la escena a {target}, dejando todo lo demás igual', { hint: 'De verano a invierno, de sol a lluvia.', demo: diagram('op-season'), meta: { needsTarget: true, targetHint: 'Ej.: un día de invierno con nieve' } }),
  o('angulo-camara', 'Cambiar el ángulo', 'Show the same scene from a different camera angle: {target}', 'Mostrá la misma escena desde otro ángulo de cámara: {target}', { hint: 'Ver el mismo objeto o lugar desde otro punto de vista.', demo: diagram('op-angle'), meta: { needsTarget: true, targetHint: 'Ej.: vista desde arriba' }, conflicts: ['p-encuadre'] }),
  o('mover', 'Mover algo', 'Move {target}, filling the original spot naturally', 'Mové {target}, rellenando de forma natural el lugar donde estaba', { hint: 'Acomodar un objeto o persona dentro de la foto.', demo: diagram('op-move'), meta: { needsTarget: true, targetHint: 'Ej.: la taza hacia el borde derecho de la mesa' } }),
  o('retrato-pro', 'Foto de perfil profesional', 'Turn this photo into a professional headshot: neat business attire, clean neutral background and soft studio lighting, keeping the face identical', 'Convertí esta foto en un retrato profesional: ropa formal prolija, fondo neutro y luz suave de estudio, con el rostro idéntico', { hint: 'Para LinkedIn o el CV, a partir de una selfie.', demo: diagram('op-headshot'), conflicts: ['p-fondo', 'p-ropa', 'p-luz'] }),
  o('producto-pro', 'Foto de producto', 'Turn this into a clean e-commerce product photo: the product centered on a pure white background with a soft natural shadow', 'Convertí esto en una foto de producto para tienda online: el producto centrado sobre fondo blanco puro con una sombra suave y natural', { hint: 'Para vender en redes o en una tienda online.', demo: diagram('op-packshot'), conflicts: ['p-fondo'] }),
  o('boceto-real', 'De dibujo a imagen real', 'Turn this sketch into a finished, realistic image, following its shapes and composition exactly', 'Convertí este boceto en una imagen terminada y realista, siguiendo exactamente sus formas y composición', { hint: 'Subí un dibujo a mano y obtené una imagen terminada.', demo: diagram('op-sketch') }),
  // Efectos creativos
  o('duotono', 'Duotono', 'Turn the image into a bold duotone: convert it to grayscale and map the shadows and the highlights to two colors', 'Convertí la imagen en un duotono llamativo: pasala a escala de grises y teñí las sombras y las luces con dos colores', { hint: 'La foto en solo dos colores, como en carteles y portadas.', demo: f('url(#pf-duo-azul-rosa)'), conflicts: ['p-colores', 'color-selectivo', 'filtro'] }),
  o('color-selectivo', 'Color selectivo', 'Make the whole image black and white except {target}, which keeps its original, vivid color', 'Pasá toda la imagen a blanco y negro, menos {target}, que conserva su color original e intenso', { hint: 'Todo en blanco y negro menos un detalle.', demo: f('url(#pf-selective)'), meta: { needsTarget: true, targetHint: 'Ej.: el paraguas rojo' }, conflicts: ['p-colores'] }),
  o('envejecer', 'Hacer que parezca antigua', 'Make this photo look like an authentic old photograph, with period-accurate tones, grain, paper texture and natural signs of age', 'Hacé que esta foto parezca una fotografía antigua auténtica, con tonos de la época, grano, textura de papel y marcas naturales del paso del tiempo', { hint: 'Como si la hubieran sacado hace 50 o 100 años.', demo: f('url(#pf-aged)', 'aged'), conflicts: ['p-colores'] }),
  o('poster-trap', 'Póster estilo trap', 'Turn this photo into a trap album cover-style poster: the person as the bold central figure, dramatic high contrast, gritty film grain and large, bold typography integrated into the design', 'Convertí esta foto en un póster estilo portada de disco de trap: la persona como figura central e imponente, alto contraste dramático, grano de película áspero y tipografía grande y contundente integrada al diseño', { hint: 'Portada de disco o flyer de show urbano.', demo: f('url(#pf-trap)', 'trap'), conflicts: ['p-colores'] }),
  o('doble-exposicion', 'Doble exposición', "Create an artistic double exposure: blend the subject's silhouette with {target}, which fills the shape of the subject, over a clean light background", 'Creá una doble exposición artística: fusioná la silueta del sujeto con {target}, que rellena la forma del sujeto, sobre un fondo claro y limpio', { hint: 'Una silueta rellena con un paisaje.', demo: f('url(#pf-double)', 'double'), meta: { needsTarget: true, targetHint: 'Ej.: un bosque de pinos con niebla' }, conflicts: ['p-fondo'] }),
  o('neon', 'Contorno de neón', 'Add a glowing neon outline that traces the silhouette of the main subject, with a soft light bloom over the darkened scene around it', 'Agregá un contorno de neón luminoso que siga la silueta del sujeto principal, con un resplandor suave sobre la escena oscurecida a su alrededor', { hint: 'Una línea de luz que rodea a la persona.', demo: f('url(#pf-neon)'), conflicts: ['p-luz'] }),
  o('dispersion', 'Efecto dispersión', 'Apply a dispersion effect: part of the subject breaks apart into small fragments and particles that drift away to one side, while the rest stays intact', 'Aplicá un efecto dispersión: una parte del sujeto se deshace en pequeños fragmentos y partículas que se alejan hacia un costado, mientras el resto queda intacto', { hint: 'La persona se desintegra en partículas.', demo: diagram('op-dispersion') }),
  o('sticker', 'Convertir en sticker', 'Turn the main subject into a die-cut sticker: cleanly cut out, with a thick white border, a subtle drop shadow and a slightly glossy finish, on a plain background', 'Convertí al sujeto principal en un sticker troquelado: bien recortado, con un borde blanco grueso, una sombra suave y un acabado apenas brillante, sobre un fondo liso', { hint: 'Para WhatsApp, Instagram o para imprimir.', demo: diagram('op-sticker'), conflicts: ['p-fondo'] }),
  o('texto', 'Agregar o cambiar texto', 'Add the text below to the image, integrated naturally into the scene', 'Agregá el texto de abajo a la imagen, integrado de forma natural en la escena', { hint: 'Un cartel, un título o corregir un texto.', demo: diagram('op-text') }),
];

/**
 * Filtros y gradación de color. La demo aplica el filtro de verdad sobre una foto de muestra:
 * `url(#pf-…)` son filtros SVG de src/components/demos/FilterDefs.tsx, el resto es CSS.
 */
const FILTROS_BASE: Option[] = [
  o('bn', 'Blanco y negro', 'classic black and white with a rich tonal range', 'blanco y negro clásico con buena gama de grises', { demo: f('url(#pf-bn)'), conflicts: ['cine', 'calido', 'frio', 'vaporwave', 'cross', 'infrarrojo', 'duotono', 'noche', 'noir', 'sepia'] }),
  o('noir', 'Cine negro', 'film noir black and white with deep shadows, hard contrast and a dark vignette', 'blanco y negro estilo cine negro, con sombras profundas, contraste duro y viñeta oscura', { hint: 'Blanco y negro dramático, de película policial.', demo: f('url(#pf-noir)', 'vignette'), conflicts: ['cine', 'calido', 'frio', 'vaporwave', 'cross', 'infrarrojo', 'duotono', 'noche', 'bn', 'sepia'] }),
  o('sepia', 'Sepia', 'warm sepia tone', 'tono sepia cálido', { demo: f('sepia(.85) contrast(1.05)'), conflicts: ['cine', 'calido', 'frio', 'vaporwave', 'cross', 'infrarrojo', 'duotono', 'noche', 'bn', 'noir'] }),
  o('vintage', 'Vintage', 'vintage film look with faded colors and a warm cast', 'look vintage de película con colores desvaídos y un tono cálido', { demo: f('url(#pf-vintage)', 'vignette') }),
  o('pelicula', 'Película analógica', 'analog 35mm film look with natural grain', 'look de película analógica de 35 mm con grano natural', { demo: f('url(#pf-film)', 'grain') }),
  o('polaroid', 'Polaroid', 'instant Polaroid photo look with soft faded colors and slightly lifted shadows', 'look de foto instantánea Polaroid con colores suaves y desvaídos y sombras levemente lavadas', { demo: f('url(#pf-polaroid)') }),
  o('lomo', 'Lomo', 'lomography look with saturated colors, strong contrast and a heavy dark vignette', 'look lomográfico con colores saturados, contraste fuerte y una viñeta oscura marcada', { hint: 'Colores intensos y bordes oscuros, como una cámara de juguete.', demo: f('url(#pf-lomo)', 'lomo') }),
  o('cine', 'Cinematográfico (teal & orange)', 'cinematic teal and orange color grade', 'gradación de color cinematográfica turquesa y naranja', { hint: 'Sombras verde azuladas y pieles cálidas, como en Hollywood.', demo: f('url(#pf-teal)') }),
  o('bleach', 'Bleach bypass', 'bleach bypass look with muted colors, gritty high contrast and silvery tones', 'look bleach bypass con colores apagados, contraste alto y áspero y tonos plateados', { hint: 'Colores lavados y contraste duro, de película bélica.', demo: f('url(#pf-bleach)') }),
  o('calido', 'Cálido', 'warm golden color grade', 'gradación de color cálida y dorada', { demo: f('url(#pf-warm)'), conflicts: ['frio'] }),
  o('frio', 'Frío', 'cool bluish color grade', 'gradación de color fría y azulada', { demo: f('url(#pf-cool)') }),
  o('contraste', 'Alto contraste', 'punchy high-contrast look', 'look intenso de alto contraste', { demo: f('url(#pf-contrast)') }),
  o('desaturado', 'Desaturado', 'muted desaturated colors', 'colores apagados y desaturados', { demo: f('saturate(.4) brightness(1.03)') }),
  o('suave', 'Suave y luminoso', 'soft, airy pastel look with gentle contrast and bright, light tones', 'look suave y luminoso, en tonos pastel, con contraste delicado', { hint: 'Claro, aireado, ideal para bodas o lifestyle.', demo: f('saturate(.75) brightness(1.12) contrast(.86)') }),
  o('mate', 'Mate (negros lavados)', 'matte look with lifted blacks and soft contrast', 'look mate con negros lavados y contraste suave', { demo: f('url(#pf-matte)') }),
  o('duotono', 'Duotono', 'two-color duotone effect', 'efecto duotono de dos colores', { hint: 'La foto en solo dos colores.', demo: f('url(#pf-duo)') }),
  o('vaporwave', 'Vaporwave', 'vaporwave color grade with neon pink and cyan tones', 'gradación de color vaporwave con tonos neón rosa y celeste', { hint: 'Rosa y celeste neón, estética retro de internet.', demo: f('url(#pf-vapor)') }),
  o('hdr', 'HDR', 'vivid HDR look with detailed shadows and highlights', 'look HDR vívido con detalle en sombras y luces', { demo: f('url(#pf-hdr)') }),
  o('cross', 'Proceso cruzado', 'cross-processed film look with shifted colors', 'look de proceso cruzado con colores desplazados', { demo: f('url(#pf-cross)') }),
  o('posterizado', 'Posterizado', 'posterized look with flat bands of bold color', 'look posterizado con bandas planas de color intenso', { hint: 'Pocos colores, planos, estilo afiche.', demo: f('url(#pf-poster)') }),
  o('semitono', 'Semitono (cómic)', 'comic-style halftone dot pattern', 'trama de puntos de semitono estilo cómic', { demo: f('url(#pf-halftone)', 'halftone') }),
  o('infrarrojo', 'Infrarrojo', 'surreal infrared photography look', 'look surrealista de fotografía infrarroja', { demo: f('url(#pf-ir)') }),
  o('noche', 'Día por noche', 'day-for-night look: a moonlit night scene with deep blue tones', 'look día por noche: una escena nocturna con luz de luna y tonos azules profundos', { hint: 'Convierte una foto de día en una noche de luna.', demo: f('url(#pf-night)') }),
  o('vineta', 'Viñeta', 'soft dark vignette around the edges', 'viñeta oscura suave en los bordes', { demo: f('none', 'vignette') }),
  o('bokeh', 'Fondo desenfocado', 'blurred background with creamy bokeh, subject in sharp focus', 'fondo desenfocado con bokeh suave y el sujeto en foco', { demo: f('saturate(1.1)', 'bokeh'), meta: { allow: BLUR }, conflicts: ['sin-borroso'] }),
  o('tilt', 'Miniatura (tilt-shift)', 'tilt-shift miniature effect: a narrow band in focus with blurred top and bottom, making the scene look like a toy model', 'efecto miniatura tilt-shift: una franja en foco con arriba y abajo desenfocados, como una maqueta de juguete', { hint: 'La escena parece una maqueta.', demo: f('saturate(1.35) contrast(1.1)', 'tilt'), meta: { allow: BLUR }, conflicts: ['sin-borroso'] }),
  o('movimiento', 'Barrido de movimiento', 'panning motion blur: subject sharp, background streaked with horizontal motion blur', 'barrido de movimiento: el sujeto nítido y el fondo con desenfoque de movimiento horizontal', { hint: 'Sensación de velocidad.', demo: f('contrast(1.05)', 'motion'), meta: { allow: BLUR }, conflicts: ['sin-borroso'] }),
  o('resplandor', 'Resplandor soñado', 'dreamy Orton glow effect with soft luminous highlights', 'efecto Orton de resplandor soñado, con luces suaves y luminosas', { hint: 'Brillo suave y mágico, muy usado en paisajes.', demo: f('url(#pf-glow)') }),
  o('bruma', 'Bruma', 'soft hazy atmosphere with a gentle mist and lifted, low-contrast tones', 'atmósfera brumosa con una niebla suave y tonos lavados de bajo contraste', { demo: f('contrast(.85) brightness(1.06) saturate(.8)', 'haze') }),
  o('destellos', 'Destellos de luz', 'warm light leaks and lens flare', 'filtraciones de luz cálidas y destellos de lente', { demo: f('brightness(1.05)', 'light-leak') }),
  o('anaglifo', 'Anaglifo 3D', 'red and cyan anaglyph 3D effect with offset color channels', 'efecto anaglifo 3D en rojo y cian, con los canales de color desplazados', { hint: 'Como las fotos para ver con anteojos 3D.', demo: f('url(#pf-anaglyph)') }),
  o('glitch', 'Glitch', 'digital glitch effect with RGB split', 'efecto glitch digital con separación RGB', { demo: f('url(#pf-glitch)', 'scan') }),
];

export const OPERACIONES: Option[] = [...OPERACIONES_BASE, ...OPERACIONES_EXTRA];
export const FILTROS: Option[] = [...FILTROS_BASE, ...FILTROS_EXTRA];

const FILTROS_GROUPS_BASE: NonNullable<Step['groups']> = [
  { id: 'clasicos', label: { es: 'Blanco y negro y antiguos' }, optionIds: ['bn', 'noir', 'sepia', 'vintage', 'pelicula', 'polaroid', 'lomo'] },
  { id: 'color', label: { es: 'Color y look de cine' }, optionIds: ['cine', 'bleach', 'calido', 'frio', 'contraste', 'desaturado', 'suave', 'mate', 'hdr', 'cross', 'noche'] },
  { id: 'graficos', label: { es: 'Gráficos y retro' }, optionIds: ['duotono', 'vaporwave', 'posterizado', 'semitono', 'infrarrojo', 'anaglifo', 'glitch'] },
  { id: 'lente', label: { es: 'Lente, luz y desenfoque' }, optionIds: ['vineta', 'bokeh', 'tilt', 'movimiento', 'resplandor', 'bruma', 'destellos'] },
];

/** Colores del duotono: sombras y luces. "Mis colores" usa el texto libre. */
export const DUOTONOS: Option[] = [
  o('duo-azul-rosa', 'Azul y rosa', 'deep navy blue shadows and hot pink highlights', 'sombras azul marino y luces rosa fuerte', { demo: f('url(#pf-duo-azul-rosa)') }),
  o('duo-violeta-naranja', 'Violeta y naranja', 'deep purple shadows and warm orange highlights', 'sombras violeta profundo y luces naranja cálido', { demo: f('url(#pf-duo-violeta-naranja)') }),
  o('duo-verde-lima', 'Verde y lima', 'dark forest green shadows and lime yellow highlights', 'sombras verde bosque y luces verde lima', { demo: f('url(#pf-duo-verde-lima)') }),
  o('duo-rojo-crema', 'Rojo y crema', 'deep crimson shadows and cream highlights', 'sombras carmesí y luces color crema', { demo: f('url(#pf-duo-rojo-crema)') }),
  o('duo-azul-cian', 'Azul y celeste', 'midnight blue shadows and bright cyan highlights', 'sombras azul noche y luces celeste brillante', { demo: f('url(#pf-duo-azul-cian)') }),
  o('duo-negro-amarillo', 'Negro y amarillo', 'black shadows and vivid yellow highlights', 'sombras negras y luces amarillo intenso', { demo: f('url(#pf-duo-negro-amarillo)') }),
  o('duo-propio', 'Mis colores', '{target}', '{target}', { hint: 'Escribí los dos colores que quieras.', demo: { kind: 'swatch', colors: ['#2b196e', '#ffb58a'] }, meta: { needsTarget: true, targetHint: 'Ej.: sombras verde oscuro y luces doradas' } }),
];

/** Época para "Hacer que parezca antigua". */
export const EPOCAS: Option[] = [
  o('epoca-1850', 'Daguerrotipo (1850)', 'an 1850s daguerreotype with a silvery, mirror-like tone, dark tarnished edges and soft focus', 'un daguerrotipo de 1850, con un tono plateado como de espejo, bordes oscuros y oxidados y foco suave', { demo: f('url(#pf-dag)', 'lomo') }),
  o('epoca-1900', 'Principios de 1900', 'an early 1900s sepia print with faded edges, foxing spots, scratches and a cracked paper surface', 'una copia sepia de principios de 1900, con bordes desvaídos, manchas de humedad, rayas y papel cuarteado', { demo: f('url(#pf-aged)', 'aged') }),
  o('epoca-1950', 'Años 50', 'a 1950s black and white snapshot with silver gelatin tones, fine grain and a soft white border', 'una foto en blanco y negro de los años 50, con tonos de gelatina de plata, grano fino y un borde blanco', { demo: f('url(#pf-bn)', 'grain') }),
  o('epoca-1970', 'Años 70', 'a 1970s color print with faded warm colors, a yellow-orange cast, lifted blacks and soft grain', 'una copia color de los años 70, con colores cálidos desvaídos, un tono amarillo anaranjado, negros lavados y grano suave', { demo: f('url(#pf-seventies)', 'grain') }),
  o('epoca-1990', 'Años 90 (descartable)', 'a 1990s disposable camera snapshot with harsh direct flash, saturated colors and an orange date stamp in the corner', 'una foto de cámara descartable de los años 90, con flash directo, colores saturados y la fecha impresa en naranja en una esquina', { demo: f('url(#pf-flash)', 'date') }),
];

/** Daños de la foto a restaurar: decirlos con nombre ayuda a que la IA los busque. */
export const DANOS: Option[] = [
  o('d-rayas', 'Rayas y polvo', 'the scratches and dust specks', 'las rayas y el polvo', { demo: vs('url(#pf-aged)', RESTORED, 'scratches') }),
  o('d-roturas', 'Roturas y dobleces', 'the tears, creases and missing pieces (rebuild them to match the rest of the image)', 'las roturas, los dobleces y las partes faltantes (reconstruilas para que coincidan con el resto de la imagen)', { demo: vs('url(#pf-aged)', RESTORED, 'tear') }),
  o('d-manchas', 'Manchas y humedad', 'the water stains, mold spots and yellowing', 'las manchas de agua, los hongos y el amarillento', { demo: vs('url(#pf-aged)', RESTORED, 'stains') }),
  o('d-desvaida', 'Desvaída', 'the faded contrast (bring back deep blacks and clean whites)', 'el contraste desvaído (devolvele negros profundos y blancos limpios)', { hint: 'Colores o contraste muy lavados.', demo: vs('url(#pf-faded)', 'contrast(1.05)') }),
  o('d-borrosa', 'Borrosa o chica', 'the blur and low resolution (recover natural facial detail without inventing new features)', 'lo borroso y la baja resolución (recuperá el detalle natural de las caras sin inventar rasgos)', { demo: vs('sepia(.45) blur(1.6px)', `${RESTORED} url(#pf-sharp)`) }),
];

/** Variantes de la estética trap: cada una con su vocabulario visual. */
export const POSTER_TRAP: Option[] = [
  o('trap-oscuro', 'Oscuro y crudo', 'raw black and white with crushed blacks, harsh direct flash, heavy grain, a single blood-red accent and gothic blackletter type', 'blanco y negro crudo, con negros profundos, flash directo, mucho grano, un único acento rojo sangre y tipografía gótica', { demo: f('url(#pf-trap)', 'trap') }),
  o('trap-cromo', 'Cromo Y2K', 'Y2K chrome look with liquid metal 3D lettering, iridescent reflections, cool blue and silver tones and a glossy futuristic finish', 'look cromado Y2K, con letras 3D de metal líquido, reflejos tornasolados, tonos azules y plateados y un acabado brillante y futurista', { demo: f('url(#pf-chrome)', 'trap') }),
  o('trap-collage', 'Collage fotocopia', 'photocopy collage with a high-contrast xerox texture, torn paper edges, tape, scribbled marker handwriting and cut-out letters', 'collage de fotocopia, con textura de fotocopia de alto contraste, bordes de papel rasgado, cinta, garabatos con marcador y letras recortadas', { demo: f('url(#pf-xerox)', 'grunge') }),
  o('trap-neon', 'Neón nocturno', 'neon night look with purple and pink neon lighting, haze and smoke, lens flares and glowing outlined type', 'look nocturno de neón, con luces violetas y rosas, humo, destellos de lente y tipografía con contorno luminoso', { demo: f('url(#pf-vapor)', 'trap') }),
  o('trap-lujo', 'Lujo dorado', 'gold luxury look with a deep black background, gold foil accents, diamond sparkle and elegant gold serif type', 'look de lujo dorado, con fondo negro profundo, detalles en dorado metalizado, brillos de diamante y tipografía serif elegante en dorado', { demo: f('url(#pf-gold)', 'trap') }),
];

/** Lo que tiene que quedar igual. Repetirlo en cada iteración reduce la "deriva". */
export const PRESERVAR: Option[] = [
  o('p-rostro', 'Rostro e identidad', 'the face and identity of every person', 'el rostro y la identidad de cada persona'),
  o('p-pose', 'Pose y expresión', 'pose and facial expression', 'la pose y la expresión'),
  o('p-ropa', 'Ropa', 'clothing', 'la ropa'),
  o('p-encuadre', 'Encuadre y composición', 'framing and composition', 'el encuadre y la composición'),
  o('p-colores', 'Colores', 'original colors', 'los colores originales'),
  o('p-luz', 'Iluminación', 'lighting and shadows', 'la iluminación y las sombras'),
  o('p-fondo', 'Fondo', 'background', 'el fondo'),
  o('p-texto', 'Textos y logos', 'any existing text and logos', 'los textos y logos existentes'),
  o('p-proporciones', 'Proporciones', 'proportions and scale', 'las proporciones y la escala'),
];

export const INTENSIDADES: Option[] = [
  o('sutil', 'Sutil', 'Keep the change subtle and natural-looking', 'Que el cambio sea sutil y se vea natural', { hint: 'Recomendado: casi no se nota que se editó.', demo: { kind: 'strength', value: 0.4 } }),
  o('moderada', 'Moderada', 'Make the change clearly visible but realistic', 'Que el cambio se note, pero que sea realista', { demo: { kind: 'strength', value: 0.7 } }),
  o('fuerte', 'Fuerte', 'Make the change bold and dramatic', 'Que el cambio sea fuerte y llamativo', { demo: { kind: 'strength', value: 1 } }),
];

/** Grupos del paso Filtro (Edición y Generación). */
export const FILTROS_GROUPS: Step['groups'] = mergeGroups(FILTROS_GROUPS_BASE, FILTROS_EXTRA_GROUPS);
