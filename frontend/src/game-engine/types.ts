export type TileColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple';
export type SpecialType = 'none' | 'line' | 'colorBomb' | 'area';

export interface Tile {
  id: string;
  color: TileColor;
  special: SpecialType;
}

export interface Position {
  row: number;
  col: number;
}

export interface MatchGroup {
  positions: Position[];
  length: number;
  shape: 'line' | 't_or_l';
}

export interface ObjectiveState {
  collect: Partial<Record<TileColor, number>>;
}

export interface GameState {
  board: (Tile | null)[][];
  score: number;
  movesLeft: number;
  objectives: ObjectiveState;
  completed: boolean;
}
