import ShirtTryOn from "@/components/shirtTryOn/ShirtTryOn";

export default async function ShirtTryOnPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_NODE_API_URL}/shirts`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch shirts");
  }

  const data = await res.json();

  return <ShirtTryOn product={data} />;
}
