import { useRef, useState, type MouseEvent, type WheelEvent } from "react";
import { motion } from "framer-motion";
import { useFilter } from "@/store/filter-store";
import { useCatalog } from "@/store/catalog-store";

export default function CategoryNav() {
  const { activeCategory, setActiveCategory } = useFilter();
  const { categories } = useCatalog();
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef({ startX: 0, scrollLeft: 0, active: false, moved: false });
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;

    dragState.current = {
      startX: event.clientX,
      scrollLeft: scroller.scrollLeft,
      active: true,
      moved: false,
    };
    setIsDragging(true);
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    if (!scroller || !dragState.current.active) return;

    const delta = event.clientX - dragState.current.startX;
    if (Math.abs(delta) > 5) {
      dragState.current.moved = true;
    }
    scroller.scrollLeft = dragState.current.scrollLeft - delta;
  };

  const handleMouseUp = () => {
    dragState.current.active = false;
    setIsDragging(false);
  };

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    if (!scroller || !event.shiftKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    event.preventDefault();
    scroller.scrollLeft += event.deltaY;
  };

  const handleCategoryClick = (slug: string) => {
    if (dragState.current.moved) {
      dragState.current.moved = false;
      return;
    }
    setActiveCategory(slug);
  };

  return (
    <section id="products" className="py-4 bg-bg sticky top-[64px] lg:top-[72px] z-40">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={scrollerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className={`category-scroll flex items-center gap-2 overflow-x-auto overflow-y-visible overscroll-x-contain scroll-smooth pb-3 px-1 snap-x snap-mandatory select-none touch-pan-x scrollbar-hide ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`relative flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium font-inter transition-all duration-200 cursor-pointer whitespace-nowrap snap-start ${
                activeCategory === cat.slug
                  ? "bg-accent/10 text-accent border border-accent/40 shadow-[0_0_14px_rgba(34,197,94,0.2)]"
                  : "bg-white text-slate-600 border border-slate-100 hover:border-accent/30 hover:text-accent/80 hover:bg-accent/5"
              }`}
            >
              {activeCategory === cat.slug && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 rounded-full border-2 border-accent/50"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
