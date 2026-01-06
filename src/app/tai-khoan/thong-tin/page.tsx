import AccountPage from "@/components/userAccount/AccountPage";
import Link from "next/link";

// app/dia-chi-giao-hang-mac-dinh/page.tsx
export default async function Page() {
  // const user = await getServerUser();

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
        <Link href="/" className="text-blue-600 hover:underline">
          Trang chủ
        </Link>

        <span className="text-gray-400">/</span>

        <span className="font-medium text-black">Thông tin tài khoản</span>
      </div>
      <AccountPage />
    </>
  );
}
