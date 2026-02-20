import type { AnalyticsEvent } from '../models/types.js';

const events: AnalyticsEvent[] = [];

export const logEvent = async (event: AnalyticsEvent): Promise<void> => {
  events.push(event);
};

export const getEvents = (): AnalyticsEvent[] => events;
