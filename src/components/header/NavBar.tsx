import { usePathname } from "next/navigation";
import React from "react";
import PolicyDropdownItem from "./PolicyDropdownItem";
import Link from "next/link";

export default function NavBar() {
  const pathname = usePathname();
  const routeNameMap: Record<string, string> = {
    "/": "Trang chủ",
    "/gioi-thieu": "Giới thiệu",
    "/san-pham-all": "Sản phẩm",
    "/san-pham-sale": "Sản phẩm sale",
    "/chinh-sach-doi-tra": "Chính sách đổi trả",
    "/chinh-sach-thanh-toan": "Chính sách thanh toán",
    "/chinh-sach-giao-hang": "Chính sách giao hàng",
    "/lien-he": "Liên hệ",
    "/thu-ao-online": "Thử áo bằng AI",
  };
  return (
    <div>
      {/* Mobile Nav (active only) */}
      <nav className="bg-[url('/images/leaf.jpg')] text-white md:hidden">
        <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between py-3">
          <span className="text-lg font-semibold">
            {routeNameMap[pathname] || "Trang"}
          </span>
        </div>
      </nav>

      {/* NAVBAR DESKTOP */}
      <nav className="hidden md:block text-white bg-[url('/images/wet-leaf.jpg')] bg-cover bg-center">
        <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between py-3">
          <ul className="flex flex-wrap gap-4 font-semibold">
            <li>
              <Link
                href="/"
                className={`px-5 py-2 rounded-full transition ${
                  pathname === "/"
                    ? "bg-gray-100 text-green-700"
                    : "hover:opacity-80"
                }`}
              >
                Trang chủ
              </Link>
            </li>
            <li>
              <Link
                href="/gioi-thieu"
                className={`px-5 py-2 rounded-full transition ${
                  pathname === "/gioi-thieu"
                    ? "bg-gray-100 text-green-700"
                    : "hover:opacity-80"
                }`}
              >
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link
                href="/san-pham-all"
                className={`px-5 py-2 rounded-full transition ${
                  pathname === "/san-pham-all"
                    ? "bg-gray-100 text-green-700"
                    : "hover:opacity-80"
                }`}
              >
                Sản phẩm
              </Link>
            </li>
            <li>
              <Link
                href="/san-pham-sale"
                className={`px-5 py-2 rounded-full transition ${
                  pathname === "/san-pham-sale"
                    ? "bg-gray-100 text-green-700"
                    : "hover:opacity-80"
                }`}
              >
                Sản phẩm sale
              </Link>
            </li>
            <PolicyDropdownItem />
            <li>
              <Link
                href="/lien-he"
                className={`px-5 py-2 rounded-full transition ${
                  pathname === "/lien-he"
                    ? "bg-gray-100 text-green-700"
                    : "hover:opacity-80"
                }`}
              >
                Liên hệ
              </Link>
            </li>
            <li>
              <Link
                href="/thu-ao-online"
                className={`px-5 py-2 rounded-full transition ${
                  pathname === "/thu-ao-online"
                    ? "bg-gray-100 text-green-700"
                    : "hover:opacity-80"
                }`}
              >
                Thử áo bằng AI
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
