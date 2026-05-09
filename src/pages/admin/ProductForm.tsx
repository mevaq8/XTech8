import { useEffect, useState } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Product, Category, Toast } from "@/lib/types";
import { generateSlug } from "@/lib/utils";
import { FormSection } from "@/components/admin/FormSection";
import { TipTapEditor } from "@/components/admin/TipTapEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { StatusToggle } from "@/components/admin/StatusToggle";
import { emitCatalogRefresh } from "@/lib/catalog-events";

interface OutletContext {
  addToast: (message: string, type: Toast["type"]) => void;
}

interface SpecRow {
  id: string;
  label: string;
  value: string;
}

const schema = z.object({
  name: z.string().min(1, "Mehsul adi teleb olunur"),
  slug: z.string().min(1, "Slug teleb olunur"),
  category_id: z.preprocess((v) => (v === "" ? null : v), z.string().nullable()),
  price: z.preprocess((v) => (v === "" ? 0 : Number(v)), z.number().min(0, "Qiymet 0-dan boyuk olmalidir")),
  sale_price: z.preprocess((v) => (v === "" || v === null || v === undefined ? null : Number(v)), z.number().min(0).nullable().optional()),
  stock: z.preprocess((v) => (v === "" ? 0 : Number(v)), z.number().min(0, "Stok 0-dan boyuk olmalidir")),
  short_desc: z.string().max(200, "Maksimum 200 simvol").nullable().optional(),
  description: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

function createSpecRow(label = "", value = ""): SpecRow {
  return {
    id: crypto.randomUUID(),
    label,
    value,
  };
}

function specsToRows(specs: unknown): SpecRow[] {
  if (!specs || typeof specs !== "object" || Array.isArray(specs)) {
    return [createSpecRow()];
  }

  const rows = Object.entries(specs as Record<string, unknown>)
    .map(([label, value]) => createSpecRow(label, String(value ?? "")))
    .filter((row) => row.label.trim() || row.value.trim());

  return rows.length > 0 ? rows : [createSpecRow()];
}

function rowsToSpecs(rows: SpecRow[]) {
  return Object.fromEntries(
    rows
      .map((row) => [row.label.trim(), row.value.trim()])
      .filter(([label, value]) => label && value)
  );
}

export function ProductForm() {
  const { slug } = useParams<{ slug?: string }>();
  const isEdit = !!slug;
  const navigate = useNavigate();
  const { addToast } = useOutletContext<OutletContext>();

  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [specRows, setSpecRows] = useState<SpecRow[]>(() => [createSpecRow()]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      name: "",
      slug: "",
      category_id: null,
      price: 0,
      sale_price: null,
      stock: 0,
      short_desc: "",
      description: "",
      is_active: true,
    },
  });

  const nameValue = watch("name");
  const isActive = watch("is_active");

  useEffect(() => {
    if (!slugManuallyEdited && nameValue) {
      setValue("slug", generateSlug(nameValue));
    }
  }, [nameValue, slugManuallyEdited, setValue]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: c } = await supabase
        .from("categories")
        .select()
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      setCategories((c as Category[]) || []);

      if (isEdit && slug) {
        const { data: p } = await supabase.from("products").select().eq("slug", slug).single();
        if (p) {
          const product = p as Product;
          setValue("name", product.name);
          setValue("slug", product.slug);
          setValue("category_id", product.category_id);
          setValue("price", product.price);
          setValue("sale_price", product.sale_price);
          setValue("stock", product.stock);
          setValue("short_desc", product.short_desc);
          setValue("description", product.description);
          setValue("is_active", product.is_active);
          setImages(product.images || []);
          setSpecRows(specsToRows(product.specs));
          setSlugManuallyEdited(true);
        } else {
          addToast("Mehsul tapilmadi", "error");
          navigate("/admin/products");
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [isEdit, slug, setValue, navigate, addToast]);

  const updateSpecRow = (id: string, field: "label" | "value", value: string) => {
    setSpecRows((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const removeSpecRow = (id: string) => {
    setSpecRows((prev) => {
      const next = prev.filter((row) => row.id !== id);
      return next.length > 0 ? next : [createSpecRow()];
    });
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true);

    const { data: existing } = await supabase
      .from("products")
      .select()
      .eq("slug", data.slug)
      .maybeSingle();

    if (existing && (!isEdit || (existing as Product).slug !== slug)) {
      addToast("Bu slug artiq istifade olunub", "error");
      setSaving(false);
      return;
    }

    const payload = {
      ...data,
      specs: rowsToSpecs(specRows),
      images,
      sale_price: data.sale_price || null,
      short_desc: data.short_desc || null,
      description: data.description || null,
    };

    if (isEdit && slug) {
      const { error } = await supabase.from("products").update(payload as never).eq("slug", slug);
      if (error) {
        addToast("Mehsul yenilenmedi", "error");
        setSaving(false);
        return;
      }
      addToast("Mehsul yenilendi", "success");
    } else {
      const { error } = await supabase.from("products").insert([payload] as never);
      if (error) {
        addToast("Mehsul elave olunmadi", "error");
        setSaving(false);
        return;
      }
      addToast("Mehsul elave edildi", "success");
    }

    setSaving(false);
    emitCatalogRefresh();
    navigate("/admin/products");
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
        onClick={() => navigate("/admin/products")}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Mehsullara qayit
      </button>

      <form onSubmit={handleSubmit(onSubmit as never)} className="space-y-6">
        <FormSection title="Esas melumatlar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Mehsul adi *</label>
              <input
                {...register("name")}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-sm"
                placeholder="Meselen: ASUS VivoBook 15"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Slug *</label>
              <input
                {...register("slug")}
                onChange={(e) => {
                  setValue("slug", e.target.value);
                  setSlugManuallyEdited(true);
                }}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-sm"
                placeholder="asus-vivobook-15"
              />
              {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Kateqoriya</label>
              <select
                {...register("category_id")}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-sm bg-white"
              >
                <option value="">Kateqoriya secin</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Qiymet (AZN) *</label>
              <input
                type="number"
                step="0.01"
                {...register("price")}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-sm"
                placeholder="0.00"
              />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Endirimli qiymet (AZN)</label>
              <input
                type="number"
                step="0.01"
                {...register("sale_price")}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-sm"
                placeholder="Bos qala biler"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Stok sayi *</label>
              <input
                type="number"
                {...register("stock")}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-sm"
                placeholder="0"
              />
              {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock.message}</p>}
            </div>
          </div>

          <div className="mt-5">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Qisa tesvir</label>
            <textarea
              {...register("short_desc")}
              rows={3}
              maxLength={200}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-sm resize-none"
              placeholder="Mehsul haqqinda qisa melumat..."
            />
            <p className="text-xs text-slate-400 mt-1">Maksimum 200 simvol</p>
          </div>
        </FormSection>

        <FormSection title="Etrafli tesvir">
          <TipTapEditor
            value={watch("description") || ""}
            onChange={(val) => setValue("description", val)}
            placeholder="Mehsul haqqinda etrafli melumat..."
          />
        </FormSection>

        <FormSection title="Parametrler">
          <div className="space-y-3">
            {specRows.map((row) => (
              <div key={row.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
                <input
                  value={row.label}
                  onChange={(e) => updateSpecRow(row.id, "label", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-sm"
                  placeholder="Parametr adi, meselen RAM"
                />
                <input
                  value={row.value}
                  onChange={(e) => updateSpecRow(row.id, "value", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-sm"
                  placeholder="Deyer, meselen 16GB DDR5"
                />
                <button
                  type="button"
                  onClick={() => removeSpecRow(row.id)}
                  className="h-10 w-10 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center"
                  aria-label="Parametri sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setSpecRows((prev) => [...prev, createSpecRow()])}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Parametr elave et
            </button>
          </div>
        </FormSection>

        <FormSection title="Sekiller">
          <ImageUploader images={images} onChange={setImages} />
        </FormSection>

        <FormSection title="Status">
          <div className="flex items-center gap-4">
            <StatusToggle
              isActive={isActive}
              onChange={(active) => { setValue("is_active", active); return Promise.resolve(); }}
            />
            <span className="text-sm text-slate-600">
              {isActive ? "Aktiv" : "Deaktiv"}
            </span>
          </div>
        </FormSection>

        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
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
