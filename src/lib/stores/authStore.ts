'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthTokens, PublicUser } from '@/lib/types';

interface AuthState {
  user: PublicUser | null;
  tokens: AuthTokens | null;
  setSession: (user: PublicUser, tokens: AuthTokens) => void;
  setTokens: (tokens: AuthTokens) => void;
  setUser: (user: PublicUser | null) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      setSession: (user, tokens) => set({ user, tokens }),
      setTokens: (tokens) => set({ tokens }),
      setUser: (user) => set({ user }),
      clear: () => set({ user: null, tokens: null }),
    }),
    {
      name: 'golipooli-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ user: s.user, tokens: s.tokens }),
    },
  ),
);
