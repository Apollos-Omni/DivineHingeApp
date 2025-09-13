// types.ts

export interface User {
  id: string;
  email: string;
  display_name?: string;
  avatar_id?: string;
  karma_level: number;
  resilience_level: number;
  aura_level: number;
  full_name?: string; // from profiles table
  avatar_url?: string; // from profiles table
  created_at: string;
  updated_at: string;
}

export interface Avatar {
  id: string;
  user_id: string;
  level: number;
  experience: number;
  unlocked_upgrades: string[];
  is_active: boolean; // added to match DB
  created_at: string;
  updated_at: string;
}

export interface HingeEvent {
  id: string;
  user_id: string;
  door_id: string;
  action: "open" | "close";
  status: "locked" | "unlocked";
  timestamp: string; // matches DB
}

export interface KarmaRecord {
  id: string;
  user_id: string;
  value: number;
  reason?: string;
  timestamp: string; // matches DB
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body?: string;
  read: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserAura {
  id: string;
  user_id: string;
  type: string;
  level: number;
  created_at: string;
  updated_at: string;
}

export interface NeuralMirror {
  id: string;
  user_id: string;
  state: any; // JSON object
  created_at: string;
  updated_at: string;
}

export interface VisionTrail {
  id: string;
  user_id: string;
  task: string;
  status: "pending" | "in_progress" | "completed";
  points: number;
  created_at: string;
  updated_at: string;
}

export interface Vision {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}
