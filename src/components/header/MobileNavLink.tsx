"use client";
import { usePathname, useRouter } from "next/navigation";

export default function MobileNavLinks({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const router = useRouter();

  const handleClick = (href: string) => {
    if (onNavigate) onNavigate();

    // Delay the router push slightly to ensure pathname updates correctly
    setTimeout(() => {
      router.push(href);
    }, 10);
  };

  return (
    <ul className="flex flex-col gap-2 font-semibold px-4 pt-2">
      {[
        { href: "/", label: "Trang chủ" },
        { href: "/gioi-thieu", label: "Giới thiệu" },
        { href: "/san-pham-all", label: "Sản phẩm" },
        { href: "/san-pham-sale", label: "Sản phẩm sale" },
        { href: "/chinh-sach-doi-tra", label: "Chính sách đổi trả" },
        { href: "/chinh-sach-thanh-toan", label: "Chính sách thanh toán" },
        { href: "/chinh-sach-giao-hang", label: "Chính sách giao hàng" },
        { href: "/lien-he", label: "Liên hệ" },
        { href: "/idol", label: "Mua hàng theo idol" },
        { href: "/thu-ao-online", label: "Thử áo bằng AI" },
      ].map(({ href, label }) => (
        <li key={href}>
          <button
            onClick={() => handleClick(href)}
            className={`text-left w-full block px-4 py-2 rounded transition ${
              pathname === href
                ? "bg-gray-100 text-green-700"
                : "hover:bg-white/10"
            }`}
          >
            {label}
          </button>
        </li>
      ))}
    </ul>
  );
}
