import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CubePlaceholder from "./CubePlaceholder";
import AddToCartButton from "./AddToCartButton";
import type { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  const specsLine = Object.entries(product.specs)
    .slice(0, 3)
    .map(([key, value]) => `${key}: ${value}`)
    .join(" / ");

  const hasDiscount = product.salePrice && product.salePrice < product.regularPrice;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="group h-full"
    >
      <Link to={`/product/${product.slug}`} className="block h-full">
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-100 bg-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
          {/* Image wrapper with aspect ratio and contain */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-[#f8fafc] p-4">
            {product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                loading="lazy"
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement("div");
                    fallback.className = "flex h-full w-full items-center justify-center";
                    fallback.innerHTML = `<span class="text-xs text-slate-400 font-inter text-center">${product.name}</span>`;
                    parent.appendChild(fallback);
                  }
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="w-3/5 h-3/5">
                  <CubePlaceholder />
                </div>
              </div>
            )}

            {/* Discount badge */}
            {hasDiscount && (
              <div className="absolute top-3 right-3 rounded-md bg-accent px-2 py-1 text-xs font-semibold text-white">
                -{Math.round((1 - product.salePrice! / product.regularPrice) * 100)}%
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col p-4">
            <p className="mb-1 font-inter text-[11px] font-medium uppercase tracking-[0.5px] text-secondary">
              {product.categoryName}
            </p>
            <h3 className="mb-1 min-h-[40px] font-sora text-[15px] font-semibold leading-snug text-primary line-clamp-2">
              {product.name}
            </h3>
            <p className="mb-2 truncate font-inter text-[13px] text-slate-500">
              {specsLine || product.shortDescription || "XTech IT Store məhsulu"}
            </p>
            <div className="mt-auto">
              <div className="mb-2 font-sora">
                {hasDiscount && (
                  <span className="mb-0.5 block text-[13px] font-medium text-slate-400 line-through">
                    {product.regularPrice.toLocaleString("az-AZ")} AZN
                  </span>
                )}
                <span className="inline-flex items-baseline gap-1 text-[18px] font-bold leading-none text-primary">
                  <span>{product.price.toLocaleString("az-AZ")}</span>
                  <span>AZN</span>
                </span>
              </div>
              <AddToCartButton product={product} size="sm" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
