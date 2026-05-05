// app/san-pham/[slug]/page.tsx
import ProductInner from "@/components/productInner/InnerPage";
import { axiosNonAuthInstanceNest, extractProductId } from "@/lib/utils";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const productId = extractProductId(slug);
  if (!productId) return notFound();

  const [productRes, commentRes] = await Promise.allSettled([
    axiosNonAuthInstanceNest.get(`/products/${productId}`),
    axiosNonAuthInstanceNest.get(`/products/${productId}/comments`),
  ]);

  if (productRes.status !== "fulfilled") return notFound();

  const comments =
    commentRes.status === "fulfilled" && Array.isArray(commentRes.value.data)
      ? commentRes.value.data
      : [];

  return <ProductInner product={productRes.value.data} comments={comments} />;
}
