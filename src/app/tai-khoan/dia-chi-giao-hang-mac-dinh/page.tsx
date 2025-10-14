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
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2 text-sm text-gray-700">
        <Link href="/" className="text-blue-600 hover:underline">
          Trang chủ
        </Link>
        <span>/</span>
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
