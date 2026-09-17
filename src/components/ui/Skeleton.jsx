import { cn } from "@/lib/cn";

export function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-md bg-surface-3", className)} aria-hidden />;
}

export function SkeletonRow({ lines = 3, className }) {
  return (
    <div className={cn("flex flex-col gap-3", className)} aria-hidden>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn("h-4 w-full", i % 3 === 2 && "w-2/3")} />
      ))}
    </div>
  );
}

/** Card-shaped placeholder mirroring list/grid item layouts. */
export function SkeletonCard({ className }) {
  return (
    <div className={cn("rounded-lg border border-edge bg-surface p-4", className)} aria-hidden>
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-14" />
      </div>
      <Skeleton className="mt-3 h-3 w-full" />
      <Skeleton className="mt-2 h-3 w-4/5" />
      <div className="mt-3 flex gap-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
      </div>
      <Skeleton className="mt-4 h-1.5 w-full" />
      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-3 w-20" />
        <div className="flex gap-1.5">
          <Skeleton className="h-6 w-6 rounded-md" />
          <Skeleton className="h-6 w-6 rounded-md" />
        </div>
      </div>
    </div>
  );
}

/** Responsive grid of card placeholders for list pages. */
export function SkeletonGrid({ cards = 6, columns = 3, className }) {
  return (
    <div
      className={cn(
        "grid gap-3 sm:grid-cols-2",
        columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
        className,
      )}
      aria-hidden
    >
      {Array.from({ length: cards }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}