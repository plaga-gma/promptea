# Cómo contribuir a Promptea

¡Gracias por sumarte! Algunas pautas para que todo se mantenga claro y coherente.

## Principios
1. **Todo contenido se apoya en los dos pilares**: ingeniería de prompts y diseño gráfico. Si agregás una opción, tiene que existir un motivo de diseño o de prompting detrás (ver `docs/`).
2. **Elegir viendo, no leyendo**: cada opción nueva necesita una demo visual.
3. **Enseñar en una línea**: cada opción lleva una explicación corta (`hint`) pensada para alguien que no sabe de diseño.
4. **Rendimiento primero**: nada de librerías pesadas; imágenes en WebP chicas y con carga diferida.

## Flujo
1. Hacé un fork y una rama: `git checkout -b mi-cambio`.
2. `npm install`, `npm run dev`.
3. Antes de enviar: `npm test` y `npm run build` sin errores.
4. Abrí un pull request explicando qué cambia y por qué.

## Dónde tocar
- Opciones del catálogo: `src/sections/imagenes/library/`.
- Pasos de cada área: `src/sections/imagenes/areas/`.
- Reglas de una IA: `src/engine/adapters/`.
- Una sección nueva: `src/sections/<nueva>/` y registrarla en `src/sections/index.ts`.

Más detalle en [docs/05-arquitectura.md](docs/05-arquitectura.md).
