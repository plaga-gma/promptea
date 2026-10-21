import type { Demo, Option, Step } from '../../../engine/types';
import { BLUR, o } from './_helpers';

const light = (bg: string, sphere: string, glow?: string): Demo => ({ kind: 'light', bg, sphere, ...(glow ? { glow } : {}) });
const diagram = (name: string): Demo => ({ kind: 'diagram', name });
const onPhoto = (css: string, overlay: Extract<Demo, { kind: 'filter' }>['overlay']): Demo => ({ kind: 'filter', css, overlay });

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
  o('ventana', 'Luz de ventana', 'soft natural window light from the side', 'luz natural suave de ventana, de costado', {
    hint: 'Suave y natural: la luz favorita para retratos en casa.',
    demo: light('linear-gradient(90deg,#fdfbf5 0 16%,#ddd7cc 16%,#837c71)', 'radial-gradient(circle at 18% 40%,#ffffff,#d8d2c6 40%,#5a544b 90%)'),
  }),
  o('flash', 'Flash directo', 'direct on-camera flash, hard shadow behind the subject, glossy snapshot look', 'flash directo de cámara, sombra dura detrás del sujeto, look de foto casual', {
    hint: 'El flash de las fiestas y la moda de los 2000.',
    demo: light('#2a2a2a', 'radial-gradient(circle at 50% 45%,#ffffff,#ececec 40%,#6b6b6b 95%)', '12px 6px 4px rgb(0 0 0 / 75%)'),
  }),
  o('aro', 'Aro de luz', 'ring light, even frontal light with circular catchlights in the eyes', 'aro de luz, luz frontal pareja con reflejos circulares en los ojos', {
    hint: 'La luz de los videos de maquillaje y streamers.',
    demo: light('#efedf5', 'radial-gradient(circle at 50% 50%,#ffffff,#ededed 55%,#a9a9a9 100%)', '0 0 0 5px #ffffff, 0 0 0 8px #d6d3df'),
  }),
  o('fogata', 'Fogata', 'warm flickering firelight from below', 'luz cálida y titilante de fogata, desde abajo', {
    hint: 'Cálida, desde abajo: relatos y misterio.',
    demo: light('linear-gradient(0deg,#ff7b00,#2b0f00 62%)', 'radial-gradient(circle at 50% 88%,#ffd27a,#ff7b00 30%,#3a1200 75%)', '0 12px 30px #ff7b0088'),
  }),
  o('escenario', 'Foco de escenario', 'dramatic stage spotlight from above in darkness', 'foco de escenario dramático desde arriba, en la oscuridad', {
    hint: 'Un solo foco en la oscuridad: protagonismo total.',
    demo: light('radial-gradient(ellipse 34% 95% at 50% 0%,rgb(255 255 255 / 42%),transparent 72%),#0b0b0b', 'radial-gradient(circle at 50% 18%,#ffffff,#c4c4c4 35%,#151515 80%)'),
  }),
  o('split', 'Mitad y mitad', 'split lighting, half of the face lit and half in shadow', 'iluminación dividida: medio rostro iluminado y medio en sombra', {
    hint: 'Mitad luz, mitad sombra: misterio y carácter.',
    demo: light('#1c1c1c', 'linear-gradient(90deg,#f5e6d3,#c9a98a 46%,#121212 52%)'),
  }),
  o('mariposa', 'Mariposa (glamour)', 'butterfly glamour lighting from above and in front, small shadow under the nose', 'iluminación mariposa de glamour, desde arriba y al frente, pequeña sombra bajo la nariz', {
    hint: 'La luz clásica de Hollywood para retratos de belleza.',
    demo: light('#3a3340', 'radial-gradient(circle at 50% 20%,#ffffff,#ead8e2 40%,#5a4a55 92%)'),
  }),
  o('persiana', 'Luz entre persianas', 'light through window blinds casting striped shadows', 'luz que entra por una persiana y proyecta sombras a rayas', {
    hint: 'Rayas de luz y sombra: cine negro y suspenso.',
    demo: light(
      'repeating-linear-gradient(160deg,#f3d9a4 0 7px,#3a2a1a 7px 14px)',
      'repeating-linear-gradient(160deg,rgb(0 0 0 / 0%) 0 7px,rgb(0 0 0 / 55%) 7px 14px),radial-gradient(circle at 35% 35%,#f7e3bd,#9c7444 50%,#2a1a0c 95%)',
    ),
  }),
  o('pantalla', 'Luz de pantalla', 'cool glow of a screen lighting the face in the dark', 'el brillo frío de una pantalla iluminando la cara en la oscuridad', {
    hint: 'Alguien frente a la compu de noche.',
    demo: light('#05070d', 'radial-gradient(circle at 50% 78%,#bfe3ff,#3c6e9e 35%,#05070d 75%)', '0 12px 30px #4aa3ff66'),
  }),
];

/** Plano (qué tanto se ve del sujeto). */
export const PLANOS: Option[] = [
  o('plano-detalle', 'Detalle', 'extreme close-up shot', 'plano detalle', { hint: 'Un detalle mínimo: ojos, manos, textura.', demo: diagram('shot-xcu') }),
  o('primer-plano', 'Primer plano', 'close-up shot', 'primer plano', { hint: 'El rostro o el objeto llena el cuadro. Emoción.', demo: diagram('shot-cu') }),
  o('plano-medio', 'Plano medio', 'medium shot from the waist up', 'plano medio de la cintura para arriba', { hint: 'De la cintura para arriba: el clásico para personas.', demo: diagram('shot-ms') }),
  o('plano-americano', 'Plano americano', 'medium-full shot from the knees up', 'plano americano, de las rodillas para arriba', { hint: 'De las rodillas para arriba: el clásico de los westerns.', demo: diagram('shot-american') }),
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
  o('gusano', 'Desde el piso', "worm's-eye view from ground level looking straight up", 'vista de gusano, desde el piso mirando hacia arriba', { hint: 'Más extremo que el contrapicado: todo se ve gigante.', demo: diagram('angle-worm') }),
  o('perfil', 'De perfil', 'side profile view', 'vista de perfil', { hint: 'El sujeto de costado: elegante y gráfico.', demo: diagram('angle-profile') }),
  o('tres-cuartos', 'Tres cuartos', 'three-quarter view', 'vista de tres cuartos', { hint: 'Ni de frente ni de perfil: el ángulo más favorecedor.', demo: diagram('angle-34') }),
  o('pov', 'Primera persona', 'first-person point of view, hands visible in the frame', 'punto de vista en primera persona, con las manos en el cuadro', { hint: 'Como si miraras con tus propios ojos.', demo: diagram('angle-pov') }),
  o('selfie', 'Selfie', 'selfie taken at arm\'s length with a phone', 'selfie sacada con el brazo extendido', { hint: 'Casual y cercana, como en redes.', demo: diagram('angle-selfie') }),
];

/** Lente y profundidad de campo. Solo modo avanzado. */
export const LENTES: Option[] = [
  o('gran-angular', 'Gran angular', 'wide-angle 24mm lens', 'lente gran angular de 24 mm', { hint: 'Abarca mucho espacio; deforma los bordes.', demo: diagram('lens-wide') }),
  o('normal', 'Normal (35–50 mm)', '50mm lens, natural perspective', 'lente de 50 mm, perspectiva natural', { hint: 'Lo más parecido a lo que ve el ojo.', demo: diagram('lens-normal') }),
  o('retrato', 'Retrato (85 mm)', '85mm portrait lens, shallow depth of field, creamy bokeh', 'lente de retrato de 85 mm, poca profundidad de campo, bokeh suave', { hint: 'El favorito para retratos: fondo desenfocado.', demo: diagram('lens-portrait'), meta: { allow: BLUR }, conflicts: ['sin-borroso'] }),
  o('teleobjetivo', 'Teleobjetivo', 'telephoto lens, compressed background', 'teleobjetivo, fondo comprimido', { hint: 'Desde lejos: acerca el fondo y aísla al sujeto.', demo: diagram('lens-tele') }),
  o('macro', 'Macro', 'macro lens, extreme detail', 'lente macro, detalle extremo', { hint: 'Detalles diminutos en tamaño gigante.', demo: diagram('lens-macro') }),
  o('ojo-pez', 'Ojo de pez', 'fisheye lens, strong curved distortion', 'lente ojo de pez, fuerte distorsión curva', { hint: 'Distorsión redonda y exagerada.', demo: diagram('lens-fisheye') }),
  o('tilt-shift', 'Tilt-shift (miniatura)', 'tilt-shift photography, miniature effect', 'fotografía tilt-shift, efecto miniatura', { hint: 'Hace que una ciudad parezca una maqueta.', demo: diagram('lens-tiltshift'), meta: { allow: BLUR }, conflicts: ['sin-borroso'] }),
  o('foco-profundo', 'Todo nítido', 'deep focus, everything sharp', 'foco profundo, todo nítido', { hint: 'Del frente al fondo, todo en foco.', demo: diagram('lens-deep'), conflicts: ['bokeh', 'tilt'] }),
  o('gran-apertura', 'Gran apertura (f/1.4)', 'shot wide open at f/1.4, razor-thin focus and creamy bokeh', 'tomada con gran apertura f/1.4, foco finísimo y bokeh cremoso', { hint: 'Solo el sujeto en foco; el resto, manchas suaves de luz.', demo: onPhoto('saturate(1.05)', 'bokeh'), meta: { allow: BLUR }, conflicts: ['sin-borroso'] }),
  o('anamorfico', 'Anamórfico', 'anamorphic lens, horizontal blue lens flares and oval bokeh, widescreen cinematic look', 'lente anamórfico, destellos horizontales azules y bokeh ovalado, look de cine en pantalla ancha', { hint: 'El destello horizontal típico de las películas.', demo: onPhoto('url(#pf-teal)', 'streak') }),
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
  o('punto-fuga', 'Punto de fuga', 'one-point perspective with lines converging to a central vanishing point', 'perspectiva central con líneas que convergen en un punto de fuga', { hint: 'Pasillos, rutas o vías que se juntan en el centro.', demo: diagram('comp-vanishing') }),
  o('knolling', 'Knolling (objetos ordenados)', 'knolling: objects neatly arranged at right angles, seen from above', 'knolling: objetos ordenados en ángulo recto, vistos desde arriba', { hint: 'Herramientas o productos alineados prolijamente.', demo: diagram('comp-knolling') }),
];

/** Categorías de las listas largas de luz y cámara. */
export const ILUMINACION_GROUPS: Step['groups'] = [
  { id: 'natural', label: { es: 'Natural' }, optionIds: ['hora-dorada', 'hora-azul', 'nublado', 'luna', 'mediodia', 'ventana', 'persiana'] },
  { id: 'estudio', label: { es: 'Estudio y retrato' }, optionIds: ['estudio', 'clave-alta', 'clave-baja', 'rembrandt', 'split', 'mariposa', 'aro', 'flash'] },
  { id: 'dramatica', label: { es: 'Dramática' }, optionIds: ['claroscuro', 'contraluz', 'volumetrica', 'escenario'] },
  { id: 'fuentes', label: { es: 'Fuego, neón y pantallas' }, optionIds: ['neon', 'velas', 'fogata', 'bioluminiscente', 'pantalla'] },
];

export const ANGULOS_GROUPS: Step['groups'] = [
  { id: 'altura', label: { es: 'Altura de la cámara' }, optionIds: ['altura-ojos', 'contrapicado', 'picado', 'cenital', 'aerea', 'gusano'] },
  { id: 'punto', label: { es: 'Punto de vista' }, optionIds: ['holandes', 'sobre-hombro', 'perfil', 'tres-cuartos', 'pov', 'selfie'] },
];

export const LENTES_GROUPS: Step['groups'] = [
  { id: 'lentes', label: { es: 'Lentes' }, optionIds: ['gran-angular', 'normal', 'retrato', 'teleobjetivo', 'macro', 'ojo-pez', 'anamorfico'] },
  { id: 'foco', label: { es: 'Foco' }, optionIds: ['tilt-shift', 'foco-profundo', 'gran-apertura'] },
];

export const COMPOSICION_GROUPS: Step['groups'] = [
  { id: 'reglas', label: { es: 'Reglas clásicas' }, optionIds: ['tercios', 'centrada', 'aurea', 'diagonal'] },
  { id: 'mirada', label: { es: 'Guiar la mirada' }, optionIds: ['lineas-guia', 'marco', 'punto-fuga', 'capas'] },
  { id: 'orden', label: { es: 'Orden y vacío' }, optionIds: ['espacio-negativo', 'patron', 'knolling'] },
];
