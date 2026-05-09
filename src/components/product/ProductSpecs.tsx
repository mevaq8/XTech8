import type { ProductSpecs } from "@/types";

export default function ProductSpecs({ specs }: { specs: ProductSpecs }) {
  const entries = Object.entries(specs).filter(([, value]) => value && value !== "-");

  if (entries.length === 0) return null;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6">
      <h3 className="font-sora font-semibold text-primary text-base mb-4">Texniki xususiyyetler</h3>
      <div className="space-y-3">
        {entries.map(([key, value]) => (
          <div key={key} className="flex items-center justify-between gap-4 py-2 border-b border-slate-50 last:border-0">
            <span className="text-sm text-slate-500 font-inter">{key}</span>
            <span className="text-sm font-medium text-primary font-inter text-right">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
