import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import { useSiteSettings } from "@/store/site-settings-store";
import { normalizePhoneForLink, readSetting } from "@/lib/site-settings";

export default function Header() {
  const { settings } = useSiteSettings();
  const contactPhone = readSetting(settings, "contact_phone", "+994503201156");

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-bg/90 backdrop-blur-xl transition-all duration-300">
      <div className="border-b border-slate-200/70 bg-white/65">
        <div className="container-main flex h-8 items-center justify-center text-xs font-semibold text-primary sm:justify-end">
          <a href={`tel:${normalizePhoneForLink(contactPhone)}`} className="inline-flex items-center gap-2 transition-colors hover:text-accent">
            <Phone className="h-3.5 w-3.5 text-secondary" />
            <span>{contactPhone}</span>
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
