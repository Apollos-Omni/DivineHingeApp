import { insertHingeEvent } from "../database/queries";
import { HingeEvent } from "../database/schemas";

type DoorAction = "open" | "close";
type DoorStatus = "locked" | "unlocked";

interface HingeEventInput {
  userId: string;
  doorId: string;
  action: DoorAction;
  status: DoorStatus;
  timestamp?: number;
}

export async function logHingeEvent(
  event: HingeEventInput,
): Promise<HingeEvent> {
  // Add timestamp if missing
  if (!event.timestamp) {
    event.timestamp = Date.now();
  }

  // Here you could add validation or transform logic before DB write
  // e.g. check for duplicate events, debounce rapid toggles, etc.

  // Insert event into DB
  const recordedEvent = await insertHingeEvent(event);
  // TODO: Trigger real-time notification or webhook after insert

  return recordedEvent;
}

// Fetch hinge event history for a specific door or user
export async function getHingeHistory(
  userId: string,
  doorId?: string,
  limit = 50,
): Promise<HingeEvent[]> {
  // Query DB for events, order by timestamp desc
  // TODO: implement using supabase or Firestore query
  return []; // Stubbed empty for now
}
// Placeholder for hingeService.ts
