import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useFilter } from "@/store/filter-store";
import { useCatalog } from "@/store/catalog-store";
import CategoryIcon from "@/components/shared/CategoryIcon";

export default function CategoryNav() {
  const { activeCategory, setActiveCategory } = useFilter();
  const { categories } = useCatalog();
  const [open, setOpen] = useState(false);

  const activeName =
    categories.find((cat) => cat.slug === activeCategory)?.name ?? "Kateqoriyalar";

  const handleSelect = (slug: string) => {
    setActiveCategory(slug);
    setOpen(false);
  };

  return (
    <section className="lg:hidden bg-bg sticky top-[96px] z-40 py-2">
      <div className="container-main">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 h-11 text-sm font-semibold text-primary transition-colors hover:border-accent"
        >
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-accent" />
            <span className="truncate">{activeName}</span>
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="mt-2 grid grid-cols-2 gap-2 rounded-xl border border-slate-100 bg-white p-2 sm:grid-cols-3">
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => handleSelect(cat.slug)}
                    className={`inline-flex items-center gap-2 rounded-lg border px-3 h-10 text-left text-sm font-medium transition-all duration-200 ${
                      activeCategory === cat.slug
                        ? "border-accent bg-accent/5 text-accent"
                        : "border-slate-200 bg-white text-slate-600 hover:border-accent hover:text-accent"
                    }`}
                  >
                    <CategoryIcon
                      iconUrl={cat.icon_url}
                      name={cat.name}
                      className="h-4 w-4 shrink-0"
                      fallbackClassName="h-4 w-4 shrink-0"
                    />
                    <span className="truncate">{cat.name}</span>
                  </button>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
