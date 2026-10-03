import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { AggregatedPage } from '@/services/aggregator';
import { normalizeName } from '@/utils/text';

/**
 * Suggests authors from stories already in the query cache — no extra
 * requests, and the suggestions reflect what the user has actually been reading.
 */
export function useSuggestedAuthors(following: readonly string[], limit = 10): string[] {
  const queryClient = useQueryClient();

  return useMemo(() => {
    const followed = new Set(following.map(normalizeName));
    const counts = new Map<string, { name: string; count: number }>();

    for (const [, data] of queryClient.getQueriesData<InfiniteData<AggregatedPage>>({
      queryKey: ['articles'],
    })) {
      for (const page of data?.pages ?? []) {
        for (const { author } of page.articles) {
          if (!author || author.length > 40 || /,| and /i.test(author)) continue;
          const key = normalizeName(author);
          if (followed.has(key)) continue;
          const entry = counts.get(key) ?? { name: author, count: 0 };
          entry.count += 1;
          counts.set(key, entry);
        }
      }
    }

    return [...counts.values()]
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
      .slice(0, limit)
      .map((entry) => entry.name);
  }, [queryClient, following, limit]);
}
