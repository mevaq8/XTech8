import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md"
      >
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">
          <Search className="h-9 w-9 text-slate-400" />
        </div>
        <h1 className="mb-3 font-sora text-6xl font-bold text-primary">404</h1>
        <h2 className="mb-2 font-sora text-xl font-semibold text-primary">Səhifə tapılmadı</h2>
        <p className="mb-8 font-inter text-sm leading-relaxed text-slate-500">
          Axtardığınız səhifə mövcud deyil və ya silinib. Ana səhifəyə qayıdın.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-sora text-sm font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-lg"
        >
          <Home className="h-4 w-4" />
          Ana səhifə
        </Link>
      </motion.div>
    </div>
  );
}
