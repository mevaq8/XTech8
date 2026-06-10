import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, Image as ImageIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { emitBannerRefresh } from "@/lib/catalog-events";
import type { Banner, Toast } from "@/lib/types";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { StatusToggle } from "@/components/admin/StatusToggle";

interface OutletContext {
  addToast: (message: string, type: Toast["type"]) => void;
}

export function Banners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<Banner | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useOutletContext<OutletContext>();

  useEffect(() => {
    void fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("banners")
      .select()
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    setBanners((data as Banner[]) || []);
    setLoading(false);
  };

  const saveSortOrder = async (nextBanners: Banner[]) => {
    setBanners(nextBanners);

    const updates = nextBanners.map((banner, index) =>
      supabase
        .from("banners")
        .update({ sort_order: (index + 1) * 10 } as never)
        .eq("id", banner.id)
    );

    const results = await Promise.all(updates);
    if (results.some(({ error }) => error)) {
      addToast("Siralama yenilenmedi", "error");
      void fetchBanners();
      return;
    }

    addToast("Siralama yenilendi", "success");
    emitBannerRefresh();
  };

  const moveBanner = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const nextBanners = [...banners];
    const [movedBanner] = nextBanners.splice(index, 1);
    nextBanners.splice(targetIndex, 0, movedBanner);
    void saveSortOrder(nextBanners);
  };

  const toggleStatus = async (banner: Banner) => {
    const { error } = await supabase
      .from("banners")
      .update({ is_active: !banner.is_active } as never)
      .eq("id", banner.id);

    if (error) {
      addToast("Status yenilenmedi", "error");
      return;
    }

    setBanners((prev) =>
      prev.map((item) => (item.id === banner.id ? { ...item, is_active: !item.is_active } : item))
    );
    addToast("Status yenilendi", "success");
    emitBannerRefresh();
  };

  const handleDelete = async () => {
    if (!deleteModal) return;

    setDeleteLoading(true);
    const { error } = await supabase.from("banners").delete().eq("id", deleteModal.id);
    setDeleteLoading(false);

    if (error) {
      addToast("Banner silinmedi", "error");
      return;
    }

    setBanners((prev) => prev.filter((banner) => banner.id !== deleteModal.id));
    setDeleteModal(null);
    addToast("Banner silindi", "success");
    emitBannerRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Bannerler</h2>
          <p className="text-sm text-slate-500 mt-1">Ana sehife slider bannerlerini idare edin.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/admin/banners/new")}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Yeni banner
        </motion.button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex gap-4 overflow-x-auto p-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="min-w-[280px] h-64 rounded-xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : banners.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <ImageIcon className="w-12 h-12 text-slate-300" />
            <p className="mt-4 text-sm">Banner tapilmadi</p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto p-5">
            {banners.map((banner, index) => (
              <motion.div
                key={banner.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className="min-w-[290px] max-w-[320px] rounded-xl border border-slate-200 bg-white overflow-hidden"
              >
                <div className="aspect-[16/9] bg-slate-100 overflow-hidden">
                  {banner.image_url ? (
                    <img src={banner.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-9 h-9 text-slate-300" />
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider mb-1">
                      {banner.category || "Kateqoriya yoxdur"}
                    </p>
                    <h3 className="font-semibold text-slate-900 line-clamp-1">{banner.title || "Sekilli banner"}</h3>
                    {banner.subtitle && <p className="text-sm text-slate-500 line-clamp-2 mt-1">{banner.subtitle}</p>}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StatusToggle isActive={banner.is_active} onChange={() => toggleStatus(banner)} />
                      <span className="text-xs text-slate-500">{banner.is_active ? "Aktiv" : "Deaktiv"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveBanner(index, -1)}
                        disabled={index === 0}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                        aria-label="Yuxari tasi"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBanner(index, 1)}
                        disabled={index === banners.length - 1}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                        aria-label="Asagi tasi"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/banners/${banner.id}/edit`)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                      <Pencil className="w-4 h-4" />
                      Redakte et
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteModal(banner)}
                      className="inline-flex items-center justify-center p-2.5 rounded-lg border border-red-100 text-red-600 hover:bg-red-50"
                      aria-label="Banneri sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteModal}
        title="Banneri sil"
        message={`"${deleteModal?.title || "Sekilli banner"}" bannerini silmek istediyinize eminsiniz?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal(null)}
        isLoading={deleteLoading}
      />
    </div>
  );
}
