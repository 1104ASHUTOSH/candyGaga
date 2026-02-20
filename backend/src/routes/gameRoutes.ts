import { Router } from 'express';
import {
  analyticsHandler,
  levelsHandler,
  loadProgressHandler,
  saveProgressHandler
} from '../controllers/gameController.js';

export const gameRoutes = Router();

gameRoutes.get('/levels', levelsHandler);
gameRoutes.post('/progress/save', saveProgressHandler);
gameRoutes.get('/progress/load', loadProgressHandler);
gameRoutes.post('/analytics/event', analyticsHandler);
