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
  { label: "Giá dưới 500.000đ", value: "0-500000" },
  { label: "500.000đ - 1.500.000đ", value: "500000-1500000" },
  { label: "1.500.000đ - 2.000.000đ", value: "1500000-2000000" },
  { label: "2.000.000đ - 3.000.000đ", value: "2000000-3000000" },
  { label: "Giá trên 3.000.000đ", value: "3000000-greater" },
];

export default function SortPrice() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentSort = searchParams.get("priceRange") || "default";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "default") {
      params.set("priceRange", value);
    } else {
      params.delete("priceRange");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-base">Lọc theo giá:</span>
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
