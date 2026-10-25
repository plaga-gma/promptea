import type { Backdrop as Kind } from './glyphs';

/**
 * Siluetas del fondo (colinas, montañas, edificios, olas, una habitación…), en SVG que se estira a lo ancho.
 * Los colores salen del suelo de la escena, mezclados con el cielo para dar profundidad.
 */

/** Alturas fijas (no al azar) para que el dibujo no cambie en cada redibujo. */
const H = [9, 13, 7, 15, 11, 8, 14, 10, 12, 6, 13, 9, 11, 15, 8];

const trees = (n: number, base: number, scale: number, offset = 0) =>
  Array.from({ length: n }, (_, i) => {
    const w = 100 / n;
    const x = i * w - w * 0.2 + offset;
    const h = H[(i + offset) % H.length]! * scale;
    return `M${x.toFixed(1)} ${base} L${(x + w * 0.7).toFixed(1)} ${(base - h).toFixed(1)} L${(x + w * 1.4).toFixed(1)} ${base} Z`;
  }).join(' ');

const BUILDINGS_FAR: [number, number, number][] = [[0, 9, 18], [8, 7, 26], [14, 10, 14], [23, 6, 30], [28, 9, 20], [36, 8, 34], [43, 10, 16], [52, 7, 28], [58, 9, 22], [66, 6, 32], [71, 10, 18], [80, 8, 27], [87, 7, 15], [93, 7, 24]];
const BUILDINGS_NEAR: [number, number, number][] = [[-2, 14, 16], [11, 11, 22], [21, 13, 12], [33, 12, 19], [60, 13, 15], [72, 11, 24], [82, 14, 13], [94, 10, 20]];

function City({ night }: { night: boolean }) {
  const lit = night ? '#ffd166' : '#ffffff';
  return (
    <>
      <g class="bd-far">
        {BUILDINGS_FAR.map(([x, w, h]) => (
          <rect key={x} x={x} y={40 - h} width={w} height={h} />
        ))}
      </g>
      <g class="bd-near">
        {BUILDINGS_NEAR.map(([x, w, h]) => (
          <rect key={x} x={x} y={40 - h} width={w} height={h} />
        ))}
      </g>
      <g fill={lit} opacity={night ? 0.9 : 0.35}>
        {BUILDINGS_NEAR.flatMap(([x, w, h]) =>
          Array.from({ length: Math.floor(h / 4) }, (_, r) =>
            Array.from({ length: Math.floor(w / 3.5) }, (_, c) =>
              (r * 7 + c * 3 + x) % 4 === 0 ? null : <rect key={`${x}-${r}-${c}`} x={x + 1.2 + c * 3.5} y={40 - h + 1.5 + r * 4} width={1.6} height={1.8} />,
            ),
          ),
        )}
      </g>
    </>
  );
}

function shape(kind: Kind, night: boolean) {
  switch (kind) {
    case 'mountains':
    case 'snow':
      return (
        <>
          <path class="bd-far" d="M0 40 L0 26 L12 14 L20 22 L32 5 L44 20 L52 13 L64 24 L76 7 L88 20 L100 11 L100 40 Z" />
          <path fill="#fff" opacity="0.85" d="M28.6 9.8 L32 5 L35.4 10 L33.2 9 L31 10.6 Z M72.8 11 L76 7 L79.4 11.4 L77 10.4 L75 11.8 Z M10 16.5 L12 14 L14 16.2 L12.6 15.6 Z" />
          {kind === 'snow' ? (
            <path class="bd-tree" d={trees(9, 40, 0.9, 2)} />
          ) : (
            <path class="bd-near" d="M0 40 L0 31 L18 22 L30 30 L46 20 L62 31 L80 24 L100 32 L100 40 Z" />
          )}
        </>
      );
    case 'forest':
      return (
        <>
          <path class="bd-far" d={trees(14, 40, 1.4)} />
          <path class="bd-near" d={trees(8, 40, 2, 3)} />
        </>
      );
    case 'city':
      return <City night={night} />;
    case 'sea':
      return (
        <>
          <path class="bd-far" d="M70 32 Q78 25 86 32 Z" />
          <rect class="bd-water" x="0" y="31" width="100" height="9" />
          <path class="bd-wave" d="M4 34 q3 -1.4 6 0 M30 36.5 q3 -1.4 6 0 M58 34.5 q3 -1.4 6 0 M82 37 q3 -1.4 6 0 M16 38.5 q3 -1.2 6 0" />
        </>
      );
    case 'dunes':
      return (
        <>
          <path class="bd-far" d="M0 40 L0 27 C20 18 35 31 55 23 S85 18 100 25 L100 40 Z" />
          <path class="bd-near" d="M0 40 L0 33 C25 27 45 37 70 30 S90 31 100 32 L100 40 Z" />
        </>
      );
    case 'room':
      return (
        <>
          <path class="bd-wall" fill-rule="evenodd" d="M0 0 H100 V40 H0 Z M62 6 h24 v20 h-24 Z" />
          <path class="bd-line" d="M62 6 h24 v20 h-24 Z M74 6 v20 M62 16 h24" />
          <rect class="bd-frame" x="12" y="9" width="14" height="10" />
          <path class="bd-line" d="M8 28 h26" />
          <rect class="bd-near" x="0" y="37" width="100" height="3" />
        </>
      );
    case 'stage':
      return (
        <>
          <polygon fill="#fff" opacity="0.13" points="50,0 33,40 67,40" />
          <path fill="#9d0208" d="M0 0 H16 Q11 20 17 40 H0 Z M100 0 H84 Q89 20 83 40 H100 Z" />
          <path fill="#6a040f" d="M0 0 H100 V5 Q95 8 90 5 Q85 8 80 5 Q75 8 70 5 Q65 8 60 5 Q55 8 50 5 Q45 8 40 5 Q35 8 30 5 Q25 8 20 5 Q15 8 10 5 Q5 8 0 5 Z" />
        </>
      );
    case 'space':
      return (
        <>
          <g fill="#fff">
            {H.map((h, i) => (
              <circle key={i} cx={(i * 37 + 11) % 100} cy={(h * 2.3 + i * 5) % 38} r={i % 3 === 0 ? 0.5 : 0.3} />
            ))}
          </g>
          <circle cx="18" cy="12" r="5" fill="#c77dff" />
          <ellipse cx="18" cy="12" rx="9" ry="2" fill="none" stroke="#e0aaff" stroke-width="0.7" />
        </>
      );
    case 'clouds':
      return (
        <g fill="#fff" opacity="0.92">
          <ellipse cx="14" cy="30" rx="10" ry="4" />
          <ellipse cx="20" cy="27" rx="6" ry="4" />
          <ellipse cx="78" cy="22" rx="12" ry="4" />
          <ellipse cx="72" cy="19" rx="6" ry="4" />
          <ellipse cx="50" cy="36" rx="16" ry="4" />
        </g>
      );
    default:
      return (
        <>
          <path class="bd-far" d="M0 40 L0 23 Q15 13 30 21 T60 19 T100 17 L100 40 Z" />
          <path class="bd-near" d="M0 40 L0 31 Q20 23 40 30 T80 28 T100 29 L100 40 Z" />
        </>
      );
  }
}

/** Las que tapan todo el cielo (una habitación, un escenario, el espacio) van de arriba hasta el horizonte. */
export const FULL_BACKDROPS: Kind[] = ['room', 'stage', 'space', 'clouds'];

export function Backdrop({ kind, ground, night, horizon, blur }: { kind: Kind; ground?: string; night: boolean; horizon: number; blur?: boolean }) {
  const full = FULL_BACKDROPS.includes(kind);
  const g = ground ?? (night ? '#1b2340' : '#9bc59d');
  return (
    <svg
      class={`pv-backdrop bd-${kind} ${night ? 'is-night' : ''} ${blur ? 'is-blur' : ''}`}
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{
        '--bd-g': g,
        '--bd-sky': night ? '#1d2b53' : '#e3f0ff',
        top: full ? '0' : `calc(${Math.min(horizon, 100)}% - 34%)`,
        height: full ? `${Math.min(horizon, 100)}%` : '34%',
      }}
    >
      {shape(kind, night)}
    </svg>
  );
}
