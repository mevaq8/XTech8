import { useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCatalog } from "@/store/catalog-store";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductSpecs from "@/components/product/ProductSpecs";
import RelatedProducts from "@/components/product/RelatedProducts";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { products, loading } = useCatalog();
  const product = products.find((p) => p.slug === slug);

  if (loading) {
    return (
      <main className="min-h-screen bg-bg pt-6 pb-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-accent rounded-full animate-spin" />
      </main>
    );
  }

  if (!product) {
    return <Navigate to="/" replace />;
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-bg pt-4 pb-8 md:pt-6 md:pb-12"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop: tighter two-column layout; mobile: unchanged stacked layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 lg:items-start">
          {/* Gallery — on desktop cap height to avoid excessive space */}
          <div className="lg:sticky lg:top-24">
            <ProductGallery product={product} />
          </div>

          {/* Info + Specs side by side on desktop */}
          <div className="space-y-4">
            <ProductInfo product={product} />
            <ProductSpecs specs={product.specs} />

            {/* Description inline on desktop to avoid extra scroll */}
            {product.description ? (
              <div className="bg-white border border-slate-100 rounded-2xl p-5 lg:p-6">
                <h3 className="font-sora font-semibold text-primary text-base mb-3">Məhsul haqqında</h3>
                <div
                  className="tiptap font-inter text-sm text-slate-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            ) : null}
          </div>
        </div>

        <RelatedProducts currentProduct={product} />
      </div>
    </motion.main>
  );
}
