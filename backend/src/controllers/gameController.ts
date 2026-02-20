import type { Request, Response } from 'express';
import { z } from 'zod';
import { getLevels } from '../services/levelService.js';
import { loadProgress, saveProgress } from '../services/progressService.js';
import { logEvent } from '../services/analyticsService.js';

const progressSchema = z.object({
  userId: z.string().min(3),
  levelId: z.number().int(),
  movesLeft: z.number().int().nonnegative(),
  score: z.number().int().nonnegative(),
  completed: z.boolean()
});

const eventSchema = z.object({
  userId: z.string().min(3),
  event: z.string().min(1),
  metadata: z.record(z.unknown()).optional()
});

export const levelsHandler = (_: Request, res: Response): void => {
  res.json(getLevels());
};

export const saveProgressHandler = async (req: Request, res: Response): Promise<void> => {
  const parsed = progressSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  await saveProgress(parsed.data);
  res.status(201).json({ status: 'ok' });
};

export const loadProgressHandler = async (req: Request, res: Response): Promise<void> => {
  const userId = String(req.query.userId ?? '');
  const progress = await loadProgress(userId);
  if (!progress) {
    res.status(404).json({ error: 'not_found' });
    return;
  }
  res.json(progress);
};

export const analyticsHandler = async (req: Request, res: Response): Promise<void> => {
  const parsed = eventSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  await logEvent(parsed.data);
  res.status(202).json({ status: 'accepted' });
};
