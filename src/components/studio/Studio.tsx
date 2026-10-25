import type { ComponentChildren } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import type { Power } from '../../engine/assistant';
import type { Step } from '../../engine/types';
import { t } from '../../i18n/es';
import { Backdrop } from '../preview/Backdrop';
import { Actor, LightView, Preview, WeatherLayer } from '../preview/Preview';
import type { Scene } from '../preview/scene';
import { PowerMeter } from '../builder/Game';
import './studio.css';

/** Una zona del set con sus pasos a la vista, los que esconde el modo simple y cuántos tienen algo. */
export interface ZoneInfo {
  id: string;
  title: string;
  icon: string;
  hint: string;
  steps: Step[];
  hidden: number;
  done: number;
  auto: number;
  /** Lo elegido, en pocas palabras, para mostrar en el set. */
  value?: string;
}

export const START = 'inicio';
export const PROMPT = 'prompt';

interface Props {
  zones: ZoneInfo[];
  scene: Scene;
  power: Power;
  /** Zona y paso abiertos: los controla el constructor para que las etiquetas y el asistente puedan abrir un paso. */
  zone: string;
  stepId?: string;
  onOpen: (zone: string, stepId?: string) => void;
  renderStep: (step: Step) => ComponentChildren;
  start: ComponentChildren;
  final: ComponentChildren;
  toggles: ComponentChildren;
  prompt: string;
  hasContent: boolean;
  adapterName?: string;
  onCopy: () => void;
  onOpenAi?: () => void;
  onAdvanced: () => void;
  onLevels: () => void;
}

/** Ángulo base del set según la cámara elegida: desde arriba, desde abajo, de perfil… */
function cameraOf(angle?: string): { rx: number; ry: number; rz: number } {
  switch (angle) {
    case 'cenital':
    case 'aerea':
      return { rx: 32, ry: 0, rz: 0 };
    case 'picado':
      return { rx: 18, ry: 0, rz: 0 };
    case 'contrapicado':
    case 'gusano':
      return { rx: -7, ry: 0, rz: 0 };
    case 'perfil':
      return { rx: 4, ry: 34, rz: 0 };
    case 'tres-cuartos':
    case 'sobre-hombro':
      return { rx: 4, ry: 20, rz: 0 };
    case 'holandes':
      return { rx: 4, ry: 0, rz: -7 };
    default:
      return { rx: 4, ry: 0, rz: 0 };
  }
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/** Visor de la cámara: su tamaño dice qué tan cerca está el plano; su forma, el formato elegido. */
function Viewfinder({ scene, x }: { scene: Scene; x: number }) {
  const [w, h] = scene.ratio;
  const height = clamp(100 - scene.framing * 0.75, 28, 86);
  return (
    <div class={`st-finder guide-${scene.guide ?? 'none'}`} style={{ left: `${x}%`, height: `${height}%`, '--fr': String(w / h) }} aria-hidden="true">
      <i class="st-corner c1" />
      <i class="st-corner c2" />
      <i class="st-corner c3" />
      <i class="st-corner c4" />
      <span class="st-guides" />
      <span class="st-rec">
        ● REC · {w}:{h}
      </span>
    </div>
  );
}

function Pin({ zone, next, onOpen, active }: { zone?: ZoneInfo; next: boolean; active: boolean; onOpen: (id: string) => void }) {
  if (!zone) return null;
  const state = zone.done ? 'done' : zone.auto ? 'auto' : next ? 'next' : 'empty';
  return (
    <button
      type="button"
      class={`st-pin is-${state} ${active ? 'is-active' : ''}`}
      tabIndex={-1}
      aria-hidden="true"
      onClick={(e) => {
        e.stopPropagation();
        onOpen(zone.id);
      }}
    >
      <span class="st-pin-icon">{zone.icon}</span>
      <span class="st-pin-text">
        <b>{zone.title}</b>
        {zone.value && <span>{zone.value}</span>}
      </span>
      {state === 'done' && <em>✓</em>}
      {state === 'auto' && <em>IA</em>}
      {state === 'next' && <em>+</em>}
    </button>
  );
}

/** El set en 3D: cielo y fondo atrás, el piso, el protagonista, la luz, la cámara… Cada parte abre sus opciones. */
function Stage({ scene, zones, power, zone, onOpen }: Pick<Props, 'scene' | 'zones' | 'power' | 'zone'> & { onOpen: (id: string) => void }) {
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const [hint, setHint] = useState(true);
  const drag = useRef<{ x: number; y: number; rx: number; ry: number; moved: boolean } | null>(null);
  const dragged = useRef(false);
  const z = (id: string) => zones.find((x) => x.id === id);
  const nextZone = power.next ? zones.find((x) => x.steps.some((s) => s.id === power.next!.step.id))?.id : undefined;
  const pin = (id: string) => <Pin zone={z(id)} next={nextZone === id} active={zone === id} onOpen={(i) => !dragged.current && onOpen(i)} />;

  const cam = cameraOf(scene.angle);
  const s = scene.subject;
  const x = 50 + ((s?.x ?? 50) - 50) * 0.8;
  const { light } = scene;
  const orb = light.kind === 'sun' || light.kind === 'moon';
  const palette = scene.palette.length ? scene.palette.slice(0, 5) : [];
  const mediumTag = scene.tags.find((tg) => tg.stepId === 'medio');
  const filterTag = scene.tags.find((tg) => tg.stepId === 'filtro');
  const weatherTag = scene.tags.find((tg) => tg.stepId === 'clima') ?? scene.tags.find((tg) => tg.stepId === 'atmosfera');

  useEffect(() => {
    const id = setTimeout(() => setHint(false), 5000);
    return () => clearTimeout(id);
  }, []);

  const down = (e: PointerEvent) => {
    dragged.current = false;
    drag.current = { x: e.clientX, y: e.clientY, rx: rot.x, ry: rot.y, moved: false };
  };
  const move = (e: PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) < 6) return;
    if (!d.moved) {
      d.moved = true;
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      setHint(false);
    }
    setRot({ y: clamp(d.ry + dx * 0.25, -32, 32), x: clamp(d.rx - dy * 0.15, -10, 16) });
  };
  const up = () => {
    dragged.current = Boolean(drag.current?.moved);
    drag.current = null;
  };

  return (
    <div
      class="st-stage"
      // Debajo del piso, el mismo color: en pantallas anchas y bajas el piso no siempre llega al borde.
      style={{ background: scene.ground ? `linear-gradient(0deg, color-mix(in srgb, ${scene.ground} 78%, #000) 0 24%, transparent 24%), ${scene.sky}` : scene.sky }}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
      <LightView light={light.kind === 'sun' || light.kind === 'moon' ? { ...light, kind: 'none' } : light} />
      <div
        class={`st-world ${scene.dof ? 'is-dof' : ''}`}
        style={{ transform: `rotateX(${cam.rx + rot.x}deg) rotateY(${cam.ry + rot.y}deg) rotateZ(${cam.rz}deg)` }}
      >
        <div class="st-sway">
          <div class="st-back">
            <span class="st-tile">
              <Backdrop kind={scene.backdrop} ground={scene.ground} night={scene.night} horizon={100} blur={scene.dof} />
            </span>
            <span class="st-tile">
              <Backdrop kind={scene.backdrop} ground={scene.ground} night={scene.night} horizon={100} blur={scene.dof} />
            </span>
            {orb && (
              <span
                class={`st-orb pv-orb pv-${light.kind}`}
                style={{ left: `${((light.x + 60) / 220) * 100}%`, top: `${18 + light.y * 0.7}%`, background: light.kind === 'sun' ? light.color : undefined, boxShadow: light.glow }}
              >
                {pin('luz')}
              </span>
            )}
            <span class="st-place-pin">{pin('lugar')}</span>
          </div>

          {scene.ground && (
            <div class="st-floor" style={{ '--g': scene.ground }}>
              {s && <span class="st-shadow" style={{ left: `${((x + 40) / 180) * 100}%` }} />}
            </div>
          )}

          {scene.props.map((p, i) => (
            <span key={`${p.glyph}${i}`} class="st-obj st-prop" style={{ left: `${p.x}%`, '--z': `${-70 - i * 12}cqh` }}>
              {p.glyph}
            </span>
          ))}

          {!orb && (
            <span class={`st-obj st-lamp lamp-${light.kind}`} style={{ left: `${clamp(light.x, 22, 92)}%`, '--z': '-30cqh' }}>
              {pin('luz')}
              <span class="st-lamp-head">{light.kind === 'fire' ? '🔥' : light.kind === 'neon' ? '' : '💡'}</span>
              <span class="st-lamp-pole" />
            </span>
          )}

          <span class="st-obj st-actor" style={{ left: `${x}%`, '--z': '-18cqh' }}>
            {pin('protagonista')}
            {s ? <Actor scene={scene} inline /> : <span class="st-ghost">👤</span>}
          </span>
          {scene.companion && (
            <span class="st-obj st-companion" style={{ left: `${x + 14}%`, '--z': '-8cqh' }}>
              {scene.companion.glyph}
            </span>
          )}

          <span class="st-obj st-easel" style={{ left: '13%', '--z': '6cqh' }}>
            {pin('estilo')}
            <span class="st-canvas">{mediumTag?.icon ?? '🖌️'}</span>
            <span class="st-legs" />
          </span>
          <span class="st-obj st-paints" style={{ left: '29%', '--z': '24cqh' }}>
            {pin('color')}
            <span class="st-palette">
              {(palette.length ? palette : ['#cfd4dc', '#e2e5ea', '#b9bfc9', '#d8dbe0']).map((c, i) => (
                <i key={`${c}${i}`} style={{ background: c }} />
              ))}
            </span>
          </span>
          <span class="st-obj st-camera" style={{ left: '85%', '--z': '14cqh' }}>
            {pin('camara')}
            <span class="st-cam-body">🎥</span>
            <span class="st-legs" />
          </span>
          <span class="st-obj st-film" style={{ left: '69%', '--z': '30cqh' }}>
            {pin('revelado')}
            <span class="st-film-roll">{filterTag?.icon ?? '🎞️'}</span>
          </span>
        </div>
      </div>

      <WeatherLayer kinds={scene.weather} />
      <Viewfinder scene={scene} x={x} />
      <span class="st-sky-pin">
        {pin('clima')}
        {weatherTag && <span class="st-sky-glyph">{weatherTag.icon}</span>}
      </span>
      <span class="st-format-pin">{pin('formato')}</span>
      {(rot.x !== 0 || rot.y !== 0) && (
        <button type="button" class="st-center btn btn-sm" onClick={() => setRot({ x: 0, y: 0 })}>
          ⟲ {t.studio.center}
        </button>
      )}
      {hint && <span class="st-hint">↔ {t.studio.dragHint}</span>}
    </div>
  );
}

/** El constructor como un set: el pedido se arma tocando la escena, todo en una sola pantalla. */
export function Studio(props: Props) {
  const { zones, scene, power, zone, stepId, onOpen } = props;
  const [big, setBig] = useState(false);
  const body = useRef<HTMLDivElement>(null);
  const chips = useRef<HTMLDivElement>(null);
  const current = zones.find((x) => x.id === zone);
  const step = current ? current.steps.find((s) => s.id === stepId) ?? current.steps[0] : undefined;

  // Orden de juego: inicio, cada paso de cada zona, y el prompt.
  const order: { zone: string; step?: string }[] = [
    { zone: START },
    ...zones.flatMap((zn) => zn.steps.map((s) => ({ zone: zn.id, step: s.id }))),
    { zone: PROMPT },
  ];
  const pos = order.findIndex((o) => o.zone === zone && (o.step === undefined || o.step === step?.id));
  const go = (i: number) => {
    const o = order[clamp(i, 0, order.length - 1)]!;
    onOpen(o.zone, o.step);
  };

  useEffect(() => {
    body.current?.scrollTo({ top: 0 });
    chips.current?.querySelector<HTMLElement>('[aria-current="true"]')?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [zone, step?.id]);

  const title = zone === START ? t.studio.start : zone === PROMPT ? t.studio.prompt : current?.title;
  const icon = zone === START ? '💡' : zone === PROMPT ? '🏁' : current?.icon;
  const hint = zone === START ? t.studio.startHint : zone === PROMPT ? t.studio.promptHint : current?.hint;

  return (
    <div class="studio">
      <header class="st-hud">
        <PowerMeter power={power} compact />
        <div class="st-tools">
          {props.toggles}
          <button type="button" class="btn btn-sm st-levels" onClick={props.onLevels} title={t.studio.levels}>
            📋<span> {t.studio.levels}</span>
          </button>
        </div>
      </header>

      <div class="st-view">
        <Stage scene={scene} zones={zones} power={power} zone={zone} onOpen={(id) => onOpen(id)} />
        <button type="button" class={`st-result ${big ? 'is-big' : ''}`} onClick={() => setBig((b) => !b)} aria-label={t.studio.result}>
          <Preview scene={scene} compact />
          <span class="st-result-label">
            {t.studio.result} {big ? '⤡' : '⤢'}
          </span>
        </button>
      </div>

      <aside class="st-side">
        <div class="st-zones" ref={chips} role="tablist" aria-label={t.studio.zones}>
          {[{ id: START, icon: '💡', title: t.studio.start, done: 0, auto: 0 }, ...zones, { id: PROMPT, icon: '🏁', title: t.studio.prompt, done: 0, auto: 0 }].map((zn) => (
            <button
              key={zn.id}
              type="button"
              role="tab"
              aria-selected={zn.id === zone}
              aria-current={zn.id === zone ? 'true' : undefined}
              class={`st-chip ${zn.done ? 'is-done' : zn.auto ? 'is-auto' : ''}`}
              onClick={() => onOpen(zn.id)}
            >
              <span aria-hidden="true">{zn.icon}</span>
              {zn.title}
              {zn.done > 0 && <em>{zn.done}</em>}
            </button>
          ))}
        </div>

        <section class="st-panel" aria-label={title}>
          <header class="st-panel-head">
            <span class="st-panel-icon" aria-hidden="true">
              {icon}
            </span>
            <div>
              <h2>{title}</h2>
              <span class="small muted">{hint}</span>
            </div>
          </header>
          {current && (current.steps.length > 1 || current.hidden > 0) && (
            <div class="st-tabs" role="tablist">
              {current.steps.map((s) => (
                <button key={s.id} type="button" role="tab" aria-selected={s.id === step?.id} class="st-tab" onClick={() => onOpen(current.id, s.id)}>
                  {s.title.es}
                </button>
              ))}
              {current.hidden > 0 && (
                <button type="button" class="st-tab is-more" onClick={props.onAdvanced} title={t.studio.moreHelp}>
                  🎛️ {t.studio.more(current.hidden)}
                </button>
              )}
            </div>
          )}
          <div class="st-body" ref={body}>
            {zone === START ? props.start : zone === PROMPT ? props.final : step ? props.renderStep(step) : null}
          </div>
          <nav class="st-nav">
            <button type="button" class="btn btn-sm" disabled={pos <= 0} onClick={() => go(pos - 1)}>
              ← {t.studio.prev}
            </button>
            {pos < order.length - 1 && (
              <button type="button" class="btn btn-sm btn-primary" onClick={() => go(pos + 1)}>
                {t.studio.next} →
              </button>
            )}
          </nav>
        </section>
      </aside>

      <footer class="st-bar">
        <button type="button" class={`st-prompt ${props.hasContent ? '' : 'is-empty'}`} onClick={() => onOpen(PROMPT)}>
          {props.hasContent ? props.prompt : t.studio.empty}
        </button>
        <button type="button" class="btn btn-primary" disabled={!props.hasContent} onClick={props.onCopy}>
          📋 {t.studio.copy}
        </button>
        {props.onOpenAi && props.adapterName && (
          <button type="button" class="btn st-open" disabled={!props.hasContent} onClick={props.onOpenAi}>
            {t.studio.open} {props.adapterName}
          </button>
        )}
      </footer>
    </div>
  );
}
