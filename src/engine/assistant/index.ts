/**
 * Asistente de Promptea: trabaja por detrás del usuario sin servidor ni descargas.
 * - interpretIdea: entiende una idea escrita y elige opciones.
 * - autofill: completa los pasos vacíos con opciones que combinan.
 * - scorePrompt: mide el "Poder del prompt" y propone el próximo paso.
 * - enhanceSpec: arma la versión larga y óptima del prompt.
 * Ver docs/09-asistente-ia.md.
 */
export { interpretIdea, mergeSelections, type IdeaMatch, type IdeaResult } from './interpret';
export { autofill, chosenIds, suggestFor, type AutoPick } from './autofill';
export { LEVELS, levelOf, scorePrompt, type Level, type Power, type PowerPart } from './score';
export { enhanceSpec } from './enhance';
export { normalize } from './text';
