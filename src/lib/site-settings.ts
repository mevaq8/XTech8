import type { Json } from "@/lib/database.types";

export type SettingValue = Json;
export type SettingMap = Record<string, SettingValue>;

export interface SettingField {
  key: string;
  label: string;
  type: "text" | "textarea" | "url" | "email" | "tel";
  defaultValue: string;
  placeholder?: string;
}

export interface SettingSection {
  title: string;
  fields: SettingField[];
}

export const SETTING_SECTIONS: SettingSection[] = [
  {
    title: "Footer",
    fields: [
      {
        key: "footer_text",
        label: "Footer mətni",
        type: "textarea",
        defaultValue: "© 2026 XTech. Bütün hüquqlar qorunur.",
        placeholder: "© 2026 XTech. Bütün hüquqlar qorunur.",
      },
      {
        key: "footer_logo",
        label: "Footer loqo URL",
        type: "url",
        defaultValue: "",
        placeholder: "https://...",
      },
    ],
  },
  {
    title: "Əlaqə məlumatları",
    fields: [
      {
        key: "contact_phone",
        label: "Əlaqə nömrəsi (WhatsApp)",
        type: "tel",
        defaultValue: "+994503201156",
        placeholder: "+994501234567",
      },
      {
        key: "contact_email",
        label: "Email",
        type: "email",
        defaultValue: "info@xtech.az",
        placeholder: "info@xtech.az",
      },
      {
        key: "contact_address",
        label: "Ünvan",
        type: "text",
        defaultValue: "Bakı, Azərbaycan",
        placeholder: "Bakı şəhəri, Nizami rayonu...",
      },
    ],
  },
  {
    title: "Sosial media linkləri",
    fields: [
      {
        key: "social_instagram",
        label: "Instagram",
        type: "url",
        defaultValue: "https://instagram.com",
        placeholder: "https://instagram.com/xtech.az",
      },
      {
        key: "social_facebook",
        label: "Facebook",
        type: "url",
        defaultValue: "https://facebook.com",
        placeholder: "https://facebook.com/xtech.az",
      },
      {
        key: "social_tiktok",
        label: "TikTok / Telegram",
        type: "url",
        defaultValue: "",
        placeholder: "https://tiktok.com/@xtech.az",
      },
    ],
  },
];

export const SETTING_FIELD_KEYS = new Set(SETTING_SECTIONS.flatMap((section) => section.fields.map((field) => field.key)));

export function settingToString(value: SettingValue | undefined, defaultValue = "") {
  if (value === undefined || value === null) return defaultValue;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value, null, 2);
}

export function readSetting(settings: SettingMap, key: string, defaultValue = "") {
  return settingToString(settings[key], defaultValue);
}

export function parseSettingInput(value: string): SettingValue {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (
    trimmed === "true" ||
    trimmed === "false" ||
    trimmed === "null" ||
    trimmed.startsWith("{") ||
    trimmed.startsWith("[")
  ) {
    try {
      return JSON.parse(trimmed) as SettingValue;
    } catch {
      return value;
    }
  }

  return value;
}

export function normalizePhoneForLink(phone: string) {
  return phone.replace(/[^\d+]/g, "").replace(/^\+/, "");
}
