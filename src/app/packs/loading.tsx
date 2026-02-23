export default function PacksLoading() {
  return (
    <div className="grid-overlay min-h-screen">
      {/* Hero skeleton */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-40 bg-obsidian-700 rounded-full mx-auto" />
            <div className="h-10 w-80 bg-obsidian-700 rounded mx-auto" />
            <div className="h-5 w-96 bg-obsidian-700 rounded mx-auto" />
          </div>
        </div>
      </section>

      {/* Grid skeleton */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="flex gap-3 mb-6 animate-pulse">
          <div className="h-10 flex-1 max-w-md bg-obsidian-700 rounded-lg" />
          <div className="h-10 w-36 bg-obsidian-700 rounded-lg" />
          <div className="h-10 w-28 bg-obsidian-700 rounded-lg" />
        </div>
        <div className="flex gap-2 mb-6 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-8 w-20 bg-obsidian-700 rounded-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-obsidian-700/50 bg-obsidian-900/50 p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-xl bg-obsidian-700 shimmer" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-2/3 bg-obsidian-700 rounded shimmer" />
                  <div className="h-3 w-full bg-obsidian-700 rounded shimmer" />
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <div className="h-3 w-20 bg-obsidian-700 rounded shimmer" />
                <div className="h-3 w-16 bg-obsidian-700 rounded shimmer" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
