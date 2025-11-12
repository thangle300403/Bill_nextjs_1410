import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { authEvents } from "@/lib/axiosAuth";
import { useAuthStore } from "@/store/authStore";
import { axiosExpress } from "@/lib/axiosExpress";

export const useUserNode = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isLogin = useAuthStore((s) => s.isLogin);

  const fetchUser = async () => {
    if (!useAuthStore.getState().isLogin) return;
    try {
      const res = await axiosExpress.get("/me");
      console.log("🧪 Fetched user:", res.data);
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLogin) {
      setUser(null);
      setLoading(false);
      return;
    }

    fetchUser();

    const handler = () => {
      fetchUser(); // re-fetch user after refresh
    };
    authEvents.on("refreshDone", handler);

    return () => {
      authEvents.off("refreshDone", handler);
    };
  }, [isLogin]);

  return { user, loading };
};
