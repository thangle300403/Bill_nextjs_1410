/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import DeliveryInfo from "../userAccount/DeliveryInfo";
import { DeliveryFormValues, Province } from "@/types/address";
import { useCartStore } from "@/store/cartStore";
import { formatMoney } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Loader from "../Loader";
import axios from "axios";
import { UserServer } from "@/types/user";
import { useUser } from "@/hooks/useUser";
import { axiosAuth } from "@/lib/axiosAuth";

interface Props {
  provinces: Province[];
  shippingFee: number;
  loggedUser?: UserServer;
}
export default function CheckoutPage({ provinces, shippingFee }: Props) {
  const { user, loading } = useUser();

  const router = useRouter();

  const items = useCartStore((state) => state.items);

  const subsaleprice = items.reduce((total, item) => {
    const price = Number(item.sale_price) || 0;
    return total + item.quantity * price;
  }, 0);

  const [isLoaded, setIsLoaded] = useState(false);

  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const handleSubmitOrder = async (values: DeliveryFormValues) => {
    setIsLoaded(true);
    try {
      const cartItemsWithPrice = cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        qty: item.quantity,
        sale_price: item.sale_price,
        featured_image: item.imageUrl,
      }));

      const data = {
        user,
        deliveryInfo: values,
        cartItems: cartItemsWithPrice,
      };

      // ⚙️ Nếu là COD (0) → xử lý bình thường
      if (values.payment_method === "0") {
        await axiosAuth.post(`/checkout`, data);
        clearCart();
        router.push("/tai-khoan/don-hang");
        toast.success(
          `Đặt hàng thành công, vui lòng kiểm tra email '${user?.email}'.`
        );
      } else if (values.payment_method === "1") {
        const res = await axiosAuth.post(
          process.env.NEXT_PUBLIC_VNPAY_URL || "",
          data
        );

        const { paymentUrl } = res.data;

        if (paymentUrl) {
          // Chuyển sang VNPay sandbox
          window.location.href = paymentUrl;
        } else {
          toast.error("Không thể tạo liên kết thanh toán VNPay.");
        }
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || error.message || "Lỗi khi đặt hàng."
        );
      } else if (error instanceof Error) {
        toast.error(error.message || "Lỗi khi đặt hàng.");
      } else {
        toast.error("Lỗi khi đặt hàng.");
      }
    } finally {
      setIsLoaded(false);
    }
  };

  const formik = useFormik<DeliveryFormValues>({
    initialValues: {
      fullname: user?.shipping_name ?? "",
      mobile: user?.shipping_mobile ?? "",
      province: user?.ward?.province?.id ?? "",
      ward: user?.ward?.id ?? "",
      address: user?.housenumber_street ?? "",
      payment_method: "0",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      fullname: Yup.string()
        .required("Vui lòng nhập họ tên.")
        .matches(/^[a-zA-ZÀÁÂ...Ỵ\s]+$/, "Vui lòng nhập họ tên đúng ngữ pháp.")
        .max(250, "Vui lòng nhập họ tên nhỏ hơn 250 ký tự."),
      mobile: Yup.string()
        .required("Vui lòng nhập số điện thoại.")
        .matches(
          /^(0|\+84)[2|3|5|7|8|9][0-9]{8}$/,
          "Số điện thoại không hợp lệ."
        ),
      province: Yup.string().required("Chọn tỉnh."),
      ward: Yup.string().required("Chọn xã."),
      address: Yup.string().required("Nhập địa chỉ."),
      payment_method: Yup.string().required("Chọn phương thức thanh toán."),
    }),
    onSubmit: (values) => {
      handleSubmitOrder(values);
    },
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <StyledWrapper>
        <main id="maincontent" className="py-8">
          <div className="max-w-screen-xl mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
              <ol className="flex flex-wrap gap-2 items-center">
                <li>
                  <Link href="/" className="hover:underline text-blue-600">
                    Giỏ hàng
                  </Link>
                </li>
                <li>/</li>
                <li className="text-gray-800 font-semibold">
                  Thông tin giao hàng
                </li>
              </ol>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Shipping form */}
              <div className="task">
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                  <div className="tags">
                    <h3 className="text-lg font-semibold">
                      Thông tin giao hàng
                    </h3>
                  </div>
                  <DeliveryInfo formik={formik} provinces={provinces} />
                  <hr />
                  <h3 className="text-lg font-semibold">
                    Phương thức thanh toán
                  </h3>

                  <div className="space-y-4">
                    <label className="flex items-start gap-2">
                      <input
                        type="radio"
                        name="payment_method"
                        value="0"
                        checked={formik.values.payment_method === "0"}
                        onChange={formik.handleChange}
                        className="mt-1"
                      />
                      <span>Thanh toán khi giao hàng (COD)</span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                        type="radio"
                        name="payment_method"
                        value="1"
                        checked={formik.values.payment_method === "1"}
                        onChange={formik.handleChange}
                        className="mt-1"
                      />
                      <span>
                        Thanh toán trực tuyến qua <strong>VNPay</strong>
                        <div className="mt-2 ml-6 text-sm text-gray-600 leading-relaxed">
                          Hỗ trợ thanh toán bằng thẻ ATM nội địa, Visa,
                          MasterCard, và ví VNPay.
                        </div>
                      </span>
                    </label>
                  </div>

                  <div className="text-right">
                    {isLoaded ? (
                      <Loader />
                    ) : (
                      <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-sm font-semibold transition"
                      >
                        Hoàn tất đơn hàng
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Cart summary */}
              <aside className="task space-y-6">
                <div className="space-y-6">
                  {items.map((item) => (
                    <React.Fragment key={item.id || item.name}>
                      <div className="flex items-center gap-4">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-28 h-28 object-contain sm:object-cover rounded"
                        />
                        <div>
                          <h3 className="font-semibold text-base sm:text-lg">
                            {item.name}
                          </h3>
                          <div className="text-sm text-gray-600 mt-1">
                            {item.quantity} × {formatMoney(item.sale_price)}
                          </div>
                          <div className="text-green-600 font-bold text-base sm:text-xl mt-2">
                            {formatMoney(item.sale_price * item.quantity)}
                          </div>
                        </div>
                      </div>
                      <hr />
                    </React.Fragment>
                  ))}
                </div>

                <div className="space-y-4 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{formatMoney(subsaleprice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span className="shipping-fee text-right">
                      {formatMoney(shippingFee)}
                    </span>
                  </div>
                  <hr className="my-2 border-gray-300" />
                  <div className="flex justify-between font-semibold text-base">
                    <span>Tổng cộng:</span>
                    <span className="payment-total text-right">
                      {formatMoney(subsaleprice + shippingFee)}
                    </span>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>
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
`;
