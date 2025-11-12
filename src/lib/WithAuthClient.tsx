"use client";

import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef } from "react";

export default function WithAuthClient({
  children,
  redirectTo = "/?showLogin=true",
}: {
  children: ReactNode;
  redirectTo?: string;
}) {
  const { user, loading } = useUser();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Don't run while loading or if already redirected
    if (loading || hasRedirected.current) return;

    // 🧠 Delay one tick so /me has a chance to update before decision
    const timeout = setTimeout(() => {
      if (!user) {
        console.log("🚫 No user, redirecting to login...");
        hasRedirected.current = true;
        router.push(redirectTo);
      } else {
        console.log(
          "✅ User authenticated:",
          user,
          "at",
          new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
        );
      }
    }, 1000); // 50ms is enough to let user state settle

    return () => clearTimeout(timeout);
  }, [loading, user, redirectTo, router]);

  if (loading || !user) return <div>Loading...</div>;

  return <>{children}</>;
}
