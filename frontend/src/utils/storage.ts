import type { GameState } from '../game-engine/types';

const KEY = 'candygaga-progress';

export const saveProgress = (state: GameState): void => {
  localStorage.setItem(KEY, JSON.stringify(state));
};

export const loadProgress = (): GameState | null => {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  return JSON.parse(raw) as GameState;
};
