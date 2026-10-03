import { getCategory } from '@/config/categories';
import { buildQuery, getJson } from '@/services/http/httpClient';
import type { ArticleQuery, CategoryId, SourcePage } from '@/types/news';
import { isWithinRange } from '@/utils/date';
import type { NewsSource } from '../NewsSource';
import { mapNewsApiArticles } from './mapper';
import type { NewsApiResponse } from './types';

const BASE_URL = '/api/newsapi/v2';
const PAGE_SIZE = 20;
/** The free Developer plan caps any query at 100 results. */
const MAX_RESULTS = 100;

/**
 * NewsAPI splits its features across two endpoints:
 * - `/everything` supports keyword + date range, but no category.
 * - `/top-headlines` supports category, but no date range.
 * We pick the endpoint per query and apply the date range client-side where needed.
 */
export class NewsApiSource implements NewsSource {
  readonly id = 'newsapi' as const;

  async fetchPage(query: ArticleQuery, page: number, signal?: AbortSignal): Promise<SourcePage> {
    if (query.categories.length > 0) {
      // Top-headlines takes a single category, so fan out and merge.
      const pages = await Promise.all(
        query.categories.map((category) => this.topHeadlines(query, page, signal, category)),
      );
      return {
        articles: pages.flatMap((p) => p.articles),
        hasMore: pages.some((p) => p.hasMore),
      };
    }
    if (query.keyword) return this.everything(query, page, signal);
    return this.topHeadlines(query, page, signal);
  }

  private async everything(query: ArticleQuery, page: number, signal?: AbortSignal) {
    const url = `${BASE_URL}/everything${buildQuery({
      q: query.keyword,
      from: query.from,
      to: query.to,
      language: 'en',
      sortBy: 'publishedAt',
      pageSize: PAGE_SIZE,
      page,
    })}`;
    return this.request(url, page, signal);
  }

  private async topHeadlines(
    query: ArticleQuery,
    page: number,
    signal?: AbortSignal,
    category?: CategoryId,
  ) {
    const url = `${BASE_URL}/top-headlines${buildQuery({
      country: 'us',
      category: category && getCategory(category).providers.newsapi,
      q: query.keyword,
      pageSize: PAGE_SIZE,
      page,
    })}`;
    const result = await this.request(url, page, signal, category && getCategory(category).label);
    return {
      ...result,
      articles: result.articles.filter((a) => isWithinRange(a.publishedAt, query.from, query.to)),
    };
  }

  private async request(
    url: string,
    page: number,
    signal?: AbortSignal,
    section?: string,
  ): Promise<SourcePage> {
    const data = await getJson<NewsApiResponse>(url, signal);
    const reachable = Math.min(data.totalResults, MAX_RESULTS);
    return {
      articles: mapNewsApiArticles(data.articles, section ?? null),
      hasMore: page * PAGE_SIZE < reachable,
    };
  }
}
