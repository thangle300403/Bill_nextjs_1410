"use client";

import { usePopupStore } from "@/store/popupStore";
import Link from "next/link";
import React from "react";
import LoginForm from "../auth/LoginForm";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import CategorySidebar from "../CategorySidebar";
import { Category } from "@/types/category";
import Cart from "../Cart";
import { useCartStore } from "@/store/cartStore";
import { Package, ShoppingCart, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import RegisterForm from "../auth/RegisterForm";
import ForgotPassword from "../auth/ForgotPassword";
import { useIsMobile } from "@/hooks/use-mobile";
import HeaderContent from "./HeaderContent";
import NavBar from "./NavBar";
import { authEvents, axiosAuth } from "@/lib/axiosAuth";
import { useUser } from "@/hooks/useUser";

export default function Header({ categories }: { categories: Category[] }) {
  const isMobile = useIsMobile();
  const items = useCartStore((state) => state.items);
  const showPopup = usePopupStore((state) => state.showPopup);
  const router = useRouter();

  const { user, loading } = useUser();

  if (loading) return <div>Đang tải...</div>;

  const handleLogout = async () => {
    try {
      // Gửi logout request với token
      await axiosAuth.post("/logout", {});
      authEvents.emit("refreshDone");
      toast.success("Đăng xuất thành công!");
      router.push("/?showLogin=true");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Đăng xuất thất bại!");
    }
  };

  function getInitials(name: string): string {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <div>
      <header>
        {/* Top Navbar */}
        {/* <div className="top-navbar fixed top-0 left-0 right-0 z-50 bg-white shadow-md"></div> */}
        {/* ✅ MOBILE TOP HEADER ONLY */}
        {isMobile && (
          <div className="fixed top-0 left-0 w-full z-50 bg-green-600 text-white text-sm py-2 shadow">
            <div className="max-w-screen-xl mx-auto px-4 flex justify-end items-center gap-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                      {getInitials(user?.name ?? "")}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/tai-khoan/thong-tin">
                        👤 Thông tin tài khoản
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/tai-khoan/dia-chi-giao-hang-mac-dinh">
                        🏠 Địa chỉ mặc định
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/tai-khoan/don-hang">
                        📦 Đơn hàng của tôi
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      🚪 Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button
                  onClick={() => showPopup("LOGIN")}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-green-700 text-sm font-bold hover:bg-gray-100 transition"
                  title="Đăng nhập"
                >
                  <User className="w-4 h-4" />
                </button>
              )}

              {/* 🛒 Cart icon */}
              <button
                onClick={() => showPopup("CART")}
                className="relative w-8 h-8 flex items-center justify-center rounded-full bg-white text-green-700 text-lg hover:bg-gray-100 transition"
                title="Giỏ hàng"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {items.reduce((total, item) => total + item.quantity, 0)}
                </span>
              </button>
            </div>
          </div>
        )}

        {/*  Top Header Bar desktop */}
        {!isMobile && (
          <div className="top-0 left-0 w-full z-50 bg-green-600 text-white text-sm py-2 shadow-md">
            <div className="max-w-screen-xl mx-auto px-4 flex justify-between items-center">
              {/* Left Side — Optional (Logo or blank space) */}
              <div className="flex-1" />

              {/* Center — Auth Buttons or User Info */}
              <div className="flex-1 flex justify-center items-center gap-6">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <Link
                      href="/tai-khoan/don-hang"
                      className="flex items-center gap-2 hover:text-gray-300"
                    >
                      <Package className="w-4 h-4" />
                      Đơn hàng của tôi
                    </Link>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 cursor-pointer">
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                            {getInitials(user?.name ?? "")}
                          </div>
                          <span className="hover:text-gray-300 font-medium">
                            {user?.name}
                          </span>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-64">
                        <DropdownMenuItem asChild>
                          <Link href="/tai-khoan/thong-tin">
                            👤 Thông tin tài khoản
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/tai-khoan/dia-chi-giao-hang-mac-dinh">
                            🏠 Địa chỉ giao hàng
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/tai-khoan/don-hang">
                            📦 Đơn hàng của tôi
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                          🚪 Đăng xuất
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => showPopup("REGISTER")}
                      className="hover:text-gray-300 font-medium"
                    >
                      Đăng Ký
                    </button>
                    <button
                      onClick={() => showPopup("LOGIN")}
                      className="hover:text-gray-300 font-medium"
                    >
                      Đăng Nhập
                    </button>
                  </div>
                )}
              </div>

              {/* Right Side — Cart Icon */}
              <div className="flex-1 flex justify-end">
                <button
                  onClick={() => showPopup("CART")}
                  className="flex items-center gap-3 px-4 py-3 rounded-full border border-white bg-green-600 hover:bg-green-700 transition shadow-md"
                >
                  <div className="relative">
                    <ShoppingCart className="w-5 h-5 text-white" />
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                      {items.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={`${isMobile ? "mt-10" : ""}`}>
          <HeaderContent></HeaderContent>

          {/* Add Sidebar Trigger to header */}
          <CategorySidebar categories={categories}></CategorySidebar>

          <NavBar></NavBar>
        </div>
      </header>
      <RegisterForm />
      <LoginForm />
      <Cart />
      <ForgotPassword />
    </div>
  );
}
