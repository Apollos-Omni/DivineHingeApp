export interface MatchProfile {
  id: string;
  name: string;
  age: number;
  interests: string[];
  location: string;
  compatibilityScore: number;
}

export interface HingeMatch {
  userId: string;
  matchId: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: number;
}