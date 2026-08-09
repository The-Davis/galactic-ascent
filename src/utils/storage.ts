import type { GameState } from '../types/game';

const STORAGE_KEY = 'galactic_ascent_save';

export function saveGame(state: GameState): void {
  try {
    const serialized = JSON.stringify({ ...state, lastSaved: Date.now() });
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (e) {
    console.error('[GalacticAscent] Failed to save game:', e);
  }
}

export function loadGame(): Partial<GameState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<GameState>;
  } catch (e) {
    console.error('[GalacticAscent] Failed to load game:', e);
    return null;
  }
}

export function deleteSave(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasSave(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null;
}
