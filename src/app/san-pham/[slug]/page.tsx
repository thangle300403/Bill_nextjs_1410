// app/san-pham/[slug]/page.tsx
import ProductInner from "@/components/productInner/InnerPage";
import { axiosNonAuthInstanceNest, extractProductId } from "@/lib/utils";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const productId = extractProductId(slug);

  const [productRes, commentRes] = await Promise.all([
    axiosNonAuthInstanceNest.get(`/products/${productId}`),
    axiosNonAuthInstanceNest.get(`/products/${productId}/comments`),
  ]);

  return <ProductInner product={productRes.data} comments={commentRes.data} />;
}
