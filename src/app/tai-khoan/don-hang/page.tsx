// app/dia-chi-giao-hang-mac-dinh/page.tsx
import OrderPage from "@/components/userAccount/OrderPage";
import Link from "next/link";
import WithAuthClient from "@/lib/WithAuthClient";

export default async function Page() {
  // const user = await getServerUser();

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
        <Link href="/" className="text-blue-600 hover:underline">
          Trang chủ
        </Link>

        <span className="text-gray-400">/</span>

        <span className="font-medium text-black">Đơn hàng của tôi</span>
      </div>
      <WithAuthClient>
        {/* <OrderPage orders={orders} /> */}
        <OrderPage />
      </WithAuthClient>
    </>
  );
}
