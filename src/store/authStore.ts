"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isLogin: boolean;
  setLogin: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLogin: false,

      setLogin: (value) => set({ isLogin: value }),

      logout: () => {
        set({ isLogin: false });
        if (typeof window !== "undefined") {
          useAuthStore.persist.clearStorage(); // optional: remove LS entry
        }
      },
    }),
    {
      name: "authInfo",
      partialize: (state) => ({
        isLogin: state.isLogin,
      }),
    }
  )
);
