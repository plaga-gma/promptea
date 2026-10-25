import type { Demo, Option, Step } from '../../../engine/types';
import { img, mergeGroups, o } from './_helpers';
import {
  ELEMENTOS_EXTRA,
  ESTILOS_DISENO_EXTRA,
  ESTILOS_DISENO_EXTRA_GROUPS,
  LAYOUTS_EXTRA,
  PERSONALIDADES_EXTRA,
  PIEZAS_EXTRA,
  PRESENTACIONES_EXTRA,
  TIPOGRAFIAS_EXTRA,
} from './extra';

const font = (family: string, extra: Partial<Extract<Demo, { kind: 'font' }>> = {}): Demo => ({ kind: 'font', family, ...extra });
const diagram = (name: string): Demo => ({ kind: 'diagram', name });

/**
 * Tipografías por familia. La demo carga la fuente real desde Google Fonts (solo las letras de la muestra).
 * El prompt describe el estilo y nombra una fuente parecida: describir es más fiable que nombrar.
 */
const TIPOGRAFIAS_BASE: Option[] = [
  o('serif-clasica', 'Serif clásica', 'classic elegant serif typography (like Garamond)', 'tipografía serif clásica y elegante (como Garamond)', { hint: 'Tradición y confianza: libros, editoriales, abogados.', demo: font('EB Garamond') }),
  o('didona', 'Serif de alto contraste', 'high-contrast didone serif typography (like Playfair Display)', 'tipografía serif didona de alto contraste (como Playfair Display)', { hint: 'Moda y lujo: trazos finos y gruesos.', demo: font('Playfair Display', { weight: 700 }) }),
  o('slab', 'Slab serif', 'sturdy slab serif typography (like Roboto Slab)', 'tipografía slab serif robusta (como Roboto Slab)', { hint: 'Robusta e industrial, con remates rectangulares.', demo: font('Roboto Slab', { weight: 700 }) }),
  o('geometrica', 'Sans geométrica', 'clean geometric sans-serif typography (like Montserrat)', 'tipografía sans serif geométrica y limpia (como Montserrat)', { hint: 'Moderna y tecnológica, basada en círculos y rectas.', demo: font('Montserrat', { weight: 700 }) }),
  o('grotesca', 'Sans neutra', 'neutral grotesque sans-serif typography (like Inter or Helvetica)', 'tipografía sans serif grotesca neutra (como Inter o Helvética)', { hint: 'Corporativa y funcional, estilo suizo.', demo: font('Inter', { weight: 600 }) }),
  o('humanista', 'Sans humanista', 'friendly humanist sans-serif typography', 'tipografía sans serif humanista y amable', { hint: 'Cercana y muy legible.', demo: font('Source Sans 3', { weight: 600 }) }),
  o('redondeada', 'Redondeada', 'soft rounded sans-serif typography (like Nunito)', 'tipografía sans serif redondeada y suave (como Nunito)', { hint: 'Amigable, infantil y suave.', demo: font('Nunito', { weight: 800 }) }),
  o('condensada', 'Condensada', 'bold condensed sans-serif typography, all caps (like Oswald)', 'tipografía sans serif condensada y gruesa, en mayúsculas (como Oswald)', { hint: 'Impacto y deporte: ideal para titulares.', demo: font('Oswald', { weight: 700, upper: true }) }),
  o('mono', 'Monoespaciada', 'clean monospaced typography, technical and code-like', 'tipografía monoespaciada limpia, técnica, estilo código', { hint: 'Técnica y tecnológica, como el código.', demo: font('JetBrains Mono', { weight: 500 }) }),
  o('maquina', 'Máquina de escribir', 'worn typewriter typography (like Special Elite)', 'tipografía de máquina de escribir gastada (como Special Elite)', { hint: 'Documentos viejos, cartas y misterio.', demo: font('Special Elite') }),
  o('script', 'Caligráfica', 'elegant flowing script typography', 'tipografía caligráfica elegante y fluida', { hint: 'Invitaciones, bodas y romance.', demo: font('Great Vibes') }),
  o('manuscrita', 'Escrita a mano', 'casual handwritten typography', 'tipografía informal escrita a mano', { hint: 'Personal, artesanal y espontánea.', demo: font('Caveat', { weight: 700 }) }),
  o('pincel', 'Pincel / marcador', 'expressive brush marker lettering', 'letras expresivas hechas con pincel o marcador', { hint: 'Energía urbana y juvenil.', demo: font('Permanent Marker') }),
  o('gotica', 'Gótica', 'ornate blackletter gothic typography', 'tipografía gótica ornamentada (blackletter)', { hint: 'Medieval, metal o tatuaje.', demo: font('UnifrakturMaguntia') }),
  o('display', 'Display llamativa', 'bold playful display typography', 'tipografía display llamativa y divertida', { hint: 'Alto impacto para títulos cortos.', demo: font('Bungee', { upper: true }) }),
  o('deco', 'Art Déco', 'Art Deco geometric display typography', 'tipografía display geométrica Art Déco', { hint: 'Glamour de los años 20.', demo: font('Poiret One', { upper: true }) }),
  o('retro70', 'Retro 70s', 'chunky groovy 1970s retro typography', 'tipografía retro de los 70, gruesa y ondulada', { hint: 'Groovy y nostálgica.', demo: font('Shrikhand') }),
  o('pixel', 'Pixel', 'pixelated 8-bit bitmap typography', 'tipografía pixelada de 8 bits', { hint: 'Videojuegos retro.', demo: font('Press Start 2P', { upper: true }) }),
  o('stencil', 'Stencil', 'industrial stencil typography', 'tipografía stencil industrial', { hint: 'Militar, industrial, urbano.', demo: font('Stardos Stencil', { weight: 700, upper: true }) }),
  o('extra-negrita', 'Grotesca extra negrita', 'heavy ultra-bold grotesque sans-serif typography (like Archivo Black)', 'tipografía sans serif grotesca extra negrita (como Archivo Black)', { hint: 'Titulares que gritan: deportes, música, ofertas.', demo: font('Archivo Black', { upper: true }) }),
  o('inflada', 'Inflada / burbuja', 'puffy inflated 3D bubble lettering', 'letras infladas en 3D, como globos', { hint: 'Divertida y actual, muy usada en redes.', demo: font('Rubik Bubbles') }),
  o('contorno', 'Contorno', 'outlined hollow display lettering', 'letras huecas, solo con contorno', { hint: 'Liviana y gráfica, ideal combinada con letras rellenas.', demo: font('Bungee Outline', { upper: true }) }),
  o('neon-tipo', 'Neón', 'glowing neon tube lettering', 'letras de tubo de neón encendidas', { hint: 'Bares, noche y carteles luminosos.', demo: font('Tilt Neon') }),
  o('futurista-tipo', 'Futurista', 'futuristic sci-fi typography (like Orbitron)', 'tipografía futurista de ciencia ficción (como Orbitron)', { hint: 'Tecnología, gaming y ciencia ficción.', demo: font('Orbitron', { weight: 700, upper: true }) }),
  o('western', 'Western / circo', 'ornate Western wood-type lettering, vintage circus poster style', 'letras western de tipos de madera, estilo afiche de circo antiguo', { hint: 'Lejano oeste, circo y ferias.', demo: font('Rye', { upper: true }) }),
  o('graffiti-tipo', 'Graffiti', 'spray paint graffiti lettering', 'letras de graffiti en aerosol', { hint: 'Urbana, rebelde y callejera.', demo: font('Rubik Spray Paint') }),
];

/** Piezas de diseño: definen el uso declarado y la proporción sugerida. Ver docs/03-diseno-grafico.md §10. */
const PIEZAS_BASE: Option[] = [
  o('logo', 'Logo', 'a simple, flat professional logo in scalable vector style', 'un logo profesional simple y plano en estilo vectorial escalable', { hint: 'La firma visual de una marca.', demo: diagram('piece-logo'), meta: { ratio: [1, 1], purpose: 'brand logo', avoid: ['mockup', 'photorealistic details'], allow: ['logo'] } }),
  o('icono', 'Ícono / app', 'an app icon design with a single bold symbol', 'un diseño de ícono de app', { hint: 'Un símbolo simple que se entienda en tamaño chico.', demo: diagram('piece-icon'), meta: { ratio: [1, 1], purpose: 'app icon' } }),
  o('post', 'Post para redes', 'a social media post design', 'un diseño de post para redes sociales', { hint: 'Un mensaje claro que frene el scroll.', demo: diagram('piece-post'), meta: { ratio: [4, 5], purpose: 'Instagram feed post' } }),
  o('historia', 'Historia / Reel', 'a vertical social media story design', 'un diseño vertical para historia de redes', { hint: 'Vertical; deja libre arriba y abajo.', demo: diagram('piece-story'), meta: { ratio: [9, 16], purpose: 'Instagram story' } }),
  o('flyer', 'Flyer', 'a promotional flyer design', 'un diseño de flyer promocional', { hint: 'Para anunciar un evento, promo o negocio.', demo: diagram('piece-flyer'), meta: { ratio: [4, 5], purpose: 'promotional flyer' } }),
  o('poster', 'Póster', 'a striking poster design', 'un diseño de póster impactante', { hint: 'Una imagen protagonista y un título corto.', demo: diagram('piece-poster'), meta: { ratio: [2, 3], purpose: 'poster' } }),
  o('portada-libro', 'Portada de libro', 'a book cover design', 'un diseño de portada de libro', { hint: 'El título se tiene que leer incluso en miniatura.', demo: diagram('piece-book'), meta: { ratio: [2, 3], purpose: 'book cover' } }),
  o('portada-album', 'Portada de álbum', 'an album cover artwork', 'una portada de álbum musical', { hint: 'Cuadrada; tiene que funcionar chiquita en las apps.', demo: diagram('piece-album'), meta: { ratio: [1, 1], purpose: 'music album cover' } }),
  o('miniatura', 'Miniatura de YouTube', 'a YouTube thumbnail design', 'un diseño de miniatura de YouTube', { hint: 'Sujeto grande, 3 o 4 palabras y mucho contraste.', demo: diagram('piece-thumb'), meta: { ratio: [16, 9], purpose: 'YouTube thumbnail' } }),
  o('banner', 'Banner web', 'a website banner design', 'un diseño de banner web', { hint: 'Horizontal, con espacio para texto a un costado.', demo: diagram('piece-banner'), meta: { ratio: [16, 9], purpose: 'website hero banner' } }),
  o('tarjeta', 'Tarjeta personal', 'a business card design', 'un diseño de tarjeta personal', { hint: 'Mínimo texto y mucho aire.', demo: diagram('piece-card'), meta: { ratio: [7, 4], purpose: 'business card', allow: ['logo'] } }),
  o('sticker', 'Sticker', 'a die-cut sticker design with a white border', 'un diseño de sticker troquelado con borde blanco', { hint: 'Contorno blanco y fondo liso.', demo: diagram('piece-sticker'), meta: { ratio: [1, 1], purpose: 'sticker' } }),
  o('menu', 'Menú', 'a restaurant menu design with clear sections', 'un diseño de menú de restaurante con secciones claras', { hint: 'Pocos platos y textos cortos: la IA se equivoca con listas largas.', demo: diagram('piece-menu'), meta: { ratio: [2, 3], purpose: 'restaurant menu' } }),
  o('invitacion', 'Invitación', 'an elegant invitation card design', 'un diseño de tarjeta de invitación elegante', { hint: 'Cumpleaños, casamientos y eventos.', demo: diagram('piece-invite'), meta: { ratio: [3, 4], purpose: 'invitation card' } }),
  o('infografia', 'Infografía', 'an infographic with clear sections, icons and simple charts', 'una infografía con secciones claras, íconos y gráficos simples', { hint: 'Pocos datos, bien grandes. Revisá siempre los números.', demo: diagram('piece-infographic'), meta: { ratio: [2, 3], purpose: 'infographic' } }),
  o('remera', 'Estampa para remera', 'a t-shirt graphic print design', 'un diseño de estampa para remera', { hint: 'El dibujo solo, sin la remera. Para verlo puesto, pasá a Avanzado y elegí «Cómo se muestra».', demo: diagram('piece-tshirt'), meta: { ratio: [1, 1], purpose: 't-shirt print', avoid: ['mockup'] } }),
  o('patron', 'Patrón continuo', 'a seamless repeating pattern tile', 'un patrón continuo que se repite sin cortes', { hint: 'Para telas, papeles de regalo y fondos.', demo: diagram('piece-pattern'), meta: { ratio: [1, 1], purpose: 'seamless pattern', tile: true } }),
  o('fondo-pantalla', 'Fondo de pantalla', 'a phone wallpaper design', 'un diseño de fondo de pantalla para celular', { hint: 'Dejá libre la parte de arriba, donde va la hora.', demo: diagram('piece-wallpaper'), meta: { ratio: [9, 16], purpose: 'phone wallpaper' } }),
  o('web', 'Página web', 'a modern website landing page UI design', 'un diseño de interfaz de página web moderna', { hint: 'Una idea visual de cómo se vería tu sitio.', demo: diagram('piece-hero'), meta: { ratio: [16, 9], purpose: 'website landing page' } }),
  o('podcast', 'Portada de podcast', 'a podcast cover art design', 'un diseño de portada de podcast', { hint: 'Cuadrada y legible en tamaño chico.', demo: diagram('piece-podcast'), meta: { ratio: [1, 1], purpose: 'podcast cover' } }),
  o('etiqueta', 'Etiqueta / packaging', 'a product label and packaging design', 'un diseño de etiqueta y packaging de producto', { hint: 'Para frascos, cajas y bolsas.', demo: diagram('piece-label'), meta: { ratio: [4, 5], purpose: 'product packaging label', allow: ['logo'] } }),
];

/** Estilos de diseño gráfico (corrientes). */
const D = (id: string, label: string, en: string, es: string, hint: string, colors: string[], conflicts?: string[]) =>
  o(id, label, en, es, { hint, demo: img(label, colors), ...(conflicts ? { conflicts } : {}) });

const ESTILOS_DISENO_BASE: Option[] = [
  D('d-minimal', 'Minimalista', 'minimalist graphic design, clean layout, generous white space', 'diseño gráfico minimalista, diagramación limpia, mucho espacio en blanco', 'Pocos elementos, mucho aire: claro y elegante.', ['#ffffff', '#111111'], ['d-maximal', 'd-memphis']),
  D('d-suizo', 'Suizo', 'Swiss International Typographic Style, strict grid, bold sans-serif', 'estilo tipográfico internacional suizo, retícula estricta, sans serif gruesa', 'Orden, retícula y tipografía protagonista.', ['#e30613', '#f2f2f2']),
  D('d-bauhaus', 'Bauhaus', 'Bauhaus design, primary colors, basic geometric shapes', 'diseño Bauhaus, colores primarios, formas geométricas básicas', 'Círculos, cuadrados y triángulos en colores primarios.', ['#e63946', '#1d4ed8']),
  D('d-brutalista', 'Brutalista', 'brutalist graphic design, raw bold typography, stark contrast', 'diseño gráfico brutalista, tipografía cruda y gruesa, contraste duro', 'Crudo, directo y provocador.', ['#000000', '#ffff00']),
  D('d-neobrutalista', 'Neobrutalismo', 'neo-brutalist design, thick black outlines, flat bright colors, hard shadows', 'diseño neobrutalista, contornos negros gruesos, colores planos brillantes, sombras duras', 'Contornos negros gruesos y colores vivos: muy actual.', ['#ffde59', '#ff66c4']),
  D('d-memphis', 'Memphis', 'Memphis design style, playful geometric patterns, squiggles and bold colors', 'estilo Memphis, patrones geométricos lúdicos, garabatos y colores intensos', 'Los 80: formas locas, garabatos y color.', ['#ff6b6b', '#4ecdc4'], ['d-minimal']),
  D('d-retro', 'Retro / vintage', 'retro vintage design, distressed print look, classic badges', 'diseño retro vintage, aspecto de impresión gastada, insignias clásicas', 'Aire de cartel antiguo.', ['#d4a24c', '#3e5641']),
  D('d-y2k', 'Y2K', 'Y2K graphic design, chrome type, bubbly shapes, iridescent gradients', 'diseño gráfico Y2K, letras cromadas, formas burbujeantes, degradados iridiscentes', 'Estética del 2000, cromada y burbujeante.', ['#c0c0ff', '#ff9ff3']),
  D('d-psicodelico', 'Psicodélico', 'psychedelic 1960s poster style, swirling forms, vibrant clashing colors', 'estilo afiche psicodélico de los 60, formas en espiral, colores vibrantes que chocan', 'Formas que se derriten y colores intensos.', ['#ff006e', '#8338ec']),
  D('d-constructivista', 'Constructivista', 'Russian constructivist poster style, diagonal compositions, red and black', 'estilo afiche constructivista ruso, composiciones diagonales, rojo y negro', 'Diagonales, rojo y negro: propaganda de vanguardia.', ['#c1121f', '#000000']),
  D('d-corporativo', 'Corporativo moderno', 'modern corporate design, clean grid, professional and trustworthy', 'diseño corporativo moderno, retícula limpia, profesional y confiable', 'Profesional y confiable.', ['#0a2342', '#e5e7eb']),
  D('d-lujo', 'Lujo', 'luxury premium design, elegant serif type, refined details, dark and gold', 'diseño de lujo premium, serif elegante, detalles refinados, oscuro y dorado', 'Exclusivo y sofisticado.', ['#0b0b0b', '#c9a227']),
  D('d-organico', 'Orgánico / natural', 'organic natural design, soft hand-drawn shapes, earthy tones', 'diseño orgánico natural, formas suaves dibujadas a mano, tonos tierra', 'Cercano, natural y artesanal.', ['#a3b18a', '#dda15e']),
  D('d-editorial', 'Editorial', 'editorial magazine layout, sophisticated typographic hierarchy', 'diagramación editorial de revista, jerarquía tipográfica sofisticada', 'Como una revista de diseño.', ['#f4f1ea', '#1f1f1f']),
  D('d-glass', 'Glassmorphism', 'glassmorphism design, frosted translucent panels, soft colorful blur', 'diseño glassmorphism, paneles translúcidos esmerilados, desenfoque colorido', 'Vidrio esmerilado sobre colores difusos.', ['#a18cd1', '#fbc2eb']),
  D('d-grunge', 'Grunge / punk', 'grunge punk zine aesthetic, ripped paper, photocopy texture', 'estética fanzine grunge punk, papel rasgado, textura de fotocopia', 'Fotocopia, recortes y actitud.', ['#2b2b2b', '#e5e5e5']),
  D('d-maximal', 'Maximalista', 'maximalist design, layered patterns, rich colors and ornaments', 'diseño maximalista, patrones superpuestos, colores ricos y ornamentos', 'Lleno de capas, color y detalle.', ['#9d0208', '#ffba08'], ['d-minimal']),
  D('d-escandinavo', 'Escandinavo', 'Scandinavian design, calm neutral colors, simple functional shapes', 'diseño escandinavo, colores neutros y calmos, formas simples y funcionales', 'Claro, cálido y funcional.', ['#f5f1ea', '#9caf88']),
  D('d-japones', 'Minimalismo japonés', 'Japanese minimalist design, asymmetric balance, ample empty space, subtle details', 'diseño minimalista japonés, equilibrio asimétrico, mucho espacio vacío, detalles sutiles', 'Sereno, preciso y con mucho vacío.', ['#f4efe6', '#bc002d']),
  D('d-acid', 'Acid graphics', 'acid graphics style, chrome and liquid shapes, rave-inspired experimental typography', 'estilo acid graphics, formas cromadas y líquidas, tipografía experimental inspirada en las raves', 'Electrónica, cromo y tipografía rara.', ['#c6ff00', '#111111']),
  D('d-kawaii', 'Kawaii', 'kawaii design, cute characters, pastel colors, rounded shapes', 'diseño kawaii, personajes tiernos, colores pastel, formas redondeadas', 'Tierno, pastel y japonés.', ['#ffc8dd', '#cdb4db']),
  D('d-boho', 'Boho', 'boho design, earthy tones, hand-drawn botanical details, organic arches', 'diseño boho, tonos tierra, detalles botánicos dibujados a mano, arcos orgánicos', 'Natural, cálido y artesanal.', ['#d4a373', '#ccd5ae']),
  D('d-doodle', 'Garabatos (doodle)', 'hand-drawn doodle style, playful sketchy icons and scribbles', 'estilo doodle dibujado a mano, íconos y garabatos lúdicos', 'Como dibujado en un cuaderno.', ['#ffffff', '#3a86ff']),
  D('d-aurora', 'Degradados aurora', 'soft mesh gradient aurora background, modern tech aesthetic', 'fondo de degradados suaves tipo aurora, estética tecnológica moderna', 'Manchas de color difuminadas, muy de apps.', ['#7f5af0', '#2cb67d']),
  D('d-tipografico', 'Tipográfico experimental', 'experimental typographic design, type as image, bold scale contrasts', 'diseño tipográfico experimental, la letra como imagen, contrastes de escala fuertes', 'Las letras son las protagonistas.', ['#111111', '#ff5400']),
  D('d-infantil', 'Infantil / lúdico', 'playful kid-friendly design, rounded shapes, cheerful colors', 'diseño lúdico e infantil, formas redondeadas, colores alegres', 'Alegre y redondeado.', ['#ffb703', '#8ecae6']),
];

/** Tipos de logo. Ver docs/03-diseno-grafico.md §6. */
export const TIPOS_LOGO: Option[] = [
  o('wordmark', 'Logotipo (solo nombre)', 'wordmark logo using only the brand name in custom typography', 'logotipo solo con el nombre de la marca en tipografía propia', { hint: 'Solo letras. Ideal si el nombre es corto y distintivo.', demo: diagram('logo-wordmark') }),
  o('lettermark', 'Monograma (iniciales)', 'lettermark monogram logo made from the initials', 'logo monograma hecho con las iniciales', { hint: 'Las iniciales entrelazadas. Ideal para nombres largos.', demo: diagram('logo-lettermark') }),
  o('pictorico', 'Ícono figurativo', 'pictorial mark logo, a simple recognizable symbol', 'logo con ícono figurativo, un símbolo simple y reconocible', { hint: 'Un dibujo simple que representa la marca.', demo: diagram('logo-pictorial') }),
  o('abstracto', 'Símbolo abstracto', 'abstract geometric logo mark', 'logo con símbolo geométrico abstracto', { hint: 'Una forma no figurativa: moderna y única.', demo: diagram('logo-abstract') }),
  o('mascota', 'Mascota', 'friendly mascot character logo', 'logo con personaje mascota amigable', { hint: 'Un personaje que representa la marca.', demo: diagram('logo-mascot') }),
  o('emblema', 'Emblema / sello', 'emblem badge logo with text inside a seal', 'logo emblema con el texto dentro de un sello', { hint: 'Clásico: cervecerías, clubes, cafés.', demo: diagram('logo-emblem') }),
  o('combinado', 'Ícono + nombre', 'combination mark logo with an icon next to the brand name', 'logo combinado con un ícono junto al nombre', { hint: 'El más versátil: símbolo y nombre juntos.', demo: diagram('logo-combo') }),
];

/** Diagramación (layout). */
const LAYOUTS_BASE: Option[] = [
  o('l-centrado', 'Centrado', 'centered layout with a clear visual hierarchy', 'diagramación centrada con jerarquía visual clara', { hint: 'Todo al centro: simple y equilibrado.', demo: diagram('layout-center') }),
  o('l-grilla', 'Retícula', 'structured grid layout', 'diagramación en retícula ordenada', { hint: 'Columnas y bloques alineados: orden y claridad.', demo: diagram('layout-grid') }),
  o('l-asimetrico', 'Asimétrico', 'dynamic asymmetric layout', 'diagramación asimétrica dinámica', { hint: 'Moderno y con movimiento.', demo: diagram('layout-asym') }),
  o('l-dividido', 'Dividido en dos', 'split layout, image on one side and text on the other', 'diagramación dividida: imagen de un lado y texto del otro', { hint: 'Mitad imagen, mitad texto.', demo: diagram('layout-split') }),
  o('l-tipografico', 'Tipografía gigante', 'typography-driven layout with oversized headline', 'diagramación tipográfica con titular gigante', { hint: 'El texto es la imagen.', demo: diagram('layout-type') }),
  o('l-imagen-completa', 'Imagen a sangre', 'full-bleed image with text overlay', 'imagen a sangre (ocupa todo) con texto encima', { hint: 'La imagen ocupa todo y el texto va encima.', demo: diagram('layout-fullbleed') }),
  o('l-espacio-texto', 'Espacio para texto', 'leave clean empty space at the top for adding text later', 'dejá espacio limpio arriba para agregar texto después', { hint: 'Útil si vas a poner el texto vos en Canva o similar.', demo: diagram('layout-space') }),
];

/** Elementos gráficos. */
const ELEMENTOS_BASE: Option[] = [
  o('e-formas', 'Formas geométricas', 'bold geometric shapes', 'formas geométricas marcadas', { demo: diagram('el-shapes') }),
  o('e-organicas', 'Formas orgánicas', 'soft organic blob shapes', 'formas orgánicas suaves', { demo: diagram('el-blobs') }),
  o('e-ilustracion', 'Ilustración', 'a central illustration', 'una ilustración central', { demo: diagram('el-illustration') }),
  o('e-foto', 'Fotografía', 'a central photograph', 'una fotografía central', { demo: diagram('el-photo') }),
  o('e-patron', 'Patrón de fondo', 'a subtle repeating pattern', 'un patrón repetido sutil', { demo: diagram('el-pattern') }),
  o('e-degradado', 'Degradados', 'smooth color gradients', 'degradados de color suaves', { demo: diagram('el-gradient') }),
  o('e-lineas', 'Líneas y marcos', 'thin lines and frames', 'líneas finas y marcos', { demo: diagram('el-lines') }),
  o('e-iconos', 'Íconos', 'simple supporting icons', 'íconos simples de apoyo', { demo: diagram('el-icons') }),
];

/** Fondo. */
export const FONDOS: Option[] = [
  o('f-blanco', 'Blanco liso', 'plain white background', 'fondo blanco liso', { demo: { kind: 'swatch', colors: ['#ffffff'] } }),
  o('f-transparente', 'Transparente', 'transparent background, isolated subject, no shadow', 'fondo transparente, sujeto aislado, sin sombra', { hint: 'Para logos y stickers. Solo algunas IAs lo generan de verdad (ChatGPT por API).', demo: { kind: 'texture', name: 'checker' }, conflicts: ['m-mesa', 'm-pared', 'm-mano', 'm-celular', 'm-remera', 'm-packaging', 'm-calle'] }),
  o('f-color', 'Color sólido', 'solid color background from the palette', 'fondo de color sólido de la paleta', { demo: { kind: 'swatch', colors: ['#6d4aff'] } }),
  o('f-degradado', 'Degradado', 'smooth gradient background', 'fondo degradado suave', { demo: { kind: 'gradient', colors: ['#ff9a8b', '#6d4aff'] } }),
  o('f-oscuro', 'Oscuro', 'dark background', 'fondo oscuro', { demo: { kind: 'swatch', colors: ['#111111'] } }),
  o('f-textura', 'Con textura', 'subtle textured background', 'fondo con textura sutil', { demo: { kind: 'texture', name: 'paper' } }),
  o('f-foto', 'Foto ambientada', 'photographic scene background', 'fondo con una escena fotográfica', { demo: img('Fondo fotográfico', ['#7a9e7e', '#e9d8a6']) }),
];

/** Personalidad de marca: cómo tiene que "sonar" la pieza. */
const pg = (colors: string[], glyph: string): Demo => ({ kind: 'gradient', colors, glyph });
const PERSONALIDADES_BASE: Option[] = [
  o('confiable', 'Confiable', 'trustworthy', 'confiable', { hint: 'Bancos, salud, servicios profesionales.', demo: pg(['#0a2342', '#2c6e9b'], '🤝') }),
  o('divertida', 'Divertida', 'fun, playful', 'divertida, juguetona', { hint: 'Juguetes, snacks, eventos.', demo: pg(['#ffbe0b', '#ff006e'], '🎉') }),
  o('elegante', 'Elegante', 'elegant, refined', 'elegante, refinada', { hint: 'Moda, joyas, vinos.', demo: pg(['#111111', '#c9a227'], '💎') }),
  o('audaz', 'Audaz', 'bold, daring', 'audaz, atrevida', { hint: 'Deportes, energía, música.', demo: pg(['#d00000', '#000000'], '⚡') }),
  o('cercana', 'Cercana', 'warm, approachable', 'cálida, cercana', { hint: 'Negocios de barrio, comunidad, educación.', demo: pg(['#f4a261', '#e76f51'], '😊') }),
  o('innovadora', 'Innovadora', 'innovative, forward-thinking', 'innovadora, de vanguardia', { hint: 'Tecnología y startups.', demo: pg(['#6d4aff', '#00c2ff'], '🚀') }),
  o('natural', 'Natural', 'natural, wholesome', 'natural, saludable', { hint: 'Orgánico, bienestar, plantas.', demo: pg(['#a7c957', '#386641'], '🌿') }),
  o('artesanal', 'Artesanal', 'handcrafted, authentic', 'artesanal, auténtica', { hint: 'Panaderías, cervecerías, hecho a mano.', demo: pg(['#bc6c25', '#606c38'], '🧵') }),
  o('juvenil', 'Juvenil', 'youthful, trendy', 'juvenil, a la moda', { hint: 'Público joven y redes sociales.', demo: pg(['#ff70a6', '#70d6ff'], '✨') }),
  o('seria', 'Seria', 'serious, authoritative', 'seria, con autoridad', { hint: 'Instituciones, legales, finanzas.', demo: pg(['#343a40', '#6c757d'], '🏛️') }),
];

/** Cómo se presenta la pieza terminada: sola o en un mockup realista. */
const MOCKUP = ['mockup', 'photorealistic details'];
const PRESENTACIONES_BASE: Option[] = [
  o('m-plano', 'Solo el diseño', 'shown flat and straight-on, artwork only, filling the frame', 'mostrado plano y de frente, solo el diseño ocupando todo el cuadro', { hint: 'Recomendado si lo vas a usar o imprimir.', demo: diagram('mock-flat'), meta: { avoid: ['mockup'] } }),
  o('m-mesa', 'Impreso sobre una mesa', 'presented as a realistic printed mockup lying on a table, soft natural light', 'presentado como un mockup realista impreso, apoyado sobre una mesa, con luz natural suave', { demo: diagram('mock-table'), meta: { allow: MOCKUP } }),
  o('m-pared', 'Colgado en una pared', 'presented as a realistic framed mockup hanging on a wall in a stylish room', 'presentado como un mockup realista enmarcado y colgado en la pared de un ambiente con estilo', { demo: diagram('mock-wall'), meta: { allow: MOCKUP } }),
  o('m-mano', 'En la mano', 'presented as a realistic mockup held in a hand', 'presentado como un mockup realista sostenido en una mano', { demo: diagram('mock-hand'), meta: { allow: MOCKUP } }),
  o('m-celular', 'En un celular', 'presented as a realistic mockup on a smartphone screen', 'presentado como un mockup realista en la pantalla de un celular', { demo: diagram('mock-phone'), meta: { allow: MOCKUP } }),
  o('m-remera', 'En una remera', 'presented as a realistic mockup printed on a t-shirt worn by a person', 'presentado como un mockup realista estampado en una remera que lleva puesta una persona', { demo: diagram('mock-shirt'), meta: { allow: MOCKUP } }),
  o('m-packaging', 'En un producto', 'presented as a realistic mockup printed on product packaging', 'presentado como un mockup realista impreso en el packaging de un producto', { demo: diagram('mock-package'), meta: { allow: MOCKUP } }),
  o('m-calle', 'En la calle', 'presented as a realistic mockup on a street billboard', 'presentado como un mockup realista en un cartel de la calle', { demo: diagram('mock-street'), meta: { allow: MOCKUP } }),
];

export const TIPOGRAFIAS: Option[] = [...TIPOGRAFIAS_BASE, ...TIPOGRAFIAS_EXTRA];
export const PIEZAS: Option[] = [...PIEZAS_BASE, ...PIEZAS_EXTRA];
export const ESTILOS_DISENO: Option[] = [...ESTILOS_DISENO_BASE, ...ESTILOS_DISENO_EXTRA];
export const LAYOUTS: Option[] = [...LAYOUTS_BASE, ...LAYOUTS_EXTRA];
export const ELEMENTOS: Option[] = [...ELEMENTOS_BASE, ...ELEMENTOS_EXTRA];
export const PERSONALIDADES: Option[] = [...PERSONALIDADES_BASE, ...PERSONALIDADES_EXTRA];
export const PRESENTACIONES: Option[] = [...PRESENTACIONES_BASE, ...PRESENTACIONES_EXTRA];

/** Categorías de los estilos de diseño. */
const ESTILOS_DISENO_GROUPS_BASE: NonNullable<Step['groups']> = [
  { id: 'clasicos', label: { es: 'Clásicos del diseño' }, optionIds: ['d-suizo', 'd-bauhaus', 'd-constructivista', 'd-editorial', 'd-tipografico', 'd-psicodelico'] },
  { id: 'limpios', label: { es: 'Minimal y limpios' }, optionIds: ['d-minimal', 'd-escandinavo', 'd-japones', 'd-corporativo', 'd-lujo'] },
  { id: 'retro', label: { es: 'Retro' }, optionIds: ['d-retro', 'd-memphis', 'd-y2k', 'd-grunge'] },
  { id: 'actuales', label: { es: 'Actuales' }, optionIds: ['d-brutalista', 'd-neobrutalista', 'd-glass', 'd-aurora', 'd-acid'] },
  { id: 'calidos', label: { es: 'Cálidos y lúdicos' }, optionIds: ['d-organico', 'd-boho', 'd-kawaii', 'd-doodle', 'd-infantil', 'd-maximal'] },
];

export const ESTILOS_DISENO_GROUPS: Step['groups'] = mergeGroups(ESTILOS_DISENO_GROUPS_BASE, ESTILOS_DISENO_EXTRA_GROUPS);

export const ELEMENTOS_GROUPS: Step['groups'] = [
  { id: 'formas', label: { es: 'Formas y fondos' }, optionIds: ['e-formas', 'e-organicas', 'e-patron', 'e-degradado', 'e-3d'] },
  { id: 'imagenes', label: { es: 'Imágenes' }, optionIds: ['e-ilustracion', 'e-foto', 'e-iconos'] },
  { id: 'decoracion', label: { es: 'Decoración' }, optionIds: ['e-lineas', 'e-marco', 'e-destellos', 'e-flechas'] },
  { id: 'hecho-a-mano', label: { es: 'Hecho a mano' }, optionIds: ['e-stickers', 'e-garabatos', 'e-cinta', 'e-sellos'] },
];

export const PRESENTACIONES_GROUPS: Step['groups'] = [
  { id: 'plano', label: { es: 'Solo el diseño' }, optionIds: ['m-plano'] },
  { id: 'impreso', label: { es: 'Impreso' }, optionIds: ['m-mesa', 'm-pared', 'm-mano', 'm-revista'] },
  { id: 'pantallas', label: { es: 'Pantallas' }, optionIds: ['m-celular', 'm-laptop'] },
  { id: 'productos', label: { es: 'Productos' }, optionIds: ['m-remera', 'm-packaging', 'm-taza', 'm-bolsa'] },
  { id: 'calle', label: { es: 'En la calle' }, optionIds: ['m-calle', 'm-vidriera', 'm-valla'] },
];

export const PERSONALIDADES_GROUPS: Step['groups'] = [
  { id: 'serias', label: { es: 'Seria y confiable' }, optionIds: ['confiable', 'seria', 'elegante', 'minimal-marca'] },
  { id: 'calidas', label: { es: 'Cálida y natural' }, optionIds: ['cercana', 'natural', 'artesanal', 'nostalgica-marca'] },
  { id: 'energicas', label: { es: 'Con energía' }, optionIds: ['divertida', 'audaz', 'juvenil', 'rebelde-marca', 'magica-marca', 'innovadora'] },
];

export const LAYOUTS_GROUPS: Step['groups'] = [
  { id: 'ordenadas', label: { es: 'Ordenadas' }, optionIds: ['l-centrado', 'l-grilla', 'l-bento', 'l-marco'] },
  { id: 'dinamicas', label: { es: 'Dinámicas' }, optionIds: ['l-asimetrico', 'l-dividido', 'l-z', 'l-collage'] },
  { id: 'impacto', label: { es: 'De impacto' }, optionIds: ['l-tipografico', 'l-imagen-completa', 'l-espacio-texto'] },
];
