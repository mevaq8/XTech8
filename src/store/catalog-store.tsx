import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { onCatalogRefresh } from "@/lib/catalog-events";
import type { Category as AdminCategory, Product as AdminProduct } from "@/lib/types";
import type { Product } from "@/types";

interface CatalogContextType {
  products: Product[];
  categories: { slug: string; name: string }[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const CatalogContext = createContext<CatalogContextType | null>(null);

function normalizeSpecs(specs: unknown) {
  if (!specs || typeof specs !== "object" || Array.isArray(specs)) return {};

  return Object.fromEntries(
    Object.entries(specs as Record<string, unknown>)
      .map(([key, value]) => [key.trim(), String(value ?? "").trim()])
      .filter(([key, value]) => key && value)
  );
}

function mapProduct(product: AdminProduct, categories: AdminCategory[]): Product {
  const category = categories.find((item) => item.id === product.category_id);
  const price = Number(product.sale_price ?? product.price);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: category?.slug ?? "uncategorized",
    categoryName: category?.name ?? "Kateqoriyasız",
    price,
    regularPrice: Number(product.price),
    salePrice: product.sale_price === null ? null : Number(product.sale_price),
    stock: product.stock,
    specs: normalizeSpecs(product.specs),
    description: product.description ?? "",
    shortDescription: product.short_desc ?? "",
    images: product.images ?? [],
  };
}

function buildCategories(databaseCategories: AdminCategory[]) {
  const allCategory = { slug: "all", name: "Butun mehsullar" };

  const databaseItems = [...databaseCategories]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((category) => ({ slug: category.slug, name: category.name }));

  return [allCategory, ...databaseItems];
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [databaseProducts, setDatabaseProducts] = useState<AdminProduct[]>([]);
  const [databaseCategories, setDatabaseCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);

    const [{ data: productRows, error: productError }, { data: categoryRows, error: categoryError }] =
      await Promise.all([
        supabase.from("products").select().eq("is_active", true).gt("stock", 0).order("created_at", { ascending: false }),
        supabase
          .from("categories")
          .select()
          .eq("is_active", true)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true }),
      ]);

    if (productError || categoryError) {
      setError("Məhsullar yüklənmədi. Bir az sonra yenidən yoxlayın.");
      setDatabaseProducts([]);
      setDatabaseCategories([]);
      setLoading(false);
      return;
    }

    setDatabaseProducts((productRows as AdminProduct[]) ?? []);
    setDatabaseCategories((categoryRows as AdminCategory[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();

    const removeLocalListener = onCatalogRefresh(() => {
      void refresh();
    });

    const channel = supabase
      .channel("xtech-catalog-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
        void refresh();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, () => {
        void refresh();
      })
      .subscribe();

    return () => {
      removeLocalListener();
      void supabase.removeChannel(channel);
    };
  }, [refresh]);

  const products = useMemo(
    () => databaseProducts.map((product) => mapProduct(product, databaseCategories)),
    [databaseProducts, databaseCategories]
  );

  const categories = useMemo(() => buildCategories(databaseCategories), [databaseCategories]);

  return (
    <CatalogContext.Provider value={{ products, categories, loading, error, refresh }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) throw new Error("useCatalog must be used within CatalogProvider");
  return context;
}
