import { Product } from "./product";

export interface OrderItem {
  product_id: number;
  order_id: number;
  qty: number;
  unit_price: number;
  total_price: number;
  product: Product;
}

export interface Order {
  id: number;
  created_date: string;
  order_status_id: number;
  staff_id: number | null;
  customer_id: number;
  shipping_fullname: string;
  shipping_mobile: string;
  payment_method: string;
  shipping_ward_id: string;
  shipping_housenumber_street: string;
  shipping_fee: number;
  delivered_date: string;
  order_items: OrderItem[];
  status_description: string;
  ward_name: string;
  province_name: string;
}
