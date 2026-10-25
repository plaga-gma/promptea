import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { getAdapter } from '../../engine/adapters';
import { autofill, enhanceSpec, interpretIdea, mergeSelections, scorePrompt } from '../../engine/assistant';
import { buildSpec, findConflicts, hasValue, isStepVisible, missingSteps, missingTargets, pruneDetails, selectedOptions } from '../../engine/build';
import type { Area, LocalizedText, Preset, SelectionValue, Selections, Step } from '../../engine/types';
import { t } from '../../i18n/es';
import { looksSpanish, startTranslator, toEnglish, translatorStatus, type AiStatus } from '../../lib/browser-ai';
import { addToHistory, findSaved, getPrefs, isFavorite, newId, setPrefs, toggleFavorite, type SavedPrompt } from '../../lib/storage';
import { FilterDefs } from '../demos/FilterDefs';
import { DemoContext, type FilterLook } from '../demos/photos';
import { Preview } from '../preview/Preview';
import { buildScene } from '../preview/scene';
import { PROMPT, START, Studio, type ZoneInfo } from '../studio/Studio';
import '../demos/demos.css';
import './builder.css';
import './game.css';
import { Achievements, Coach, Confetti, IdeaBox, PowerMeter, Recipes, StageMap, type Achievement, type StageInfo } from './Game';
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

/** Claves de texto libre que el traductor del navegador puede pasar al inglés (nunca los textos de la pieza: van tal cual). */
function freeTextKeys(area: Area, selections: Selections): string[] {
  const textSteps = new Set(area.steps.filter((s) => s.type === 'text').map((s) => s.id));
  return Object.keys(selections).filter((k) => textSteps.has(k) || k.endsWith('/target') || k.endsWith('/nota'));
}

interface Toast {
  text: string;
  undo?: Selections;
}

const FINAL = 'final';

export default function Builder({ sectionId, area }: Props) {
  const [selections, setSelections] = useState<Selections>({});
  const [advanced, setAdvanced] = useState(false);
  const [modelId, setModelId] = useState('generico');
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const [creativity, setCreativity] = useState<0 | 1 | 2>(1);
  const [favorite, setFavorite] = useState(false);
  const [photo, setPhoto] = useState('retrato');
  const [autopilot, setAutopilot] = useState(true);
  const [optimal, setOptimal] = useState(true);
  const [studioOn, setStudioOn] = useState(true);
  const [zone, setZone] = useState<{ id: string; step?: string }>({ id: START });
  const [skipAuto, setSkipAuto] = useState<string[]>([]);
  const [stage, setStage] = useState(0);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [idea, setIdea] = useState<ReturnType<typeof interpretIdea>>();
  const [copiedOnce, setCopiedOnce] = useState(false);
  const [confetti, setConfetti] = useState(0);
  const [aiStatus, setAiStatus] = useState<AiStatus>('unsupported');
  const [translateOn, setTranslateOn] = useState(false);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  // Al reiniciar cambia la clave de los pasos: vuelven a su estado inicial (categoría, "ver todas", notas abiertas).
  const [round, setRound] = useState(0);
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = useRef<number>();
  const top = useRef<HTMLDivElement>(null);
  const stageTop = useRef<HTMLDivElement>(null);

  // Preferencias y prompt guardado (?cargar=<id>) se leen al montar, para no romper la hidratación.
  useEffect(() => {
    const prefs = getPrefs();
    setModelId(prefs.modelId);
    setAdvanced(prefs.advanced);
    setPhoto(prefs.samplePhoto);
    setAutopilot(prefs.autopilot);
    setOptimal(prefs.optimal);
    setStudioOn(prefs.studio);
    const id = new URLSearchParams(location.search).get('cargar');
    const saved = id ? findSaved(id) : undefined;
    if (saved && saved.areaId === area.id) {
      setSelections(saved.selections);
      setAdvanced(saved.advanced);
      setModelId(saved.modelId);
      setZone({ id: PROMPT });
    }
    void translatorStatus().then((s) => {
      setAiStatus(s);
      // Si el idioma ya está en el navegador, se usa solo; si hay que descargarlo, se ofrece con un botón.
      if (s === 'available') setTranslateOn(true);
    });
  }, [area.id]);

  // La barra chica del celular va pegada debajo del encabezado del sitio, que cambia de alto según el ancho.
  useEffect(() => {
    const header = document.querySelector<HTMLElement>('.site-header');
    if (!header || !('ResizeObserver' in window)) return;
    const ro = new ResizeObserver(() => document.documentElement.style.setProperty('--hdr', `${header.offsetHeight}px`));
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  const showToast = (text: string, undo?: Selections) => {
    setToast({ text, undo });
    clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), undo ? 8000 : 3500);
  };

  // El asistente completa por detrás lo que quedó vacío.
  const auto = useMemo(
    () => (autopilot ? autofill(area, selections, advanced, skipAuto) : { selections: {}, picks: [] }),
    [area, selections, advanced, autopilot, skipAuto],
  );
  const autoSteps = useMemo(() => new Set(auto.picks.map((p) => p.stepId)), [auto]);
  const full = useMemo(() => ({ ...selections, ...auto.selections }), [selections, auto]);

  // Textos libres traducidos por el navegador (solo para el prompt en inglés).
  useEffect(() => {
    if (!translateOn || lang !== 'en') return;
    const pending = freeTextKeys(area, full)
      .map((k) => full[k])
      .filter((v): v is string => typeof v === 'string' && looksSpanish(v) && !translations[v.trim()]);
    if (!pending.length) return;
    const id = window.setTimeout(async () => {
      const out: Record<string, string> = {};
      for (const text of pending) {
        const en = await toEnglish(text);
        if (en) out[text.trim()] = en;
      }
      if (Object.keys(out).length) setTranslations((prev) => ({ ...prev, ...out }));
    }, 700);
    return () => clearTimeout(id);
  }, [translateOn, lang, full, area]);

  const promptSelections = useMemo(() => {
    if (!translateOn || lang !== 'en') return full;
    const out = { ...full };
    for (const k of freeTextKeys(area, full)) {
      const v = full[k];
      if (typeof v === 'string' && translations[v.trim()]) out[k] = translations[v.trim()];
    }
    return out;
  }, [full, translations, translateOn, lang, area]);

  const adapter = getAdapter(modelId);
  const userSpec = useMemo(() => buildSpec(area, selections, { advanced }), [area, selections, advanced]);
  const fullSpec = useMemo(() => buildSpec(area, full, { advanced }), [area, full, advanced]);
  const finalSpec = useMemo(() => {
    const spec = promptSelections === full ? fullSpec : buildSpec(area, promptSelections, { advanced });
    return optimal ? enhanceSpec(area, spec, full) : spec;
  }, [area, fullSpec, promptSelections, full, advanced, optimal]);
  const result = useMemo(() => adapter.format(finalSpec, { lang, creativity }), [adapter, finalSpec, lang, creativity]);
  const hasContent = userSpec.segments.length > 0 || userSpec.copy.length > 0;
  const power = useMemo(() => scorePrompt(area, userSpec, fullSpec, selections, advanced), [area, userSpec, fullSpec, selections, advanced]);
  const scene = useMemo(() => buildScene(area, full, advanced, autoSteps), [area, full, advanced, autoSteps]);

  const missing = [
    ...missingSteps(area, full, advanced).map((s) => s.title.es),
    ...missingTargets(area, full, advanced).map((o) => t.builder.targetMissing(o.label.es)),
  ];
  const hasSelections = Object.values(selections).some((v) => hasValue(v));
  const warnings: LocalizedText[] = findConflicts(area, full).map(([a, b]) => ({ es: t.panel.conflict(a.label.es, b.label.es) }));
  if (fullSpec.mode === 'edit' && fullSpec.needsSecondImage) {
    warnings.push({ es: 'Esta edición necesita dos imágenes: adjuntá primero tu foto base y después la imagen de referencia.' });
  }

  useEffect(() => setFavorite(hasContent && isFavorite(result.prompt)), [result.prompt, hasContent]);

  // Niveles: los pasos a la vista de cada etapa, más el final con el prompt.
  const stepDone = (s: Step) => hasValue(selections[s.id]) || autoSteps.has(s.id);
  const stages: StageInfo[] = [
    ...(area.stages ?? [{ id: 'pasos', title: { es: 'Pasos' }, icon: '🧩', steps: area.steps.map((s) => s.id) }])
      .map((st) => {
        const steps = st.steps
          .map((id) => area.steps.find((s) => s.id === id))
          .filter((s): s is Step => Boolean(s && isStepVisible(s, advanced, area, full)));
        return { id: st.id, title: st.title.es, icon: st.icon, steps, done: steps.filter(stepDone).length };
      })
      .filter((s) => s.steps.length > 0),
    { id: FINAL, title: t.game.finalTitle, icon: t.game.finalIcon, steps: [], done: 0 },
  ];
  // Escena 3D: cada zona del set con sus pasos a la vista y los que esconde el modo simple.
  const studio = Boolean(area.studio && studioOn);
  const short = (v: string) => (v.length > 22 ? `${v.slice(0, 21)}…` : v);
  const zones: ZoneInfo[] = (area.studio ?? []).map((zn) => {
    const all = zn.steps.map((id) => area.steps.find((s) => s.id === id)).filter((s): s is Step => Boolean(s));
    const steps = all.filter((s) => isStepVisible(s, advanced, area, full));
    const hidden = advanced ? 0 : all.filter((s) => s.level === 'advanced' && isStepVisible(s, true, area, full)).length;
    const textValue = steps.map((s) => (s.type === 'text' && typeof selections[s.id] === 'string' ? (selections[s.id] as string).trim() : '')).find(Boolean);
    const tag = scene.tags.find((tg) => zn.steps.includes(tg.stepId));
    return {
      id: zn.id,
      title: zn.title.es,
      icon: zn.icon,
      hint: zn.hint.es,
      steps,
      hidden,
      done: steps.filter((s) => hasValue(selections[s.id])).length,
      auto: steps.filter((s) => autoSteps.has(s.id)).length,
      value: textValue ? short(textValue) : tag ? short(tag.label) : undefined,
    };
  });
  const openZone = (id: string, step?: string) => {
    setZone({ id, step });
    setVisited((v) => (v.has(id) ? v : new Set([...v, id])));
  };

  const current = Math.min(stage, stages.length - 1);
  const currentStage = stages[current]!;

  useEffect(() => {
    setVisited((v) => (v.has(currentStage.id) ? v : new Set([...v, currentStage.id])));
  }, [currentStage.id]);

  const goStage = (i: number, scroll = true) => {
    setStage(Math.max(0, Math.min(stages.length - 1, i)));
    if (scroll) requestAnimationFrame(() => stageTop.current?.scrollIntoView({ block: 'start' }));
  };

  const goStep = (stepId: string) => {
    if (studio) {
      const zn = zones.find((x) => x.steps.some((s) => s.id === stepId));
      if (zn) openZone(zn.id, stepId);
      return;
    }
    const i = stages.findIndex((s) => s.steps.some((x) => x.id === stepId));
    if (i < 0) return;
    setStage(i);
    requestAnimationFrame(() => requestAnimationFrame(() => document.getElementById(`paso-${stepId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })));
  };

  // Subir de nivel: papelitos y un aviso.
  const levelRef = useRef<number | null>(null);
  useEffect(() => {
    const prev = levelRef.current;
    levelRef.current = power.level.min;
    if (prev !== null && power.level.min > prev && power.level.min >= 40) {
      setConfetti((c) => c + 1);
      showToast(t.game.levelUp(power.level.label, power.level.icon));
    }
  }, [power.level.min]);

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

  const replaceAll = (next: Selections, message: string) => {
    const before = selections;
    setSelections(next);
    setSkipAuto([]);
    setRound((r) => r + 1);
    showToast(message, Object.values(before).some((v) => hasValue(v)) ? before : undefined);
  };

  const reset = () => {
    if (!hasSelections) return;
    replaceAll({}, t.builder.resetDone);
    setIdea(undefined);
    setStage(0);
    setZone({ id: START });
    // Un prompt abierto desde "Mis prompts" (?cargar=) no tiene que volver al recargar.
    if (location.search.includes('cargar=')) history.replaceState(null, '', location.pathname);
    top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const restore = () => {
    if (toast?.undo) setSelections(toast.undo);
    setToast(null);
    clearTimeout(toastTimer.current);
  };

  const applyIdea = (text: string) => {
    const r = interpretIdea(area, text, selections, advanced);
    setIdea(r);
    setSelections((prev) => mergeSelections(area, prev, r.selections));
    setRound((n) => n + 1);
    showToast(r.matches.length ? t.game.ideaApplied : t.game.ideaNothing);
  };

  const applyPreset = (p: Preset) => {
    replaceAll(p.selections, t.game.presetApplied(p.title.es));
    setIdea(undefined);
  };

  const onAuto = (stepId: string, action: 'keep' | 'skip' | 'allow') => {
    if (action === 'keep' && auto.selections[stepId] !== undefined) update(stepId, auto.selections[stepId]);
    if (action === 'skip') setSkipAuto((s) => [...s, stepId]);
    if (action === 'allow') setSkipAuto((s) => s.filter((x) => x !== stepId));
  };

  const pickSuggestion = (stepId: string, optionId: string) => {
    const step = area.steps.find((s) => s.id === stepId);
    if (!step?.options) return;
    if (step.type === 'color') {
      const o = step.options.find((x) => x.id === optionId);
      const colors = o?.demo?.kind === 'swatch' ? o.demo.colors.join(',') : '';
      update(stepId, { palette: optionId, colors });
    } else if (step.type === 'multi') {
      const prev = chosenIds(selections[stepId]);
      update(stepId, [...prev.filter((x) => x !== optionId), optionId].slice(-(step.max ?? 99)));
    } else update(stepId, optionId);
  };

  const entry = (): SavedPrompt => {
    const main = fullSpec.segments.find((s) => s.role === 'subject' || s.role === 'operation');
    const medium = fullSpec.segments.find((s) => s.role === 'medium');
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
    if (ok && isMain) {
      addToHistory(entry());
      if (!copiedOnce) {
        setCopiedOnce(true);
        setConfetti((c) => c + 1);
      }
    }
    return ok;
  };

  const onOpen = () => {
    // La ventana se abre en el mismo clic (si no, el navegador la bloquea); el copiado sigue en paralelo.
    void onCopy(result.prompt, true);
    const target = adapter.urlWithPrompt ? adapter.urlWithPrompt.replace('{q}', encodeURIComponent(result.prompt)) : adapter.url;
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

  const changeAdvanced = (value: boolean) => {
    setAdvanced(value);
    setPrefs({ advanced: value });
  };

  const changeAutopilot = (value: boolean) => {
    setAutopilot(value);
    setPrefs({ autopilot: value });
  };

  const changeOptimal = (value: boolean) => {
    setOptimal(value);
    setPrefs({ optimal: value });
  };

  const changeStudio = (value: boolean) => {
    setStudioOn(value);
    setPrefs({ studio: value });
  };

  const enableTranslator = () => {
    setAiStatus('downloading');
    startTranslator()
      ?.then(() => {
        setAiStatus('available');
        setTranslateOn(true);
      })
      .catch(() => setAiStatus('unavailable'));
  };

  // El paso "Intensidad" muestra el efecto elegido: el último paso a la vista con un filtro (o un antes y después) elegido.
  let look: FilterLook | undefined;
  for (const step of area.steps) {
    if (step.role === 'intensity' || !isStepVisible(step, advanced, area, full)) continue;
    const demo = selectedOptions(step, full)[0]?.demo;
    if (demo?.kind === 'filter') look = demo;
    else if (demo?.kind === 'compare') look = { kind: 'filter', ...demo.after };
  }
  const demoSettings = useMemo(() => ({ photo, setPhoto: changePhoto, look }), [photo, look]);

  const achievements: Achievement[] = [
    { id: 'inicio', icon: '🌱', title: 'Primer paso', got: hasSelections },
    { id: 'idea', icon: '🤖', title: 'Le contaste tu idea', got: Boolean(idea) },
    { id: 'detalle', icon: '🔍', title: 'Detallista', got: Object.keys(selections).some((k) => k.split('/').length === 3) },
    { id: 'explorador', icon: '🧭', title: 'Explorador', got: studio ? zones.every((z) => visited.has(z.id)) : stages.every((s) => visited.has(s.id)) },
    { id: 'pro', icon: '🎯', title: 'Nivel Pro', got: power.score >= 60 },
    { id: 'leyenda', icon: '👑', title: 'Leyenda', got: power.score >= 95 },
    { id: 'copiado', icon: '📋', title: '¡A la IA!', got: copiedOnce },
  ];

  const translate =
    aiStatus === 'downloadable' ? (
      <p class="small ai-offer">
        🌐 {t.game.translateOffer}{' '}
        <button type="button" class="btn btn-sm" onClick={enableTranslator}>
          {t.game.translateGo}
        </button>
      </p>
    ) : aiStatus === 'downloading' ? (
      <p class="small ai-offer">⏳ {t.game.translateLoading}</p>
    ) : translateOn ? (
      <p class="small ai-offer on">🌐 {t.game.translateOn}</p>
    ) : null;

  const isFinal = currentStage.id === FINAL;
  const nextStage = stages[current + 1];

  const toggles = (
    <div class="toggles">
      <label class="switch" title={t.game.autopilotHelp}>
        <input type="checkbox" checked={autopilot} onChange={(e) => changeAutopilot((e.currentTarget as HTMLInputElement).checked)} />
        <span>
          🤖<span class="sw-text"> {t.game.autopilot}</span>
        </span>
      </label>
      <label class="switch" title={t.game.optimalHelp}>
        <input type="checkbox" checked={optimal} onChange={(e) => changeOptimal((e.currentTarget as HTMLInputElement).checked)} />
        <span>
          🚀<span class="sw-text"> {t.game.optimal}</span>
        </span>
      </label>
      <label class="switch" title={t.builder.modeHint}>
        <input type="checkbox" checked={advanced} onChange={(e) => changeAdvanced((e.currentTarget as HTMLInputElement).checked)} />
        <span>
          🎛️<span class="sw-text"> {t.builder.advanced}</span>
        </span>
      </label>
    </div>
  );

  const stepView = (step: Step) => {
    const pick = auto.picks.find((p) => p.stepId === step.id);
    const option = pick && step.options?.find((o) => o.id === pick.optionId);
    return (
      <StepView
        key={`${step.id}-${round}`}
        step={step}
        index={area.steps.filter((s) => isStepVisible(s, advanced, area, full)).indexOf(step)}
        value={selections[step.id]}
        selections={selections}
        onChange={(v) => update(step.id, v)}
        onSetKey={setKey}
        auto={option}
        skipped={autopilot && skipAuto.includes(step.id)}
        onAuto={(a) => onAuto(step.id, a)}
      />
    );
  };

  const promptPanel = (
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
  );

  const toastView = toast && (
    <div class="toast" role="status">
      <span>{toast.text}</span>
      {toast.undo && (
        <button type="button" class="btn btn-sm" onClick={restore}>
          {t.builder.undo}
        </button>
      )}
    </div>
  );

  if (studio) {
    return (
      <DemoContext.Provider value={demoSettings}>
        <div class="builder game is-studio" ref={top}>
          <FilterDefs />
          <Confetti fire={confetti} />
          <Studio
            zones={zones}
            scene={scene}
            power={power}
            zone={zone.id}
            stepId={zone.step}
            onOpen={openZone}
            renderStep={stepView}
            start={
              <>
                <IdeaBox area={area} onApply={applyIdea} lastMatches={idea} translate={translate} />
                <Recipes presets={area.presets ?? []} onPick={applyPreset} />
              </>
            }
            final={
              <>
                {promptPanel}
                {hasContent && <Coach area={area} power={power} onPick={pickSuggestion} onGoStep={goStep} />}
                <h3>{t.game.achievements}</h3>
                <Achievements list={achievements} />
              </>
            }
            toggles={toggles}
            prompt={result.prompt}
            hasContent={hasContent}
            adapterName={adapter.url ? adapter.name : undefined}
            onCopy={async () => {
              if (await onCopy(result.prompt, true)) showToast(t.panel.copied);
            }}
            onOpenAi={adapter.url ? onOpen : undefined}
            onAdvanced={() => changeAdvanced(true)}
            onLevels={() => changeStudio(false)}
          />
          {toastView}
        </div>
      </DemoContext.Provider>
    );
  }

  return (
    <DemoContext.Provider value={demoSettings}>
      <div class="builder game" ref={top}>
        <FilterDefs />
        <Confetti fire={confetti} />

        {/* Celular: vista previa chica y poder, siempre a la vista. */}
        <div class="mini" aria-hidden="true" onClick={() => goStage(stages.length - 1)}>
          <Preview scene={scene} compact />
          <div class="mini-info">
            <PowerMeter power={power} compact />
            <span class="small muted">
              {currentStage.icon} {currentStage.title}
            </span>
          </div>
        </div>

        <div class="hud card">
          <StageMap stages={stages} current={current} onGo={(i) => goStage(i, false)} />
          <div class="hud-row">
            <PowerMeter power={power} />
            {toggles}
            {area.studio && (
              <button type="button" class="btn btn-sm" onClick={() => changeStudio(true)}>
                🧊 {t.studio.scene}
              </button>
            )}
          </div>
        </div>

        <div class="play">
          {current === 0 && (
            <>
              <IdeaBox area={area} onApply={applyIdea} lastMatches={idea} translate={translate} />
              <Recipes presets={area.presets ?? []} onPick={applyPreset} />
            </>
          )}
          {current > 0 && !isFinal && hasContent && <Coach area={area} power={power} onPick={pickSuggestion} onGoStep={goStep} />}

          <div class="stage" ref={stageTop}>
            <header class="stage-head">
              <span class="stage-icon" aria-hidden="true">
                {currentStage.icon}
              </span>
              <div>
                <span class="small muted">{t.game.level(current + 1, stages.length)}</span>
                <h2>{currentStage.title}</h2>
              </div>
            </header>

            {isFinal ? (
              <div class="final card">
                <Preview scene={scene} onTag={goStep} />
                <p class="small muted">{t.game.previewNote}</p>
                <PowerMeter power={power} />
                {hasContent && (
                  <div class="final-prompt">
                    <div class="prompt-box">
                      <pre>{result.prompt}</pre>
                    </div>
                    <div class="final-actions">
                      <button
                        type="button"
                        class="btn btn-primary"
                        onClick={async () => {
                          if (await onCopy(result.prompt, true)) showToast(t.panel.copied);
                        }}
                      >
                        📋 {t.panel.copy}
                      </button>
                      {adapter.url && (
                        <button type="button" class="btn" onClick={onOpen}>
                          {t.panel.open(adapter.name)}
                        </button>
                      )}
                    </div>
                  </div>
                )}
                {power.next && <Coach area={area} power={power} onPick={pickSuggestion} onGoStep={goStep} />}
                <h3>{t.game.achievements}</h3>
                <Achievements list={achievements} />
              </div>
            ) : (
              <div class="steps" key={`${currentStage.id}-${round}`}>
                {currentStage.steps.map(stepView)}
              </div>
            )}

            <nav class="stage-nav" aria-label={t.game.map}>
              <button type="button" class="btn" disabled={current === 0} onClick={() => goStage(current - 1)}>
                ← {t.game.prev}
              </button>
              {nextStage && (
                <button type="button" class="btn btn-primary" onClick={() => goStage(current + 1)}>
                  {nextStage.id === FINAL ? `${t.game.finalIcon} ${t.game.finish}` : `${t.game.next(nextStage.title)} ${nextStage.icon}`} →
                </button>
              )}
            </nav>
          </div>
        </div>

        <div class="side">
          <section class="preview-card card" aria-labelledby="pv-title">
            <h2 id="pv-title" class="pv-head">
              {t.game.preview}
              <span class="small muted">{t.game.previewNote}</span>
            </h2>
            <Preview scene={scene} onTag={goStep} />
          </section>
          {promptPanel}
        </div>

        {toastView}
      </div>
    </DemoContext.Provider>
  );
}
