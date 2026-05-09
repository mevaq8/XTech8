import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, Tags, AlertTriangle, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { Product, Category } from "@/lib/types";
import { StatCard } from "@/components/admin/StatCard";
import { DataTable } from "@/components/admin/DataTable";
import { formatPrice } from "@/lib/utils";

export function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { data: p } = await supabase.from("products").select();
      const { data: c } = await supabase.from("categories").select();
      setProducts((p as Product[]) || []);
      setCategories((c as Category[]) || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const lowStockProducts = products.filter((p) => p.stock < 5);

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return "-";
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.name || "-";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <StatCard
          title="Ümumi məhsul sayı"
          value={products.length}
          subtitle="Məhsul"
          icon={Package}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
          delay={0}
        />
        <StatCard
          title="Ümumi kateqoriya sayı"
          value={categories.length}
          subtitle="Kateqoriya"
          icon={Tags}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          delay={0.1}
        />
        <StatCard
          title="Stokda bitmək üzrə olanlar"
          value={lowStockProducts.length}
          subtitle="Stok < 5"
          icon={AlertTriangle}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          delay={0.2}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-white rounded-xl border border-slate-200 shadow-sm"
      >
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Təcili diqqət tələb edən məhsullar</h2>
        </div>

        <DataTable
          columns={[
            { key: "name", header: "Məhsul adı" },
            { key: "category", header: "Kateqoriya", render: (p) => getCategoryName(p.category_id) },
            { key: "stock", header: "Qalan stok", render: (p) => (
              <span className={`font-medium ${p.stock === 0 ? "text-red-500" : p.stock < 3 ? "text-amber-500" : "text-slate-700"}`}>
                {p.stock}
              </span>
            )},
            { key: "price", header: "Qiymət", render: (p) => formatPrice(p.price) },
            { key: "actions", header: "", width: "60px", render: (p) => (
              <button
                onClick={() => navigate(`/admin/products/${p.slug}/edit`)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )},
          ]}
          data={lowStockProducts}
          loading={loading}
          keyExtractor={(p) => p.id}
          emptyIcon={<AlertTriangle className="w-12 h-12 text-slate-300" />}
          emptyText="Hazırda stokda bitmək üzrə olan məhsul yoxdur"
        />
      </motion.div>
    </div>
  );
}
