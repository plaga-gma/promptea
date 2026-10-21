import { createContext } from 'preact';
import type { Demo } from '../../engine/types';

export type FilterLook = Extract<Demo, { kind: 'filter' }>;

/**
 * Fotos de muestra para ver los filtros aplicados. Son de dominio público o CC0
 * (ver public/demos/fotos/CREDITOS.md); la ilustración es propia. `focus` es el punto
 * que queda nítido en los filtros de desenfoque, en % del ancho y del alto.
 */
export interface SamplePhoto {
  id: string;
  label: string;
  src: string;
  focus: [number, number];
}

export const SAMPLE_PHOTOS: SamplePhoto[] = [
  { id: 'retrato', label: 'Retrato', src: 'demos/fotos/retrato.webp', focus: [42, 38] },
  { id: 'gato', label: 'Animal', src: 'demos/fotos/gato.webp', focus: [55, 50] },
  { id: 'cafe', label: 'Producto', src: 'demos/fotos/cafe.webp', focus: [44, 40] },
  { id: 'cohete', label: 'Noche', src: 'demos/fotos/cohete.webp', focus: [50, 55] },
  { id: 'ilustracion', label: 'Ilustración', src: 'demos/muestra.svg', focus: [40, 70] },
];

export const samplePhoto = (id: string) => SAMPLE_PHOTOS.find((p) => p.id === id) ?? SAMPLE_PHOTOS[0]!;

/** Lo que muestra el paso "Intensidad" mientras no se eligió ningún filtro. */
export const DEFAULT_LOOK: FilterLook = { kind: 'filter', css: 'url(#pf-vintage)', overlay: 'vignette' };

/**
 * Lo que comparten las demos de filtros de la página: la foto elegida y el filtro elegido en el área,
 * que el paso "Intensidad" muestra a distintas fuerzas. Las tarjetas de filtros van siempre enteras, para compararlas.
 */
export interface DemoSettings {
  photo: string;
  look?: FilterLook;
  setPhoto: (id: string) => void;
}

export const DemoContext = createContext<DemoSettings>({ photo: SAMPLE_PHOTOS[0]!.id, setPhoto: () => {} });
