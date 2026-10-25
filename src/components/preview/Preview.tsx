import { useContext } from 'preact/hooks';
import { url } from '../../lib/url';
import { useGoogleFont } from '../demos/Demo';
import { DemoContext, samplePhoto } from '../demos/photos';
import { Backdrop } from './Backdrop';
import type { DesignScene, EditScene, Scene, Sprite } from './scene';
import './preview.css';

/** Unidades relativas al alto del cuadro: los íconos escalan con la vista previa. */
export const fs = (size: number) => `${(size * 0.82).toFixed(1)}cqh`;

function SpriteView({ s, cls = '' }: { s: Sprite; cls?: string }) {
  return (
    <span class={`pv-sprite ${cls}`} style={{ left: `${s.x}%`, top: `${s.y}%`, fontSize: fs(s.size) }}>
      {s.glyph}
    </span>
  );
}

/** Lluvia, nieve, niebla, estrellas y brillos: capas de CSS animadas (quietas si el usuario prefiere menos movimiento). */
export function WeatherLayer({ kinds }: { kinds: Scene['weather'] }) {
  return (
    <>
      {kinds.map((k) =>
        k === 'leaves' || k === 'petals' || k === 'sparkles' ? (
          <span key={k} class={`pv-fall pv-${k}`} aria-hidden="true">
            {Array.from({ length: 6 }, (_, i) => (
              <i key={i} style={{ left: `${8 + i * 16}%`, animationDelay: `${(i * 0.7) % 3}s` }}>
                {k === 'leaves' ? '🍂' : k === 'petals' ? '🌸' : '✨'}
              </i>
            ))}
          </span>
        ) : (
          <span key={k} class={`pv-wx pv-${k}`} aria-hidden="true" />
        ),
      )}
    </>
  );
}

/** Brillo de la luz sobre el borde del sujeto: neón de dos colores, fuego, sol del lado de donde viene. */
function rimOf(light: Scene['light']): string | undefined {
  const side = light.x < 50 ? -1 : 1;
  switch (light.kind) {
    case 'neon':
      return 'drop-shadow(-0.9cqh 0 1.2cqh #ff2bd6cc) drop-shadow(0.9cqh 0 1.2cqh #00e5ffcc)';
    case 'fire':
      return `drop-shadow(${side * 0.8}cqh 0.4cqh 1.4cqh #ff8c32cc)`;
    case 'sun':
      return `drop-shadow(${side * 0.7}cqh -0.3cqh 1.2cqh #ffd166bb)`;
    case 'moon':
      return `drop-shadow(${side * 0.6}cqh -0.3cqh 1.2cqh #a9c4ffaa)`;
    case 'studio':
    case 'rays':
      return 'drop-shadow(0 0 1cqh #ffffffaa)';
    default:
      return undefined;
  }
}

/** El sujeto con lo que lo acompaña: lo que tiene en la mano, su cara y su ropa (en em: escalan con él). */
export function Actor({ scene, inline }: { scene: Scene; inline?: boolean }) {
  const s = scene.subject;
  if (!s) return null;
  return (
    <span
      key={s.glyph}
      class={`pv-sprite pv-subject ${scene.look} ${s.known ? '' : 'pv-unknown'} ${inline ? 'pv-inline' : ''}`}
      style={inline ? undefined : { left: `${s.x}%`, top: `${s.y}%`, fontSize: fs(s.size) }}
    >
      <span class="pv-glyph" style={{ filter: rimOf(scene.light) }}>
        {s.glyph}
      </span>
      {scene.held && <span class="pv-held">{scene.held}</span>}
      {scene.face && <span class="pv-face">{scene.face}</span>}
      {scene.outfit && <span class="pv-outfit">{scene.outfit}</span>}
    </span>
  );
}

export function LightView({ light }: { light: Scene['light'] }) {
  if (light.kind === 'sun' || light.kind === 'moon')
    return (
      <span
        class={`pv-orb pv-${light.kind}`}
        style={{ left: `${light.x}%`, top: `${light.y}%`, background: light.kind === 'moon' ? undefined : light.color, boxShadow: light.glow }}
      />
    );
  if (light.kind === 'none') return null;
  return <span class={`pv-light pv-${light.kind}`} style={{ '--lx': `${light.x}%`, '--ly': `${light.y}%` }} />;
}

function GenerateView({ scene }: { scene: Scene }) {
  const s = scene.subject;
  const base = s ? s.y + s.size * 0.42 : 0;
  return (
    <div
      class={`pv-scene view-${scene.view} ${scene.dof ? 'is-dof' : ''} ${scene.lens ? `lens-${scene.lens}` : ''}`}
      style={{ background: scene.sky, filter: scene.filter, transform: scene.tilt ? `rotate(${scene.tilt}deg) scale(1.18)` : undefined }}
    >
      <LightView light={scene.light} />
      <Backdrop kind={scene.backdrop} ground={scene.ground} night={scene.night} horizon={scene.horizon} blur={scene.dof} />
      {scene.props.map((p, i) => (
        <SpriteView key={`${p.glyph}${i}`} s={p} cls="pv-prop" />
      ))}
      {scene.ground && <span class="pv-ground" style={{ top: `${scene.horizon}%`, background: scene.ground }} />}
      {s && scene.ground && base < 100 && (
        <span class="pv-shadow" style={{ left: `${s.x}%`, top: `${Math.max(base, scene.horizon + 1)}%`, width: fs(s.size * 0.75), height: fs(s.size * 0.12) }} />
      )}
      <Actor scene={scene} />
      {scene.companion && <SpriteView s={scene.companion} cls={`pv-companion ${scene.look}`} />}
      <WeatherLayer kinds={scene.weather} />
      {scene.lens === 'tiltshift' && <span class="pv-tilt" />}
      {scene.palette.length > 0 && (
        <span class="pv-palette" aria-hidden="true">
          {scene.palette.slice(0, 5).map((c) => (
            <i key={c} style={{ background: c }} />
          ))}
        </span>
      )}
      {scene.overlay && <span class={`ov ov-${scene.overlay}`} />}
      {scene.texture && <span class={`pv-tx tx tx-${scene.texture}`} />}
    </div>
  );
}

function DesignView({ scene, d }: { scene: Scene; d: DesignScene }) {
  const sample = `${d.title} ${d.subtitle} ${d.cta}`;
  useGoogleFont(d.font?.family ?? 'Inter', d.font?.weight, sample, Boolean(d.font));
  const font = d.font ? `'${d.font.family}', var(--font)` : undefined;
  const title = d.font?.upper ? d.title.toUpperCase() : d.title;
  // La palabra más larga decide el tamaño máximo del título, para que entre a lo ancho.
  const longest = Math.max(4, ...title.split(/\s+/).map((w) => w.length));
  const isLogo = d.piece === 'logo' || d.piece === 'icono' || d.piece === 'mascota-marca';
  return (
    <div
      class={`pv-scene pv-design ${isLogo ? 'pv-logo' : d.layout} ${d.checker ? 'pv-checker' : ''}`}
      style={{ background: d.checker ? undefined : d.background, color: d.ink, filter: scene.filter, '--accent': d.accent, '--ink': d.ink, '--lw': longest }}
    >
      {d.elements.includes('e-formas') && <span class="pv-shape pv-circle" />}
      {d.elements.includes('e-organicas') && <span class="pv-shape pv-blob" />}
      {d.elements.includes('e-lineas') && <span class="pv-shape pv-lines" />}
      {d.elements.includes('e-degradado') && <span class="pv-shape pv-grad" />}
      {d.elements.includes('e-patron') && <span class="pv-shape pv-pattern" />}
      {d.elements.includes('e-marco') && <span class="pv-shape pv-frame" />}
      <span class="pv-art" key={d.glyph}>
        {d.glyph}
      </span>
      <span class="pv-copy">
        <b class="pv-title" style={{ fontFamily: font, fontWeight: d.font?.weight ?? 800, fontStyle: d.font?.italic ? 'italic' : undefined }}>
          {title}
        </b>
        {d.subtitle && <span class="pv-sub">{d.subtitle}</span>}
        {d.cta && <span class="pv-cta">{d.cta}</span>}
      </span>
      {d.elements.includes('e-destellos') && <span class="pv-deco pv-d1">✨</span>}
      {d.elements.includes('e-flechas') && <span class="pv-deco pv-d2">↗</span>}
      {d.elements.includes('e-stickers') && <span class="pv-deco pv-d3">🏷️</span>}
      {d.mockup && <span class="pv-mockup">{d.mockup}</span>}
      {scene.overlay && <span class={`ov ov-${scene.overlay}`} />}
      {scene.texture && <span class={`pv-tx tx tx-${scene.texture}`} />}
    </div>
  );
}

function EditView({ e }: { e: EditScene }) {
  const { photo } = useContext(DemoContext);
  const p = samplePhoto(photo);
  const src = url(`/${p.src}`);
  const focus = { '--fx': `${p.focus[0]}%`, '--fy': `${p.focus[1]}%` };
  return (
    <div class="pv-scene pv-edit" style={focus}>
      <div class="pv-half pv-before">
        <img src={src} alt="" />
      </div>
      {/* El después tapa la foto desde el centro del sujeto: la línea parte la imagen en antes y después. */}
      <div class={`pv-half pv-after ${e.checker ? 'pv-checker' : ''}`}>
        {e.newBackground && <span class="pv-newbg">{e.newBackground}</span>}
        {e.blurBackground && <img class="pv-blur" src={src} alt="" />}
        <img
          class={e.checker || e.blurBackground || e.newBackground ? 'pv-cut' : ''}
          src={src}
          alt=""
          style={{ filter: e.after.css, opacity: 0.35 + e.strength * 0.65 }}
        />
        {e.after.overlay && <span class={`ov ov-${e.after.overlay}`} style={{ opacity: e.strength }} />}
        {e.title && <b class="pv-edit-title">{e.title}</b>}
      </div>
      <span class="pv-split" />
      <span class="pv-ops">
        {e.ops.map((o) => (
          <span key={o.id} class="pv-op" title={o.label}>
            {o.glyph}
          </span>
        ))}
      </span>
    </div>
  );
}

interface Props {
  scene: Scene;
  /** Vista chica (celular, barra de arriba): sin etiquetas. */
  compact?: boolean;
  onTag?: (stepId: string) => void;
}

/** Resumen gráfico del pedido. Se redibuja con cada elección. */
export function Preview({ scene, compact, onTag }: Props) {
  const [w, h] = scene.ratio;
  return (
    <div class={`pv ${compact ? 'pv-compact' : ''}`}>
      <figure class="pv-frame" style={{ aspectRatio: `${w} / ${h}`, '--pv-r': String(w / h) }} aria-label="Vista previa simplificada de tu pedido">
        {scene.empty ? (
          <div class="pv-scene pv-empty">
            <span>🖼️</span>
            {!compact && <small>Elegí opciones y tu idea aparece acá</small>}
          </div>
        ) : scene.mode === 'design' && scene.design ? (
          <DesignView scene={scene} d={scene.design} />
        ) : scene.mode === 'edit' && scene.edit ? (
          <EditView e={scene.edit} />
        ) : (
          <GenerateView scene={scene} />
        )}
        {!scene.empty && <span class="pv-ratio">{w}:{h}</span>}
      </figure>
      {!compact && scene.tags.length > 0 && (
        <ul class="pv-tags" aria-label="Lo que pediste">
          {scene.tags.map((t, i) => (
            <li key={`${t.stepId}${t.label}${i}`}>
              <button type="button" class={`pv-tag ${t.auto ? 'is-auto' : ''}`} onClick={() => onTag?.(t.stepId)} title={t.auto ? 'Lo eligió el asistente' : undefined}>
                <span aria-hidden="true">{t.icon}</span>
                {t.label}
                {t.auto && <em>IA</em>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
