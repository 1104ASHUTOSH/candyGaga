import levels from '../levels/levels.json';
import type { LevelData } from './levelTypes';

const parsedLevels = levels as LevelData[];

export const getLevels = (): LevelData[] => parsedLevels;

export const getLevelById = (id: number): LevelData | undefined =>
  parsedLevels.find((level) => level.id === id);

export const validateLevelSolvability = (level: LevelData): boolean => {
  const target = Object.values(level.objectives.collect).reduce((sum, value) => sum + (value ?? 0), 0);
  return level.moves >= Math.ceil(target / 3);
};
