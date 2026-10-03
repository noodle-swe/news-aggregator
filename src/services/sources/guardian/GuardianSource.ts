import { getCategory } from '@/config/categories';
import { buildQuery, getJson } from '@/services/http/httpClient';
import type { ArticleQuery, SourcePage } from '@/types/news';
import type { NewsSource } from '../NewsSource';
import { mapGuardianResults } from './mapper';
import type { GuardianResponse } from './types';

const PAGE_SIZE = 20;

export class GuardianSource implements NewsSource {
  readonly id = 'guardian' as const;

  async fetchPage(query: ArticleQuery, page: number, signal?: AbortSignal): Promise<SourcePage> {
    // The Guardian accepts `a|b` to OR sections together.
    const sections = query.categories.flatMap((id) => getCategory(id).providers.guardian);

    const url = `/api/guardian/search${buildQuery({
      q: query.keyword,
      section: sections.join('|'),
      'from-date': query.from,
      'to-date': query.to,
      'order-by': 'newest',
      'show-fields': 'thumbnail,trailText,byline',
      'page-size': PAGE_SIZE,
      page,
    })}`;

    const { response } = await getJson<GuardianResponse>(url, signal);
    return {
      articles: mapGuardianResults(response.results),
      hasMore: response.currentPage < response.pages,
    };
  }
}
