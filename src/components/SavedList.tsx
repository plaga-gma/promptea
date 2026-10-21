import { useEffect, useState } from 'preact/hooks';
import { getAdapter } from '../engine/adapters';
import { t } from '../i18n/es';
import { clearHistory, getFavorites, getHistory, removeEntry, toggleFavorite, type SavedPrompt } from '../lib/storage';
import { url } from '../lib/url';

const AREA_NAMES: Record<string, string> = { generacion: 'Generación', edicion: 'Edición', diseno: 'Diseño' };

function Item({ e, kind, onChange }: { e: SavedPrompt; kind: 'history' | 'favorites'; onChange: () => void }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(e.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* sin permiso de portapapeles */
    }
  };
  return (
    <li class="saved card">
      <div class="meta small muted">
        <span>{AREA_NAMES[e.areaId] ?? e.areaId}</span> · <span>{getAdapter(e.modelId).name}</span> ·{' '}
        <time dateTime={new Date(e.createdAt).toISOString()}>{new Date(e.createdAt).toLocaleString('es')}</time>
      </div>
      <h3>{e.title}</h3>
      <pre>{e.prompt}</pre>
      {e.negative && <pre class="neg">Negativo: {e.negative}</pre>}
      <div class="row">
        <button type="button" class="btn btn-sm btn-primary" onClick={copy}>
          {copied ? t.panel.copied : t.panel.copy}
        </button>
        <a class="btn btn-sm" href={url(`/${e.sectionId}/${e.areaId}/?cargar=${e.id}`)}>
          {t.saved.load}
        </a>
        {kind === 'history' && (
          <button type="button" class="btn btn-sm" onClick={() => (toggleFavorite(e), onChange())}>
            ☆ {t.panel.favorite}
          </button>
        )}
        <button type="button" class="btn btn-sm btn-ghost" onClick={() => (removeEntry(kind, e.id), onChange())}>
          {t.saved.remove}
        </button>
      </div>
    </li>
  );
}

export default function SavedList() {
  const [tab, setTab] = useState<'favorites' | 'history'>('favorites');
  const [data, setData] = useState<{ history: SavedPrompt[]; favorites: SavedPrompt[] }>({ history: [], favorites: [] });
  const refresh = () => setData({ history: getHistory(), favorites: getFavorites() });
  useEffect(() => {
    refresh();
    window.addEventListener('promptea:storage', refresh);
    return () => window.removeEventListener('promptea:storage', refresh);
  }, []);
  const list = data[tab];

  return (
    <div class="saved-list">
      <div class="groups" role="tablist">
        <button type="button" role="tab" class="chip" aria-pressed={tab === 'favorites'} aria-selected={tab === 'favorites'} onClick={() => setTab('favorites')}>
          ★ {t.saved.favorites} ({data.favorites.length})
        </button>
        <button type="button" role="tab" class="chip" aria-pressed={tab === 'history'} aria-selected={tab === 'history'} onClick={() => setTab('history')}>
          {t.saved.history} ({data.history.length})
        </button>
        {tab === 'history' && data.history.length > 0 && (
          <button type="button" class="btn btn-sm btn-ghost" onClick={() => (clearHistory(), refresh())}>
            {t.saved.clearHistory}
          </button>
        )}
      </div>
      {list.length === 0 ? (
        <p class="muted empty">{tab === 'history' ? t.saved.emptyHistory : t.saved.emptyFavorites}</p>
      ) : (
        <ul>
          {list.map((e) => (
            <Item key={e.id} e={e} kind={tab} onChange={refresh} />
          ))}
        </ul>
      )}
    </div>
  );
}
