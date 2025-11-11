// pages/oauth-success.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { axiosExpress } from "@/lib/axiosExpress";
import Loader from "@/components/Loader";
import { useAuthStore } from "@/store/authStore";

export default function OAuthSuccess() {
  const router = useRouter();
  const { setLogin } = useAuthStore.getState();

  useEffect(() => {
    const mergeSession = async () => {
      try {
        await axiosExpress.post("/chatbot/merge-session-to-email");
        setLogin(true);
        toast.success("🎉 Đăng nhập thành công!");
      } catch (error) {
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
