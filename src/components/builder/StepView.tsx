import { useState } from 'preact/hooks';
import { harmonyPalette, bestTextPair, HARMONIES, type Harmony } from '../../engine/color';
import type { Option, SelectionValue, Step } from '../../engine/types';
import { t } from '../../i18n/es';
import { Demo } from '../demos/Demo';

interface Props {
  step: Step;
  index: number;
  value: SelectionValue | undefined;
  onChange: (value: SelectionValue | undefined) => void;
}

const COLLAPSED = 12;

function OptionCard({ option, selected, onClick }: { option: Option; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" class="opt" aria-pressed={selected} onClick={onClick}>
      <Demo demo={option.demo} label={option.label.es} />
      <span class="opt-label">{option.label.es}</span>
      {option.hint && <span class="opt-hint">{option.hint.es}</span>}
    </button>
  );
}

function OptionGrid({ step, value, onChange }: Omit<Props, 'index'>) {
  const [group, setGroup] = useState<string>('all');
  const [expanded, setExpanded] = useState(false);
  const selected = Array.isArray(value) ? value : typeof value === 'string' ? [value] : [];
  const max = step.type === 'multi' ? (step.max ?? Infinity) : 1;

  const toggle = (id: string) => {
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
  const inGroup = step.groups && group !== 'all' ? step.groups.find((g) => g.id === group)?.optionIds ?? [] : null;
  const filtered = inGroup ? options.filter((o) => inGroup.includes(o.id)) : options;
  const collapsible = !inGroup && filtered.length > COLLAPSED + 2;
  const shown = collapsible && !expanded ? filtered.slice(0, COLLAPSED) : filtered;

  return (
    <>
      {step.groups && (
        <div class="groups" role="toolbar" aria-label="Filtrar">
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
      <div class="grid">
        {shown.map((o) => (
          <OptionCard key={o.id} option={o} selected={selected.includes(o.id)} onClick={() => toggle(o.id)} />
        ))}
      </div>
      {collapsible && (
        <button type="button" class="btn btn-sm more" onClick={() => setExpanded(!expanded)}>
          {expanded ? t.builder.showLess : t.builder.showAll(filtered.length)}
        </button>
      )}
    </>
  );
}

function ColorStep({ step, value, onChange }: Omit<Props, 'index'>) {
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
      <OptionGrid step={{ ...step, type: 'single' }} value={record?.palette} onChange={(v) => pick(v as string | undefined)} />
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

export function StepView({ step, index, value, onChange }: Props) {
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
          </h2>
          <p class="why">{step.why.es}</p>
        </div>
        {hasValue && (
          <button type="button" class="btn btn-sm btn-ghost clear" onClick={() => onChange(undefined)}>
            {t.builder.clear}
          </button>
        )}
      </header>

      {(step.type === 'single' || step.type === 'multi') && <OptionGrid step={step} value={value} onChange={onChange} />}
      {step.type === 'color' && <ColorStep step={step} value={value} onChange={onChange} />}
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
