import { Category } from "./category";

export interface Product {
  id: number;
  name: string;
  price: number;
  brand: string;
  sale_price: number;
  featured_image: string;
  inventory_qty: number;
  description: string;
  relatedProducts?: Product[];
  avgStar?: number | null;
}

export interface CategoriedProduct {
  categoryName: string;
  category: Category;
  items: Product[];
}

export interface ProductComment {
  star: number;
  // Add other fields if needed
}

export interface Comment {
  id: number;
  product_id: number;
  email: string;
  fullname: string;
  star: number;
  created_date: string; // or Date if parsed
  description: string;
}

export interface RelatedProduct {
  id: number;
  name: string;
  price: number;
  brand: string;
  sale_price: number;
  featured_image: string;
  inventory_qty: number;
  description: string;
  avgStar?: number | null;
}

export type ProductCard = {
  id: number;
  name: string;
  price: number;
  discount: number;
  image: string;
  description: string;
};
