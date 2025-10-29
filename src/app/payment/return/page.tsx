"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PaymentReturnPage() {
  const [message, setMessage] = useState("Đang xác minh giao dịch...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("vnp_ResponseCode");
    if (code === "00") {
      setMessage("✅ Thanh toán VNPay thành công!");
    } else {
      setMessage("❌ Thanh toán thất bại hoặc bị hủy!");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-2xl font-semibold mb-4">{message}</h1>
      <Link href="/" className="text-blue-600 hover:underline">
        ← Quay về trang chủ
      </Link>
    </div>
  );
}
