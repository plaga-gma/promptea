import type { Demo, FilterOverlay, Option } from '../../../engine/types';
import { BLUR, img, o } from './_helpers';

/**
 * Opciones sumadas en el rediseño de octubre de 2026, a partir de la investigación de
 * docs/08-investigacion-rediseno.md (tendencias de edición y diseño 2026, guías de GPT Image 2 y
 * Nano Banana, vocabulario de fotografía y diseño). Cada lista se agrega al final de la original
 * en su archivo, así los ids y categorías viejos no cambian.
 */

const g = (colors: string[], glyph: string): Demo => ({ kind: 'gradient', colors, glyph });
const f = (css: string, overlay?: FilterOverlay): Demo => ({ kind: 'filter', css, ...(overlay ? { overlay } : {}) });
const sw = (...colors: string[]): Demo => ({ kind: 'swatch', colors });
const light = (bg: string, sphere: string, glow?: string): Demo => ({ kind: 'light', bg, sphere, ...(glow ? { glow } : {}) });
const font = (family: string, extra: Partial<Extract<Demo, { kind: 'font' }>> = {}): Demo => ({ kind: 'font', family, ...extra });
const diagram = (name: string): Demo => ({ kind: 'diagram', name });
const tx = (name: string): Demo => ({ kind: 'texture', name });
const vs = (before: string, after: string, beforeOverlay?: FilterOverlay, afterOverlay?: FilterOverlay): Demo => ({
  kind: 'compare',
  before: { css: before, ...(beforeOverlay ? { overlay: beforeOverlay } : {}) },
  after: { css: after, ...(afterOverlay ? { overlay: afterOverlay } : {}) },
});

// ---------------------------------------------------------------------------
// Generación
// ---------------------------------------------------------------------------

/** Más tipos de imagen: piezas que la gente pide mucho y que tienen reglas propias. */
export const MEDIOS_EXTRA: Option[] = [
  o('escultura', 'Escultura', 'a sculpture', 'una escultura', { hint: 'Mármol, bronce o arcilla, como en un museo.', demo: img('Escultura', ['#e8e4dc', '#8a8178']) }),
  o('figura', 'Figura coleccionable', 'a collectible toy figure, glossy plastic with tiny accessories, inside premium retail blister packaging', 'una figura coleccionable de juguete, plástico brillante con accesorios diminutos, dentro de un blíster de colección', { hint: 'La tendencia del muñeco en caja.', demo: g(['#ff6b6b', '#ffd166'], '🧸'), meta: { allow: ['text'] } }),
  o('sticker-ilus', 'Sticker', 'a die-cut sticker illustration with a thick white border', 'una ilustración en forma de sticker troquelado con borde blanco grueso', { hint: 'Recortado, con borde blanco: listo para WhatsApp.', demo: g(['#9bf6ff', '#ffc6ff'], '🏷️') }),
  o('icono3d', 'Ícono 3D', 'a glossy 3D icon, soft rounded shapes, isolated and centered', 'un ícono 3D brillante, formas redondeadas suaves, aislado y centrado', { hint: 'Íconos con volumen para apps y webs.', demo: g(['#7f5af0', '#2cb67d'], '🔷') }),
  o('pagina-comic', 'Página de cómic', 'a comic book page with several panels', 'una página de cómic con varias viñetas', { hint: 'Una historia en viñetas. Describí qué pasa en cada una.', demo: g(['#ffde00', '#e3170a'], '💥') }),
  o('hoja-personaje', 'Hoja de personaje', 'a character design sheet showing the same character from the front, side and back, with expression studies', 'una hoja de diseño de personaje con el mismo personaje de frente, de perfil y de espalda, más estudios de expresiones', { hint: 'Para usar el mismo personaje en muchas imágenes.', demo: g(['#cdb4db', '#a2d2ff'], '🧍') }),
  o('storyboard', 'Storyboard', 'a storyboard sequence of rough cinematic frames', 'una secuencia de storyboard con cuadros cinematográficos', { hint: 'Planificar un video o una publicidad cuadro por cuadro.', demo: g(['#f1f1f1', '#6c757d'], '🎞️') }),
  o('mapa-ilustrado', 'Mapa ilustrado', 'an illustrated map with landmarks and small hand-drawn details', 'un mapa ilustrado con lugares destacados y pequeños detalles dibujados a mano', { hint: 'Mapas de fantasía, de un barrio o de un evento.', demo: g(['#e9d8a6', '#94d2bd'], '🗺️') }),
  o('emoji', 'Emoji / avatar', 'a cute emoji-style avatar, simple bold shapes, centered on a plain background', 'un avatar estilo emoji, formas simples y marcadas, centrado sobre fondo liso', { hint: 'Tu cara o tu mascota como emoji.', demo: g(['#ffd60a', '#ff9f1c'], '😀') }),
  o('miniatura-mundo', 'Mundo en miniatura', 'a tiny miniature world inside an everyday object, highly detailed', 'un mundo en miniatura dentro de un objeto cotidiano, muy detallado', { hint: 'Una ciudad dentro de una taza, un bosque en una bombilla…', demo: g(['#90be6d', '#277da1'], '🌍') }),
];

const S = (id: string, label: string, en: string, es: string, hint: string, colors: string[], extra = {}) =>
  o(id, label, en, es, { hint, demo: img(label, colors), ...extra });

/** Más estilos visuales: tendencias 2026, movimientos y técnicas que faltaban. */
export const ESTILOS_EXTRA: Option[] = [
  // Tendencias 2026
  S('imperfecto', 'Hermosamente imperfecto', 'beautifully imperfect candid film look, light leaks, slight blur and faded colors', 'look de película espontáneo y hermosamente imperfecto, con filtraciones de luz, algo de desenfoque y colores desvaídos', 'Lo crudo y emotivo le gana a lo perfecto.', ['#e8b07a', '#7a5c58'], { meta: { literal: true, allow: BLUR } }),
  S('juguete', 'Juguete de plástico', 'glossy plastic toy aesthetic, rounded collectible figure proportions', 'estética de juguete de plástico brillante, proporciones de figura coleccionable redondeada', 'Como un muñeco de colección.', ['#ff595e', '#1982c4']),
  S('bloques', 'Bloques de juguete', 'built entirely from colorful interlocking toy bricks', 'construido por completo con bloques de juguete encastrables de colores', 'Todo hecho con ladrillitos de plástico.', ['#e63946', '#ffd60a']),
  S('fieltro', 'Fieltro', 'handmade felt craft, soft wool fibers and visible stitching', 'manualidad en fieltro, fibras de lana suaves y costuras visibles', 'Muñequitos de fieltro cosidos a mano.', ['#f4a261', '#2a9d8f']),
  S('inflado', 'Inflado (globo)', 'inflated balloon-like 3D shapes, glossy and puffy', 'formas 3D infladas como globos, brillantes y esponjosas', 'Letras y objetos inflados, súper de moda.', ['#ff8fab', '#a0c4ff']),
  S('vidrio-soplado', 'Vidrio soplado', 'hand-blown glass sculpture, translucent colors and caustic reflections', 'escultura de vidrio soplado, colores translúcidos y reflejos cáusticos', 'Translúcido, brillante y delicado.', ['#90e0ef', '#f72585']),
  S('una-linea', 'Una sola línea', 'continuous single-line drawing, minimal and elegant', 'dibujo de una sola línea continua, mínimo y elegante', 'Todo dibujado sin levantar el lápiz.', ['#ffffff', '#1b1b1b']),
  S('dreamcore', 'Dreamcore', 'dreamcore aesthetic, surreal nostalgic scenes, soft hazy pastel light', 'estética dreamcore, escenas surrealistas y nostálgicas, luz pastel brumosa', 'Como un sueño raro de la infancia.', ['#ffc8dd', '#bde0fe']),
  S('liminal', 'Espacio liminal', 'liminal space aesthetic, empty familiar places, eerie stillness, fluorescent light', 'estética de espacio liminal, lugares conocidos vacíos, quietud extraña, luz fluorescente', 'Pasillos y piletas vacías que inquietan.', ['#e9e5b8', '#9aa88f']),
  S('dark-academia', 'Dark academia', 'dark academia aesthetic, old libraries, tweed, candlelight and warm browns', 'estética dark academia, bibliotecas antiguas, tweed, velas y marrones cálidos', 'Bibliotecas, libros viejos y misterio.', ['#3d2b1f', '#a47148']),
  S('afrofuturismo', 'Afrofuturismo', 'Afrofuturism, vibrant futuristic fashion and technology rooted in African culture', 'afrofuturismo, moda y tecnología futurista vibrante con raíces en la cultura africana', 'Futuro, color y cultura africana.', ['#ffb703', '#7209b7']),
  S('dieselpunk', 'Dieselpunk', 'dieselpunk aesthetic, 1940s machinery, riveted steel and smoky skies', 'estética dieselpunk, maquinaria de los años 40, acero remachado y cielos de humo', 'Máquinas pesadas y aviones de los 40.', ['#5c4d3c', '#b08d57']),
  S('biopunk', 'Biopunk', 'biopunk aesthetic, organic bioluminescent technology and living architecture', 'estética biopunk, tecnología orgánica bioluminiscente y arquitectura viva', 'Tecnología hecha con seres vivos.', ['#06d6a0', '#3a0ca3']),
  S('gotico-victoriano', 'Gótico victoriano', 'Victorian gothic aesthetic, ornate black lace, candelabras and moody shadows', 'estética gótica victoriana, encaje negro ornamentado, candelabros y sombras', 'Elegante, oscuro y romántico.', ['#1b1b1b', '#6a040f']),
  S('kawaii-pastel', 'Pastel kawaii 3D', 'cute pastel 3D kawaii style, soft rounded shapes and glossy highlights', 'estilo 3D kawaii en pastel, formas redondeadas y brillos suaves', 'Tierno, redondo y brillante.', ['#ffafcc', '#cdb4db']),
  // Movimientos y pintura
  S('puntillismo', 'Puntillismo', 'pointillism painting made of countless small dots of pure color', 'pintura puntillista hecha con incontables puntitos de color puro', 'Toda la imagen hecha de puntos.', ['#ffbe0b', '#3a86ff']),
  S('fauvismo', 'Fauvismo', 'fauvist painting, wild non-naturalistic colors and bold brushwork', 'pintura fauvista, colores salvajes no naturales y pinceladas audaces', 'Colores imposibles y salvajes.', ['#ff006e', '#06d6a0']),
  S('abstracto', 'Abstracto geométrico', 'geometric abstract art, bold shapes and balanced color fields', 'arte abstracto geométrico, formas marcadas y campos de color equilibrados', 'Formas y colores, sin figuras reales.', ['#ef476f', '#118ab2']),
  S('expresionismo-abstracto', 'Expresionismo abstracto', 'abstract expressionism, energetic drips and gestural paint splatters', 'expresionismo abstracto, chorreados enérgicos y salpicaduras gestuales', 'Pintura salpicada con energía.', ['#e63946', '#1d3557']),
  S('op-art', 'Op art', 'op art, hypnotic black and white optical illusion patterns', 'op art, patrones hipnóticos de ilusión óptica en blanco y negro', 'Ilusiones ópticas que parecen moverse.', ['#000000', '#ffffff']),
  S('muralismo', 'Muralismo', 'Latin American muralism, monumental figures, earthy colors and social storytelling', 'muralismo latinoamericano, figuras monumentales, colores tierra y relato social', 'Murales enormes que cuentan historias.', ['#bc4b51', '#f4a259']),
  S('rupestre', 'Pintura rupestre', 'prehistoric cave painting, ochre pigments on rough stone', 'pintura rupestre prehistórica, pigmentos ocre sobre piedra rugosa', 'Como las pinturas de las cavernas.', ['#c08552', '#5e3023']),
  S('egipcio', 'Arte egipcio', 'ancient Egyptian wall art, profile figures, hieroglyphs and gold accents', 'arte mural del antiguo Egipto, figuras de perfil, jeroglíficos y detalles dorados', 'Figuras de perfil y jeroglíficos.', ['#e9c46a', '#264653']),
  S('acuarela-botanica', 'Ilustración botánica', 'vintage botanical illustration, delicate watercolor and fine ink details on cream paper', 'ilustración botánica antigua, acuarela delicada y detalles finos en tinta sobre papel crema', 'Plantas dibujadas como en un libro científico.', ['#f6f1e1', '#6a994e']),
  S('libro-infantil', 'Libro infantil', "whimsical children's picture book illustration, soft textures and warm colors", 'ilustración de libro infantil, tierna, con texturas suaves y colores cálidos', 'Tierno y cálido, para contar cuentos.', ['#ffd6a5', '#9bf6ff']),
  S('anime-pintado', 'Anime pintado a mano', 'hand-painted anime film style, lush painted backgrounds, warm nostalgic light', 'estilo de película anime pintada a mano, fondos pintados frondosos, luz cálida y nostálgica', 'Paisajes pintados y cálidos de las películas de anime.', ['#8ecae6', '#a7c957']),
  S('novela-grafica', 'Novela gráfica', 'graphic novel art, heavy ink shadows and muted cinematic colors', 'arte de novela gráfica, sombras de tinta pesadas y colores cinematográficos apagados', 'Cómic adulto y cinematográfico.', ['#2b2d42', '#d90429']),
  S('carta-fantasia', 'Arte de carta coleccionable', 'trading card fantasy art, dynamic heroic pose, rich painterly detail', 'arte fantástico de carta coleccionable, pose heroica dinámica, detalle pictórico', 'Como la ilustración de una carta de juego.', ['#3c096c', '#ff9e00']),
  S('afiche-cine-vintage', 'Afiche de cine vintage', 'vintage painted movie poster style, dramatic composition, airbrushed illustration', 'estilo afiche de cine vintage pintado, composición dramática, ilustración con aerógrafo', 'Los afiches pintados de los 70 y 80.', ['#d00000', '#ffba08']),
  S('pulp', 'Revista pulp', '1950s pulp magazine cover art, lurid colors and dramatic action', 'arte de tapa de revista pulp de los 50, colores estridentes y acción dramática', 'Aventuras y ciencia ficción de quiosco.', ['#f77f00', '#003049']),
  S('tiza-pizarra', 'Tiza en pizarra', 'chalk drawing on a blackboard, dusty strokes', 'dibujo con tiza en un pizarrón, trazos polvorientos', 'Como dibujado en el pizarrón de la escuela.', ['#2f3e46', '#f1faee']),
  S('sombras-chinescas', 'Silueta / sombras', 'silhouette art, solid black shapes against a glowing gradient sky', 'arte de siluetas, formas negras sólidas contra un cielo degradado luminoso', 'Siluetas negras contra un cielo de color.', ['#ff9e64', '#1b1b2f']),
  S('holografico', 'Holográfico', 'iridescent holographic aesthetic, chrome reflections and rainbow sheen', 'estética holográfica iridiscente, reflejos cromados y brillo tornasolado', 'Brillos de arcoíris como un holograma.', ['#b5b2ff', '#8ef6e4']),
  S('arte-generativo', 'Arte generativo', 'generative art, flowing algorithmic lines and particles', 'arte generativo, líneas y partículas algorítmicas fluidas', 'Patrones hechos por código.', ['#03045e', '#00b4d8']),
  S('escultura-marmol', 'Escultura de mármol', 'classical white marble sculpture, carved detail and soft museum light', 'escultura clásica de mármol blanco, detalle tallado y luz suave de museo', 'Todo convertido en mármol tallado.', ['#f1f1f1', '#9e9e9e'], { meta: { literal: true } }),
  S('urban-sketch', 'Urban sketching', 'urban sketching, loose ink lines with light watercolor washes', 'urban sketching, líneas de tinta sueltas con aguadas de acuarela', 'Dibujo rápido de ciudad con acuarela.', ['#f8f4e3', '#457b9d']),
];

/** Grupo nuevo de estilos y dónde va cada estilo nuevo. */
export const ESTILOS_EXTRA_GROUPS: Record<string, string[]> = {
  tendencias: ['imperfecto', 'juguete', 'bloques', 'fieltro', 'inflado', 'vidrio-soplado', 'una-linea', 'dreamcore', 'liminal', 'kawaii-pastel', 'holografico'],
  pintura: ['acuarela-botanica', 'libro-infantil', 'urban-sketch', 'tiza-pizarra'],
  movimientos: ['puntillismo', 'fauvismo', 'abstracto', 'expresionismo-abstracto', 'op-art', 'muralismo', 'rupestre', 'egipcio'],
  digital: ['anime-pintado', 'novela-grafica', 'carta-fantasia', 'arte-generativo'],
  grafica: ['afiche-cine-vintage', 'pulp', 'sombras-chinescas'],
  manual: ['escultura-marmol'],
  esteticas: ['dark-academia', 'afrofuturismo', 'dieselpunk', 'biopunk', 'gotico-victoriano'],
};

/** Más luces. */
export const ILUMINACION_EXTRA: Option[] = [
  o('borde', 'Luz de borde (rim)', 'crisp rim light outlining the subject against a dark background', 'luz de borde nítida que dibuja el contorno del sujeto contra un fondo oscuro', { hint: 'Una línea de luz que separa al sujeto del fondo.', demo: light('#0d0d12', 'radial-gradient(circle at 50% 50%,#15151a 60%,#9ad1ff 70%,#15151a 78%)', '0 0 22px #9ad1ff') }),
  o('neon-dual', 'Neón rosa y azul', 'dual-tone neon lighting, pink from one side and blue from the other', 'luz de neón en dos tonos, rosa de un lado y azul del otro', { hint: 'El look de videoclip y gaming.', demo: light('linear-gradient(90deg,#3a0ca3,#0b0620,#7a0050)', 'radial-gradient(circle at 25% 45%,#ff5fd2,#3b0b3d 40%,#0b0620 60%), radial-gradient(circle at 75% 45%,#4cc9f0,#0b0620 50%)') }),
  o('linterna', 'Linterna', 'a single flashlight beam cutting through darkness', 'un único haz de linterna que atraviesa la oscuridad', { hint: 'Suspenso y exploración.', demo: light('#050505', 'radial-gradient(circle at 38% 40%,#fff6d5,#7a6a3a 22%,#050505 45%)') }),
  o('caustica', 'Reflejos de agua', 'shimmering caustic light patterns reflected from water', 'patrones de luz cáustica que tiemblan, reflejados desde el agua', { hint: 'Las ondas de luz de una pileta.', demo: light('linear-gradient(180deg,#0077b6,#00b4d8)', 'radial-gradient(circle at 40% 35%,#caf0f8,#48cae4 40%,#023e8a 90%)') }),
  o('aurora', 'Aurora boreal', 'glowing aurora borealis lighting the scene in green and violet', 'aurora boreal que ilumina la escena en verde y violeta', { hint: 'Cielos mágicos del norte.', demo: light('linear-gradient(180deg,#03071e,#0b3d2e 50%,#3c096c)', 'radial-gradient(circle at 40% 30%,#b7f7d2,#2d6a4f 45%,#03071e 90%)', '0 0 30px #52b78855') }),
  o('relampago', 'Relámpago', 'a sudden flash of lightning illuminating the scene', 'el destello repentino de un relámpago que ilumina la escena', { hint: 'Drama y tormenta.', demo: light('linear-gradient(180deg,#1b263b,#0d1b2a)', 'radial-gradient(circle at 60% 25%,#ffffff,#a9c1ff 25%,#0d1b2a 60%)') }),
  o('fluorescente', 'Tubo fluorescente', 'flat, slightly greenish fluorescent overhead lighting', 'luz fluorescente cenital, plana y apenas verdosa', { hint: 'Oficinas, hospitales y pasillos vacíos.', demo: light('linear-gradient(180deg,#e9f5db,#b5c99a)', 'radial-gradient(circle at 50% 20%,#ffffff,#cfe1b9 50%,#718355 100%)') }),
  o('vitral-luz', 'Luz de vitral', 'colorful light pouring through stained glass windows', 'luz de colores que entra a través de vitrales', { hint: 'Manchas de color sobre todo.', demo: light('linear-gradient(135deg,#3a0ca3,#f72585 50%,#ffbe0b)', 'radial-gradient(circle at 40% 35%,#ffe5ec,#c77dff 45%,#240046 90%)') }),
  o('estroboscopica', 'Flash de fiesta', 'colorful club lights and stroboscopic flashes with haze', 'luces de colores de boliche y flashes estroboscópicos con humo', { hint: 'Fiesta, recital, boliche.', demo: light('radial-gradient(circle at 30% 20%,#ff006e,#3a0ca3 40%,#000 80%)', 'radial-gradient(circle at 45% 35%,#fdfcdc,#8338ec 40%,#000 85%)') }),
  o('tres-puntos', 'Tres puntos', 'classic three-point lighting: key light, fill light and back light', 'iluminación clásica de tres puntos: luz principal, de relleno y trasera', { hint: 'El estándar profesional para entrevistas y producto.', demo: light('linear-gradient(180deg,#2b2d42,#1b1b2f)', 'radial-gradient(circle at 35% 35%,#ffffff,#b8b8d1 40%,#2b2d42 90%)', '0 0 18px #ffffff44') }),
];

/** Más paletas. */
export const PALETAS_EXTRA: Option[] = [
  o('salvia', 'Verde salvia', 'calm sage green palette with cream and soft clay', 'paleta calma en verde salvia, crema y arcilla suave', { hint: 'Natural, tranqui y muy actual.', demo: sw('#9caf88', '#d8e2c9', '#f4efe6', '#c2a68c') }),
  o('terracota', 'Terracota', 'sun-baked terracotta palette of clay, peach and sand', 'paleta terracota de arcilla, durazno y arena', { hint: 'Cálida, mediterránea y artesanal.', demo: sw('#c65d3b', '#e59d6c', '#f2d0a9', '#7f4f24') }),
  o('mocha', 'Mocha', 'soft mocha mousse palette of warm brown, latte and blush', 'paleta mocha suave: marrón cálido, latte y rosado', { hint: 'El marrón suave que domina la moda y el diseño.', demo: sw('#a47864', '#d6bba5', '#f1e4d8', '#6d4c41') }),
  o('azul-klein', 'Azul Klein', 'bold palette of intense ultramarine Klein blue with white', 'paleta audaz de azul Klein ultramar intenso con blanco', { hint: 'Un solo azul intenso que impacta.', demo: sw('#002fa7', '#1a4fd0', '#e8edf9', '#ffffff') }),
  o('rosa-barbie', 'Rosa intenso', 'hot pink palette with bubblegum and white', 'paleta rosa intenso con rosa chicle y blanco', { hint: 'Divertido, pop y llamativo.', demo: sw('#e0218a', '#ff69b4', '#ffc2e2', '#ffffff') }),
  o('desierto', 'Desierto', 'desert palette of dusty sand, sage and sunset orange', 'paleta desértica: arena polvorienta, salvia y naranja de atardecer', { hint: 'Polvorienta y cálida, con aire western.', demo: sw('#e6c79c', '#c7a27c', '#8b9474', '#d96c3b') }),
  o('hielo', 'Hielo', 'icy palette of white, pale blue and silver', 'paleta helada: blanco, celeste pálido y plateado', { hint: 'Fría, limpia e invernal.', demo: sw('#ffffff', '#d6f0ff', '#9cc9e8', '#b8c4cc') }),
  o('rojo-mono', 'Rojo monocromo', 'monochrome red palette from deep crimson to light coral', 'paleta monocromática roja, del carmesí profundo al coral claro', { hint: 'Pasión e intensidad en un solo color.', demo: sw('#5c0a0a', '#a4161a', '#e5383b', '#ffb3b3') }),
  o('verde-acido', 'Verde ácido', 'acid lime green on black with chrome accents', 'verde lima ácido sobre negro con detalles cromados', { hint: 'Rave, techno y cultura de internet.', demo: sw('#c6ff00', '#0a0a0a', '#9aa0a6', '#2b2b2b') }),
  o('halloween', 'Halloween', 'spooky palette of pumpkin orange, black and purple', 'paleta terrorífica: naranja calabaza, negro y violeta', { hint: 'Para fiestas de Halloween.', demo: sw('#ff7518', '#0b0b0b', '#5a189a', '#f2e8cf') }),
  o('navidad', 'Navidad', 'festive Christmas palette of deep red, pine green and gold', 'paleta navideña: rojo profundo, verde pino y dorado', { hint: 'Fiestas de fin de año.', demo: sw('#9b111e', '#0b6623', '#d4af37', '#fffaf0') }),
  o('primavera-paleta', 'Primavera', 'fresh spring palette of blossom pink, leaf green and sky blue', 'paleta fresca de primavera: rosa flor, verde hoja y celeste', { hint: 'Flores, frescura y nuevos comienzos.', demo: sw('#ffb7c5', '#a7c957', '#a2d2ff', '#fffbe6') }),
];

/** Más atmósferas. */
const ga = (...colors: string[]): Demo => ({ kind: 'gradient', colors });
export const ATMOSFERAS_EXTRA: Option[] = [
  o('esperanzadora', 'Esperanzadora', 'a hopeful, uplifting atmosphere', 'una atmósfera esperanzadora y luminosa', { hint: 'Después de la tormenta, sale el sol.', demo: ga('#ffe8a3', '#8ecae6') }),
  o('tensa', 'Tensa', 'a tense, suspenseful atmosphere', 'una atmósfera tensa y de suspenso', { hint: 'Algo está por pasar.', demo: ga('#2b2d42', '#8d0801') }),
  o('magica', 'Mágica', 'a magical, enchanted atmosphere with a sense of wonder', 'una atmósfera mágica y encantada, llena de asombro', { hint: 'Cuento de hadas y maravilla.', demo: ga('#7b2cbf', '#ffd6ff') }),
  o('absurda', 'Divertida y absurda', 'a whimsical, absurd and humorous atmosphere', 'una atmósfera caprichosa, absurda y graciosa', { hint: 'Humor y situaciones ridículas.', demo: ga('#ffbe0b', '#3a86ff') }),
  o('zen', 'Zen', 'a calm, meditative, zen atmosphere', 'una atmósfera calma, meditativa y zen', { hint: 'Silencio, equilibrio y respiración.', demo: ga('#e9edc9', '#a3b18a') }),
  o('rebelde', 'Rebelde', 'a rebellious, raw and defiant atmosphere', 'una atmósfera rebelde, cruda y desafiante', { hint: 'Punk, calle y actitud.', demo: ga('#000000', '#e63946') }),
  o('heroica', 'Heroica', 'a heroic, triumphant atmosphere', 'una atmósfera heroica y triunfal', { hint: 'El momento de la victoria.', demo: ga('#003049', '#fcbf49') }),
  o('aterradora', 'Aterradora', 'a terrifying, dread-filled atmosphere', 'una atmósfera aterradora, llena de pavor', { hint: 'Miedo de verdad.', demo: ga('#000000', '#3d0000') }),
];

/** Más texturas y acabados. */
const onPhoto = (css: string, overlay: FilterOverlay): Demo => ({ kind: 'filter', css, overlay });
export const TEXTURAS_EXTRA: Option[] = [
  o('acuarela-papel', 'Papel de acuarela', 'cold-press watercolor paper texture', 'textura de papel de acuarela de grano grueso', { hint: 'El papel rugoso de la acuarela.', demo: onPhoto('saturate(.9) brightness(1.05)', 'paper') }),
  o('craquelado', 'Craquelado', 'fine craquelure cracks like an old varnished painting', 'craquelado fino como el de una pintura antigua barnizada', { hint: 'Las grietitas de un cuadro viejo.', demo: onPhoto('sepia(.3) contrast(1.05)', 'scratches') }),
  o('oxido', 'Óxido', 'rusty weathered metal texture', 'textura de metal oxidado y gastado', { hint: 'Metal viejo, industrial.', demo: tx('grunge') }),
  o('vidrio-lluvia', 'Gotas en el vidrio', 'seen through a window covered in raindrops', 'vista a través de un vidrio cubierto de gotas de lluvia', { hint: 'Nostalgia de día lluvioso.', demo: onPhoto('blur(.6px) saturate(.85)', 'haze'), meta: { allow: BLUR } }),
  o('arrugado', 'Papel arrugado', 'crumpled paper texture with soft creases', 'textura de papel arrugado con pliegues suaves', { hint: 'Como un papel que alguien abolló.', demo: onPhoto('contrast(.95)', 'paper') }),
  o('terciopelo-tx', 'Aterciopelado', 'soft velvety surface with a subtle sheen', 'superficie aterciopelada con un brillo sutil', { hint: 'Suave al tacto, lujoso.', demo: tx('matte') }),
  o('escarcha', 'Escarcha', 'delicate frost crystals on the surface', 'cristales de escarcha delicados sobre la superficie', { hint: 'Frío del invierno.', demo: onPhoto('url(#pf-cool) brightness(1.08)', 'haze') }),
  o('purpurina', 'Brillos y purpurina', 'sparkling glitter texture', 'textura de brillos y purpurina', { hint: 'Fiesta y glamour.', demo: tx('holo') }),
];

/** Más materiales. */
export const MATERIALES_EXTRA: Option[] = [
  o('cuero', 'Cuero', 'supple leather', 'cuero flexible', { demo: g(['#8b5a2b', '#3e2723'], '👜') }),
  o('lino', 'Tela y lino', 'natural woven linen fabric', 'tela de lino natural', { demo: g(['#efe6d5', '#b8a88a'], '🧵') }),
  o('piedra', 'Piedra', 'rough natural stone', 'piedra natural rugosa', { demo: g(['#9e9e9e', '#5d5d5d'], '🪨') }),
  o('bronce', 'Bronce', 'aged bronze with a green patina', 'bronce envejecido con pátina verde', { demo: g(['#a97142', '#4f7f6f'], '🗿') }),
  o('porcelana', 'Porcelana', 'delicate glossy porcelain', 'porcelana delicada y brillante', { demo: g(['#ffffff', '#c9d6df'], '🏺') }),
  o('resina', 'Resina', 'translucent colored epoxy resin', 'resina epoxi translúcida de color', { demo: g(['#48cae4', '#f72585'], '💧') }),
  o('goma', 'Goma', 'matte soft-touch rubber', 'goma mate de tacto suave', { demo: g(['#2b2d42', '#8d99ae'], '🎈') }),
  o('peluche', 'Peluche', 'fluffy plush fabric', 'tela de peluche esponjosa', { demo: g(['#f8c8dc', '#b5838d'], '🧸') }),
  o('chocolate', 'Chocolate', 'glossy melted chocolate', 'chocolate brillante y derretido', { demo: g(['#7b3f00', '#3d1f00'], '🍫') }),
  o('carbono', 'Fibra de carbono', 'woven carbon fiber', 'fibra de carbono tramada', { demo: g(['#2b2b2b', '#4a4a4a'], '🏎️') }),
  o('lava', 'Lava', 'glowing molten lava', 'lava fundida incandescente', { demo: g(['#ff4800', '#370617'], '🌋') }),
  o('nubes-material', 'Nubes', 'soft fluffy clouds', 'nubes suaves y esponjosas', { demo: g(['#ffffff', '#a2d2ff'], '☁️') }),
];

/** Más cámaras y rollos. */
export const CAMARAS_EXTRA: Option[] = [
  o('gopro', 'Cámara de acción', 'an action camera with an ultra-wide fisheye look', 'una cámara de acción con un look ultra gran angular tipo ojo de pez', { hint: 'Deportes extremos y aventura.', demo: f('saturate(1.25) contrast(1.1)') }),
  o('dron', 'Dron', 'a drone camera from high above', 'una cámara de dron desde muy arriba', { hint: 'Vistas aéreas de paisajes.', demo: f('saturate(1.1) contrast(1.05)') }),
  o('camcorder', 'Videocámara 2003', 'a cheap early-2000s camcorder, with a timestamp overlay, flash overexposure and video noise', 'una videocámara barata de principios de los 2000, con fecha en pantalla, flash sobreexpuesto y ruido de video', { hint: 'La tendencia Y2K de video casero.', demo: f('url(#pf-flash)', 'date') }),
  o('ektachrome', 'Rollo Ektachrome', 'Kodak Ektachrome slide film with clean, cool and saturated colors', 'rollo de diapositiva Kodak Ektachrome, colores limpios, fríos y saturados', { hint: 'Diapositivas de colores limpios.', demo: f('url(#pf-velvia) hue-rotate(-8deg)') }),
  o('kodachrome', 'Rollo Kodachrome', 'vintage Kodachrome film with rich reds and deep contrast', 'rollo vintage Kodachrome, rojos intensos y contraste profundo', { hint: 'Las fotos de viaje de los 60.', demo: f('url(#pf-film) saturate(1.2) contrast(1.08)') }),
  o('webcam', 'Cámara web', 'a low-resolution webcam with flat light and slight noise', 'una cámara web de baja resolución, con luz plana y algo de ruido', { hint: 'Videollamada o foto casera.', demo: f('saturate(.85) contrast(.9) blur(.4px)', 'grain'), meta: { allow: BLUR } }),
];

/** Más composiciones. */
export const COMPOSICION_EXTRA: Option[] = [
  o('triangulo', 'Composición triangular', 'triangular composition with three points of interest', 'composición triangular con tres puntos de interés', { hint: 'Estable y equilibrada: un clásico de la pintura.', demo: diagram('comp-golden') }),
  o('horizonte-bajo', 'Horizonte bajo', 'a low horizon line with a vast sky taking up most of the frame', 'línea de horizonte baja, con un cielo enorme que ocupa casi todo el cuadro', { hint: 'Cielos protagonistas.', demo: diagram('comp-negative') }),
  o('silueta-cielo', 'Silueta contra el cielo', 'the subject in silhouette against a bright sky', 'el sujeto en silueta contra un cielo brillante', { hint: 'Formas negras recortadas.', demo: diagram('comp-center') }),
  o('primer-termino', 'Algo en primer plano', 'a blurred foreground element framing the scene for depth', 'un elemento desenfocado en primer plano que enmarca la escena y da profundidad', { hint: 'Hojas o ramas adelante: sensación de estar ahí.', demo: diagram('comp-layers'), meta: { allow: BLUR } }),
  o('reflejo', 'Reflejo simétrico', 'a symmetrical reflection in still water or glass', 'un reflejo simétrico en agua quieta o en un vidrio', { hint: 'La escena duplicada en un espejo de agua.', demo: diagram('comp-center') }),
];

/** Técnica fotográfica: efectos de cámara que se piden con una palabra. Paso nuevo de Generación. */
export const TECNICAS: Option[] = [
  o('larga-exposicion', 'Larga exposición', 'long exposure photography with silky smooth water and light trails', 'fotografía de larga exposición, con agua sedosa y estelas de luz', { hint: 'Agua como seda y luces de autos que dibujan líneas.', demo: f('url(#pf-motion)', 'motion'), meta: { allow: BLUR } }),
  o('congelado', 'Movimiento congelado', 'high-speed photography freezing the action mid-air, every droplet sharp', 'fotografía de alta velocidad que congela la acción en el aire, cada gota nítida', { hint: 'Salpicaduras y saltos detenidos en el aire.', demo: f('contrast(1.15) saturate(1.1)') }),
  o('barrido', 'Barrido (panning)', 'panning shot: sharp subject with a motion-blurred background', 'toma en barrido: sujeto nítido y fondo con desenfoque de movimiento', { hint: 'Sensación de velocidad.', demo: f('none', 'motion'), meta: { allow: BLUR } }),
  o('light-painting', 'Pintura con luz', 'light painting photography with glowing light trails drawn in the air', 'fotografía de light painting, con estelas de luz dibujadas en el aire', { hint: 'Dibujos de luz en la oscuridad.', demo: f('url(#pf-night)', 'light-leak') }),
  o('bokeh-tec', 'Bokeh de luces', 'dreamy bokeh with soft out-of-focus light orbs in the background', 'bokeh soñado con esferas de luz desenfocadas en el fondo', { hint: 'Lucecitas redondas y difusas atrás.', demo: f('saturate(1.1)', 'bokeh'), meta: { allow: BLUR } }),
  o('doble-exp-tec', 'Doble exposición', 'in-camera double exposure blending two scenes', 'doble exposición en cámara que mezcla dos escenas', { hint: 'Dos fotos superpuestas.', demo: f('url(#pf-double)', 'double') }),
  o('macro-gotas', 'Macro extremo', 'extreme macro photography revealing tiny textures and water droplets', 'fotografía macro extrema que revela texturas diminutas y gotas de agua', { hint: 'Lo diminuto, gigante.', demo: f('contrast(1.1) saturate(1.15)', 'bokeh'), meta: { allow: BLUR } }),
  o('infrarrojo-tec', 'Infrarrojo', 'infrared photography with white foliage and dark skies', 'fotografía infrarroja con follaje blanco y cielos oscuros', { hint: 'Árboles blancos, mundo irreal.', demo: f('url(#pf-ir)') }),
  o('flash-noche', 'Flash de noche', 'direct on-camera flash at night, bright subject against a dark background', 'flash directo de noche, sujeto brillante contra un fondo oscuro', { hint: 'La estética de fiesta y paparazzi.', demo: f('url(#pf-flash)') }),
  o('estrellas', 'Cielo estrellado', 'astrophotography with a sharp starry sky and the Milky Way', 'astrofotografía con un cielo estrellado nítido y la Vía Láctea', { hint: 'Noches con millones de estrellas.', demo: f('url(#pf-night)') }),
];

/** Vestuario: cómo va vestida la gente. Paso nuevo de Generación. */
export const VESTUARIO: Option[] = [
  o('v-casual', 'Casual', 'wearing casual everyday clothes', 'con ropa casual de todos los días', { demo: g(['#a3cef1', '#6096ba'], '👕') }),
  o('v-formal', 'Formal / traje', 'wearing an elegant tailored suit', 'con un traje elegante a medida', { demo: g(['#22223b', '#4a4e69'], '🤵') }),
  o('v-gala', 'De gala', 'wearing a glamorous evening gown', 'con un vestido de gala glamoroso', { demo: g(['#7b2cbf', '#e0aaff'], '👗') }),
  o('v-streetwear', 'Streetwear', 'wearing oversized streetwear, hoodie and sneakers', 'con ropa urbana holgada, buzo con capucha y zapatillas', { demo: g(['#212529', '#ff6b6b'], '🧢') }),
  o('v-deportiva', 'Deportiva', 'wearing athletic sportswear', 'con ropa deportiva', { demo: g(['#06d6a0', '#118ab2'], '🏃') }),
  o('v-vintage', 'Vintage', 'wearing vintage clothing from the era', 'con ropa vintage de la época', { demo: g(['#bc6c25', '#dda15e'], '🎩') }),
  o('v-techwear', 'Techwear futurista', 'wearing futuristic techwear with straps and reflective details', 'con techwear futurista, correas y detalles reflectivos', { demo: g(['#0b0c10', '#66fcf1'], '🥷') }),
  o('v-medieval', 'Medieval / fantasía', 'wearing medieval fantasy garments, cloak and leather armor', 'con ropa medieval de fantasía, capa y armadura de cuero', { demo: g(['#5c4033', '#a68a64'], '🛡️') }),
  o('v-uniforme', 'Uniforme de trabajo', 'wearing a work uniform that fits their profession', 'con un uniforme de trabajo acorde a su profesión', { demo: g(['#457b9d', '#f1faee'], '👩‍⚕️') }),
  o('v-tradicional', 'Ropa tradicional', 'wearing traditional cultural attire', 'con ropa tradicional de su cultura', { demo: g(['#e76f51', '#f4a261'], '🧣') }),
  o('v-invierno', 'Abrigo de invierno', 'wearing a cozy winter coat, scarf and knit hat', 'con un abrigo de invierno, bufanda y gorro tejido', { demo: g(['#e0fbfc', '#3d5a80'], '🧥') }),
  o('v-playa', 'De playa', 'wearing summer beachwear', 'con ropa de playa de verano', { demo: g(['#ffd166', '#06d6a0'], '🩱') }),
  o('v-minimal', 'Minimalista neutra', 'wearing minimalist clothing in neutral tones', 'con ropa minimalista en tonos neutros', { demo: g(['#f5f0e8', '#a69f94'], '🤍') }),
  o('v-disfraz', 'Disfraz / cosplay', 'wearing a detailed costume', 'con un disfraz detallado', { demo: g(['#ff006e', '#8338ec'], '🎭') }),
];

/** Más expresiones y poses. */
export const EXPRESIONES_EXTRA: Option[] = [
  o('enojado', 'Enojado', 'with an angry, intense expression', 'con una expresión de enojo intensa', { demo: g(['#d00000', '#370617'], '😠') }),
  o('asustado', 'Asustado', 'with a frightened expression', 'con una expresión de miedo', { demo: g(['#3d405b', '#81b29a'], '😨') }),
  o('confiado', 'Confiado', 'with a confident, self-assured look', 'con una mirada segura y confiada', { demo: g(['#ffb703', '#023047'], '😎') }),
  o('saltando', 'Saltando', 'jumping mid-air with joy', 'saltando en el aire con alegría', { demo: g(['#8ecae6', '#ffb703'], '🤸') }),
  o('bailando', 'Bailando', 'dancing with fluid movement', 'bailando con movimiento fluido', { demo: g(['#ff006e', '#fb5607'], '💃') }),
  o('sentado', 'Sentado relajado', 'sitting relaxed', 'sentado y relajado', { demo: g(['#cad2c5', '#84a98c'], '🪑') }),
  o('brazos-cruzados', 'Brazos cruzados', 'standing with arms crossed', 'de pie con los brazos cruzados', { demo: g(['#495057', '#adb5bd'], '🙅') }),
  o('caminando', 'Caminando hacia cámara', 'walking toward the camera', 'caminando hacia la cámara', { demo: g(['#6d6875', '#e5989b'], '🚶') }),
];

// ---------------------------------------------------------------------------
// Edición
// ---------------------------------------------------------------------------

/**
 * Más operaciones. Las tendencias virales de 2026 (muñeco en caja, viaje en el tiempo, afiche de cine,
 * scrapbook, movimiento, camcorder Y2K) y los arreglos que más se piden (quitar gente del fondo, cables,
 * reflejos, ojos cerrados, staging de ambientes).
 */
export const OPERACIONES_EXTRA: Option[] = [
  o('quitar-gente', 'Quitar gente del fondo', 'Remove all the people in the background, keeping only the main subject, and rebuild the scene behind them naturally', 'Quitá a todas las personas del fondo, dejando solo al sujeto principal, y reconstruí con naturalidad la escena detrás de ellas', { hint: 'Turistas, extraños y curiosos que se colaron.', demo: diagram('op-remove') }),
  o('quitar-cables', 'Quitar cables y postes', 'Remove the power lines, cables and poles, filling the sky and background seamlessly', 'Quitá los cables, tendidos eléctricos y postes, rellenando el cielo y el fondo sin que se note', { hint: 'Fotos de paisaje y arquitectura limpias.', demo: diagram('op-remove') }),
  o('quitar-reflejos', 'Quitar reflejos y brillos', 'Remove the glare and reflections from glasses, windows and shiny surfaces, keeping everything else identical', 'Quitá los reflejos y brillos de anteojos, vidrios y superficies brillantes, dejando todo lo demás idéntico', { hint: 'Anteojos, vidrieras y cuadros con reflejo.', demo: vs('brightness(1.15) contrast(.85)', 'contrast(1.03)', 'light-leak') }),
  o('abrir-ojos', 'Abrir ojos cerrados', 'Open the eyes of the person who blinked, matching their real eye shape, color and gaze, without changing anything else', 'Abrí los ojos de la persona que parpadeó, respetando la forma, el color y la mirada reales, sin cambiar nada más', { hint: 'La foto grupal perfecta… menos uno.', demo: diagram('op-retouch') }),
  o('recolorear', 'Cambiar el color de algo', 'Recolor {target}, keeping its texture, shading and reflections realistic', 'Cambiá el color de {target}, conservando realistas su textura, sus sombras y sus reflejos', { hint: 'Otro color de auto, pared, ropa o pelo.', demo: f('hue-rotate(140deg) saturate(1.2)'), meta: { needsTarget: true, targetHint: 'Ej.: el auto, que pase a ser verde oscuro' } }),
  o('hora-dia', 'Cambiar la hora del día', 'Change the time of day to {target}, relighting the whole scene with matching sky, shadows and color temperature', 'Cambiá la hora del día a {target}, reiluminando toda la escena con cielo, sombras y temperatura de color coherentes', { hint: 'De mediodía a atardecer o a noche.', demo: vs('none', 'url(#pf-night)'), meta: { needsTarget: true, targetHint: 'Ej.: el atardecer, con el sol bajo a la izquierda' }, conflicts: ['p-luz'] }),
  o('agregar-particulas', 'Agregar brillos o humo', 'Add {target} to the scene, softly lit and integrated with the existing light', 'Agregá {target} a la escena, con una luz suave e integrado con la luz existente', { hint: 'Chispas, humo, confeti, pétalos, burbujas.', demo: f('brightness(1.05)', 'light-leak'), meta: { needsTarget: true, targetHint: 'Ej.: confeti dorado cayendo' } }),
  o('sombra-real', 'Agregar sombra realista', 'Add a realistic contact shadow under the subject that matches the light direction and surface', 'Agregá una sombra de contacto realista debajo del sujeto, que coincida con la dirección de la luz y la superficie', { hint: 'Que el producto o la persona no "floten".', demo: diagram('op-packshot') }),
  o('reflejo-agua', 'Agregar reflejo', 'Add a realistic mirror reflection of the subject on a glossy floor or still water below it', 'Agregá un reflejo realista del sujeto sobre un piso brillante o agua quieta debajo de él', { hint: 'Efecto espejo, muy usado en producto.', demo: diagram('comp-center') }),
  o('staging', 'Amueblar un ambiente', 'Furnish this empty room in {target} style, with realistic furniture, decor and lighting, keeping walls, windows and floor unchanged', 'Amueblá este ambiente vacío en estilo {target}, con muebles, decoración y luz realistas, sin cambiar paredes, ventanas ni piso', { hint: 'Para mostrar casas en venta o planear una mudanza.', demo: g(['#e9edc9', '#ccd5ae'], '🛋️'), meta: { needsTarget: true, targetHint: 'Ej.: nórdico, con tonos claros y plantas' } }),
  o('ordenar', 'Ordenar el desorden', 'Declutter the scene: remove the mess and loose objects so it looks clean and tidy, keeping the furniture and layout', 'Ordená la escena: quitá el desorden y los objetos sueltos para que se vea limpia, conservando los muebles y la distribución', { hint: 'Cuartos, escritorios y cocinas prolijos.', demo: diagram('op-remove') }),
  o('pintar-pared', 'Cambiar color de paredes', 'Repaint the walls in {target}, keeping shadows, furniture and light identical', 'Pintá las paredes de {target}, dejando idénticos las sombras, los muebles y la luz', { hint: 'Probar un color antes de pintar.', demo: f('hue-rotate(60deg) saturate(1.1)'), meta: { needsTarget: true, targetHint: 'Ej.: verde salvia mate' } }),
  o('muneco', 'Muñeco en caja', 'Turn the person into a collectible action figure inside premium blister packaging, with tiny accessories that match their hobbies and their name printed on the box', 'Convertí a la persona en una figura de acción coleccionable dentro de un blíster de colección, con accesorios diminutos según sus pasatiempos y su nombre impreso en la caja', { hint: 'La tendencia del juguete en caja.', demo: g(['#ff595e', '#ffca3a'], '🧸'), meta: { allow: ['text'] } }),
  o('viaje-tiempo', 'Viaje en el tiempo', 'Place the person in {target}, adapting their clothing, hairstyle, lighting and photo look to that era while keeping their face', 'Llevá a la persona a {target}, adaptando ropa, peinado, luz y look de foto a esa época, conservando su cara', { hint: 'Vos en Tokio en 1986, en los 20 o en el futuro.', demo: f('url(#pf-seventies)', 'grain'), meta: { needsTarget: true, targetHint: 'Ej.: una calle de Tokio en 1986, de noche con neones' } }),
  o('afiche-cine', 'Afiche de película', 'Turn this portrait into a cinematic movie poster with dramatic lighting, film grain, a title, a tagline and small credits at the bottom', 'Convertí este retrato en un afiche de película con luz dramática, grano de película, un título, una frase y créditos chiquitos abajo', { hint: 'Vos como protagonista de una película.', demo: f('url(#pf-teal)', 'vignette'), meta: { allow: ['text'] } }),
  o('scrapbook', 'Página de scrapbook', 'Turn the photo into a handmade scrapbook page with torn paper edges, washi tape, stickers, doodles and handwritten notes', 'Convertí la foto en una página de scrapbook hecha a mano, con bordes de papel rasgado, cinta washi, stickers, garabatos y notas escritas a mano', { hint: 'Diario íntimo con recortes y cintas.', demo: f('saturate(.9) contrast(.95)', 'paper'), meta: { allow: ['text'] } }),
  o('movimiento', 'Efecto de velocidad', 'Keep the subject crisp and add a dynamic motion effect: blurred background streaks and light trails, like an action film', 'Mantené nítido al sujeto y sumá un efecto de movimiento: estelas desenfocadas en el fondo y rastros de luz, como en una película de acción', { hint: 'Que parezca que va rapidísimo.', demo: f('none', 'motion'), meta: { allow: BLUR } }),
  o('y2k-camcorder', 'Look videocámara Y2K', 'Make it look like a cheap 2003 camcorder capture, with a timestamp overlay, harsh flash, grain and slight VHS distortion', 'Hacé que parezca grabado con una videocámara barata de 2003, con la fecha en pantalla, flash fuerte, grano y una leve distorsión de VHS', { hint: 'La nostalgia del video casero.', demo: f('url(#pf-vhs)', 'date'), conflicts: ['p-colores'] }),
  o('para-colorear', 'Dibujo para colorear', 'Turn the image into clean black outline line art for a coloring book, white background, no shading', 'Convertí la imagen en un dibujo de contornos negros limpios para colorear, fondo blanco, sin sombras', { hint: 'Para chicos o para pintar después.', demo: f('grayscale(1) contrast(3) brightness(1.3)'), conflicts: ['p-colores'] }),
  o('pixelar', 'Convertir en pixel art', 'Convert the image into retro pixel art with a limited color palette, keeping the composition recognizable', 'Convertí la imagen en pixel art retro con una paleta de colores limitada, manteniendo reconocible la composición', { hint: 'Como un personaje de videojuego de 16 bits.', demo: f('url(#pf-pixel)'), conflicts: ['p-colores'] }),
  o('caricatura', 'Caricatura', 'Turn the person into a fun caricature with a slightly exaggerated head and features, keeping them clearly recognizable', 'Convertí a la persona en una caricatura divertida, con la cabeza y los rasgos un poco exagerados, sin que deje de ser reconocible', { hint: 'Un retrato divertido para regalar.', demo: diagram('op-style') }),
  o('maquillaje', 'Agregar maquillaje', 'Apply {target} makeup to the person, natural and well blended, keeping their skin texture and features', 'Aplicale a la persona un maquillaje {target}, natural y bien difuminado, conservando la textura de su piel y sus rasgos', { hint: 'Probar un look antes de un evento.', demo: diagram('op-retouch'), meta: { needsTarget: true, targetHint: 'Ej.: suave para una boda, con labios rosados' } }),
  o('mockup-diseno', 'Poner mi diseño en un producto', 'Place the design from image 2 onto the product in image 1, following its curves, folds and lighting realistically', 'Poné el diseño de la imagen 2 sobre el producto de la imagen 1, siguiendo sus curvas, pliegues y luz con realismo', { hint: 'Tu logo en una taza, remera o bolsa.', demo: diagram('mock-package'), meta: { needsSecondImage: true } }),
  o('producto-escena', 'Producto en una escena', 'Place the product in {target}, as a lifestyle photo with natural light, realistic shadows and correct scale', 'Ubicá el producto en {target}, como una foto lifestyle con luz natural, sombras realistas y escala correcta', { hint: 'Del fondo blanco a una escena que vende.', demo: diagram('op-background'), meta: { needsTarget: true, targetHint: 'Ej.: una mesa de madera junto a una ventana con plantas' } }),
];

/** Dónde va cada operación nueva dentro de las categorías del paso 1. */
export const OPERACIONES_EXTRA_GROUPS: Record<string, string[]> = {
  objetos: ['quitar-gente', 'quitar-cables', 'recolorear', 'agregar-particulas', 'sombra-real', 'reflejo-agua'],
  personas: ['abrir-ojos', 'maquillaje', 'caricatura'],
  look: ['hora-dia', 'movimiento', 'y2k-camcorder'],
  tendencias: ['muneco', 'viaje-tiempo', 'afiche-cine', 'scrapbook', 'para-colorear', 'pixelar'],
  arreglar: ['quitar-reflejos'],
  producto: ['mockup-diseno', 'producto-escena'],
  ambientes: ['staging', 'ordenar', 'pintar-pared'],
};

/** Más filtros. */
export const FILTROS_EXTRA: Option[] = [
  o('kodachrome-f', 'Kodachrome', 'vintage Kodachrome color with rich reds and deep blues', 'color Kodachrome vintage con rojos intensos y azules profundos', { demo: f('url(#pf-film) saturate(1.25) contrast(1.08)') }),
  o('technicolor', 'Technicolor', 'vivid three-strip Technicolor look with saturated primaries', 'look Technicolor vívido con primarios saturados', { hint: 'Las películas en colores de los 50.', demo: f('saturate(1.6) contrast(1.1)') }),
  o('moody', 'Oscuro y moody', 'dark moody grade with crushed shadows and muted greens', 'gradación oscura y moody, con sombras profundas y verdes apagados', { hint: 'El look de Instagram oscuro y elegante.', demo: f('url(#pf-matte) brightness(.85) saturate(.8)') }),
  o('golden', 'Brillo dorado', 'warm golden glow with soft highlights', 'resplandor dorado cálido con luces suaves', { demo: f('url(#pf-warm) brightness(1.06)', 'light-leak') }),
  o('pastel-sonado', 'Pastel soñado', 'dreamy pastel grade with pink and mint tones', 'gradación pastel soñada en tonos rosa y menta', { demo: f('saturate(.7) brightness(1.15) hue-rotate(-10deg)', 'haze') }),
  o('neon-noche', 'Neón nocturno', 'neon night grade with magenta and cyan highlights in deep shadows', 'gradación de noche de neón, con luces magenta y cian en sombras profundas', { demo: f('url(#pf-vapor) contrast(1.15) brightness(.9)') }),
  o('cromo', 'Cromo Y2K', 'chrome Y2K look with silvery tones and glossy highlights', 'look cromado Y2K con tonos plateados y brillos', { demo: f('url(#pf-chrome)') }),
  o('fotocopia', 'Fotocopia', 'gritty photocopy look, high contrast black and white with toner noise', 'look de fotocopia áspero, blanco y negro de alto contraste con ruido de tóner', { hint: 'Fanzines y afiches punk.', demo: f('url(#pf-xerox)') }),
  o('dorado-lujo', 'Lujo dorado', 'luxurious gold and black grade', 'gradación de lujo en dorado y negro', { demo: f('url(#pf-gold)') }),
  o('camcorder-f', 'Videocámara 2003', 'early-2000s camcorder look with timestamp, flash and video noise', 'look de videocámara de principios de los 2000, con fecha, flash y ruido de video', { demo: f('url(#pf-flash)', 'date') }),
];

export const FILTROS_EXTRA_GROUPS: Record<string, string[]> = {
  clasicos: ['kodachrome-f', 'technicolor', 'camcorder-f'],
  color: ['moody', 'golden', 'pastel-sonado', 'neon-noche'],
  graficos: ['cromo', 'fotocopia', 'dorado-lujo'],
};

// ---------------------------------------------------------------------------
// Diseño
// ---------------------------------------------------------------------------

/** Términos que una pieza 3D de packaging no tiene que evitar. */
const MOCKUP_LIKE = ['mockup', 'photorealistic details'];
const piece = (glyph: string, colors: string[]): Demo => g(colors, glyph);

/** Más piezas de diseño. */
export const PIEZAS_EXTRA: Option[] = [
  o('carrusel', 'Carrusel de Instagram', 'the first slide of an Instagram carousel, designed to make people swipe', 'la primera placa de un carrusel de Instagram, pensada para que deslicen', { hint: 'Una portada con gancho y continuidad visual.', demo: piece('🎠', ['#f72585', '#7209b7']), meta: { ratio: [4, 5], purpose: 'Instagram carousel cover slide' } }),
  o('portada-redes', 'Portada de perfil', 'a social media profile cover banner', 'un banner de portada para un perfil de redes', { hint: 'LinkedIn, Facebook, X o YouTube. Lo importante, al centro.', demo: piece('🖼️', ['#0a66c2', '#70b5f9']), meta: { ratio: [3, 1], purpose: 'profile cover banner' } }),
  o('slide', 'Presentación (slide)', 'a presentation slide with a clear title and one key visual', 'una diapositiva de presentación con un título claro y una imagen clave', { hint: 'Una idea por slide, mucho aire.', demo: piece('📊', ['#3a86ff', '#ffffff']), meta: { ratio: [16, 9], purpose: 'presentation slide' } }),
  o('certificado', 'Certificado / diploma', 'an elegant certificate design with ornate borders and a seal', 'un diseño de certificado elegante con bordes ornamentados y un sello', { hint: 'Cursos, premios y reconocimientos.', demo: piece('📜', ['#f6f1e7', '#c9a227']), meta: { ratio: [4, 3], purpose: 'certificate' } }),
  o('etiqueta-vino', 'Etiqueta de vino o cerveza', 'a beverage bottle label design', 'un diseño de etiqueta para botella de vino o cerveza', { hint: 'Elegante para vino, audaz para cerveza artesanal.', demo: piece('🍷', ['#5c0a0a', '#e9d8a6']), meta: { ratio: [3, 4], purpose: 'bottle label' } }),
  o('lata', 'Lata o botella', 'a beverage can packaging design shown as a clean 3D render', 'un diseño de packaging para lata de bebida, mostrado como render 3D limpio', { hint: 'Bebidas, energizantes y cervezas.', demo: piece('🥫', ['#06d6a0', '#ef476f']), meta: { ratio: [4, 5], purpose: 'can packaging', allow: MOCKUP_LIKE } }),
  o('caja', 'Caja de producto', 'a product box packaging design', 'un diseño de packaging de caja de producto', { hint: 'Cosmética, tecnología, regalos.', demo: piece('📦', ['#e9c46a', '#264653']), meta: { ratio: [1, 1], purpose: 'box packaging', allow: MOCKUP_LIKE } }),
  o('bolsa', 'Bolsa / tote', 'a tote bag print design', 'un diseño de estampa para bolsa de tela', { hint: 'Merch de marca y eventos.', demo: piece('👜', ['#f4f1de', '#e07a5f']), meta: { ratio: [1, 1], purpose: 'tote bag print' } }),
  o('taza', 'Taza', 'a mug wraparound print design', 'un diseño de estampa envolvente para taza', { hint: 'Regalos y merch.', demo: piece('☕', ['#fefae0', '#bc6c25']), meta: { ratio: [7, 3], purpose: 'mug print' } }),
  o('entrada', 'Entrada / ticket', 'an event ticket design with a tear-off stub', 'un diseño de entrada para evento con talón desprendible', { hint: 'Recitales, fiestas y obras.', demo: piece('🎟️', ['#3a0ca3', '#f72585']), meta: { ratio: [5, 2], purpose: 'event ticket' } }),
  o('cupon', 'Tarjeta de regalo / cupón', 'a gift card or discount voucher design', 'un diseño de tarjeta de regalo o cupón de descuento', { hint: 'Promociones y regalos.', demo: piece('🎁', ['#ff006e', '#ffbe0b']), meta: { ratio: [7, 4], purpose: 'gift card' } }),
  o('portada-revista', 'Portada de revista', 'a magazine cover design with a masthead and cover lines', 'un diseño de portada de revista con cabezal y titulares', { hint: 'Tu foto como tapa de revista.', demo: piece('📰', ['#d90429', '#edf2f4']), meta: { ratio: [3, 4], purpose: 'magazine cover' } }),
  o('afiche-pelicula', 'Afiche de película', 'a movie poster design with title, tagline and a credit block', 'un diseño de afiche de película con título, frase y bloque de créditos', { hint: 'Cine, series o tu cortometraje.', demo: piece('🎬', ['#0b090a', '#e5383b']), meta: { ratio: [2, 3], purpose: 'movie poster' } }),
  o('cartel-local', 'Cartel de local', 'a storefront sign design, legible from a distance', 'un diseño de cartel para local comercial, legible de lejos', { hint: 'Fachadas, vidrieras y carteles de calle.', demo: piece('🏪', ['#2a9d8f', '#f4a261']), meta: { ratio: [3, 1], purpose: 'storefront sign', allow: ['logo'] } }),
  o('tarjeta-saludo', 'Tarjeta de saludo', 'a greeting card design', 'un diseño de tarjeta de saludo', { hint: 'Cumpleaños, fiestas, agradecimientos.', demo: piece('💌', ['#ffafcc', '#ffc8dd']), meta: { ratio: [5, 7], purpose: 'greeting card' } }),
  o('mascota-marca', 'Mascota de marca', 'a friendly brand mascot character design, full body, front view, simple shapes', 'un diseño de personaje mascota de marca, amigable, de cuerpo entero, de frente y con formas simples', { hint: 'Un personaje que represente a tu marca.', demo: piece('🦊', ['#ff9f1c', '#2ec4b6']), meta: { ratio: [1, 1], purpose: 'brand mascot' } }),
  o('app-mockup', 'Pantalla de app', 'a mobile app screen UI design', 'un diseño de interfaz de pantalla de app', { hint: 'Una idea de cómo se vería tu app.', demo: piece('📱', ['#6d4aff', '#00c2ff']), meta: { ratio: [9, 16], purpose: 'mobile app screen' } }),
  o('pack-emojis', 'Pack de stickers', 'a sticker sheet with several matching die-cut stickers', 'una plancha de stickers con varios stickers troquelados que combinan', { hint: 'Varios stickers del mismo estilo.', demo: piece('🌈', ['#9bf6ff', '#ffc6ff']), meta: { ratio: [1, 1], purpose: 'sticker sheet' } }),
];

export const PIEZAS_EXTRA_GROUPS: Record<string, string[]> = {
  marca: ['mascota-marca', 'cartel-local'],
  redes: ['carrusel', 'portada-redes', 'pack-emojis'],
  impresos: ['certificado', 'entrada', 'cupon', 'portada-revista', 'afiche-pelicula', 'tarjeta-saludo'],
  web: ['slide', 'app-mockup'],
  packaging: ['etiqueta-vino', 'lata', 'caja'],
  estampas: ['bolsa', 'taza'],
};

const D = (id: string, label: string, en: string, es: string, hint: string, colors: string[], conflicts?: string[]) =>
  o(id, label, en, es, { hint, demo: img(label, colors), ...(conflicts ? { conflicts } : {}) });

/** Más estilos de diseño. */
export const ESTILOS_DISENO_EXTRA: Option[] = [
  D('d-bento', 'Bento grid', 'bento grid layout, rounded modular cards of different sizes', 'diagramación bento: tarjetas modulares redondeadas de distintos tamaños', 'Como una caja de bento: módulos ordenados.', ['#f1f1f1', '#6d4aff']),
  D('d-clay', 'Claymorphism', 'claymorphism, soft puffy 3D shapes with pastel colors and inner shadows', 'claymorphism, formas 3D suaves y esponjosas, colores pastel y sombras internas', 'Formas que parecen de plastilina.', ['#ffd6e0', '#c1e7e3']),
  D('d-neumorfismo', 'Neumorfismo', 'neumorphism, soft extruded shapes from the background with subtle shadows', 'neumorfismo, formas suaves que sobresalen del fondo con sombras sutiles', 'Botones que parecen salir del fondo.', ['#e0e5ec', '#a3b1c6']),
  D('d-antidiseno', 'Anti-diseño', 'anti-design, deliberately chaotic layout, clashing type and raw elements', 'anti-diseño, diagramación caótica a propósito, tipografías que chocan y elementos crudos', 'Romper las reglas a propósito.', ['#ff0000', '#00ff00'], ['d-minimal']),
  D('d-zine', 'Collage zine', 'DIY zine collage, photocopied textures, cut-out letters and tape', 'collage estilo fanzine casero, texturas de fotocopia, letras recortadas y cinta', 'Fanzine punk hecho a mano.', ['#f1e9da', '#1b1b1b']),
  D('d-web90', 'Web de los 90', 'retro 1990s web design, pixel icons, bevelled buttons and tiled backgrounds', 'diseño web retro de los 90, íconos pixelados, botones biselados y fondos en mosaico', 'Nostalgia de internet viejo.', ['#0000ff', '#c0c0c0']),
  D('d-artnouveau', 'Art Nouveau', 'Art Nouveau poster design, flowing organic frames and ornamental lettering', 'diseño de afiche Art Nouveau, marcos orgánicos fluidos y letras ornamentales', 'Curvas, flores y ornamentos.', ['#b5838d', '#e5c07b']),
  D('d-artdeco', 'Art Déco', 'Art Deco graphic design, geometric symmetry, gold lines on black', 'diseño gráfico Art Déco, simetría geométrica, líneas doradas sobre negro', 'Glamour geométrico de los años 20.', ['#0b090a', '#d4af37']),
  D('d-popart', 'Pop art', 'pop art graphic design, halftone dots, bold outlines and primary colors', 'diseño gráfico pop art, puntos de trama, contornos gruesos y colores primarios', 'Cómic y arte pop de los 60.', ['#ffe600', '#ff2e63']),
  D('d-tech', 'Tech / HUD', 'futuristic tech interface aesthetic, thin lines, data and glowing accents', 'estética de interfaz tecnológica futurista, líneas finas, datos y acentos luminosos', 'Pantallas de ciencia ficción.', ['#0b132b', '#5bc0be']),
  D('d-eco', 'Eco / sostenible', 'eco-friendly design, kraft paper, earthy tones and hand-drawn details', 'diseño ecológico, papel kraft, tonos tierra y detalles dibujados a mano', 'Natural, reciclado y honesto.', ['#c2a878', '#6a994e']),
  D('d-lujo-oscuro', 'Lujo oscuro', 'dark luxury design, deep black, fine serif type and metallic foil details', 'diseño de lujo oscuro, negro profundo, serif fina y detalles en foil metálico', 'Exclusivo y misterioso.', ['#0b0b0b', '#b08d57']),
  D('d-holo', 'Holográfico', 'holographic iridescent design, chrome gradients and futuristic sheen', 'diseño holográfico iridiscente, degradados cromados y brillo futurista', 'Tornasolado y futurista.', ['#b5b2ff', '#8ef6e4']),
  D('d-riso', 'Risografía', 'risograph print design, grainy spot colors and slight misregistration', 'diseño en risografía, tintas planas granuladas y leve desfase', 'Impresión artesanal vibrante.', ['#ff48b0', '#0078bf']),
  D('d-monolinea', 'Monolínea', 'monoline illustration style, single consistent stroke weight, minimal', 'estilo de ilustración monolínea, un solo grosor de trazo, minimalista', 'Íconos e ilustraciones de un solo trazo.', ['#ffffff', '#264653']),
  D('d-sticker', 'Stickers y parches', 'sticker bomb style, playful die-cut stickers and patches layered together', 'estilo sticker bomb, stickers y parches divertidos superpuestos', 'Stickers pegados por todos lados.', ['#ffbe0b', '#3a86ff']),
];

export const ESTILOS_DISENO_EXTRA_GROUPS: Record<string, string[]> = {
  clasicos: ['d-artnouveau', 'd-artdeco', 'd-popart'],
  limpios: ['d-bento', 'd-monolinea', 'd-lujo-oscuro'],
  retro: ['d-web90', 'd-zine', 'd-riso'],
  actuales: ['d-clay', 'd-neumorfismo', 'd-antidiseno', 'd-tech', 'd-holo'],
  calidos: ['d-eco', 'd-sticker'],
};

/** Más tipografías. */
export const TIPOGRAFIAS_EXTRA: Option[] = [
  o('serif-suave', 'Serif suave', 'soft rounded serif typography (like Fraunces)', 'tipografía serif suave y redondeada (como Fraunces)', { hint: 'Cálida, editorial y muy actual.', demo: font('Fraunces', { weight: 700 }) }),
  o('extendida', 'Sans extendida', 'wide extended sans-serif typography', 'tipografía sans serif extendida y ancha', { hint: 'Moderna y de moda en branding.', demo: font('Syne', { weight: 800 }) }),
  o('mono-moderna', 'Mono moderna', 'modern monospaced typography for branding (like Space Mono)', 'tipografía monoespaciada moderna para marca (como Space Mono)', { hint: 'La tendencia mono en branding.', demo: font('Space Mono', { weight: 700 }) }),
  o('lettering', 'Hand lettering', 'custom hand-lettered typography with flourishes', 'tipografía hecha a mano (lettering) con adornos', { hint: 'Única y con personalidad.', demo: font('Pacifico') }),
  o('script-50', 'Script retro 50s', '1950s retro script typography, diner-style', 'tipografía script retro de los 50, estilo diner', { hint: 'Carteles de bar y rock and roll.', demo: font('Yellowtail') }),
  o('letras-3d', 'Letras 3D', 'bold 3D extruded lettering with depth and shading', 'letras 3D extruidas, gruesas, con profundidad y sombreado', { hint: 'Títulos que saltan de la pantalla.', demo: font('Rubik Mono One', { upper: true }) }),
  o('cromada', 'Cromada Y2K', 'shiny chrome Y2K typography with metallic reflections', 'tipografía cromada Y2K con reflejos metálicos', { hint: 'Metálica, brillante y del 2000.', demo: font('Monoton', { upper: true }) }),
  o('ornamental', 'Ornamental victoriana', 'ornate Victorian decorative typography', 'tipografía decorativa victoriana ornamentada', { hint: 'Circos, boticas y etiquetas antiguas.', demo: font('Rye') }),
  o('infantil', 'Infantil', 'playful bouncy childlike typography', 'tipografía infantil, juguetona y saltarina', { hint: 'Para chicos y marcas divertidas.', demo: font('Baloo 2', { weight: 800 }) }),
  o('terror-tipo', 'Terror', 'creepy dripping horror typography', 'tipografía de terror que chorrea', { hint: 'Halloween y películas de miedo.', demo: font('Creepster', { upper: true }) }),
];

export const TIPOGRAFIAS_EXTRA_GROUPS: Record<string, string[]> = {
  serif: ['serif-suave'],
  sans: ['extendida', 'mono-moderna'],
  mano: ['lettering', 'script-50'],
  decorativas: ['letras-3d', 'cromada', 'ornamental', 'infantil', 'terror-tipo'],
};

/** Más elementos gráficos. */
export const ELEMENTOS_EXTRA: Option[] = [
  o('e-stickers', 'Stickers', 'playful sticker elements', 'elementos tipo sticker, divertidos', { demo: g(['#ffbe0b', '#ff006e'], '🏷️') }),
  o('e-garabatos', 'Garabatos', 'hand-drawn doodles and scribbles', 'garabatos y dibujitos hechos a mano', { demo: g(['#ffffff', '#222222'], '✍️') }),
  o('e-cinta', 'Cinta y papel rasgado', 'washi tape and torn paper pieces', 'cinta washi y pedazos de papel rasgado', { demo: g(['#f1e9da', '#e5989b'], '📎') }),
  o('e-sellos', 'Sellos y insignias', 'stamps and circular badges', 'sellos e insignias circulares', { demo: g(['#c1121f', '#fdf0d5'], '🔖') }),
  o('e-marco', 'Marco ornamental', 'an ornamental decorative frame', 'un marco decorativo ornamental', { demo: g(['#f6f1e7', '#c9a227'], '🖼️') }),
  o('e-destellos', 'Destellos y brillos', 'sparkles and glints', 'destellos y brillitos', { demo: g(['#3a0ca3', '#ffd60a'], '✨') }),
  o('e-flechas', 'Flechas y subrayados', 'hand-drawn arrows and underlines that guide the eye', 'flechas y subrayados dibujados que guían la mirada', { demo: g(['#ffffff', '#ff6b5b'], '↗️') }),
  o('e-3d', 'Objetos 3D', 'floating glossy 3D objects', 'objetos 3D brillantes flotando', { demo: g(['#7f5af0', '#2cb67d'], '🔮') }),
];

/** Más presentaciones (mockups). */
const MOCKUP = ['mockup', 'photorealistic details'];
export const PRESENTACIONES_EXTRA: Option[] = [
  o('m-vidriera', 'En una vidriera', 'presented as a realistic mockup in a shop window', 'presentado como un mockup realista en la vidriera de un local', { demo: g(['#cde7f0', '#457b9d'], '🏬'), meta: { allow: MOCKUP } }),
  o('m-laptop', 'En una laptop', 'presented as a realistic mockup on a laptop screen on a desk', 'presentado como un mockup realista en la pantalla de una laptop sobre un escritorio', { demo: g(['#e9ecef', '#495057'], '💻'), meta: { allow: MOCKUP } }),
  o('m-taza', 'En una taza', 'presented as a realistic mockup printed on a ceramic mug', 'presentado como un mockup realista impreso en una taza de cerámica', { demo: g(['#fefae0', '#bc6c25'], '☕'), meta: { allow: MOCKUP } }),
  o('m-bolsa', 'En una bolsa', 'presented as a realistic mockup printed on a tote bag', 'presentado como un mockup realista estampado en una bolsa de tela', { demo: g(['#f4f1de', '#e07a5f'], '👜'), meta: { allow: MOCKUP } }),
  o('m-revista', 'En una revista', 'presented as a realistic mockup in an open magazine spread', 'presentado como un mockup realista en una revista abierta', { demo: g(['#ffffff', '#d90429'], '📖'), meta: { allow: MOCKUP } }),
  o('m-valla', 'En un cartel gigante', 'presented as a realistic mockup on a large billboard above a city street', 'presentado como un mockup realista en un cartel gigante sobre una calle de la ciudad', { demo: g(['#8ecae6', '#023047'], '🏙️'), meta: { allow: MOCKUP } }),
];

/** Más personalidades de marca. */
export const PERSONALIDADES_EXTRA: Option[] = [
  o('rebelde-marca', 'Rebelde', 'rebellious, edgy', 'rebelde, provocadora', { hint: 'Moda urbana, música, bebidas.', demo: g(['#000000', '#e63946'], '🤘') }),
  o('minimal-marca', 'Sobria', 'understated, minimal', 'sobria, minimalista', { hint: 'Arquitectura, diseño, tecnología premium.', demo: g(['#f8f9fa', '#212529'], '◻️') }),
  o('nostalgica-marca', 'Nostálgica', 'nostalgic, retro-inspired', 'nostálgica, inspirada en lo retro', { hint: 'Bares, cafeterías y marcas con historia.', demo: g(['#e3b778', '#8d6346'], '📻') }),
  o('magica-marca', 'Mágica', 'whimsical, magical', 'mágica, fantasiosa', { hint: 'Juguetes, cumpleaños, cuentos.', demo: g(['#7b2cbf', '#ffd6ff'], '🪄') }),
];

/** Más diagramaciones. */
export const LAYOUTS_EXTRA: Option[] = [
  o('l-z', 'Lectura en Z', 'Z-pattern layout guiding the eye from top left to bottom right', 'diagramación en Z que guía la mirada de arriba a la izquierda hasta abajo a la derecha', { hint: 'Título arriba, imagen al medio, llamado a la acción abajo a la derecha.', demo: diagram('layout-asym') }),
  o('l-collage', 'Collage', 'collage layout with overlapping photos and cut-outs', 'diagramación en collage con fotos y recortes superpuestos', { hint: 'Varias imágenes mezcladas con ritmo.', demo: diagram('layout-grid') }),
  o('l-marco', 'Con marco', 'framed layout with a border around the content', 'diagramación con un marco alrededor del contenido', { hint: 'Clásico y ordenado, ideal para invitaciones.', demo: diagram('layout-center') }),
  o('l-bento', 'Módulos (bento)', 'modular bento grid layout of rounded blocks', 'diagramación modular en bloques redondeados tipo bento', { hint: 'Mucha información, bien ordenada.', demo: diagram('layout-grid') }),
];
