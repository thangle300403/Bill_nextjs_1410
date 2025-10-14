/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";
import Loader from "../Loader";
import { usePopupStore } from "@/store/popupStore";
import Link from "next/link";
import { axiosAuth } from "@/lib/axiosAuth";

export default function RegisterForm() {
  const inputBase =
    "w-full border border-gray-300 rounded-xl px-5 py-3 text-sm text-gray-800 bg-white shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition";
  const labelStyle = "text-sm font-semibold text-gray-700 mb-1 block";
  const errorStyle = "text-sm text-red-500 mt-1";

  const showPopup = usePopupStore((state) => state.showPopup);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const popupType = usePopupStore((state) => state.popupType);
  const closePopup = usePopupStore((state) => state.closePopup);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const checkNotExistingEmail = async (email: string) => {
    try {
      const response = await axiosAuth.get(`/notExistingEmail/${email}`);
      return response.data;
    } catch (error) {
      console.error("Error checking email existence:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      password_confirmation: "",
      fullname: "",
      mobile: "",
      recaptcha: "",
    },
    validationSchema: Yup.object({
      fullname: Yup.string()
        .required("Vui lòng nhập họ tên.")
        .matches(/^[A-Za-zÀ-ỹ\s]+$/, "Vui lòng nhập họ tên đúng ngữ pháp.")
        .max(250, "Vui lòng nhập họ tên nhỏ hơn 250 ký tự."),
      email: Yup.string()
        .required("Vui lòng nhập email.")
        .email("Vui lòng nhập địa chỉ email hợp lệ.")
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Địa chỉ email không hợp lệ."
        )
        .test(
          "",
          "Email đã tồn tại, vui lòng nhập email khác",
          async (value) => {
            const checkNotExistEmail = await checkNotExistingEmail(value);
            return checkNotExistEmail;
          }
        ),
      password: Yup.string()
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự.")
        .matches(/[0-9]/, "Mật khẩu phải chứa ít nhất một số.")
        .matches(/[a-z]/, "Mật khẩu phải chứa ít nhất một chữ thường.")
        .matches(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ hoa.")
        .matches(/[@$!%*?&]/, "Mật khẩu phải chứa ít nhất một ký tự đặc biệt.")
        .required("Vui lòng nhập mật khẩu."),
      password_confirmation: Yup.string()
        .oneOf([Yup.ref("password")], "Mật khẩu không khớp.")
        .required("Vui lòng nhập lại mật khẩu."),
      mobile: Yup.string()
        .required("Vui lòng nhập số điện thoại.")
        .matches(
          /^(0|\+84)[3|5|7|8|9][0-9]{8}$/,
          "Số điện thoại không hợp lệ."
        ),
      recaptcha: Yup.string().required(
        "Vui lòng xác nhận không phải là robot."
      ),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoaded(true);
        const response = await axiosAuth.post(`/registers`, values);
        toast.success(`🚀 ${response.data.message}`);
      } catch (error) {
        console.error("Đăng ký không thành công", error);
        toast.error("Đăng ký không thành công xem console để cứu.");
      } finally {
        setIsLoaded(false);
      }
    },
  });
  const isOpen = popupType === "REGISTER";
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
        {" "}
        <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
          <button
            type="button"
            className="absolute top-4 right-4 text-black text-2xl font-bold"
            aria-hidden="true"
            onClick={closePopup}
          >
            ×
          </button>

          <p className="text-4xl font-bold text-red-600 flex items-center gap-2">
            Đăng ký
            <img
              src="/images/Bill_reg.png"
              alt="Toggle Password Visibility"
              width="50"
              height="50"
            />
          </p>
          <label htmlFor="fullname" className={labelStyle}>
            <span>Họ tên</span>
            <input
              placeholder="Vui lòng nhập họ tên"
              type="text"
              name="fullname"
              className={inputBase}
              onChange={formik.handleChange}
              value={formik.values.fullname}
              onBlur={formik.handleBlur}
            />
            {formik.touched.fullname && formik.errors.fullname && (
              <div className={errorStyle}>{formik.errors.fullname}</div>
            )}
          </label>
          <label htmlFor="fullname" className={labelStyle}>
            <span>Số điện thoại</span>
            <input
              placeholder="Vui lòng nhập số điện thoại"
              type="tel"
              name="mobile"
              className={inputBase}
              onChange={formik.handleChange}
              value={formik.values.mobile}
              onBlur={formik.handleBlur}
            />
            {formik.touched.mobile && formik.errors.mobile && (
              <div className={errorStyle}>{formik.errors.mobile}</div>
            )}
          </label>
          <label htmlFor="fullname" className={labelStyle}>
            <span>Email</span>
            <input
              placeholder="Vui lòng nhập email"
              type="email"
              name="email"
              className={inputBase}
              onChange={formik.handleChange}
              value={formik.values.email}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <div className={errorStyle}>{formik.errors.email}</div>
            )}
          </label>
          <label htmlFor="fullname" className={labelStyle}>
            <span>Mật khẩu</span>
            <div className="password-line">
              <input
                placeholder="Vui lòng nhập mật khẩu"
                type={showPassword ? "text" : "password"}
                name="password"
                className={inputBase}
                onChange={formik.handleChange}
                value={formik.values.password}
                onBlur={formik.handleBlur}
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
          <label htmlFor="fullname" className={labelStyle}>
            <span>Xác nhận mật khẩu</span>
            <div className="password-line">
              <input
                placeholder="Vui lòng nhập lại mật khẩu"
                type={showPasswordConfirmation ? "text" : "password"}
                name="password_confirmation"
                className={inputBase}
                onChange={formik.handleChange}
                value={formik.values.password_confirmation}
                onBlur={formik.handleBlur}
              />
              <span
                className="toggle-eye"
                onClick={() =>
                  setShowPasswordConfirmation(!showPasswordConfirmation)
                }
              >
                <img
                  src={
                    showPasswordConfirmation
                      ? "/images/Bill_opened.png"
                      : "/images/Bill_closed.png"
                  }
                  alt="Toggle Password Visibility"
                  width="40"
                  height="40"
                />
              </span>
            </div>
            {formik.touched.password_confirmation &&
              formik.errors.password_confirmation && (
                <div className={errorStyle}>
                  {formik.errors.password_confirmation}
                </div>
              )}
          </label>
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCH_SITE_KEY!}
            onChange={(val: string | null) =>
              formik.setFieldValue("recaptcha", val)
            }
          />
          {formik.touched.recaptcha && formik.errors.recaptcha && (
            <div className={errorStyle}>{formik.errors.recaptcha}</div>
          )}
          {isLoaded ? (
            <Loader />
          ) : (
            <>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 active:scale-95 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-200 ease-in-out"
              >
                Đăng ký
              </button>

              <p className="signin text-center text-sm text-gray-600 mt-3">
                Đã có tài khoản?
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    showPopup("LOGIN");
                  }}
                  className="ml-1 text-blue-600 font-semibold hover:underline hover:text-blue-700 transition"
                >
                  Đăng nhập
                </Link>
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
