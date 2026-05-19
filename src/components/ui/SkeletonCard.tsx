export function SkeletonCard() {
  return (
    <div className="surface-card animate-pulse">
      <div className="card-body gap-4">
        <div className="flex justify-between gap-2">
          <div className="h-6 w-2/3 rounded-lg bg-base-300" />
          <div className="h-6 w-12 rounded-full bg-base-300" />
        </div>
        <div className="h-4 w-1/2 rounded bg-base-300" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 rounded-lg bg-base-300" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
