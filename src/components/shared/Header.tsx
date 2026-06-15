import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-bg/90 backdrop-blur-xl transition-all duration-300">
      <div className="border-b border-slate-200/70 bg-white/65">
        <div className="container-main flex h-8 items-center justify-center text-xs font-semibold text-primary sm:justify-end">
          <a href="tel:+994501234567" className="inline-flex items-center gap-2 transition-colors hover:text-accent">
            <Phone className="h-3.5 w-3.5 text-secondary" />
            <span>+994 50 123 45 67</span>
          </a>
        </div>
      </div>

      <div className="container-main">
        <div className="flex h-16 items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-sora font-bold text-base text-white">X</span>
            </div>
            <span className="font-sora font-bold text-xl text-primary">XTech</span>
          </Link>

          <div className="hidden lg:flex flex-1 justify-center max-w-[400px] mx-auto">
            <SearchBar />
          </div>

          <div className="flex items-center gap-1">
            <div className="lg:hidden mr-1">
              <SearchBar />
            </div>
            <CartIcon iconClassName="text-primary" />
          </div>
        </div>
      </div>
    </header>
  );
}
