import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { getAdapter } from '../../engine/adapters';
import { buildSpec, findConflicts, hasValue, isStepVisible, missingSteps, pruneDetails, selectedOptions, targetFilled } from '../../engine/build';
import type { Area, LocalizedText, SelectionValue, Selections } from '../../engine/types';
import { t } from '../../i18n/es';
import { addToHistory, findSaved, getPrefs, isFavorite, newId, setPrefs, toggleFavorite, type SavedPrompt } from '../../lib/storage';
import { FilterDefs } from '../demos/FilterDefs';
import { DemoContext, type FilterLook } from '../demos/photos';
import '../demos/demos.css';
import './builder.css';
import { PromptPanel } from './PromptPanel';
import { StepView } from './StepView';

interface Props {
  sectionId: string;
  area: Area;
}

/** Ids de opciones elegidas en un valor de paso (lista, id suelto o paleta). */
function chosenIds(v: SelectionValue | undefined): string[] {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') return [v];
  if (v && typeof v.palette === 'string') return [v.palette];
  return [];
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
  const [photo, setPhoto] = useState('retrato');
  // Al reiniciar cambia la clave de los pasos: vuelven a su estado inicial (categoría, "ver todas", notas abiertas).
  const [round, setRound] = useState(0);
  const [undo, setUndo] = useState<Selections | null>(null);
  const undoTimer = useRef<number>();
  const top = useRef<HTMLDivElement>(null);

  // Preferencias y prompt guardado (?cargar=<id>) se leen al montar, para no romper la hidratación.
  useEffect(() => {
    const prefs = getPrefs();
    setModelId(prefs.modelId);
    setAdvanced(prefs.advanced);
    setPhoto(prefs.samplePhoto);
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
  const missing = missingSteps(area, selections, advanced).map((s) => s.title.es);
  const filled = targetFilled(area, selections, advanced);
  const hasSelections = Object.values(selections).some((v) => hasValue(v));
  const warnings: LocalizedText[] = findConflicts(area, selections).map(([a, b]) => ({ es: t.panel.conflict(a.label.es, b.label.es) }));
  if (spec.mode === 'edit' && spec.needsSecondImage) {
    warnings.push({ es: 'Esta edición necesita dos imágenes: adjuntá primero tu foto base y después la imagen de referencia.' });
  }

  useEffect(() => setFavorite(hasContent && isFavorite(result.prompt)), [result.prompt, hasContent]);

  // El ejemplo del paso de texto libre cambia según la operación elegida ("Ej.: un traje azul…").
  const targetHint = area.steps.flatMap((s) => selectedOptions(s, selections)).find((o) => o.meta?.targetHint)?.meta?.targetHint;

  const update = (stepId: string, value: SelectionValue | undefined) =>
    setSelections((prev) => {
      // Las subopciones y notas de una opción que se desmarca se van con ella.
      const next = pruneDetails(prev, stepId, chosenIds(value));
      if (value === undefined) delete next[stepId];
      else next[stepId] = value;
      return next;
    });

  const setKey = (key: string, value: SelectionValue | undefined) =>
    setSelections((prev) => {
      const next = { ...prev };
      if (value === undefined) delete next[key];
      else next[key] = value;
      return next;
    });

  const reset = () => {
    if (!hasSelections) return;
    setUndo(selections);
    setSelections({});
    setRound((r) => r + 1);
    // Un prompt abierto desde "Mis prompts" (?cargar=) no tiene que volver al recargar.
    if (location.search.includes('cargar=')) history.replaceState(null, '', location.pathname);
    top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    clearTimeout(undoTimer.current);
    undoTimer.current = window.setTimeout(() => setUndo(null), 8000);
  };

  const restore = () => {
    if (undo) setSelections(undo);
    setUndo(null);
    clearTimeout(undoTimer.current);
  };

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

  const changePhoto = (id: string) => {
    setPhoto(id);
    setPrefs({ samplePhoto: id });
  };
  // El paso "Intensidad" muestra el efecto elegido: el último paso a la vista con un filtro (o un antes y después) elegido.
  let look: FilterLook | undefined;
  for (const step of area.steps) {
    if (step.role === 'intensity' || !isStepVisible(step, advanced, area, selections)) continue;
    const demo = selectedOptions(step, selections)[0]?.demo;
    if (demo?.kind === 'filter') look = demo;
    else if (demo?.kind === 'compare') look = { kind: 'filter', ...demo.after };
  }
  const demoSettings = useMemo(() => ({ photo, setPhoto: changePhoto, look }), [photo, look]);

  const changeAdvanced = (value: boolean) => {
    setAdvanced(value);
    setPrefs({ advanced: value });
  };

  return (
    <DemoContext.Provider value={demoSettings}>
      <div class="builder" ref={top}>
        <FilterDefs />
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
            <StepView
              key={`${step.id}-${round}`}
              step={step}
              index={i}
              value={selections[step.id]}
              placeholder={step.showIfMeta === 'needsTarget' ? targetHint : undefined}
              optional={step.id === 'target' && filled}
              selections={selections}
              onChange={(v) => update(step.id, v)}
              onSetKey={setKey}
            />
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
          canReset={hasSelections}
          onReset={reset}
        />
        {undo && (
          <div class="toast" role="status">
            <span>{t.builder.resetDone}</span>
            <button type="button" class="btn btn-sm" onClick={restore}>
              {t.builder.undo}
            </button>
          </div>
        )}
      </div>
    </DemoContext.Provider>
  );
}
