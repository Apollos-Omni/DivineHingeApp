import { create } from "zustand";
export type ActivityType =
  | "motion"
  | "lock"
  | "unlock"
  | "open"
  | "close"
  | "schedule";
export type Activity = {
  id: string;
  type: ActivityType;
  doorId?: string;
  note?: string;
  ts: number;
};
type ActivityState = {
  feed: Activity[];
  add: (a: Omit<Activity, "id">) => void;
  clear: () => void;
};
const uid = () => Math.random().toString(36).slice(2, 10);
export const useActivityState = create<ActivityState>((set) => ({
  feed: [],
  add: (a) =>
    set((s) => ({ feed: [{ id: uid(), ...a }, ...s.feed].slice(0, 500) })),
  clear: () => set({ feed: [] }),
}));
