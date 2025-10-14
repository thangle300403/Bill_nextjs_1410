"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Product as ProductType } from "@/types/product";
import Product from "../Product";
import PaginationControl from "./Pagination";
import SortSelect from "@/components/productPage/Sort";
import SortPrice from "./SortPrice";
import MT from "../MT";

interface ProductListProps {
  products: (ProductType & { avgStar?: number | null })[];
  categoryName?: string;
  currentPage?: number;
  totalPages?: number;
}

export default function ProductList({
  products,
  currentPage,
  totalPages,
  categoryName,
}: ProductListProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <h1 className="text-xl font-semibold mb-4">{categoryName}</h1>

      <div className="w-full px-4 max-w-[1400px] mx-auto">
        {/* Sorting controls */}
        <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-4 mb-4 w-full">
          <SortPrice />
          <SortSelect />
        </div>

        {/* Product grid */}
        {products.length === 0 ? (
          <MT />
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
            {products.map((product) => (
              <Product key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center my-6">
          <PaginationControl
            currentPage={currentPage ?? 1}
            totalPages={totalPages ?? 1}
            setPage={setPage}
          />
        </div>
      </div>
    </>
  );
}
