import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Truck, ShieldCheck, Headset, BadgePercent, ArrowRight } from "lucide-react";

const perks = [
  { icon: Truck, title: "24 saat çatdırılma", desc: "Bakı daxili pulsuz" },
  { icon: ShieldCheck, title: "Rəsmi zəmanət", desc: "Bütün məhsullara" },
  { icon: Headset, title: "Peşəkar dəstək", desc: "Seçimdə kömək" },
  { icon: BadgePercent, title: "Super qiymətlər", desc: "Hər həftə yeni" },
];

export default function ValueStrip() {
  return (
    <section className="bg-bg pt-5 sm:pt-6">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="grid gap-4 lg:grid-cols-[1.4fr_1fr]"
        >
          {/* Conversion CTA card */}
          <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-7 sm:px-9 sm:py-8">
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            />
            <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-md">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 font-inter text-[11px] font-semibold uppercase tracking-[0.5px] text-accent">
                  <BadgePercent className="h-3.5 w-3.5" />
                  Həftənin endirimləri
                </span>
                <h1 className="mt-3 font-sora text-xl font-bold leading-tight text-white sm:text-2xl text-balance">
                  Texnologiya, sərfəli qiymətə
                </h1>
                <p className="mt-2 font-inter text-sm leading-relaxed text-slate-300">
                  Orijinal məhsullar, rəsmi zəmanət və sürətli çatdırılma — hamısı bir yerdə.
                </p>
              </div>
              <Link
                to="/#products"
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-7 font-inter text-sm font-semibold text-white transition-all duration-300 hover:bg-[#16A34A] hover:shadow-[0_0_28px_rgba(34,197,94,0.35)] active:scale-[0.97]"
              >
                Məhsullara bax
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Perk grid — desktop only */}
          <div className="hidden grid-cols-2 gap-3 lg:grid">
            {perks.map((perk) => (
              <div
                key={perk.title}
                className="flex flex-col justify-center rounded-2xl border border-slate-100 bg-white p-4 transition-all duration-300 hover:border-accent/30 hover:shadow-[0_0_18px_rgba(34,197,94,0.08)]"
              >
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                  <perk.icon className="h-[18px] w-[18px] text-accent" strokeWidth={2} />
                </div>
                <p className="font-sora text-sm font-semibold text-primary">{perk.title}</p>
                <p className="font-inter text-xs text-slate-500">{perk.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
