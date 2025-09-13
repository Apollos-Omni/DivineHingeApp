export interface UserProfile {
  id: string;
  username: string;
  email: string;
  region?: string;
  auraLevel?: string;
  karmaScore?: number;
  reputation?: number;
  visionCount?: number;
  mirrorCount?: number;
  trailEngagements?: number;
}
