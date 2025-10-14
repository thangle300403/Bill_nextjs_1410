import ProductList from "@/components/productPage/ProductList";
import { axiosNonAuthInstanceNest } from "@/lib/utils";
import { Product } from "@/types/product";
import { Metadata } from "next";
import { extractCategoryId } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Category } from "@/types/category";

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

interface SanPhamPageProps {
  params: { slug: string };
  searchParams?: { page?: string; sort?: string; priceRange?: string };
}

export default async function SanPhamPage({
  params,
  searchParams,
}: SanPhamPageProps) {
  const paramsCat = await params;
  const categoryId = extractCategoryId(paramsCat.slug);

  const resCat = await axiosNonAuthInstanceNest.get<Category>(`/categories`);
  const categoryName = resCat.data.name;

  if (!categoryId) return notFound();

  const searchParmsCat = await searchParams;

  const page = Number(searchParmsCat?.page ?? 1);
  const sort = searchParmsCat?.sort ?? "";
  const priceRange = searchParmsCat?.priceRange ?? "";

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
      <ProductList
        products={items}
        currentPage={Number(pagination.page)}
        totalPages={pagination.totalPage}
        categoryName={categoryName}
      />
    </div>
  );
}
