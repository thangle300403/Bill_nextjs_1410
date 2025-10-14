import ProductList from "@/components/productPage/ProductList";
import { axiosNonAuthInstanceNest } from "@/lib/utils";
import { Product } from "@/types/product";
import { Metadata } from "next";

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

interface SanPhamPageProps {
  searchParams?: {
    page?: string;
    sort?: string;
    priceRange?: string;
    search?: string;
  };
}

export default async function SanPhamPage({ searchParams }: SanPhamPageProps) {
  const searchParamsProps = await searchParams;
  const page = Number(searchParamsProps?.page ?? 1);
  const sort = searchParamsProps?.sort ?? "";
  const priceRange = searchParamsProps?.priceRange ?? "";
  const search = searchParamsProps?.search ?? "";

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
      <ProductList
        products={items}
        currentPage={Number(pagination.page)}
        totalPages={pagination.totalPage}
      />
    </div>
  );
}
