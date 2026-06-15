import { motion } from "framer-motion";
import { MousePointerClick, ShoppingCart, MessageCircle } from "lucide-react";

const steps = [
  {
    icon: MousePointerClick,
    title: "Məhsulu seç",
    desc: "Geniş çeşidimizdən sizə uyğun məhsulu tapın və ətraflı məlumatla tanış olun.",
  },
  {
    icon: ShoppingCart,
    title: "Səbətə at",
    desc: "Seçdiyiniz məhsulu səbətə əlavə edin və miqdarı tənzimləyin.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp-la sifarişi tamamla",
    desc: "Səbətinizi WhatsApp üzərindən göndərin və sifarişinizi tez bir zamanda təsdiqləyin.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-12 bg-bg">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="font-sora font-semibold text-xl md:text-2xl text-primary mb-2">Necə işləyir?</h2>
          <p className="font-inter text-sm text-slate-500">Cəmi 3 addımla sifariş edin</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
                <step.icon size={20} className="text-white" strokeWidth={2} />
              </div>
              <div className="absolute top-6 left-1/2 w-full hidden md:block" style={{ transform: "translateX(50%)" }}>
                {i < steps.length - 1 && (
                  <div className="w-1/2 h-px bg-slate-200 mx-auto" />
                )}
              </div>
              <h3 className="font-sora font-semibold text-primary text-sm mb-2">{step.title}</h3>
              <p className="font-inter text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
