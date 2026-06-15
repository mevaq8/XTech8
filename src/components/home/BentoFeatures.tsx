import { motion } from "framer-motion";
import { Zap, Award, Headphones, Truck } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Sürətli Çatdırılma",
    desc: "Sifarişiniz 24 saat ərzində Bakının istənilən nöqtəsinə çatdırılır.",
    span: "col-span-1 md:col-span-2",
  },
  {
    icon: Award,
    title: "Orijinal Məhsullar",
    desc: "Bütün məhsullar rəsmi distribyutordan təmin olunur.",
    span: "col-span-1",
  },
  {
    icon: Headphones,
    title: "Peşəkar Dəstək",
    desc: "Texniki komandamız sizə düzgün seçim etməkdə kömək edir.",
    span: "col-span-1",
  },
  {
    icon: Truck,
    title: "Zəmanətli Xidmət",
    desc: "Hər bir məhsul rəsmi zəmanət və pulsuz quraşdırma ilə gəlir.",
    span: "col-span-1 md:col-span-2",
  },
];

export default function BentoFeatures() {
  return (
    <section id="features" className="py-12 bg-bg">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="font-sora font-semibold text-xl md:text-2xl text-primary mb-2">Niyə XTech?</h2>
          <p className="font-inter text-sm text-slate-500">Bakının ən etibarlı texnologiya satıcısı</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`${f.span} group relative bg-white border border-slate-100 rounded-xl p-5 transition-all duration-300 hover:border-accent/30 hover:shadow-[0_0_20px_rgba(34,197,94,0.1)]`}
            >
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                <f.icon size={18} className="text-accent" strokeWidth={2} />
              </div>
              <h3 className="font-sora font-semibold text-primary text-sm mb-1">{f.title}</h3>
              <p className="font-inter text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
