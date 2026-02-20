export interface ProgressPayload {
  userId: string;
  levelId: number;
  movesLeft: number;
  score: number;
  completed: boolean;
}

export interface AnalyticsEvent {
  userId: string;
  event: string;
  metadata?: Record<string, unknown>;
}
