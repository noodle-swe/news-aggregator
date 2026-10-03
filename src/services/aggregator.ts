import type { Article, ArticleQuery, SourceId } from '@/types/news';
import { ApiError } from './http/httpClient';
import type { SourceRegistry } from './sources/registry';

export interface SourceFailure {
  sourceId: SourceId;
  message: string;
  /** True when the provider rejected our API key (missing/invalid). */
  unauthorized: boolean;
}

export interface AggregatedPage {
  articles: Article[];
  failures: SourceFailure[];
  /** Sources that still have results — the next page only asks these. */
  nextSources: SourceId[];
}

export function byNewest(a: Article, b: Article): number {
  return Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
}

/** Removes duplicates (same URL syndicated by several providers), keeping the first. */
export function dedupeArticles(articles: Article[]): Article[] {
  const seen = new Set<string>();
  return articles.filter((article) => {
    const key = article.url.replace(/[?#].*$/, '').replace(/\/$/, '');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function toFailure(sourceId: SourceId, error: unknown): SourceFailure {
  if (error instanceof ApiError) {
    return {
      sourceId,
      message: error.message,
      unauthorized: error.status === 401 || error.status === 403,
    };
  }
  return { sourceId, message: 'Something went wrong', unauthorized: false };
}

/**
 * Queries several sources in parallel. One failing provider never breaks the
 * page: its error is reported alongside the articles from the others.
 */
export async function fetchAggregatedPage(
  registry: SourceRegistry,
  sourceIds: SourceId[],
  query: ArticleQuery,
  page: number,
  signal?: AbortSignal,
): Promise<AggregatedPage> {
  const sources = sourceIds.flatMap((id) => registry.get(id) ?? []);
  const settled = await Promise.allSettled(
    sources.map((source) => source.fetchPage(query, page, signal)),
  );

  const articles: Article[] = [];
  const failures: SourceFailure[] = [];
  const nextSources: SourceId[] = [];

  settled.forEach((result, index) => {
    const sourceId = sources[index]!.id;
    if (result.status === 'fulfilled') {
      articles.push(...result.value.articles);
      if (result.value.hasMore) nextSources.push(sourceId);
    } else {
      failures.push(toFailure(sourceId, result.reason));
    }
  });

  return { articles: dedupeArticles(articles).sort(byNewest), failures, nextSources };
}
