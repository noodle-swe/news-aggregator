import { Skeleton } from '@/components/ui/Skeleton';
import { articleGridClass, leadCellClass } from './grid';

function CardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[16/10] w-full rounded-xl" />
      <Skeleton className="mt-4 h-3 w-1/3" />
      <Skeleton className="mt-3 h-5 w-full" />
      <Skeleton className="mt-2 h-5 w-4/5" />
      <Skeleton className="mt-3 h-4 w-2/3" />
    </div>
  );
}

export function ArticleGridSkeleton({
  withLead = false,
  count = 6,
}: {
  withLead?: boolean;
  count?: number;
}) {
  return (
    <div className="@container" role="status" aria-label="Loading articles">
      <div className={articleGridClass}>
        {withLead && (
          <div
            className={`${leadCellClass} @3xl:grid @3xl:grid-cols-[3fr_2fr] @3xl:items-center @3xl:gap-8`}
          >
            <Skeleton className="aspect-[16/10] w-full rounded-xl @3xl:aspect-[4/3]" />
            <div className="pt-4">
              <Skeleton className="h-3 w-1/4" />
              <Skeleton className="mt-4 h-8 w-full" />
              <Skeleton className="mt-2 h-8 w-3/4" />
              <Skeleton className="mt-4 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-5/6" />
            </div>
          </div>
        )}
        {Array.from({ length: count }, (_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
