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