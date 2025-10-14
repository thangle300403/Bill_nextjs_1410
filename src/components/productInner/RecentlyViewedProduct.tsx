"use client";

import { useEffect, useState } from "react";
import { axiosAuth } from "@/lib/axiosAuth";
import { getClickedProductIds } from "@/lib/getClickedProductId";
import { Product } from "@/types/product";
import ProductCard from "@/components/Product";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function RecentlyViewedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [explanation, setExplanation] = useState<string>("");

  useEffect(() => {
    const ids = getClickedProductIds();
    if (!ids.length) return;

    // 1. Fetch viewed products
    axiosAuth
      .post("/products/by-ids", { ids })
      .then((res) => {
        const idOrder = new Map(ids.map((id, i) => [id, i]));
        const sorted = res.data.sort(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (a: any, b: any) =>
            (idOrder.get(a.id) ?? 0) - (idOrder.get(b.id) ?? 0)
        );
        setProducts(sorted);
      })
      .catch(console.error);

    // 2. Fetch recommendations with reason
    axiosAuth
      .post("/products/recommend-with-reason", {
        viewedIds: ids,
      })
      .then((res) => {
        setRecommendedProducts(res.data.recommendations);
        setExplanation(res.data.explanation);
      })
      .catch(console.error);
  }, []);

  if (!products.length) return null;

  return (
    <div className="max-w-screen-xl mx-auto px-4 mt-12">
      <h2 className="text-lg font-bold mb-4">Sản phẩm bạn đã xem</h2>
      <Carousel
        opts={{ align: "start", loop: false }}
        plugins={[Autoplay({ delay: 3000 })]}
        className="w-full overflow-hidden"
      >
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="md:basis-1/3 sm:basis-1/2 basis-full px-2"
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="!w-12 !h-12 !text-2xl bg-white border rounded-full shadow-lg left-2" />
        <CarouselNext className="!w-12 !h-12 !text-2xl bg-white border rounded-full shadow-lg right-2" />
      </Carousel>

      {recommendedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-bold mb-2">Gợi ý dành cho bạn</h2>
          {explanation && (
            <p className="text-gray-700 text-base leading-relaxed">
              {explanation}
            </p>
          )}

          <Carousel
            opts={{ align: "start", loop: false }}
            plugins={[Autoplay({ delay: 3000 })]}
            className="w-full overflow-hidden"
          >
            <CarouselContent>
              {recommendedProducts.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="md:basis-1/3 sm:basis-1/2 basis-full px-2"
                >
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="!w-12 !h-12 !text-2xl bg-white border rounded-full shadow-lg left-2" />
            <CarouselNext className="!w-12 !h-12 !text-2xl bg-white border rounded-full shadow-lg right-2" />
          </Carousel>
        </div>
      )}
      <br></br>
    </div>
  );
}
