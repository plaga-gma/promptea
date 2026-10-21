import type { Demo, Detail, Option, PromptText } from '../../../engine/types';
import { BLUR, o } from './_helpers';

/**
 * Subopciones: detalles que se abren al elegir una opción, para afinar el prompt sin escribir.
 * Se apoyan en docs/01-ingenieria-de-prompts.md (ser específico: cantidad, dirección, material)
 * y docs/03-diseno-grafico.md (luz, color, tipografía). Ver docs/04-decisiones.md (T15).
 *
 * Cada fragmento en inglés está escrito para ir después de una coma, salvo los que reemplazan
 * un `{d:<id>}` del prompt de la opción o completan su `{target}`.
 */

interface DetailExtra {
  multi?: boolean;
  role?: Detail['role'];
  max?: number;
  template?: PromptText;
  default?: PromptText;
  fillsTarget?: boolean;
  except?: string[];
}

function d(id: string, label: string, options: Option[], extra: DetailExtra = {}): Detail {
  const { multi, ...rest } = extra;
  return { id, label: { es: label }, options, ...(multi ? { type: 'multi' as const } : {}), ...rest };
}

/** Puntito de color en la subopción. */
const dot = (...colors: string[]): Demo => ({ kind: 'swatch', colors });

/** Suma subopciones a las opciones de una lista, por id. No modifica la lista original. */
export function withDetails(options: Option[], map: Record<string, Detail[]>): Option[] {
  return options.map((op) => (map[op.id] ? { ...op, details: [...(op.details ?? []), ...map[op.id]!] } : op));
}

// ---------------------------------------------------------------------------
// Edición: operaciones
// ---------------------------------------------------------------------------

const DONDE = d('donde', '¿Dónde?', [
  o('pos-frente', 'En primer plano', 'placed in the foreground', 'ubicado en primer plano'),
  o('pos-fondo', 'Al fondo', 'placed in the background', 'ubicado al fondo'),
  o('pos-izq', 'A la izquierda', 'on the left side of the frame', 'del lado izquierdo del cuadro'),
  o('pos-der', 'A la derecha', 'on the right side of the frame', 'del lado derecho del cuadro'),
  o('pos-centro', 'En el centro', 'in the center of the frame', 'en el centro del cuadro'),
]);

const TAMANO = d('tamano', 'Tamaño', [
  o('tam-chico', 'Chico, de detalle', 'small and subtle, as a discreet detail', 'chico y sutil, como un detalle discreto'),
  o('tam-real', 'A escala real', 'at a realistic scale relative to the scene', 'en una escala realista respecto de la escena'),
  o('tam-protagonista', 'Protagonista', 'large and prominent, as a main element', 'grande y destacado, como elemento principal'),
]);

export const DETALLES_OPERACIONES: Record<string, Detail[]> = {
  'quitar-objeto': [
    d('relleno', 'Cómo rellenar el hueco', [
      o('rell-fondo', 'Continuar el fondo', 'continue the surrounding background seamlessly', 'continuá el fondo que lo rodea sin cortes'),
      o('rell-reconstruir', 'Reconstruir lo de atrás', 'realistically reconstruct whatever was hidden behind it', 'reconstruí de forma realista lo que quedaba tapado'),
    ]),
    d('rastros', 'Quitar también', [
      o('ras-sombra', 'Su sombra', 'also remove its shadow', 'quitá también su sombra'),
      o('ras-reflejo', 'Su reflejo', 'also remove its reflection', 'quitá también su reflejo'),
    ], { multi: true }),
  ],
  'quitar-fondo': [
    d('fondo', 'Fondo final', [
      o('qf-blanco', 'Blanco', 'a plain white background', 'un fondo blanco liso', { demo: dot('#ffffff') }),
      o('qf-transparente', 'Transparente (PNG)', 'a transparent background (PNG with alpha channel)', 'un fondo transparente (PNG con canal alfa)', { hint: 'ChatGPT lo hace bien; otras IAs pueden dejar un fondo liso.', demo: dot('#ffffff', '#d9d9d9') }),
      o('qf-negro', 'Negro', 'a plain black background', 'un fondo negro liso', { demo: dot('#111111') }),
      o('qf-gris', 'Gris de estudio', 'a seamless light gray studio background', 'un fondo gris claro de estudio, sin costuras', { demo: dot('#c9c9c9') }),
      o('qf-color', 'Un color liso', 'a solid color background (described in the note)', 'un fondo de color liso (indicado en la nota)', { hint: 'Escribí el color en la nota.', demo: dot('#6d4aff') }),
    ], { default: { en: 'a plain white background', es: 'un fondo blanco liso' } }),
    d('bordes', 'Terminación', [
      o('qf-pelo', 'Cuidar el pelo', 'preserve fine hair strands and soft edges', 'conservá los pelos finos y los bordes suaves'),
      o('qf-sombra', 'Sombra suave al piso', 'add a soft, natural contact shadow under the subject', 'agregá una sombra de contacto suave y natural debajo del sujeto'),
    ], { multi: true }),
  ],
  'cambiar-fondo': [
    d('ideas', 'Ideas de fondo', [
      o('cf-estudio', 'Estudio liso', 'a clean, seamless studio backdrop', 'un fondo de estudio liso y sin costuras', { demo: dot('#d9d9d9', '#f5f5f5') }),
      o('cf-playa', 'Playa', 'a sunny beach with soft waves', 'una playa soleada con olas suaves', { demo: dot('#7fd1f7', '#f6d7a7') }),
      o('cf-ciudad', 'Ciudad de noche', 'a city street at night with blurred lights', 'una calle de ciudad de noche con luces desenfocadas', { demo: dot('#1d1b3a', '#ffb84d') }),
      o('cf-naturaleza', 'Bosque o parque', 'a lush green park with soft daylight', 'un parque verde y frondoso con luz de día suave', { demo: dot('#4f772d', '#c7e8a5') }),
      o('cf-oficina', 'Oficina moderna', 'a bright, modern office interior', 'el interior de una oficina moderna y luminosa', { demo: dot('#e5e7eb', '#9aa5b1') }),
      o('cf-hogar', 'Living acogedor', 'a cozy living room with warm lamps', 'un living acogedor con lámparas cálidas', { demo: dot('#b07a4a', '#ffd9a0') }),
      o('cf-degradado', 'Degradado de color', 'a smooth colorful gradient backdrop', 'un fondo con un degradado de color suave', { demo: dot('#6d4aff', '#ff6b5b') }),
    ], { fillsTarget: true }),
    d('integracion', 'Integración', [
      o('cf-desenfocado', 'Fondo nuevo desenfocado', 'with the new background slightly out of focus for depth', 'con el fondo nuevo levemente desenfocado para dar profundidad', { meta: { allow: BLUR } }),
      o('cf-sombras', 'Sombras coherentes', 'casting shadows that match the new environment', 'con sombras que coincidan con el nuevo entorno'),
    ], { multi: true }),
  ],
  'desenfocar-fondo': [
    d('cuanto', 'Cuánto desenfoque', [
      o('df-suave', 'Suave', 'like a lens at f/4, so the background is soft but still recognizable', 'como un lente a f/4, con el fondo suave pero todavía reconocible'),
      o('df-medio', 'Medio', 'like a portrait lens at f/1.8', 'como un lente de retrato a f/1.8'),
      o('df-fuerte', 'Fuerte', 'like a fast lens at f/1.2, with a creamy, almost abstract background', 'como un lente luminoso a f/1.2, con un fondo cremoso y casi abstracto'),
    ], { default: { en: 'like a portrait lens at f/1.8', es: 'como un lente de retrato a f/1.8' } }),
    d('bokeh', 'Forma del bokeh', [
      o('bk-circulos', 'Círculos de luz', 'with round bokeh balls from the background lights', 'con círculos de bokeh en las luces del fondo'),
      o('bk-cremoso', 'Cremoso, sin formas', 'with a smooth, creamy blur and no distracting shapes', 'con un desenfoque liso y cremoso, sin formas que distraigan'),
    ]),
  ],
  'cambiar-cielo': [
    d('cielo', 'Tipo de cielo', [
      o('cielo-atardecer', 'Atardecer', 'a warm orange and pink sunset sky with soft clouds', 'un cielo de atardecer naranja y rosa con nubes suaves', { demo: dot('#ff9a5a', '#ff5e7e') }),
      o('cielo-azul', 'Azul con nubes', 'a clear blue sky with a few white fluffy clouds', 'un cielo azul despejado con algunas nubes blancas', { demo: dot('#4ea8de', '#ffffff') }),
      o('cielo-tormenta', 'Tormenta', 'a dramatic, dark stormy sky with heavy clouds', 'un cielo de tormenta oscuro y dramático, con nubes cargadas', { demo: dot('#2b2d42', '#8d99ae') }),
      o('cielo-estrellas', 'Estrellado', 'a clear night sky full of stars and the Milky Way', 'un cielo nocturno despejado lleno de estrellas y la Vía Láctea', { demo: dot('#0b0d2b', '#5a4fcf') }),
      o('cielo-aurora', 'Aurora boreal', 'a night sky with green and violet northern lights', 'un cielo nocturno con una aurora boreal verde y violeta', { demo: dot('#0b1d2b', '#3ddc97') }),
      o('cielo-hora-azul', 'Hora azul', 'a deep blue twilight sky just after sunset', 'un cielo azul profundo de crepúsculo, justo después del atardecer', { demo: dot('#1d3557', '#457b9d') }),
      o('cielo-nublado', 'Nublado suave', 'a soft overcast sky with diffused light', 'un cielo nublado y suave con luz difusa', { demo: dot('#c9ced6', '#eef0f3') }),
    ], { fillsTarget: true }),
    d('reflejos', 'Ajustar también', [
      o('cielo-agua', 'Reflejos en el agua', 'update the reflections in water and glass to match', 'actualizá los reflejos en el agua y los vidrios para que coincidan'),
      o('cielo-sombras', 'Dirección de las sombras', 'adjust the direction of the shadows to the new light', 'ajustá la dirección de las sombras a la nueva luz'),
    ], { multi: true }),
  ],
  agregar: [DONDE, TAMANO],
  mover: [DONDE],
  retoque: [
    d('retocar', 'Qué retocar', [
      o('rt-piel', 'Piel pareja', 'smooth the skin lightly while keeping the pores visible', 'suavizá un poco la piel sin borrar los poros'),
      o('rt-ojeras', 'Ojeras', 'soften dark circles under the eyes', 'suavizá las ojeras'),
      o('rt-granitos', 'Granitos y marcas', 'remove temporary blemishes such as pimples, keeping freckles and moles', 'quitá marcas pasajeras como granitos, conservando pecas y lunares'),
      o('rt-ojos', 'Ojos más vivos', 'make the eyes slightly brighter and clearer', 'hacé los ojos un poco más brillantes y claros'),
      o('rt-dientes', 'Dientes', 'whiten the teeth slightly and naturally', 'blanqueá los dientes apenas, con naturalidad'),
      o('rt-pelo', 'Pelitos sueltos', 'tidy up stray flyaway hairs', 'acomodá los pelitos sueltos'),
    ], { multi: true }),
  ],
  restaurar: [
    d('ademas', 'Además', [
      o('rs-color', 'Colorearla', 'then colorize it with realistic, period-accurate colors', 'después coloreala con colores realistas y fieles a la época'),
      o('rs-caras', 'Recuperar las caras', 'carefully recover facial detail without changing anyone’s features', 'recuperá con cuidado el detalle de las caras sin cambiar los rasgos de nadie'),
    ], { multi: true }),
  ],
  colorear: [
    d('paleta', 'Tipo de color', [
      o('col-natural', 'Natural', 'with natural, believable colors', 'con colores naturales y creíbles'),
      o('col-epoca', 'Apagado, de época', 'with soft, slightly muted colors like an early color print', 'con colores suaves y algo apagados, como una copia color antigua'),
      o('col-vivo', 'Vivo', 'with rich, vibrant colors', 'con colores intensos y vibrantes'),
    ]),
  ],
  expandir: [
    d('direccion', 'Hacia dónde', [
      o('ex-todos', 'Todos los lados', 'extending evenly on all sides', 'extendiendo parejo hacia todos los lados'),
      o('ex-lados', 'Izquierda y derecha', 'extending to the left and right', 'extendiendo hacia la izquierda y la derecha'),
      o('ex-arriba', 'Arriba (más cielo)', 'extending upward to show more sky or ceiling', 'extendiendo hacia arriba para mostrar más cielo o techo'),
      o('ex-abajo', 'Abajo (más piso)', 'extending downward to show more ground', 'extendiendo hacia abajo para mostrar más piso'),
    ]),
  ],
  mejorar: [
    d('que', 'Qué mejorar más', [
      o('mj-nitidez', 'Nitidez', 'with special care on sharpness', 'con especial cuidado en la nitidez'),
      o('mj-ruido', 'Ruido', 'with special care on removing noise', 'con especial cuidado en quitar el ruido'),
      o('mj-color', 'Color', 'with richer, more accurate colors', 'con colores más ricos y fieles'),
      o('mj-luz', 'Luz', 'with better balanced light', 'con una luz mejor equilibrada'),
    ], { multi: true }),
  ],
  ampliar: [
    d('factor', 'Cuánto más grande', [
      o('amp-2x', '2 veces', 'at twice the original resolution', 'al doble de la resolución original'),
      o('amp-4x', '4 veces', 'at four times the original resolution', 'a cuatro veces la resolución original'),
    ]),
    d('tipo', 'Tipo de imagen', [
      o('amp-foto', 'Foto', 'keeping a natural photographic texture, without a plastic look', 'conservando una textura fotográfica natural, sin aspecto de plástico'),
      o('amp-ilustracion', 'Ilustración o logo', 'keeping clean, crisp lines and flat colors', 'conservando líneas limpias y nítidas y colores planos'),
    ]),
  ],
  exposicion: [
    d('problema', 'El problema', [
      o('exp-oscura', 'Muy oscura', 'the photo is underexposed and too dark', 'la foto está subexpuesta y muy oscura'),
      o('exp-quemada', 'Quemada', 'the highlights are blown out, especially the sky', 'las luces están quemadas, sobre todo el cielo'),
      o('exp-contraluz', 'Cara oscura a contraluz', 'the subject’s face is too dark because of the backlight', 'la cara del sujeto quedó muy oscura por el contraluz'),
      o('exp-noche', 'Foto de noche', 'it is a dark night photo: lift it without adding noise', 'es una foto nocturna oscura: aclarala sin sumar ruido'),
    ], { template: { en: 'the main problem: {value}', es: 'el problema principal: {value}' } }),
  ],
  enderezar: [
    d('corregir', 'Qué corregir', [
      o('end-horizonte', 'Solo el horizonte', 'focus on leveling the horizon', 'concentrate en nivelar el horizonte'),
      o('end-verticales', 'Edificios que se caen', 'focus on making the building verticals straight', 'concentrate en que las verticales de los edificios queden rectas'),
    ]),
  ],
  montaje: [
    d('ajuste', 'Para que no se note', [
      o('mt-luz', 'Misma luz', 'pay special attention to matching the light direction', 'prestá especial atención a igualar la dirección de la luz'),
      o('mt-sombras', 'Sombras al piso', 'add matching contact shadows', 'agregá sombras de contacto que coincidan'),
      o('mt-grano', 'Mismo grano', 'match the grain and sharpness of both images', 'igualá el grano y la nitidez de las dos imágenes'),
    ], { multi: true }),
  ],
  ropa: [
    d('ideas', 'Ideas de ropa', [
      o('rp-traje', 'Traje formal', 'a tailored formal suit', 'un traje formal a medida'),
      o('rp-casual', 'Casual', 'casual everyday clothes: jeans and a plain t-shirt', 'ropa casual de todos los días: jean y remera lisa'),
      o('rp-deportiva', 'Deportiva', 'sporty athletic wear', 'ropa deportiva'),
      o('rp-fiesta', 'De fiesta', 'an elegant evening outfit', 'un conjunto elegante de fiesta'),
      o('rp-invierno', 'De invierno', 'a warm winter coat and scarf', 'un abrigo de invierno y una bufanda'),
    ], { fillsTarget: true }),
  ],
  peinado: [
    d('corte', 'Corte', [
      o('pn-corto', 'Corto', 'a short haircut', 'un corte corto'),
      o('pn-largo', 'Largo suelto', 'long loose hair', 'pelo largo y suelto'),
      o('pn-recogido', 'Recogido', 'hair tied up in a neat bun', 'el pelo recogido en un rodete prolijo'),
      o('pn-rulos', 'Con rulos', 'voluminous curly hair', 'pelo con rulos y volumen'),
      o('pn-rapado', 'Rapado', 'a buzz cut', 'el pelo rapado'),
    ], { fillsTarget: true }),
    d('color', 'Color', [
      o('pc-rubio', 'Rubio', 'blonde', 'rubio', { demo: dot('#e8c872') }),
      o('pc-castano', 'Castaño', 'brown', 'castaño', { demo: dot('#6b4226') }),
      o('pc-negro', 'Negro', 'jet black', 'negro azabache', { demo: dot('#1a1a1a') }),
      o('pc-pelirrojo', 'Pelirrojo', 'copper red', 'pelirrojo cobrizo', { demo: dot('#b5562c') }),
      o('pc-canoso', 'Canoso', 'silver gray', 'gris plateado', { demo: dot('#c0c0c0') }),
      o('pc-fantasia', 'Fantasía', 'pastel pink and lilac', 'rosa y lila pastel', { demo: dot('#f7a8d8', '#c3a6ff') }),
    ], { fillsTarget: true }),
  ],
  expresion: [
    d('gesto', 'Gesto', [
      o('ex-sonrisa', 'Sonrisa natural', 'a natural, relaxed smile', 'una sonrisa natural y relajada'),
      o('ex-dientes', 'Sonrisa amplia', 'a big smile showing the teeth', 'una sonrisa amplia mostrando los dientes'),
      o('ex-serio', 'Serio y seguro', 'a calm, confident neutral expression', 'una expresión neutra, calma y segura'),
      o('ex-ojos', 'Ojos abiertos', 'open eyes looking at the camera (fix any blink)', 'los ojos abiertos mirando a cámara (corrigiendo un parpadeo)'),
    ], { fillsTarget: true }),
  ],
  edad: [
    d('cambio', 'Cambio', [
      o('ed-joven10', '10 años menos', 'about 10 years younger', 'unos 10 años más joven'),
      o('ed-nino', 'De chico', 'like a child of about 8 years old', 'como un chico de unos 8 años'),
      o('ed-mayor20', '20 años más', 'about 20 years older, with natural signs of age', 'unos 20 años mayor, con señales naturales de la edad'),
      o('ed-anciano', 'De anciano', 'like an elderly person of about 80, with gray hair and wrinkles', 'como una persona de unos 80 años, con canas y arrugas'),
    ], { fillsTarget: true }),
  ],
  estacion: [
    d('ideas', 'Ideas', [
      o('es-nieve', 'Invierno con nieve', 'a winter day with fresh snow on the ground', 'un día de invierno con nieve recién caída', { demo: dot('#e8f1f8', '#a9c6de') }),
      o('es-otono', 'Otoño', 'autumn, with orange leaves on the trees and the ground', 'otoño, con hojas naranjas en los árboles y en el piso', { demo: dot('#d9822b', '#8c4a2f') }),
      o('es-primavera', 'Primavera en flor', 'spring, with trees and plants in bloom', 'primavera, con árboles y plantas en flor', { demo: dot('#f7c6d9', '#9bd17a') }),
      o('es-verano', 'Verano soleado', 'a bright, sunny summer day', 'un día de verano luminoso y soleado', { demo: dot('#ffd166', '#4ea8de') }),
      o('es-lluvia', 'Lluvia', 'a rainy day with wet, reflective surfaces', 'un día de lluvia con superficies mojadas que reflejan', { demo: dot('#5c6b7a', '#9fb1c1') }),
      o('es-niebla', 'Niebla', 'a foggy morning with soft, misty light', 'una mañana de niebla con luz suave y brumosa', { demo: dot('#cfd6dc', '#eef1f3') }),
    ], { fillsTarget: true }),
  ],
  'angulo-camara': [
    d('vista', 'Vista', [
      o('av-arriba', 'Desde arriba', 'a high-angle view from above', 'una vista en picado, desde arriba'),
      o('av-abajo', 'Desde abajo', 'a low-angle view from below', 'una vista en contrapicado, desde abajo'),
      o('av-frente', 'De frente', 'a straight-on frontal view', 'una vista frontal, de frente'),
      o('av-perfil', 'De perfil', 'a side profile view', 'una vista de perfil'),
      o('av-tres-cuartos', 'Tres cuartos', 'a three-quarter view', 'una vista de tres cuartos'),
    ], { fillsTarget: true }),
  ],
  'retrato-pro': [
    d('fondo', 'Fondo', [
      o('rpf-gris', 'Gris de estudio', 'use a neutral gray studio backdrop', 'usá un fondo gris neutro de estudio', { demo: dot('#9aa0a6') }),
      o('rpf-blanco', 'Blanco', 'use a clean white backdrop', 'usá un fondo blanco limpio', { demo: dot('#ffffff') }),
      o('rpf-oficina', 'Oficina desenfocada', 'use a softly blurred modern office behind', 'usá de fondo una oficina moderna desenfocada', { demo: dot('#d9dde3', '#8a96a3'), meta: { allow: BLUR } }),
      o('rpf-color', 'Color de marca', 'use a solid color backdrop (color in the note)', 'usá un fondo de color liso (el color va en la nota)', { demo: dot('#6d4aff') }),
    ]),
    d('ropa', 'Ropa', [
      o('rpr-formal', 'Formal', 'formal suit or blazer', 'traje o saco formal'),
      o('rpr-smart', 'Elegante sport', 'smart casual: a blazer over a plain shirt', 'elegante sport: saco sobre una camisa lisa'),
      o('rpr-igual', 'La misma', 'keep the original clothing', 'mantené la ropa original'),
    ]),
  ],
  'producto-pro': [
    d('escena', 'Escena', [
      o('pp-blanco', 'Tienda online (blanco)', 'keep it on pure white, ready for an online store', 'dejalo sobre blanco puro, listo para una tienda online', { demo: dot('#ffffff') }),
      o('pp-marmol', 'Sobre mármol', 'instead place it on a white marble surface with soft daylight', 'en cambio, apoyalo sobre una superficie de mármol blanco con luz de día suave', { demo: dot('#eeeeee', '#bdbdbd') }),
      o('pp-madera', 'Sobre madera', 'instead place it on a warm wooden table', 'en cambio, apoyalo sobre una mesa de madera cálida', { demo: dot('#b07a4a', '#e0b88a') }),
      o('pp-color', 'Fondo de color', 'instead use a bold solid color backdrop that complements the product', 'en cambio, usá un fondo de color intenso que combine con el producto', { demo: dot('#ff6b5b', '#ffd166') }),
      o('pp-flotando', 'Flotando', 'make it float slightly with a soft shadow below', 'hacé que flote apenas, con una sombra suave debajo'),
      o('pp-uso', 'En uso', 'instead show it in a natural lifestyle scene, in use', 'en cambio, mostralo en uso, en una escena cotidiana'),
    ]),
  ],
  'boceto-real': [
    d('resultado', 'Resultado', [
      o('br-foto', 'Foto realista', 'as a photorealistic photo', 'como una foto realista'),
      o('br-3d', 'Render 3D', 'as a polished 3D render', 'como un render 3D prolijo'),
      o('br-ilustracion', 'Ilustración terminada', 'as a finished, fully colored illustration', 'como una ilustración terminada y a todo color'),
    ]),
  ],
  'color-selectivo': [
    d('color', 'Color que queda', [
      o('cs-rojo', 'Rojo', 'the red element', 'el elemento rojo', { demo: dot('#d62828') }),
      o('cs-amarillo', 'Amarillo', 'the yellow element', 'el elemento amarillo', { demo: dot('#ffd60a') }),
      o('cs-azul', 'Azul', 'the blue element', 'el elemento azul', { demo: dot('#1d4ed8') }),
      o('cs-verde', 'Verde', 'the green element', 'el elemento verde', { demo: dot('#2a9d8f') }),
      o('cs-sujeto', 'El sujeto principal', 'the main subject', 'el sujeto principal'),
    ], { fillsTarget: true }),
  ],
  envejecer: [
    d('marcas', 'Marcas del tiempo', [
      o('env-bordes', 'Bordes gastados', 'with worn, rounded edges', 'con bordes gastados y redondeados'),
      o('env-dobleces', 'Dobleces', 'with a visible fold crease', 'con la marca de un doblez'),
      o('env-rayas', 'Rayas', 'with fine scratches', 'con rayas finas'),
      o('env-limpia', 'Limpia, sin daños', 'clean and well preserved, with no damage', 'limpia y bien conservada, sin daños'),
    ], { multi: true, max: 2 }),
  ],
  'doble-exposicion': [
    d('imagen', 'Qué rellena la silueta', [
      o('dx-bosque', 'Bosque', 'a misty pine forest', 'un bosque de pinos con niebla', { demo: dot('#2d6a4f', '#d8f3dc') }),
      o('dx-ciudad', 'Ciudad', 'a city skyline at dusk', 'el perfil de una ciudad al atardecer', { demo: dot('#22223b', '#f2a65a') }),
      o('dx-mar', 'Mar y olas', 'ocean waves', 'olas del mar', { demo: dot('#0077b6', '#caf0f8') }),
      o('dx-montanas', 'Montañas', 'snowy mountains', 'montañas nevadas', { demo: dot('#6c757d', '#f8f9fa') }),
      o('dx-galaxia', 'Galaxia', 'a starry galaxy', 'una galaxia llena de estrellas', { demo: dot('#10002b', '#c77dff') }),
      o('dx-flores', 'Flores', 'blooming wildflowers', 'flores silvestres en flor', { demo: dot('#ff8fab', '#ffe5ec') }),
    ], { fillsTarget: true }),
  ],
  neon: [
    d('color', 'Color del neón', [
      o('neon-rosa', 'Rosa', 'in hot pink', 'en rosa fuerte', { demo: dot('#ff2e88') }),
      o('neon-celeste', 'Celeste', 'in electric cyan', 'en celeste eléctrico', { demo: dot('#00e5ff') }),
      o('neon-violeta', 'Violeta', 'in vivid purple', 'en violeta intenso', { demo: dot('#9d4edd') }),
      o('neon-verde', 'Verde', 'in acid green', 'en verde ácido', { demo: dot('#39ff14') }),
      o('neon-multi', 'Dos colores', 'in a pink-to-cyan gradient', 'en un degradado de rosa a celeste', { demo: dot('#ff2e88', '#00e5ff') }),
    ], { template: { en: 'the neon glow {value}', es: 'el neón {value}' } }),
    d('grosor', 'Grosor', [
      o('neon-fino', 'Fino', 'with a thin, precise line', 'con una línea fina y precisa'),
      o('neon-grueso', 'Grueso', 'with a thick, bold line', 'con una línea gruesa y marcada'),
    ]),
  ],
  dispersion: [
    d('hacia', 'Hacia dónde', [
      o('dp-derecha', 'A la derecha', 'drifting to the right', 'que se alejan hacia la derecha'),
      o('dp-izquierda', 'A la izquierda', 'drifting to the left', 'que se alejan hacia la izquierda'),
      o('dp-arriba', 'Hacia arriba', 'rising upward', 'que suben'),
    ]),
    d('particulas', 'Partículas', [
      o('dp-fragmentos', 'Fragmentos', 'as sharp shattered fragments', 'como fragmentos filosos'),
      o('dp-polvo', 'Polvo o arena', 'as fine dust and sand', 'como polvo fino y arena'),
      o('dp-chispas', 'Chispas', 'as glowing sparks', 'como chispas brillantes'),
      o('dp-pajaros', 'Pájaros', 'turning into a flock of small birds', 'convirtiéndose en una bandada de pájaros chicos'),
    ]),
  ],
  sticker: [
    d('borde', 'Borde', [
      o('st-grueso', 'Blanco grueso', 'keep the white border thick', 'mantené el borde blanco grueso'),
      o('st-fino', 'Blanco fino', 'make the white border thin instead', 'en cambio, que el borde blanco sea fino'),
    ]),
    d('estilo', 'Estilo', [
      o('st-foto', 'Foto tal cual', 'keep the subject photographic', 'mantené al sujeto como foto'),
      o('st-dibujo', 'Ilustrado', 'redraw the subject as a clean cartoon illustration', 'redibujá al sujeto como una ilustración de dibujo animado prolija'),
    ]),
  ],
  texto: [
    d('estilo', 'Estilo del texto', [
      o('tx-igual', 'Igual al existente', 'matching the existing typography in the image', 'igual a la tipografía que ya tiene la imagen'),
      o('tx-cartel', 'Cartel pintado', 'as hand-painted sign lettering', 'como letras de cartel pintado a mano'),
      o('tx-neon', 'Neón', 'as a glowing neon sign', 'como un cartel de neón encendido'),
      o('tx-3d', 'Letras 3D', 'as bold 3D letters', 'como letras 3D gruesas'),
      o('tx-tiza', 'Tiza en pizarra', 'as chalk lettering on a blackboard', 'como letras de tiza en un pizarrón'),
    ]),
  ],
};

// ---------------------------------------------------------------------------
// Generación: tipo de imagen y estilos
// ---------------------------------------------------------------------------

export const DETALLES_MEDIOS: Record<string, Detail[]> = {
  foto: [
    d('tipo', 'Tipo de foto', [
      o('fm-retrato', 'Retrato', 'portrait', 'de retrato'),
      o('fm-paisaje', 'Paisaje', 'landscape', 'de paisaje'),
      o('fm-producto', 'Producto', 'product', 'de producto'),
      o('fm-comida', 'Comida', 'food', 'gastronómica'),
      o('fm-calle', 'Calle', 'street', 'callejera'),
      o('fm-moda', 'Moda', 'fashion', 'de moda'),
    ]),
  ],
  ilustracion: [
    d('acabado', 'Acabado', [
      o('im-pintada', 'Pintada', 'digitally painted with soft brushwork', 'pintada digitalmente con pinceladas suaves'),
      o('im-lineal', 'Línea y color plano', 'with clean ink lines and flat colors', 'con líneas de tinta limpias y colores planos'),
      o('im-libro', 'Libro infantil', "like a children's book illustration", 'como una ilustración de libro infantil'),
      o('im-editorial', 'Editorial', 'like a magazine editorial illustration', 'como una ilustración editorial de revista'),
    ], { role: 'style' }),
  ],
  dibujo: [
    d('herramienta', 'Con qué', [
      o('dm-grafito', 'Lápiz grafito', 'in graphite pencil', 'en lápiz grafito'),
      o('dm-tinta', 'Tinta', 'in black ink with fine pen lines', 'en tinta negra con trazos finos de pluma'),
      o('dm-carbonilla', 'Carbonilla', 'in charcoal with smudged shadows', 'en carbonilla con sombras difuminadas'),
      o('dm-birome', 'Birome', 'in blue ballpoint pen', 'en birome azul'),
    ], { role: 'style' }),
  ],
  pintura: [
    d('tecnica', 'Técnica', [
      o('pm-oleo', 'Óleo', 'in oil paint', 'al óleo'),
      o('pm-acuarela', 'Acuarela', 'in watercolor', 'en acuarela'),
      o('pm-acrilico', 'Acrílico', 'in acrylic paint', 'en acrílico'),
      o('pm-gouache', 'Gouache', 'in gouache', 'en gouache'),
    ], { role: 'style' }),
  ],
  render3d: [
    d('look', 'Look del 3D', [
      o('3d-animacion', 'Película animada', 'in a stylized animated feature film look', 'con look estilizado de película animada'),
      o('3d-realista', 'Realista', 'photorealistic, with physically based materials', 'fotorrealista, con materiales físicos realistas'),
      o('3d-clay', 'Arcilla', 'as a matte clay render', 'como un render mate de arcilla'),
      o('3d-isometrico', 'Isométrico', 'as a cute isometric miniature', 'como una miniatura isométrica'),
    ], { role: 'style' }),
  ],
  vectorial: [
    d('acabado', 'Acabado', [
      o('vm-plano', 'Plano', 'with completely flat colors', 'con colores completamente planos'),
      o('vm-degradados', 'Con degradados', 'with subtle gradients', 'con degradados sutiles'),
      o('vm-lineal', 'Solo líneas', 'in a monoline outline style', 'en estilo lineal de trazo único'),
    ], { role: 'style' }),
  ],
  collage: [
    d('materiales', 'Materiales', [
      o('cm-revista', 'Recortes de revista', 'made of magazine cutouts', 'hecho con recortes de revista'),
      o('cm-papeles', 'Papeles de color', 'made of torn colored paper', 'hecho con papeles de color rasgados'),
      o('cm-fotos', 'Fotos antiguas', 'made of vintage photographs', 'hecho con fotos antiguas'),
    ], { multi: true, max: 2, role: 'style' }),
  ],
};

/** Para cualquier estilo visual: cuánto se nota. */
export const DETALLE_FUERZA_ESTILO = d('fuerza', 'Cuánto se nota el estilo', [
  o('fz-toque', 'Un toque', 'only as a subtle influence', 'solo como una influencia sutil'),
  o('fz-pleno', 'Bien marcado', 'fully committed to this style', 'con este estilo bien marcado'),
]);

export const DETALLES_ESTILOS: Record<string, Detail[]> = {
  anime: [
    d('epoca', 'Época', [
      o('an-90', 'Retro 90s', '1990s cel animation look', 'look de animación en acetato de los 90'),
      o('an-moderno', 'Moderno', 'modern, clean digital anime look', 'look de anime digital moderno y limpio'),
      o('an-pelicula', 'Película de anime', 'lush anime feature film look with painted backgrounds', 'look de película de anime, con fondos pintados'),
    ]),
  ],
  acuarela: [
    d('manera', 'Manera', [
      o('ac-suelta', 'Suelta y húmeda', 'loose wet-on-wet washes and soft bleeds', 'aguadas sueltas, húmedo sobre húmedo, con manchas que se mezclan'),
      o('ac-detallada', 'Precisa', 'precise, detailed watercolor with fine lines', 'acuarela precisa y detallada, con líneas finas'),
      o('ac-salpicada', 'Con salpicaduras', 'with paint splatters and visible paper', 'con salpicaduras y el papel a la vista'),
    ]),
  ],
  oleo: [
    d('pincelada', 'Pincelada', [
      o('ol-empaste', 'Empaste grueso', 'thick impasto brushstrokes', 'pinceladas gruesas con empaste'),
      o('ol-liso', 'Lisa, clásica', 'smooth, blended classical finish', 'acabado clásico, liso y fundido'),
    ]),
  ],
  pixel: [
    d('resolucion', 'Resolución', [
      o('px-8', '8 bits', '8-bit NES-style with a tiny palette', 'estilo 8 bits como NES, con muy pocos colores'),
      o('px-16', '16 bits', '16-bit SNES-style with richer shading', 'estilo 16 bits como SNES, con más sombreado'),
      o('px-hd', 'Pixel art moderno', 'modern high-detail pixel art with soft lighting', 'pixel art moderno y detallado, con luces suaves'),
    ]),
  ],
  comic: [
    d('escuela', 'Escuela', [
      o('cm-americano', 'Americano', 'American superhero comic style with bold inks', 'estilo cómic de superhéroes americano, con tinta marcada'),
      o('cm-europeo', 'Europeo (línea clara)', 'European ligne claire style with clean even lines', 'estilo europeo de línea clara, con trazos limpios y parejos'),
      o('cm-indie', 'Independiente', 'indie comic style with expressive hand-drawn lines', 'estilo cómic independiente, con trazos expresivos a mano'),
    ]),
  ],
  lowpoly: [
    d('acabado', 'Acabado', [
      o('lp-plano', 'Caras planas', 'flat-shaded faceted polygons', 'polígonos facetados con sombreado plano'),
      o('lp-suave', 'Con luz suave', 'with soft lighting and gentle gradients', 'con luz suave y degradados delicados'),
    ]),
  ],
  cyberpunk: [
    d('ambiente', 'Ambiente', [
      o('cy-lluvia', 'Lluvia y neón', 'rain-soaked streets reflecting neon signs', 'calles mojadas por la lluvia que reflejan carteles de neón'),
      o('cy-dia', 'De día, desértico', 'harsh daylight and dusty, sun-bleached megacity', 'luz de día dura y una megaciudad polvorienta y quemada por el sol'),
    ]),
  ],
  minimalista: [
    d('fondo', 'Fondo', [
      o('mn-blanco', 'Blanco', 'on an empty white background', 'sobre un fondo blanco vacío'),
      o('mn-color', 'Color pleno', 'on a single solid color background', 'sobre un fondo de un solo color'),
    ]),
  ],
  'fantasia-epica': [
    d('escala', 'Escala', [
      o('fe-paisaje', 'Paisaje enorme', 'vast landscape with tiny figures for scale', 'paisaje enorme con figuras diminutas que dan escala'),
      o('fe-heroe', 'Héroe en primer plano', 'heroic character in the foreground', 'un personaje heroico en primer plano'),
    ]),
  ],
};

// ---------------------------------------------------------------------------
// Pasos compartidos: luz, color, atmósfera, texturas, materiales, clima
// ---------------------------------------------------------------------------

/** Luces que ya traen su dirección o su contraste en el nombre. */
const LUZ_CON_DIRECCION = ['contraluz', 'rembrandt', 'split', 'mariposa', 'persiana', 'aro', 'flash', 'escenario', 'mediodia', 'claroscuro', 'clave-alta', 'clave-baja'];

export const DETALLES_LUZ: Detail[] = [
  d('direccion', 'De dónde viene', [
    o('ld-frente', 'De frente', 'coming from the front', 'que viene de frente'),
    o('ld-costado', 'De costado', 'coming from the side, sculpting the shapes', 'que viene de costado y marca los volúmenes'),
    o('ld-atras', 'Desde atrás', 'coming from behind, with a glowing rim', 'que viene desde atrás, con un borde luminoso'),
    o('ld-arriba', 'Desde arriba', 'coming from above', 'que viene desde arriba'),
  ], { except: LUZ_CON_DIRECCION }),
  d('sombras', 'Sombras', [
    o('ls-suaves', 'Suaves', 'with soft, gradual shadows', 'con sombras suaves y graduales'),
    o('ls-duras', 'Duras', 'with crisp, hard-edged shadows', 'con sombras duras y bien definidas'),
  ], { except: ['clave-alta', 'clave-baja', 'claroscuro', 'nublado', 'flash', 'mediodia', 'estudio'] }),
];

export const DETALLES_PALETA: Detail[] = [
  d('saturacion', 'Saturación', [
    o('sat-apagada', 'Apagada', 'muted and desaturated', 'apagada y desaturada'),
    o('sat-vibrante', 'Vibrante', 'rich and highly saturated', 'intensa y muy saturada'),
  ]),
  d('contraste', 'Contraste', [
    o('con-suave', 'Suave', 'with low contrast between the colors', 'con poco contraste entre los colores'),
    o('con-alto', 'Alto', 'with strong contrast between the colors', 'con mucho contraste entre los colores'),
  ]),
  d('proporcion', 'Reparto', [
    o('rep-60', '60-30-10', 'following the 60-30-10 rule: one dominant color, one secondary and a small accent', 'con la regla 60-30-10: un color dominante, uno secundario y un acento chico'),
    o('rep-acento', 'Un solo acento', 'mostly neutral with a single bright accent color', 'casi todo neutro, con un único color de acento'),
  ]),
];

export const DETALLES_ATMOSFERA: Detail[] = [
  d('intensidad', 'Intensidad', [
    o('at-sutil', 'Sutil', 'conveyed subtly', 'transmitida con sutileza'),
    o('at-intensa', 'Intensa', 'conveyed intensely', 'transmitida con intensidad'),
  ]),
];

export const DETALLES_TEXTURA: Detail[] = [
  d('intensidad', 'Cuánto se nota', [
    o('tx-sutil', 'Apenas', 'very subtle', 'muy sutil'),
    o('tx-marcada', 'Bien visible', 'clearly visible', 'bien visible'),
  ]),
];

export const DETALLES_MATERIAL: Detail[] = [
  d('acabado', 'Acabado', [
    o('mat-pulido', 'Pulido', 'polished and glossy', 'pulido y brillante'),
    o('mat-mate', 'Mate', 'with a matte, satin finish', 'con acabado mate satinado'),
    o('mat-gastado', 'Gastado', 'worn and weathered', 'gastado y envejecido'),
  ]),
];

export const DETALLES_CLIMA: Record<string, Detail[]> = {
  lluvia: [
    d('cantidad', 'Cuánta lluvia', [
      o('ll-llovizna', 'Llovizna', 'a light drizzle', 'una llovizna suave'),
      o('ll-fuerte', 'Lluvia fuerte', 'heavy pouring rain with visible streaks', 'lluvia fuerte con gotas visibles'),
    ]),
  ],
  nieve: [
    d('estado', 'La nieve', [
      o('nv-cayendo', 'Cayendo', 'snowflakes falling', 'copos cayendo'),
      o('nv-caida', 'Ya caída', 'a thick blanket of snow on the ground', 'una capa gruesa de nieve en el piso'),
    ], { multi: true }),
  ],
  niebla: [
    d('densidad', 'Densidad', [
      o('nb-leve', 'Leve', 'a light mist', 'una bruma leve'),
      o('nb-densa', 'Densa', 'a thick fog that hides the distance', 'una niebla densa que esconde lo lejano'),
    ]),
  ],
};

export const DETALLES_FILTROS: Record<string, Detail[]> = {
  vintage: [
    d('decada', 'Década', [
      o('vt-60', 'Años 60', 'like a 1960s print', 'como una copia de los 60'),
      o('vt-70', 'Años 70', 'like a 1970s print', 'como una copia de los 70'),
      o('vt-80', 'Años 80', 'like a 1980s print', 'como una copia de los 80'),
    ]),
  ],
  pelicula: [
    d('grano', 'Grano', [
      o('pl-fino', 'Fino', 'fine grain', 'grano fino'),
      o('pl-marcado', 'Marcado', 'heavy, visible grain', 'grano grueso y visible'),
    ]),
  ],
  bn: [
    d('contraste', 'Contraste', [
      o('bn-suave', 'Suave', 'soft, gentle contrast', 'contraste suave'),
      o('bn-duro', 'Duro', 'hard, punchy contrast', 'contraste duro'),
    ]),
  ],
  glitch: [
    d('cuanto', 'Cuánto glitch', [
      o('gl-leve', 'Leve', 'with only a few subtle glitches', 'con apenas algunas fallas sutiles'),
      o('gl-fuerte', 'Fuerte', 'with heavy datamoshing and corrupted blocks', 'con mucha distorsión y bloques corruptos'),
    ]),
  ],
};

// ---------------------------------------------------------------------------
// Diseño
// ---------------------------------------------------------------------------

export const DETALLES_PIEZAS: Record<string, Detail[]> = {
  icono: [
    d('plataforma', 'Para dónde', [
      o('ic-ios', 'App de iPhone', 'as an iOS app icon in a rounded square', 'como ícono de app de iPhone, en un cuadrado redondeado'),
      o('ic-android', 'App de Android', 'as an Android adaptive icon', 'como ícono adaptable de Android'),
      o('ic-favicon', 'Favicon web', 'simple enough to read as a tiny favicon', 'tan simple que se lea como un favicon diminuto'),
    ], { role: 'setting' }),
  ],
  post: [
    d('red', 'Red social', [
      o('pr-instagram', 'Instagram', 'for Instagram', 'para Instagram'),
      o('pr-linkedin', 'LinkedIn', 'for LinkedIn, with a professional tone', 'para LinkedIn, con tono profesional'),
      o('pr-facebook', 'Facebook', 'for Facebook', 'para Facebook'),
    ], { role: 'setting' }),
    d('objetivo', 'Objetivo', [
      o('po-promo', 'Promoción', 'announcing a promotion or discount', 'para anunciar una promoción o descuento'),
      o('po-lanzamiento', 'Lanzamiento', 'announcing a new product launch', 'para anunciar el lanzamiento de un producto'),
      o('po-evento', 'Evento', 'announcing an event', 'para anunciar un evento'),
      o('po-frase', 'Frase o tip', 'sharing a quote or a tip', 'para compartir una frase o un consejo'),
    ], { role: 'setting' }),
  ],
  historia: [
    d('objetivo', 'Objetivo', [
      o('ho-promo', 'Promoción', 'announcing a promotion', 'para anunciar una promoción'),
      o('ho-encuesta', 'Encuesta o pregunta', 'leaving room for an interactive poll sticker', 'dejando lugar para un sticker de encuesta'),
      o('ho-novedad', 'Novedad', 'sharing a piece of news', 'para contar una novedad'),
    ], { role: 'setting' }),
  ],
  miniatura: [
    d('recursos', 'Recursos que funcionan', [
      o('mn-cara', 'Cara expresiva', 'a person with an exaggerated, expressive face', 'una persona con la cara muy expresiva'),
      o('mn-flechas', 'Flechas y círculos', 'bold arrows and circles pointing at the key detail', 'flechas y círculos marcados que señalan el detalle clave'),
      o('mn-contraste', 'Mucho contraste', 'very high contrast so it stands out among other thumbnails', 'mucho contraste para que se destaque entre otras miniaturas'),
    ], { multi: true, role: 'setting' }),
  ],
  invitacion: [
    d('evento', 'Evento', [
      o('inv-cumple', 'Cumpleaños', 'for a birthday party', 'para un cumpleaños'),
      o('inv-boda', 'Casamiento', 'for a wedding', 'para un casamiento'),
      o('inv-bebe', 'Baby shower', 'for a baby shower', 'para un baby shower'),
      o('inv-infantil', 'Fiesta infantil', "for a children's party", 'para una fiesta infantil'),
      o('inv-empresa', 'Evento de empresa', 'for a corporate event', 'para un evento de empresa'),
    ], { role: 'setting' }),
  ],
  'portada-libro': [
    d('genero', 'Género', [
      o('pl-romance', 'Romántica', 'for a romance novel', 'para una novela romántica'),
      o('pl-thriller', 'Suspenso', 'for a thriller', 'para una novela de suspenso'),
      o('pl-fantasia', 'Fantasía', 'for a fantasy novel', 'para una novela de fantasía'),
      o('pl-infantil', 'Infantil', "for a children's book", 'para un libro infantil'),
      o('pl-ensayo', 'No ficción', 'for a non-fiction book', 'para un libro de no ficción'),
    ], { role: 'setting' }),
  ],
  'portada-album': [
    d('genero', 'Género musical', [
      o('pa-rock', 'Rock', 'for a rock album', 'para un disco de rock'),
      o('pa-electronica', 'Electrónica', 'for an electronic music album', 'para un disco de música electrónica'),
      o('pa-urbano', 'Urbano / trap', 'for a hip-hop or trap album', 'para un disco de hip hop o trap'),
      o('pa-indie', 'Indie / folk', 'for an indie folk album', 'para un disco indie folk'),
      o('pa-jazz', 'Jazz', 'for a jazz album', 'para un disco de jazz'),
    ], { role: 'setting' }),
  ],
  etiqueta: [
    d('producto', 'Producto', [
      o('et-vino', 'Vino', 'for a wine bottle', 'para una botella de vino'),
      o('et-cerveza', 'Cerveza', 'for a craft beer can', 'para una lata de cerveza artesanal'),
      o('et-frasco', 'Frasco', 'for a jar of homemade preserves', 'para un frasco de dulce casero'),
      o('et-cafe', 'Café', 'for a coffee bag', 'para una bolsa de café'),
      o('et-cosmetica', 'Cosmética', 'for a cosmetics bottle', 'para un frasco de cosmética'),
    ], { role: 'setting' }),
  ],
  remera: [
    d('estampado', 'Cómo se estampa', [
      o('rm-serigrafia', 'Serigrafía', 'designed for screen printing, with 2 to 3 flat colors', 'pensado para serigrafía, con 2 o 3 colores planos'),
      o('rm-color', 'A todo color', 'designed for full-color DTF printing', 'pensado para estampa DTF a todo color'),
      o('rm-bordado', 'Bordado', 'designed to be embroidered, with simple shapes', 'pensado para bordar, con formas simples'),
    ], { role: 'setting' }),
  ],
  patron: [
    d('escala', 'Escala', [
      o('pt-chico', 'Chico y denso', 'with small, densely packed motifs', 'con motivos chicos y apretados'),
      o('pt-grande', 'Grande y aireado', 'with large, widely spaced motifs', 'con motivos grandes y espaciados'),
    ], { role: 'setting' }),
  ],
  infografia: [
    d('tipo', 'Tipo', [
      o('if-pasos', 'Paso a paso', 'showing a step-by-step process', 'que muestra un proceso paso a paso'),
      o('if-comparacion', 'Comparación', 'comparing two options side by side', 'que compara dos opciones lado a lado'),
      o('if-linea', 'Línea de tiempo', 'as a timeline', 'como una línea de tiempo'),
      o('if-datos', 'Datos y números', 'highlighting key statistics with simple charts', 'que destaca datos clave con gráficos simples'),
    ], { role: 'setting' }),
  ],
  web: [
    d('seccion', 'Qué pantalla', [
      o('wb-landing', 'Portada (landing)', 'showing a landing page hero section', 'que muestra la portada de una landing'),
      o('wb-tienda', 'Tienda', 'showing an online store product grid', 'que muestra la grilla de productos de una tienda'),
      o('wb-portfolio', 'Portfolio', 'showing a portfolio gallery', 'que muestra la galería de un portfolio'),
    ], { role: 'setting' }),
  ],
  'fondo-pantalla': [
    d('dispositivo', 'Para', [
      o('fp-celular', 'Celular', 'for a phone lock screen, leaving the top area clear for the clock', 'para la pantalla de bloqueo del celular, con la parte de arriba despejada para el reloj'),
      o('fp-compu', 'Compu', 'for a desktop, keeping the center calm behind the icons', 'para la compu, con el centro tranquilo detrás de los íconos'),
    ], { role: 'setting' }),
  ],
};

export const DETALLES_TIPOS_LOGO: Record<string, Detail[]> = {
  mascota: [
    d('caracter', 'Carácter', [
      o('ms-tierna', 'Tierna', 'cute and friendly', 'tierna y amigable'),
      o('ms-deportiva', 'Deportiva', 'bold and fierce, like a sports team mascot', 'audaz y feroz, como la mascota de un equipo'),
      o('ms-simpatica', 'Simpática y retro', 'charming retro cartoon style', 'simpática, con estilo de dibujo animado retro'),
    ]),
  ],
  emblema: [
    d('forma', 'Forma', [
      o('em-circulo', 'Círculo', 'inside a circular badge', 'dentro de una insignia circular'),
      o('em-escudo', 'Escudo', 'inside a shield', 'dentro de un escudo'),
      o('em-sello', 'Sello', 'like a vintage stamp seal', 'como un sello antiguo'),
    ]),
  ],
};

/** Para cualquier tipografía elegida: peso, mayúsculas y espaciado. */
export const DETALLES_TIPOGRAFIA: Detail[] = [
  d('peso', 'Grosor', [
    o('tp-fina', 'Fina', 'in a light weight', 'en peso fino'),
    o('tp-regular', 'Normal', 'in a regular weight', 'en peso normal'),
    o('tp-negrita', 'Negrita', 'in a bold weight', 'en negrita'),
    o('tp-black', 'Extra gruesa', 'in an extra-bold black weight', 'en peso extra grueso'),
  ], { except: ['extra-negrita', 'inflada', 'contorno', 'neon-tipo', 'pixel'] }),
  d('caja', 'Mayúsculas', [
    o('tc-mayus', 'Todo en mayúsculas', 'set in all caps', 'todo en mayúsculas'),
    o('tc-minus', 'Todo en minúsculas', 'set in all lowercase', 'todo en minúsculas'),
    o('tc-normal', 'Normal', 'in sentence case', 'con mayúscula inicial'),
  ]),
  d('espaciado', 'Espaciado', [
    o('te-apretado', 'Apretado', 'with tight letter spacing', 'con las letras apretadas'),
    o('te-amplio', 'Amplio', 'with wide letter spacing', 'con las letras bien separadas'),
  ]),
];

export const DETALLES_ELEMENTOS: Record<string, Detail[]> = {
  'e-formas': [
    d('formas', 'Formas', [
      o('ef-circulos', 'Círculos', 'circles', 'círculos'),
      o('ef-triangulos', 'Triángulos', 'triangles', 'triángulos'),
      o('ef-cuadrados', 'Cuadrados', 'squares and rectangles', 'cuadrados y rectángulos'),
      o('ef-ondas', 'Ondas', 'wavy lines', 'líneas onduladas'),
    ], { multi: true, max: 2, template: { en: 'mainly {value}', es: 'sobre todo {value}' } }),
  ],
  'e-lineas': [
    d('grosor', 'Grosor', [
      o('el-finas', 'Finas', 'thin and delicate', 'finas y delicadas'),
      o('el-gruesas', 'Gruesas', 'thick and bold', 'gruesas y marcadas'),
    ]),
  ],
};

export const DETALLES_FONDOS: Record<string, Detail[]> = {
  'f-textura': [
    d('textura', 'Textura', [
      o('ft-papel', 'Papel', 'of recycled paper', 'de papel reciclado'),
      o('ft-concreto', 'Concreto', 'of raw concrete', 'de concreto'),
      o('ft-tela', 'Tela', 'of linen fabric', 'de tela de lino'),
      o('ft-madera', 'Madera', 'of light wood', 'de madera clara'),
    ]),
  ],
  'f-degradado': [
    d('tipo', 'Tipo', [
      o('fd-suave', 'Suave', 'soft and subtle', 'suave y sutil'),
      o('fd-vibrante', 'Vibrante', 'bold and vibrant', 'intenso y vibrante'),
      o('fd-radial', 'Radial', 'radial, glowing from the center', 'radial, que brilla desde el centro'),
    ]),
  ],
};
