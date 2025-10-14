import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { authEvents, axiosAuth } from "@/lib/axiosAuth";

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axiosAuth.get("/me");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    const handler = () => {
      fetchUser(); // re-fetch user after refresh
    };
    authEvents.on("refreshDone", handler);

    return () => {
      authEvents.off("refreshDone", handler);
    };
  }, []);

  return { user, loading };
};
