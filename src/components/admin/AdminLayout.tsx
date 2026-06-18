import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Sidebar } from "./Sidebar";
import { MobileSidebar } from "./MobileSidebar";
import { Header } from "./Header";
import { ToastContainer } from "./Toast";
import type { Toast } from "@/lib/types";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/products": "Məhsullar",
  "/admin/products/new": "Yeni Məhsul",
  "/admin/categories": "Kateqoriyalar",
  "/admin/settings": "Parametrlər",
};

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/admin/login");
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  const addToast = (message: string, type: Toast["type"]) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getTitle = () => {
    if (location.pathname.startsWith("/admin/products/") && location.pathname.includes("/edit")) {
      return "Məhsulu Redaktə Et";
    }
    return pageTitles[location.pathname] || "Admin";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <MobileSidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="lg:ml-64 min-h-screen flex flex-col">
        <Header title={getTitle()} onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet context={{ addToast }} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
