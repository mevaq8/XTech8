import CubePlaceholder from "@/components/shared/CubePlaceholder";
import type { Product } from "@/types";

export default function ProductGallery({ product }: { product: Product }) {
  const primaryImage = product.images[0];

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 md:p-6 flex items-center justify-center aspect-square md:aspect-auto md:min-h-[500px] overflow-hidden">
      {primaryImage ? (
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-contain rounded-xl"
        />
      ) : (
        <div className="w-3/5 max-w-[280px]">
          <CubePlaceholder />
        </div>
      )}
    </div>
  );
}
