"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import StarRatings from "react-star-ratings";
import { toast } from "react-toastify";
import React, { useState } from "react";
import { axiosNonAuthInstanceNest } from "@/lib/utils";
import Loader from "../Loader";

interface CommentFormProps {
  productId: number;
  refreshComments: () => void;
}

export default function CommentForm({
  productId,
  refreshComments,
}: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullname: "",
      email: "",
      description: "",
      rating: 0,
    },
    validationSchema: Yup.object({
      fullname: Yup.string()
        .required("Vui lòng nhập họ tên.")
        .matches(
          /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÂÊÔưăâêôYýỳỷỹỵÝỲỶỸỴ\s]+$/,
          "Tên không hợp lệ."
        )
        .max(250, "Tên quá dài."),
      email: Yup.string()
        .required("Vui lòng nhập email.")
        .email("Email không hợp lệ."),
      description: Yup.string()
        .required("Vui lòng nhập nội dung.")
        .min(10, "Nội dung ít nhất 10 ký tự."),
      rating: Yup.number()
        .required("Vui lòng chọn sao.")
        .min(1, "Tối thiểu 1 sao.")
        .max(5, "Tối đa 5 sao."),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setIsSubmitting(true);
        await axiosNonAuthInstanceNest.post(
          `/products/${productId}/comments`,
          values
        );
        toast.success("Gửi bình luận thành công!");
        refreshComments();

        // ✅ Reset only specific fields but preserve rating
        resetForm({
          values: {
            fullname: "",
            email: "",
            description: "",
            rating: values.rating, // 👈 preserved
          },
        });
      } catch (error) {
        console.error(error);
        toast.error("Gửi bình luận thất bại!");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 max-w-xl mt-6">
      <h3 className="text-lg font-semibold mb-2">Đánh giá của bạn</h3>

      <div>
        <StarRatings
          rating={formik.values.rating}
          starRatedColor="#facc15"
          starHoverColor="#facc15"
          starDimension="32px"
          starSpacing="6px"
          changeRating={(newRating) => {
            formik.setFieldValue("rating", newRating);
          }}
          numberOfStars={5}
          name="rating"
        />
        {formik.touched.rating && formik.errors.rating && (
          <div className="text-sm text-red-500 mt-1">
            {formik.errors.rating}
          </div>
        )}
      </div>

      <div>
        <input
          name="fullname"
          placeholder="Họ tên *"
          className="form-control"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.fullname}
        />
        {formik.touched.fullname && formik.errors.fullname && (
          <div className="text-sm text-red-500 mt-1">
            {formik.errors.fullname}
          </div>
        )}
      </div>

      <div>
        <input
          type="email"
          name="email"
          placeholder="Email *"
          className="form-control"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email && (
          <div className="text-sm text-red-500 mt-1">{formik.errors.email}</div>
        )}
      </div>

      <div>
        <textarea
          name="description"
          placeholder="Nội dung *"
          rows={4}
          className="form-control"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description}
        />
        {formik.touched.description && formik.errors.description && (
          <div className="text-sm text-red-500 mt-1">
            {formik.errors.description}
          </div>
        )}
      </div>

      <div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader></Loader> : "Gửi bình luận"}
        </button>
      </div>
    </form>
  );
}
