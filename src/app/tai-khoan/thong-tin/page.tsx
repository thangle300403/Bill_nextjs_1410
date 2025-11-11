import AccountPage from "@/components/userAccount/AccountPage";
import Link from "next/link";

// app/dia-chi-giao-hang-mac-dinh/page.tsx
export default async function Page() {
  // const user = await getServerUser();

  return (
    <>
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2 text-sm text-gray-700">
        <Link href="/" className="text-blue-600 hover:underline">
          Trang chủ
        </Link>
        <span>/</span>
        <span className="font-medium text-black">Tài khoản</span>
      </div>
      <AccountPage />
    </>
  );
}
