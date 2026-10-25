/**
 * Íconos de la vista previa: qué dibujo representa cada cosa que escribe el usuario.
 * Las claves van sin tildes y en singular; el buscador acepta plurales y diminutivos ("gatitos" → gato).
 */
export const SUBJECT_GLYPHS: Record<string, string> = {
  // Personas
  persona: '🧑', gente: '🧑‍🤝‍🧑', mujer: '👩', hombre: '👨', chica: '👧', chico: '👦', nena: '👧', nene: '👦', nino: '🧒', nina: '👧',
  bebe: '👶', abuela: '👵', abuelo: '👴', senora: '👩', senor: '👨', pareja: '💑', familia: '👪', novia: '👰', novio: '🤵',
  yo: '🧑', amigo: '🧑', amiga: '👩', hermana: '👩', hermano: '👨', mama: '👩', papa: '👨', modelo: '🧍', retrato: '🧑',
  astronauta: '🧑‍🚀', veterinaria: '🧑‍⚕️', veterinario: '🧑‍⚕️', medico: '🧑‍⚕️', medica: '🧑‍⚕️', doctor: '🧑‍⚕️', doctora: '🧑‍⚕️',
  enfermera: '🧑‍⚕️', chef: '🧑‍🍳', cocinero: '🧑‍🍳', cocinera: '🧑‍🍳', bombero: '🧑‍🚒', policia: '👮', cientifico: '🧑‍🔬',
  cientifica: '🧑‍🔬', artista: '🧑‍🎨', pintor: '🧑‍🎨', pintora: '🧑‍🎨', musico: '🧑‍🎤', cantante: '🧑‍🎤', rapero: '🧑‍🎤',
  futbolista: '⚽', bailarina: '💃', bailarin: '🕺', surfista: '🏄', skater: '🛹', ciclista: '🚴', corredor: '🏃', corredora: '🏃‍♀️',
  programador: '🧑‍💻', programadora: '🧑‍💻', estudiante: '🧑‍🎓', maestra: '🧑‍🏫', maestro: '🧑‍🏫', granjero: '🧑‍🌾', jardinero: '🧑‍🌾',
  piloto: '🧑‍✈️', detective: '🕵️', espia: '🕵️', soldado: '💂', samurai: '🥷', ninja: '🥷', guerrero: '⚔️', guerrera: '⚔️',
  caballero: '🛡️', princesa: '👸', principe: '🤴', rey: '🤴', reina: '👸', mago: '🧙', maga: '🧙‍♀️', bruja: '🧙‍♀️', hada: '🧚',
  sirena: '🧜‍♀️', vampiro: '🧛', zombi: '🧟', zombie: '🧟', superheroe: '🦸', superheroina: '🦸‍♀️', heroe: '🦸', villano: '🦹',
  pirata: '🏴‍☠️', vaquero: '🤠', payaso: '🤡', fantasma: '👻', alien: '👽', extraterrestre: '👽', monstruo: '👾', robot: '🤖',
  androide: '🤖', cyborg: '🤖', calavera: '💀', esqueleto: '💀', angel: '👼', demonio: '😈', elfo: '🧝', duende: '🧝', genio: '🧞',
  // Animales
  gato: '🐱', perro: '🐶', cachorro: '🐶', zorro: '🦊', lobo: '🐺', leon: '🦁', tigre: '🐯', oso: '🐻', panda: '🐼', koala: '🐨',
  conejo: '🐰', raton: '🐭', hamster: '🐹', mono: '🐵', gorila: '🦍', caballo: '🐴', unicornio: '🦄', cebra: '🦓', vaca: '🐮',
  cerdo: '🐷', chancho: '🐷', oveja: '🐑', cabra: '🐐', gallina: '🐔', pollito: '🐤', pato: '🦆', cisne: '🦢', pajaro: '🐦',
  buho: '🦉', lechuza: '🦉', aguila: '🦅', loro: '🦜', flamenco: '🦩', pavo: '🦚', pinguino: '🐧', pez: '🐟', tiburon: '🦈',
  ballena: '🐋', delfin: '🐬', pulpo: '🐙', medusa: '🪼', cangrejo: '🦀', tortuga: '🐢', rana: '🐸', serpiente: '🐍', lagarto: '🦎',
  cocodrilo: '🐊', dinosaurio: '🦖', dragon: '🐉', mariposa: '🦋', abeja: '🐝', hormiga: '🐜', arana: '🕷️', caracol: '🐌',
  elefante: '🐘', jirafa: '🦒', camello: '🐫', llama: '🦙', canguro: '🦘', ciervo: '🦌', ardilla: '🐿️', erizo: '🦔', murcielago: '🦇',
  carpincho: '🦫', capibara: '🦫', perezoso: '🦥', nutria: '🦦', mapache: '🦝', fenix: '🐦‍🔥', mascota: '🐾', animal: '🐾',
  // Naturaleza
  flor: '🌸', rosa: '🌹', girasol: '🌻', tulipan: '🌷', arbol: '🌳', pino: '🌲', palmera: '🌴', cactus: '🌵', hongo: '🍄',
  planta: '🪴', hoja: '🍃', bosque: '🌲', montana: '⛰️', volcan: '🌋', isla: '🏝️', playa: '🏖️', ola: '🌊', mar: '🌊',
  cascada: '💧', lago: '🏞️', rio: '🏞️', paisaje: '🏞️', desierto: '🏜️', cielo: '☁️', nube: '☁️', arcoiris: '🌈', sol: '☀️',
  luna: '🌙', estrella: '⭐', planeta: '🪐', galaxia: '🌌', tierra: '🌍', mundo: '🌍', fuego: '🔥', rayo: '⚡', copo: '❄️',
  // Lugares y construcciones
  castillo: '🏰', palacio: '🏯', templo: '⛩️', iglesia: '⛪', casa: '🏠', cabana: '🛖', edificio: '🏢', rascacielos: '🏙️',
  ciudad: '🏙️', pueblo: '🏘️', calle: '🛣️', puente: '🌉', torre: '🗼', faro: '🗼', ruinas: '🏛️', estadio: '🏟️', fabrica: '🏭',
  tienda: '🏪', cafeteria: '☕', restaurante: '🍽️', escuela: '🏫', hospital: '🏥', habitacion: '🛏️', cocina: '🍳', biblioteca: '📚',
  // Vehículos
  auto: '🚗', coche: '🚗', carro: '🚗', taxi: '🚕', colectivo: '🚌', camion: '🚚', moto: '🏍️', bicicleta: '🚲', bici: '🚲',
  tren: '🚂', avion: '✈️', helicoptero: '🚁', cohete: '🚀', nave: '🛸', ovni: '🛸', barco: '⛵', velero: '⛵', submarino: '🚢',
  globo: '🎈', patineta: '🛹', tractor: '🚜',
  // Comida y bebida
  taza: '☕', cafe: '☕', te: '🍵', hamburguesa: '🍔', pizza: '🍕', torta: '🎂', pastel: '🍰', helado: '🍦', dona: '🍩',
  galleta: '🍪', chocolate: '🍫', fruta: '🍓', frutilla: '🍓', manzana: '🍎', banana: '🍌', palta: '🥑', aguacate: '🥑',
  sushi: '🍣', ramen: '🍜', tacos: '🌮', empanada: '🥟', pan: '🍞', medialuna: '🥐', queso: '🧀', vino: '🍷', cerveza: '🍺',
  coctel: '🍹', trago: '🍸', jugo: '🧃', comida: '🍽️', plato: '🍽️', miel: '🍯', limonada: '🍋',
  // Objetos y productos
  perfume: '🧴', frasco: '🫙', botella: '🍾', crema: '🧴', zapatilla: '👟', zapato: '👞', reloj: '⌚', anillo: '💍', collar: '📿',
  bolso: '👜', cartera: '👜', mochila: '🎒', sombrero: '🎩', gorra: '🧢', anteojos: '🕶️', vestido: '👗', remera: '👕',
  libro: '📚', guitarra: '🎸', piano: '🎹', bateria: '🥁', microfono: '🎤', camara: '📷', telefono: '📱', celular: '📱',
  computadora: '💻', notebook: '💻', auriculares: '🎧', consola: '🎮', joystick: '🎮', lampara: '💡', vela: '🕯️', llave: '🔑',
  corona: '👑', espada: '🗡️', escudo: '🛡️', diamante: '💎', joya: '💎', regalo: '🎁', corazon: '❤️', trofeo: '🏆', pelota: '⚽',
  juguete: '🧸', peluche: '🧸', muneco: '🧸', silla: '🪑', sillon: '🛋️', mesa: '🪑', planta_interior: '🪴', maceta: '🪴',
  producto: '📦', caja: '📦', lata: '🥫', pocion: '🧪', mapa: '🗺️', reloj_arena: '⏳', calabaza: '🎃', arbolito: '🎄',
  // Diseño
  logo: '🔷', marca: '🔷', fiesta: '🪩', concierto: '🎤', festival: '🎪', boda: '💍', casamiento: '💍', cumpleanos: '🎂',
  promo: '🏷️', promocion: '🏷️', oferta: '🏷️', panaderia: '🥐', pizzeria: '🍕', banda: '🎸', podcast: '🎙️', video: '▶️',
  receta: '🍳', jazz: '🎷', rock: '🎸', disco: '💿', album: '💿', arquitecta: '📐', arquitecto: '📐', abogada: '⚖️', abogado: '⚖️',
};

/** Lugares: el ícono que decora el fondo, el color del suelo y si el cielo es de noche. */
export interface Place {
  props: string[];
  ground?: string;
  night?: boolean;
  /** Sin suelo: el sujeto flota (espacio, cielo, agua profunda). */
  float?: boolean;
}

export const PLACES: Record<string, Place> = {
  playa: { props: ['🌴', '🌊'], ground: '#f2d49b' },
  mar: { props: ['🌊', '⛵'], ground: '#2a6f97' },
  oceano: { props: ['🌊', '🐠'], ground: '#1d4e89' },
  bosque: { props: ['🌲', '🌳', '🌲'], ground: '#2d6a4f' },
  selva: { props: ['🌴', '🌿', '🦜'], ground: '#1b5e20' },
  jungla: { props: ['🌴', '🌿', '🦜'], ground: '#1b5e20' },
  jardin: { props: ['🌷', '🌳'], ground: '#74c69d' },
  parque: { props: ['🌳', '🌷'], ground: '#74c69d' },
  campo: { props: ['🌾', '🌻'], ground: '#a7c957' },
  granja: { props: ['🌾', '🏡'], ground: '#a7c957' },
  pradera: { props: ['🌼', '🌾'], ground: '#95d5b2' },
  montana: { props: ['⛰️', '🏔️'], ground: '#6b705c' },
  montanas: { props: ['🏔️', '⛰️'], ground: '#6b705c' },
  acantilado: { props: ['⛰️', '🌊'], ground: '#6b705c' },
  volcan: { props: ['🌋'], ground: '#3d2b1f' },
  desierto: { props: ['🌵', '🐪'], ground: '#e9c46a' },
  nieve: { props: ['🏔️', '🌲'], ground: '#f1f5f9' },
  hielo: { props: ['🧊', '🏔️'], ground: '#dbeafe' },
  lago: { props: ['🏞️', '🌲'], ground: '#457b9d' },
  rio: { props: ['🏞️'], ground: '#457b9d' },
  cascada: { props: ['💧', '🌿'], ground: '#2d6a4f' },
  isla: { props: ['🏝️', '🌊'], ground: '#2a9d8f' },
  cueva: { props: ['🪨', '🕯️'], ground: '#3d3d3d', night: true },
  ciudad: { props: ['🏙️', '🏢'], ground: '#4a4e69' },
  calle: { props: ['🏢', '🚕'], ground: '#4a4e69' },
  callejon: { props: ['🏢', '🗑️'], ground: '#2b2d42' },
  pueblo: { props: ['🏘️', '⛪'], ground: '#bc8a5f' },
  plaza: { props: ['⛲', '🌳'], ground: '#adb5bd' },
  castillo: { props: ['🏰'], ground: '#6b705c' },
  ruinas: { props: ['🏛️'], ground: '#b08968' },
  templo: { props: ['⛩️'], ground: '#b08968' },
  espacio: { props: ['🪐', '✨', '🌍'], night: true, float: true },
  galaxia: { props: ['🌌', '✨'], night: true, float: true },
  luna: { props: ['🌍', '✨'], ground: '#adb5bd', night: true },
  marte: { props: ['🪐'], ground: '#c1440e' },
  planeta: { props: ['🪐', '✨'], ground: '#7b2cbf', night: true },
  cielo: { props: ['☁️', '☁️'], float: true },
  nubes: { props: ['☁️', '☁️'], float: true },
  cocina: { props: ['🍳', '🪴'], ground: '#ddb892' },
  living: { props: ['🛋️', '🪴'], ground: '#ddb892' },
  habitacion: { props: ['🛏️', '🪴'], ground: '#ddb892' },
  cuarto: { props: ['🛏️', '🖼️'], ground: '#ddb892' },
  oficina: { props: ['💻', '🪴'], ground: '#adb5bd' },
  estudio: { props: ['💡'], ground: '#e9ecef' },
  biblioteca: { props: ['📚', '🕯️'], ground: '#7f5539' },
  cafe: { props: ['☕', '🪴'], ground: '#9c6644' },
  cafeteria: { props: ['☕', '🥐'], ground: '#9c6644' },
  bar: { props: ['🍸', '💡'], ground: '#3d2b1f' },
  restaurante: { props: ['🍽️', '🕯️'], ground: '#9c6644' },
  mercado: { props: ['🍎', '🧺'], ground: '#bc8a5f' },
  escenario: { props: ['🎤', '💡'], ground: '#1a1a2e' },
  estadio: { props: ['🏟️'], ground: '#2d6a4f' },
  mesa: { props: ['🪴'], ground: '#b08968' },
  agua: { props: ['🌊'], ground: '#2a6f97' },
  submarino: { props: ['🐠', '🫧'], ground: '#03256c', float: true },
  arrecife: { props: ['🐠', '🪸'], ground: '#03256c', float: true },
  tokio: { props: ['🗼', '🏙️'], ground: '#4a4e69' },
  paris: { props: ['🗼'], ground: '#adb5bd' },
};

/** Silueta del fondo (montañas, edificios, olas…) que dibuja la vista previa detrás del sujeto. */
export type Backdrop = 'hills' | 'city' | 'mountains' | 'forest' | 'sea' | 'dunes' | 'room' | 'space' | 'snow' | 'stage' | 'clouds';

export const SCENERY: Record<string, Backdrop> = {
  playa: 'sea', mar: 'sea', oceano: 'sea', isla: 'sea', acantilado: 'sea', agua: 'sea', lago: 'forest', rio: 'forest',
  bosque: 'forest', selva: 'forest', jungla: 'forest', cascada: 'forest', jardin: 'hills', parque: 'hills', campo: 'hills',
  granja: 'hills', pradera: 'hills', montana: 'mountains', montanas: 'mountains', volcan: 'mountains', castillo: 'mountains',
  desierto: 'dunes', marte: 'dunes', ruinas: 'dunes', templo: 'mountains', nieve: 'snow', hielo: 'snow',
  ciudad: 'city', calle: 'city', callejon: 'city', pueblo: 'city', plaza: 'city', tokio: 'city', paris: 'city',
  espacio: 'space', galaxia: 'space', luna: 'space', planeta: 'space', cielo: 'clouds', nubes: 'clouds',
  cocina: 'room', living: 'room', habitacion: 'room', cuarto: 'room', oficina: 'room', biblioteca: 'room', cafe: 'room',
  cafeteria: 'room', bar: 'room', restaurante: 'room', mercado: 'city', mesa: 'room', cueva: 'mountains',
  estudio: 'stage', escenario: 'stage', estadio: 'stage', submarino: 'sea', arrecife: 'sea',
};

/** Ícono del tipo de pieza de diseño cuando no trae uno propio. */
export const PIECE_GLYPHS: Record<string, string> = {
  logo: '🔷', icono: '📱', post: '🖼️', historia: '📲', flyer: '📄', poster: '🪧', 'portada-libro': '📕', 'portada-album': '💿',
  miniatura: '▶️', banner: '🧾', tarjeta: '💳', sticker: '🏷️', menu: '🍽️', invitacion: '💌', infografia: '📊', remera: '👕',
  patron: '🔁', 'fondo-pantalla': '📱', web: '🌐', podcast: '🎙️', etiqueta: '🏷️',
};

/** Ícono del tipo de imagen en Generación (los que no tienen uno en su ejemplo). */
export const MEDIUM_GLYPHS: Record<string, string> = {
  foto: '📷', ilustracion: '🖍️', pintura: '🎨', dibujo: '✏️', render3d: '🧊', vectorial: '📐', 'arte-conceptual': '🌄', collage: '✂️',
  escultura: '🗿',
};

/** Ícono de cada operación de edición. */
export const OPERATION_GLYPHS: Record<string, string> = {
  'quitar-objeto': '🧽', 'quitar-fondo': '✂️', 'cambiar-fondo': '🖼️', 'desenfocar-fondo': '🌫️', 'cambiar-cielo': '🌅', agregar: '➕',
  cambiar: '🔁', mover: '↔️', estilo: '🎨', filtro: '🎞️', reiluminar: '💡', retoque: '✨', 'retrato-pro': '👔', restaurar: '🩹',
  colorear: '🖍️', expandir: '↔️', mejorar: '🔎', ampliar: '🔍', desmovida: '📸', exposicion: '☀️', enderezar: '📐', montaje: '🧩',
  ropa: '👕', peinado: '💇', expresion: '😊', edad: '⏳', estacion: '🍂', 'angulo-camara': '🎥', 'producto-pro': '🛍️',
  'boceto-real': '✏️', duotono: '🌗', 'color-selectivo': '🎯', envejecer: '📜', 'poster-trap': '🔥', 'doble-exposicion': '👥',
  neon: '💫', dispersion: '💨', sticker: '🏷️', texto: '🔤', 'quitar-gente': '🚶', 'quitar-cables': '🔌', 'quitar-reflejos': '🕶️',
  'abrir-ojos': '👁️', recolorear: '🎨', 'hora-dia': '🌗', 'agregar-particulas': '✨', 'sombra-real': '🌑', 'reflejo-agua': '💧',
  staging: '🛋️', ordenar: '🧹', 'pintar-pared': '🖌️', muneco: '🧸', 'viaje-tiempo': '⏰', 'afiche-cine': '🎬', scrapbook: '📒',
  movimiento: '💨', 'y2k-camcorder': '📼', 'para-colorear': '🖍️', pixelar: '👾', caricatura: '🤪', maquillaje: '💄',
  'mockup-diseno': '👕', 'producto-escena': '🪴',
};
