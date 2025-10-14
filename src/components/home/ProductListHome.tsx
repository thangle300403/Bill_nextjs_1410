"use client";

import { Product as ProductType } from "@/types/product";
import Product from "../Product";

interface ProductListProps {
  products: (ProductType & { avgStar?: number | null })[];
  currentPage?: number;
  totalPages?: number;
}

export default function ProductList({ products }: ProductListProps) {
  return (
    <>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr justify-items-center">
        {products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
