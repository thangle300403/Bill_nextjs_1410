import ProductList from "@/components/productPage/ProductList";
import { axiosNonAuthInstanceNest } from "@/lib/utils";
import { Product } from "@/types/product";
import { Metadata } from "next";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

interface ProductListResponse {
  items: Product[];
  totalItem: number;
  pagination: {
    page: string;
    totalPage: number;
  };
}

export const metadata: Metadata = {
  title: "Sản phẩm",
};

// ✅ searchParams must be a Promise
interface SanPhamPageProps {
  searchParams?: Promise<{
    page?: string;
    sort?: string;
    priceRange?: string;
    search?: string;
  }>;
}

export default async function SanPhamPage({ searchParams }: SanPhamPageProps) {
  // ✅ Await the searchParams
  const resolvedParams = (await searchParams) || {};

  const page = Number(resolvedParams.page ?? 1);
  const sort = resolvedParams.sort ?? "";
  const priceRange = resolvedParams.priceRange ?? "";
  const search = resolvedParams.search ?? "";

  const queryParams = new URLSearchParams({
    item_per_page: "10",
    page: page.toString(),
    ...(search ? { search } : {}),
    ...(sort ? { sort } : {}),
    ...(priceRange ? { priceRange } : {}),
  });

  const res = await axiosNonAuthInstanceNest.get<ProductListResponse>(
    `/products?${queryParams.toString()}`
  );

  const { items, pagination } = res.data;

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Tất cả sản phẩm</h1>
      <Suspense fallback={<div>Đang tải...</div>}>
        <ProductList
          products={items}
          currentPage={Number(pagination.page)}
          totalPages={pagination.totalPage}
        />
      </Suspense>
    </div>
  );
}
