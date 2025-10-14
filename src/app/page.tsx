import CleanLoginQuery from "@/components/CleanQuery";
import HomeClient from "@/components/home/HomeClient";
import { axiosNonAuthInstanceNest } from "@/lib/utils";
import { Category } from "@/types/category";
import { CategoriedProduct, Product, ProductComment } from "@/types/product";

export default async function HomePage() {
  try {
    const [featuredRes, latestRes, categoriedRes] = await Promise.all([
      axiosNonAuthInstanceNest.get<{ items: Product[] }>(
        `/products?featured=1&item_per_page=4`
      ),
      axiosNonAuthInstanceNest.get<{ items: Product[] }>(
        `/products?latest=1&item_per_page=4`
      ),
      axiosNonAuthInstanceNest.get<CategoriedProduct[]>(
        `/products?hierarchy=1&item_per_page=4`
      ),
    ]);

    const addAvgStar = async (products: Product[]) => {
      return await Promise.all(
        products.map(async (product) => {
          try {
            const commentsRes = await axiosNonAuthInstanceNest.get(
              `/products/${product.id}/comments`
            );
            const comments = commentsRes.data;
            const total = comments.reduce(
              (sum: number, c: ProductComment) => sum + Number(c.star),
              0
            );
            const avgStar = comments.length
              ? +(total / comments.length).toFixed(2)
              : null;
            return { ...product, avgStar };
          } catch {
            return { ...product, avgStar: null };
          }
        })
      );
    };

    const resCat = await axiosNonAuthInstanceNest.get<{ items: Category[] }>(
      `/categories`
    );
    const allCategories: Category[] = resCat.data.items;

    const featured = await addAvgStar(featuredRes.data.items);
    const latest = await addAvgStar(latestRes.data.items);

    const categoried = await Promise.all(
      categoriedRes.data.map(async (cat) => {
        const productsWithStars = await addAvgStar(cat.items);

        // Find matching category ID from allCategories
        const matchedCategory = allCategories.find(
          (c) => c.name === cat.categoryName
        );

        return {
          ...cat,
          category: matchedCategory || { id: -1, name: cat.categoryName },
          items: productsWithStars,
        };
      })
    );
    return (
      <>
        <CleanLoginQuery />
        <HomeClient
          serverData={{
            featured,
            latest,
            categoried,
          }}
        />
      </>
    );
  } catch (err) {
    console.error("SSR fetch failed:", err);
    return (
      <HomeClient serverData={{ featured: [], latest: [], categoried: [] }} />
    );
  }
}
