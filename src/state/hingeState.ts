// DivineHingeApp/src/state/hingeState.ts

import { create } from "zustand"; // ✅ Named import

interface DoorStatus {
  doorId: string;
  isOpen: boolean;
  isLocked: boolean;
}

interface HingeState {
  doors: DoorStatus[];
  updateDoorStatus: (
    doorId: string,
    isOpen: boolean,
    isLocked: boolean,
  ) => void;
}

export const useHingeState = create<HingeState>((set) => ({
  doors: [],
  updateDoorStatus: (doorId, isOpen, isLocked) =>
    set((state) => {
      const index = state.doors.findIndex((d) => d.doorId === doorId);
      if (index !== -1) {
        const updated = [...state.doors];
        updated[index] = { doorId, isOpen, isLocked };
        return { doors: updated };
      }
      return { doors: [...state.doors, { doorId, isOpen, isLocked }] };
    }),
}));
