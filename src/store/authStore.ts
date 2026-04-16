import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { MOCK_USERS, MOCK_PASSWORDS } from '../mock/data';

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (email, password) => {
        const expectedPassword = MOCK_PASSWORDS[email];
        if (!expectedPassword || expectedPassword !== password) return false;
        const user = MOCK_USERS.find(u => u.email === email);
        if (!user) return false;
        set({ user });
        return true;
      },
      logout: () => set({ user: null }),
    }),
    { name: 'hg-auth' }
  )
);
