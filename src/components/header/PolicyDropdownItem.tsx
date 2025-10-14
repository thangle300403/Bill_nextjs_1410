"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function PolicyDropdownItem() {
  const pathname = usePathname();

  return (
    <li>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Link
            href="#"
            onClick={(e) => e.preventDefault()} // Prevent default link behavior
            className={`px-5 py-2 rounded-full transition ${
              [
                "/chinh-sach-doi-tra",
                "/chinh-sach-thanh-toan",
                "/chinh-sach-giao-hang",
              ].includes(pathname)
                ? "bg-gray-100 text-green-700"
                : "hover:opacity-80"
            }`}
          >
            Chính sách
          </Link>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60 mt-2" sideOffset={8} align="start">
          <DropdownMenuItem asChild>
            <Link
              href="/chinh-sach-doi-tra"
              className={
                pathname === "/chinh-sach-doi-tra"
                  ? "text-green-700 font-semibold"
                  : ""
              }
            >
              Chính sách đổi trả
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/chinh-sach-thanh-toan"
              className={
                pathname === "/chinh-sach-thanh-toan"
                  ? "text-green-700 font-semibold"
                  : ""
              }
            >
              Chính sách thanh toán
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/chinh-sach-giao-hang"
              className={
                pathname === "/chinh-sach-giao-hang"
                  ? "text-green-700 font-semibold"
                  : ""
              }
            >
              Chính sách giao hàng
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
}
