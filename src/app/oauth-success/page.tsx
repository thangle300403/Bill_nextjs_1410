// pages/oauth-success.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { axiosExpress } from "@/lib/axiosExpress";
import Loader from "@/components/Loader";

export default function OAuthSuccess() {
  const router = useRouter();

  useEffect(() => {
    const mergeSession = async () => {
      try {
        await axiosExpress.post("/chatbot/merge-session-to-email");
        toast.success("🎉 Đăng nhập thành công!");
      } catch (error) {
        toast.warning("Không thể khôi phục lịch sử chat.");
        console.warn("Merge session failed:", error);
      } finally {
        router.push("/");
      }
    };

    mergeSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Loader></Loader>;
}
