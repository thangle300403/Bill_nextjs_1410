import ShirtTryOn from "@/components/shirtTryOn/ShirtTryOn";
import { axiosNonAuthInstanceNode } from "@/lib/utils";

export default async function ShirtTryOnPage() {
  const res = await axiosNonAuthInstanceNode.get("/shirts");

  return <ShirtTryOn product={res.data} />;
}
