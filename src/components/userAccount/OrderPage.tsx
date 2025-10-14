/* eslint-disable @next/next/no-img-element */
"use client";

import { Order } from "@/types/order";
import React, { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createLinkOrderDetail } from "@/lib/utils";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { OrderStatus } from "@/types/status";
import Loader from "../Loader";
import { axiosAuth } from "@/lib/axiosAuth";
import { useUser } from "@/hooks/useUser";

// interface OrderPageProps {
//   orders: Order[];
// }

const ITEMS_PER_PAGE = 4;

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [statuses, setStatuses] = useState<OrderStatus[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosAuth.get(`/orders`);
        const data = res.data;
        setOrders(data);
      } catch (err) {
        toast.error("Không thể tải chi tiết cac đơn hàng.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  // 1. Filter by searchTerm (order id includes input)
  const filteredOrders = orders.filter((order) => {
    const matchSearch = !searchTerm || order.id.toString().includes(searchTerm);
    const matchStatus =
      !statusFilter || order.status_description.trim() === statusFilter.trim();
    return matchSearch && matchStatus;
  });

  // 2. Sort
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const dateA = new Date(a.created_date).getTime();
    const dateB = new Date(b.created_date).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  // 3. Pagination
  const totalPages = Math.ceil(sortedOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = sortedOrders.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Reset to page 1 if search or sort changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setPage(1);
  };

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

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/status`)
      .then((res) => res.json())
      .then((data) => {
        setStatuses(data);
      })
      .catch((err) => console.error("❌ Failed to load statuses", err));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="w-full px-4 mt-6">
      {/* Search + Sort controls */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <input
          type="number"
          placeholder="Tìm đơn hàng theo ID..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border-2 border-black font-semibold text-black px-4 py-2 rounded-md w-full md:w-1/2 shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
        />

        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-[200px] text-sm font-semibold border border-blue-600">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {statuses
              .filter(
                (s) =>
                  typeof s.description === "string" &&
                  s.description.trim() !== ""
              )
              .map((s) => {
                const trimmed = s.description.trim();
                return (
                  <SelectItem key={s.id} value={trimmed}>
                    {trimmed}
                  </SelectItem>
                );
              })}
          </SelectContent>
        </Select>

        <button
          onClick={toggleSortOrder}
          className="text-sm font-semibold text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-600 hover:text-white transition self-start"
        >
          Sắp xếp theo ngày tạo: {sortOrder === "asc" ? "Cũ nhất" : "Mới nhất"}
        </button>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginatedOrders.map((order) => (
          <article
            key={order.id}
            className="flex flex-col border border-black bg-gradient-to-b from-white via-gray-100 to-gray-200 p-6 hover:scale-105 transition-transform duration-300"
          >
            <div className="flex flex-wrap justify-between items-center text-sm text-white mb-2 gap-2">
              <span className="bg-red-500 border-2 border-black px-3 py-1 font-bold">
                {order.status_description}
              </span>
              <span className="bg-blue-600 border border-black px-3 py-1 font-bold">
                Ngày tạo: {order.created_date}
              </span>
              <span className="bg-green-600 border border-black px-3 py-1 font-bold">
                Nhận hàng: {order.delivered_date}
              </span>
            </div>
            <h2 className="flex items-center gap-2 text-black-700 font-semibold text-sm hover:scale-105 transition-transform">
              ĐƠN HÀNG #{order.id}
            </h2>
            <Link
              href={createLinkOrderDetail(order)}
              className="text-xl font-black  text-black mb-2"
            >
              Xem chi tiết tại đây
            </Link>

            {order.order_items.map((item) => (
              <div
                key={item.product_id}
                className="flex justify-between items-center gap-4 border-b pb-4 mb-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.featured_image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <h4 className="font-semibold">{item.product.name}</h4>
                </div>
                <div className="text-green-600 font-bold">
                  Số lượng: {item.qty}
                </div>
              </div>
            ))}

            <Dialog>
              {(order.order_status_id === 1 || order.order_status_id === 2) && (
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
                    Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này
                    không thể hoàn tác.
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
          </article>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-6 justify-center">
          <PaginationContent>
            {page > 1 && (
              <PaginationItem>
                <PaginationLink
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  isActive={false}
                >
                  Trước
                </PaginationLink>
              </PaginationItem>
            )}

            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => setPage(i + 1)}
                  className={
                    page === i + 1
                      ? "bg-black text-white font-bold border-2 border-black shadow-md px-4 py-2 rounded"
                      : "hover:bg-gray-100 px-4 py-2 rounded"
                  }
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {page < totalPages && (
              <PaginationItem>
                <PaginationLink
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  isActive={false}
                >
                  Tiếp
                </PaginationLink>
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
