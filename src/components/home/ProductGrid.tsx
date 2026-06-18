import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFilter } from "@/store/filter-store";
import { useCatalog } from "@/store/catalog-store";
import ProductCard from "@/components/shared/ProductCard";
import CategoryIcon from "@/components/shared/CategoryIcon";

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-slate-100 bg-white p-4">
      <div className="aspect-[4/3] rounded-lg bg-slate-100" />
      <div className="space-y-2 pt-3">
        <div className="h-2 w-12 rounded bg-slate-100" />
        <div className="h-3.5 w-full rounded bg-slate-100" />
        <div className="h-3 w-3/4 rounded bg-slate-100" />
        <div className="h-5 w-20 rounded bg-slate-100" />
        <div className="h-9 w-full rounded-lg bg-slate-100" />
      </div>
    </div>
  );
}

export default function ProductGrid() {
  const { searchQuery, activeCategory, setActiveCategory } = useFilter();
  const { products, categories, loading, error } = useCatalog();

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === "all" || p.category === activeCategory;
      const matchesSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, searchQuery, activeCategory]);

  return (
    <section id="products" className="py-7 bg-bg">
      <div className="container-main lg:flex lg:items-start lg:gap-5">
        {/* Desktop sidebar — single source of truth from categories array */}
        <aside className="hidden lg:block lg:w-[220px] lg:shrink-0">
          <nav className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setActiveCategory(cat.slug)}
                className={`flex w-full items-center gap-2.5 rounded-lg border px-3 h-10 text-left text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat.slug
                    ? "border-l-2 border-l-accent bg-accent/5 text-accent"
                    : "border-transparent bg-white text-slate-600 hover:text-accent hover:bg-slate-50"
                }`}
              >
                <CategoryIcon
                  iconUrl={cat.icon_url}
                  name={cat.name}
                  className="h-4 w-4"
                  fallbackClassName="h-4 w-4"
                />
                <span className="truncate">{cat.name}</span>
              </button>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
                  <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <p className="text-slate-500 font-inter text-sm mb-2">{error}</p>
                <p className="text-slate-400 font-inter text-xs">Səhifəni yeniləyin və ya bir az sonra yenidən cəhd edin.</p>
              </motion.div>
            ) : filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                  <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p className="text-slate-400 font-inter text-sm">Məhsul tapılmadı</p>
              </motion.div>
            ) : (
              <motion.div
                key={activeCategory + searchQuery}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              >
                <AnimatePresence>
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
