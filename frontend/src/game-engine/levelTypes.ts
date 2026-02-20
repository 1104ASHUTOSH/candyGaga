import type { TileColor } from './types';

export interface LevelData {
  id: number;
  gridSize: number;
  moves: number;
  objectives: {
    collect: Partial<Record<TileColor, number>>;
  };
  blockers?: {
    ice?: number;
  };
  difficulty: 'easy' | 'medium' | 'hard';
}
