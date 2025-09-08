export interface TrailStep {
  id: string;
  userId: string;
  visionId: string;
  stepName: string;
  status: 'incomplete' | 'complete';
  startedAt: number;
  completedAt?: number;
}

export interface TrailLog {
  id: string;
  trailSteps: TrailStep[];
  summary: string;
  userId: string;
  timestamp: number;
}
