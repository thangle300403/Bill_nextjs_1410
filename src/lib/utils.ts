import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import slugify from "slugify";
import { Product, ProductCard } from "@/types/product";
import axios from "axios";
import { Category } from "@/types/category";
import { Order } from "@/types/order";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatMoney = (money: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(money);
};

export const createLinkProduct = (product: Product): string => {
  const safeName = typeof product.name === "string" ? product.name : "san-pham";
  return `/san-pham/${slugify(safeName)}-${product.id}`;
};

export const createLinkProductCard = (product: ProductCard): string => {
  const safeName = typeof product.name === "string" ? product.name : "san-pham";
  return `/san-pham/${slugify(safeName)}-${product.id}`;
};

export const createLinkOrderDetail = (order: Order): string => {
  return `/tai-khoan/don-hang/chi-tiet-don-hang-${order.id}`;
};

export function extractProductId(slug: string): string {
  const match = slug.match(/-(\d+)$/);
  return match ? match[1] : "";
}

export function getOrderIdFromSlug(slug: string): string | null {
  const match = slug.match(/chi-tiet-don-hang-(\d+)$/);
  return match ? match[1] : null;
}

export const createLinkCategory = (category: Category): string => {
  return `/danh-muc/${slugify(category.name)}-${category.id}`;
};

export const createLinkCategoryFromName = (name: string): string => {
  return `/danh-muc/${slugify(name)}`;
};

export function extractCategoryId(slug: string): string {
  const match = slug.match(/-(\d+)$/);
  return match ? match[1] : "";
}

export const axiosNonAuthInstanceNest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NEST_API_URL,
  withCredentials: false,
});

export const axiosAuthInstanceNode = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NODE_API_URL,
  withCredentials: true,
});

export const axiosNonAuthInstanceNode = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NODE_API_URL,
  withCredentials: false,
});
