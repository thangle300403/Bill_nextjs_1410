// app/admin/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ Correct for App Router

export default function AdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Open actual admin panel
    window.open("http://localhost:3069/admin", "_blank");
  }, [router]);
}
