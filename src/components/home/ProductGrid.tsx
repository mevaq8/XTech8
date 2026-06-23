import { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import { useFilter } from "@/store/filter-store";
import { useCatalog } from "@/store/catalog-store";
import ProductCard from "@/components/shared/ProductCard";
import CategoryIcon from "@/components/shared/CategoryIcon";

type SortOption = "default" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "price-asc", label: "Qiymət: aşağıdan yuxarı" },
  { value: "price-desc", label: "Qiymət: yuxarıdan aşağı" },
  { value: "name-asc", label: "Ad: A → Z" },
  { value: "name-desc", label: "Ad: Z → A" },
];

function SortDropdown({
  sortBy,
  setSortBy,
  align = "left",
}: {
  sortBy: SortOption;
  setSortBy: (v: SortOption) => void;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const activeSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-2 h-10 rounded-lg border bg-white font-inter text-sm transition-colors px-3 ${
          sortBy !== "default"
            ? "border-accent text-accent"
            : "border-slate-200 text-slate-600 hover:border-accent hover:text-accent"
        }`}
        aria-label="Sırala"
      >
        <ArrowUpDown className="h-4 w-4 shrink-0" />
        {activeSortLabel && <span className="hidden sm:inline">{activeSortLabel}</span>}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className={`absolute top-12 z-50 w-60 rounded-xl border border-slate-100 bg-white shadow-xl overflow-hidden ${
              align === "right" ? "right-0" : "left-0"
            }`}
          >
            {SORT_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => { setSortBy(sortBy === o.value ? "default" : o.value); setOpen(false); }}
                className={`flex w-full items-center px-4 py-2.5 text-left font-inter text-sm transition-colors ${
                  sortBy === o.value
                    ? "bg-accent/10 text-accent font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {o.label}
                {sortBy === o.value && <span className="ml-auto text-accent">✓</span>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
  const [sortBy, setSortBy] = useState<SortOption>("default");

  const filtered = useMemo(() => {
    const list = products.filter((p) => {
      const matchesCategory = activeCategory === "all" || p.category === activeCategory;
      const matchesSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sortBy === "price-asc") return [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") return [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "name-asc") return [...list].sort((a, b) => a.name.localeCompare(b.name, "az"));
    if (sortBy === "name-desc") return [...list].sort((a, b) => b.name.localeCompare(a.name, "az"));
    return list;
  }, [products, searchQuery, activeCategory, sortBy]);

  const activeSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label;

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
            <div className="flex items-center gap-2 mb-4 lg:hidden">
              <span className="flex-1 truncate font-inter text-sm font-semibold text-slate-500">
                {activeCategoryName && activeCategory !== "all" ? activeCategoryName : "Bütün məhsullar"}
              </span>
              <SortDropdown sortBy={sortBy} setSortBy={setSortBy} align="right" />
              <button
                type="button"
                onClick={() => setFilterOpen(true)}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-accent hover:text-accent transition-colors shrink-0"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filter</span>
              </button>
            </div>

            {/* Desktop sort bar */}
            <div className="hidden lg:flex items-center justify-between mb-4">
              <span className="font-inter text-sm font-semibold text-slate-500">
                {activeCategoryName && activeCategory !== "all" ? activeCategoryName : "Bütün məhsullar"}
              </span>
              <SortDropdown sortBy={sortBy} setSortBy={setSortBy} align="right" />
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
