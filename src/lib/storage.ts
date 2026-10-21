/**
 * Historial y favoritos, guardados solo en el navegador del usuario (sin login ni servidor).
 * Todo acceso está protegido: en modo privado o con el almacenamiento bloqueado la web sigue funcionando.
 */
import type { Selections } from '../engine/types';

export interface SavedPrompt {
  id: string;
  createdAt: number;
  sectionId: string;
  areaId: string;
  modelId: string;
  title: string;
  prompt: string;
  negative?: string;
  selections: Selections;
  advanced: boolean;
}

const KEYS = {
  history: 'promptea:historial',
  favorites: 'promptea:favoritos',
  prefs: 'promptea:preferencias',
} as const;

const HISTORY_LIMIT = 50;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('promptea:storage', { detail: key }));
  } catch {
    /* almacenamiento no disponible: se ignora */
  }
}

export const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export const getHistory = () => read<SavedPrompt[]>(KEYS.history, []);
export const getFavorites = () => read<SavedPrompt[]>(KEYS.favorites, []);

export function addToHistory(entry: SavedPrompt) {
  // Evita duplicar el mismo prompt si se copia varias veces seguidas.
  const list = getHistory().filter((e) => e.prompt !== entry.prompt);
  write(KEYS.history, [entry, ...list].slice(0, HISTORY_LIMIT));
}

export function isFavorite(prompt: string) {
  return getFavorites().some((e) => e.prompt === prompt);
}

export function toggleFavorite(entry: SavedPrompt): boolean {
  const list = getFavorites();
  const exists = list.some((e) => e.prompt === entry.prompt);
  write(KEYS.favorites, exists ? list.filter((e) => e.prompt !== entry.prompt) : [entry, ...list]);
  return !exists;
}

export function removeEntry(kind: 'history' | 'favorites', id: string) {
  const key = KEYS[kind];
  write(key, read<SavedPrompt[]>(key, []).filter((e) => e.id !== id));
}

export function clearHistory() {
  write(KEYS.history, []);
}

export function findSaved(id: string): SavedPrompt | undefined {
  return [...getFavorites(), ...getHistory()].find((e) => e.id === id);
}

export interface Prefs {
  modelId: string;
  advanced: boolean;
}

export const getPrefs = (): Prefs => ({ modelId: 'generico', advanced: false, ...read<Partial<Prefs>>(KEYS.prefs, {}) });
export const setPrefs = (p: Partial<Prefs>) => write(KEYS.prefs, { ...getPrefs(), ...p });
