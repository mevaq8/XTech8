import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { onBannerRefresh } from "@/lib/catalog-events";
import type { Banner } from "@/lib/types";

function ActionLink({ to, children, className }: { to: string; children: string; className: string }) {
  if (to.startsWith("/") || to.startsWith("#")) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a href={to} className={className} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

export default function BannerSlider() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const fetchBanners = useCallback(async () => {
    const { data, error } = await supabase
      .from("banners")
      .select()
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      setBanners([]);
      setLoading(false);
      return;
    }

    setBanners((data as Banner[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchBanners();

    const removeLocalListener = onBannerRefresh(() => {
      void fetchBanners();
    });

    const channel = supabase
      .channel("xtech-banner-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "banners" }, () => {
        void fetchBanners();
      })
      .subscribe();

    return () => {
      removeLocalListener();
      void supabase.removeChannel(channel);
    };
  }, [fetchBanners]);

  useEffect(() => {
    setActiveIndex((index) => Math.min(index, Math.max(0, banners.length - 1)));
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % banners.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [banners.length]);

  if (loading) {
    return (
      <div className="h-[250px] rounded-xl bg-slate-100 animate-pulse sm:h-[300px] lg:h-[420px]" />
    );
  }

  const activeBanner = banners[activeIndex];

  if (!activeBanner) return null;

  const goToPrevious = () => setActiveIndex((index) => (index - 1 + banners.length) % banners.length);
  const goToNext = () => setActiveIndex((index) => (index + 1) % banners.length);
  const secondaryLink = activeBanner.link_url || "/#products";

  const handleTouchEnd = (clientX: number) => {
    if (touchStart === null || banners.length <= 1) return;

    const distance = touchStart - clientX;
    if (Math.abs(distance) > 48) {
      if (distance > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
    setTouchStart(null);
  };

  return (
    <div className="relative">
      <div
        className="relative h-[250px] overflow-hidden rounded-xl border border-slate-200 bg-[#f8fafc] shadow-sm sm:h-[300px] lg:h-[420px]"
        onTouchStart={(event) => setTouchStart(event.touches[0]?.clientX ?? null)}
        onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBanner.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src={activeBanner.image_url}
              alt={activeBanner.title || "XTech banner"}
              className="h-full w-full object-contain object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/55 via-slate-950/25 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 flex h-full items-center px-5 sm:px-10 lg:px-14">
          <div className="max-w-[500px]">
            {activeBanner.title && (
              <h2 className="font-sora font-bold text-xl sm:text-2xl lg:text-3xl text-white mb-3 leading-tight">
                {activeBanner.title}
              </h2>
            )}
            {activeBanner.subtitle && (
              <p className="font-inter text-sm sm:text-base text-slate-200/90 mb-5 leading-relaxed">
                {activeBanner.subtitle}
              </p>
            )}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Link
                to="/#products"
                className="inline-flex items-center justify-center h-12 px-7 rounded-lg bg-accent text-white font-inter font-medium text-sm transition-all duration-300 hover:bg-[#16A34A] hover:shadow-[0_0_30px_rgba(34,197,94,0.35)] active:scale-[0.97]"
              >
                Məhsullara bax
              </Link>
              <ActionLink
                to={secondaryLink}
                className="inline-flex items-center justify-center h-12 px-7 rounded-lg border border-white/60 text-white font-inter font-medium text-sm transition-all duration-300 hover:bg-white/10 active:scale-[0.97]"
              >
                Kampaniyalar
              </ActionLink>
            </div>
          </div>
        </div>

        {banners.length > 1 && (
          <>
            <button
              type="button"
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-md transition-all duration-200 hover:scale-105 hover:bg-slate-950 hover:text-white"
              aria-label="Əvvəlki banner"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-md transition-all duration-200 hover:scale-105 hover:bg-slate-950 hover:text-white"
              aria-label="Növbəti banner"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {banners.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {banners.map((banner, index) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === activeIndex ? "w-6 bg-slate-950" : "w-2 bg-slate-300 hover:bg-slate-500"
              }`}
              aria-label={`${index + 1}-ci banner`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
