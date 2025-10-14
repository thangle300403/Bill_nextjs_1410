"use client";

import { useFormik } from "formik";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import * as Yup from "yup";
import axios from "axios";
import { axiosAuth } from "@/lib/axiosAuth";

export default function ResetPassword({ token }: { token: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [eyeClosed, setEyeClosed] = useState(false);
  const [eyeText, setEyeText] = useState("REMEMBER!");

  const router = useRouter();

  const messages = ["REMEMBER!", "ILLUSION", "BYEEE!", "ΔΞΦΣΨ"];

  const formik = useFormik({
    initialValues: {
      password: "",
      password_confirmation: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required("Vui lòng nhập mật khẩu mới.")
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự.")
        .matches(/[0-9]/, "Mật khẩu phải chứa ít nhất một số.")
        .matches(/[a-z]/, "Mật khẩu phải chứa ít nhất một chữ thường.")
        .matches(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ hoa.")
        .matches(/[@$!%*?&]/, "Mật khẩu phải chứa ít nhất một ký tự đặc biệt."),
      password_confirmation: Yup.string()
        .oneOf([Yup.ref("password")], "Mật khẩu không khớp.")
        .required("Vui lòng nhập lại mật khẩu mới."),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axiosAuth.patch(
          `/reset_password?token=${token}`,
          values
        );
        toast.success(`🚀 ${response.data.message}`);
        router.push("/?showLogin=true");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || error.message);
        } else {
          toast.error("Đã xảy ra lỗi không xác định.");
        }
      }
    },
  });

  const toggleEye = () => {
    setEyeClosed(!eyeClosed);
    if (!eyeClosed) {
      const random = messages[Math.floor(Math.random() * messages.length)];
      setEyeText(random);
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* 🔺 Bill Cipher Character */}
      <div className="bill-container">
        <div className="bill-wrapper">
          <div className="vignette" />
          <div
            className={`triangle ${eyeClosed ? "blue-body" : ""}`}
            id="triangle"
          />
          <div className="hat" />

          <div className={`eye ${eyeClosed ? "closed" : ""}`}>
            {!eyeClosed && <div className="pupil" />}
            <div className="eye-text">{eyeText}</div>
          </div>

          <div className="lashes">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className="bowtie">
            <div className="left" />
            <div className="right" />
          </div>
        </div>
      </div>

      {/* 🔒 Reset Password Form */}
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-md mt-2 flex flex-col gap-4 items-center"
      >
        <h2 className="text-xl font-bold text-center">Đặt lại mật khẩu</h2>

        {/* Mật khẩu mới */}
        <div className="w-full">
          <label htmlFor="password" className="block mb-1 text-sm font-medium">
            Nhập mật khẩu mới
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Mật khẩu mới"
              onChange={formik.handleChange}
              value={formik.values.password}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <span
              className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-xl"
              onClick={() => {
                setShowPassword((prev) => !prev);
                toggleEye();
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.password}
            </p>
          )}
        </div>

        {/* Nhập lại mật khẩu */}
        <div className="w-full">
          <label
            htmlFor="password_confirmation"
            className="block mb-1 text-sm font-medium"
          >
            Nhập lại mật khẩu mới
          </label>
          <div className="relative">
            <input
              type={showPasswordConfirm ? "text" : "password"}
              name="password_confirmation"
              id="password_confirmation"
              placeholder="Nhập lại mật khẩu"
              onChange={formik.handleChange}
              value={formik.values.password_confirmation}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <span
              className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-xl"
              onClick={() => {
                setShowPasswordConfirm((prev) => !prev);
                toggleEye();
              }}
            >
              {showPasswordConfirm ? "🙈" : "👁️"}
            </span>
          </div>
          {formik.touched.password_confirmation &&
            formik.errors.password_confirmation && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.password_confirmation}
              </p>
            )}
        </div>

        {/* Submit Button */}
        <div className="w-full text-right">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold"
          >
            Cập nhật
          </button>
        </div>
      </form>

      <style jsx>{`
        .bill-container {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: 100px;
          margin-bottom: 5px;
          position: relative;
          z-index: 1;
        }

        .bill-wrapper {
          position: relative;
          width: 200px;
          height: 250px;
          box-shadow: 0 25px 35px rgba(0, 0, 0, 0.3); /* soft drop shadow */
          border-radius: 10px; /* optional rounding if needed */
          transition: box-shadow 0.3s ease;
        }

        .bill-wrapper:hover {
          box-shadow: 0 35px 55px rgba(0, 0, 0, 0.4);
        }

        .blue-body {
          background: repeating-linear-gradient(
              to bottom,
              #99ccff,
              #99ccff 33px,
              #3399ff 33px,
              #3399ff 34px
            ),
            repeating-linear-gradient(
              to right,
              #99ccff,
              #99ccff 40px,
              #3399ff 40px,
              #3399ff 41px
            );
          transition: background 0.4s ease;
        }

        .vignette {
          position: absolute;
          top: -40px;
          left: -30px;
          width: 260px;
          height: 100px;
          background: radial-gradient(
            circle,
            rgba(255, 255, 0, 0.3) 0%,
            transparent 70%
          );
          z-index: -1;
          border-radius: 50%;
          filter: blur(8px);
        }

        .triangle {
          position: absolute;
          top: 0;
          left: 0;
          width: 200px;
          height: 200px;
          clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
          z-index: 1;
          transition: background 0.6s ease-in-out; /* Add this line */
        }

        /* Yellow default */
        .triangle:not(.blue-body) {
          background: repeating-linear-gradient(
              to bottom,
              #ffff66,
              #ffff66 33px,
              #e6e600 33px,
              #e6e600 34px
            ),
            repeating-linear-gradient(
              to right,
              #ffff66,
              #ffff66 40px,
              #e6e600 40px,
              #e6e600 41px
            );
        }

        /* Blue variant */
        .triangle.blue-body {
          background: repeating-linear-gradient(
              to bottom,
              #99ccff,
              #99ccff 33px,
              #3399ff 33px,
              #3399ff 34px
            ),
            repeating-linear-gradient(
              to right,
              #99ccff,
              #99ccff 40px,
              #3399ff 40px,
              #3399ff 41px
            );
        }

        .hat {
          position: absolute;
          top: -40px;
          left: 55px;
          width: 90px;
          height: 30px;
          background: black;
          z-index: 2;
        }

        .hat::after {
          content: "";
          position: absolute;
          top: -40px;
          left: 35px;
          width: 20px;
          height: 40px;
          background: black;
        }

        .eye {
          position: absolute;
          top: 100px;
          left: 60px;
          width: 80px;
          height: 45px;
          border-radius: 50% / 50%;
          border: 4px solid black;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
        }

        .pupil {
          width: 10px;
          height: 35px;
          background: black;
          border-radius: 50% / 30%;
        }

        .eye-text {
          position: absolute;
          font-size: 10px;
          font-weight: bold;
          font-family: "Courier New", monospace;
          color: white;
          opacity: 0;
          transform: scale(1);
          pointer-events: none;
          transition: opacity 0.3s ease;
          text-shadow: 1px 1px 1px black;
        }

        .eye.closed {
          background: black;
        }

        .eye.closed .eye-text {
          opacity: 1;
          transform: scale(1.2);
        }

        .lashes {
          position: absolute;
          top: 80px;
          left: 35px;
          width: 130px;
          display: flex;
          justify-content: space-evenly;
          z-index: 4;
        }

        .lashes span {
          width: 2px;
          height: 10px;
          background: black;
          transform-origin: bottom center;
        }

        .lashes span:nth-child(1) {
          transform: rotate(-20deg);
        }
        .lashes span:nth-child(2) {
          transform: rotate(-5deg);
        }
        .lashes span:nth-child(3) {
          transform: rotate(5deg);
        }
        .lashes span:nth-child(4) {
          transform: rotate(20deg);
        }

        .bowtie {
          position: absolute;
          top: 170px;
          left: 80px;
          width: 40px;
          height: 20px;
          z-index: 3;
        }

        .bowtie .left,
        .bowtie .right {
          position: absolute;
          top: 0;
          width: 0;
          height: 0;
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
        }

        .bowtie .left {
          left: 0;
          border-left: 20px solid black;
        }

        .bowtie .right {
          right: 0;
          border-right: 20px solid black;
        }

        .toggle-btn {
          margin-top: 20px;
          padding: 8px 16px;
          background: yellow;
          color: black;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          transition: background 0.3s ease;
        }

        .toggle-btn:hover {
          background: gold;
        }
      `}</style>
    </div>
  );
}
