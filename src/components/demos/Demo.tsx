import { useContext, useEffect, useRef, useState } from 'preact/hooks';
import type { Demo as DemoSpec, FilterOverlay, PhotoLook } from '../../engine/types';
import { t } from '../../i18n/es';
import { url } from '../../lib/url';
import { DIAGRAMS } from './diagrams';
import { DEFAULT_LOOK, DemoContext, samplePhoto } from './photos';

/** Carga una fuente de Google Fonts solo cuando la tarjeta entra en pantalla, y solo con las letras de la muestra. */
const loadedFonts = new Set<string>();
export function useGoogleFont(family: string, weight: number | undefined, text: string, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const key = `${family}:${weight ?? 400}`;
    if (loadedFonts.has(key)) return;
    loadedFonts.add(key);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    const fam = family.replaceAll(' ', '+') + (weight ? `:wght@${weight}` : '');
    link.href = `https://fonts.googleapis.com/css2?family=${fam}&text=${encodeURIComponent(text)}&display=swap`;
    document.head.appendChild(link);
  }, [family, weight, text, enabled]);
}

function useVisible<T extends Element>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) return setVisible(true);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, visible] as const;
}

const FONT_SAMPLE = 'Aa Promptea 123';

function FontDemo({ demo }: { demo: Extract<DemoSpec, { kind: 'font' }> }) {
  const [ref, visible] = useVisible<HTMLDivElement>();
  const sample = demo.sample ?? FONT_SAMPLE;
  const text = demo.upper ? sample.toUpperCase() : sample;
  useGoogleFont(demo.family, demo.weight, text, visible);
  return (
    <div ref={ref} class="demo demo-font">
      <span style={{ fontFamily: `'${demo.family}', var(--font)`, fontWeight: demo.weight ?? 400 }}>{text}</span>
    </div>
  );
}

/** Capas que son una copia desenfocada de la foto; la máscara de demos.css deja nítida la zona en foco. */
const PHOTO_OVERLAYS: Partial<Record<FilterOverlay, string>> = {
  bokeh: 'blur(4px)',
  tilt: 'blur(3px)',
  motion: 'url(#pf-motion)',
};

/** La foto con un filtro y su capa encima. */
function PhotoLayer({ src, look }: { src: string; look: PhotoLook }) {
  return (
    <>
      <img src={src} alt="" loading="lazy" decoding="async" style={{ filter: look.css }} />
      {look.overlay &&
        (PHOTO_OVERLAYS[look.overlay] ? (
          <img
            class={`ov ov-${look.overlay}`}
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            style={{ filter: `${look.css === 'none' ? '' : look.css} ${PHOTO_OVERLAYS[look.overlay]}` }}
          />
        ) : (
          <span class={`ov ov-${look.overlay}`} />
        ))}
    </>
  );
}

function usePhotoSrc() {
  const { photo } = useContext(DemoContext);
  const p = samplePhoto(photo);
  return [url(`/${p.src}`), `--fx:${p.focus[0]}%;--fy:${p.focus[1]}%`] as const;
}

/** El filtro aplicado de verdad sobre la foto de muestra elegida (ver photos.ts y FilterDefs.tsx). */
function FilterDemo({ demo, strength = 1 }: { demo: PhotoLook; strength?: number }) {
  const [src, focus] = usePhotoSrc();
  return (
    <div class="demo demo-filter" style={focus} aria-hidden="true">
      {strength < 1 && <img src={src} alt="" loading="lazy" decoding="async" />}
      <div class="fx" style={strength < 1 ? { opacity: strength } : undefined}>
        <PhotoLayer src={src} look={demo} />
      </div>
    </div>
  );
}

/** Antes y después: la mitad derecha muestra el resultado. */
function CompareDemo({ demo }: { demo: Extract<DemoSpec, { kind: 'compare' }> }) {
  const [src, focus] = usePhotoSrc();
  return (
    <div class="demo demo-filter demo-compare" style={focus} aria-hidden="true">
      <div class="fx">
        <PhotoLayer src={src} look={demo.before} />
      </div>
      <div class="fx after">
        <PhotoLayer src={src} look={demo.after} />
      </div>
      <span class="cmp-tag">{t.builder.before}</span>
      <span class="cmp-tag cmp-after">{t.builder.after}</span>
    </div>
  );
}

/** El filtro elegido (o uno de muestra) a la intensidad de esta opción. */
function StrengthDemo({ value }: { value: number }) {
  const { look } = useContext(DemoContext);
  return <FilterDemo demo={look ?? DEFAULT_LOOK} strength={value} />;
}

export function Demo({ demo, label }: { demo?: DemoSpec; label: string }) {
  if (!demo) return <div class="demo demo-none" aria-hidden="true" />;
  switch (demo.kind) {
    case 'swatch':
      return (
        <div class="demo demo-swatch" aria-hidden="true">
          {demo.colors.map((c) => (
            <span key={c} style={{ background: c }} />
          ))}
        </div>
      );
    case 'font':
      return <FontDemo demo={demo} />;
    case 'filter':
      return <FilterDemo demo={demo} />;
    case 'compare':
      return <CompareDemo demo={demo} />;
    case 'strength':
      return <StrengthDemo value={demo.value} />;
    case 'light':
      return (
        <div class="demo demo-light" style={{ background: demo.bg }} aria-hidden="true">
          <span class="sphere" style={{ background: demo.sphere, boxShadow: demo.glow }} />
          <span class="floor" />
        </div>
      );
    case 'texture':
      return (
        <div class="demo" aria-hidden="true">
          <span class={`tx tx-${demo.name}`} />
        </div>
      );
    case 'diagram':
      return (
        <div class="demo demo-diagram" aria-hidden="true">
          <svg viewBox="0 0 120 90" class="dg" dangerouslySetInnerHTML={{ __html: DIAGRAMS[demo.name] ?? '' }} />
        </div>
      );
    case 'ratio': {
      const scale = 60 / Math.max(demo.w, demo.h);
      return (
        <div class="demo demo-ratio" aria-hidden="true">
          <span style={{ width: `${demo.w * scale}%`, aspectRatio: `${demo.w} / ${demo.h}` }}>
            {demo.w}:{demo.h}
          </span>
        </div>
      );
    }
    case 'gradient':
      return (
        <div class="demo demo-gradient" style={{ background: `linear-gradient(135deg, ${demo.colors.join(', ')})` }} aria-hidden="true">
          {demo.glyph && <span>{demo.glyph}</span>}
        </div>
      );
    case 'image':
      return demo.src ? (
        <div class="demo">
          <img src={url(`/${demo.src}`)} alt={demo.alt} loading="lazy" decoding="async" />
        </div>
      ) : (
        <div
          class="demo demo-pending"
          style={{ background: `linear-gradient(135deg, ${demo.fallback.join(', ')})` }}
          title="Ejemplo visual en preparación"
        >
          <span>{label}</span>
        </div>
      );
  }
}
