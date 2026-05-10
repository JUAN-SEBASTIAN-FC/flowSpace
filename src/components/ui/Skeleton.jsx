export default function Skeleton({ className = '', count = 1, height = 'h-4' }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton ${height} ${className}`} />
      ))}
    </>
  );
}

export function CardSkeleton() {
  return (
    <div className="card p-5 space-y-4">
      <Skeleton className="w-1/3" height="h-3" />
      <Skeleton className="w-2/3" height="h-7" />
      <Skeleton className="w-1/2" height="h-3" />
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="card p-4 space-y-3">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="flex-1" height="h-4" />
          ))}
        </div>
      ))}
    </div>
  );
}