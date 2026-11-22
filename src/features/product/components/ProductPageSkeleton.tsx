import { useT } from "@/i18n/useT";
import { Skeleton } from "@/components/ui/Skeleton";

export function ProductPageSkeleton() {
  const { m } = useT();
  return (
    <div aria-busy="true" aria-label={m.common.loading}>
      <Skeleton className="h-4 w-56" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <Skeleton className="aspect-[4/5] rounded-[var(--radius-card)]" />
          <div className="mt-3 flex gap-3">
            <Skeleton className="size-20 sm:size-24" />
            <Skeleton className="size-20 sm:size-24" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-14 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="mt-8 h-16 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
