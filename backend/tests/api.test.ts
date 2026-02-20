import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/server.js';

describe('API integration', () => {
  it('loads levels', async () => {
    const res = await request(app).get('/levels');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('saves and loads progress', async () => {
    const payload = { userId: 'uuid-123', levelId: 1, movesLeft: 5, score: 200, completed: false };
    const save = await request(app).post('/progress/save').send(payload);
    expect(save.status).toBe(201);

    const load = await request(app).get('/progress/load').query({ userId: 'uuid-123' });
    expect(load.status).toBe(200);
    expect(load.body.score).toBe(200);
  });
});
