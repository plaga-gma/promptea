import type { Area, Section } from '../engine/types';
import { imagenes } from './imagenes/section';

/**
 * Registro de secciones. Para sumar una sección nueva (video, webs, cursos…):
 * crear su carpeta en src/sections/<id>/ con su section.ts y agregarla acá.
 * Las páginas se generan solas a partir de este registro.
 */
export const SECTIONS: Section[] = [imagenes];

export function findArea(sectionId: string, areaId: string): { section: Section; area: Area } | undefined {
  const section = SECTIONS.find((s) => s.id === sectionId);
  const area = section?.areas.find((a) => a.id === areaId);
  return section && area ? { section, area } : undefined;
}
