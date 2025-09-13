import { supabase } from "./dbClient";
import { mapHingeEvent, mapUserProfile } from "./dataMappers";

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();
  if (error) throw error;
  return mapUserProfile(data);
}

export async function insertHingeEvent(event: {
  userId: string;
  doorId: string;
  action: "open" | "close";
  status: "locked" | "unlocked";
}) {
  const { data, error } = await supabase.from("hinge_events").insert({
    user_id: event.userId,
    door_id: event.doorId,
    action: event.action,
    status: event.status,
  });
  if (error) throw error;
  return mapHingeEvent(data[0]);
}

// Extend with updateAvatarXP, getKarmaRecords, etc.
// Placeholder for queries.ts
