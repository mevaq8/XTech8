import { useFilter } from "@/store/filter-store";
import { useCatalog } from "@/store/catalog-store";
import CategoryIcon from "@/components/shared/CategoryIcon";

export default function CategoryNav() {
  const { activeCategory, setActiveCategory } = useFilter();
  const { categories } = useCatalog();

  return (
    <section className="lg:hidden py-2 bg-bg sticky top-[96px] z-40">
      <div className="container-main">
        <div className="category-scroll flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:-mx-6 sm:px-6">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setActiveCategory(cat.slug)}
              className={`shrink-0 inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-sm font-medium transition-all duration-200 border ${
                activeCategory === cat.slug
                  ? "bg-accent text-white border-accent"
                  : "bg-white text-slate-600 border-slate-200 hover:border-accent hover:text-accent"
              }`}
            >
              <CategoryIcon
                iconUrl={cat.icon_url}
                name={cat.name}
                className="h-3.5 w-3.5"
                fallbackClassName="h-3.5 w-3.5"
              />
              <span className="truncate">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
