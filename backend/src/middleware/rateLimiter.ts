import type { NextFunction, Request, Response } from 'express';

const bucket = new Map<string, { count: number; time: number }>();

export const rateLimiter = (req: Request, res: Response, next: NextFunction): void => {
  const key = req.ip;
  const now = Date.now();
  const entry = bucket.get(key) ?? { count: 0, time: now };
  if (now - entry.time > 60_000) {
    entry.count = 0;
    entry.time = now;
  }
  entry.count += 1;
  bucket.set(key, entry);
  if (entry.count > 120) {
    res.status(429).json({ error: 'too_many_requests' });
    return;
  }
  next();
};
