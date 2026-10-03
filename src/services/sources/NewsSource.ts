import type { ArticleQuery, SourceId, SourcePage } from '@/types/news';

/**
 * The contract every news provider adapter implements. The rest of the app
 * depends only on this abstraction (Dependency Inversion), so providers are
 * interchangeable (Liskov) and new ones plug in without touching the UI.
 */
export interface NewsSource {
  readonly id: SourceId;
  /** Fetches one 1-based page of normalised articles. */
  fetchPage(query: ArticleQuery, page: number, signal?: AbortSignal): Promise<SourcePage>;
}
