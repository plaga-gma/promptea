import type { Demo, Option } from '../../../engine/types';
import { o } from './_helpers';

const diagram = (name: string): Demo => ({ kind: 'diagram', name });
const f = (css: string, overlay?: Extract<Demo, { kind: 'filter' }>['overlay']): Demo => ({ kind: 'filter', css, ...(overlay ? { overlay } : {}) });

/**
 * Operaciones de edición. `{target}` se reemplaza por lo que el usuario escribe en "¿Qué querés cambiar?".
 * Ver docs/01-ingenieria-de-prompts.md §6.
 */
export const OPERACIONES: Option[] = [
  o('quitar-objeto', 'Quitar algo', 'Remove {target} from the photo and fill the area naturally so no trace remains', 'Quitá {target} de la foto y rellená la zona de forma natural, sin dejar rastros', { hint: 'Borrar una persona, un cable, una mancha, un texto…', demo: diagram('op-remove'), meta: { needsTarget: true } }),
  o('quitar-fondo', 'Quitar el fondo', 'Remove the background and leave the subject cleanly isolated on a plain white background', 'Quitá el fondo y dejá al sujeto bien recortado sobre un fondo blanco liso', { hint: 'Recortar a la persona u objeto.', demo: diagram('op-cutout') }),
  o('cambiar-fondo', 'Cambiar el fondo', 'Replace the background with {target}, matching the lighting and perspective of the subject', 'Reemplazá el fondo por {target}, igualando la luz y la perspectiva del sujeto', { hint: 'Poner al sujeto en otro lugar.', demo: diagram('op-background'), meta: { needsTarget: true } }),
  o('agregar', 'Agregar algo', 'Add {target} to the scene, matching the lighting, perspective, scale and shadows', 'Agregá {target} a la escena, igualando la luz, la perspectiva, la escala y las sombras', { hint: 'Sumar un objeto, una persona o un detalle.', demo: diagram('op-add'), meta: { needsTarget: true } }),
  o('cambiar', 'Cambiar un elemento', 'Change {target}, keeping its shape, position and the way light falls on it', 'Cambiá {target}, manteniendo su forma, su posición y cómo le da la luz', { hint: 'Otro color de ropa, otro objeto, otro peinado…', demo: diagram('op-change'), meta: { needsTarget: true } }),
  o('estilo', 'Cambiar el estilo', 'Transform the image into a new art style while keeping the exact content and composition', 'Transformá la imagen a un nuevo estilo artístico, conservando exactamente el contenido y la composición', { hint: 'Convertir una foto en acuarela, anime, cómic…', demo: diagram('op-style') }),
  o('filtro', 'Aplicar un filtro', 'Apply a photo filter and color grade to the whole image', 'Aplicá un filtro y una gradación de color a toda la imagen', { hint: 'Blanco y negro, vintage, cinematográfico…', demo: diagram('op-filter') }),
  o('reiluminar', 'Cambiar la luz', 'Relight the scene with new lighting while keeping everything else identical', 'Volvé a iluminar la escena con una luz nueva, dejando todo lo demás idéntico', { hint: 'Pasar de mediodía a atardecer, agregar luz de neón…', demo: diagram('op-relight') }),
  o('retoque', 'Retocar un retrato', 'Retouch the portrait naturally: even out the skin tone and remove blemishes while keeping real skin texture', 'Retocá el retrato con naturalidad: emparejá el tono de piel y quitá imperfecciones, conservando la textura real de la piel', { hint: 'Mejorar la piel sin que parezca de plástico.', demo: diagram('op-retouch') }),
  o('restaurar', 'Restaurar foto antigua', 'Restore this old photo: remove scratches, dust and stains, and recover sharpness and detail', 'Restaurá esta foto antigua: quitá rayas, polvo y manchas, y recuperá nitidez y detalle', { hint: 'Arreglar fotos viejas dañadas.', demo: diagram('op-restore') }),
  o('colorear', 'Colorear blanco y negro', 'Colorize this black and white photo with realistic, period-accurate colors', 'Coloreá esta foto en blanco y negro con colores realistas y fieles a la época', { hint: 'Darle color a una foto antigua.', demo: diagram('op-colorize') }),
  o('expandir', 'Expandir la imagen', 'Extend the image beyond its borders, continuing the scene seamlessly in the same style and lighting', 'Extendé la imagen más allá de sus bordes, continuando la escena sin cortes con el mismo estilo y luz', { hint: 'Agrandar el encuadre o cambiar el formato (outpainting).', demo: diagram('op-expand') }),
  o('mejorar', 'Mejorar la calidad', 'Enhance the image quality: sharpen details, reduce noise and improve clarity without changing the content', 'Mejorá la calidad de la imagen: más nitidez, menos ruido y más claridad, sin cambiar el contenido', { hint: 'Fotos borrosas, oscuras o con ruido.', demo: diagram('op-enhance') }),
  o('montaje', 'Combinar dos imágenes', 'Combine the subject from image 1 with the scene from image 2 into one realistic composition, matching light, perspective, scale and color', 'Combiná el sujeto de la imagen 1 con la escena de la imagen 2 en una sola composición realista, igualando luz, perspectiva, escala y color', { hint: 'Montaje: unir partes de dos fotos.', demo: diagram('op-composite'), meta: { needsSecondImage: true } }),
  o('texto', 'Agregar o cambiar texto', 'Add the text below to the image, integrated naturally into the scene', 'Agregá el texto de abajo a la imagen, integrado de forma natural en la escena', { hint: 'Un cartel, un título o corregir un texto.', demo: diagram('op-text') }),
];

/** Filtros y gradación de color. La demo aplica el filtro real (CSS) sobre una imagen de muestra. */
export const FILTROS: Option[] = [
  o('bn', 'Blanco y negro', 'classic black and white conversion with rich tonal range', 'conversión clásica a blanco y negro con buena gama de grises', { demo: f('grayscale(1) contrast(1.1)') }),
  o('sepia', 'Sepia', 'warm sepia tone', 'tono sepia cálido', { demo: f('sepia(.85) contrast(1.05)') }),
  o('vintage', 'Vintage', 'vintage film look with faded colors and a warm cast', 'look vintage de película con colores desvaídos y un tono cálido', { demo: f('sepia(.35) saturate(.8) contrast(.9) brightness(1.05)', 'vignette') }),
  o('pelicula', 'Película analógica', 'analog 35mm film look with natural grain', 'look de película analógica de 35 mm con grano natural', { demo: f('contrast(1.05) saturate(1.1) sepia(.1)', 'grain') }),
  o('cine', 'Cinematográfico (teal & orange)', 'cinematic teal and orange color grade', 'gradación de color cinematográfica turquesa y naranja', { demo: f('contrast(1.15) saturate(1.25) hue-rotate(-8deg)', 'duotone') }),
  o('calido', 'Cálido', 'warm golden color grade', 'gradación de color cálida y dorada', { demo: f('sepia(.25) saturate(1.3) hue-rotate(-10deg)') }),
  o('frio', 'Frío', 'cool bluish color grade', 'gradación de color fría y azulada', { demo: f('saturate(.9) hue-rotate(18deg) brightness(1.05)') }),
  o('contraste', 'Alto contraste', 'punchy high-contrast look', 'look intenso de alto contraste', { demo: f('contrast(1.5) saturate(1.2)') }),
  o('desaturado', 'Desaturado', 'muted desaturated colors', 'colores apagados y desaturados', { demo: f('saturate(.4)') }),
  o('mate', 'Mate (negros lavados)', 'matte look with lifted blacks and soft contrast', 'look mate con negros lavados y contraste suave', { demo: f('contrast(.85) brightness(1.1) saturate(.9)', 'matte') }),
  o('duotono', 'Duotono', 'two-color duotone effect', 'efecto duotono de dos colores', { demo: f('grayscale(1) contrast(1.2)', 'duotone') }),
  o('hdr', 'HDR', 'vivid HDR look with detailed shadows and highlights', 'look HDR vívido con detalle en sombras y luces', { demo: f('contrast(1.25) saturate(1.45) brightness(1.05)') }),
  o('cross', 'Proceso cruzado', 'cross-processed film look with shifted colors', 'look de proceso cruzado con colores desplazados', { demo: f('hue-rotate(-25deg) saturate(1.6) contrast(1.2)') }),
  o('vineta', 'Viñeta', 'soft dark vignette around the edges', 'viñeta oscura suave en los bordes', { demo: f('none', 'vignette') }),
  o('bokeh', 'Fondo desenfocado', 'blurred background with creamy bokeh, subject in sharp focus', 'fondo desenfocado con bokeh suave y el sujeto en foco', { demo: f('saturate(1.1)', 'bokeh') }),
  o('destellos', 'Destellos de luz', 'warm light leaks and lens flare', 'filtraciones de luz cálidas y destellos de lente', { demo: f('brightness(1.05)', 'light-leak') }),
  o('glitch', 'Glitch', 'digital glitch effect with RGB split', 'efecto glitch digital con separación RGB', { demo: f('saturate(1.3)', 'glitch') }),
  o('infrarrojo', 'Infrarrojo', 'surreal infrared photography look', 'look surrealista de fotografía infrarroja', { demo: f('hue-rotate(160deg) saturate(1.6) contrast(1.1)') }),
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
  o('sutil', 'Sutil', 'Keep the change subtle and natural-looking', 'Que el cambio sea sutil y se vea natural', { hint: 'Recomendado: casi no se nota que se editó.' }),
  o('moderada', 'Moderada', 'Make the change clearly visible but realistic', 'Que el cambio se note, pero que sea realista'),
  o('fuerte', 'Fuerte', 'Make the change bold and dramatic', 'Que el cambio sea fuerte y llamativo'),
];
