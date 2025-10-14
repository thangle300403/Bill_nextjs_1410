// app/dia-chi-giao-hang-mac-dinh/page.tsx
import OrderPage from "@/components/userAccount/OrderPage";
import Link from "next/link";
import WithAuthClient from "@/lib/WithAuthClient";

export default async function Page() {
  // const user = await getServerUser();

  return (
    <>
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2 text-sm text-gray-700">
        <Link href="/" className="text-blue-600 hover:underline">
          Trang chủ
        </Link>
        <span>/</span>
        <span className="font-medium text-black">Đơn hàng của tôi</span>
      </div>
      <WithAuthClient>
        {/* <OrderPage orders={orders} /> */}
        <OrderPage />
      </WithAuthClient>
    </>
  );
}
