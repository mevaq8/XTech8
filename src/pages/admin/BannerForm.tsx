import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { emitBannerRefresh } from "@/lib/catalog-events";
import type { Banner, Toast } from "@/lib/types";
import { FormSection } from "@/components/admin/FormSection";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { StatusToggle } from "@/components/admin/StatusToggle";

interface OutletContext {
  addToast: (message: string, type: Toast["type"]) => void;
}

const schema = z.object({
  category: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  link_url: z.string().optional(),
  is_active: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

function emptyToNull(value?: string) {
  const trimmed = value?.trim() ?? "";
  return trimmed ? trimmed : null;
}

export function BannerForm() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { addToast } = useOutletContext<OutletContext>();
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      category: "",
      title: "",
      subtitle: "",
      link_url: "",
      is_active: true,
    },
  });

  const isActive = watch("is_active");

  useEffect(() => {
    const fetchBanner = async () => {
      if (!isEdit || !id) return;

      const { data } = await supabase.from("banners").select().eq("id", id).single();
      if (!data) {
        addToast("Banner tapilmadi", "error");
        navigate("/admin/banners");
        return;
      }

      const banner = data as Banner;
      setValue("category", banner.category || "");
      setValue("title", banner.title || "");
      setValue("subtitle", banner.subtitle || "");
      setValue("link_url", banner.link_url || "");
      setValue("is_active", banner.is_active);
      setImages([banner.image_url]);
      setLoading(false);
    };

    void fetchBanner();
  }, [addToast, id, isEdit, navigate, setValue]);

  const getNextSortOrder = async () => {
    const { data } = await supabase
      .from("banners")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    return (((data as Pick<Banner, "sort_order"> | null)?.sort_order ?? 0) + 10);
  };

  const onSubmit = async (data: FormData) => {
    if (!images[0]) {
      addToast("Banner sekli teleb olunur", "error");
      return;
    }

    setSaving(true);
    const payload = {
      image_url: images[0],
      category: emptyToNull(data.category),
      title: emptyToNull(data.title),
      subtitle: emptyToNull(data.subtitle),
      link_url: emptyToNull(data.link_url),
      is_active: data.is_active,
    };

    if (isEdit && id) {
      const { error } = await supabase.from("banners").update(payload as never).eq("id", id);
      if (error) {
        addToast("Banner yenilenmedi", "error");
        setSaving(false);
        return;
      }
      addToast("Banner yenilendi", "success");
    } else {
      const sortOrder = await getNextSortOrder();
      const { error } = await supabase.from("banners").insert([{ ...payload, sort_order: sortOrder }] as never);
      if (error) {
        addToast("Banner elave olunmadi", "error");
        setSaving(false);
        return;
      }
      addToast("Banner elave edildi", "success");
    }

    setSaving(false);
    emitBannerRefresh();
    navigate("/admin/banners");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <button
        type="button"
        onClick={() => navigate("/admin/banners")}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Bannerlere qayit
      </button>

      <form onSubmit={handleSubmit(onSubmit as never)} className="space-y-6">
        <FormSection title="Banner sekli">
          <ImageUploader
            images={images}
            onChange={setImages}
            bucket="site-assets"
            folder="banners"
            maxFiles={1}
          />
          {!images[0] && <p className="text-xs text-red-500 mt-3">Sekil mutleq yuklenmelidir.</p>}
        </FormSection>

        <FormSection title="Metn melumatlari">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Kateqoriya</label>
              <input
                {...register("category")}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-sm"
                placeholder="Meselen: Yeni kolleksiya"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Link / URL</label>
              <input
                {...register("link_url")}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-sm"
                placeholder="/#products ve ya https://..."
              />
              {errors.link_url && <p className="text-xs text-red-500 mt-1">{errors.link_url.message}</p>}
            </div>
          </div>

          <div className="mt-5">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Basliq</label>
            <input
              {...register("title")}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-sm"
              placeholder="Banner basligi"
            />
          </div>

          <div className="mt-5">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Alt metn</label>
            <textarea
              {...register("subtitle")}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-sm resize-none"
              placeholder="Qisa aciqlama"
            />
          </div>
        </FormSection>

        <FormSection title="Status">
          <div className="flex items-center gap-4">
            <StatusToggle
              isActive={isActive}
              onChange={(active) => {
                setValue("is_active", active);
                return Promise.resolve();
              }}
            />
            <span className="text-sm text-slate-600">{isActive ? "Aktiv" : "Deaktiv"}</span>
          </div>
        </FormSection>

        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/admin/banners")}
            className="px-6 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors font-medium text-sm"
          >
            Legv et
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors font-medium text-sm disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Yadda saxlanir..." : "Yadda saxla"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
