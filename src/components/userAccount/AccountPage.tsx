/* eslint-disable @next/next/no-img-element */
"use client";
import { Button } from "@/components/ui/button";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import Loader from "../Loader";
import { axiosAuth } from "@/lib/axiosAuth";
import { useUser } from "@/hooks/useUser";

export default function AccountPage() {
  const { user, loading } = useUser();

  // const labelStyle = "text-sm font-semibold text-gray-700 mb-1 block";
  const errorStyle = "text-sm text-red-500 mt-1";

  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const formik = useFormik({
    initialValues: {
      fullname: user?.name ?? "",
      mobile: user?.mobile ?? "",
      password: "",
      current_password: "",
      password_confirmation: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      fullname: Yup.string()
        .required("Vui lòng nhập họ tên.")
        .matches(/^[\p{L}\s'.-]+$/u, "Vui lòng nhập họ tên đúng ngữ pháp.")
        .max(250, "Vui lòng nhập họ tên nhỏ hơn 250 ký tự."),

      mobile: Yup.string()
        .required("Vui lòng nhập số điện thoại.")
        .matches(
          /^(0|\+84)[3|5|7|8|9][0-9]{8}$/,
          "Số điện thoại không hợp lệ."
        ),

      password: Yup.string()
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự.")
        .matches(/[0-9]/, "Mật khẩu phải chứa ít nhất một số.")
        .matches(/[a-z]/, "Mật khẩu phải chứa ít nhất một chữ thường.")
        .matches(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ hoa.")
        .matches(/[@$!%*?&]/, "Mật khẩu phải chứa ít nhất một ký tự đặc biệt.")
        .notRequired(),

      current_password: Yup.string().when("password", {
        is: (val: string) => !!val && val.length > 0,
        then: (schema) =>
          schema
            .required("Vui lòng nhập mật khẩu hiện tại.")
            .notOneOf(
              [Yup.ref("password")],
              "Mật khẩu mới không được trùng với mật khẩu hiện tại."
            ),

        otherwise: (schema) => schema.notRequired(),
      }),

      password_confirmation: Yup.string()
        .oneOf([Yup.ref("password"), undefined], "Mật khẩu không khớp.")
        .notRequired(),
    }),
    onSubmit: async (values, { setFieldError }) => {
      try {
        await axiosAuth.patch(`/customers/${user?.id}/account`, values);
        toast.success("Cập nhật tài khoản thành công.");
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const serverMsg = axiosError.response?.data?.message;

        if (serverMsg === "Mật khẩu hiện tại không đúng.") {
          setFieldError("current_password", serverMsg);
        } else {
          toast.error(serverMsg || "Đã xảy ra lỗi. Vui lòng thử lại.");
        }
      }
    },
  });
  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <main id="maincontent" className="py-6 px-4">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Main account section */}
            <div className="space-y-6">
              {/* Section Title */}
              <div>
                <h4 className="text-xl font-bold text-gray-800">
                  Thông tin tài khoản
                </h4>
              </div>

              <div className="flex flex-col items-center justify-center gap-6 w-full">
                <input
                  className="w-full max-w-2xl bg-white-100 text-zinc-700 font-mono text-xl font-semibold ring-1 ring-zinc-400 focus:ring-2 focus:ring-green-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-10 py-3 shadow-lg focus:shadow-xl focus:shadow-green-400"
                  autoComplete="off"
                  placeholder="Họ và tên ..."
                  name="fullname"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.fullname}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.fullname && formik.errors.fullname && (
                  <div className={errorStyle}>{formik.errors.fullname}</div>
                )}
                <input
                  className="w-full max-w-2xl bg-white-100 text-zinc-700 font-mono text-xl font-bold ring-1 ring-zinc-400 focus:ring-2 focus:ring-green-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-10 py-3 shadow-lg focus:shadow-xl focus:shadow-green-400"
                  autoComplete="off"
                  placeholder="Số điện thoại ..."
                  name="mobile"
                  type="tel"
                  onChange={formik.handleChange}
                  value={formik.values.mobile}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.mobile && formik.errors.mobile && (
                  <div className={errorStyle}>{formik.errors.mobile}</div>
                )}
                <div className="flex items-center gap-2 w-full max-w-2xl">
                  <input
                    className="flex-1 bg-white-100 text-zinc-700 font-mono text-xl font-semibold ring-1 ring-zinc-400 focus:ring-2 focus:ring-green-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-10 py-3 shadow-lg focus:shadow-xl focus:shadow-green-400"
                    autoComplete="off"
                    placeholder="Mật khẩu ..."
                    name="current_password"
                    type={showCurrentPassword ? "text" : "password"}
                    onChange={formik.handleChange}
                    value={formik.values.current_password}
                    onBlur={formik.handleBlur}
                  />
                  <span
                    className="shrink-0 cursor-pointer"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    <img
                      src={
                        showCurrentPassword
                          ? "/images/Bill_opened.png"
                          : "/images/Bill_closed.png"
                      }
                      alt="Toggle Password Visibility"
                      width="40"
                      height="40"
                    />
                  </span>
                </div>

                {formik.touched.current_password &&
                  formik.errors.current_password && (
                    <div className={errorStyle}>
                      {formik.errors.current_password}
                    </div>
                  )}

                <div className="flex items-center gap-2 w-full max-w-2xl">
                  <input
                    className="w-full max-w-2xl bg-white-100 text-zinc-700 font-mono text-xl font-semibold ring-1 ring-zinc-400 focus:ring-2 focus:ring-green-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-10 py-3 shadow-lg focus:shadow-xl focus:shadow-green-400"
                    autoComplete="off"
                    placeholder="Mật khẩu mới ..."
                    name="password"
                    type={showPassword ? "text" : "password"}
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    onBlur={formik.handleBlur}
                  />
                  <span
                    className="shrink-0 cursor-pointer"
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

                <div className="flex items-center gap-2 w-full max-w-2xl">
                  <input
                    className="flex-1 bg-white-100 text-zinc-700 font-mono text-xl font-semibold ring-1 ring-zinc-400 focus:ring-2 focus:ring-green-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-10 py-3 shadow-lg focus:shadow-xl focus:shadow-green-400"
                    autoComplete="off"
                    placeholder="Nhập lại mật khẩu mới ..."
                    name="password_confirmation"
                    type={showPasswordConfirmation ? "text" : "password"}
                    onChange={formik.handleChange}
                    value={formik.values.password_confirmation}
                    onBlur={formik.handleBlur}
                  />
                  <span
                    className="shrink-0 cursor-pointer"
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

                {/* Submit Button */}
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-12 py-8 text-base font-semibold rounded-xl shadow-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300"
                  >
                    Cập nhật
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </form>
    </>
  );
}
