import type { CartItem } from "@/types";
import { normalizePhoneForLink } from "@/lib/site-settings";

export function generateWhatsAppUrl(cartItems: CartItem[], total: number, phone = "+994503201156"): string {
  const lines = cartItems.map((item) => {
    const itemTotal = item.product.price * item.quantity;
    return `• ${item.product.name} — ${item.quantity} ədəd — ${itemTotal} AZN`;
  });

  const text = [
    "Salam, XTech-dən sifariş vermək istəyirəm.",
    "",
    "Səbətim:",
    ...lines,
    "",
    `Ümumi məbləğ: ${total} AZN`,
    "",
    "Zəhmət olmasa, sifarişimi təsdiq edin.",
  ].join("\n");

  return `https://wa.me/${normalizePhoneForLink(phone)}?text=${encodeURIComponent(text)}`;
}
