/* eslint-disable @next/next/no-img-element */
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { FormEvent, useState } from "react";

export default function HeaderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (searchTerm) {
      params.set("search", searchTerm);
      params.set("page", "1");
    } else {
      params.delete("search");
    }

    router.push(`/san-pham-all?${params.toString()}`);
  };
  return (
    <div>
      {/* Header Content */}
      <div className="max-w-screen-xl mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-3 items-center gap-4 min-h-[170px]">
        {/* Column 1: Logo */}
        <div className="flex justify-start">
          <Link href="/">
            <img
              src="/images/BillCipher.png"
              alt="Logo"
              className="h-full max-h-48 w-auto object-contain rounded-lg shadow-md border border-gray-200"
            />
          </Link>
        </div>

        {/* Column 2: Center Banner (hidden on small screens) */}
        <div className="hidden md:flex justify-center">
          <Link href="/">
            <img
              src="/images/badminton.jpg"
              alt="Banner"
              className="h-full max-h-48 w-auto object-cover rounded-xl shadow-lg ring-1 ring-gray-300"
            />
          </Link>
        </div>

        {/* Column 3: Search Bar */}
        <div className="flex justify-end">
          <form className="w-full max-w-md" onSubmit={handleSubmit}>
            <div className="flex border rounded overflow-hidden shadow-sm">
              <input
                type="search"
                name="search"
                placeholder="Nhập từ khóa tìm kiếm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoComplete="off"
                className="flex-grow px-4 py-2 outline-none"
              />
              <button
                type="submit"
                className="bg-green-600 px-4 py-2 text-white hover:bg-green-700 flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-black font-semibold">
            HOTLINE:
            <span className="text-[green] font-bold">0868389830</span>
            <span className="mx-2 font-bold text-[green]">|</span>
            <span className="text-[green] font-bold">0000000911</span>
          </span>
        </div>
      </div>
    </div>
  );
}
