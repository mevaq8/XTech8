import { motion } from "framer-motion";

export default function WideCtaBanner() {
  return (
    <section className="py-12 bg-bg">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl bg-primary px-8 py-12 md:px-16 md:py-14 text-center"
        >
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }} />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-sora font-bold text-xl md:text-2xl text-white mb-4">
              Hələ qərar verməmisiniz?
            </h2>
            <p className="font-inter text-slate-300 text-sm md:text-base mb-0">
              XTech komandası sizə kömək etməyə hazırdır. WhatsApp üzərindən bizimlə əlaqə saxlayın və sizə ən uyğun məhsulu tapmağa kömək edək.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
