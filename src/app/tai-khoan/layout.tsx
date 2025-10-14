// app/tai-khoan/layout.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";

const accountMenu = [
  { href: "/tai-khoan/thong-tin", label: "Thông tin tài khoản" },
  { href: "/tai-khoan/dia-chi-giao-hang-mac-dinh", label: "Địa chỉ giao hàng" },
  { href: "/tai-khoan/don-hang", label: "Đơn hàng của tôi" },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="mb-6 flex rounded-md border border-gray-300 overflow-hidden shadow">
        {accountMenu.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? "inline-block cursor-pointer bg-green-500 hover:bg-green-500 text-white font-medium py-2 px-4 rounded-lg shadow-md transition"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div>{children}</div>
    </div>
  );
}
