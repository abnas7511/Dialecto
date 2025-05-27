import create from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  credits: number;
  setAuthenticated: (value: boolean) => void;
  setCredits: (credits: number) => void;
  decrementCredits: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  credits: 3,
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setCredits: (credits) => set({ credits }),
  decrementCredits: () => set((state) => ({ credits: Math.max(0, state.credits - 1) })),
  logout: () => set({ isAuthenticated: false, credits: 3 }),
}));