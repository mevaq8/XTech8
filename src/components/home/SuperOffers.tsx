import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/shared/ProductCard";
import { useCatalog } from "@/store/catalog-store";

function OfferSkeleton() {
  return (
    <div className="min-w-[160px] sm:min-w-[200px] lg:min-w-[200px] animate-pulse overflow-hidden rounded-xl border border-slate-100 bg-white p-4">
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

export default function SuperOffers() {
  const { products, loading } = useCatalog();
  const offers = products.filter((product) => product.isSuperOffer);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [activePage, setActivePage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);

  const pageCount = useMemo(() => {
    if (loading) return 4;
    if (offers.length === 0) return 0;
    return Math.max(1, offers.length - itemsPerPage + 1);
  }, [loading, offers.length, itemsPerPage]);

  if (!loading && offers.length === 0) return null;

  // Measure visible items per viewport using ResizeObserver
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const updateItemsPerPage = () => {
      const firstCard = scroller.querySelector("[data-offer-card]");
      if (!(firstCard instanceof HTMLElement)) {
        setItemsPerPage(1);
        return;
      }
      const cardWidth = firstCard.offsetWidth + 16; // + gap
      const containerWidth = scroller.offsetWidth;
      setItemsPerPage(Math.max(1, Math.floor(containerWidth / cardWidth)));
    };

    updateItemsPerPage();

    const observer = new ResizeObserver(updateItemsPerPage);
    observer.observe(scroller);
    return () => observer.disconnect();
  }, [loading, offers.length]);

  const getStep = () => {
    const firstCard = scrollerRef.current?.querySelector("[data-offer-card]");
    if (!(firstCard instanceof HTMLElement)) return 216;
    return firstCard.offsetWidth + 16;
  };

  const scrollOffers = (direction: -1 | 1) => {
    scrollerRef.current?.scrollBy({
      left: direction * getStep(),
      behavior: "smooth",
    });
  };

  const scrollToPage = (pageIndex: number) => {
    scrollerRef.current?.scrollTo({
      left: pageIndex * getStep(),
      behavior: "smooth",
    });
    setActivePage(pageIndex);
  };

  const updateActivePage = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const step = getStep();
    setActivePage(Math.min(pageCount - 1, Math.max(0, Math.round(scroller.scrollLeft / step))));
  };

  return (
    <section className="py-12 bg-bg">
      <div className="container-main">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.5px] text-emerald-600 mb-1">
              XTech seçimi
            </p>
            <h2 className="font-sora text-xl sm:text-2xl font-semibold text-primary">Super Təkliflər</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollOffers(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-primary transition-all duration-200 hover:scale-105 hover:bg-accent hover:text-white hover:border-accent"
              aria-label="Əvvəlki təkliflər"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollOffers(1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-primary transition-all duration-200 hover:scale-105 hover:bg-accent hover:text-white hover:border-accent"
              aria-label="Növbəti təkliflər"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div
            ref={scrollerRef}
            onScroll={updateActivePage}
            className="category-scroll flex touch-pan-x snap-x gap-4 overflow-x-auto scroll-smooth pb-3"
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} data-offer-card className="snap-start">
                <OfferSkeleton />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            ref={scrollerRef}
            onScroll={updateActivePage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="category-scroll flex touch-pan-x snap-x gap-4 overflow-x-auto scroll-smooth pb-3"
          >
            {offers.map((product) => (
              <div key={product.id} data-offer-card className="min-w-[160px] snap-start sm:min-w-[200px] lg:min-w-[200px]">
                <ProductCard product={product} />
              </div>
            ))}
          </motion.div>
        )}

        {pageCount > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            {Array.from({ length: pageCount }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollToPage(index)}
                className={`h-2 rounded-full transition-all ${
                  index === activePage ? "w-6 bg-slate-950" : "w-2 bg-slate-300 hover:bg-slate-500"
                }`}
                aria-label={`${index + 1}-ci səhifə`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
