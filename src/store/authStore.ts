import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthPayload } from "@/types/user";

interface AuthState {
  isLogin: boolean;
  loggedUser?: AuthPayload["loggedUser"];
  setUser: (payload: AuthPayload | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLogin: false,
      loggedUser: undefined,

      setUser: (user) =>
        set(() => ({
          ...user,
          isLogin: true,
        })),

      logout: () => {
        // Clear Zustand state
        set({
          isLogin: false,
          loggedUser: undefined,
        });

        // Also clear persisted state
        if (typeof window !== "undefined") {
          localStorage.removeItem("authInfo");
        }
      },
    }),
    {
      name: "authInfo", // localStorage key
      // Optional: only persist safe data
      partialize: (state) => ({
        isLogin: state.isLogin,
        loggedUser: state.loggedUser,
      }),
    }
  )
);
