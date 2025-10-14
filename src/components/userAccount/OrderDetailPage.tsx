/* eslint-disable @next/next/no-img-element */
"use client";

import {
  createLinkProduct,
  formatMoney,
  getOrderIdFromSlug,
} from "@/lib/utils";
import { Order } from "@/types/order";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import Loader from "../Loader";
import { axiosAuth } from "@/lib/axiosAuth";
import { useUser } from "@/hooks/useUser";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AxiosError } from "axios";

export default function OrderDetailPage() {
  const { user } = useUser();

  const { slug } = useParams();
  const orderId = getOrderIdFromSlug(slug as string);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const subTotal = order?.order_items.reduce(
    (sum, item) => sum + item.total_price,
    0
  );

  const handleCancelOrder = async (orderId: number) => {
    try {
      const response = await axiosAuth.patch(`/orders/${orderId}/cancel`);
      router.refresh();
      toast.success(response.data.message);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;

      if (axiosError.response?.data?.message) {
        toast.error(axiosError.response.data.message);
      } else {
        toast.error("Đã xảy ra lỗi khi huỷ đơn hàng");
      }
    }
  };

  const total = (subTotal ?? 0) + Number(order?.shipping_fee);
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axiosAuth.get(`/orders/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        toast.error("Không thể tải chi tiết đơn hàng.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId && user) {
      fetchOrder();
    }
  }, [orderId, user]);

  if (loading) return <Loader />;
  if (!order) return <p>Không tìm thấy đơn hàng.</p>;
  return (
    <>
      <StyledWrapper>
        <div className="col-xs-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-2">
            Mã đơn hàng:
            <span className="font-semibold text-primary">#{order.id}</span>
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Order Summary */}
          <aside className="w-full md:w-2/3">
            <div className="task flex flex-col h-full text-gray-800 bg-white p-4 rounded-lg shadow-md border-4 border-dashed border-transparent hover:border-green-500 transition-all">
              <div className="tags flex justify-between items-center w-full">
                <span className="tag text-white bg-blue-500 text-xs px-3 py-1 rounded-full">
                  Thành tiền
                </span>
              </div>
              <br />

              {order.order_items.map((item) => (
                <div key={item.product_id}>
                  <div className="flex items-center">
                    <div className="w-1/6">
                      <img
                        className="w-full h-auto object-cover"
                        src={item.product.featured_image}
                        alt={item.product.name}
                      />
                    </div>
                    <div className="w-4/6 pl-4">
                      <Link
                        href={createLinkProduct(item.product)}
                        className="product-name text-blue-600 font-bold hover:underline"
                      >
                        {item.product.name}
                      </Link>
                      <br />
                      <span>{item.qty}</span> x{" "}
                      <span>{formatMoney(item.unit_price)}</span>
                    </div>
                    <div className="w-1/6 text-right">
                      <span className="text-green-600 font-bold">
                        {formatMoney(item.total_price)}
                      </span>
                    </div>
                  </div>
                  <hr className="my-8" />
                </div>
              ))}

              <div className="flex justify-between font-bold">
                <span>Tạm tính</span>
                <span>{formatMoney(subTotal ?? 0)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Phí vận chuyển</span>
                <span>{formatMoney(Number(order.shipping_fee))}</span>
              </div>
              <hr className="my-8" />
              <div className="flex justify-between font-bold text-blue-600">
                <span>Tổng cộng</span>
                <span>{formatMoney(total)}</span>
              </div>
            </div>
          </aside>

          {/* Shipping Info */}
          <div className="w-full md:w-1/3">
            <div className="task flex flex-col h-full text-gray-800 bg-white p-4 rounded-lg shadow-md border-4 border-dashed border-transparent hover:border-green-500 transition-all">
              <div className="tags flex justify-between items-center w-full">
                <span className="tag text-white bg-blue-500 text-xs px-3 py-1 rounded-full">
                  Thông tin giao hàng
                </span>
              </div>
              <br />
              <div>Họ và tên: {order.shipping_fullname}</div>
              <hr className="my-8" />
              <div>Số điện thoại: {order.shipping_mobile}</div>
              <hr className="my-8" />
              <div>{order.province_name}</div>
              <hr className="my-8" />
              <div>{order.ward_name}</div>
              <hr className="my-8" />
              <div>{order.shipping_housenumber_street}</div>
              <hr className="my-8" />
              <div>
                {order.payment_method === 1
                  ? "Thanh toán online"
                  : "Thanh toán khi nhận hàng"}
              </div>
              <hr className="my-8" />
              <Dialog>
                {(order.order_status_id === 1 ||
                  order.order_status_id === 2) && (
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-2 text-red-700 font-semibold text-sm hover:scale-105 transition-transform">
                      Hủy đơn hàng
                    </button>
                  </DialogTrigger>
                )}

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Xác nhận hủy đơn hàng</DialogTitle>
                    <DialogDescription>
                      Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động
                      này không thể hoàn tác.
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Không</Button>
                    </DialogClose>

                    {/* Trigger cancel and close on success */}
                    <DialogClose asChild>
                      <Button
                        variant="destructive"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        Hủy đơn
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
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
