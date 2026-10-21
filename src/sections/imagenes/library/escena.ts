import type { Demo, Option, Step } from '../../../engine/types';
import { o } from './_helpers';

const g = (colors: string[], glyph: string): Demo => ({ kind: 'gradient', colors, glyph });
const f = (css: string, overlay?: Extract<Demo, { kind: 'filter' }>['overlay']): Demo => ({ kind: 'filter', css, ...(overlay ? { overlay } : {}) });

/** Época: en qué momento de la historia (o del futuro) ocurre la escena. */
export const EPOCAS: Option[] = [
  o('prehistoria', 'Prehistoria', 'prehistoric times', 'la prehistoria', { demo: g(['#8d6e4f', '#3e2c1c'], '🦴') }),
  o('antiguedad', 'Antigüedad', 'ancient Greece and Rome', 'la Antigua Grecia y Roma', { hint: 'Templos, togas y mármol.', demo: g(['#e9dcc5', '#9c7a4f'], '🏛️') }),
  o('medieval', 'Edad Media', 'medieval times', 'la Edad Media', { hint: 'Castillos, caballeros y aldeas.', demo: g(['#5b5f4b', '#2f2a24'], '🏰') }),
  o('victoriana', 'Siglo XIX', 'the Victorian era of the 1800s', 'la época victoriana del siglo XIX', { hint: 'Época victoriana: faroles, carruajes y sombreros de copa.', demo: g(['#5a3e2b', '#c9a66b'], '1890') }),
  o('anos20', 'Años 20', 'the roaring 1920s', 'los locos años 20', { hint: 'Jazz, Art Déco y glamour.', demo: g(['#111111', '#d4af37'], '1920') }),
  o('anos50', 'Años 50', 'the 1950s', 'los años 50', { hint: 'Rock and roll, autos con aletas y colores pastel.', demo: g(['#7ec4cf', '#f7b2bd'], '1950') }),
  o('anos70', 'Años 70', 'the 1970s', 'los años 70', { hint: 'Disco, colores tierra y estampados.', demo: g(['#e76f22', '#8a4b20'], '1970') }),
  o('anos80', 'Años 80', 'the 1980s', 'los años 80', { hint: 'Neón, sintetizadores y peinados enormes.', demo: g(['#ff2bd6', '#2d00f7'], '1980') }),
  o('anos90', 'Años 90', 'the 1990s', 'los años 90', { hint: 'Grunge, videojuegos y cámaras descartables.', demo: g(['#2a9d8f', '#e9c46a'], '1990') }),
  o('y2k-epoca', 'Años 2000', 'the early 2000s (Y2K era)', 'principios de los 2000 (era Y2K)', { hint: 'Celulares con tapita, brillos y cromo.', demo: g(['#c0c0c0', '#b5b2ff'], '2000') }),
  o('actual', 'Actualidad', 'the present day', 'la actualidad', { demo: g(['#6d4aff', '#ff6b5b'], 'Hoy') }),
  o('futuro', 'Futuro', 'the distant future', 'un futuro lejano', { hint: 'Ciencia ficción: tecnología avanzada.', demo: g(['#0b1d51', '#00f0ff'], '3000') }),
];

/** Clima y estación. */
export const CLIMAS: Option[] = [
  o('despejado', 'Despejado', 'on a clear sunny day', 'en un día despejado y soleado', { demo: g(['#8ecae6', '#ffd166'], '☀️') }),
  o('nublado-clima', 'Nublado', 'under a soft overcast sky', 'bajo un cielo nublado y suave', { demo: g(['#cfd8dc', '#90a4ae'], '☁️') }),
  o('lluvia', 'Lluvia', 'in the rain, with falling raindrops and wet surfaces', 'bajo la lluvia, con gotas cayendo y superficies mojadas', { demo: g(['#546e7a', '#263238'], '🌧️') }),
  o('post-lluvia', 'Después de la lluvia', 'after the rain, with puddles and glossy reflections', 'después de la lluvia, con charcos y reflejos brillantes', { hint: 'Calles mojadas que reflejan las luces.', demo: g(['#37474f', '#ffb74d'], '💧') }),
  o('nieve', 'Nieve', 'in falling snow, a snowy winter landscape', 'con nieve cayendo, en un paisaje invernal nevado', { demo: g(['#e3f2fd', '#90caf9'], '❄️') }),
  o('niebla', 'Niebla', 'in thick fog, soft and hazy', 'entre niebla espesa, suave y brumosa', { hint: 'Misterio: el fondo se pierde en la bruma.', demo: g(['#eceff1', '#b0bec5'], '🌫️') }),
  o('tormenta', 'Tormenta', 'during a dramatic thunderstorm with lightning', 'durante una tormenta dramática con relámpagos', { demo: g(['#1a1a2e', '#4a4e69'], '⛈️') }),
  o('viento', 'Viento', 'on a windy day, with hair and fabric blowing in the wind', 'en un día ventoso, con el pelo y la ropa volando', { hint: 'Movimiento: pelo, hojas y telas al viento.', demo: g(['#a8dadc', '#457b9d'], '🌬️') }),
  o('primavera', 'Primavera', 'in spring, with blooming flowers', 'en primavera, con flores abiertas', { demo: g(['#ffc8dd', '#a7c957'], '🌸') }),
  o('verano', 'Verano', 'in midsummer heat, vivid and bright', 'en pleno verano, con calor y colores vivos', { demo: g(['#ffd166', '#06d6a0'], '🌴') }),
  o('otono', 'Otoño', 'in autumn, with falling orange leaves', 'en otoño, con hojas naranjas cayendo', { demo: g(['#e76f51', '#8a4b20'], '🍂') }),
  o('invierno', 'Invierno', 'in cold winter, with frost and bare trees', 'en pleno invierno, con escarcha y árboles sin hojas', { demo: g(['#caf0f8', '#5e6472'], '🧣') }),
];

/** Expresión y pose (si hay personas o animales). */
export const EXPRESIONES: Option[] = [
  o('sonrisa', 'Sonrisa natural', 'with a natural warm smile', 'con una sonrisa natural y cálida', { demo: g(['#ffd166', '#ff9f1c'], '🙂') }),
  o('risa', 'Riendo', 'laughing candidly', 'riendo de forma espontánea', { demo: g(['#ffd166', '#ef476f'], '😄') }),
  o('serio', 'Serio', 'with a serious, confident expression', 'con una expresión seria y segura', { demo: g(['#adb5bd', '#495057'], '😐') }),
  o('pensativo', 'Pensativo', 'with a thoughtful, pensive expression', 'con una expresión pensativa', { demo: g(['#a2d2ff', '#5e60ce'], '🤔') }),
  o('sorpresa', 'Sorprendido', 'with a surprised expression and wide eyes', 'con cara de sorpresa y los ojos bien abiertos', { demo: g(['#ffbe0b', '#fb5607'], '😮') }),
  o('melancolia', 'Melancólico', 'with a melancholic, wistful expression', 'con una expresión melancólica', { demo: g(['#6c757d', '#343a40'], '😔') }),
  o('decidido', 'Decidido', 'with a fierce, determined look', 'con una mirada feroz y decidida', { demo: g(['#d00000', '#370617'], '😤') }),
  o('mirada-camara', 'Mirando a cámara', 'looking directly at the camera', 'mirando directo a la cámara', { hint: 'Conecta con quien mira la imagen.', demo: g(['#cdb4db', '#6d4aff'], '👀') }),
  o('mirada-lejos', 'Mirando a lo lejos', 'gazing into the distance', 'mirando a lo lejos', { demo: g(['#bde0fe', '#457b9d'], '🌅') }),
  o('ojos-cerrados', 'Ojos cerrados', 'with eyes closed, serene', 'con los ojos cerrados, en calma', { demo: g(['#e0c3fc', '#8ec5fc'], '😌') }),
  o('espontaneo', 'En movimiento', 'caught mid-movement in a candid moment', 'captado en pleno movimiento, en un momento espontáneo', { hint: 'Sin posar: como una foto robada.', demo: g(['#06d6a0', '#118ab2'], '🏃') }),
  o('pose-moda', 'Pose de modelo', 'striking a confident fashion model pose', 'en una pose segura de modelo', { demo: g(['#111111', '#c9a227'], '💃') }),
];

/**
 * Cámara y película (solo fotografía). Las demos aplican un look parecido sobre la foto de muestra.
 * Nombrar la cámara o el rollo es una de las formas más efectivas de pedir un "look" fotográfico.
 */
export const CAMARAS: Option[] = [
  o('celular', 'Celular', 'a modern smartphone camera, casual and realistic', 'la cámara de un celular moderno, casual y realista', { hint: 'Natural, como una foto que sacarías vos.', demo: f('contrast(1.04) saturate(1.12) brightness(1.03)') }),
  o('mirrorless', 'Cámara profesional', 'a professional full-frame camera, crisp and detailed', 'una cámara profesional full frame, nítida y detallada', { hint: 'Calidad de fotógrafo profesional.', demo: f('contrast(1.08) saturate(1.05)') }),
  o('medio-formato', 'Medio formato', 'a medium format camera, ultra detailed with smooth tonal range', 'una cámara de medio formato, ultra detallada y con tonos suaves', { hint: 'La de las campañas de moda: detalle y suavidad.', demo: f('contrast(.96) saturate(.95) brightness(1.04)') }),
  o('cine-camara', 'Cámara de cine', 'a digital cinema camera with anamorphic lenses', 'una cámara de cine digital con lentes anamórficos', { hint: 'Look de película de Hollywood.', demo: f('url(#pf-teal) contrast(1.05)', 'vignette') }),
  o('portra', 'Rollo Kodak Portra', 'Kodak Portra 400 film, warm natural skin tones, soft grain', 'película Kodak Portra 400, pieles cálidas y naturales, grano suave', { hint: 'El rollo favorito para retratos: cálido y suave.', demo: f('url(#pf-portra)', 'grain') }),
  o('velvia', 'Rollo Fujifilm Velvia', 'Fujifilm Velvia slide film, deeply saturated colors', 'película de diapositiva Fujifilm Velvia, colores muy saturados', { hint: 'Paisajes con colores intensos.', demo: f('url(#pf-velvia)') }),
  o('cinestill', 'Rollo CineStill 800T', 'CineStill 800T film, tungsten-balanced colors with red halation around lights', 'película CineStill 800T, colores fríos de tungsteno y halos rojos alrededor de las luces', { hint: 'Noches urbanas con halos rojos en las luces.', demo: f('url(#pf-cinestill)', 'grain') }),
  o('hp5', 'Rollo blanco y negro', 'Ilford HP5 black and white film, rich grain', 'película blanco y negro Ilford HP5, grano marcado', { hint: 'Blanco y negro clásico con grano.', demo: f('url(#pf-bn)', 'grain') }),
  o('instantanea', 'Instantánea', 'an instant film camera, soft dreamy colors', 'una cámara instantánea, colores suaves y soñados', { hint: 'Tipo Polaroid: colores lavados y suaves.', demo: f('url(#pf-polaroid)') }),
  o('descartable', 'Descartable con flash', 'a disposable camera with direct flash, nostalgic snapshot', 'una cámara descartable con flash directo, foto casual nostálgica', { hint: 'Fiesta de los 90: flash directo y grano.', demo: f('url(#pf-flash)', 'grain') }),
  o('camara-seguridad', 'Cámara de seguridad', 'a grainy CCTV security camera', 'una cámara de seguridad granulada', { hint: 'Imagen de vigilancia: gris, granulada y fría.', demo: f('url(#pf-cctv)', 'scan') }),
  o('daguerrotipo', 'Foto antigua (1800s)', 'an antique 19th-century daguerreotype camera', 'una cámara antigua de daguerrotipo del siglo XIX', { hint: 'Las primeras fotos de la historia.', demo: f('sepia(.7) contrast(1.25) brightness(.95) blur(.4px)', 'vignette') }),
];

/** Materiales (útil en 3D, producto y objetos). */
export const MATERIALES: Option[] = [
  o('vidrio', 'Vidrio', 'transparent glass', 'vidrio transparente', { demo: g(['#e0fbfc', '#98c1d9'], '🫙') }),
  o('cromo', 'Cromo', 'polished chrome', 'cromo pulido', { demo: g(['#f8f9fa', '#6c757d'], '🪞') }),
  o('oro', 'Oro', 'shiny gold', 'oro brillante', { demo: g(['#ffe8a3', '#b8860b'], '🥇') }),
  o('marmol', 'Mármol', 'white veined marble', 'mármol blanco veteado', { demo: g(['#ffffff', '#ced4da'], '🏛️') }),
  o('madera', 'Madera', 'natural wood grain', 'madera natural con vetas', { demo: g(['#c08552', '#5e3023'], '🪵') }),
  o('ceramica', 'Cerámica', 'glazed ceramic', 'cerámica esmaltada', { demo: g(['#f1faee', '#a8dadc'], '🏺') }),
  o('terciopelo', 'Terciopelo', 'soft velvet fabric', 'terciopelo suave', { demo: g(['#7b2cbf', '#3c096c'], '🛋️') }),
  o('plastico', 'Plástico brillante', 'glossy colorful plastic', 'plástico brillante de colores', { demo: g(['#ff595e', '#ffca3a'], '🧸') }),
  o('papel-material', 'Papel y cartón', 'paper and cardboard', 'papel y cartón', { demo: g(['#f1e3c6', '#c8a27c'], '📦') }),
  o('hielo', 'Hielo', 'translucent ice', 'hielo translúcido', { demo: g(['#e0f7ff', '#7fc8f8'], '🧊') }),
  o('concreto', 'Concreto', 'raw concrete', 'concreto crudo', { demo: g(['#b0b0b0', '#6b6b6b'], '🧱') }),
  o('neon-material', 'Tubos de neón', 'glowing neon tubes', 'tubos de neón encendidos', { demo: g(['#1a0033', '#ff2bd6'], '💡') }),
];

/** Categorías de época, clima, expresión, cámara y material. */
export const EPOCAS_GROUPS: Step['groups'] = [
  { id: 'historia', label: { es: 'Historia' }, optionIds: ['prehistoria', 'antiguedad', 'medieval', 'victoriana'] },
  { id: 'siglo20', label: { es: 'Siglo XX' }, optionIds: ['anos20', 'anos50', 'anos70', 'anos80', 'anos90'] },
  { id: 'hoy', label: { es: 'Hoy y mañana' }, optionIds: ['y2k-epoca', 'actual', 'futuro'] },
];

export const CLIMAS_GROUPS: Step['groups'] = [
  { id: 'clima', label: { es: 'Clima' }, optionIds: ['despejado', 'nublado-clima', 'lluvia', 'post-lluvia', 'nieve', 'niebla', 'tormenta', 'viento'] },
  { id: 'estaciones', label: { es: 'Estaciones' }, optionIds: ['primavera', 'verano', 'otono', 'invierno'] },
];

export const EXPRESIONES_GROUPS: Step['groups'] = [
  { id: 'gesto', label: { es: 'Gesto' }, optionIds: ['sonrisa', 'risa', 'serio', 'pensativo', 'sorpresa', 'melancolia', 'decidido'] },
  { id: 'mirada', label: { es: 'Mirada y pose' }, optionIds: ['mirada-camara', 'mirada-lejos', 'ojos-cerrados', 'espontaneo', 'pose-moda'] },
];

export const CAMARAS_GROUPS: Step['groups'] = [
  { id: 'camaras', label: { es: 'Cámaras' }, optionIds: ['celular', 'mirrorless', 'medio-formato', 'cine-camara', 'camara-seguridad'] },
  { id: 'rollos', label: { es: 'Rollos de película' }, optionIds: ['portra', 'velvia', 'cinestill', 'hp5'] },
  { id: 'epoca', label: { es: 'Fotos de otra época' }, optionIds: ['instantanea', 'descartable', 'daguerrotipo'] },
];

export const MATERIALES_GROUPS: Step['groups'] = [
  { id: 'brillantes', label: { es: 'Brillantes' }, optionIds: ['vidrio', 'cromo', 'oro', 'plastico', 'hielo', 'neon-material'] },
  { id: 'naturales', label: { es: 'Naturales y sólidos' }, optionIds: ['marmol', 'madera', 'ceramica', 'terciopelo', 'papel-material', 'concreto'] },
];
