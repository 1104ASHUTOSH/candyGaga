import type { ProgressPayload } from '../models/types.js';

const memoryStore = new Map<string, ProgressPayload>();

export const saveProgress = async (payload: ProgressPayload): Promise<void> => {
  memoryStore.set(payload.userId, payload);
};

export const loadProgress = async (userId: string): Promise<ProgressPayload | null> => {
  return memoryStore.get(userId) ?? null;
};
