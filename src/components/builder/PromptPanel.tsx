import { useState } from 'preact/hooks';
import { ADAPTERS } from '../../engine/adapters';
import type { AdapterResult, LocalizedText, ModelAdapter } from '../../engine/types';
import { t } from '../../i18n/es';

interface Props {
  adapter: ModelAdapter;
  result: AdapterResult;
  hasContent: boolean;
  missing: string[];
  warnings: LocalizedText[];
  lang: 'en' | 'es';
  creativity: 0 | 1 | 2;
  favorite: boolean;
  onModel: (id: string) => void;
  onLang: (lang: 'en' | 'es') => void;
  onCreativity: (c: 0 | 1 | 2) => void;
  onCopy: (text: string, isMain: boolean) => Promise<boolean>;
  onOpen: () => void;
  onFavorite: () => void;
  canReset: boolean;
  onReset: () => void;
}

export function PromptPanel(p: Props) {
  const [copied, setCopied] = useState<'main' | 'neg' | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const words = p.hasContent && p.result.prompt.trim() ? p.result.prompt.trim().split(/\s+/).length : 0;

  const copy = async (which: 'main' | 'neg') => {
    const ok = await p.onCopy(which === 'main' ? p.result.prompt : (p.result.negative ?? ''), which === 'main');
    if (ok) {
      setCopied(which);
      setTimeout(() => setCopied(null), 1800);
    }
  };

  return (
    <aside class={`panel${sheetOpen ? ' open' : ''}`} aria-label={t.panel.title}>
      <div class="sheet-bar">
        <button type="button" class="btn btn-sm" onClick={() => setSheetOpen(!sheetOpen)} aria-expanded={sheetOpen}>
          {sheetOpen ? t.panel.hide : t.panel.show}
          {words > 0 && <span class="muted"> · {t.panel.words(words)}</span>}
        </button>
        <div class="sheet-actions">
          <button type="button" class="btn btn-sm btn-ghost" disabled={!p.canReset} onClick={p.onReset} title={t.builder.resetTitle} aria-label={t.builder.resetTitle}>
            ↺
          </button>
          <button type="button" class="btn btn-primary btn-sm" disabled={!p.hasContent} onClick={() => copy('main')}>
            {copied === 'main' ? t.panel.copied : t.panel.copy}
          </button>
        </div>
      </div>

      <div class="panel-body">
        <div class="panel-head">
          <h2>{t.panel.title}</h2>
          <button type="button" class="btn btn-sm reset" disabled={!p.canReset} onClick={p.onReset} title={t.builder.resetTitle}>
            ↺ {t.builder.reset}
          </button>
          <button
            type="button"
            class="btn btn-sm btn-ghost star"
            aria-pressed={p.favorite}
            disabled={!p.hasContent}
            onClick={p.onFavorite}
            title={p.favorite ? t.panel.unfavorite : t.panel.favorite}
          >
            {p.favorite ? '★' : '☆'}
            <span class="visually-hidden">{p.favorite ? t.panel.unfavorite : t.panel.favorite}</span>
          </button>
        </div>

        <label class="model">
          <span class="small muted">{t.panel.model}</span>
          <select value={p.adapter.id} onChange={(e) => p.onModel((e.currentTarget as HTMLSelectElement).value)}>
            {ADAPTERS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
                {a.id !== 'generico' ? ` (${a.version})` : ''}
              </option>
            ))}
          </select>
          <span class="small muted">{p.adapter.description.es}</span>
        </label>

        {p.adapter.id === 'midjourney' && (
          <div class="creativity" role="group" aria-label={t.panel.creativity}>
            <span class="small muted">{t.panel.creativity}</span>
            <div class="groups">
              {t.panel.creativityLevels.map((label, i) => (
                <button key={label} type="button" class="chip" aria-pressed={p.creativity === i} onClick={() => p.onCreativity(i as 0 | 1 | 2)}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {p.missing.length > 0 && (
          <p class="alert">
            {t.panel.missing} {p.missing.join(', ')}.
          </p>
        )}
        {p.warnings.map((w) => (
          <p class="alert" key={w.es}>
            {w.es}
          </p>
        ))}

        <div class="prompt-box">
          {p.hasContent ? <pre>{p.result.prompt}</pre> : <p class="muted">{t.panel.empty}</p>}
          {words > 0 && <span class="count">{t.panel.words(words)}</span>}
        </div>

        {p.result.negative && p.hasContent && (
          <div class="prompt-box neg">
            <span class="small muted">{t.panel.negative}</span>
            <pre>{p.result.negative}</pre>
            <button type="button" class="btn btn-sm" onClick={() => copy('neg')}>
              {copied === 'neg' ? t.panel.copied : t.panel.copyNegative}
            </button>
          </div>
        )}

        <div class="actions">
          <button type="button" class="btn btn-primary" disabled={!p.hasContent} onClick={() => copy('main')}>
            {copied === 'main' ? t.panel.copied : t.panel.copy}
          </button>
          {p.adapter.url && (
            <button type="button" class="btn" disabled={!p.hasContent} onClick={p.onOpen}>
              {t.panel.open(p.adapter.name)}
            </button>
          )}
        </div>

        <label class="lang small">
          <input type="checkbox" checked={p.lang === 'es'} onChange={(e) => p.onLang((e.currentTarget as HTMLInputElement).checked ? 'es' : 'en')} />
          <span>
            {t.panel.spanish}
            {p.lang === 'es' && <span class="warn"> {t.panel.spanishWarn}</span>}
          </span>
        </label>

        {p.result.notes.length > 0 && p.hasContent && (
          <div class="tips">
            <h3>{t.panel.tips}</h3>
            <ul>
              {p.result.notes.map((n) => (
                <li key={n.es}>{n.es}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}
