"use client";

import React, { useEffect, useState } from "react";
// import ProductSider from "./ProductSider";
import styled from "styled-components";
import { formatMoney } from "@/lib/utils";
import { Product } from "@/types/product";
import { Comment } from "@/types/product";
import ProductSider from "./ProductSider";
import ProductTabs from "./ProductTabs";
import RelatedProductSlider from "./RelatedProductSlider";
import Announcement from "./Announcement";
import { useCartStore } from "@/store/cartStore";
import { usePopupStore } from "@/store/popupStore";
import { toast } from "react-toastify";
import RecentlyViewedProducts from "./RecentlyViewedProduct";

interface ProductInnerProps {
  product: Product;
  comments: Comment[];
}

export default function ProductInner({ product, comments }: ProductInnerProps) {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore((state) => state.addToCart);
  const showPopup = usePopupStore((state) => state.showPopup);

  useEffect(() => {
    const cookieName = "clickedProductIds";
    const maxItems = 10;

    if (typeof document !== "undefined") {
      // 1. Read cookie
      const existing = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${cookieName}=`))
        ?.split("=")[1];

      let ids: number[] = [];
      try {
        ids = existing ? JSON.parse(decodeURIComponent(existing)) : [];
      } catch {}

      // 2. Add current product ID to front
      if (!ids.includes(product.id)) {
        ids.unshift(product.id);
      }

      // 3. Limit length
      const newIds = ids.slice(0, maxItems);

      // 4. Set updated cookie
      document.cookie = `${cookieName}=${encodeURIComponent(
        JSON.stringify(newIds)
      )}; path=/; max-age=31536000`; // 1 year
    }

    // Handle product-comment anchor on page load
    if (
      typeof window !== "undefined" &&
      window.location.hash === "#product-comment"
    ) {
      const commentTabLink = document.querySelector(
        'a[href="#product-comment"]'
      );
      if (commentTabLink) {
        (commentTabLink as HTMLElement).click();
      }
    }
  }, [product.id]);

  return (
    <>
      <br></br>
      <div className="flex justify-center w-full px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl w-fit">
          <div>
            <ProductSider product={product}></ProductSider>
          </div>
          <div className="rounded-2xl border border-gray-200 p-6 shadow-sm bg-white w-full max-w-md mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h1 className="text-3xl font-bold">{product.name}</h1>

              {/* <div className="text-sm text-gray-600">
                <span className="font-medium">Nhãn hàng: </span>
                <span>{product.brand}</span>
              </div> */}

              <div className="text-sm">
                <span className="font-medium">Trạng thái: </span>
                {product.inventory_qty > 0 ? (
                  <span className="text-green-600 font-semibold">Còn hàng</span>
                ) : (
                  <span className="text-red-500 font-semibold">Hết hàng</span>
                )}
              </div>

              <div className="text-base">
                <span className="font-medium">Giá: </span>
                {product.price !== product.sale_price && (
                  <span className="line-through text-gray-400 mr-2">
                    {formatMoney(product.price)}
                  </span>
                )}
                <span className="text-red-600 font-bold text-lg">
                  {formatMoney(product.sale_price)}
                </span>
              </div>

              {product.inventory_qty > 0 ? (
                <>
                  <input
                    type="number"
                    className="w-20 border border-gray-300 rounded px-2 py-1"
                    value={quantity}
                    min={1}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                  <StyledWrapper>
                    <button
                      className="button"
                      onClick={() => {
                        addToCart({
                          id: product.id,
                          name: product.name,
                          sale_price: product.sale_price,
                          imageUrl: product.featured_image,
                          quantity,
                        });

                        toast.success(
                          ` Đã thêm ${quantity} "${product.name}" vào giỏ hàng!`
                        );
                        showPopup("CART");
                      }}
                    >
                      <svg
                        viewBox="0 0 16 16"
                        className="bi bi-cart-check"
                        height={24}
                        width={24}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#fff"
                      >
                        <path d="M11.354 6.354a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z" />
                        <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                      </svg>
                      <p className="text">Thêm vào giỏ hàng</p>
                    </button>
                    <br></br>
                    <div className="w-[260px] lg:block">
                      <Announcement />
                    </div>
                  </StyledWrapper>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="product-description mt-10">
        <div>
          <div role="tabpanel">
            {/* Tab panes */}
            {/* Mobile: collapsible Product Description */}
            <details className="block md:hidden border rounded p-4 mt-10">
              <summary className="text-base font-semibold cursor-pointer">
                Mô tả sản phẩm
              </summary>
              <div className="mt-4">
                <ProductTabs
                  productId={product.id}
                  description={product.description}
                  comments={comments}
                />
              </div>
            </details>

            {/* Desktop: normal ProductTabs view */}
            <div className="hidden md:block mt-10">
              <ProductTabs
                productId={product.id}
                description={product.description}
                comments={comments}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="product-related mt-12">
        <div>
          <RelatedProductSlider
            relatedProducts={product.relatedProducts ?? []}
          />
        </div>
      </div>
      <div className="product-related mt-12">
        <div>
          <RecentlyViewedProducts></RecentlyViewedProducts>
        </div>
      </div>
    </>
  );
}

const StyledWrapper = styled.div`
  .button {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 15px;
    gap: 15px;
    background-color: rgb(255, 0, 0);
    outline: 3px rgb(255, 0, 0);
    outline-offset: -3px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    transition: 400ms;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
      rgba(0, 0, 0, 0.3) 0px 7px 13px -3px,
      rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  }

  .button .text {
    color: white;
    font-weight: 700;
    font-size: 1em;
    transition: 400ms;
  }

  .button svg path {
    transition: 400ms;
  }

  .button:hover {
    background-color: transparent;
  }

  .button:hover .text {
    color: rgb(255, 0, 0);
  }

  .button:hover svg path {
    fill: rgb(255, 0, 0);
  }
`;
