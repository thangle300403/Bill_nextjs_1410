"use client";

import React from "react";
import { CategoriedProduct } from "@/types/product";
import ProductListHome from "./ProductListHome";
import { createLinkCategory } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Props {
  categoriedProducts: CategoriedProduct[];
}

export default function CategoriedProductList({ categoriedProducts }: Props) {
  const router = useRouter();
  return (
    <>
      {categoriedProducts.map((categoriedProduct) => (
        <div className="row equal mb-6" key={categoriedProduct.categoryName}>
          <div className="col-xs-12 mb-2">
            <h4 className="home-title">{categoriedProduct.categoryName}</h4>
          </div>

          {/* Show only on desktop */}
          <div className="hidden sm:block">
            <ProductListHome products={categoriedProduct.items} />
          </div>

          {/* Show only on mobile */}
          <div className="block sm:hidden text-center mt-4">
            <button
              className="cursor-pointer group relative bg-white hover:bg-zinc-300 text-black font-semibold text-sm px-6 py-3 rounded-full transition-all duration-200 ease-in-out shadow hover:shadow-lg w-40 h-12"
              onClick={() => {
                if (
                  categoriedProduct.category?.id &&
                  categoriedProduct.category.name
                ) {
                  const url = createLinkCategory(categoriedProduct.category);
                  router.push(url);
                } else {
                  console.warn("Missing category info", categoriedProduct);
                }
              }}
            >
              <div className="relative flex items-center justify-center gap-2">
                <span className="relative inline-block overflow-hidden">
                  <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                    Tìm hiểu
                  </span>
                  <span className="absolute inset-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                    Bây giờ
                  </span>
                </span>
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:rotate-45"
                  viewBox="0 0 24 24"
                >
                  <circle fill="currentColor" r={11} cy={12} cx={12} />
                  <path
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth={2}
                    stroke="white"
                    d="M7.5 16.5L16.5 7.5M16.5 7.5H10.5M16.5 7.5V13.5"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
