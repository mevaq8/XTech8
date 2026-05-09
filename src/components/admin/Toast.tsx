import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";
import type { Toast as ToastType } from "@/lib/types";

interface ToastContainerProps {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: ToastType; onRemove: (id: string) => void }) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const duration = 3000;
    const interval = 50;
    const step = (interval / duration) * 100;
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p <= step) {
          clearInterval(timer);
          onRemove(toast.id);
          return 0;
        }
        return p - step;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [toast.id, onRemove]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  };

  const borders = {
    success: "border-emerald-500",
    error: "border-red-500",
    warning: "border-amber-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      className={`bg-white rounded-lg shadow-lg border-l-4 ${borders[toast.type]} p-4 min-w-[300px] max-w-[400px] relative overflow-hidden`}
    >
      <div className="flex items-start gap-3">
        {icons[toast.type]}
        <p className="text-sm text-slate-700 flex-1">{toast.message}</p>
        <button
          onClick={() => onRemove(toast.id)}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div
        className={`absolute bottom-0 left-0 h-0.5 ${toast.type === "success" ? "bg-emerald-500" : toast.type === "error" ? "bg-red-500" : "bg-amber-500"}`}
        style={{ width: `${progress}%`, transition: "width 50ms linear" }}
      />
    </motion.div>
  );
}
