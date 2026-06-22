import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
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
  const [filterOpen, setFilterOpen] = useState(false);

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

  const activeCategoryName = categories.find((c) => c.slug === activeCategory)?.name;

  return (
    <>
      <section id="products" className="py-7 bg-bg">
        <div className="container-main lg:flex lg:items-start lg:gap-5">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block lg:w-[240px] lg:shrink-0">
            <nav className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`flex w-full items-center gap-3 rounded-lg border px-4 h-12 text-left text-sm font-semibold transition-all duration-200 ${
                    activeCategory === cat.slug
                      ? "border-l-2 border-l-accent bg-accent/5 text-accent"
                      : "border-transparent bg-white text-slate-600 hover:text-accent hover:bg-slate-50"
                  }`}
                >
                  <CategoryIcon
                    iconUrl={cat.icon_url}
                    name={cat.name}
                    className="h-5 w-5"
                    fallbackClassName="h-5 w-5"
                  />
                  <span className="truncate">{cat.name}</span>
                </button>
              ))}
            </nav>
          </aside>

          <div className="min-w-0 flex-1">
            {/* Mobile filter bar */}
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <p className="text-sm font-medium text-slate-500 font-inter">
                {activeCategoryName && activeCategory !== "all" ? (
                  <span className="text-accent font-semibold">{activeCategoryName}</span>
                ) : (
                  "Bütün məhsullar"
                )}
              </p>
              <button
                type="button"
                onClick={() => setFilterOpen(true)}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-accent hover:text-accent transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filter</span>
              </button>
            </div>

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

      {/* Mobile filter panel */}
      {filterOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setFilterOpen(false)}
          />

          {/* Bottom sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[75vh] flex flex-col">
            {/* Handle + header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-secondary" />
                <h2 className="font-sora font-semibold text-primary text-base">Kateqoriya</h2>
              </div>
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                aria-label="Bağla"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Category list */}
            <div className="overflow-y-auto flex-1 py-2">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.slug);
                    setFilterOpen(false);
                  }}
                  className={`flex w-full items-center gap-4 min-h-[56px] px-5 text-base font-medium transition-colors ${
                    activeCategory === cat.slug
                      ? "bg-accent/8 text-accent"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <CategoryIcon
                    iconUrl={cat.icon_url}
                    name={cat.name}
                    className="h-6 w-6 shrink-0"
                    fallbackClassName="h-6 w-6 shrink-0"
                  />
                  <span>{cat.name}</span>
                  {activeCategory === cat.slug && (
                    <span className="ml-auto text-accent">
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Safe area padding for iOS */}
            <div className="h-safe-area-inset-bottom pb-6" />
          </div>
        </div>
      )}
    </>
  );
}
