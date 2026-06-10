import { motion } from "framer-motion";
import ProductCard from "@/components/shared/ProductCard";
import { useCatalog } from "@/store/catalog-store";

function OfferSkeleton() {
  return (
    <div className="min-w-[220px] rounded-2xl border border-slate-100 bg-white overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-slate-100" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-20 bg-slate-100 rounded" />
        <div className="h-4 w-full bg-slate-100 rounded" />
        <div className="h-3 w-2/3 bg-slate-100 rounded" />
      </div>
    </div>
  );
}

export default function SuperOffers() {
  const { products, loading } = useCatalog();
  const offers = products.filter((product) => product.isSuperOffer);

  if (!loading && offers.length === 0) return null;

  return (
    <section className="py-8 bg-bg">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <p className="font-inter text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 mb-2">
              XTech secimi
            </p>
            <h2 className="font-sora text-2xl sm:text-3xl font-bold text-primary">Super Təkliflər</h2>
          </div>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <OfferSkeleton key={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {offers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
