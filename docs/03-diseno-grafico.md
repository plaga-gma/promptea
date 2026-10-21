# Diseño gráfico: fundamentos para Promptea

> Investigación base de Promptea (pilar 2). Última revisión: 21/10/2026.
> Objetivo: que cada opción de la web esté respaldada por un principio de diseño, y que la web pueda enseñárselo en una línea a quien no sabe diseño.

## 1. Elementos básicos del diseño

| Elemento | Qué es | Cómo se pide en un prompt |
|---|---|---|
| Punto | Foco mínimo de atención | "single focal point", "small accent dot" |
| Línea | Dirección, movimiento, contorno | "thin line art", "bold outlines", "leading lines" |
| Forma | Geométrica u orgánica | "geometric shapes", "organic blob shapes" |
| Textura | Superficie real o simulada | "paper grain", "halftone texture", "glossy" |
| Espacio | Lleno y vacío (espacio negativo) | "generous negative space", "dense composition" |
| Color | Tono, saturación, valor | ver §4 |
| Tipografía | Letra como forma y como mensaje | ver §5 |

## 2. Principios de diseño (lo que hace que algo "se vea bien")

- **Jerarquía**: el ojo debe saber qué mirar primero, segundo y tercero. Se logra con tamaño, peso, color y posición. *En Promptea:* el diseño de piezas pide un titular dominante, un apoyo y un llamado a la acción.
- **Contraste**: diferencias marcadas de tamaño, color, valor o forma. Sin contraste todo pesa igual.
- **Equilibrio**: simétrico (formal, estable) o asimétrico (dinámico, moderno).
- **Alineación**: todo elemento se alinea con otro; da orden aunque el observador no lo note.
- **Proximidad**: lo que va junto se agrupa; lo distinto se separa.
- **Repetición y ritmo**: repetir colores, formas o tipografías crea unidad y sistema.
- **Espacio negativo**: el vacío también diseña; es la marca del minimalismo y del lujo.
- **Unidad**: todo responde a una misma idea visual.
- **Énfasis**: un solo protagonista por pieza.

**Gestalt** (cómo el cerebro agrupa): proximidad, semejanza, continuidad, cierre, figura-fondo, región común. El cierre y la figura-fondo son la base de muchos logos con doble lectura.

## 3. Composición

| Recurso | Efecto | Término para el prompt |
|---|---|---|
| Regla de tercios | Natural, dinámica | "rule of thirds composition" |
| Centrada simétrica | Formal, icónica, potente | "centered symmetrical composition" |
| Proporción áurea / espiral | Armonía clásica | "golden ratio composition" |
| Líneas guía | Lleva la mirada al sujeto | "leading lines" |
| Diagonal | Energía, movimiento | "dynamic diagonal composition" |
| Marco dentro del marco | Profundidad, foco | "frame within a frame" |
| Patrón / repetición | Ritmo, decorativo | "repeating pattern" |
| Capas (primer plano, medio, fondo) | Profundidad | "layered foreground and background" |
| Espacio negativo | Aire, elegancia, lugar para texto | "minimalist, lots of negative space" |
| Plano cenital (flat lay) | Producto, orden | "top-down flat lay" |

**Lectura en Z y en F**: en piezas con texto el ojo recorre en Z (pósters, flyers) o en F (páginas con mucho texto). El titular va donde arranca el recorrido.

**Retícula (grid)**: columnas y márgenes que ordenan una pieza. Estilo suizo = retícula visible y estricta.

### Fotografía y cámara
- **Planos**: gran plano general, general, entero, americano, medio, primer plano, primerísimo primer plano, detalle.
- **Ángulos**: a la altura de los ojos (neutral), picado (vulnerabilidad), contrapicado (poder), cenital, nadir (desde abajo), holandés (inestabilidad), por encima del hombro.
- **Lentes**: gran angular 16–24 mm (espacio, distorsión), normal 35–50 mm (natural), retrato 85 mm (compresión favorecedora), teleobjetivo 200 mm+ (aislamiento), macro (detalle), ojo de pez, tilt-shift (efecto maqueta).
- **Profundidad de campo**: baja (f/1.4–2.8, fondo desenfocado, bokeh) o alta (f/8–16, todo nítido).

## 4. Teoría del color

### Modelos
- **RGB / HEX**: pantallas. Lo que usan las IAs.
- **CMYK**: impresión. Los colores muy saturados de pantalla pueden no imprimirse igual; para piezas impresas conviene avisarlo.
- **HSL**: tono, saturación, luminosidad. Es el modelo con el que Promptea calcula armonías.

### Armonías (círculo cromático)
| Armonía | Construcción | Sensación |
|---|---|---|
| Monocromática | Un tono, varias luminosidades | Elegante, coherente, segura |
| Análoga | 3 tonos vecinos (±30°) | Natural, armónica, tranquila |
| Complementaria | Opuestos (180°) | Máximo contraste, vibrante |
| Complementaria dividida | Base + los dos vecinos del opuesto | Contraste con menos tensión |
| Triádica | 3 tonos a 120° | Lúdica, equilibrada, colorida |
| Tetrádica / cuadrada | 4 tonos (2 pares complementarios) | Rica, difícil de equilibrar |

### Temperatura y valor
- **Cálidos** (rojos, naranjas, amarillos): energía, cercanía, apetito. **Fríos** (azules, verdes, violetas): calma, confianza, tecnología.
- El **contraste de valor** (claro/oscuro) importa más que el de tono para la legibilidad.

### Psicología del color (orientativa, varía por cultura)
| Color | Asociaciones frecuentes |
|---|---|
| Rojo | Pasión, urgencia, energía, comida |
| Naranja | Calidez, entusiasmo, creatividad |
| Amarillo | Optimismo, atención, alegría |
| Verde | Naturaleza, salud, crecimiento, finanzas |
| Azul | Confianza, calma, tecnología, corporativo |
| Violeta | Lujo, misterio, creatividad, espiritualidad |
| Rosa | Ternura, juventud, romanticismo |
| Marrón / tierra | Calidez, artesanal, orgánico |
| Negro | Elegancia, poder, lujo |
| Blanco | Limpieza, simplicidad, espacio |

### Reglas prácticas
- **60-30-10**: 60 % color dominante, 30 % secundario, 10 % acento.
- **Paletas acotadas**: 3 a 5 colores por pieza. Más colores = menos identidad.
- **Accesibilidad (WCAG)**: texto sobre fondo con contraste mínimo 4,5:1 (3:1 para texto grande). Promptea calcula el contraste de las paletas y avisa si el texto sería ilegible.
- **Saturación con intención**: neones y saturados para impacto; desaturados y pastel para calma y sofisticación.

## 5. Tipografía

### Clasificación (base del selector tipográfico)
| Familia | Rasgos | Transmite | Ejemplo libre (Google Fonts) |
|---|---|---|---|
| Serif clásica (garalda) | Remates, contraste suave | Tradición, confianza, editorial | Lora, EB Garamond |
| Serif moderna (didona) | Contraste extremo | Moda, lujo, elegancia | Playfair Display |
| Slab serif | Remates gruesos rectangulares | Robustez, retro, industrial | Roboto Slab |
| Sans geométrica | Círculos y rectas puras | Moderna, tecnológica, limpia | Montserrat |
| Sans grotesca / neo-grotesca | Neutral, sobria | Corporativa, suiza, funcional | Inter |
| Sans humanista | Trazos con origen caligráfico | Cercana, legible, amable | Source Sans 3 |
| Redondeada | Terminaciones redondas | Amigable, infantil, suave | Nunito |
| Condensada | Angosta y alta | Impacto, deportiva, titulares | Oswald |
| Monoespaciada | Mismo ancho por letra | Código, técnica, retro-computadora | JetBrains Mono |
| Manuscrita / script | Ligada, caligráfica | Elegancia, romance, invitaciones | Great Vibes |
| Escrita a mano | Informal | Personal, artesanal, espontánea | Caveat |
| Pincel / marcador | Trazo expresivo | Energía, urbano, juvenil | Permanent Marker |
| Gótica (blackletter) | Quebrada, medieval | Tradición, metal, tatuaje | UnifrakturMaguntia |
| Display decorativa | Fantasía, alto impacto | Lúdica, llamativa | Bungee |
| Art déco | Geometría lineal 1920s | Glamour, vintage elegante | Poiret One |
| Retro 70s | Gruesa, curvas suaves | Nostalgia, groovy | Shrikhand |
| Pixel / bitmap | Cuadrícula de píxeles | Videojuegos, retro digital | Press Start 2P |
| Stencil | Cortes de plantilla | Militar, industrial, urbano | Stardos Stencil |

### Reglas prácticas
- **Máximo 2 familias** por pieza (una para títulos, otra para texto). Contraste claro entre ellas (serif + sans).
- **Jerarquía tipográfica**: tamaño, peso y color; no más de 3 niveles.
- **Interletrado (tracking)** amplio en mayúsculas; **interlineado** generoso en párrafos.
- **Legibilidad** antes que decoración en textos de lectura.
- Para la IA: describir el estilo ("bold condensed sans-serif, all caps") es más confiable que nombrar una fuente; Promptea envía ambos.

## 6. Branding e identidad

### Tipos de logo
| Tipo | Descripción | Cuándo conviene |
|---|---|---|
| Logotipo (wordmark) | Solo el nombre tipográfico | Nombres cortos y distintivos |
| Monograma (lettermark) | Iniciales | Nombres largos |
| Isotipo pictórico | Ícono reconocible | Marcas consolidadas o rubros claros |
| Isotipo abstracto | Forma no figurativa | Tecnología, conceptos abstractos |
| Mascota | Personaje | Marcas cercanas, infantiles, gaming |
| Emblema | Texto dentro de un sello o escudo | Tradición, cervecerías, clubes, educación |
| Combinado (imagotipo) | Ícono + nombre | La opción más versátil |

### Cualidades de un buen logo
Simple, memorable, escalable (se lee a 16 px), versátil (funciona en una tinta y en negativo), atemporal y apropiado al rubro. En prompts: "flat vector logo, simple, minimal, 2 colors, white background, centered, no mockup, no 3D".

### Sistema de marca
Paleta (con HEX), tipografías, estilo de imagen, iconografía, tono. Promptea permite reutilizar la misma paleta y tipografía entre piezas (favoritos).

## 7. Estilos de diseño y movimientos (vocabulario clave)

Selección inicial de estilos que el catálogo debe mostrar con ejemplo visual:
- **Corrientes de diseño**: Minimalismo, Suizo / Tipográfico Internacional, Bauhaus, Art Nouveau, Art Déco, Constructivismo, Memphis, Brutalismo, Psicodelia 60s, Retro 70s, Y2K, Vaporwave, Synthwave, Flat design, Material, Glassmorphism, Neubrutalismo, Corporate Memphis, Diseño editorial, Lujo minimal, Orgánico/natural, Grunge 90s, Punk / collage fanzine.
- **Técnicas de ilustración**: Acuarela, Óleo, Gouache, Tinta, Lápiz, Carbonilla, Line art, Vector plano, Isométrico, Low poly, Pixel art, Arcilla (claymation), Papel recortado, Collage, Risografía, Grabado en linóleo, Serigrafía, Halftone, Vitral, Mosaico, Bordado, Anime, Manga, Cómic, Caricatura, Animación 3D estilizada, Render 3D realista, Fotografía.
- **Estéticas visuales**: Cyberpunk, Steampunk, Solarpunk, Fantasía oscura, Cottagecore, Surrealismo, Pop art, Ukiyo-e, Doble exposición, Glitch, Holográfico/cromado.

Criterio de inclusión: (1) que un no-diseñador lo pueda reconocer viendo un ejemplo, (2) que los modelos lo interpreten de forma consistente y (3) que tenga un nombre estable en inglés. Se evita citar artistas vivos por nombre; se describen los rasgos del estilo.

## 8. Iluminación

| Luz | Efecto | Término |
|---|---|---|
| Hora dorada | Cálida, suave, nostálgica | golden hour |
| Hora azul | Fría, calma, melancólica | blue hour |
| Estudio suave (softbox) | Pareja, limpia, comercial | soft studio lighting, softbox |
| Clave alta | Clara, sin sombras, optimista | high-key lighting |
| Clave baja | Oscura, dramática | low-key lighting |
| Claroscuro | Contraste extremo, pictórico | chiaroscuro |
| Contraluz | Silueta, halo | backlit, rim light |
| Rembrandt | Retrato clásico, triángulo de luz | Rembrandt lighting |
| Mariposa | Glamour, belleza | butterfly lighting |
| Neón | Urbano, nocturno, cyberpunk | neon lighting, pink and blue |
| Volumétrica | Rayos de luz, atmósfera | volumetric light, god rays |
| Nublado | Difusa, sin sombras duras | overcast diffused light |
| Velas | Íntima, cálida | candlelight |
| Luz de luna | Fría, misteriosa | moonlight |
| Mediodía duro | Sombras marcadas, verano | harsh midday sun |

## 9. Retoque y edición

- **Ajustes básicos**: exposición, contraste, altas luces/sombras, balance de blancos, saturación/vibrancia, nitidez.
- **Gradación de color (color grading)**: teal & orange (cine), look de película analógica, blanco y negro, sepia, cross-process, duotono, desaturado, cálido, frío, alto contraste, mate (negros levantados).
- **Efectos**: viñeta, grano, desenfoque de fondo, bokeh, destellos, aberración cromática, glitch, doble exposición, HDR, efecto miniatura.
- **Retoque**: piel natural (conservar textura), quitar imperfecciones, eliminar objetos, cambiar o quitar fondo, reiluminar.
- **Montaje (compositing)**: igualar luz, perspectiva, escala, sombras de contacto y grano.
- **Restauración**: quitar rayas y manchas, recuperar nitidez, colorear fotos en blanco y negro.
- **Expansión (outpainting)**: ampliar el lienzo manteniendo estilo y luz.
- **Regla de oro del retoque**: "menos es más". Promptea pide intensidad sutil por defecto.

## 10. Piezas de diseño: formatos y buenas prácticas

| Pieza | Formato habitual | Claves |
|---|---|---|
| Logo | 1:1 | Simple, vectorial, fondo liso, centrado |
| Ícono / app icon | 1:1 | Un objeto, silueta clara, set coherente |
| Post Instagram | 4:5 (o 1:1) | Un mensaje, titular grande, contraste |
| Historia / Reel | 9:16 | Zona segura arriba y abajo libre de texto |
| Flyer | 4:5 digital, A4/A5 (≈ 1:1,41) impreso | Jerarquía, CTA claro, datos legibles |
| Póster | 2:3 | Imagen protagonista, titular corto |
| Portada de libro | 2:3 | Título legible en miniatura |
| Portada de álbum | 1:1 | Funciona chica (miniatura en apps) |
| Miniatura YouTube | 16:9 | Rostro o sujeto grande, 3–4 palabras, alto contraste |
| Banner web | 16:9 o 3:1 | Espacio para texto a un lado |
| Tarjeta personal | 3,5:2 (≈ 7:4) | Mínimo texto, mucho aire |
| Sticker | 1:1 | Contorno blanco, fondo transparente |
| Packaging / etiqueta | Variable | Mockup aparte del diseño plano |

## Fuentes y referencias
- Lupton, E. y Phillips, J. C., *Diseño gráfico: nuevos fundamentos* (Gustavo Gili).
- Lupton, E., *Pensar con tipos* (Gustavo Gili).
- Itten, J., *El arte del color*.
- Wheeler, A., *Diseño de marcas* (Designing Brand Identity).
- Müller-Brockmann, J., *Sistemas de retículas*.
- W3C, *WCAG 2.2 — Contrast (Minimum)* — https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- Google Fonts (clasificación y fuentes libres de los ejemplos) — https://fonts.google.com/
