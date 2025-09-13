import { supabase } from "../database/dbClient";
import { KarmaRecord } from "../database/schemas";

interface KarmaChange {
  userId: string;
  value: number; // Positive or negative karma delta
  reason: string;
}

// Record a karma change and update user karma level
export async function updateKarma(change: KarmaChange): Promise<void> {
  // Insert karma record
  const { error } = await supabase.from("karma_records").insert({
    user_id: change.userId,
    value: change.value,
    reason: change.reason,
  });

  if (error) throw error;

  // Update user's karma level atomically
  const { error: updateError } = await supabase.rpc("increment_karma_level", {
    uid: change.userId,
    delta: change.value,
  });

  if (updateError) throw updateError;
}

// Calculate user's current karma score
export async function getUserKarmaLevel(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from("users")
    .select("karma_level")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data.karma_level;
}
// Placeholder for karmaService.ts
