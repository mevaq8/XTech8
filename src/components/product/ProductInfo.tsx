import { useState } from "react";
import { useCart } from "@/store/cart-store";
import QuantitySelector from "@/components/shared/QuantitySelector";
import type { Product } from "@/types";

export default function ProductInfo({ product }: { product: Product }) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium text-secondary uppercase tracking-wider mb-2 font-inter">
          {product.categoryName}
        </p>
        <h1 className="font-sora font-bold text-2xl md:text-3xl text-primary leading-tight">
          {product.name}
        </h1>
      </div>

      <div className="font-sora">
        {product.salePrice ? (
          <p className="text-base font-medium text-slate-400 line-through mb-1">
            {product.regularPrice.toLocaleString("az-AZ")} AZN
          </p>
        ) : null}
        <p className="font-bold text-3xl text-primary">
          {product.price.toLocaleString("az-AZ")}{" "}
          <span className="text-lg font-medium text-slate-400">AZN</span>
        </p>
      </div>

      {product.shortDescription ? (
        <p className="font-inter text-sm text-slate-600 leading-relaxed">
          {product.shortDescription}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <QuantitySelector quantity={quantity} onChange={setQuantity} />
        <span className="text-sm text-slate-400 font-inter">
          Stokda: {product.stock} eded
        </span>
      </div>

      <button
        onClick={() => {
          for (let i = 0; i < quantity; i++) {
            add(product);
          }
        }}
        className="w-full py-4 bg-accent text-white font-inter font-semibold text-base rounded-xl hover:bg-[#16A34A] hover:shadow-[0_0_30px_rgba(34,197,94,0.35)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
      >
        Sebete elave et
      </button>
    </div>
  );
}
