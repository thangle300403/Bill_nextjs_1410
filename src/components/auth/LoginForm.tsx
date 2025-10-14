/* eslint-disable @next/next/no-img-element */
"use client";

import { usePopupStore } from "@/store/popupStore";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Link from "next/link";
import { authEvents, axiosAuth } from "@/lib/axiosAuth";
import { axiosExpress } from "@/lib/axiosExpress";

export default function LoginForm() {
  useEffect(() => {
    // Lấy CSRF token ngay khi mở popup login
  }, []);
  const errorStyle = "text-sm text-red-500 mt-1";

  const [showPassword, setShowPassword] = useState(false);

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
        .required("Vui lòng nhập mật khẩu.")
        .matches(/[0-9]/, "Mật khẩu phải chứa ít nhất một số.")
        .matches(/[a-z]/, "Mật khẩu phải chứa ít nhất một chữ thường.")
        .matches(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ hoa.")
        .matches(/[@$!%*?&]/, "Mật khẩu phải chứa ít nhất một ký tự đặc biệt."),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await axiosAuth.post(`/login`, values);

        console.log("🧪 COOKIE SAU LOGIN:", document.cookie);

        // ✅ Gọi merge chatbot session
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
        setSubmitting(false);
      }
    },
  });

  const isOpen = popupType === "LOGIN";
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center px-4 overflow-y-auto"
      onClick={closePopup}
    >
      <div
        className="modal-dialog w-full px-4 sm:px-6 md:px-8 max-w-[480px]"
        onClick={(e) => e.stopPropagation()}
      >
        <StyledWrapper>
          <form className="form" onSubmit={formik.handleSubmit}>
            <button type="button" className="close" onClick={closePopup}>
              ×
            </button>
            <p className="title">Chào mừng quay lại!</p>
            <div className="flex-column">
              <label>Email </label>
            </div>
            <div className="inputLoginForm">
              <svg
                height={20}
                viewBox="0 0 32 32"
                width={20}
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="Layer_3" data-name="Layer 3">
                  <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" />
                </g>
              </svg>
              <input
                type="text"
                className="inputLogin"
                name="email"
                placeholder="Vui lòng nhập email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <div className={errorStyle}>{formik.errors.email}</div>
            )}
            <div className="flex-column">
              <label>Mật khẩu</label>
            </div>
            <div className="password-line">
              <div className="inputLoginForm">
                <svg
                  height={20}
                  viewBox="-64 0 512 512"
                  width={20}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
                  <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  className="inputLogin"
                  name="password"
                  placeholder="Vui lòng nhập mật khẩu"
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
                    width="50"
                    height="50"
                  />
                </span>
              </div>
            </div>

            {formik.touched.password && formik.errors.password ? (
              <div className={errorStyle}>{formik.errors.password}</div>
            ) : null}

            <Link
              href="#"
              className="text-blue-600 hover:underline"
              onClick={() => showPopup("FORGOT_PASSWORD")}
            >
              Quên mật khẩu?
            </Link>

            <button type="submit" className="button-submit">
              Đăng nhập
            </button>

            <p className="p">
              Chưa có tài khoản?
              <br />
              <Link
                href="#"
                className="text-blue-600 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  showPopup("REGISTER");
                }}
              >
                Đăng ký ngay
              </Link>
            </p>

            <p className="p line">Hoặc đăng nhập bằng</p>

            <div className="flex-row">
              {/* google */}
              <a
                className="btn google"
                onClick={() => {
                  window.location.href = `${process.env.NEXT_PUBLIC_NEST_API_URL}/google`;
                }}
              >
                <svg
                  version="1.1"
                  width={20}
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  x="0px"
                  y="0px"
                  viewBox="0 0 512 512"
                  xmlSpace="preserve"
                >
                  <path
                    style={{ fill: "#FBBB00" }}
                    d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256
      	c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456
      	C103.821,274.792,107.225,292.797,113.47,309.408z"
                  />
                  <path
                    style={{ fill: "#518EF8" }}
                    d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451
      	c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535
      	c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z"
                  />
                  <path
                    style={{ fill: "#28B446" }}
                    d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512
      	c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771
      	c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z"
                  />
                  <path
                    style={{ fill: "#F14336" }}
                    d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012
      	c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0
      	C318.115,0,375.068,22.126,419.404,58.936z"
                  />
                </svg>
                Google
              </a>

              {/* discord */}
              <a
                className="btn discord"
                onClick={() => {
                  window.location.href = `${process.env.NEXT_PUBLIC_NEST_API_URL}/discord`;
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  role="img"
                  className="w-8 h-8"
                >
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"></path>
                </svg>
                Discord
              </a>
            </div>
          </form>
        </StyledWrapper>
      </div>
    </div>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh; // Ensures the container takes up at least the full height of the viewport
  padding-top: 20px; // Adds some padding at the top

  .eye,
  .limbs {
    transition: opacity 0.4s ease, transform 0.3s ease;
    transform-origin: center center;
    pointer-events: none;
  }

  .visible {
    opacity: 1;
    transform: scale(1);
  }

  .hidden {
    opacity: 0;
    transform: scale(0.6);
  }

  .bill-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
  }

  .password-line {
    display: flex;
    align-items: center;
    gap: 10px; /* spacing between input and Bill */
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #ffffff;
    padding: 30px;
    width: 400px;
    border-radius: 20px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

    /* Optional: adds shadow for better visibility */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  }

  .title {
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -1px;
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 30px;
    color: rgb(255, 0, 0);
  }

  .title::before {
    width: 18px;
    height: 18px;
  }

  .title::after {
    width: 18px;
    height: 18px;
    animation: pulse 1s linear infinite;
  }

  .title::before,
  .title::after {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    border-radius: 50%;
    left: 0px;
    background-color: rgb(255, 0, 0);
  }
  ::placeholder {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  .form button {
    align-self: flex-end;
  }

  .flex-column > label {
    color: #151717;
    font-weight: 600;
  }

  .inputLoginForm {
    width: 100%;
    border: 1.5px solid #ecedec;
    border-radius: 10px;
    height: 50px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    transition: 0.2s ease-in-out;
  }

  .inputLogin {
    margin-left: 10px;
    border-radius: 10px;
    border: none;
    width: 85%;
    height: 100%;
  }

  .inputLogin:focus {
    outline: none;
  }

  .inputLoginForm:focus-within {
    border: 1.5px solid #2d79f3;
  }

  .flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
  }

  .flex-row > div > label {
    font-size: 14px;
    color: black;
    font-weight: 400;
  }

  .span {
    font-size: 14px;
    margin-left: 5px;
    color: #2d79f3;
    font-weight: 500;
    cursor: pointer;
  }

  .button-submit {
    margin: 20px 0 10px 0;
    background-color: rgb(34, 183, 17);
    border: none;
    color: white;
    font-size: 15px;
    font-weight: 500;
    border-radius: 10px;
    height: 50px;
    width: 100%;
    cursor: pointer;
  }

  .button-submit:hover {
    background-color: rgb(18, 119, 18);
  }

  .p {
    text-align: center;
    color: black;
    font-size: 14px;
    margin: 5px 0;
  }

  .btn {
    margin-top: 10px;
    width: 100%;
    height: 50px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    gap: 10px;
    border: 1px solid #ededef;
    background-color: white;
    cursor: pointer;
    transition: 0.2s ease-in-out;
  }

  .btn:hover {
    border: 1px solid #2d79f3;
  }
`;
