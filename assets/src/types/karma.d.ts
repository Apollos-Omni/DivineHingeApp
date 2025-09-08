export interface KarmaContract {
  id: string;
  userId: string;
  task: string;
  rewardPoints: number;
  status: 'pending' | 'completed';
  timestamp: number;
}

export interface KarmaScore {
  userId: string;
  totalScore: number;
  rank: string;
  badges: string[];
}// Placeholder for karma.d.ts
