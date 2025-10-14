"use client";

import { useEffect } from "react";
import type { AuthPayload } from "@/types/user";
import { useAuthStore } from "@/store/authStore";

interface AppProviderProps {
  children: React.ReactNode;
  user: AuthPayload | null;
}

export function AppProvider({ children, user }: AppProviderProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const currentUser = useAuthStore((state) => state.loggedUser);

  useEffect(() => {
    if (user && !currentUser) {
      setUser({ ...user, isLogin: true });
    }
  }, [user, currentUser, setUser]);

  return <>{children}</>;
}
