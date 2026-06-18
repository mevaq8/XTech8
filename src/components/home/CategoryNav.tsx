import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, X } from "lucide-react";
import { useFilter } from "@/store/filter-store";
import { useCatalog } from "@/store/catalog-store";
import CategoryIcon from "@/components/shared/CategoryIcon";

export default function CategoryNav() {
  const { activeCategory, setActiveCategory } = useFilter();
  const { categories } = useCatalog();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSelect = (slug: string) => {
    setActiveCategory(slug);
    setOpen(false);
  };

  return (
    <section className="lg:hidden bg-bg sticky top-[96px] z-40 py-2">
      <div className="container-main">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 h-11 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          <LayoutGrid className="h-4 w-4" />
          <span>Kateqoriyalar</span>
        </button>
      </div>

      {createPortal(
        <AnimatePresence>
          {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60] bg-primary/40 backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              role="dialog"
              aria-modal="true"
              aria-label="Kateqoriyalar"
              className="fixed inset-y-0 left-0 z-[70] flex w-[82%] max-w-xs flex-col bg-white shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-4 h-14">
                <span className="inline-flex items-center gap-2 font-sora text-base font-bold text-primary">
                  <LayoutGrid className="h-5 w-5 text-accent" />
                  Kateqoriyalar
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Bağla"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-3">
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => handleSelect(cat.slug)}
                      className={`flex w-full items-center gap-2.5 rounded-lg border px-3 h-11 text-left text-sm font-medium transition-all duration-200 ${
                        activeCategory === cat.slug
                          ? "border-l-2 border-l-accent bg-accent/5 text-accent"
                          : "border-transparent bg-white text-slate-600 hover:bg-slate-50 hover:text-accent"
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
              </nav>
            </motion.div>
          </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </section>
  );
}
