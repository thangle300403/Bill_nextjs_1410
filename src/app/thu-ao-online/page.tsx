import ShirtTryOn from "@/components/shirtTryOn/ShirtTryOn";

export default async function ShirtTryOnPage() {
  const apiUrl = process.env.NEXT_PUBLIC_NODE_API_URL;

  if (!apiUrl) {
    return <ShirtTryOn product={[]} />;
  }

  try {
    const res = await fetch(`${apiUrl}/shirts`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return <ShirtTryOn product={[]} />;
    }

    const data = await res.json();
    return <ShirtTryOn product={Array.isArray(data) ? data : []} />;
  } catch {
    return <ShirtTryOn product={[]} />;
  }
}
