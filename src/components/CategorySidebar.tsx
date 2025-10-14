"use client";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { createLinkCategory, extractCategoryId } from "@/lib/utils";
import { Category } from "@/types/category";
import { Menu, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";
import MobileNavLinks from "./header/MobileNavLink";

export default function CategorySidebar({
  categories,
}: {
  categories: Category[];
}) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const activeCategoryId = extractCategoryId(pathname);
  const [openDrawer, setOpenDrawer] = useState(false);
  const initialCategoryName =
    categories.find((cat) => String(cat.id) === activeCategoryId)?.name ||
    "Danh mục sản phẩm";
  const [selectedName, setSelectedName] = useState(initialCategoryName);
  const [collapsed, setCollapsed] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const toggleCollapse = () => setCollapsed((prev) => !prev);

  const CategoryList = () => (
    <StyledWrapper>
      <div className="p-4 space-y-4">
        <Link
          href="/san-pham-all"
          className={`value ${!activeCategoryId ? "active" : ""}`}
          onClick={() => {
            setSelectedName("Danh mục sản phẩm");
            setOpenDrawer(false);
          }}
        >
          Tất cả sản phẩm
        </Link>

        {categories.map((category) => {
          const isActive = activeCategoryId === String(category.id);
          return (
            <Link
              key={category.id}
              href={createLinkCategory(category)}
              className={`value ${isActive ? "active" : ""}`}
              onClick={() => {
                setSelectedName(category.name);
                setOpenDrawer(false);
              }}
            >
              {category.name}
            </Link>
          );
        })}
      </div>
    </StyledWrapper>
  );

  return (
    <>
      {isMobile ? (
        // ✅ MOBILE ONLY SHEET
        <div className="fixed top-2 left-4 z-50">
          <Sheet open={openDrawer} onOpenChange={setOpenDrawer}>
            <SheetTrigger
              style={{ boxShadow: "0 10px 20px rgba(0, 0, 0, 0.76)" }}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-400 to-yellow-300 text-red font-semibold hover:from-green-500 hover:to-yellow-600 transition-all duration-300 flex items-center gap-2"
            >
              <Menu className="h-5 w-5 text-white" />
              <span>
                {hasMounted && pathname.includes("/danh-muc")
                  ? selectedName
                  : null}
              </span>
            </SheetTrigger>
            <SheetContent side="left" className="...">
              <SheetHeader>
                <SheetTitle>Danh mục</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-4">
                <button
                  className="flex items-center justify-between ..."
                  onClick={toggleCollapse}
                >
                  <span>Hiển thị danh mục</span>
                  {collapsed ? <ChevronDown /> : <ChevronUp />}
                </button>
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    collapsed ? "max-h-0" : "max-h-[1000px]"
                  }`}
                >
                  <CategoryList />
                </div>
              </div>
              <MobileNavLinks onNavigate={() => setOpenDrawer(false)} />
            </SheetContent>
          </Sheet>
        </div>
      ) : (
        // ✅ DESKTOP ONLY SHEET
        <div className="fixed top-2 left-4 z-50">
          <Sheet open={openDrawer} onOpenChange={setOpenDrawer}>
            <SheetTrigger
              style={{ boxShadow: "0 10px 20px rgba(0, 0, 0, 0.76)" }}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-400 to-yellow-300 text-red font-semibold hover:from-green-500 hover:to-yellow-600 transition-all duration-300 flex items-center gap-2"
            >
              <Menu className="h-5 w-5 text-white" />
              <span>
                {hasMounted && pathname.includes("/danh-muc")
                  ? selectedName
                  : "Danh mục sản phẩm"}
              </span>
            </SheetTrigger>
            <SheetContent side="left" className="...">
              <SheetHeader>
                <SheetTitle>Danh mục</SheetTitle>
              </SheetHeader>
              <CategoryList />
            </SheetContent>
          </Sheet>
        </div>
      )}
    </>
  );
}

const StyledWrapper = styled.div`
  .value {
    font-size: 15px;
    background-color: transparent;
    border: none;
    padding: 10px;
    color: black;
    display: flex;
    position: relative;
    gap: 5px;
    cursor: pointer;
    border-radius: 10px;
    transition: 1s;
    box-sizing: border-box;
  }

  .value:not(:active):hover,
  .value:focus {
    display: flex;
    box-sizing: border-box;
    color: rgba(53, 191, 71, 0.98);
  }

  .value.active {
    background-color: rgba(53, 191, 71, 0.98);
    color: white;
    margin-left: 17px;
  }

  .value::before {
    content: "";
    position: absolute;
    top: 5px;
    left: -15px;
    width: 5px;
    height: 80%;
    background-color: #2f81f7;
    border-radius: 5px;
    opacity: 0;
    transition: 1s;
  }

  .value.active::before {
    opacity: 1;
  }

  .value svg {
    width: 20px;
  }
`;
