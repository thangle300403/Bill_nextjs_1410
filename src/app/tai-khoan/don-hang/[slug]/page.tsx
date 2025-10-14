//don-hang/[slug]/page.tsx
import OrderDetailPage from "@/components/userAccount/OrderDetailPage";
import WithAuthClient from "@/lib/WithAuthClient";
import Link from "next/link";

export default async function Page() {
  // const user = getServerUser();
  // if (!user) {
  //   redirect("/?showLogin=true");
  // }

  return (
    <>
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2 text-sm text-gray-700">
        <Link href="/" className="text-blue-600 hover:underline">
          Trang chủ
        </Link>
        <span>/</span>
        <span className="font-medium text-black">Chi tiết đơn hàng</span>
      </div>
      <WithAuthClient>
        {/* <OrderDetailPage order={order} /> */}
        <OrderDetailPage />
      </WithAuthClient>
    </>
  );
}
