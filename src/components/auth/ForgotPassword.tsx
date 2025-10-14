import { usePopupStore } from "@/store/popupStore";
import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../Loader";
import { axiosAuth } from "@/lib/axiosAuth";

export default function ForgotPassword() {
  const [isLoaded, setIsLoaded] = useState(false);

  const popupType = usePopupStore((state) => state.popupType);
  const closePopup = usePopupStore((state) => state.closePopup);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    // Validate the data
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Vui lòng nhập email.")
        .email("Vui lòng nhập địa chỉ email hợp lệ.")
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Địa chỉ email không hợp lệ."
        ),
    }),
    // If valid, run onSubmit
    onSubmit: async (values) => {
      setIsLoaded(true);

      try {
        const response = await axiosAuth.post(`/forgot_password`, values);
        toast.success(`🚀 ${response.data.message}`);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || error.message);
        } else {
          toast.error("Đã xảy ra lỗi không xác định.");
        }
      } finally {
        setIsLoaded(false);
        closePopup();
      }
      console.log("🟡 Submitting login with:", values);
    },
  });

  const isOpen = popupType === "FORGOT_PASSWORD";
  if (!isOpen) return null;

  return (
    <form method="POST" onSubmit={formik.handleSubmit}>
      <div
        className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center"
        onClick={closePopup}
      >
        <div
          className="bg-white w-full max-w-md mx-auto rounded-xl shadow-lg p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={closePopup}
            type="button"
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            &times;
          </button>

          {/* Title */}
          <h2 className="text-green-700 text-2xl font-bold mb-4">
            Quên mật khẩu
          </h2>

          {/* Form Content */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nhập email của bạn
              </label>
              <input
                type="email"
                id="email"
                placeholder="example@email.com"
                className="w-full border border-green-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                onChange={formik.handleChange}
                value={formik.values.email}
                onBlur={formik.handleBlur}
                name="email"
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>
            {isLoaded ? (
              <Loader />
            ) : (
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closePopup}
                  className="text-sm px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="text-sm px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                >
                  Gửi mã khôi phục
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
