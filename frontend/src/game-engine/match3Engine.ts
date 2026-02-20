import type { GameState, MatchGroup, Position, Tile, TileColor } from './types';
import type { LevelData } from './levelTypes';

const COLORS: TileColor[] = ['red', 'blue', 'green', 'yellow', 'purple'];

const createTile = (color?: TileColor): Tile => ({
  id: crypto.randomUUID(),
  color: color ?? COLORS[Math.floor(Math.random() * COLORS.length)],
  special: 'none'
});

const cloneBoard = (board: (Tile | null)[][]): (Tile | null)[][] => board.map((row) => [...row]);

const keyOf = ({ row, col }: Position): string => `${row},${col}`;

export class Match3Engine {
  public state: GameState;
  private readonly gridSize: number;

  constructor(level: LevelData) {
    this.gridSize = level.gridSize;
    this.state = {
      board: this.createInitialBoard(),
      score: 0,
      movesLeft: level.moves,
      objectives: { collect: { ...level.objectives.collect } },
      completed: false
    };
    this.removeInitialMatches();
  }

  private createInitialBoard(): Tile[][] {
    return Array.from({ length: this.gridSize }, () =>
      Array.from({ length: this.gridSize }, () => createTile())
    );
  }

  private removeInitialMatches(): void {
    let matches = this.findMatches(this.state.board);
    while (matches.length > 0) {
      this.state.board = this.refillBoard(this.clearMatches(this.state.board, matches));
      matches = this.findMatches(this.state.board);
    }
  }

  findMatches(board: (Tile | null)[][]): MatchGroup[] {
    const matches: MatchGroup[] = [];
    const horizontal = new Map<string, Position[]>();
    const vertical = new Map<string, Position[]>();

    for (let row = 0; row < this.gridSize; row += 1) {
      let streak = 1;
      for (let col = 1; col <= this.gridSize; col += 1) {
        const cur = col < this.gridSize ? board[row][col]?.color : null;
        const prev = board[row][col - 1]?.color;
        if (cur && prev && cur === prev) {
          streak += 1;
        } else {
          if (streak >= 3 && prev) {
            const positions = Array.from({ length: streak }, (_, i) => ({ row, col: col - streak + i }));
            matches.push({ positions, length: streak, shape: 'line' });
            horizontal.set(`${row}-${prev}`, positions);
          }
          streak = 1;
        }
      }
    }

    for (let col = 0; col < this.gridSize; col += 1) {
      let streak = 1;
      for (let row = 1; row <= this.gridSize; row += 1) {
        const cur = row < this.gridSize ? board[row][col]?.color : null;
        const prev = board[row - 1][col]?.color;
        if (cur && prev && cur === prev) {
          streak += 1;
        } else {
          if (streak >= 3 && prev) {
            const positions = Array.from({ length: streak }, (_, i) => ({ row: row - streak + i, col }));
            matches.push({ positions, length: streak, shape: 'line' });
            vertical.set(`${col}-${prev}`, positions);
          }
          streak = 1;
        }
      }
    }

    horizontal.forEach((hPositions, hKey) => {
      const [, color] = hKey.split('-');
      vertical.forEach((vPositions, vKey) => {
        const [, vColor] = vKey.split('-');
        if (color !== vColor) return;
        const hSet = new Set(hPositions.map(keyOf));
        const overlap = vPositions.find((p) => hSet.has(keyOf(p)));
        if (overlap) {
          matches.push({
            positions: [...hPositions, ...vPositions],
            length: hPositions.length + vPositions.length - 1,
            shape: 't_or_l'
          });
        }
      });
    });

    return matches;
  }

  clearMatches(board: (Tile | null)[][], matches: MatchGroup[]): (Tile | null)[][] {
    const next = cloneBoard(board);
    const touched = new Set<string>();

    matches.forEach((match) => {
      const special = this.resolveSpecial(match);
      match.positions.forEach(({ row, col }, idx) => {
        const k = `${row},${col}`;
        if (touched.has(k)) return;
        touched.add(k);
        const tile = next[row][col];
        if (tile) {
          this.state.objectives.collect[tile.color] = Math.max(
            (this.state.objectives.collect[tile.color] ?? 0) - 1,
            0
          );
          this.state.score += 10;
          if (idx === 0 && special !== 'none') {
            next[row][col] = { ...tile, special };
            return;
          }
        }
        next[row][col] = null;
      });
    });
    return next;
  }

  refillBoard(board: (Tile | null)[][]): Tile[][] {
    const next = cloneBoard(board);
    for (let col = 0; col < this.gridSize; col += 1) {
      let empty = this.gridSize - 1;
      for (let row = this.gridSize - 1; row >= 0; row -= 1) {
        if (next[row][col]) {
          next[empty][col] = next[row][col];
          if (empty !== row) next[row][col] = null;
          empty -= 1;
        }
      }
      while (empty >= 0) {
        next[empty][col] = createTile();
        empty -= 1;
      }
    }
    return next as Tile[][];
  }

  private resolveSpecial(match: MatchGroup): Tile['special'] {
    if (match.shape === 't_or_l') return 'area';
    if (match.length >= 5) return 'colorBomb';
    if (match.length === 4) return 'line';
    return 'none';
  }

  private isAdjacent(a: Position, b: Position): boolean {
    const rowDelta = Math.abs(a.row - b.row);
    const colDelta = Math.abs(a.col - b.col);
    return rowDelta + colDelta === 1;
  }

  swap(a: Position, b: Position): boolean {
    if (!this.isAdjacent(a, b)) return false;
    if (this.state.movesLeft <= 0 || this.state.completed) return false;
    const board = cloneBoard(this.state.board);
    [board[a.row][a.col], board[b.row][b.col]] = [board[b.row][b.col], board[a.row][a.col]];
    const matches = this.findMatches(board);
    if (matches.length === 0) return false;

    this.state.board = board;
    this.state.movesLeft -= 1;
    let cascadeCount = 0;
    let currentMatches = matches;

    while (currentMatches.length && cascadeCount < 50) {
      this.state.board = this.refillBoard(this.clearMatches(this.state.board, currentMatches));
      currentMatches = this.findMatches(this.state.board);
      cascadeCount += 1;
    }

    this.state.completed = Object.values(this.state.objectives.collect).every((v) => (v ?? 0) <= 0);
    return true;
  }
}
