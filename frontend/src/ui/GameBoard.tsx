import { useState } from 'react';
import type { Tile } from '../game-engine/types';

interface Props {
  board: (Tile | null)[][];
  onSwap: (aRow: number, aCol: number, bRow: number, bCol: number) => void;
}

const colors: Record<string, string> = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-400',
  purple: 'bg-purple-500'
};

export function GameBoard({ board, onSwap }: Props): JSX.Element {
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);

  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${board.length}, minmax(0, 1fr))` }}>
      {board.map((row, r) =>
        row.map((tile, c) => {
          const isSelected = selected?.row === r && selected.col === c;
          return (
            <button
              key={`${r}-${c}-${tile?.id}`}
              className={`h-12 w-12 rounded ${colors[tile?.color ?? 'red']} border text-xs ${
                isSelected ? 'border-amber-300 ring-2 ring-amber-200' : 'border-white'
              }`}
              onClick={() => {
                if (!selected) {
                  setSelected({ row: r, col: c });
                  return;
                }
                onSwap(selected.row, selected.col, r, c);
                setSelected(null);
              }}
              aria-label={`tile-${r}-${c}`}
            >
              {tile?.special !== 'none' ? tile?.special : ''}
            </button>
          );
        })
      )}
    </div>
  );
}
