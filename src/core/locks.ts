/**
 * locks.ts — central place to lock/unlock/toggle real devices.
 * Replace implementations with your hardware/API calls.
 */

export type DoorStatus = "locked" | "unlocked" | "ajar";

export async function lockDoor(id: string): Promise<DoorStatus> {
  await delay(220);
  return "locked";
}
export async function unlockDoor(id: string): Promise<DoorStatus> {
  await delay(220);
  return "unlocked";
}
export async function toggleDoor(
  id: string,
  current: DoorStatus,
): Promise<DoorStatus> {
  await delay(220);
  if (current === "locked") return "unlocked";
  if (current === "unlocked") return "locked";
  // If ajar, treat toggle as lock (customize as you wish)
  return "locked";
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
