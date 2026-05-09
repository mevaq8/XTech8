import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CubePlaceholder from "./CubePlaceholder";
import AddToCartButton from "./AddToCartButton";
import type { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(15,23,42,0.1)]">
          <div className="relative aspect-[4/3] bg-slate-50 flex items-center justify-center overflow-hidden">
            {product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-3/5 h-3/5 transition-transform duration-300 group-hover:scale-105">
                <CubePlaceholder />
              </div>
            )}
          </div>
          <div className="p-4">
            <p className="text-[11px] font-medium text-secondary uppercase tracking-wider mb-1 font-inter">
              {product.categoryName}
            </p>
            <h3 className="font-sora font-semibold text-primary text-sm leading-tight mb-2 line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h3>
            <p className="text-xs text-slate-500 font-inter mb-3 line-clamp-1">
              {product.shortDescription || "XTech IT Store mehsulu"}
            </p>
            <div className="flex items-center justify-between gap-3">
              <div className="font-sora">
                {product.salePrice ? (
                  <span className="block text-xs font-medium text-slate-400 line-through">
                    {product.regularPrice.toLocaleString("az-AZ")} AZN
                  </span>
                ) : null}
                <span className="font-bold text-primary text-base">
                  {product.price.toLocaleString("az-AZ")} <span className="text-sm font-medium text-slate-400">AZN</span>
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
