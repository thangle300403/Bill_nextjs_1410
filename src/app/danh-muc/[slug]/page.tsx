import ProductList from "@/components/productPage/ProductList";
import { axiosNonAuthInstanceNest } from "@/lib/utils";
import { Product } from "@/types/product";
import { Metadata } from "next";
import { extractCategoryId } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Category } from "@/types/category";
import { Suspense } from "react";

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

// ✅ Promise-based props for Next.js 15
interface SanPhamPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{
    page?: string;
    sort?: string;
    priceRange?: string;
  }>;
}

export default async function SanPhamPage({
  params,
  searchParams,
}: SanPhamPageProps) {
  // ✅ Await both props
  const resolvedParams = await params;
  const resolvedSearch = (await searchParams) || {};

  const categoryId = extractCategoryId(resolvedParams.slug);
  if (!categoryId) return notFound();

  // ✅ Fetch category list and find the correct one
  const resCat = await axiosNonAuthInstanceNest.get<Category>(
    `/categories/${categoryId}`
  );
  const categoryName = resCat.data.name;

  const page = Number(resolvedSearch.page ?? 1);
  const sort = resolvedSearch.sort ?? "";
  const priceRange = resolvedSearch.priceRange ?? "";

  const queryParams = new URLSearchParams({
    item_per_page: "10",
    page: page.toString(),
    category_id: categoryId,
    ...(sort ? { sort } : {}),
    ...(priceRange ? { priceRange } : {}),
  });

  const res = await axiosNonAuthInstanceNest.get<ProductListResponse>(
    `/products?${queryParams.toString()}`
  );

  const { items, pagination } = res.data;

  return (
    <div className="container py-8">
      <Suspense fallback={<div>Đang tải...</div>}>
        <ProductList
          products={items}
          currentPage={Number(pagination.page)}
          totalPages={pagination.totalPage}
          categoryName={categoryName}
        />
      </Suspense>
    </div>
  );
}
