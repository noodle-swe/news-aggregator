export const SOURCE_IDS = ['newsapi', 'guardian', 'nyt'] as const;
export type SourceId = (typeof SOURCE_IDS)[number];

export const CATEGORY_IDS = [
  'general',
  'business',
  'technology',
  'science',
  'health',
  'sports',
  'entertainment',
] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

/** The single, provider-agnostic article shape the whole UI works with. */
export interface Article {
  /** Stable, unique id — the canonical article URL. */
  id: string;
  url: string;
  title: string;
  summary: string;
  imageUrl: string | null;
  author: string | null;
  /** ISO 8601 timestamp. */
  publishedAt: string;
  sourceId: SourceId;
  /** Human readable publisher, e.g. "BBC News" (via NewsAPI) or "The Guardian". */
  publisher: string;
  /** Provider section label, e.g. "Technology". */
  section: string | null;
}

/** What the user asked for — shared by search, filters and the personalised feed. */
export interface ArticleQuery {
  keyword: string;
  /** Inclusive start date, `YYYY-MM-DD`. */
  from?: string;
  /** Inclusive end date, `YYYY-MM-DD`. */
  to?: string;
  /** Empty means "all categories". */
  categories: CategoryId[];
}

export interface SourcePage {
  articles: Article[];
  hasMore: boolean;
}
