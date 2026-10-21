import type { Demo, Option } from '../../../engine/types';
import { o } from './_helpers';

const light = (bg: string, sphere: string, glow?: string): Demo => ({ kind: 'light', bg, sphere, ...(glow ? { glow } : {}) });
const diagram = (name: string): Demo => ({ kind: 'diagram', name });

/** Iluminación. La demo muestra una esfera iluminada con ese esquema. Ver docs/03-diseno-grafico.md §8. */
export const ILUMINACION: Option[] = [
  o('hora-dorada', 'Hora dorada', 'warm golden hour sunlight with long soft shadows', 'luz cálida de hora dorada con sombras largas y suaves', {
    hint: 'La luz del atardecer: cálida, suave y nostálgica.',
    demo: light('linear-gradient(180deg,#ffb36b,#ff7b54 60%,#6b3a2e)', 'radial-gradient(circle at 25% 35%,#fff1c9,#f7a35c 35%,#7a3a1e 85%)', '0 0 40px #ffb36b88'),
  }),
  o('hora-azul', 'Hora azul', 'cool blue hour twilight, soft ambient light', 'crepúsculo de hora azul, luz ambiente fría y suave', {
    hint: 'Justo después del atardecer: fría, calma y melancólica.',
    demo: light('linear-gradient(180deg,#1d3557,#457b9d)', 'radial-gradient(circle at 40% 30%,#c6dcff,#5a7fb5 45%,#14213d 90%)'),
  }),
  o('estudio', 'Estudio suave', 'soft diffused studio lighting with softboxes', 'luz de estudio suave y difusa con softbox', {
    hint: 'Pareja y limpia: la luz de las fotos de producto y retratos profesionales.',
    demo: light('linear-gradient(180deg,#f1f1f1,#d9d9d9)', 'radial-gradient(circle at 40% 35%,#ffffff,#d6d6d6 50%,#8a8a8a 95%)'),
  }),
  o('clave-alta', 'Clave alta', 'bright high-key lighting, minimal shadows', 'iluminación en clave alta, brillante, casi sin sombras', {
    hint: 'Todo claro y luminoso: optimista y fresco.',
    demo: light('#ffffff', 'radial-gradient(circle at 45% 40%,#ffffff,#f0f0f0 60%,#cfcfcf 100%)'),
  }),
  o('clave-baja', 'Clave baja', 'dramatic low-key lighting, deep shadows', 'iluminación en clave baja, dramática, sombras profundas', {
    hint: 'Mayormente oscura, con poca luz: misterio y drama.',
    demo: light('#0b0b0b', 'radial-gradient(circle at 30% 30%,#9a9a9a,#2a2a2a 35%,#050505 70%)'),
  }),
  o('claroscuro', 'Claroscuro', 'chiaroscuro lighting, strong contrast between light and dark', 'iluminación en claroscuro, fuerte contraste entre luz y sombra', {
    hint: 'Contraste extremo, como en las pinturas de Caravaggio.',
    demo: light('#140d07', 'radial-gradient(circle at 20% 30%,#ffe0b0,#a0612b 25%,#120a04 55%)'),
  }),
  o('contraluz', 'Contraluz', 'backlit subject with a glowing rim light', 'sujeto a contraluz con un borde de luz brillante', {
    hint: 'La luz viene de atrás: siluetas y halos.',
    demo: light('radial-gradient(circle at 50% 45%,#fff4d6,#ffb86b 30%,#3b2a20 70%)', 'radial-gradient(circle at 50% 50%,#1a1410,#1a1410 62%,#ffd28a 72%,#1a1410 80%)', '0 0 30px #ffd28a'),
  }),
  o('rembrandt', 'Rembrandt', 'Rembrandt lighting, triangle of light on the cheek', 'iluminación Rembrandt, triángulo de luz en la mejilla', {
    hint: 'Clásico del retrato: una luz lateral alta, mitad del rostro en sombra.',
    demo: light('#2b2420', 'radial-gradient(circle at 32% 32%,#f5d7b5,#a7764f 30%,#2a1c14 62%)'),
  }),
  o('neon', 'Neón', 'vibrant neon lighting in pink and blue', 'iluminación de neón vibrante en rosa y azul', {
    hint: 'Noche urbana y futurista.',
    demo: light('#0a0420', 'radial-gradient(circle at 25% 40%,#ff4fd8,transparent 45%),radial-gradient(circle at 75% 40%,#3ad7ff,transparent 45%),radial-gradient(circle,#2a1747,#0a0420 80%)', '0 0 30px #ff4fd855'),
  }),
  o('volumetrica', 'Volumétrica', 'volumetric light rays cutting through haze', 'rayos de luz volumétrica atravesando la neblina', {
    hint: 'Rayos de luz visibles entre el humo o la niebla.',
    demo: light('repeating-linear-gradient(115deg,#2c3e50 0 14px,#3d566e 14px 22px)', 'radial-gradient(circle at 35% 25%,#ffffff,#9fb3c8 40%,#2c3e50 90%)'),
  }),
  o('nublado', 'Nublado', 'soft overcast daylight, even diffused light', 'luz de día nublado, suave y difusa', {
    hint: 'Sin sombras duras: ideal para retratos naturales.',
    demo: light('linear-gradient(180deg,#c9d1d9,#aab4bf)', 'radial-gradient(circle at 45% 40%,#f2f4f6,#b6c0ca 60%,#7d8792 100%)'),
  }),
  o('velas', 'Luz de velas', 'warm intimate candlelight, flickering glow', 'luz de velas cálida e íntima, brillo titilante', {
    hint: 'Íntima, cálida y anaranjada.',
    demo: light('#1a0d05', 'radial-gradient(circle at 50% 75%,#ffd27a,#c66a1b 30%,#1a0d05 70%)', '0 10px 40px #ff9d3b55'),
  }),
  o('luna', 'Luz de luna', 'cold silvery moonlight, night scene', 'luz de luna fría y plateada, escena nocturna', {
    hint: 'Noche fría y misteriosa.',
    demo: light('linear-gradient(180deg,#0d1b2a,#1b263b)', 'radial-gradient(circle at 70% 25%,#e0e6f0,#6c7a91 35%,#0d1b2a 80%)'),
  }),
  o('mediodia', 'Sol de mediodía', 'harsh midday sun, crisp hard shadows', 'sol duro de mediodía, sombras duras y marcadas', {
    hint: 'Luz de verano: colores intensos y sombras duras.',
    demo: light('linear-gradient(180deg,#5ec8ff,#bde8ff)', 'radial-gradient(circle at 50% 15%,#ffffff,#ffd166 30%,#7a5a00 75%)'),
  }),
  o('bioluminiscente', 'Bioluminiscente', 'glowing bioluminescent light, magical cyan glow', 'luz bioluminiscente, brillo mágico cian', {
    hint: 'Brillo mágico, como plantas o criaturas que emiten luz.',
    demo: light('#021a1a', 'radial-gradient(circle at 50% 50%,#b6fff5,#1fd1b8 35%,#032a2a 75%)', '0 0 40px #1fd1b8aa'),
  }),
];

/** Plano (qué tanto se ve del sujeto). */
export const PLANOS: Option[] = [
  o('plano-detalle', 'Detalle', 'extreme close-up shot', 'plano detalle', { hint: 'Un detalle mínimo: ojos, manos, textura.', demo: diagram('shot-xcu') }),
  o('primer-plano', 'Primer plano', 'close-up shot', 'primer plano', { hint: 'El rostro o el objeto llena el cuadro. Emoción.', demo: diagram('shot-cu') }),
  o('plano-medio', 'Plano medio', 'medium shot from the waist up', 'plano medio de la cintura para arriba', { hint: 'De la cintura para arriba: el clásico para personas.', demo: diagram('shot-ms') }),
  o('plano-entero', 'Plano entero', 'full body shot', 'plano entero de cuerpo completo', { hint: 'El cuerpo completo, de pies a cabeza.', demo: diagram('shot-fs') }),
  o('plano-general', 'Plano general', 'wide shot showing the surroundings', 'plano general que muestra el entorno', { hint: 'El sujeto dentro de su entorno.', demo: diagram('shot-ws') }),
  o('gran-plano-general', 'Gran plano general', 'extreme wide establishing shot, tiny subject in a vast landscape', 'gran plano general, sujeto pequeño en un paisaje inmenso', { hint: 'Paisajes enormes: el sujeto es muy pequeño.', demo: diagram('shot-xws') }),
];

/** Ángulo de cámara. */
export const ANGULOS: Option[] = [
  o('altura-ojos', 'A la altura de los ojos', 'eye-level angle', 'ángulo a la altura de los ojos', { hint: 'Neutral y natural.', demo: diagram('angle-eye') }),
  o('contrapicado', 'Contrapicado', 'low-angle shot looking up', 'contrapicado, mirando desde abajo', { hint: 'Desde abajo: el sujeto se ve poderoso.', demo: diagram('angle-low') }),
  o('picado', 'Picado', 'high-angle shot looking down', 'picado, mirando desde arriba', { hint: 'Desde arriba: el sujeto se ve pequeño o vulnerable.', demo: diagram('angle-high') }),
  o('cenital', 'Cenital / flat lay', 'top-down overhead view, flat lay', 'vista cenital desde arriba, flat lay', { hint: 'Directo desde arriba: ideal para productos y comida.', demo: diagram('angle-top') }),
  o('aerea', 'Vista aérea (dron)', 'aerial drone view', 'vista aérea de dron', { hint: 'Desde muy alto, como un dron.', demo: diagram('angle-aerial') }),
  o('holandes', 'Holandés (inclinado)', 'dutch angle, tilted camera', 'ángulo holandés, cámara inclinada', { hint: 'Cámara inclinada: tensión e inestabilidad.', demo: diagram('angle-dutch') }),
  o('sobre-hombro', 'Sobre el hombro', 'over-the-shoulder shot', 'plano sobre el hombro', { hint: 'Vemos lo que ve el personaje.', demo: diagram('angle-ots') }),
];

/** Lente y profundidad de campo. Solo modo avanzado. */
export const LENTES: Option[] = [
  o('gran-angular', 'Gran angular', 'wide-angle 24mm lens', 'lente gran angular de 24 mm', { hint: 'Abarca mucho espacio; deforma los bordes.', demo: diagram('lens-wide') }),
  o('normal', 'Normal (35–50 mm)', '50mm lens, natural perspective', 'lente de 50 mm, perspectiva natural', { hint: 'Lo más parecido a lo que ve el ojo.', demo: diagram('lens-normal') }),
  o('retrato', 'Retrato (85 mm)', '85mm portrait lens, shallow depth of field, creamy bokeh', 'lente de retrato de 85 mm, poca profundidad de campo, bokeh suave', { hint: 'El favorito para retratos: fondo desenfocado.', demo: diagram('lens-portrait') }),
  o('teleobjetivo', 'Teleobjetivo', 'telephoto lens, compressed background', 'teleobjetivo, fondo comprimido', { hint: 'Desde lejos: acerca el fondo y aísla al sujeto.', demo: diagram('lens-tele') }),
  o('macro', 'Macro', 'macro lens, extreme detail', 'lente macro, detalle extremo', { hint: 'Detalles diminutos en tamaño gigante.', demo: diagram('lens-macro') }),
  o('ojo-pez', 'Ojo de pez', 'fisheye lens, strong curved distortion', 'lente ojo de pez, fuerte distorsión curva', { hint: 'Distorsión redonda y exagerada.', demo: diagram('lens-fisheye') }),
  o('tilt-shift', 'Tilt-shift (miniatura)', 'tilt-shift photography, miniature effect', 'fotografía tilt-shift, efecto miniatura', { hint: 'Hace que una ciudad parezca una maqueta.', demo: diagram('lens-tiltshift') }),
  o('foco-profundo', 'Todo nítido', 'deep focus, everything sharp', 'foco profundo, todo nítido', { hint: 'Del frente al fondo, todo en foco.', demo: diagram('lens-deep') }),
];

/** Composición. Ver docs/03-diseno-grafico.md §3. */
export const COMPOSICION: Option[] = [
  o('tercios', 'Regla de tercios', 'rule of thirds composition', 'composición con regla de tercios', { hint: 'El sujeto en un tercio: natural y dinámico.', demo: diagram('comp-thirds') }),
  o('centrada', 'Centrada y simétrica', 'centered symmetrical composition', 'composición centrada y simétrica', { hint: 'Formal, potente e icónica.', demo: diagram('comp-center') }),
  o('aurea', 'Proporción áurea', 'golden ratio spiral composition', 'composición en espiral áurea', { hint: 'La proporción clásica de la armonía.', demo: diagram('comp-golden') }),
  o('lineas-guia', 'Líneas guía', 'strong leading lines toward the subject', 'líneas guía marcadas hacia el sujeto', { hint: 'Caminos o bordes que llevan la mirada al sujeto.', demo: diagram('comp-leading') }),
  o('diagonal', 'Diagonal', 'dynamic diagonal composition', 'composición diagonal dinámica', { hint: 'Energía y movimiento.', demo: diagram('comp-diagonal') }),
  o('marco', 'Marco dentro del marco', 'frame within a frame composition', 'composición con marco dentro del marco', { hint: 'Una ventana o arco que encuadra al sujeto.', demo: diagram('comp-frame') }),
  o('espacio-negativo', 'Espacio negativo', 'generous negative space around the subject', 'amplio espacio negativo alrededor del sujeto', { hint: 'Mucho aire alrededor: elegante y deja lugar para texto.', demo: diagram('comp-negative') }),
  o('patron', 'Patrón / repetición', 'repeating pattern composition', 'composición con patrón repetido', { hint: 'Elementos que se repiten con ritmo.', demo: diagram('comp-pattern') }),
  o('capas', 'Capas de profundidad', 'layered depth with foreground, midground and background', 'profundidad en capas con primer plano, plano medio y fondo', { hint: 'Algo adelante, el sujeto al medio y un fondo: sensación 3D.', demo: diagram('comp-layers') }),
];
