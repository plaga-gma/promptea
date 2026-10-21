import type { Demo, Option, Step } from '../../../engine/types';
import { o } from './_helpers';

const sw = (...colors: string[]) => ({ kind: 'swatch' as const, colors });

/**
 * Paletas listas. Los colores de la demo también viajan al prompt como HEX.
 * La herramienta de armonías (src/engine/color.ts) permite crear una propia.
 */
export const PALETAS: Option[] = [
  o('pastel', 'Pastel', 'soft pastel color palette', 'paleta de colores pastel suaves', { hint: 'Suave, dulce y tranquila.', demo: sw('#ffd6e0', '#c1e7e3', '#fff1b6', '#d7c4f0') }),
  o('tierra', 'Tonos tierra', 'warm earth tone palette of terracotta, ochre and olive', 'paleta de tonos tierra: terracota, ocre y oliva', { hint: 'Cálida, natural y artesanal.', demo: sw('#c8553d', '#d9a441', '#6b705c', '#3f2e26') }),
  o('neon', 'Neón', 'vibrant neon palette of electric pink, cyan and purple on dark', 'paleta neón vibrante: rosa eléctrico, cian y violeta sobre oscuro', { hint: 'Energía, noche y tecnología.', demo: sw('#ff2bd6', '#00f0ff', '#7b2dff', '#0b0620') }),
  o('monocromo', 'Monocromática', 'monochromatic palette in shades of a single blue', 'paleta monocromática en tonos de un solo azul', { hint: 'Un solo color en varias intensidades: elegante y coherente.', demo: sw('#0b2545', '#13315c', '#3e7cb1', '#a9cef4') }),
  o('blanco-negro', 'Blanco y negro', 'black and white palette, high contrast', 'paleta en blanco y negro, alto contraste', { hint: 'Atemporal y contundente.', demo: sw('#000000', '#4a4a4a', '#bdbdbd', '#ffffff') }),
  o('vintage', 'Vintage', 'muted vintage palette of faded mustard, teal and cream', 'paleta vintage apagada: mostaza, verde azulado y crema desgastados', { hint: 'Colores lavados con aire retro.', demo: sw('#d4a24c', '#3e7c7b', '#f3e9d2', '#a4572a') }),
  o('retro70', 'Retro 70s', '1970s retro palette of orange, brown and mustard', 'paleta retro de los 70: naranja, marrón y mostaza', { hint: 'Groovy: naranjas, marrones y mostazas.', demo: sw('#e76f22', '#8a4b20', '#e9b949', '#f4e1c1') }),
  o('lujo', 'Lujo', 'luxury palette of black, gold and ivory', 'paleta de lujo: negro, dorado y marfil', { hint: 'Elegancia y exclusividad.', demo: sw('#0b0b0b', '#c9a227', '#f6f1e7', '#3b3b3b') }),
  o('oceano', 'Océano', 'cool ocean palette of navy, teal and sand', 'paleta océano fría: azul marino, verde agua y arena', { hint: 'Fresca, calma y confiable.', demo: sw('#03256c', '#2a9d8f', '#8ecae6', '#f1e3c6') }),
  o('bosque', 'Bosque', 'deep forest palette of emerald, moss and bark brown', 'paleta bosque profundo: esmeralda, musgo y marrón corteza', { hint: 'Natural, orgánica y serena.', demo: sw('#1b4332', '#52b788', '#95a472', '#5c4033') }),
  o('atardecer', 'Atardecer', 'sunset gradient palette of coral, magenta and violet', 'paleta degradada de atardecer: coral, magenta y violeta', { hint: 'Cálida y emotiva.', demo: sw('#ff9e64', '#ff5d8f', '#b5179e', '#3a0ca3') }),
  o('vibrante', 'Primarios vibrantes', 'bold primary palette of red, yellow and blue', 'paleta de primarios intensos: rojo, amarillo y azul', { hint: 'Lúdica, enérgica, estilo Bauhaus o infantil.', demo: sw('#e63946', '#ffd60a', '#1d4ed8', '#ffffff') }),
  o('corporativo', 'Corporativo', 'clean corporate palette of navy blue, light gray and white', 'paleta corporativa limpia: azul marino, gris claro y blanco', { hint: 'Confianza y profesionalismo.', demo: sw('#0a2342', '#2c6e9b', '#e5e7eb', '#ffffff') }),
  o('joya', 'Tonos joya', 'rich jewel tone palette of emerald, sapphire, ruby and amethyst', 'paleta de tonos joya: esmeralda, zafiro, rubí y amatista', { hint: 'Colores profundos y elegantes.', demo: sw('#0b6e4f', '#1d3a8a', '#9b1d42', '#5b2a86') }),
  o('mediterraneo', 'Mediterráneo', 'Mediterranean palette of whitewash, cobalt blue and terracotta', 'paleta mediterránea: blanco cal, azul cobalto y terracota', { hint: 'Grecia, sol y mar.', demo: sw('#f8f4ec', '#1f4e9c', '#d9734e', '#e9c46a') }),
  o('tropical', 'Tropical', 'vibrant tropical palette of lime, turquoise, mango and flamingo pink', 'paleta tropical vibrante: lima, turquesa, mango y rosa flamenco', { hint: 'Verano, frutas y playa.', demo: sw('#9bd13d', '#1cc6c0', '#ffb703', '#ff5d8f') }),
  o('nordico', 'Nórdica', 'calm Nordic palette of warm white, light oak, sage and charcoal', 'paleta nórdica calma: blanco cálido, roble claro, verde salvia y carbón', { hint: 'Escandinavo: claro, natural y sereno.', demo: sw('#f5f1ea', '#d8c3a5', '#9caf88', '#3d3d3d') }),
  o('otono-paleta', 'Otoño', 'autumn palette of rust, burnt orange, mustard and deep brown', 'paleta otoñal: óxido, naranja quemado, mostaza y marrón profundo', { hint: 'Cálida y acogedora.', demo: sw('#9c3d1a', '#d9772b', '#d4a017', '#4a2c1d') }),
  o('caramelo', 'Caramelo', 'playful candy palette of bubblegum pink, lemon, mint and sky blue', 'paleta caramelo divertida: rosa chicle, limón, menta y celeste', { hint: 'Dulce, divertida e infantil.', demo: sw('#ff8fab', '#fff275', '#9ef0c6', '#7cc6fe') }),
  o('cyberpunk-paleta', 'Cyberpunk', 'cyberpunk palette of hot magenta, acid yellow and electric teal on black', 'paleta cyberpunk: magenta intenso, amarillo ácido y turquesa eléctrico sobre negro', { hint: 'Futuro nocturno y tecnológico.', demo: sw('#ff006e', '#f5f500', '#00e5d4', '#0a0a12') }),
  o('cafe', 'Café y crema', 'cozy coffee palette of espresso, caramel, latte and cream', 'paleta café acogedora: espresso, caramelo, latte y crema', { hint: 'Cálida, ideal para cafeterías y panaderías.', demo: sw('#3b2418', '#a8642a', '#d2b48c', '#f5ebdd') }),
  o('gotico', 'Oscura', 'dark moody palette of charcoal, burgundy and deep plum', 'paleta oscura y sombría: carbón, bordó y ciruela', { hint: 'Misteriosa y dramática.', demo: sw('#1c1c1c', '#5e1914', '#3d1e3f', '#8c8c8c') }),
];

/** Atmósfera (mood). */
const g = (...colors: string[]) => ({ kind: 'gradient' as const, colors });
export const ATMOSFERAS: Option[] = [
  o('serena', 'Serena', 'a serene, peaceful atmosphere', 'una atmósfera serena y tranquila', { hint: 'Calma y paz.', demo: g('#cde7f0', '#f6efe3') }),
  o('alegre', 'Alegre', 'a joyful, upbeat atmosphere', 'una atmósfera alegre y positiva', { hint: 'Energía positiva y optimismo.', demo: g('#ffd23f', '#ff7aa2') }),
  o('dramatica', 'Dramática', 'a dramatic, intense atmosphere', 'una atmósfera dramática e intensa', { hint: 'Tensión y emoción fuerte.', demo: g('#1b1b1b', '#9b2226') }),
  o('misteriosa', 'Misteriosa', 'a mysterious, enigmatic atmosphere', 'una atmósfera misteriosa y enigmática', { hint: 'Intriga y secretos.', demo: g('#0f1c2e', '#4b3f72') }),
  o('nostalgica', 'Nostálgica', 'a nostalgic, wistful atmosphere', 'una atmósfera nostálgica', { hint: 'Recuerdos y añoranza.', demo: g('#e3b778', '#8d6346') }),
  o('acogedora', 'Acogedora', 'a cozy, warm and inviting atmosphere', 'una atmósfera acogedora, cálida e invitante', { hint: 'Como estar en casa un día de lluvia.', demo: g('#f3c98b', '#a05a2c') }),
  o('epica', 'Épica', 'an epic, awe-inspiring atmosphere', 'una atmósfera épica e imponente', { hint: 'Grandeza y asombro.', demo: g('#2b2d42', '#ef8354') }),
  o('onirica', 'Onírica', 'a dreamy, ethereal atmosphere', 'una atmósfera onírica y etérea', { hint: 'Como un sueño: suave y mágico.', demo: g('#e0c3fc', '#8ec5fc') }),
  o('inquietante', 'Inquietante', 'an eerie, unsettling atmosphere', 'una atmósfera inquietante', { hint: 'Algo no está bien: suspenso.', demo: g('#1f2d1f', '#7a8450') }),
  o('melancolica', 'Melancólica', 'a melancholic, quiet atmosphere', 'una atmósfera melancólica y silenciosa', { hint: 'Tristeza suave y reflexiva.', demo: g('#5c677d', '#b8c0cc') }),
  o('energica', 'Enérgica', 'an energetic, dynamic atmosphere', 'una atmósfera enérgica y dinámica', { hint: 'Movimiento y adrenalina.', demo: g('#ff006e', '#fb5607') }),
  o('lujosa', 'Lujosa', 'a luxurious, sophisticated atmosphere', 'una atmósfera lujosa y sofisticada', { hint: 'Elegancia y exclusividad.', demo: g('#111111', '#c9a227') }),
  o('romantica', 'Romántica', 'a romantic, tender atmosphere', 'una atmósfera romántica y tierna', { hint: 'Amor y ternura.', demo: g('#ffafcc', '#c9184a') }),
  o('futurista', 'Futurista', 'a sleek, futuristic atmosphere', 'una atmósfera futurista y sofisticada', { hint: 'Tecnología y vanguardia.', demo: g('#00f0ff', '#2d00f7') }),
  o('festiva', 'Festiva', 'a festive, celebratory atmosphere', 'una atmósfera festiva y de celebración', { hint: 'Fiesta, brindis y confeti.', demo: g('#ffbe0b', '#8338ec') }),
  o('intima', 'Íntima', 'an intimate, quiet and personal atmosphere', 'una atmósfera íntima, silenciosa y personal', { hint: 'Cercana y en voz baja.', demo: g('#6d597a', '#e56b6f') }),
  o('solitaria', 'Solitaria', 'a lonely, solitary atmosphere', 'una atmósfera de soledad', { hint: 'Una figura sola en un gran espacio.', demo: g('#415a77', '#0d1b2a') }),
  o('caotica', 'Caótica', 'a chaotic, frenetic atmosphere', 'una atmósfera caótica y frenética', { hint: 'Mucho pasando a la vez.', demo: g('#f72585', '#4cc9f0') }),
];

/** Texturas y acabado. */
const tx = (name: string) => ({ kind: 'texture' as const, name });
/** Las texturas que se pueden ver sobre una foto usan la misma demo que los filtros. */
const onPhoto = (css: string, overlay: Extract<Demo, { kind: 'filter' }>['overlay']): Demo => ({ kind: 'filter', css, overlay });
export const TEXTURAS: Option[] = [
  o('grano', 'Grano de película', 'subtle film grain', 'grano de película sutil', { hint: 'Aspecto analógico y orgánico.', demo: onPhoto('contrast(1.05)', 'grain') }),
  o('papel', 'Textura de papel', 'visible paper texture', 'textura de papel visible', { hint: 'Como impreso o dibujado sobre papel.', demo: onPhoto('sepia(.2) contrast(.92)', 'paper') }),
  o('trama', 'Trama de puntos', 'halftone dot texture', 'textura de trama de puntos (halftone)', { hint: 'Puntos de impresión, estilo cómic o retro.', demo: onPhoto('url(#pf-halftone)', 'halftone') }),
  o('lienzo', 'Lienzo', 'canvas texture', 'textura de lienzo', { hint: 'La trama de la tela de un cuadro.', demo: onPhoto('saturate(1.1) contrast(.95)', 'canvas') }),
  o('grunge', 'Grunge', 'distressed grunge texture, scratches and wear', 'textura grunge desgastada, rayones y uso', { hint: 'Gastado, sucio y con carácter.', demo: onPhoto('contrast(1.15) saturate(.7)', 'grunge') }),
  o('brillante', 'Brillante', 'glossy reflective finish', 'acabado brillante y reflectante', { hint: 'Superficies que reflejan la luz.', demo: tx('glossy') }),
  o('mate', 'Mate', 'soft matte finish', 'acabado mate suave', { hint: 'Sin brillos: suave y moderno.', demo: tx('matte') }),
  o('metalico', 'Metálico', 'brushed metallic texture', 'textura metálica cepillada', { hint: 'Acero, cromo o aluminio.', demo: tx('metal') }),
  o('holografico', 'Holográfico', 'iridescent holographic sheen', 'brillo holográfico iridiscente', { hint: 'Reflejos tornasolados, como un holograma.', demo: tx('holo') }),
  o('vhs', 'VHS', 'VHS tape artifacts, scanlines and color bleed', 'artefactos de cinta VHS, líneas de escaneo y color corrido', { hint: 'Video casero de los 80 y 90.', demo: onPhoto('url(#pf-vhs)', 'scan') }),
];

/** Formato (relación de aspecto). */
const r = (w: number, h: number) => ({ kind: 'ratio' as const, w, h });
export const FORMATOS: Option[] = [
  o('1-1', 'Cuadrado 1:1', 'square 1:1 format', 'formato cuadrado 1:1', { hint: 'Posts, logos, íconos, portadas de álbum.', demo: r(1, 1), meta: { ratio: [1, 1] } }),
  o('4-5', 'Vertical 4:5', 'vertical 4:5 format', 'formato vertical 4:5', { hint: 'El mejor para posts de Instagram y flyers digitales.', demo: r(4, 5), meta: { ratio: [4, 5] } }),
  o('2-3', 'Vertical 2:3', 'vertical 2:3 format', 'formato vertical 2:3', { hint: 'Pósters, portadas de libro, Pinterest.', demo: r(2, 3), meta: { ratio: [2, 3] } }),
  o('3-4', 'Vertical 3:4', 'vertical 3:4 format', 'formato vertical 3:4', { hint: 'Retratos y fotos verticales clásicas.', demo: r(3, 4), meta: { ratio: [3, 4] } }),
  o('9-16', 'Historia 9:16', 'vertical 9:16 format', 'formato vertical 9:16', { hint: 'Historias, Reels, TikTok y fondos de celular.', demo: r(9, 16), meta: { ratio: [9, 16] } }),
  o('4-3', 'Horizontal 4:3', 'horizontal 4:3 format', 'formato horizontal 4:3', { hint: 'Presentaciones y fotos de celular apaisadas.', demo: r(4, 3), meta: { ratio: [4, 3] } }),
  o('3-2', 'Horizontal 3:2', 'horizontal 3:2 format', 'formato horizontal 3:2', { hint: 'La foto clásica de cámara.', demo: r(3, 2), meta: { ratio: [3, 2] } }),
  o('16-9', 'Panorámico 16:9', 'widescreen 16:9 format', 'formato panorámico 16:9', { hint: 'Miniaturas de YouTube, banners y fondos de pantalla.', demo: r(16, 9), meta: { ratio: [16, 9] } }),
  o('21-9', 'Cine 21:9', 'ultra-wide cinematic 21:9 format', 'formato cinematográfico ultra ancho 21:9', { hint: 'Look de película en pantalla ancha.', demo: r(21, 9), meta: { ratio: [21, 9] } }),
];

/** Lo que se quiere evitar. El fragmento va en positivo; `avoid` alimenta los campos negativos. */
export const EVITAR: Option[] = [
  o('sin-texto', 'Sin texto', 'a clean image free of any lettering', 'una imagen limpia, libre de letras', { hint: 'Evita letras y carteles inventados.', meta: { avoid: ['text', 'letters', 'watermark'] } }),
  o('sin-gente', 'Sin personas', 'an empty scene with no people around', 'una escena vacía, sin personas alrededor', { hint: 'Paisajes o lugares sin gente.', meta: { avoid: ['people', 'person', 'crowd'] } }),
  o('sin-marca-agua', 'Sin marcas de agua ni firmas', 'a clean image without signatures', 'una imagen limpia, sin firmas', { meta: { avoid: ['watermark', 'signature', 'logo'] } }),
  o('sin-deformaciones', 'Sin deformaciones', 'anatomically correct, natural proportions', 'anatomía correcta, proporciones naturales', { hint: 'Manos y caras bien formadas.', meta: { avoid: ['deformed hands', 'extra fingers', 'distorted face'] } }),
  o('sin-borroso', 'Sin desenfoque', 'tack-sharp details throughout', 'detalles nítidos en toda la imagen', { meta: { avoid: ['blurry', 'out of focus'] } }),
  o('sin-saturar', 'Sin colores saturados', 'natural, balanced colors', 'colores naturales y equilibrados', { hint: 'Evita el look "pasado de color".', meta: { avoid: ['oversaturated colors'] } }),
  o('sin-fondo-recargado', 'Sin fondo recargado', 'a simple uncluttered background', 'un fondo simple y despejado', { meta: { avoid: ['cluttered background', 'busy background'] } }),
];

/** Categorías de paletas, atmósferas y texturas. */
export const PALETAS_GROUPS: Step['groups'] = [
  { id: 'suaves', label: { es: 'Suaves y neutras' }, optionIds: ['pastel', 'monocromo', 'blanco-negro', 'nordico', 'cafe', 'corporativo'] },
  { id: 'calidas', label: { es: 'Cálidas' }, optionIds: ['tierra', 'atardecer', 'otono-paleta', 'caramelo', 'retro70', 'vintage'] },
  { id: 'naturales', label: { es: 'Frías y naturales' }, optionIds: ['oceano', 'bosque', 'mediterraneo'] },
  { id: 'intensas', label: { es: 'Intensas' }, optionIds: ['neon', 'vibrante', 'tropical', 'cyberpunk-paleta'] },
  { id: 'elegantes', label: { es: 'Elegantes y oscuras' }, optionIds: ['lujo', 'joya', 'gotico'] },
];

export const ATMOSFERAS_GROUPS: Step['groups'] = [
  { id: 'luminosas', label: { es: 'Luminosas' }, optionIds: ['serena', 'alegre', 'acogedora', 'romantica', 'festiva', 'energica'] },
  { id: 'intensas', label: { es: 'Intensas' }, optionIds: ['dramatica', 'epica', 'caotica', 'futurista', 'lujosa'] },
  { id: 'oscuras', label: { es: 'Oscuras' }, optionIds: ['misteriosa', 'inquietante', 'melancolica', 'solitaria'] },
  { id: 'intimas', label: { es: 'Íntimas y nostálgicas' }, optionIds: ['nostalgica', 'onirica', 'intima'] },
];

export const TEXTURAS_GROUPS: Step['groups'] = [
  { id: 'impresion', label: { es: 'Película y papel' }, optionIds: ['grano', 'papel', 'trama', 'lienzo', 'grunge', 'vhs'] },
  { id: 'superficie', label: { es: 'Superficie' }, optionIds: ['brillante', 'mate', 'metalico', 'holografico'] },
];
