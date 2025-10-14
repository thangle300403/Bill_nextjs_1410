// app/idol/page.tsx

import PlayerSelector from "@/components/idol/PlayerSelector";
import Link from "next/link";

export default async function Page() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_NEST_API_URL}/athlete-gear/players`,
    {
      cache: "no-store",
    }
  );
  const players: string[] = await res.json();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
        <ol className="flex flex-wrap gap-2 items-center">
          <li>
            <Link href="/" className="hover:underline text-blue-600">
              Trang chủ
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-800 font-semibold">Chính sách giao hàng</li>
        </ol>
      </nav>
      <div className="max-w-3xl mx-auto mb-6">
        <h1 className="text-2xl font-bold">🏸 Hãy chọn tên idol:</h1>
      </div>
      <PlayerSelector players={players} />
    </div>
  );
}
