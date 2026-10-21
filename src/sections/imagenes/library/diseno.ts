import type { Demo, Option } from '../../../engine/types';
import { img, o } from './_helpers';

const font = (family: string, extra: Partial<Extract<Demo, { kind: 'font' }>> = {}): Demo => ({ kind: 'font', family, ...extra });
const diagram = (name: string): Demo => ({ kind: 'diagram', name });

/**
 * Tipografías por familia. La demo carga la fuente real desde Google Fonts (solo las letras de la muestra).
 * El prompt describe el estilo y nombra una fuente parecida: describir es más fiable que nombrar.
 */
export const TIPOGRAFIAS: Option[] = [
  o('serif-clasica', 'Serif clásica', 'classic elegant serif typography (like Garamond)', 'tipografía serif clásica y elegante (como Garamond)', { hint: 'Tradición y confianza: libros, editoriales, abogados.', demo: font('EB Garamond') }),
  o('didona', 'Serif de alto contraste', 'high-contrast didone serif typography (like Playfair Display)', 'tipografía serif didona de alto contraste (como Playfair Display)', { hint: 'Moda y lujo: trazos finos y gruesos.', demo: font('Playfair Display', { weight: 700 }) }),
  o('slab', 'Slab serif', 'sturdy slab serif typography (like Roboto Slab)', 'tipografía slab serif robusta (como Roboto Slab)', { hint: 'Robusta e industrial, con remates rectangulares.', demo: font('Roboto Slab', { weight: 700 }) }),
  o('geometrica', 'Sans geométrica', 'clean geometric sans-serif typography (like Montserrat)', 'tipografía sans serif geométrica y limpia (como Montserrat)', { hint: 'Moderna y tecnológica, basada en círculos y rectas.', demo: font('Montserrat', { weight: 700 }) }),
  o('grotesca', 'Sans neutra', 'neutral grotesque sans-serif typography (like Inter or Helvetica)', 'tipografía sans serif grotesca neutra (como Inter o Helvética)', { hint: 'Corporativa y funcional, estilo suizo.', demo: font('Inter', { weight: 600 }) }),
  o('humanista', 'Sans humanista', 'friendly humanist sans-serif typography', 'tipografía sans serif humanista y amable', { hint: 'Cercana y muy legible.', demo: font('Source Sans 3', { weight: 600 }) }),
  o('redondeada', 'Redondeada', 'soft rounded sans-serif typography (like Nunito)', 'tipografía sans serif redondeada y suave (como Nunito)', { hint: 'Amigable, infantil y suave.', demo: font('Nunito', { weight: 800 }) }),
  o('condensada', 'Condensada', 'bold condensed sans-serif typography, all caps (like Oswald)', 'tipografía sans serif condensada y gruesa, en mayúsculas (como Oswald)', { hint: 'Impacto y deporte: ideal para titulares.', demo: font('Oswald', { weight: 700, upper: true }) }),
  o('mono', 'Monoespaciada', 'monospaced typewriter-style typography', 'tipografía monoespaciada estilo máquina de escribir', { hint: 'Técnica, código o máquina de escribir.', demo: font('JetBrains Mono', { weight: 500 }) }),
  o('script', 'Caligráfica', 'elegant flowing script typography', 'tipografía caligráfica elegante y fluida', { hint: 'Invitaciones, bodas y romance.', demo: font('Great Vibes') }),
  o('manuscrita', 'Escrita a mano', 'casual handwritten typography', 'tipografía informal escrita a mano', { hint: 'Personal, artesanal y espontánea.', demo: font('Caveat', { weight: 700 }) }),
  o('pincel', 'Pincel / marcador', 'expressive brush marker lettering', 'letras expresivas hechas con pincel o marcador', { hint: 'Energía urbana y juvenil.', demo: font('Permanent Marker') }),
  o('gotica', 'Gótica', 'ornate blackletter gothic typography', 'tipografía gótica ornamentada (blackletter)', { hint: 'Medieval, metal o tatuaje.', demo: font('UnifrakturMaguntia') }),
  o('display', 'Display llamativa', 'bold playful display typography', 'tipografía display llamativa y divertida', { hint: 'Alto impacto para títulos cortos.', demo: font('Bungee', { upper: true }) }),
  o('deco', 'Art Déco', 'Art Deco geometric display typography', 'tipografía display geométrica Art Déco', { hint: 'Glamour de los años 20.', demo: font('Poiret One', { upper: true }) }),
  o('retro70', 'Retro 70s', 'chunky groovy 1970s retro typography', 'tipografía retro de los 70, gruesa y ondulada', { hint: 'Groovy y nostálgica.', demo: font('Shrikhand') }),
  o('pixel', 'Pixel', 'pixelated 8-bit bitmap typography', 'tipografía pixelada de 8 bits', { hint: 'Videojuegos retro.', demo: font('Press Start 2P', { upper: true }) }),
  o('stencil', 'Stencil', 'industrial stencil typography', 'tipografía stencil industrial', { hint: 'Militar, industrial, urbano.', demo: font('Stardos Stencil', { weight: 700, upper: true }) }),
];

/** Piezas de diseño: definen el uso declarado y la proporción sugerida. Ver docs/03-diseno-grafico.md §10. */
export const PIEZAS: Option[] = [
  o('logo', 'Logo', 'a simple, flat professional logo in scalable vector style', 'un logo profesional simple y plano en estilo vectorial escalable', { hint: 'La firma visual de una marca.', demo: diagram('piece-logo'), meta: { ratio: [1, 1], purpose: 'brand logo', avoid: ['mockup', 'photorealistic details'] } }),
  o('icono', 'Ícono / app', 'an app icon design with a single bold symbol', 'un diseño de ícono de app', { hint: 'Un símbolo simple que se entienda en tamaño chico.', demo: diagram('piece-icon'), meta: { ratio: [1, 1], purpose: 'app icon' } }),
  o('post', 'Post para redes', 'a social media post design', 'un diseño de post para redes sociales', { hint: 'Un mensaje claro que frene el scroll.', demo: diagram('piece-post'), meta: { ratio: [4, 5], purpose: 'Instagram feed post' } }),
  o('historia', 'Historia / Reel', 'a vertical social media story design', 'un diseño vertical para historia de redes', { hint: 'Vertical; deja libre arriba y abajo.', demo: diagram('piece-story'), meta: { ratio: [9, 16], purpose: 'Instagram story' } }),
  o('flyer', 'Flyer', 'a promotional flyer design', 'un diseño de flyer promocional', { hint: 'Para anunciar un evento, promo o negocio.', demo: diagram('piece-flyer'), meta: { ratio: [4, 5], purpose: 'promotional flyer' } }),
  o('poster', 'Póster', 'a striking poster design', 'un diseño de póster impactante', { hint: 'Una imagen protagonista y un título corto.', demo: diagram('piece-poster'), meta: { ratio: [2, 3], purpose: 'poster' } }),
  o('portada-libro', 'Portada de libro', 'a book cover design', 'un diseño de portada de libro', { hint: 'El título se tiene que leer incluso en miniatura.', demo: diagram('piece-book'), meta: { ratio: [2, 3], purpose: 'book cover' } }),
  o('portada-album', 'Portada de álbum', 'an album cover artwork', 'una portada de álbum musical', { hint: 'Cuadrada; tiene que funcionar chiquita en las apps.', demo: diagram('piece-album'), meta: { ratio: [1, 1], purpose: 'music album cover' } }),
  o('miniatura', 'Miniatura de YouTube', 'a YouTube thumbnail design', 'un diseño de miniatura de YouTube', { hint: 'Sujeto grande, 3 o 4 palabras y mucho contraste.', demo: diagram('piece-thumb'), meta: { ratio: [16, 9], purpose: 'YouTube thumbnail' } }),
  o('banner', 'Banner web', 'a website banner design', 'un diseño de banner web', { hint: 'Horizontal, con espacio para texto a un costado.', demo: diagram('piece-banner'), meta: { ratio: [16, 9], purpose: 'website hero banner' } }),
  o('tarjeta', 'Tarjeta personal', 'a business card design', 'un diseño de tarjeta personal', { hint: 'Mínimo texto y mucho aire.', demo: diagram('piece-card'), meta: { ratio: [7, 4], purpose: 'business card' } }),
  o('sticker', 'Sticker', 'a die-cut sticker design with a white border', 'un diseño de sticker troquelado con borde blanco', { hint: 'Contorno blanco y fondo liso.', demo: diagram('piece-sticker'), meta: { ratio: [1, 1], purpose: 'sticker' } }),
  o('etiqueta', 'Etiqueta / packaging', 'a product label and packaging design', 'un diseño de etiqueta y packaging de producto', { hint: 'Para frascos, cajas y bolsas.', demo: diagram('piece-label'), meta: { ratio: [4, 5], purpose: 'product packaging label' } }),
];

/** Estilos de diseño gráfico (corrientes). */
const D = (id: string, label: string, en: string, es: string, hint: string, colors: string[], conflicts?: string[]) =>
  o(id, label, en, es, { hint, demo: img(label, colors), ...(conflicts ? { conflicts } : {}) });

export const ESTILOS_DISENO: Option[] = [
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
export const LAYOUTS: Option[] = [
  o('l-centrado', 'Centrado', 'centered layout with a clear visual hierarchy', 'diagramación centrada con jerarquía visual clara', { hint: 'Todo al centro: simple y equilibrado.', demo: diagram('layout-center') }),
  o('l-grilla', 'Retícula', 'structured grid layout', 'diagramación en retícula ordenada', { hint: 'Columnas y bloques alineados: orden y claridad.', demo: diagram('layout-grid') }),
  o('l-asimetrico', 'Asimétrico', 'dynamic asymmetric layout', 'diagramación asimétrica dinámica', { hint: 'Moderno y con movimiento.', demo: diagram('layout-asym') }),
  o('l-dividido', 'Dividido en dos', 'split layout, image on one side and text on the other', 'diagramación dividida: imagen de un lado y texto del otro', { hint: 'Mitad imagen, mitad texto.', demo: diagram('layout-split') }),
  o('l-tipografico', 'Tipografía gigante', 'typography-driven layout with oversized headline', 'diagramación tipográfica con titular gigante', { hint: 'El texto es la imagen.', demo: diagram('layout-type') }),
  o('l-imagen-completa', 'Imagen a sangre', 'full-bleed image with text overlay', 'imagen a sangre (ocupa todo) con texto encima', { hint: 'La imagen ocupa todo y el texto va encima.', demo: diagram('layout-fullbleed') }),
  o('l-espacio-texto', 'Espacio para texto', 'leave clean empty space at the top for adding text later', 'dejá espacio limpio arriba para agregar texto después', { hint: 'Útil si vas a poner el texto vos en Canva o similar.', demo: diagram('layout-space') }),
];

/** Elementos gráficos. */
export const ELEMENTOS: Option[] = [
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
  o('f-transparente', 'Transparente', 'transparent background, isolated subject, no shadow', 'fondo transparente, sujeto aislado, sin sombra', { hint: 'Para logos y stickers. Solo algunas IAs lo generan de verdad (ChatGPT por API).', demo: { kind: 'texture', name: 'checker' } }),
  o('f-color', 'Color sólido', 'solid color background from the palette', 'fondo de color sólido de la paleta', { demo: { kind: 'swatch', colors: ['#6d4aff'] } }),
  o('f-degradado', 'Degradado', 'smooth gradient background', 'fondo degradado suave', { demo: { kind: 'gradient', colors: ['#ff9a8b', '#6d4aff'] } }),
  o('f-oscuro', 'Oscuro', 'dark background', 'fondo oscuro', { demo: { kind: 'swatch', colors: ['#111111'] } }),
  o('f-textura', 'Con textura', 'subtle textured background', 'fondo con textura sutil', { demo: { kind: 'texture', name: 'paper' } }),
  o('f-foto', 'Foto ambientada', 'photographic scene background', 'fondo con una escena fotográfica', { demo: img('Fondo fotográfico', ['#7a9e7e', '#e9d8a6']) }),
];
