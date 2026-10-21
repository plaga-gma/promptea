import { useEffect, useRef, useState } from 'preact/hooks';
import type { Demo as DemoSpec } from '../../engine/types';
import { url } from '../../lib/url';
import { DIAGRAMS } from './diagrams';

/** Carga una fuente de Google Fonts solo cuando la tarjeta entra en pantalla, y solo con las letras de la muestra. */
const loadedFonts = new Set<string>();
function useGoogleFont(family: string, weight: number | undefined, text: string, enabled: boolean) {
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
      return (
        <div class="demo demo-filter" aria-hidden="true">
          <img src={url('/demos/muestra.svg')} alt="" loading="lazy" decoding="async" style={{ filter: demo.css }} />
          {demo.overlay && <span class={`ov ov-${demo.overlay}`} />}
        </div>
      );
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
        <div class="demo" style={{ background: `linear-gradient(135deg, ${demo.colors.join(', ')})` }} aria-hidden="true" />
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
