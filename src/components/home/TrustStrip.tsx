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
    <section className="pt-3 pb-5 sm:pt-4 sm:pb-6 lg:pt-5 lg:pb-7 bg-bg">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3"
        >
          {items.map((item) => (
            <div
              key={item.text}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 bg-white border border-slate-100 rounded-full shadow-sm min-w-0"
            >
              <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-accent shrink-0" strokeWidth={2} />
              <span className="text-[11px] sm:text-sm lg:text-base font-medium text-primary font-inter truncate">
                {item.text}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
