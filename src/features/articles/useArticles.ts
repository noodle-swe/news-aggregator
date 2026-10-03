import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { dedupeArticles, fetchAggregatedPage, type SourceFailure } from '@/services/aggregator';
import { useSourceRegistry } from '@/services/sources/SourceRegistryContext';
import type { Article, ArticleQuery, SourceId } from '@/types/news';

interface PageParam {
  page: number;
  sources: SourceId[];
}

export interface ArticlesResult {
  articles: Article[];
  failures: SourceFailure[];
  isLoading: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  refetch: () => void;
}

/** Infinite, cached, multi-source article list — the one data hook every page uses. */
export function useArticles(
  sourceIds: SourceId[],
  query: ArticleQuery,
  { enabled = true }: { enabled?: boolean } = {},
): ArticlesResult {
  const registry = useSourceRegistry();
  const sources = useMemo(() => [...sourceIds].sort(), [sourceIds]);
  const normalizedQuery = useMemo(
    () => ({ ...query, categories: [...query.categories].sort() }),
    [query],
  );

  const result = useInfiniteQuery({
    queryKey: ['articles', sources, normalizedQuery],
    initialPageParam: { page: 1, sources } satisfies PageParam,
    queryFn: ({ pageParam, signal }) =>
      fetchAggregatedPage(registry, pageParam.sources, normalizedQuery, pageParam.page, signal),
    getNextPageParam: (lastPage, _pages, lastParam): PageParam | undefined =>
      lastPage.nextSources.length > 0
        ? { page: lastParam.page + 1, sources: lastPage.nextSources }
        : undefined,
    enabled: enabled && sources.length > 0,
  });

  const { data, fetchNextPage: fetchNext, refetch: refetchAll } = result;
  // Stable callbacks so consumers can safely use them in effect dependencies.
  const fetchNextPage = useCallback(() => void fetchNext(), [fetchNext]);
  const refetch = useCallback(() => void refetchAll(), [refetchAll]);
  const articles = useMemo(
    () => dedupeArticles(data?.pages.flatMap((page) => page.articles) ?? []),
    [data],
  );
  // Report each failing source once, with its most recent error.
  const failures = useMemo(() => {
    const bySource = new Map<SourceId, SourceFailure>();
    data?.pages.forEach((page) => page.failures.forEach((f) => bySource.set(f.sourceId, f)));
    return [...bySource.values()];
  }, [data]);

  return {
    articles,
    failures,
    isLoading: result.isPending && enabled && sources.length > 0,
    isError: result.isError,
    isFetchingNextPage: result.isFetchingNextPage,
    hasNextPage: result.hasNextPage,
    fetchNextPage,
    refetch,
  };
}
