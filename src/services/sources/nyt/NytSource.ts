import { getCategory } from '@/config/categories';
import { buildQuery, getJson } from '@/services/http/httpClient';
import type { ArticleQuery, SourcePage } from '@/types/news';
import { toCompactDate } from '@/utils/date';
import type { NewsSource } from '../NewsSource';
import { mapNytDocs } from './mapper';
import type { NytResponse } from './types';

/** NYT returns a fixed 10 results per page and allows at most 100 pages. */
const PAGE_SIZE = 10;
const MAX_PAGES = 100;

/** Builds a Lucene filter query: `section_name:("Technology" "Science")`. */
export function buildSectionFilter(sections: string[]): string | undefined {
  if (sections.length === 0) return undefined;
  return `section_name:(${sections.map((s) => `"${s}"`).join(' ')})`;
}

export class NytSource implements NewsSource {
  readonly id = 'nyt' as const;

  async fetchPage(query: ArticleQuery, page: number, signal?: AbortSignal): Promise<SourcePage> {
    const sections = query.categories.flatMap((id) => getCategory(id).providers.nyt);

    const url = `/api/nyt/svc/search/v2/articlesearch.json${buildQuery({
      q: query.keyword,
      fq: buildSectionFilter(sections),
      begin_date: query.from && toCompactDate(query.from),
      end_date: query.to && toCompactDate(query.to),
      sort: 'newest',
      page: page - 1, // NYT pages are 0-based.
    })}`;

    const { response } = await getJson<NytResponse>(url, signal);
    const hits = response.metadata?.hits ?? response.meta?.hits ?? 0;
    return {
      articles: mapNytDocs(response.docs ?? []),
      hasMore: page < MAX_PAGES && page * PAGE_SIZE < hits,
    };
  }
}
