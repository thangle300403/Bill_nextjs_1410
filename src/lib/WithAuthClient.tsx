"use client";

import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function WithAuthClient({
  children,
  redirectTo = "/?showLogin=true",
}: {
  children: ReactNode;
  redirectTo?: string;
}) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  useEffect(() => {
    if (!loading && user) {
      console.log(
        "✅ User loaded hihi:",
        user,
        "at",
        new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
      );
    }
  }, [loading, user]);

  if (loading || !user) return <div>Loading...</div>;

  return <>{children}</>;
}
