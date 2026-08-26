import { create } from 'zustand';

interface TimerState {
  secondsElapsed: number;
  increment: () => void;
  reset: () => void;
}

export const useTimerStore = create<TimerState>((set) => ({
  secondsElapsed: 0,
  increment: () => set((state) => ({ secondsElapsed: state.secondsElapsed + 1 })),
  reset: () => set({ secondsElapsed: 0 }),
}));
