import { useContext, useEffect, useRef, useState } from 'preact/hooks';
import { detailKey, detailsOf, NOTE_MAX, noteKey, targetKey, targetOf } from '../../engine/build';
import { Fragment } from 'preact';
import { harmonyPalette, bestTextPair, HARMONIES, type Harmony } from '../../engine/color';
import type { Detail, Option, SegmentRole, SelectionValue, Selections, Step } from '../../engine/types';
import { t } from '../../i18n/es';
import { url } from '../../lib/url';
import { Demo } from '../demos/Demo';
import { DemoContext, SAMPLE_PHOTOS } from '../demos/photos';

interface Props {
  step: Step;
  index: number;
  value: SelectionValue | undefined;
  /** Todas las elecciones: las subopciones y notas de cada opción viven en claves propias. */
  selections: Selections;
  onChange: (value: SelectionValue | undefined) => void;
  onSetKey: (key: string, value: SelectionValue | undefined) => void;
  /** Lo que eligió el asistente para este paso vacío, si eligió algo. */
  auto?: Option;
  /** El usuario no quiere que el asistente complete este paso. */
  skipped?: boolean;
  onAuto?: (action: 'keep' | 'skip' | 'allow') => void;
}

type GridProps = Pick<Props, 'step' | 'value' | 'onChange' | 'selections' | 'onSetKey'>;

const COLLAPSED = 12;
/** Con listas largas, la vista "Todos" muestra las primeras de cada categoría. */
const GROUP_PREVIEW = 4;
const PREVIEW_FROM = 40;

/** Ejemplos para la nota según de qué trata el paso. */
const NOTE_EXAMPLES: Partial<Record<SegmentRole, string>> = {
  operation: 'Ej.: que no se note el borde del recorte',
  lighting: 'Ej.: que la luz entre por la ventana de la izquierda',
  style: 'Ej.: con trazos más sueltos y un poco de textura',
  color: 'Ej.: que el violeta sea el color principal',
  typography: 'Ej.: letras un poco inclinadas, con aire de cartel viejo',
  medium: 'Ej.: para usar como fondo de una presentación',
  mood: 'Ej.: que se sienta como un domingo a la tarde',
};

function OptionCard({ option, selected, more, onClick }: { option: Option; selected: boolean; more: boolean; onClick: () => void }) {
  return (
    <button type="button" class="opt" aria-pressed={selected} onClick={onClick}>
      <Demo demo={option.demo} label={option.label.es} />
      <span class="opt-label">{option.label.es}</span>
      {option.hint && <span class="opt-hint">{option.hint.es}</span>}
      {more && <span class="opt-more">{t.builder.hasDetails}</span>}
    </button>
  );
}

/** Puntito de color para las subopciones que tienen colores (cielos, neón, pelo…). */
function Dot({ option }: { option: Option }) {
  const d = option.demo;
  const colors = d?.kind === 'swatch' || d?.kind === 'gradient' ? d.colors : undefined;
  if (!colors?.length) return null;
  const bg = colors.length === 1 ? colors[0] : `linear-gradient(135deg, ${colors.join(', ')})`;
  return <span class="dot" style={{ background: bg }} aria-hidden="true" />;
}

function DetailRow({ step, option, detail, selections, onSetKey }: { step: Step; option: Option; detail: Detail } & Pick<Props, 'selections' | 'onSetKey'>) {
  const key = detailKey(step.id, option.id, detail.id);
  const v = selections[key];
  const chosen = Array.isArray(v) ? v : typeof v === 'string' ? [v] : [];
  const multi = detail.type !== 'single';
  const max = detail.max ?? Infinity;
  const toggle = (id: string) => {
    let next: string[];
    if (chosen.includes(id)) next = chosen.filter((c) => c !== id);
    else if (!multi) next = [id];
    else next = [...chosen, id].slice(-max);
    onSetKey(key, next.length ? next : undefined);
  };
  return (
    <div class="detail" role="group" aria-label={detail.label.es}>
      <span class="detail-label">
        {detail.label.es}
        <span class="muted"> · {!multi ? t.builder.pickOneDetail : detail.max ? t.builder.upTo(detail.max).toLowerCase() : t.builder.pickMany}</span>
      </span>
      <div class="chips">
        {detail.options.map((o) => (
          <button key={o.id} type="button" class="chip" aria-pressed={chosen.includes(o.id)} title={o.hint?.es} onClick={() => toggle(o.id)}>
            <Dot option={o} />
            {o.label.es}
          </button>
        ))}
      </div>
    </div>
  );
}

/** "Contalo con tus palabras" de una operación de Edición: qué quitar, qué cambiar, por qué fondo… */
function TargetField({ step, option, selections, onSetKey }: { step: Step; option: Option } & Pick<Props, 'selections' | 'onSetKey'>) {
  const key = targetKey(step.id, option.id);
  const v = selections[key];
  const text = typeof v === 'string' ? v : '';
  const fromDetail = detailsOf(step, option).some((d) => d.fillsTarget);
  // Con una idea elegida arriba (un tipo de cielo, un corte de pelo…), escribir pasa a ser opcional.
  const filled = Boolean(targetOf(step, option, { ...selections, [key]: '' }));
  const id = `target-${step.id}-${option.id}`;
  return (
    <div class="note field target">
      <label for={id}>
        {t.builder.targetLabel}
        {!filled && <span class="tag req">{t.builder.required}</span>}
      </label>
      <textarea
        id={id}
        rows={2}
        maxLength={300}
        placeholder={filled ? t.builder.targetOptional : (option.meta?.targetHint ?? '')}
        value={text}
        onInput={(e) => onSetKey(key, (e.currentTarget as HTMLTextAreaElement).value || undefined)}
      />
      <span class="small muted">{fromDetail && !filled ? 'Elegí una idea arriba o escribilo. ' : ''}{t.builder.targetHelp}</span>
    </div>
  );
}

/** Lo que se abre debajo de una opción elegida: sus subopciones y una nota libre. */
function Refine({
  step,
  option,
  selections,
  onSetKey,
  reveal,
}: { step: Step; option: Option; reveal?: boolean } & Pick<Props, 'selections' | 'onSetKey'>) {
  const details = detailsOf(step, option);
  const box = useRef<HTMLDivElement>(null);
  // Recién tocada: que el recuadro quede a la vista (sobre todo en el celular).
  useEffect(() => {
    if (reveal) box.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, []);
  const nKey = noteKey(step.id, option.id);
  const note = typeof selections[nKey] === 'string' ? (selections[nKey] as string) : '';
  const [noteOpen, setNoteOpen] = useState(note !== '');
  const inputRef = useRef<HTMLInputElement>(null);
  const openNote = () => {
    setNoteOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };
  return (
    <div ref={box} class={`refine${details.length || option.meta?.needsTarget ? '' : ' compact'}`}>
      <p class="refine-title">
        <span class="refine-check" aria-hidden="true">✓</span> <strong>{option.label.es}</strong>
        {details.length > 0 && <span class="muted"> · {t.builder.refine}</span>}
        {!noteOpen && (
          <button type="button" class="btn btn-sm btn-ghost add-note" onClick={openNote}>
            {t.builder.addNote}
          </button>
        )}
      </p>
      {details.map((d) => (
        <DetailRow key={d.id} step={step} option={option} detail={d} selections={selections} onSetKey={onSetKey} />
      ))}
      {option.meta?.needsTarget && <TargetField step={step} option={option} selections={selections} onSetKey={onSetKey} />}
      {noteOpen && (
        <div class="note field">
          <label for={`nota-${step.id}-${option.id}`}>{t.builder.noteLabel(option.label.es)}</label>
          <div class="note-row">
            <input
              ref={inputRef}
              id={`nota-${step.id}-${option.id}`}
              type="text"
              maxLength={NOTE_MAX}
              placeholder={NOTE_EXAMPLES[step.role] ?? 'Ej.: algo que no encontraste en las opciones'}
              value={note}
              onInput={(e) => onSetKey(nKey, (e.currentTarget as HTMLInputElement).value || undefined)}
            />
            <button
              type="button"
              class="btn btn-sm btn-ghost"
              aria-label={t.builder.removeNote}
              title={t.builder.removeNote}
              onClick={() => {
                onSetKey(nKey, undefined);
                setNoteOpen(false);
              }}
            >
              ✕
            </button>
          </div>
          <span class="small muted">{t.builder.noteTip}</span>
        </div>
      )}
    </div>
  );
}

/** Elegir sobre qué foto se ven los filtros. La elección se comparte con todos los pasos. */
function SamplePicker() {
  const { photo, setPhoto } = useContext(DemoContext);
  return (
    <div class="samples" role="group" aria-label={t.builder.samplePhoto}>
      <span class="small muted">{t.builder.samplePhoto}:</span>
      {SAMPLE_PHOTOS.map((p) => (
        <button key={p.id} type="button" class="sample" aria-pressed={photo === p.id} onClick={() => setPhoto(p.id)}>
          <img src={url(`/${p.src}`)} alt="" loading="lazy" decoding="async" />
          {p.label}
        </button>
      ))}
    </div>
  );
}

function OptionGrid({ step, value, onChange, selections, onSetKey }: GridProps) {
  const [group, setGroup] = useState<string>('all');
  const [expanded, setExpanded] = useState(false);
  const toolbar = useRef<HTMLDivElement>(null);
  const selected = Array.isArray(value) ? value : typeof value === 'string' ? [value] : [];
  const max = step.type === 'multi' ? (step.max ?? Infinity) : 1;

  // La última opción que se tocó: su recuadro de subopciones se lleva a la vista al abrirse.
  const [touched, setTouched] = useState<string | null>(null);

  const toggle = (id: string) => {
    setTouched(id);
    if (step.type === 'single') return onChange(selected[0] === id ? undefined : id);
    if (selected.includes(id)) {
      const next = selected.filter((s) => s !== id);
      return onChange(next.length ? next : undefined);
    }
    // Al llegar al máximo, la opción más vieja deja lugar a la nueva.
    const next = [...selected, id];
    onChange(next.length > max ? next.slice(next.length - max) : next);
  };

  const options = step.options ?? [];
  const byId = new Map(options.map((o) => [o.id, o]));
  // Las subopciones se abren pegadas a la tarjeta elegida: el recuadro ocupa toda la fila siguiente
  // y, con `grid-auto-flow: dense`, las tarjetas que siguen completan la fila de la elegida.
  const rendered = new Set<string>();
  const card = (o: Option) => {
    const isOn = selected.includes(o.id);
    if (isOn) rendered.add(o.id);
    return (
      <Fragment key={o.id}>
        <OptionCard option={o} selected={isOn} more={Boolean(o.details?.length)} onClick={() => toggle(o.id)} />
        {isOn && <Refine step={step} option={o} selections={selections} onSetKey={onSetKey} reveal={touched === o.id} />}
      </Fragment>
    );
  };
  const openGroup = (id: string) => {
    setGroup(id);
    toolbar.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onPhoto = options.some((o) => o.demo?.kind === 'filter' || o.demo?.kind === 'compare' || o.demo?.kind === 'strength');
  const chosen = selected.map((id) => byId.get(id)).filter((o): o is Option => Boolean(o));

  let body;
  if (step.groups && group === 'all') {
    // Vista "Todos": cada categoría con su título. Con listas largas, solo las primeras de cada una.
    const preview = options.length > PREVIEW_FROM;
    body = step.groups.map((g) => {
      const all = g.optionIds.map((id) => byId.get(id)).filter((o): o is Option => Boolean(o));
      const shown = preview ? all.filter((o, i) => i < GROUP_PREVIEW || selected.includes(o.id)) : all;
      return (
        <div class="cat" key={g.id}>
          <h3 class="cat-title">
            {g.label.es} <span class="muted">{all.length}</span>
          </h3>
          <div class="grid">{shown.map(card)}</div>
          {shown.length < all.length && (
            <button type="button" class="btn btn-sm btn-ghost cat-more" onClick={() => openGroup(g.id)}>
              {t.builder.seeGroup(all.length, g.label.es)} →
            </button>
          )}
        </div>
      );
    });
  } else {
    const inGroup = step.groups ? step.groups.find((g) => g.id === group)?.optionIds ?? [] : null;
    const filtered = inGroup ? inGroup.map((id) => byId.get(id)).filter((o): o is Option => Boolean(o)) : options;
    const collapsible = !inGroup && filtered.length > COLLAPSED + 2;
    const shown = collapsible && !expanded ? filtered.slice(0, COLLAPSED) : filtered;
    body = (
      <>
        <div class="grid">{shown.map(card)}</div>
        {collapsible && (
          <button type="button" class="btn btn-sm more" onClick={() => setExpanded(!expanded)}>
            {expanded ? t.builder.showLess : t.builder.showAll(filtered.length)}
          </button>
        )}
      </>
    );
  }

  return (
    <>
      {onPhoto && <SamplePicker />}
      {step.groups && (
        <div class="groups" role="toolbar" aria-label="Categorías" ref={toolbar}>
          <button type="button" class="chip" aria-pressed={group === 'all'} onClick={() => setGroup('all')}>
            {t.builder.all}
          </button>
          {step.groups.map((g) => (
            <button key={g.id} type="button" class="chip" aria-pressed={group === g.id} onClick={() => setGroup(g.id)}>
              {g.label.es}
            </button>
          ))}
        </div>
      )}
      {body}
      {/* Elegidas que no están a la vista (por ejemplo, de otra categoría): su recuadro va al final. */}
      {chosen
        .filter((o) => !rendered.has(o.id))
        .map((o) => (
          <Refine key={o.id} step={step} option={o} selections={selections} onSetKey={onSetKey} />
        ))}
    </>
  );
}

function ColorStep({ step, value, onChange, selections, onSetKey }: GridProps) {
  const record = value && typeof value === 'object' && !Array.isArray(value) ? value : undefined;
  const [open, setOpen] = useState(Boolean(record && !record.palette && record.colors));
  const [base, setBase] = useState('#6d4aff');
  const [harmony, setHarmony] = useState<Harmony>('complementaria');
  const palette = harmonyPalette(base, harmony);
  const pair = bestTextPair(palette);
  const h = HARMONIES.find((x) => x.id === harmony)!;

  const pick = (id: string | undefined) => {
    const option = step.options?.find((o) => o.id === id);
    if (!option) return onChange(undefined);
    const colors = option.demo?.kind === 'swatch' ? option.demo.colors.join(',') : '';
    onChange({ palette: option.id, colors });
  };

  return (
    <>
      <OptionGrid
        step={{ ...step, type: 'single' }}
        value={record?.palette}
        onChange={(v) => pick(v as string | undefined)}
        selections={selections}
        onSetKey={onSetKey}
      />
      <details class="harmony" open={open} onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}>
        <summary>Crear mi propia paleta con armonías de color</summary>
        <p class="muted small">
          Elegí un color base (por ejemplo, el de tu marca) y una armonía: Promptea calcula los colores que combinan según el círculo cromático.
        </p>
        <div class="harmony-row">
          <label class="base">
            <span>Color base</span>
            <input type="color" value={base} onInput={(e) => setBase((e.currentTarget as HTMLInputElement).value)} />
            <code>{base}</code>
          </label>
          <div class="groups">
            {HARMONIES.map((x) => (
              <button key={x.id} type="button" class="chip" aria-pressed={harmony === x.id} onClick={() => setHarmony(x.id)} title={x.hint}>
                {x.label}
              </button>
            ))}
          </div>
        </div>
        <p class="muted small">{h.hint}</p>
        <div class="palette-preview">
          {palette.map((c) => (
            <span key={c} style={{ background: c }}>
              <code>{c}</code>
            </span>
          ))}
        </div>
        {pair && (
          <p class="small">
            <span class="contrast" style={{ background: pair.bg, color: pair.fg }}>
              Texto
            </span>{' '}
            Mejor contraste para texto: {pair.ratio.toFixed(1)}:1{' '}
            {pair.ratio >= 4.5 ? '✓ se lee bien' : '⚠ poco contraste: sumá un color muy claro u oscuro para el texto'}
          </p>
        )}
        <button
          type="button"
          class="btn btn-primary btn-sm"
          onClick={() => onChange({ colors: palette.join(','), harmony_en: h.prompt.en, harmony_es: h.prompt.es })}
        >
          Usar esta paleta
        </button>
        {record && !record.palette && record.colors && <span class="small ok"> ✓ Paleta propia en uso</span>}
      </details>
    </>
  );
}

function AutoNote({ auto, skipped, onAuto }: Pick<Props, 'auto' | 'skipped' | 'onAuto'>) {
  if (skipped)
    return (
      <p class="auto-note off">
        <span>{t.game.autoSkipped}</span>
        <button type="button" class="btn btn-sm btn-ghost" onClick={() => onAuto?.('allow')}>
          {t.game.autoAllow}
        </button>
      </p>
    );
  if (!auto) return null;
  return (
    <p class="auto-note" role="status">
      <em>IA</em>
      <span>{t.game.autoPicked(auto.label.es)}</span>
      <button type="button" class="btn btn-sm" onClick={() => onAuto?.('keep')}>
        {t.game.autoKeep}
      </button>
      <button type="button" class="btn btn-sm btn-ghost" onClick={() => onAuto?.('skip')}>
        {t.game.autoSkip}
      </button>
    </p>
  );
}

export function StepView({ step, index, value, selections, onChange, onSetKey, auto, skipped, onAuto }: Props) {
  const hasValue =
    value !== undefined && (typeof value === 'string' ? value.trim() !== '' : Array.isArray(value) ? value.length > 0 : Object.values(value).some((v) => v?.trim()));
  const fields = value && typeof value === 'object' && !Array.isArray(value) ? value : {};

  return (
    <section class="step" id={`paso-${step.id}`} aria-labelledby={`t-${step.id}`}>
      <header class="step-head">
        <span class={`num${hasValue ? ' done' : ''}`} aria-hidden="true">
          {hasValue ? '✓' : index + 1}
        </span>
        <div>
          <h2 id={`t-${step.id}`}>
            {step.title.es}
            <span class={`tag${step.required ? ' req' : ''}`}>{step.required ? t.builder.required : t.builder.optional}</span>
            {step.type === 'multi' && step.max && <span class="tag">{t.builder.upTo(step.max)}</span>}
            {(step.type === 'single' || step.type === 'color') && step.options && (
              <span class="tag" title={step.one?.es}>
                {t.builder.pickOne}
              </span>
            )}
          </h2>
          <p class="why">
            {step.why.es}
            {step.one && <span class="one"> {step.one.es}</span>}
          </p>
        </div>
        {hasValue && (
          <button type="button" class="btn btn-sm btn-ghost clear" onClick={() => onChange(undefined)}>
            {t.builder.clear}
          </button>
        )}
      </header>

      {!hasValue && <AutoNote auto={auto} skipped={skipped} onAuto={onAuto} />}
      {(step.type === 'single' || step.type === 'multi') && (
        <OptionGrid step={step} value={value} onChange={onChange} selections={selections} onSetKey={onSetKey} />
      )}
      {step.type === 'color' && <ColorStep step={step} value={value} onChange={onChange} selections={selections} onSetKey={onSetKey} />}
      {step.type === 'text' && (
        <div class="field">
          <textarea
            rows={2}
            maxLength={300}
            placeholder={step.placeholder?.es}
            value={typeof value === 'string' ? value : ''}
            onInput={(e) => onChange((e.currentTarget as HTMLTextAreaElement).value || undefined)}
            aria-labelledby={`t-${step.id}`}
          />
          <p class="small muted">{t.builder.freeTextTip}</p>
        </div>
      )}
      {step.type === 'copy' && (
        <div class="copy-fields">
          {step.fields?.map((f) => {
            const v = fields[f.id] ?? '';
            const long = v.trim().split(/\s+/).length > 6;
            return (
              <label key={f.id} class="field">
                <span>{f.label.es}</span>
                <input
                  type="text"
                  maxLength={80}
                  placeholder={f.placeholder.es}
                  value={v}
                  onInput={(e) => {
                    const next = { ...fields, [f.id]: (e.currentTarget as HTMLInputElement).value };
                    onChange(Object.values(next).some((x) => x.trim()) ? next : undefined);
                  }}
                />
                {long && <span class="small warn">{t.builder.copyTooLong}</span>}
              </label>
            );
          })}
        </div>
      )}
    </section>
  );
}
