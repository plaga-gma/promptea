import type { Option, Step } from '../../../engine/types';
import { img, o } from './_helpers';

/** Tipo de imagen (medio). Primer bloque del prompt de generación. */
export const MEDIOS: Option[] = [
  o('foto', 'Fotografía', 'a photograph', 'una fotografía', {
    hint: 'Imagen realista, como sacada con una cámara.',
    demo: img('Fotografía de ejemplo', ['#5b6b7a', '#d9c7a7']),
    meta: { literal: true },
  }),
  o('ilustracion', 'Ilustración digital', 'a digital illustration', 'una ilustración digital', {
    hint: 'Dibujo hecho en computadora: libre, colorido y expresivo.',
    demo: img('Ilustración digital de ejemplo', ['#ff8a5b', '#6d4aff']),
  }),
  o('pintura', 'Pintura', 'a painting', 'una pintura', {
    hint: 'Aspecto de obra pintada a mano, con pinceladas.',
    demo: img('Pintura de ejemplo', ['#9c6b3e', '#2f4858']),
  }),
  o('dibujo', 'Dibujo', 'a hand-drawn sketch', 'un boceto dibujado a mano', {
    hint: 'Lápiz, tinta o carbonilla sobre papel.',
    demo: img('Dibujo de ejemplo', ['#f2efe9', '#3a3a3a']),
  }),
  o('render3d', 'Render 3D', 'a 3D render', 'un render 3D', {
    hint: 'Objetos con volumen, como en una película animada o un videojuego.',
    demo: img('Render 3D de ejemplo', ['#7fd1f7', '#3c2a7d']),
  }),
  o('vectorial', 'Ilustración vectorial', 'a flat vector illustration', 'una ilustración vectorial plana', {
    hint: 'Formas limpias y colores planos. Ideal para web, íconos e infografías.',
    demo: img('Ilustración vectorial de ejemplo', ['#ffd166', '#06d6a0']),
  }),
  o('arte-conceptual', 'Arte conceptual', 'a piece of concept art', 'una pieza de arte conceptual', {
    hint: 'Escenas épicas de mundos y personajes, como en el diseño de cine y videojuegos.',
    demo: img('Arte conceptual de ejemplo', ['#1f2a44', '#e0a458']),
  }),
  o('collage', 'Collage', 'a mixed-media collage', 'un collage de técnica mixta', {
    hint: 'Recortes de fotos, papeles y texturas combinados.',
    demo: img('Collage de ejemplo', ['#e63946', '#f1faee']),
  }),
];

const S = (id: string, label: string, en: string, es: string, hint: string, colors: string[], extra = {}) =>
  o(id, label, en, es, { hint, demo: img(label, colors), ...extra });

/** Estilos visuales (técnicas, movimientos y estéticas). Ver docs/03-diseno-grafico.md §7. */
export const ESTILOS: Option[] = [
  // Fotografía
  S('cinematografico', 'Cinematográfico', 'cinematic film still, anamorphic look, dramatic color grading', 'fotograma cinematográfico, look anamórfico, gradación de color dramática', 'Como un cuadro de una película.', ['#0f3d3e', '#e07a3f'], { meta: { literal: true } }),
  S('editorial', 'Editorial de moda', 'high-fashion editorial photography, polished and styled', 'fotografía editorial de moda, pulida y producida', 'Fotos de revista: poses cuidadas y producción impecable.', ['#111111', '#c9a227'], { meta: { literal: true } }),
  S('documental', 'Documental / callejera', 'candid documentary street photography, natural and unposed', 'fotografía documental callejera, espontánea y natural', 'Momentos reales, sin posar.', ['#6b705c', '#a5a58d'], { meta: { literal: true } }),
  S('producto', 'Fotografía de producto', 'clean commercial product photography, crisp details', 'fotografía comercial de producto, limpia y con detalles nítidos', 'El producto como protagonista, listo para vender.', ['#f5f5f5', '#9aa5b1'], { meta: { literal: true } }),
  S('analogica', 'Película analógica', 'shot on 35mm analog film, natural grain, nostalgic colors', 'tomada en película analógica de 35 mm, grano natural, colores nostálgicos', 'El encanto de las fotos de rollo.', ['#c08552', '#5e3023'], { meta: { literal: true } }),
  S('polaroid', 'Polaroid', 'instant Polaroid photo, soft faded colors, white frame', 'foto instantánea Polaroid, colores suaves y lavados, marco blanco', 'Foto instantánea con marco blanco y colores lavados.', ['#f6e7cb', '#7aa5a6'], { meta: { literal: true } }),
  // Pintura y dibujo
  S('acuarela', 'Acuarela', 'watercolor painting, soft bleeding pigments on textured paper', 'pintura en acuarela, pigmentos suaves que se funden sobre papel texturado', 'Colores transparentes que se mezclan con el agua.', ['#9ad1d4', '#f7c59f']),
  S('oleo', 'Óleo', 'oil painting, rich impasto brushstrokes, classical technique', 'pintura al óleo, pinceladas empastadas, técnica clásica', 'Pintura clásica con pinceladas con relieve.', ['#7b4b2a', '#d4a373']),
  S('gouache', 'Gouache', 'gouache painting, matte opaque colors, flat painterly shapes', 'pintura en gouache, colores opacos y mate, formas planas pictóricas', 'Colores opacos y mate, muy usado en libros infantiles.', ['#e76f51', '#2a9d8f']),
  S('tinta', 'Tinta', 'black ink illustration, expressive brush and pen linework', 'ilustración en tinta negra, trazos expresivos de pincel y plumín', 'Trazo negro expresivo sobre papel.', ['#fdfcf8', '#1b1b1b']),
  S('lapiz', 'Lápiz', 'detailed graphite pencil drawing, soft shading', 'dibujo detallado en lápiz de grafito, sombreado suave', 'Dibujo en grises con sombreado.', ['#efefef', '#6c6c6c']),
  S('carbonilla', 'Carbonilla', 'charcoal drawing, smudged dramatic shadows', 'dibujo en carbonilla, sombras dramáticas difuminadas', 'Negros profundos y difuminados.', ['#d6d2c4', '#262626']),
  S('pastel', 'Pastel (tiza)', 'soft chalk pastel drawing, powdery textures', 'dibujo en pastel de tiza, texturas polvorientas', 'Tizas de colores con textura suave.', ['#f4acb7', '#9d8189']),
  // Digital y animación
  S('anime', 'Anime', 'anime style illustration, clean cel shading, expressive characters', 'ilustración estilo anime, sombreado cel limpio, personajes expresivos', 'Estilo de animación japonesa.', ['#ff9eb5', '#6ec3f4']),
  S('manga', 'Manga', 'black and white manga style, screentone shading, dynamic ink lines', 'estilo manga en blanco y negro, tramas de sombreado, líneas de tinta dinámicas', 'Historieta japonesa en blanco y negro.', ['#ffffff', '#000000']),
  S('comic', 'Cómic', 'western comic book style, bold ink outlines, halftone shading', 'estilo cómic occidental, contornos de tinta gruesos, sombreado con trama', 'Historieta de superhéroes: contornos gruesos y color fuerte.', ['#ffde00', '#e3170a']),
  S('caricatura', 'Caricatura / cartoon', 'playful cartoon style, exaggerated proportions, bold colors', 'estilo caricatura divertido, proporciones exageradas, colores intensos', 'Dibujos animados: simple y divertido.', ['#ffb703', '#219ebc']),
  S('animacion3d', 'Animación 3D', 'stylized 3D animated film style, soft lighting, appealing characters', 'estilo de película de animación 3D, luz suave, personajes simpáticos', 'Como una película animada en 3D.', ['#ffcf56', '#5f0f40']),
  S('pixel', 'Pixel art', 'retro pixel art, limited color palette, crisp pixels', 'pixel art retro, paleta limitada, píxeles nítidos', 'Estilo videojuego retro de 8 o 16 bits.', ['#2b2d42', '#8ac926'], { conflicts: ['fotorrealista'] }),
  S('lowpoly', 'Low poly', 'low poly 3D art, faceted geometric surfaces', 'arte 3D low poly, superficies geométricas facetadas', 'Formas 3D hechas de triángulos visibles.', ['#4cc9f0', '#7209b7']),
  S('isometrico', 'Isométrico', 'isometric 3D illustration, clean geometry, miniature diorama', 'ilustración isométrica 3D, geometría limpia, diorama en miniatura', 'Vista en diagonal, sin perspectiva: como una maqueta.', ['#a0c4ff', '#ffadad']),
  S('clay', 'Plastilina', 'claymation style, handmade clay figures, soft fingerprint textures', 'estilo plastilina, figuras de arcilla hechas a mano, texturas de huellas', 'Figuras de plastilina, como en el stop motion.', ['#f4a259', '#5b8e7d']),
  S('flat', 'Diseño plano (flat)', 'flat design illustration, simple shapes, no gradients', 'ilustración de diseño plano, formas simples, sin degradados', 'Colores planos y formas simples, sin sombras.', ['#06d6a0', '#118ab2']),
  S('fotorrealista', 'Hiperrealista', 'hyperrealistic, ultra-detailed, lifelike textures', 'hiperrealista, ultra detallado, texturas realistas', 'Tan real que parece una foto.', ['#3d405b', '#e07a5f'], { meta: { literal: true }, conflicts: ['pixel', 'flat'] }),
  // Técnicas gráficas
  S('risografia', 'Risografía', 'risograph print, grainy texture, limited spot colors, slight misregistration', 'impresión en risografía, textura granulada, pocas tintas planas, leve desfase', 'Impresión artesanal con tintas vibrantes y grano.', ['#ff48b0', '#0078bf']),
  S('linograbado', 'Linograbado', 'linocut print, bold carved lines, high contrast', 'grabado en linóleo, líneas talladas gruesas, alto contraste', 'Grabado tallado: trazos gruesos y contraste.', ['#f1e9da', '#2e1f27']),
  S('serigrafia', 'Serigrafía', 'screen print poster style, flat ink layers, vibrant colors', 'estilo afiche serigrafiado, capas de tinta planas, colores vibrantes', 'Afiche impreso por capas de color.', ['#ef476f', '#073b4c']),
  S('popart', 'Pop art', 'pop art style, bold colors, Ben-Day dots, comic aesthetics', 'estilo pop art, colores intensos, puntos de trama, estética de cómic', 'Arte pop de los 60: colores fuertes y puntos de trama.', ['#ffe600', '#ff2e63']),
  S('papel', 'Papel recortado', 'layered paper cut art, soft shadows between layers', 'arte en papel recortado en capas, sombras suaves entre capas', 'Capas de papel con sombras: efecto de profundidad.', ['#ffd6a5', '#9bf6ff']),
  S('vitral', 'Vitral', 'stained glass art, bold lead lines, glowing jewel colors', 'arte de vitral, líneas de plomo marcadas, colores brillantes como joyas', 'Vidrios de colores unidos por líneas negras.', ['#3a0ca3', '#f72585']),
  S('ukiyoe', 'Ukiyo-e', 'ukiyo-e Japanese woodblock print style, flat colors, flowing lines', 'estilo ukiyo-e, grabado japonés en madera, colores planos, líneas fluidas', 'Grabado japonés tradicional.', ['#e9d8a6', '#005f73']),
  S('collage-estilo', 'Collage', 'mixed media collage aesthetic, cut-out paper and photo fragments', 'estética de collage de técnica mixta, recortes de papel y fragmentos de fotos', 'Recortes combinados con aire de fanzine.', ['#d62828', '#eae2b7']),
  // Estéticas y movimientos
  S('minimalista', 'Minimalista', 'minimalist, simple composition, lots of negative space', 'minimalista, composición simple, mucho espacio negativo', 'Pocos elementos y mucho aire: elegante y claro.', ['#f8f9fa', '#212529'], { conflicts: ['maximalista'] }),
  S('maximalista', 'Maximalista', 'maximalist, rich ornate details, layered patterns', 'maximalista, detalles ornamentados, patrones superpuestos', 'Más es más: lleno de detalles y patrones.', ['#9d0208', '#ffba08'], { conflicts: ['minimalista'] }),
  S('surrealista', 'Surrealista', 'surrealist dreamlike art, impossible juxtapositions', 'arte surrealista onírico, combinaciones imposibles', 'Escenas de sueño con cosas imposibles.', ['#7400b8', '#80ffdb']),
  S('artnouveau', 'Art Nouveau', 'Art Nouveau style, flowing organic lines, ornamental floral frames', 'estilo Art Nouveau, líneas orgánicas fluidas, marcos florales ornamentales', 'Curvas, flores y ornamentos de 1900.', ['#b5838d', '#6d6875']),
  S('artdeco', 'Art Déco', 'Art Deco style, geometric symmetry, gold and black elegance', 'estilo Art Déco, simetría geométrica, elegancia en dorado y negro', 'Glamour geométrico de los años 20.', ['#0b090a', '#d4af37']),
  S('cyberpunk', 'Cyberpunk', 'cyberpunk aesthetic, neon-lit futuristic city, high-tech grit', 'estética cyberpunk, ciudad futurista con neones, tecnología y suciedad', 'Futuro distópico con neones y lluvia.', ['#ff00a0', '#00f0ff']),
  S('steampunk', 'Steampunk', 'steampunk aesthetic, brass gears, Victorian machinery', 'estética steampunk, engranajes de bronce, maquinaria victoriana', 'Máquinas de vapor y bronce del siglo XIX.', ['#8c5a2b', '#3b2f2f']),
  S('solarpunk', 'Solarpunk', 'solarpunk aesthetic, lush green utopian architecture, bright sunlight', 'estética solarpunk, arquitectura utópica llena de verde, luz solar brillante', 'Futuro optimista lleno de plantas y energía limpia.', ['#a7c957', '#f2e8cf']),
  S('vaporwave', 'Vaporwave', 'vaporwave aesthetic, pastel pink and cyan, retro 90s digital nostalgia', 'estética vaporwave, rosa y cian pastel, nostalgia digital de los 90', 'Nostalgia digital de los 90 en rosa y celeste.', ['#ff71ce', '#01cdfe']),
  S('synthwave', 'Synthwave', 'synthwave retro 80s style, neon grid, sunset gradient', 'estilo synthwave retro de los 80, grilla de neón, atardecer degradado', 'Los 80: grilla de neón y sol degradado.', ['#2d00f7', '#f20089']),
  S('fantasia-oscura', 'Fantasía oscura', 'dark fantasy art, moody gothic atmosphere, intricate details', 'arte de fantasía oscura, atmósfera gótica sombría, detalles intrincados', 'Mundos de fantasía sombríos y góticos.', ['#1b1b2f', '#7d1d3f']),
  S('cottagecore', 'Cottagecore', 'cottagecore aesthetic, cozy rustic countryside, soft natural tones', 'estética cottagecore, campo rústico y acogedor, tonos naturales suaves', 'Vida de campo idealizada, cálida y tranquila.', ['#dda15e', '#606c38']),
  S('y2k', 'Y2K cromado', 'Y2K aesthetic, glossy chrome, holographic iridescent surfaces', 'estética Y2K, cromo brillante, superficies holográficas iridiscentes', 'El futuro según el año 2000: cromo y holográfico.', ['#c0c0c0', '#b5b2ff']),
  S('glitch', 'Glitch', 'digital glitch art, RGB channel shifts, scanlines', 'arte glitch digital, desfase de canales RGB, líneas de escaneo', 'Error digital como estética.', ['#00ff9f', '#ff0055']),
  S('doble-exposicion', 'Doble exposición', 'double exposure effect, silhouette blended with a landscape', 'efecto de doble exposición, silueta fusionada con un paisaje', 'Dos imágenes fundidas en una silueta.', ['#2b2d42', '#edf2f4']),
];

export const ESTILOS_GROUPS: Step['groups'] = [
  { id: 'foto', label: { es: 'Fotografía' }, optionIds: ['cinematografico', 'editorial', 'documental', 'producto', 'analogica', 'polaroid', 'fotorrealista'] },
  { id: 'pintura', label: { es: 'Pintura y dibujo' }, optionIds: ['acuarela', 'oleo', 'gouache', 'tinta', 'lapiz', 'carbonilla', 'pastel'] },
  { id: 'digital', label: { es: 'Digital y animación' }, optionIds: ['anime', 'manga', 'comic', 'caricatura', 'animacion3d', 'pixel', 'lowpoly', 'isometrico', 'clay', 'flat'] },
  { id: 'grafica', label: { es: 'Técnicas gráficas' }, optionIds: ['risografia', 'linograbado', 'serigrafia', 'popart', 'papel', 'vitral', 'ukiyoe', 'collage-estilo'] },
  { id: 'esteticas', label: { es: 'Estéticas y movimientos' }, optionIds: ['minimalista', 'maximalista', 'surrealista', 'artnouveau', 'artdeco', 'cyberpunk', 'steampunk', 'solarpunk', 'vaporwave', 'synthwave', 'fantasia-oscura', 'cottagecore', 'y2k', 'glitch', 'doble-exposicion'] },
];
