import { useFilter } from "@/store/filter-store";

export default function SearchBar({ dark = false }: { dark?: boolean }) {
  const { searchQuery, setSearchQuery } = useFilter();

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 sm:pl-4">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={dark ? "text-slate-400" : "text-secondary"}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Məhsul axtar..."
        className={
          dark
            ? "h-11 w-full rounded-xl border border-white/15 bg-white/10 pl-11 pr-10 font-inter text-sm text-white shadow-sm transition-all placeholder:text-slate-400 hover:border-white/25 hover:bg-white/15 focus:border-accent focus:bg-white/15 focus:shadow-md focus:outline-none focus:ring-2 focus:ring-accent/30 sm:h-12 sm:pl-12 sm:text-[15px]"
            : "h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-10 font-inter text-sm text-primary shadow-sm transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-accent focus:bg-white focus:shadow-md focus:outline-none focus:ring-2 focus:ring-accent/25 sm:h-12 sm:pl-12 sm:text-[15px]"
        }
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className={`absolute inset-y-0 right-0 flex items-center pr-3 transition-colors cursor-pointer ${dark ? "text-slate-400 hover:text-white" : "text-slate-400 hover:text-primary"}`}
          aria-label="Axtarışı təmizlə"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
