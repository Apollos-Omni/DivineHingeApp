export interface HingeEvent {
  id: string;
  userId: string;
  doorId: string;
  timestamp: number;          // Unix epoch ms
  action: 'open' | 'close';
  status: 'locked' | 'unlocked';
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarId: string;
  karmaLevel: number;
  resilienceLevel: number;
  auraLevel: number;
  createdAt: number;
}

export interface KarmaRecord {
  id: string;
  userId: string;
  value: number;
  reason: string;
  timestamp: number;
}

export interface Avatar {
  id: string;
  userId: string;
  level: number;
  experience: number;
  unlockedUpgrades: string[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  createdAt: number;
  read: boolean;
}

export enum VisionStatus {
  Draft = 'draft',
  Active = 'active',
  Completed = 'completed',
  Archived = 'archived',
}

export interface VisionSchema {
  id: string;
  userId: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  status: VisionStatus;
  tags?: string[];
  isPublic?: boolean;
}
