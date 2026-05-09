export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  product_count?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  price: number;
  sale_price: number | null;
  stock: number;
  short_desc: string | null;
  description: string | null;
  specs: Record<string, string>;
  images: string[];
  is_active: boolean;
  created_at: string;
  category?: Category;
}

export interface OrderItem {
  product_id: string;
  name: string;
  qty: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  items: OrderItem[];
  total_amount: number;
  note: string | null;
  created_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: unknown;
  updated_at: string;
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "warning";
}
