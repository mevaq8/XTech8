import { useCart } from "@/store/cart-store";
import type { Product } from "@/types";

export default function AddToCartButton({ product, size = "md" }: { product: Product; size?: "sm" | "md" | "lg" }) {
  const { add } = useCart();

  const sizeClasses = {
    sm: "w-full h-9 px-3 text-xs",
    md: "w-full h-10 px-4 text-sm",
    lg: "w-full h-11 px-5 text-base",
  };

  const iconClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        add(product);
      }}
      className={`
        ${sizeClasses[size]}
        font-inter font-medium
        bg-accent text-white
        rounded-lg
        transition-all duration-200
        hover:bg-[#16A34A] hover:shadow-[0_0_14px_rgba(34,197,94,0.3)]
        active:scale-[0.97]
        cursor-pointer
        group/cart inline-flex items-center justify-center gap-2 whitespace-nowrap
      `}
    >
      <svg className={`${iconClasses[size]} transition-transform duration-200 group-hover/cart:translate-x-1`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      Səbətə at
    </button>
  );
}
