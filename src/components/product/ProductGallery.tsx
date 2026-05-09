import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CubePlaceholder from "@/components/shared/CubePlaceholder";
import type { Product } from "@/types";

export default function ProductGallery({ product }: { product: Product }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = product.images;
  const hasImages = images.length > 0;
  const activeImage = hasImages ? images[activeIndex] : null;

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 md:p-6 flex items-center justify-center aspect-square md:aspect-auto md:min-h-[500px] overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeImage ? (
            <motion.img
              key={activeIndex}
              src={activeImage}
              alt={`${product.name} - ${activeIndex + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full object-contain rounded-xl"
            />
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-3/5 max-w-[280px]"
            >
              <CubePlaceholder />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Thumbnails - only show if more than 1 image */}
      {images.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                activeIndex === index
                  ? "border-accent shadow-[0_0_10px_rgba(34,197,94,0.2)]"
                  : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`${product.name} - thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {activeIndex === index && (
                <div className="absolute inset-0 ring-2 ring-accent/30 rounded-xl" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
