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
        <div className="flex h-16 items-center gap-3 sm:gap-5 lg:h-20">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="font-sora text-base font-bold text-white">X</span>
            </div>
            <span className="hidden font-sora text-xl font-bold text-primary sm:inline">XTech</span>
          </Link>

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
  );
}
