"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { usePopupStore } from "@/store/popupStore";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { formatMoney } from "@/lib/utils";

export default function Cart() {
  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const addToCart = useCartStore((state) => state.addToCart);
  const closePopup = usePopupStore((state) => state.closePopup);
  const popupType = usePopupStore((state) => state.popupType);
  const isOpen = popupType === "CART";

  if (!isOpen) return null;

  const getTotal = () =>
    items.reduce((acc, item) => acc + item.sale_price * item.quantity, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[1px]"
      onClick={closePopup}
    >
      <div
        className="bg-white rounded-xl shadow-lg max-w-[1000px] w-full max-h-[90vh] overflow-y-auto p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={closePopup}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-2xl"
        >
          &times;
        </button>
        <h1 className="text-2xl text-center font-bold">Giỏ hàng</h1>
        <p className="text-gray-500 mb-6">
          {items.reduce((total, item) => total + item.quantity, 0)} món hàng
          trong giỏ
        </p>
        <hr />
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row items-center justify-between bg-gray-50 rounded-lg border p-4 mb-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <span className="text-greeb-600">
                  Đơn giá: {formatMoney(item.sale_price)}
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => addToCart({ ...item, quantity: -1 })}
                    className="w-8 h-8 border rounded hover:bg-gray-200"
                  >
                    −
                  </button>
                  <span className="px-2">{item.quantity}</span>
                  <button
                    onClick={() => addToCart({ ...item, quantity: 1 })}
                    className="w-8 h-8 border rounded hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end mt-4 sm:mt-0">
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-gray-500 hover:text-red-500"
              >
                <Trash2 className="w-8 h-8 text-red-500 hover:text-red-600 transition" />
              </button>
              <div className="mt-2 text-right">
                <div className="text-right font-semibold text-xl mt-6 text-green-600">
                  {formatMoney(item.sale_price * item.quantity)}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="text-right font-bold text-xl mt-6 text-black-600">
          Tổng cộng:
        </div>
        <div className="text-right font-semibold text-xl mt-6 text-green-600">
          {formatMoney(getTotal())}
        </div>
        {items.length > 0 ? (
          <Link
            href="/dat-hang"
            onClick={() => closePopup()}
            className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow transition"
          >
            Đặt hàng
          </Link>
        ) : null}
      </div>
    </div>
  );
}
