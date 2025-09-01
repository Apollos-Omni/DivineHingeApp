import create from 'zustand';

interface GlobalState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useGlobalState = create<GlobalState>((set) => ({
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));
// Placeholder for globalState.ts
