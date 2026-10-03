import { KeyRound, Loader2, Newspaper, RotateCw, WifiOff } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import type { ArticlesResult } from '@/features/articles/useArticles';
import { useInView } from '@/hooks/useInView';
import { ArticleCard } from './ArticleCard';
import { ArticleGridSkeleton } from './ArticleGridSkeleton';
import { articleGridClass, leadCellClass } from './grid';
import { SourceNotice } from './SourceNotice';

interface ArticleFeedProps {
  result: ArticlesResult;
  /** Promote the first story with an image to a full-width lead. */
  withLead?: boolean;
  empty: { title: string; description: ReactNode; action?: ReactNode };
}

/**
 * Renders any article list with every state handled consistently:
 * loading → error / missing keys → empty → results (+ partial failures) → infinite loading.
 */
export function ArticleFeed({ result, withLead = false, empty }: ArticleFeedProps) {
  const { articles, failures, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } =
    result;
  const { ref: sentinelRef, inView } = useInView<HTMLDivElement>();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <ArticleGridSkeleton withLead={withLead} />;

  if (articles.length === 0) {
    const allFailed = failures.length > 0 || result.isError;
    const keysMissing = failures.length > 0 && failures.every((f) => f.unauthorized);

    if (keysMissing) {
      return (
        <EmptyState
          icon={KeyRound}
          title="Connect your news sources"
          description={
            <>
              The news APIs rejected the request. Add{' '}
              <code className="text-ink font-mono">NEWSAPI_KEY</code>,{' '}
              <code className="text-ink font-mono">GUARDIAN_API_KEY</code> and{' '}
              <code className="text-ink font-mono">NYT_API_KEY</code> to your{' '}
              <code className="text-ink font-mono">.env</code> file and restart the app. See the
              README for details.
            </>
          }
        />
      );
    }
    if (allFailed) {
      return (
        <EmptyState
          icon={WifiOff}
          title="We couldn’t load the news"
          description={
            failures.map((f) => f.message).join(' · ') ||
            'Please check your connection and try again.'
          }
          action={
            <Button onClick={refetch}>
              <RotateCw aria-hidden className="size-4" />
              Try again
            </Button>
          }
        />
      );
    }
    return <EmptyState icon={Newspaper} {...empty} />;
  }

  const leadIndex = withLead ? articles.findIndex((a) => a.imageUrl) : -1;

  return (
    <div className="@container">
      <SourceNotice failures={failures} onRetry={refetch} />

      <ul className={articleGridClass}>
        {articles.map((article, index) => (
          <li
            key={article.id}
            className={index === leadIndex ? `${leadCellClass} -order-1` : undefined}
          >
            <ArticleCard article={article} variant={index === leadIndex ? 'lead' : 'standard'} />
          </li>
        ))}
      </ul>

      <div ref={sentinelRef} className="mt-12 flex justify-center">
        {isFetchingNextPage ? (
          <p role="status" className="text-ink-muted flex items-center gap-2 text-sm">
            <Loader2 aria-hidden className="size-4 animate-spin" />
            Loading more stories…
          </p>
        ) : hasNextPage ? (
          <Button variant="secondary" onClick={fetchNextPage}>
            Load more stories
          </Button>
        ) : (
          <p className="text-ink-subtle text-sm">You’re all caught up.</p>
        )}
      </div>
    </div>
  );
}
