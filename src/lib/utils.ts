import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(text: string): string {
  const azMap: Record<string, string> = {
    ə: "e", Ə: "E",
    ç: "c", Ç: "C",
    ğ: "g", Ğ: "G",
    ı: "i", I: "I",
    İ: "I", i: "i",
    ö: "o", Ö: "O",
    ş: "s", Ş: "S",
    ü: "u", Ü: "U",
  };

  return text
    .split("")
    .map((char) => azMap[char] || char)
    .join("")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("az-AZ", {
    style: "currency",
    currency: "AZN",
    minimumFractionDigits: 2,
  }).format(price);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("az-AZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function shortId(id: string): string {
  return id.slice(0, 8).toUpperCase();
}
