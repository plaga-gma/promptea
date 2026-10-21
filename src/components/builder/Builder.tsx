import { useEffect, useMemo, useState } from 'preact/hooks';
import { getAdapter } from '../../engine/adapters';
import { buildSpec, findConflicts, isStepVisible } from '../../engine/build';
import type { Area, LocalizedText, SelectionValue, Selections } from '../../engine/types';
import { t } from '../../i18n/es';
import { addToHistory, findSaved, getPrefs, isFavorite, newId, setPrefs, toggleFavorite, type SavedPrompt } from '../../lib/storage';
import '../demos/demos.css';
import './builder.css';
import { PromptPanel } from './PromptPanel';
import { StepView } from './StepView';

interface Props {
  sectionId: string;
  area: Area;
}

function hasValue(v: SelectionValue | undefined) {
  if (v === undefined) return false;
  if (typeof v === 'string') return v.trim() !== '';
  if (Array.isArray(v)) return v.length > 0;
  return Object.values(v).some((x) => x?.trim());
}

async function writeClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Navegadores viejos o sin permiso: copia con un textarea temporal.
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

export default function Builder({ sectionId, area }: Props) {
  const [selections, setSelections] = useState<Selections>({});
  const [advanced, setAdvanced] = useState(false);
  const [modelId, setModelId] = useState('generico');
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const [creativity, setCreativity] = useState<0 | 1 | 2>(1);
  const [favorite, setFavorite] = useState(false);

  // Preferencias y prompt guardado (?cargar=<id>) se leen al montar, para no romper la hidratación.
  useEffect(() => {
    const prefs = getPrefs();
    setModelId(prefs.modelId);
    setAdvanced(prefs.advanced);
    const id = new URLSearchParams(location.search).get('cargar');
    const saved = id ? findSaved(id) : undefined;
    if (saved && saved.areaId === area.id) {
      setSelections(saved.selections);
      setAdvanced(saved.advanced);
      setModelId(saved.modelId);
    }
  }, [area.id]);

  const adapter = getAdapter(modelId);
  const visibleSteps = area.steps.filter((s) => isStepVisible(s, advanced, area, selections));
  const spec = useMemo(() => buildSpec(area, selections, { advanced }), [area, selections, advanced]);
  const result = useMemo(() => adapter.format(spec, { lang, creativity }), [adapter, spec, lang, creativity]);
  const hasContent = spec.segments.length > 0 || spec.copy.length > 0;
  const missing = visibleSteps.filter((s) => s.required && !hasValue(selections[s.id])).map((s) => s.title.es);
  const warnings: LocalizedText[] = findConflicts(area, selections).map(([a, b]) => ({ es: t.panel.conflict(a.label.es, b.label.es) }));
  if (spec.mode === 'edit' && spec.needsSecondImage) {
    warnings.push({ es: 'Esta edición necesita dos imágenes: adjuntá primero tu foto base y después la imagen de referencia.' });
  }

  useEffect(() => setFavorite(hasContent && isFavorite(result.prompt)), [result.prompt, hasContent]);

  const update = (stepId: string, value: SelectionValue | undefined) =>
    setSelections((prev) => {
      const next = { ...prev };
      if (value === undefined) delete next[stepId];
      else next[stepId] = value;
      return next;
    });

  const entry = (): SavedPrompt => {
    const main = spec.segments.find((s) => s.role === 'subject' || s.role === 'operation');
    const medium = spec.segments.find((s) => s.role === 'medium');
    const title = [medium?.parts[0]?.es, main?.parts[0]?.es].filter(Boolean).join(': ') || area.title.es;
    return {
      id: newId(),
      createdAt: Date.now(),
      sectionId,
      areaId: area.id,
      modelId,
      title: title.length > 90 ? `${title.slice(0, 87)}…` : title,
      prompt: result.prompt,
      negative: result.negative,
      selections,
      advanced,
    };
  };

  const onCopy = async (text: string, isMain: boolean) => {
    const ok = await writeClipboard(text);
    if (ok && isMain) addToHistory(entry());
    return ok;
  };

  const onOpen = () => {
    // La ventana se abre en el mismo clic (si no, el navegador la bloquea); el copiado sigue en paralelo.
    void onCopy(result.prompt, true);
    const target = adapter.urlWithPrompt
      ? adapter.urlWithPrompt.replace('{q}', encodeURIComponent(result.prompt))
      : adapter.url;
    if (target) window.open(target, '_blank', 'noopener');
  };

  const changeModel = (id: string) => {
    setModelId(id);
    setPrefs({ modelId: id });
  };

  const changeAdvanced = (value: boolean) => {
    setAdvanced(value);
    setPrefs({ advanced: value });
  };

  return (
    <div class="builder">
      <div class="steps">
        <div class="mode card">
          <span class="small muted">{t.builder.modeLabel}</span>
          <div class="groups" role="group" aria-label={t.builder.modeLabel}>
            <button type="button" class="chip" aria-pressed={!advanced} onClick={() => changeAdvanced(false)}>
              {t.builder.simple}
            </button>
            <button type="button" class="chip" aria-pressed={advanced} onClick={() => changeAdvanced(true)}>
              {t.builder.advanced}
            </button>
          </div>
          <span class="small muted">{t.builder.modeHint}</span>
        </div>
        {visibleSteps.map((step, i) => (
          <StepView key={step.id} step={step} index={i} value={selections[step.id]} onChange={(v) => update(step.id, v)} />
        ))}
      </div>
      <PromptPanel
        adapter={adapter}
        result={result}
        hasContent={hasContent}
        missing={missing}
        warnings={warnings}
        lang={lang}
        creativity={creativity}
        favorite={favorite}
        onModel={changeModel}
        onLang={setLang}
        onCreativity={setCreativity}
        onCopy={onCopy}
        onOpen={onOpen}
        onFavorite={() => setFavorite(toggleFavorite(entry()))}
        onReset={() => setSelections({})}
      />
    </div>
  );
}
