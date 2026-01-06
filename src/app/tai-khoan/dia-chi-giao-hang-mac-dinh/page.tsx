// app/dia-chi-giao-hang-mac-dinh/page.tsx
import DefaultAddressPage from "@/components/userAccount/DefaultAddressPage";
import WithAuthClient from "@/lib/WithAuthClient";
import Link from "next/link";
export default async function Page() {
  // const user = await getServerUser();

  // const provincesRes = await axiosNonAuthInstanceNest.get<Province[]>(
  //   `/provinces`
  // );
  // const provinces = provincesRes.data;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
        <Link href="/" className="text-blue-600 hover:underline">
          Trang chủ
        </Link>

        <span className="text-gray-400">/</span>

        <span className="font-medium text-black">
          Địa chỉ giao hàng mặc định
        </span>
      </div>
      <WithAuthClient>
        <DefaultAddressPage
          provinces={[]}
          wards={[]}
          // loggedUser={user}
        />
      </WithAuthClient>
    </>
  );
}
