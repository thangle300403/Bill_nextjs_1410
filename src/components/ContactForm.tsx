"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { toast } from "react-toastify";
import Loader from "./Loader";
import { axiosAuth } from "@/lib/axiosAuth";

export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullname: "",
      email: "",
      mobile: "",
      content: "",
    },
    validationSchema: Yup.object({
      fullname: Yup.string()
        .required("Vui lòng nhập họ tên.")
        .matches(
          /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÂÊÔưăâêôYýỳỷỹỵÝỲỶỸỴ\s]+$/,
          "Vui lòng nhập họ tên đúng ngữ pháp."
        )
        .max(250, "Vui lòng nhập họ tên nhỏ hơn 250 ký tự."),
      email: Yup.string()
        .required("Vui lòng nhập email.")
        .email("Vui lòng nhập địa chỉ email hợp lệ.")
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Địa chỉ email không hợp lệ."
        ),
      content: Yup.string()
        .required("Vui lòng nhập mô tả.")
        .matches(
          /^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÂÊÔưăâêôYýỳỷỹỵÝỲỶỸỴ\s,.!?-]+$/,
          "Mô tả chỉ có thể bao gồm chữ cái, số và dấu câu cơ bản."
        ),
      mobile: Yup.string()
        .required("Vui lòng nhập số điện thoại.")
        .matches(/^[0-9]{10,11}$/, "Số điện thoại phải từ 10-11 chữ số."),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        await axiosAuth.post("/sendEmail", values);
        toast.success("Đã gửi mail thành công.");
        resetForm();
      } catch (error) {
        console.error("Error sending email:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <form className="space-y-6" onSubmit={formik.handleSubmit}>
      {/* Full Name */}
      <div>
        <input
          type="text"
          name="fullname"
          placeholder="Họ và tên"
          onChange={formik.handleChange}
          value={formik.values.fullname}
          onBlur={formik.handleBlur}
          className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
        {formik.touched.fullname && formik.errors.fullname && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.fullname}</p>
        )}
      </div>

      {/* Email + Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={formik.handleChange}
            value={formik.values.email}
            onBlur={formik.handleBlur}
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-600 text-sm mt-1">{formik.errors.email}</p>
          )}
        </div>
        <div>
          <input
            type="tel"
            name="mobile"
            placeholder="Số điện thoại"
            onChange={formik.handleChange}
            value={formik.values.mobile}
            onBlur={formik.handleBlur}
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          {formik.touched.mobile && formik.errors.mobile && (
            <p className="text-red-600 text-sm mt-1">{formik.errors.mobile}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div>
        <textarea
          name="content"
          placeholder="Nội dung"
          rows={6}
          onChange={formik.handleChange}
          value={formik.values.content}
          onBlur={formik.handleBlur}
          className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
        {formik.touched.content && formik.errors.content && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.content}</p>
        )}
      </div>

      {/* Loader */}
      {isLoading && <Loader />}

      {/* Submit Button */}
      <div className="text-right">
        <button
          type="submit"
          className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow-sm text-sm font-semibold transition"
        >
          Gửi
        </button>
      </div>
    </form>
  );
}
