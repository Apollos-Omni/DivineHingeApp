import {
  HingeEvent,
  UserProfile,
  KarmaRecord,
  Avatar,
  Notification,
} from "./schemas";

// Example: Map Supabase row to HingeEvent
export function mapHingeEvent(row: any): HingeEvent {
  return {
    id: row.id,
    userId: row.user_id,
    doorId: row.door_id,
    timestamp: new Date(row.timestamp).getTime(),
    action: row.action,
    status: row.status,
  };
}

export function mapUserProfile(row: any): UserProfile {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    avatarId: row.avatar_id,
    karmaLevel: row.karma_level,
    resilienceLevel: row.resilience_level,
    auraLevel: row.aura_level,
    createdAt: new Date(row.created_at).getTime(),
  };
}

// Extend for KarmaRecord, Avatar, Notification as needed
// Placeholder for dataMappers.ts
