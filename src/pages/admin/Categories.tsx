import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Tags,
  X,
  Loader2,
  Upload,
  ImageIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Category, Product, Toast } from "@/lib/types";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { StatusToggle } from "@/components/admin/StatusToggle";
import { generateSlug } from "@/lib/utils";
import { emitCatalogRefresh } from "@/lib/catalog-events";

interface OutletContext {
  addToast: (message: string, type: Toast["type"]) => void;
}

const ICON_BUCKET = "category-icons";
const ICON_FOLDER = "categories";

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteModal, setDeleteModal] = useState<Category | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState("Tag");
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [iconUploading, setIconUploading] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { addToast } = useOutletContext<OutletContext>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: c } = await supabase
      .from("categories")
      .select()
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    const { data: p } = await supabase.from("products").select();
    setCategories((c as Category[]) || []);
    setProducts((p as Product[]) || []);
    setLoading(false);
  };

  const getProductCount = (categoryId: string) => {
    return products.filter((p) => p.category_id === categoryId).length;
  };

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setName(category.name);
      setSlug(category.slug);
      setIcon(category.icon);
      setIconUrl(category.icon_url ?? null);
      setSortOrder(category.sort_order);
      setIsActive(category.is_active);
      setSlugManuallyEdited(true);
    } else {
      setEditingCategory(null);
      setName("");
      setSlug("");
      setIcon("Tag");
      setIconUrl(null);
      setSortOrder(categories.length > 0 ? Math.max(...categories.map((c) => c.sort_order)) + 10 : 10);
      setIsActive(true);
      setSlugManuallyEdited(false);
    }
    setModalOpen(true);
  };

  const handleIconUpload = async (file: File) => {
    if (!file) return;
    setIconUploading(true);

    const ext = file.name.split(".").pop() || "png";
    const path = `${ICON_FOLDER}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(ICON_BUCKET)
      .upload(path, file);

    if (uploadError) {
      addToast("İkon yüklənmədi", "error");
      setIconUploading(false);
      return;
    }

    const { data } = supabase.storage.from(ICON_BUCKET).getPublicUrl(path);
    if (data?.publicUrl) {
      // Delete old icon if replacing
      if (iconUrl && editingCategory) {
        const oldPath = iconUrl.split(`${ICON_BUCKET}/`).pop();
        if (oldPath) {
          await supabase.storage.from(ICON_BUCKET).remove([oldPath]);
        }
      }
      setIconUrl(data.publicUrl);
      addToast("İkon yükləndi", "success");
    }

    setIconUploading(false);
  };

  const handleIconDelete = async () => {
    if (!iconUrl) return;
    const path = iconUrl.split(`${ICON_BUCKET}/`).pop();
    if (path) {
      await supabase.storage.from(ICON_BUCKET).remove([path]);
    }
    setIconUrl(null);
    addToast("İkon silindi", "success");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      addToast("Bütün sahələri doldurun", "error");
      return;
    }

    setFormLoading(true);

    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      icon,
      icon_url: iconUrl,
      sort_order: sortOrder,
      is_active: isActive,
    };

    if (editingCategory) {
      const { error } = await supabase.from("categories").update(payload as never).eq("id", editingCategory.id);
      if (error) {
        addToast("Kateqoriya yenilənmədi", "error");
        setFormLoading(false);
        return;
      }
      addToast("Kateqoriya yeniləndi", "success");
    } else {
      const { error } = await supabase.from("categories").insert([payload] as never);
      if (error) {
        addToast("Kateqoriya əlavə olunmadı", "error");
        setFormLoading(false);
        return;
      }
      addToast("Kateqoriya əlavə edildi", "success");
    }

    setFormLoading(false);
    setModalOpen(false);
    emitCatalogRefresh();
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleteModal) return;

    const count = getProductCount(deleteModal.id);
    if (count > 0) {
      addToast(`Bu kateqoriyaya aid ${count} məhsul var. Əvvəlcə məhsulları silin.`, "error");
      setDeleteModal(null);
      return;
    }

    // Delete icon from storage if exists
    if (deleteModal.icon_url) {
      const path = deleteModal.icon_url.split(`${ICON_BUCKET}/`).pop();
      if (path) {
        await supabase.storage.from(ICON_BUCKET).remove([path]);
      }
    }

    setDeleteLoading(true);
    const { error } = await supabase.from("categories").delete().eq("id", deleteModal.id);
    setDeleteLoading(false);

    if (error) {
      addToast("Kateqoriya silinmədi", "error");
      return;
    }

    setDeleteModal(null);
    addToast("Kateqoriya silindi", "success");
    emitCatalogRefresh();
    fetchData();
  };

  const toggleStatus = async (category: Category) => {
    const { error } = await supabase
      .from("categories")
      .update({ is_active: !category.is_active } as never)
      .eq("id", category.id);

    if (error) {
      addToast("Status yenilənmədi", "error");
      return;
    }

    setCategories((prev) =>
      prev.map((c) => (c.id === category.id ? { ...c, is_active: !c.is_active } : c))
    );
    addToast("Status yeniləndi", "success");
    emitCatalogRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Yeni kateqoriya
        </motion.button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <DataTable
          columns={[
            { key: "name", header: "Ad" },
            { key: "slug", header: "Slug" },
            { key: "sort_order", header: "Sira", render: (c) => c.sort_order },
            {
              key: "icon",
              header: "İkon",
              render: (c) =>
                c.icon_url ? (
                  <img src={c.icon_url} alt={c.name} className="w-6 h-6 object-contain rounded" />
                ) : (
                  <span className="text-slate-400 text-xs">—</span>
                ),
            },
            { key: "count", header: "Məhsul sayı", render: (c) => getProductCount(c.id) },
            {
              key: "status",
              header: "Status",
              render: (c) => <StatusToggle isActive={c.is_active} onChange={() => toggleStatus(c)} />,
            },
            {
              key: "actions",
              header: "",
              width: "100px",
              render: (c) => (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openModal(c)}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteModal(c)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ),
            },
          ]}
          data={categories}
          loading={loading}
          keyExtractor={(c) => c.id}
          emptyIcon={<Tags className="w-12 h-12 text-slate-300" />}
          emptyText="Kateqoriya tapılmadı"
        />
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">
                  {editingCategory ? "Kateqoriyanı redaktə et" : "Yeni kateqoriya"}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Ad *</label>
                  <input
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!slugManuallyEdited) {
                        setSlug(generateSlug(e.target.value));
                      }
                    }}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-sm"
                    placeholder="Kateqoriya adı"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Slug *</label>
                  <input
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setSlugManuallyEdited(true);
                    }}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-sm"
                    placeholder="kateqoriya-slug"
                    required
                  />
                </div>

                {/* Icon Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">İkon</label>
                  <div className="flex items-center gap-3">
                    {iconUrl ? (
                      <div className="relative group">
                        <img
                          src={iconUrl}
                          alt="Preview"
                          className="w-12 h-12 object-contain rounded-lg border border-slate-200 bg-slate-50"
                        />
                        <button
                          type="button"
                          onClick={handleIconDelete}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                          title="İkonu sil"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-slate-400" />
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/svg+xml,image/png,image/webp,image/jpeg"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleIconUpload(file);
                        if (e.target) e.target.value = "";
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={iconUploading}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                      {iconUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      {iconUploading ? "Yüklənir..." : iconUrl ? "İkonu dəyiş" : "İkon yüklə"}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    SVG, PNG, WEBP (max 2MB). İkon mecburi deyil.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Lucide ikon adı (fallback)
                  </label>
                  <input
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-sm"
                    placeholder="Məsələn: Laptop, Printer, Monitor"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Sıra nömrəsi</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-sm"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <StatusToggle
                    isActive={isActive}
                    onChange={(active) => { setIsActive(active); return Promise.resolve(); }}
                  />
                  <span className="text-sm text-slate-600">{isActive ? "Aktiv" : "Deaktiv"}</span>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors text-sm font-medium"
                  >
                    Ləğv et
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading || iconUploading}
                    className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                  >
                    {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {formLoading ? "Yadda saxlanır..." : "Yadda saxla"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={!!deleteModal}
        title="Kateqoriyanı sil"
        message={`"${deleteModal?.name}" kateqoriyasını silmək istədiyinizə əminsiniz?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal(null)}
        isLoading={deleteLoading}
      />
    </div>
  );
}
