import { motion } from "framer-motion";
import { Users, ThumbsUp } from "lucide-react";

export default function CustomerConfidence() {
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
          <h2 className="font-sora font-semibold text-xl md:text-2xl text-primary mb-2">Müştərilərimizin etimadı</h2>
          <p className="font-inter text-sm text-slate-500">Minlərlə müştərinin seçimi</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: Users, value: "5000+", label: "Məmnun müştəri" },
            { icon: ThumbsUp, value: "100%", label: "Orijinal məhsul zəmanəti" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white border border-slate-100 rounded-xl p-6 text-center"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center mx-auto mb-3">
                <stat.icon size={20} className="text-primary" strokeWidth={2} />
              </div>
              <p className="font-sora font-bold text-2xl text-primary mb-1">{stat.value}</p>
              <p className="font-inter text-sm text-slate-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
