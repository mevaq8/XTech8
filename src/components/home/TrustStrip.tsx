import { motion } from "framer-motion";
import { BadgeCheck, Clock, Lock, ShieldCheck } from "lucide-react";

const items = [
  { icon: Clock, text: "24 saat çatdırılma" },
  { icon: ShieldCheck, text: "Rəsmi zəmanət" },
  { icon: BadgeCheck, text: "Yoxlanılmış keyfiyyət" },
  { icon: Lock, text: "Təhlükəsiz sifariş" },
];

export default function TrustStrip() {
  return (
    <section className="bg-bg pb-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {items.map((item) => (
            <div
              key={item.text}
              className="flex min-w-0 items-center justify-center gap-2 rounded-full border border-slate-100 bg-white px-4 py-3 shadow-sm lg:px-5"
            >
              <item.icon className="h-5 w-5 shrink-0 text-accent" strokeWidth={2} />
              <span className="truncate font-inter text-sm font-semibold text-primary sm:text-base">
                {item.text}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
