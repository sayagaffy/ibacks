import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserSession {
  id: string; // Sanity Document ID
  name: string;
  email: string;
  phoneNumber?: string;
}

interface AuthState {
  user: UserSession | null;
  isAuthenticated: boolean;
  login: (userData: UserSession) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (userData) => set({ user: userData, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'ibacks-auth-storage',
    }
  )
);
