export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          role?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: string;
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          icon?: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          icon?: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          category_id: string | null;
          price: number;
          sale_price: number | null;
          stock: number;
          short_desc: string | null;
          description: string | null;
          specs: Json;
          images: string[];
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          category_id?: string | null;
          price: number;
          sale_price?: number | null;
          stock?: number;
          short_desc?: string | null;
          description?: string | null;
          specs?: Json;
          images?: string[];
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          category_id?: string | null;
          price?: number;
          sale_price?: number | null;
          stock?: number;
          short_desc?: string | null;
          description?: string | null;
          specs?: Json;
          images?: string[];
          is_active?: boolean;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_name: string;
          customer_phone: string;
          items: Json;
          total_amount: number;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_phone: string;
          items: Json;
          total_amount: number;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          customer_phone?: string;
          items?: Json;
          total_amount?: number;
          note?: string | null;
          created_at?: string;
        };
      };
      settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
