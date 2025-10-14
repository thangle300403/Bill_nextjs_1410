"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SORT_OPTIONS = [
  { label: "Mặc định", value: "default" },
  { label: "Giá tăng dần", value: "price-asc" },
  { label: "Giá giảm dần", value: "price-desc" },
  { label: "Từ A-Z", value: "alpha-asc" },
  { label: "Từ Z-A", value: "alpha-desc" },
  { label: "Cũ đến mới", value: "created-asc" },
  { label: "Mới đến cũ", value: "created-desc" },
];

export default function SortSelect() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentSort = searchParams.get("sort") || "default";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "default") {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-base">Sắp xếp:</span>
      <Select value={currentSort} onValueChange={handleChange}>
        <SelectTrigger className="w-[200px] h-12 text-lg">
          <SelectValue placeholder="Mặc định" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
