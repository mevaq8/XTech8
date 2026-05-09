import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Save, Image as ImageIcon, X, Plus, Trash2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/lib/supabase";
import type { Setting, Toast } from "@/lib/types";
import type { SettingValue } from "@/lib/site-settings";
import {
  SETTING_FIELD_KEYS,
  SETTING_SECTIONS,
  parseSettingInput,
  settingToString,
} from "@/lib/site-settings";
import { emitSiteSettingsRefresh } from "@/lib/catalog-events";
import { FormSection } from "@/components/admin/FormSection";

interface OutletContext {
  addToast: (message: string, type: Toast["type"]) => void;
}

type SettingInputs = Record<string, string>;

const allSettingFields = SETTING_SECTIONS.flatMap((section) => section.fields);

export function Settings() {
  const [settings, setSettings] = useState<SettingInputs>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const { addToast } = useOutletContext<OutletContext>();

  useEffect(() => {
    void fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("settings").select().order("key", { ascending: true });

    if (error) {
      addToast("Parametrlər yüklənmədi", "error");
      setLoading(false);
      return;
    }

    const nextSettings: SettingInputs = {};
    ((data as Setting[]) || []).forEach((item) => {
      nextSettings[item.key] = settingToString(item.value as SettingValue);
    });

    setSettings(nextSettings);
    setLogoPreview(nextSettings.footer_logo || "");
    setLogoFile(null);
    setLoading(false);
  };

  const getValue = (key: string, defaultValue = "") => settings[key] ?? defaultValue;

  const setValue = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const dynamicKeys = useMemo(
    () => Object.keys(settings).filter((key) => !SETTING_FIELD_KEYS.has(key)).sort((a, b) => a.localeCompare(b)),
    [settings]
  );

  const onDropLogo = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      addToast("Şəkil 5MB-dan böyük ola bilməz", "error");
      return;
    }

    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result as string;
      setLogoPreview(preview);
      setValue("footer_logo", preview);
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropLogo,
    accept: { "image/*": [] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const handleAddCustomSetting = (event: FormEvent) => {
    event.preventDefault();
    const key = newKey.trim();

    if (!key) {
      addToast("Parametr açarı boş ola bilməz", "error");
      return;
    }

    if (!/^[a-zA-Z0-9_.:-]+$/.test(key)) {
      addToast("Açarda yalnız hərf, rəqəm, nöqtə, tire və alt xətt istifadə edin", "error");
      return;
    }

    if (settings[key] !== undefined || SETTING_FIELD_KEYS.has(key)) {
      addToast("Bu parametr artıq mövcuddur", "error");
      return;
    }

    setSettings((prev) => ({ ...prev, [key]: newValue }));
    setNewKey("");
    setNewValue("");
  };

  const handleDeleteCustomSetting = async (key: string) => {
    const { error } = await supabase.from("settings").delete().eq("key", key);

    if (error) {
      addToast("Parametr silinmədi", "error");
      return;
    }

    setSettings((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    addToast("Parametr silindi", "success");
    emitSiteSettingsRefresh();
  };

  const handleSave = async () => {
    setSaving(true);

    let logoUrl = getValue("footer_logo");
    if (logoFile) {
      const ext = logoFile.name.split(".").pop() || "png";
      const path = `logo/footer-logo-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("site-assets").upload(path, logoFile, {
        upsert: true,
      });

      if (uploadError) {
        addToast("Logo yüklənmədi", "error");
        setSaving(false);
        return;
      }

      const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
      logoUrl = data.publicUrl;
    }

    const nextSettings = { ...settings, footer_logo: logoUrl };
    const knownUpdates = allSettingFields.map((field) => ({
      key: field.key,
      value: nextSettings[field.key] ?? field.defaultValue,
    }));
    const customUpdates = Object.entries(nextSettings)
      .filter(([key]) => !SETTING_FIELD_KEYS.has(key))
      .map(([key, value]) => ({ key, value: parseSettingInput(value) }));

    const updates = [...knownUpdates, ...customUpdates].map((item) => ({
      key: item.key,
      value: item.value,
    }));

    const { error } = await supabase.from("settings").upsert(updates as never, { onConflict: "key" });

    if (error) {
      addToast("Parametrlər yenilənmədi", "error");
      setSaving(false);
      return;
    }

    setSettings(nextSettings);
    setLogoPreview(logoUrl);
    setLogoFile(null);
    setSaving(false);
    addToast("Parametrlər yeniləndi", "success");
    emitSiteSettingsRefresh();
    void fetchSettings();
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
      className="max-w-3xl mx-auto space-y-6"
    >
      <FormSection title="Footer üçün Logo">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-emerald-500 bg-emerald-50" : "border-slate-300 hover:border-slate-400"
          }`}
        >
          <input {...getInputProps()} />
          {logoPreview ? (
            <div className="relative inline-block">
              <img src={logoPreview} alt="Logo" className="max-h-24 mx-auto rounded-lg" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLogoPreview("");
                  setLogoFile(null);
                  setValue("footer_logo", "");
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                aria-label="Logonu sil"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <>
              <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-3" />
              <p className="text-sm text-slate-600 font-medium">
                {isDragActive ? "Şəkli buraxın..." : "Logo yükləmək üçün klikləyin və ya sürükləyin"}
              </p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG, SVG (max 5MB)</p>
            </>
          )}
        </div>
      </FormSection>

      {SETTING_SECTIONS.map((section) => (
        <FormSection key={section.title} title={section.title}>
          <div className="space-y-4">
            {section.fields
              .filter((field) => field.key !== "footer_logo")
              .map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{field.label}</label>
                  {field.type === "textarea" ? (
                    <textarea
                      value={getValue(field.key, field.defaultValue)}
                      onChange={(e) => setValue(field.key, e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-sm resize-none"
                      placeholder={field.placeholder}
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={getValue(field.key, field.defaultValue)}
                      onChange={(e) => setValue(field.key, e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-sm"
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}
          </div>
        </FormSection>
      ))}

      <FormSection title="Əlavə parametrlər">
        <div className="space-y-3">
          {dynamicKeys.map((key) => (
            <div key={key} className="grid grid-cols-1 md:grid-cols-[220px_1fr_auto] gap-3">
              <input
                value={key}
                readOnly
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 outline-none text-sm"
              />
              <textarea
                value={settings[key]}
                onChange={(e) => setValue(key, e.target.value)}
                rows={1}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-sm resize-y min-h-10"
              />
              <button
                type="button"
                onClick={() => void handleDeleteCustomSetting(key)}
                className="h-10 w-10 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center"
                aria-label="Parametri sil"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <form onSubmit={handleAddCustomSetting} className="grid grid-cols-1 md:grid-cols-[220px_1fr_auto] gap-3 pt-2">
            <input
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-sm"
              placeholder="məsələn: hero_badge"
            />
            <input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-sm"
              placeholder="Dəyər"
            />
            <button
              type="submit"
              className="h-10 w-10 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center justify-center"
              aria-label="Parametr əlavə et"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>
      </FormSection>

      <div className="flex justify-end pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 text-sm"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          <Save className="w-4 h-4" />
          {saving ? "Yadda saxlanır..." : "Yadda saxla"}
        </motion.button>
      </div>
    </motion.div>
  );
}
