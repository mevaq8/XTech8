import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Phone, Menu, X, Home, Tag, Info, MessageCircle, ChevronRight } from "lucide-react";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import { useSiteSettings } from "@/store/site-settings-store";
import { normalizePhoneForLink, readSetting } from "@/lib/site-settings";

export default function Header() {
  const { settings } = useSiteSettings();
  const contactPhone = readSetting(settings, "contact_phone", "+994503201156");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleNavClick(e: React.MouseEvent, to: string, hash?: string) {
    e.preventDefault();
    setMenuOpen(false);
    navigate(to);
    if (hash) {
      // Give router time to render before scrolling
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    }
  }

  const navLinks: {
    label: string;
    to?: string;
    hash?: string;
    href?: string;
    icon: React.ElementType;
  }[] = [
    { label: "Ana səhifə", to: "/", icon: Home },
    { label: "Kateqoriyalar", to: "/", hash: "products", icon: Tag },
    { label: "Haqqımızda", to: "/", icon: Info },
    { label: "Əlaqə", href: `tel:${normalizePhoneForLink(contactPhone)}`, icon: MessageCircle },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-bg/90 backdrop-blur-xl transition-all duration-300">
        {/* Top bar — desktop: phone number | mobile: logo + brand name */}
        <div className="border-b border-slate-200/70 bg-white/65">
          <div className="container-main flex h-8 items-center">
            {/* Mobile: logo + brand name */}
            <Link to="/" className="flex items-center gap-2 lg:hidden">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
                <span className="font-sora text-xs font-bold text-white">X</span>
              </div>
              <span className="font-sora text-base font-bold text-primary">XTech</span>
            </Link>

            {/* Desktop: phone number aligned right */}
            <a
              href={`tel:${normalizePhoneForLink(contactPhone)}`}
              className="hidden lg:inline-flex ml-auto items-center gap-2 text-xs font-semibold text-primary transition-colors hover:text-accent"
            >
              <Phone className="h-3.5 w-3.5 text-secondary" />
              <span>{contactPhone}</span>
            </a>
          </div>
        </div>

        {/* Main navbar */}
        <div className="container-main">
          <div className="flex h-16 items-center gap-3 sm:gap-5 lg:h-20">
            {/* Mobile: hamburger; Desktop: logo */}
            <div className="shrink-0">
              {/* Hamburger — mobile only */}
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-primary transition-colors hover:bg-slate-100 lg:hidden"
                aria-label="Menyu"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Logo — desktop only */}
              <Link to="/" className="hidden lg:flex shrink-0 items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <span className="font-sora text-base font-bold text-white">X</span>
                </div>
                <span className="font-sora text-xl font-bold text-primary">XTech</span>
              </Link>
            </div>

            <div className="min-w-0 flex-1">
              <div className="mx-auto w-full max-w-3xl">
                <SearchBar />
              </div>
            </div>

            <div className="flex shrink-0 items-center">
              <CartIcon iconClassName="text-primary" />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile slide-out menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute left-0 top-0 h-full w-[280px] max-w-[85vw] bg-white shadow-2xl flex flex-col">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <Link to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <span className="font-sora text-base font-bold text-white">X</span>
                </div>
                <span className="font-sora text-lg font-bold text-primary">XTech</span>
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                aria-label="Bağla"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto py-3">
              {navLinks.map(({ label, to, hash, href, icon: Icon }) =>
                href ? (
                  // External links (tel:, mailto:, etc.)
                  <a
                    key={label}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 min-h-[52px] px-5 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-accent transition-colors"
                  >
                    <Icon className="h-5 w-5 text-slate-400 shrink-0" />
                    <span>{label}</span>
                    <ChevronRight className="h-4 w-4 text-slate-300 ml-auto" />
                  </a>
                ) : (
                  // Internal React Router links
                  <a
                    key={label}
                    href={to}
                    onClick={(e) => handleNavClick(e, to!, hash)}
                    className="flex items-center gap-3 min-h-[52px] px-5 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-accent transition-colors"
                  >
                    <Icon className="h-5 w-5 text-slate-400 shrink-0" />
                    <span>{label}</span>
                    <ChevronRight className="h-4 w-4 text-slate-300 ml-auto" />
                  </a>
                )
              )}
            </nav>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-slate-100">
              <a
                href={`tel:${normalizePhoneForLink(contactPhone)}`}
                className="flex items-center gap-2 text-sm font-semibold text-primary"
              >
                <Phone className="h-4 w-4 text-secondary" />
                <span>{contactPhone}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
