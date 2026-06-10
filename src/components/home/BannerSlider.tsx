import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { onBannerRefresh } from "@/lib/catalog-events";
import type { Banner } from "@/lib/types";

function BannerLink({ to, children }: { to: string | null; children: ReactNode }) {
  if (!to) return <>{children}</>;

  if (to.startsWith("/") || to.startsWith("#")) {
    return (
      <Link to={to} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900">
        {children}
      </Link>
    );
  }

  return (
    <a
      href={to}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}

export default function BannerSlider() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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

  const activeBanner = banners[activeIndex];

  const hasText = useMemo(() => {
    if (!activeBanner) return false;
    return Boolean(activeBanner.category || activeBanner.title || activeBanner.subtitle);
  }, [activeBanner]);

  if (loading) {
    return (
      <section className="bg-bg pt-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-[420px] rounded-2xl bg-slate-100 animate-pulse" />
        </div>
      </section>
    );
  }

  if (!activeBanner) return null;

  const goToPrevious = () => setActiveIndex((index) => (index - 1 + banners.length) % banners.length);
  const goToNext = () => setActiveIndex((index) => (index + 1) % banners.length);

  return (
    <section className="bg-bg pt-6">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-[#f3f4f6] shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBanner.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <BannerLink to={activeBanner.link_url}>
                <div
                  className={`grid min-h-[420px] md:min-h-[500px] ${
                    hasText ? "grid-cols-1 md:grid-cols-[0.95fr_1.05fr]" : "grid-cols-1"
                  }`}
                >
                  {hasText && (
                    <div className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-14">
                      {activeBanner.category && (
                        <p className="font-inter text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600 mb-4">
                          {activeBanner.category}
                        </p>
                      )}
                      {activeBanner.title && (
                        <h1 className="font-sora text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-slate-950 max-w-xl">
                          {activeBanner.title}
                        </h1>
                      )}
                      {activeBanner.subtitle && (
                        <p className="font-inter text-base sm:text-lg leading-relaxed text-slate-600 max-w-lg mt-5">
                          {activeBanner.subtitle}
                        </p>
                      )}
                      {activeBanner.link_url && (
                        <span className="mt-8 inline-flex w-fit items-center rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-colors">
                          Etrafli bax
                        </span>
                      )}
                    </div>
                  )}

                  <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden px-6 py-10 sm:px-10">
                    <img
                      src={activeBanner.image_url}
                      alt={activeBanner.title || activeBanner.category || "XTech banner"}
                      className="max-h-[380px] w-full object-contain drop-shadow-[0_24px_45px_rgba(15,23,42,0.18)]"
                    />
                  </div>
                </div>
              </BannerLink>
            </motion.div>
          </AnimatePresence>

          {banners.length > 1 && (
            <>
              <button
                type="button"
                onClick={goToPrevious}
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm transition hover:bg-white hover:text-slate-950"
                aria-label="Evvelki banner"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm transition hover:bg-white hover:text-slate-950"
                aria-label="Novbeti banner"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
                {banners.map((banner, index) => (
                  <button
                    key={banner.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      index === activeIndex ? "w-8 bg-slate-950" : "w-2.5 bg-slate-400/70 hover:bg-slate-600"
                    }`}
                    aria-label={`${index + 1}-ci banner`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
