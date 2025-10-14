"use client";

import styled from "styled-components";
import { useFormik } from "formik";
import * as Yup from "yup";
import DeliveryInfo from "./DeliveryInfo";
import { Province, Ward } from "@/types/address";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { UserServer } from "@/types/user";
import { useEffect, useState } from "react";
import Loader from "../Loader";
import { axiosAuth } from "@/lib/axiosAuth";
import { useUser } from "@/hooks/useUser";
import { axiosNonAuthInstanceNest } from "@/lib/utils";

interface Props {
  provinces: Province[];
  wards: Ward[];
  loggedUser?: UserServer;
}

export default function DefaultAddressPage({}: Props) {
  const { user } = useUser();
  const [provinces, setProvinces] = useState<Province[]>([]);

  const [loading, setLoading] = useState(true);

  // Fetch provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await axiosNonAuthInstanceNest.get("/provinces");
        setProvinces(res.data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast.error("Lỗi tải danh sách tỉnh");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProvinces();
    }
  }, [user]);

  const formik = useFormik({
    initialValues: {
      fullname: user?.shipping_name ?? "",
      mobile: user?.shipping_mobile ?? "",
      province: user?.ward?.province?.id ?? user?.province_id ?? "",
      ward: user?.ward?.id ?? user?.ward_id ?? "",
      address: user?.housenumber_street ?? "",
      payment_method: "0",
    },

    enableReinitialize: true,
    validationSchema: Yup.object({
      fullname: Yup.string()
        .required("Vui lòng nhập họ tên.")
        .matches(
          /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÂÊÔưăâêôYýỳỷỹỵÝỲỶỸỴ\s]+$/,
          "Tên không hợp lệ."
        )
        .max(250, "Tên quá dài."),
      mobile: Yup.string()
        .required("Vui lòng nhập số điện thoại")
        .matches(/^0\d{9,10}$/, "Số điện thoại không hợp lệ"),
      province: Yup.string().required("Vui lòng chọn tỉnh"),
      ward: Yup.string().required("Vui lòng chọn phường"),
      address: Yup.string().required("Vui lòng nhập địa chỉ"),
      payment_method: Yup.string().required("Chọn phương thức thanh toán."),
    }),

    onSubmit: async (values) => {
      try {
        await axiosAuth.patch(`/customers/${user?.id}/shipping`, {
          fullname: values.fullname,
          mobile: values.mobile,
          ward: values.ward,
          address: values.address,
        });
        toast.success("Cập nhật địa chỉ thành công!");
      } catch (error: unknown) {
        const axiosError = error as AxiosError<{ message: string }>;
        toast.error(
          axiosError?.response?.data?.message || "Lỗi cập nhật địa chỉ."
        );
      }
    },
  });
  useEffect(() => {
    if (!loading && user) {
      formik.setValues({
        fullname: user.shipping_name ?? "",
        mobile: user.shipping_mobile ?? "",
        province: user.ward?.province?.id ?? user.province_id ?? "",
        ward: user.ward?.id ?? user.ward_id ?? "",
        address: user.housenumber_street ?? "",
        payment_method: "0",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  if (loading) return <Loader></Loader>;
  return (
    <>
      <StyledWrapper>
        <form onSubmit={formik.handleSubmit}>
          <main id="maincontent" className="py-8">
            <div className="max-w-screen-xl mx-auto px-4">
              <nav
                className="text-sm text-gray-600 mb-6"
                aria-label="Breadcrumb"
              >
                <ol className="flex flex-wrap gap-2 items-center">
                  <li>
                    <span className="text-gray-800 font-semibold">
                      Địa chỉ giao hàng mặc định
                    </span>
                  </li>
                </ol>
              </nav>
              <div className="task">
                <DeliveryInfo formik={formik} provinces={provinces} />
                <button type="submit">
                  <svg
                    height="24"
                    width="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path
                      d="M5 13c0-5.088 2.903-9.436 7-11.182C16.097 3.564 19 7.912 19 13c0 .823-.076 1.626-.22 2.403l1.94 1.832a.5.5 0 0 1 .095.603l-2.495 4.575a.5.5 0 0 1-.793.114l-2.234-2.234a1 1 0 0 0-.707-.293H9.414a1 1 0 0 0-.707.293l-2.234 2.234a.5.5 0 0 1-.793-.114l-2.495-4.575a.5.5 0 0 1 .095-.603l1.94-1.832C5.077 14.626 5 13.823 5 13zm1.476 6.696l.817-.817A3 3 0 0 1 9.414 18h5.172a3 3 0 0 1 2.121.879l.817.817.982-1.8-1.1-1.04a2 2 0 0 1-.593-1.82c.124-.664.187-1.345.187-2.036 0-3.87-1.995-7.3-5-8.96C8.995 5.7 7 9.13 7 13c0 .691.063 1.372.187 2.037a2 2 0 0 1-.593 1.82l-1.1 1.039.982 1.8zM12 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <span>Cập nhật</span>
                </button>
              </div>
            </div>
          </main>
        </form>
      </StyledWrapper>
    </>
  );
}

const StyledWrapper = styled.div`
  .task {
    display: flex;
    flex-direction: column;
    height: 100%;
    color: #2e2e2f;
    cursor: move;
    background-color: #fff;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: rgba(26, 25, 25, 0.3) 0px 2px 8px 0px;
    border: 3px dashed transparent;
  }

  .task hr {
    margin: 2rem 0;
  }

  .task:hover {
    box-shadow: rgba(26, 25, 25, 0.3) 0px 2px 8px 0px;
    border-color: rgba(12, 239, 27, 0.98) !important;
  }

  .task p {
    font-size: 15px;
    margin: 1.2rem 0;
  }

  .tag {
    border-radius: 100px;
    padding: 4px 13px;
    font-size: 12px;
    color: #ffffff;
    background-color: #1389eb;
  }

  .tags {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .viewer span {
    height: 30px;
    width: 30px;
    background-color: rgb(28, 117, 219);
    margin-right: -10px;
    border-radius: 50%;
    border: 1px solid #fff;
    display: grid;
    align-items: center;
    text-align: center;
    font-weight: bold;
    color: #fff;
    padding: 2px;
  }

  .viewer span svg {
    stroke: #fff;
  }

  button {
    width: 20%;
    display: flex;
    align-items: center;
    font-family: inherit;
    cursor: pointer;
    font-weight: 500;
    font-size: 17px;
    padding: 0.8em 1.3em 0.8em 0.9em;
    color: white;
    background: rgb(95, 173, 83);
    background: linear-gradient(
      to right,
      rgb(12, 41, 15),
      rgb(43, 99, 45),
      rgb(37, 62, 36)
    );
    border: none;
    letter-spacing: 0.05em;
    border-radius: 16px;
  }

  button svg {
    margin-right: 3px;
    transform: rotate(30deg);
    transition: transform 0.5s cubic-bezier(0.76, 0, 0.24, 1);
  }

  button span {
    transition: transform 0.5s cubic-bezier(0.76, 0, 0.24, 1);
  }

  button:hover svg {
    transform: translateX(5px) rotate(90deg);
  }

  button:hover span {
    transform: translateX(7px);
  }
`;
