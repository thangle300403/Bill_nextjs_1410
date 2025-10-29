/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { usePopupStore } from "@/store/popupStore";
import Link from "next/link";
import Loader from "../Loader";
import { authEvents, axiosAuth } from "@/lib/axiosAuth";
import { axiosExpress } from "@/lib/axiosExpress";

export default function LoginForm() {
  const inputBase =
    "w-full border border-gray-300 rounded-xl px-5 py-3 text-sm text-gray-800 bg-white shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition";
  const labelStyle = "text-sm font-semibold text-gray-700 mb-1 block";
  const errorStyle = "text-sm text-red-500 mt-1";

  const [showPassword, setShowPassword] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const showPopup = usePopupStore((state) => state.showPopup);
  const popupType = usePopupStore((state) => state.popupType);
  const closePopup = usePopupStore((state) => state.closePopup);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email không hợp lệ.")
        .required("Vui lòng nhập email.")
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Địa chỉ email không hợp lệ."
        ),
      password: Yup.string()
        .min(8, "Mật khẩu ít nhất 8 ký tự.")
        .matches(/[0-9]/, "Phải chứa ít nhất một số.")
        .matches(/[a-z]/, "Phải chứa ít nhất một chữ thường.")
        .matches(/[A-Z]/, "Phải chứa ít nhất một chữ hoa.")
        .matches(/[@$!%*?&]/, "Phải chứa ít nhất một ký tự đặc biệt.")
        .required("Vui lòng nhập mật khẩu."),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        setIsLoaded(true);
        await axiosAuth.post(`/login`, values);
        console.log("🧪 COOKIE SAU LOGIN:", document.cookie);

        // ✅ merge chatbot session
        try {
          await axiosExpress.post(`/chatbot/merge-session-to-email`);
        } catch (mergeErr) {
          console.error("Merge session error:", mergeErr);
          toast.warning("Không thể khôi phục lịch sử chat.");
        }

        closePopup();
        authEvents.emit("refreshDone");
        toast.success("🎉 Đăng nhập thành công!");
      } catch (error) {
        console.error("Login error:", error);
        setErrors({ email: "Sai email hoặc mật khẩu." });
      } finally {
        setIsLoaded(false);
        setSubmitting(false);
      }
    },
  });

  const isOpen = popupType === "LOGIN";
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center px-4"
      onClick={closePopup}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 relative overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
          <button
            type="button"
            className="absolute top-4 right-4 text-black text-2xl font-bold"
            aria-hidden="true"
            onClick={closePopup}
          >
            ×
          </button>

          <p className="text-4xl font-bold text-green-600 flex items-center gap-2">
            Chào mừng quay lại!
            <img
              src="/images/BillAI.png"
              alt="Login Icon"
              width="50"
              height="50"
            />
          </p>

          {/* Email */}
          <label htmlFor="email" className={labelStyle}>
            <span>Email</span>
            <input
              placeholder="Vui lòng nhập email"
              type="email"
              name="email"
              className={inputBase}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <div className={errorStyle}>{formik.errors.email}</div>
            )}
          </label>

          {/* Password */}
          <label htmlFor="password" className={labelStyle}>
            <span>Mật khẩu</span>
            <div className="password-line">
              <input
                placeholder="Vui lòng nhập mật khẩu"
                type={showPassword ? "text" : "password"}
                name="password"
                className={inputBase}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              <span
                className="toggle-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img
                  src={
                    showPassword
                      ? "/images/Bill_opened.png"
                      : "/images/Bill_closed.png"
                  }
                  alt="Toggle Password Visibility"
                  width="40"
                  height="40"
                />
              </span>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className={errorStyle}>{formik.errors.password}</div>
            )}
          </label>

          {isLoaded ? (
            <Loader />
          ) : (
            <>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 active:scale-95 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-200 ease-in-out"
              >
                Đăng nhập
              </button>

              <p className="text-center text-sm text-gray-600 mt-3">
                Quên mật khẩu?
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    showPopup("FORGOT_PASSWORD");
                  }}
                  className="ml-1 text-blue-600 font-semibold hover:underline hover:text-blue-700 transition"
                >
                  Lấy lại mật khẩu
                </Link>
              </p>

              <p className="signin text-center text-sm text-gray-600 mt-2">
                Chưa có tài khoản?
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    showPopup("REGISTER");
                  }}
                  className="ml-1 text-blue-600 font-semibold hover:underline hover:text-blue-700 transition"
                >
                  Đăng ký ngay
                </Link>
              </p>

              <p className="text-center text-sm text-gray-600 mt-3">
                Hoặc đăng nhập bằng
              </p>
              <div className="flex justify-center gap-3 mt-2">
                {/* Google */}
                <button
                  onClick={() =>
                    (window.location.href = `${process.env.NEXT_PUBLIC_NEST_API_URL}/google`)
                  }
                  className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-xl shadow hover:bg-gray-50 transition"
                >
                  <img
                    src="/images/google.png"
                    alt="Google"
                    className="w-7 h-7"
                  />
                  <span>Google</span>
                </button>

                {/* Discord */}
                {/* <button
                  type="button"
                  onClick={() => {
                    window.location.href = `${process.env.NEXT_PUBLIC_NEST_API_URL}/discord`;
                  }}
                  className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-xl shadow hover:bg-gray-50 transition"
                >
                  <img src="/images/discord.svg" alt="Discord" width={22} />
                  Discord
                </button> */}
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
