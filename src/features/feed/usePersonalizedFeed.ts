import { useMemo } from 'react';
import { useArticles } from '@/features/articles/useArticles';
import { usePreferences } from '@/features/preferences/preferencesStore';
import { byNewest, dedupeArticles } from '@/services/aggregator';
import type { CategoryId } from '@/types/news';
import { bylineMatches } from '@/utils/text';

/**
 * The "For you" feed:
 * - stories from the preferred sources and categories (optionally narrowed to one category tab);
 * - plus a dedicated query for followed authors, since no provider can filter
 *   reliably by author — we search their names, then keep only matching bylines.
 */
export function usePersonalizedFeed(activeCategory: CategoryId | null) {
  const sources = usePreferences((s) => s.sources);
  const preferredCategories = usePreferences((s) => s.categories);
  const authors = usePreferences((s) => s.authors);

  const categoryQuery = useMemo(
    () => ({
      keyword: '',
      categories: activeCategory ? [activeCategory] : preferredCategories,
    }),
    [activeCategory, preferredCategories],
  );
  const feed = useArticles(sources, categoryQuery);

  const authorQuery = useMemo(
    () => ({ keyword: authors.map((a) => `"${a}"`).join(' OR '), categories: [] }),
    [authors],
  );
  const authorFeed = useArticles(sources, authorQuery, { enabled: authors.length > 0 });

  const fromFollowedAuthors = useMemo(
    () =>
      dedupeArticles([...authorFeed.articles, ...feed.articles])
        .filter((article) => bylineMatches(article.author, authors))
        .sort(byNewest),
    [authorFeed.articles, feed.articles, authors],
  );

  return {
    feed,
    authors,
    fromFollowedAuthors,
    isLoadingAuthors: authorFeed.isLoading,
  };
}
