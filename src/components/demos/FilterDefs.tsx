import { FILTER_MARKUP } from './filters';

/** Inserta los filtros SVG de las demos (ver filters.ts). Va una sola vez por página, dentro del armador. */
export function FilterDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute" dangerouslySetInnerHTML={{ __html: FILTER_MARKUP }} />
  );
}
