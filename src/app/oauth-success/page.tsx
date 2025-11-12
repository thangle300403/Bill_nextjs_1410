// pages/oauth-success.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { axiosExpress } from "@/lib/axiosExpress";
import { useAuthStore } from "@/store/authStore";

export default function OAuthSuccess() {
  const router = useRouter();
  const { setLogin } = useAuthStore.getState();

  useEffect(() => {
    const mergeSession = async () => {
      try {
        await new Promise((r) => setTimeout(r, 1000));
        const res = await axiosExpress.post("/chatbot/merge-session-to-email");
        console.log("Merge session response:", res.data);
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

  return <div>Quay về trang chủ...</div>;
}
