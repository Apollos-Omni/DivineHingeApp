import { create } from "zustand";
export type ScheduleKind = "daily" | "once";
export type LockAction = "lock" | "unlock";
export type Schedule = {
  id: string;
  doorId: string;
  action: LockAction;
  kind: ScheduleKind;
  time: string;
  enabled: boolean;
};
type State = {
  schedules: Schedule[];
  addDaily: (doorId: string, action: LockAction, hhmm: string) => void;
  addOnce: (doorId: string, action: LockAction, iso: string) => void;
  toggle: (id: string, enabled: boolean) => void;
  remove: (id: string) => void;
};
const uid = () => Math.random().toString(36).slice(2, 10);
export const useScheduleState = create<State>((set) => ({
  schedules: [],
  addDaily: (doorId, action, hhmm) =>
    set((s) => ({
      schedules: [
        ...s.schedules,
        { id: uid(), doorId, action, kind: "daily", time: hhmm, enabled: true },
      ],
    })),
  addOnce: (doorId, action, iso) =>
    set((s) => ({
      schedules: [
        ...s.schedules,
        { id: uid(), doorId, action, kind: "once", time: iso, enabled: true },
      ],
    })),
  toggle: (id, enabled) =>
    set((s) => ({
      schedules: s.schedules.map((x) => (x.id === id ? { ...x, enabled } : x)),
    })),
  remove: (id) =>
    set((s) => ({ schedules: s.schedules.filter((x) => x.id !== id) })),
}));
