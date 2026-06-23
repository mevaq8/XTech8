import { motion } from "framer-motion";
import { ShieldCheck, Truck, Headphones, Award } from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "100% Orijinal Məhsul",
    desc: "Bütün məhsullar rəsmi distribütorlardan alınır. Saxta və ya kontrafakt mal satmırıq.",
  },
  {
    icon: Truck,
    title: "Sürətli Çatdırılma",
    desc: "Bakı daxilində 24 saat ərzində çatdırılma. Regionlara da göndəriş imkanı var.",
  },
  {
    icon: Headphones,
    title: "Peşəkar Dəstək",
    desc: "Texniki suallarınız üçün peşəkar komandamız həmişə hazırdır. WhatsApp vasitəsilə əlaqə saxlayın.",
  },
  {
    icon: Award,
    title: "Rəsmi Zəmanət",
    desc: "Bütün məhsullar istehsalçının rəsmi zəmanəti ilə gəlir. Problem olsa, biz həll edirik.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-[70vh]">
      {/* Hero */}
      <section className="bg-[#0B1120] py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container-main"
        >
          <span className="mb-4 inline-block rounded-full bg-accent/15 px-4 py-1.5 font-inter text-xs font-semibold uppercase tracking-widest text-accent">
            Haqqımızda
          </span>
          <h1 className="mb-4 font-sora text-3xl font-bold text-white md:text-4xl">
            Azərbaycanda etibarlı<br />İT avadanlıq mağazası
          </h1>
          <p className="mx-auto max-w-xl font-inter text-base text-slate-400">
            2019-cu ildən bəri Bakıda noutbuk, printer və İT avadanlıqları satışı ilə məşğul oluruq.
            5 000-dən çox məmnun müştərimiz bizim ən böyük nailiyyətimizdir.
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-100 bg-white py-10">
        <div className="container-main">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { value: "5 000+", label: "Məmnun müştəri" },
              { value: "2019", label: "Quruluş ili" },
              { value: "500+", label: "Məhsul çeşidi" },
              { value: "24 saat", label: "Çatdırılma müddəti" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="font-sora text-2xl font-bold text-primary md:text-3xl">{s.value}</p>
                <p className="mt-1 font-inter text-sm text-slate-500">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-14 bg-bg">
        <div className="container-main">
          <h2 className="mb-8 text-center font-sora text-2xl font-semibold text-primary">
            Niyə XTech?
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-slate-100 bg-white p-6"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="mb-2 font-sora text-[15px] font-semibold text-primary">{title}</h3>
                <p className="font-inter text-sm leading-relaxed text-slate-500">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-white border-t border-slate-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container-main text-center"
        >
          <h2 className="mb-3 font-sora text-xl font-semibold text-primary">
            Sualınız var? Bizimlə əlaqə saxlayın
          </h2>
          <p className="mb-6 font-inter text-sm text-slate-500">
            WhatsApp vasitəsilə dərhal cavab alın
          </p>
          <a
            href="https://wa.me/994503201156"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 font-sora text-sm font-semibold text-white transition-all hover:bg-[#20bd5a] hover:shadow-lg"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp ilə yazın
          </a>
        </motion.div>
      </section>
    </div>
  );
}
