// app/components/CleanQuery.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CleanLoginQuery() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const hasLogin = searchParams.get("showLogin") === "true";
    if (hasLogin) {
      router.replace("/", { scroll: false });
    }
  }, [searchParams, router]);

  return null;
}
