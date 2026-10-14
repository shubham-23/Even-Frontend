export default function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between h-96 animate-pulse border border-slate-800">
      <div className="h-48 bg-slate-800/60 w-full"></div>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="h-5 bg-slate-800/80 rounded w-3/4"></div>
          <div className="h-3 bg-slate-800/50 rounded w-1/2"></div>
          <div className="h-3 bg-slate-800/40 rounded w-full"></div>
        </div>
        <div className="space-y-3 pt-4">
          <div className="h-2 bg-slate-800/80 rounded w-full"></div>
          <div className="flex gap-2">
            <div className="h-9 bg-slate-800/80 rounded-xl flex-1"></div>
            <div className="h-9 bg-slate-800/80 rounded-xl flex-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
}