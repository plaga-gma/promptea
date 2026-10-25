import { useEffect, useRef, useState } from 'preact/hooks';
import type { IdeaMatch, Power } from '../../engine/assistant';
import type { Area, Preset, Step } from '../../engine/types';
import { t } from '../../i18n/es';

/** Un nivel del mapa, con sus pasos a la vista y cuántos tienen algo elegido. */
export interface StageInfo {
  id: string;
  title: string;
  icon: string;
  steps: Step[];
  done: number;
}

/** El camino de niveles: se puede saltar a cualquiera. */
export function StageMap({ stages, current, onGo }: { stages: StageInfo[]; current: number; onGo: (i: number) => void }) {
  const ref = useRef<HTMLOListElement>(null);
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('[aria-current="step"]')?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [current]);
  return (
    <ol class="map" ref={ref} aria-label={t.game.map}>
      {stages.map((s, i) => {
        const full = s.steps.length > 0 && s.done === s.steps.length;
        const some = s.done > 0;
        return (
          <li key={s.id} class={`map-node${full ? ' full' : some ? ' some' : ''}`}>
            <button type="button" aria-current={i === current ? 'step' : undefined} onClick={() => onGo(i)}>
              <span class="map-icon" aria-hidden="true">
                {full ? '⭐' : s.icon}
              </span>
              <span class="map-title">{s.title}</span>
              {s.steps.length > 0 && (
                <span class="map-count">
                  {s.done}/{s.steps.length}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

/** El "Poder del prompt": una barra de energía con niveles de juego. */
export function PowerMeter({ power, compact }: { power: Power; compact?: boolean }) {
  const [bump, setBump] = useState(false);
  const last = useRef(power.score);
  useEffect(() => {
    if (power.score > last.current) {
      setBump(true);
      const id = setTimeout(() => setBump(false), 450);
      last.current = power.score;
      return () => clearTimeout(id);
    }
    last.current = power.score;
  }, [power.score]);
  return (
    <div class={`power${compact ? ' compact' : ''}${bump ? ' bump' : ''}`} title={t.game.powerHelp}>
      <span class="power-level" aria-hidden="true">
        {power.level.icon}
      </span>
      <div class="power-main">
        <span class="power-label">
          {compact ? power.level.label : `${t.game.power}: ${power.level.label}`}
          <b>{power.score}</b>
        </span>
        <span class="power-bar" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={power.score} aria-label={t.game.power}>
          <i style={{ width: `${power.score}%` }} />
          {power.parts.some((p) => p.auto) && (
            <i class="power-auto" style={{ width: `${Math.min(100, power.score + 4)}%` }} aria-hidden="true" />
          )}
        </span>
      </div>
    </div>
  );
}

/** "Contale tu idea": el asistente lee lo que escribís y elige opciones. */
export function IdeaBox({
  area,
  onApply,
  lastMatches,
  translate,
}: {
  area: Area;
  onApply: (idea: string) => void;
  lastMatches?: { matches: IdeaMatch[]; texts: { key: string; value: string }[] };
  translate?: preact.ComponentChildren;
}) {
  const ideas = area.assistant?.ideas ?? [];
  const [text, setText] = useState('');
  const [hint, setHint] = useState(0);
  useEffect(() => {
    if (ideas.length < 2) return;
    const id = setInterval(() => setHint((h) => (h + 1) % ideas.length), 4500);
    return () => clearInterval(id);
  }, [ideas.length]);
  const submit = (e?: Event) => {
    e?.preventDefault();
    if (text.trim()) onApply(text.trim());
  };
  const dice = () => {
    if (!ideas.length) return;
    const idea = ideas[Math.floor(Math.random() * ideas.length)]!;
    setText(idea);
    onApply(idea);
  };
  const stepTitle = (id: string) => area.steps.find((s) => s.id === id)?.title.es ?? id;
  const optionLabel = (stepId: string, optionId: string) =>
    area.steps.find((s) => s.id === stepId)?.options?.find((o) => o.id === optionId)?.label.es ?? optionId;
  return (
    <form class="idea card" onSubmit={submit}>
      <label class="idea-label" for={`idea-${area.id}`}>
        <span class="idea-bot" aria-hidden="true">
          🤖
        </span>
        <span>
          <b>{t.game.ideaTitle}</b>
          <span class="small muted"> {t.game.ideaHelp}</span>
        </span>
      </label>
      <div class="idea-row">
        <textarea
          id={`idea-${area.id}`}
          rows={2}
          maxLength={400}
          value={text}
          placeholder={ideas[hint] ? `Ej.: ${ideas[hint]}` : ''}
          onInput={(e) => setText((e.currentTarget as HTMLTextAreaElement).value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) submit(e);
          }}
        />
        <div class="idea-actions">
          <button type="submit" class="btn btn-primary" disabled={!text.trim()}>
            ✨ {t.game.ideaGo}
          </button>
          <button type="button" class="btn" onClick={dice} title={t.game.diceHelp}>
            🎲 {t.game.dice}
          </button>
        </div>
      </div>
      {lastMatches && (lastMatches.matches.length > 0 || lastMatches.texts.length > 0) && (
        <div class="understood" role="status">
          <span class="small muted">{t.game.understood}</span>
          <ul class="chips">
            {lastMatches.matches
              .filter((m) => m.optionId)
              .map((m) => (
                <li key={`${m.stepId}${m.optionId}`} class="chip is-static" title={stepTitle(m.stepId)}>
                  {optionLabel(m.stepId, m.optionId)}
                </li>
              ))}
            {lastMatches.texts.map((x) => (
              <li key={x.key} class="chip is-static is-text" title={stepTitle(x.key.split('/')[0]!)}>
                “{x.value}”
              </li>
            ))}
          </ul>
        </div>
      )}
      {translate}
    </form>
  );
}

/** Recetas: puntos de partida de un toque. */
export function Recipes({ presets, onPick }: { presets: Preset[]; onPick: (p: Preset) => void }) {
  if (!presets.length) return null;
  return (
    <section class="recipes" aria-labelledby="recipes-title">
      <h2 id="recipes-title" class="recipes-title">
        {t.game.recipes} <span class="small muted">{t.game.recipesHelp}</span>
      </h2>
      <div class="recipes-row">
        {presets.map((p) => (
          <button key={p.id} type="button" class="recipe" onClick={() => onPick(p)} style={{ '--c1': p.colors[0], '--c2': p.colors[1] ?? p.colors[0] }}>
            <span class="recipe-icon" aria-hidden="true">
              {p.icon}
            </span>
            <b>{p.title.es}</b>
            <span class="small">{p.description.es}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

/** Lo que el asistente sugiere hacer ahora: el paso que más sumaría, con opciones que combinan. */
export function Coach({
  area,
  power,
  onPick,
  onGoStep,
}: {
  area: Area;
  power: Power;
  onPick: (stepId: string, optionId: string) => void;
  onGoStep: (stepId: string) => void;
}) {
  const next = power.next;
  if (!next) {
    return (
      <div class="coach card done">
        <span aria-hidden="true">🏆</span>
        <p>{t.game.coachDone}</p>
      </div>
    );
  }
  const options = next.suggestions.map((id) => next.step.options?.find((o) => o.id === id)).filter(Boolean);
  return (
    <div class="coach card">
      <span class="coach-bot" aria-hidden="true">
        💡
      </span>
      <div>
        <p>
          {t.game.coachNext}{' '}
          <button type="button" class="link" onClick={() => onGoStep(next.step.id)}>
            {next.step.title.es}
          </button>
        </p>
        {options.length > 0 && (
          <div class="chips">
            {options.map((o) => (
              <button key={o!.id} type="button" class="chip" onClick={() => onPick(next.step.id, o!.id)}>
                + {o!.label.es}
              </button>
            ))}
          </div>
        )}
      </div>
      <span class="visually-hidden">{area.title.es}</span>
    </div>
  );
}

/** Logros: se ganan usando el constructor. */
export interface Achievement {
  id: string;
  icon: string;
  title: string;
  got: boolean;
}

export function Achievements({ list }: { list: Achievement[] }) {
  return (
    <ul class="badges" aria-label={t.game.achievements}>
      {list.map((a) => (
        <li key={a.id} class={a.got ? 'got' : ''} title={a.got ? a.title : `${a.title} (${t.game.locked})`}>
          <span aria-hidden="true">{a.got ? a.icon : '🔒'}</span>
          <span class="small">{a.title}</span>
        </li>
      ))}
    </ul>
  );
}

/** Lluvia de papelitos al subir de nivel. Sin animación si el usuario prefiere menos movimiento. */
export function Confetti({ fire }: { fire: number }) {
  const [pieces, setPieces] = useState<number[]>([]);
  useEffect(() => {
    if (!fire) return;
    if (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setPieces(Array.from({ length: 28 }, (_, i) => i + fire * 100));
    const id = setTimeout(() => setPieces([]), 1600);
    return () => clearTimeout(id);
  }, [fire]);
  if (!pieces.length) return null;
  const colors = ['#6d4aff', '#ff6b5b', '#ffd166', '#06d6a0', '#118ab2'];
  return (
    <div class="confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <i
          key={p}
          style={{
            left: `${(i * 37) % 100}%`,
            background: colors[i % colors.length],
            animationDelay: `${(i % 7) * 0.05}s`,
            '--dx': `${((i * 53) % 60) - 30}vw`,
            '--r': `${(i * 97) % 720}deg`,
          }}
        />
      ))}
    </div>
  );
}
