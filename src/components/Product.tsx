/* eslint-disable @next/next/no-img-element */

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import StarRatings from "react-star-ratings";
import { Product as ProductType } from "@/types/product";
import { formatMoney, createLinkProduct } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { toast } from "react-toastify";

interface Props {
  product: ProductType & { avgStar?: number | null };
}

export default function Product({ product }: Props) {
  const [isClient, setIsClient] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="product-card w-full max-w-[300px] min-h-[350px] h-[400px] bg-white border border-gray-300 shadow rounded-lg flex flex-col overflow-hidden p-2 transition-transform hover:-translate-y-1 hover:shadow-lg relative">
      {/* Discount Badge */}
      {Number(product.price) > Number(product.sale_price) && (
        <div className="absolute top-2 left-2 bg-green-600 text-white font-bold text-sm px-2 py-1 rounded shadow z-10">
          -
          {Math.round(
            ((Number(product.price) - Number(product.sale_price)) /
              Number(product.price)) *
              100
          )}
          %
        </div>
      )}

      {/* Clickable image */}
      <Link
        href={createLinkProduct(product)}
        title={product.name}
        className="block relative w-full h-[60%] rounded-t-md overflow-hidden group"
      >
        <img
          src={product.featured_image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      {/* Clickable product name */}
      <div className="text-center font-bold text-[min(5vw,22px)] my-2 px-2 line-clamp-2">
        <Link
          href={createLinkProduct(product)}
          title={product.name}
          className="hover:text-blue-600 transition-colors"
        >
          {product.name}
        </Link>
      </div>

      {/* Rating */}
      {isClient && product.avgStar != null && product.avgStar > 0 && (
        <div className="text-center mb-2">
          <StarRatings
            rating={product.avgStar}
            starRatedColor="gold"
            numberOfStars={5}
            name={`rating-${product.id}`}
            starDimension="20px"
            starSpacing="3px"
          />
        </div>
      )}

      {/* Price + Add to cart */}
      <div className="mt-auto flex justify-between items-center text-sm px-2">
        <div className="text-blue-600">
          {Number(product.price) !== Number(product.sale_price) && (
            <span className="line-through text-gray-500 mr-2 font-bold">
              {formatMoney(product.price)}
            </span>
          )}
          <span className="text-red-600 font-bold">
            {formatMoney(product.sale_price)}
          </span>
        </div>

        {product.inventory_qty > 0 && (
          <button
            className="w-8 h-8 border-2 border-primary rounded hover:border-accent transition flex items-center justify-center"
            onClick={() => {
              addToCart({
                id: product.id,
                name: product.name,
                sale_price: product.sale_price,
                imageUrl: product.featured_image,
                quantity: 1,
              });
              toast.success(`🛒 Đã thêm "${product.name}" vào giỏ hàng!`);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-5 h-5 fill-primary group-hover:fill-accent"
            >
              <path d="m397.78 316h-205.13a15 15 0 0 1 -14.65-11.67l-34.54-150.48a15 15 0 0 1 14.62-18.36h274.27a15 15 0 0 1 14.65 18.36l-34.6 150.48a15 15 0 0 1 -14.62 11.67zm-193.19-30h181.25l27.67-120.48h-236.6z" />
              <path d="m222 450a57.48 57.48 0 1 1 57.48-57.48 57.54 57.54 0 0 1 -57.48 57.48zm0-84.95a27.48 27.48 0 1 0 27.48 27.47 27.5 27.5 0 0 0 -27.48-27.47z" />
              <path d="m368.42 450a57.48 57.48 0 1 1 57.48-57.48 57.54 57.54 0 0 1 -57.48 57.48zm0-84.95a27.48 27.48 0 1 0 27.48 27.47 27.5 27.5 0 0 0 -27.48-27.47z" />
              <path d="m158.08 165.49a15 15 0 0 1 -14.23-10.26l-25.71-77.23h-47.44a15 15 0 1 1 0-30h58.3a15 15 0 0 1 14.23 10.26l29.13 87.49a15 15 0 0 1 -14.23 19.74z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
