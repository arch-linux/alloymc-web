export default function PackDetailLoading() {
  return (
    <div className="grid-overlay min-h-screen py-10">
      <div className="mx-auto max-w-5xl px-6 animate-pulse">
        {/* Header skeleton */}
        <div className="flex gap-5">
          <div className="w-20 h-20 rounded-2xl bg-obsidian-700 shimmer" />
          <div className="flex-1 space-y-3">
            <div className="h-8 w-64 bg-obsidian-700 rounded shimmer" />
            <div className="h-4 w-96 bg-obsidian-700 rounded shimmer" />
            <div className="flex gap-3 mt-2">
              <div className="h-5 w-20 bg-obsidian-700 rounded-full shimmer" />
              <div className="h-5 w-16 bg-obsidian-700 rounded-full shimmer" />
              <div className="h-5 w-24 bg-obsidian-700 rounded shimmer" />
            </div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-6 w-32 bg-obsidian-700 rounded shimmer" />
            <div className="rounded-xl border border-obsidian-700 bg-obsidian-900/50 p-6 space-y-3">
              <div className="h-4 w-full bg-obsidian-700 rounded shimmer" />
              <div className="h-4 w-5/6 bg-obsidian-700 rounded shimmer" />
              <div className="h-4 w-4/6 bg-obsidian-700 rounded shimmer" />
              <div className="h-4 w-full bg-obsidian-700 rounded shimmer" />
              <div className="h-4 w-3/4 bg-obsidian-700 rounded shimmer" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-6 w-24 bg-obsidian-700 rounded shimmer" />
            <div className="h-20 bg-obsidian-700 rounded-lg shimmer" />
            <div className="h-20 bg-obsidian-700 rounded-lg shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}
