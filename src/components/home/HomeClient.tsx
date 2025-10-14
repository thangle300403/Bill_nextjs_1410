/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { Product, CategoriedProduct } from "@/types/product";
import ProductListHome from "./ProductListHome";
import CategoriedProductList from "./CategoriedProductList";
import { BadgeDollarSign, Loader, RotateCcw, Star, Truck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { usePopupStore } from "@/store/popupStore";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

interface Props {
  serverData: {
    featured: Product[];
    latest: Product[];
    categoried: CategoriedProduct[];
  };
}

export default function HomeClient({ serverData }: Props) {
  const [featuredProducts] = useState(serverData.featured);
  const [latestProducts] = useState(serverData.latest);
  const [categoriedProducts] = useState(serverData.categoried);
  const showPopup = usePopupStore((state) => state.showPopup);
  const router = useSearchParams();
  const showLogin = router.get("showLogin") === "true";

  useEffect(() => {
    if (showLogin) {
      showPopup("LOGIN");
    }
  }, [showLogin]);

  return (
    <>
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        interval={4000}
      >
        <div>
          <img src="/images/slider1.jpg" alt="Slider 1" />
        </div>
        <div>
          <img src="/images/slider_2.jpg" alt="Slider 2" />
        </div>
        <div>
          <img src="/images/slider_3.jpg" alt="Slider 3" />
        </div>
      </Carousel>

      <div className="bg-white py-6">
        <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Item 1 */}
          <div className="text-center border rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <a
              href="#"
              title="7 NGÀY ĐỔI TRẢ"
              className="flex flex-col items-center gap-1 text-green-700 hover:text-green-600"
            >
              <RotateCcw className="text-lg font-semibold uppercase">
                7 NGÀY ĐỔI TRẢ
              </RotateCcw>
              <span className="text-sm">Chăm sóc khách hàng cực tốt</span>
            </a>
          </div>

          {/* Item 2 */}
          <div className="text-center border rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <a
              href="#"
              title="MIỄN PHÍ SHIP"
              className="flex flex-col items-center gap-1 text-green-700 hover:text-green-600"
            >
              <Truck className="text-lg font-semibold uppercase">
                MIỄN PHÍ SHIP
              </Truck>
              <span className="text-sm">Với dịch vụ giao hàng tiết kiệm</span>
            </a>
          </div>

          {/* Item 3 */}
          <div className="text-center border rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <a
              href="#"
              title="BÁN BUÔN NHƯ BÁN SỈ"
              className="flex flex-col items-center gap-1 text-green-700 hover:text-green-600"
            >
              <BadgeDollarSign className="text-lg font-semibold uppercase">
                BÁN BUÔN NHƯ BÁN SỈ
              </BadgeDollarSign>
              <span className="text-sm">Giá hợp lý nhất quả đất</span>
            </a>
          </div>

          {/* Item 4 */}
          <div className="text-center border rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <a
              href="#"
              title="CHẤT LƯỢNG HÀNG ĐẦU"
              className="flex flex-col items-center gap-1 text-green-700 hover:text-green-600"
            >
              <Star className="text-lg font-semibold uppercase">
                CHẤT LƯỢNG HÀNG ĐẦU
              </Star>
              <span className="text-sm">Chăm sóc bạn như người thân</span>
            </a>
          </div>
        </div>
      </div>

      <main id="maincontent" className="page-main">
        <div className="container">
          <div className="row equal">
            <div className="col-xs-12">
              <h4 className="home-title">Sản phẩm nổi bật</h4>
            </div>
            {featuredProducts.length ? (
              <div className="flex justify-center w-full">
                <ProductListHome products={featuredProducts} />
              </div>
            ) : (
              <Loader />
            )}
          </div>

          <div className="row equal">
            <div className="col-xs-12">
              <h4 className="home-title">Sản phẩm mới nhất</h4>
            </div>
            {latestProducts.length ? (
              <div className="flex justify-center w-full">
                <ProductListHome products={latestProducts} />
              </div>
            ) : (
              <Loader />
            )}
          </div>

          {categoriedProducts.length ? (
            <CategoriedProductList categoriedProducts={categoriedProducts} />
          ) : (
            <div className="Loader-container">
              <Loader />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
