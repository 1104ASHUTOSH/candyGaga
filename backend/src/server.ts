import express from 'express';
import cors from 'cors';
import { gameRoutes } from './routes/gameRoutes.js';
import { rateLimiter } from './middleware/rateLimiter.js';

export const app = express();
app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use('/', gameRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(4000, () => {
    console.log('Backend listening on 4000');
  });
}
