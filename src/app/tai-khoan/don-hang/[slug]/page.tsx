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
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
        <Link href="/" className="text-blue-600 hover:underline">
          Trang chủ
        </Link>

        <span className="text-gray-400">/</span>

        <span className="font-medium text-black">Chi tiết đơn hàng</span>
      </div>
      <WithAuthClient>
        {/* <OrderDetailPage order={order} /> */}
        <OrderDetailPage />
      </WithAuthClient>
    </>
  );
}
