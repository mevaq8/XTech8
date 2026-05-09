import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  PackageX,
  Image as ImageIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Product, Category, Toast } from "@/lib/types";
import { DataTable } from "@/components/admin/DataTable";
import { StatusToggle } from "@/components/admin/StatusToggle";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { formatPrice } from "@/lib/utils";
import { emitCatalogRefresh } from "@/lib/catalog-events";

interface OutletContext {
  addToast: (message: string, type: Toast["type"]) => void;
}

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [deleteModal, setDeleteModal] = useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const navigate = useNavigate();
  const { addToast } = useOutletContext<OutletContext>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: p } = await supabase.from("products").select().order("created_at", { ascending: false });
    const { data: c } = await supabase.from("categories").select();
    setProducts((p as Product[]) || []);
    setCategories((c as Category[]) || []);
    setLoading(false);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? p.category_id === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return "-";
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.name || "-";
  };

  const toggleStatus = async (product: Product) => {
    const { error } = await supabase
      .from("products")
      .update({ is_active: !product.is_active } as never)
      .eq("id", product.id);

    if (error) {
      addToast("Status yenilənmədi", "error");
      return;
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, is_active: !p.is_active } : p))
    );
    addToast("Status yeniləndi", "success");
    emitCatalogRefresh();
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleteLoading(true);
    const { error } = await supabase.from("products").delete().eq("id", deleteModal.id);
    setDeleteLoading(false);

    if (error) {
      addToast("Məhsul silinmədi", "error");
      return;
    }

    setProducts((prev) => prev.filter((p) => p.id !== deleteModal.id));
    setDeleteModal(null);
    addToast("Məhsul silindi", "success");
    emitCatalogRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Məhsul axtar..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-sm"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-sm bg-white"
          >
            <option value="">Bütün kateqoriyalar</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/admin/products/new")}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Yeni məhsul
        </motion.button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <DataTable
          columns={[
            {
              key: "image",
              header: "Şəkil",
              width: "70px",
              render: (p) => (
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
                  {p.images && p.images.length > 0 ? (
                    <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-slate-300" />
                  )}
                </div>
              ),
            },
            { key: "name", header: "Ad" },
            { key: "category", header: "Kateqoriya", render: (p) => getCategoryName(p.category_id) },
            {
              key: "price",
              header: "Qiymət",
              render: (p) => (
                <div>
                  {p.sale_price ? (
                    <div className="flex items-center gap-2">
                      <span className="line-through text-slate-400 text-xs">{formatPrice(p.price)}</span>
                      <span className="text-emerald-600 font-medium">{formatPrice(p.sale_price)}</span>
                    </div>
                  ) : (
                    <span>{formatPrice(p.price)}</span>
                  )}
                </div>
              ),
            },
            { key: "stock", header: "Stok", render: (p) => (
              <span className={`font-medium ${p.stock < 5 ? "text-amber-500" : "text-slate-700"}`}>{p.stock}</span>
            )},
            {
              key: "status",
              header: "Status",
              render: (p) => (
                <StatusToggle isActive={p.is_active} onChange={() => toggleStatus(p)} />
              ),
            },
            {
              key: "actions",
              header: "",
              width: "100px",
              render: (p) => (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => navigate(`/admin/products/${p.slug}/edit`)}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteModal(p)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ),
            },
          ]}
          data={paginatedProducts}
          loading={loading}
          keyExtractor={(p) => p.id}
          emptyIcon={<PackageX className="w-12 h-12 text-slate-300" />}
          emptyText="Məhsul tapılmadı"
        />

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              {filteredProducts.length} məhsuldan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50"
              >
                Əvvəlki
              </button>
              <span className="text-sm text-slate-600 px-2">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50"
              >
                Növbəti
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteModal}
        title="Məhsulu sil"
        message={`"${deleteModal?.name}" məhsulunu silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal(null)}
        isLoading={deleteLoading}
      />
    </div>
  );
}
