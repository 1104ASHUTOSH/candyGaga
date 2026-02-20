import { describe, expect, it } from 'vitest';
import { Match3Engine } from '../src/game-engine/match3Engine';

const level = {
  id: 99,
  gridSize: 6,
  moves: 20,
  objectives: { collect: { red: 1 } },
  difficulty: 'easy' as const
};

describe('Match3Engine', () => {
  it('detects horizontal matches', () => {
    const engine = new Match3Engine(level);
    const board = engine.state.board;
    board[0][0] = { ...board[0][0]!, color: 'red', special: 'none' };
    board[0][1] = { ...board[0][1]!, color: 'red', special: 'none' };
    board[0][2] = { ...board[0][2]!, color: 'red', special: 'none' };
    expect(engine.findMatches(board).length).toBeGreaterThan(0);
  });

  it('detects t-or-l composite matches', () => {
    const engine = new Match3Engine(level);
    const b = engine.state.board;
    b[1][2] = { ...b[1][2]!, color: 'green', special: 'none' };
    b[2][2] = { ...b[2][2]!, color: 'green', special: 'none' };
    b[3][2] = { ...b[3][2]!, color: 'green', special: 'none' };
    b[2][1] = { ...b[2][1]!, color: 'green', special: 'none' };
    b[2][3] = { ...b[2][3]!, color: 'green', special: 'none' };
    expect(engine.findMatches(b).some((m) => m.shape === 't_or_l')).toBe(true);
  });

  it('refills null gaps', () => {
    const engine = new Match3Engine(level);
    engine.state.board[5][0] = null;
    const refilled = engine.refillBoard(engine.state.board);
    expect(refilled[5][0]).not.toBeNull();
  });

  it('creates special tiles for length 4+ matches through clear', () => {
    const engine = new Match3Engine(level);
    const board = engine.state.board;
    for (let i = 0; i < 4; i += 1) board[0][i] = { ...board[0][i]!, color: 'blue', special: 'none' };
    const matches = engine.findMatches(board).filter((m) => m.length >= 4);
    const cleared = engine.clearMatches(board, matches);
    expect(cleared[0][0]?.special).toBe('line');
  });

  it('rejects non-adjacent swaps', () => {
    const engine = new Match3Engine(level);
    expect(engine.swap({ row: 0, col: 0 }, { row: 2, col: 2 })).toBe(false);
  });

  it('decrements objectives on clear', () => {
    const engine = new Match3Engine({ ...level, objectives: { collect: { red: 3 } } });
    const board = engine.state.board;
    board[0][0] = { ...board[0][0]!, color: 'red', special: 'none' };
    board[0][1] = { ...board[0][1]!, color: 'red', special: 'none' };
    board[0][2] = { ...board[0][2]!, color: 'red', special: 'none' };
    const matches = engine.findMatches(board);
    engine.clearMatches(board, matches);
    expect(engine.state.objectives.collect.red).toBe(0);
  });
});
