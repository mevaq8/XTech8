export default function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-100 bg-white animate-pulse">
      <div className="aspect-[4/3] bg-slate-100 rounded-t-xl" />
      <div className="flex flex-1 flex-col p-4 gap-2">
        <div className="h-3 w-20 bg-slate-100 rounded-full" />
        <div className="h-4 w-full bg-slate-100 rounded-full" />
        <div className="h-4 w-3/4 bg-slate-100 rounded-full" />
        <div className="h-3 w-full bg-slate-100 rounded-full mt-1" />
        <div className="mt-auto pt-3 flex flex-col gap-2">
          <div className="h-6 w-24 bg-slate-100 rounded-full" />
          <div className="h-10 w-full bg-slate-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
