export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-neutral-950 animate-pulse">
      {/* Header skeleton */}
      <div className="grid-bg border-b border-neutral-800 px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="h-3 w-32 shimmer rounded" />
          <div className="h-10 w-80 shimmer rounded" />
          <div className="flex gap-6">
            <div className="h-4 w-48 shimmer rounded" />
            <div className="h-4 w-48 shimmer rounded" />
          </div>
          {/* Progress bar */}
          <div className="h-2 w-full bg-neutral-800 rounded mt-4">
            <div className="h-2 w-1/3 bg-neutral-700 rounded" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="panel">
            <div className="h-1 w-full shimmer" />
            <div className="p-5 space-y-3">
              <div className="h-5 w-40 shimmer rounded" />
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-14 w-full shimmer rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
