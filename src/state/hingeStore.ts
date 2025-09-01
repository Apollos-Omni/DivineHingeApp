import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type HingeStatus = 'open' | 'closed' | 'jammed' | 'unknown';

export interface HingeData {
  id: string;
  name: string;
  location: string;
  status: HingeStatus;
  lastOpened: number | null;
  lastClosed: number | null;
  isLocked: boolean;
  autoLockTimeout?: number; // in seconds
}

interface HingeStore {
  hinges: Record<string, HingeData>;
  selectedHingeId: string | null;

  setHingeStatus: (hingeId: string, status: HingeStatus) => void;
  lockHinge: (hingeId: string) => void;
  unlockHinge: (hingeId: string) => void;
  setSelectedHinge: (hingeId: string | null) => void;
  updateHingeTime: (hingeId: string, type: 'opened' | 'closed') => void;
  loadHinges: (hinges: HingeData[]) => void;
}

export const useHingeStore = create<HingeStore>()(
  persist(
    (set) => ({
      hinges: {},
      selectedHingeId: null,

      setHingeStatus: (id, status) =>
        set((state) => ({
          hinges: {
            ...state.hinges,
            [id]: {
              ...state.hinges[id],
              status,
            },
          },
        })),

      lockHinge: (id) =>
        set((state) => ({
          hinges: {
            ...state.hinges,
            [id]: {
              ...state.hinges[id],
              isLocked: true,
            },
          },
        })),

      unlockHinge: (id) =>
        set((state) => ({
          hinges: {
            ...state.hinges,
            [id]: {
              ...state.hinges[id],
              isLocked: false,
            },
          },
        })),

      setSelectedHinge: (id) => set({ selectedHingeId: id }),

      updateHingeTime: (id, type) =>
        set((state) => ({
          hinges: {
            ...state.hinges,
            [id]: {
              ...state.hinges[id],
              lastOpened:
                type === 'opened' ? Date.now() : state.hinges[id].lastOpened,
              lastClosed:
                type === 'closed' ? Date.now() : state.hinges[id].lastClosed,
            },
          },
        })),

      loadHinges: (hinges) =>
        set(() => ({
          hinges: hinges.reduce((acc, hinge) => {
            acc[hinge.id] = hinge;
            return acc;
          }, {} as Record<string, HingeData>),
        })),
    }),
    {
      name: 'hinge-storage', // localStorage key
    }
  )
);
