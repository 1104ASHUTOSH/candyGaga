import { useEffect, useMemo, useState } from 'react';
import Phaser from 'phaser';
import { Match3Engine } from './game-engine/match3Engine';
import { getLevelById } from './game-engine/levelLoader';
import { Match3Scene } from './scenes/Match3Scene';
import type { GameState } from './game-engine/types';
import { GameBoard } from './ui/GameBoard';
import { loadProgress, saveProgress } from './utils/storage';

const level = getLevelById(1);
if (!level) throw new Error('Level not found');

export default function App(): JSX.Element {
  const engine = useMemo(() => new Match3Engine(level), []);
  const [state, setState] = useState<GameState>(engine.state);

  useEffect(() => {
    if (typeof window === 'undefined' || import.meta.env.MODE === 'test') {
      return undefined;
    }

    const app = new Phaser.Game({
      type: Phaser.CANVAS,
      width: 240,
      height: 60,
      parent: 'phaser-root',
      scene: [Match3Scene],
      backgroundColor: '#0f172a'
    });
    return () => app.destroy(true);
  }, []);

  useEffect(() => {
    const saved = loadProgress();
    if (saved) {
      engine.state = saved;
      setState(saved);
    }
  }, [engine]);

  useEffect(() => {
    saveProgress(state);
  }, [state]);

  return (
    <main className="min-h-screen text-white p-4 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">CandyGaga Original Match-3</h1>
      <div id="phaser-root" />
      <section className="bg-slate-800 p-4 rounded w-full max-w-md">
        <p>Moves Left: {state.movesLeft}</p>
        <p>Score: {state.score}</p>
        <p>Objective Red Remaining: {state.objectives.collect.red ?? 0}</p>
      </section>
      <GameBoard
        board={state.board}
        onSwap={(aRow, aCol, bRow, bCol) => {
          if (engine.swap({ row: aRow, col: aCol }, { row: bRow, col: bCol })) {
            setState({ ...engine.state, board: engine.state.board.map((row) => [...row]) });
          }
        }}
      />
      {state.completed && <div className="bg-emerald-700 px-4 py-2 rounded">You Win!</div>}
      {state.movesLeft <= 0 && !state.completed && <div className="bg-rose-700 px-4 py-2 rounded">You Lose! Retry</div>}
      <button
        className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded"
        onClick={() => {
          const next = new Match3Engine(level);
          setState(next.state);
        }}
      >
        Retry
      </button>
    </main>
  );
}
