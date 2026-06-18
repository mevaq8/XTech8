import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  Settings,
  Laptop,
} from "lucide-react";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/products", label: "Məhsullar", icon: Package },
  { path: "/admin/categories", label: "Kateqoriyalar", icon: Tags },
  { path: "/admin/settings", label: "Parametrlər", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900 h-screen fixed left-0 top-0 z-40">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Laptop className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg">XTech</span>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.path === "/admin"
              ? location.pathname === "/admin"
              : location.pathname.startsWith(item.path);
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-white/10 text-white border-l-4 border-emerald-500"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <p className="text-xs text-slate-500 text-center">XTech Admin v1.0</p>
      </div>
    </aside>
  );
}
