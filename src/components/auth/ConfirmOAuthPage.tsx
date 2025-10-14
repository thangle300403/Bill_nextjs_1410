/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { axiosAuth } from "@/lib/axiosAuth";

export default function ConfirmOAuthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email");
  const name = searchParams.get("name");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!email || !name) return;

    setIsSubmitting(true);

    try {
      await axiosAuth.post(`/confirm-signup`, {
        email,
        name,
        provider: "google",
      });
      toast.success("Tạo tài khoản thành công! Vui lòng đăng nhập.");
      router.push("/?showLogin=true");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Đã xảy ra lỗi");
      } else {
        toast.error("Đã xảy ra lỗi");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/");
  };

  useEffect(() => {
    if (!email) {
      toast.error("Thiếu thông tin xác nhận từ OAuth");
      router.push("/");
    }
  }, [email]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Xác nhận tạo tài khoản
        </h1>
        <p className="text-gray-600 mb-4">
          Chúng tôi nhận được email từ Google: <br />
          <span className="font-bold">{email}</span>
        </p>
        <p className="text-gray-600 mb-6">
          Bạn có muốn tạo tài khoản với email này?
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition disabled:opacity-60"
          >
            {isSubmitting ? "Đang xử lý..." : "Đồng ý và tạo tài khoản"}
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded transition"
          >
            Hủy và quay lại trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}
