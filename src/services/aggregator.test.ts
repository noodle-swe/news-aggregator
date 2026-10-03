import { fakeSource, makeArticle } from '@/test/fixtures';
import { fetchAggregatedPage } from './aggregator';
import { ApiError } from './http/httpClient';
import { createSourceRegistry } from './sources/registry';

const query = { keyword: '', categories: [] };

describe('fetchAggregatedPage', () => {
  it('merges sources newest-first and removes duplicate URLs', async () => {
    const shared = 'https://example.com/shared';
    const registry = createSourceRegistry([
      fakeSource('guardian', async () => ({
        articles: [makeArticle({ url: shared, publishedAt: '2026-10-01T00:00:00Z' })],
        hasMore: true,
      })),
      fakeSource('nyt', async () => ({
        articles: [
          makeArticle({ url: `${shared}?utm=1`, sourceId: 'nyt' }),
          makeArticle({ title: 'Newest', sourceId: 'nyt', publishedAt: '2026-10-03T00:00:00Z' }),
        ],
        hasMore: false,
      })),
    ]);

    const page = await fetchAggregatedPage(registry, ['guardian', 'nyt'], query, 1);

    expect(page.articles.map((a) => a.title)).toEqual(['Newest', expect.any(String)]);
    expect(page.nextSources).toEqual(['guardian']);
    expect(page.failures).toEqual([]);
  });

  it('keeps successful results when one source fails', async () => {
    const registry = createSourceRegistry([
      fakeSource('guardian', async () => ({ articles: [makeArticle()], hasMore: false })),
      fakeSource('nyt', async () => {
        throw new ApiError(401, 'API key is missing or invalid');
      }),
    ]);

    const page = await fetchAggregatedPage(registry, ['guardian', 'nyt'], query, 1);

    expect(page.articles).toHaveLength(1);
    expect(page.failures).toEqual([
      { sourceId: 'nyt', message: 'API key is missing or invalid', unauthorized: true },
    ]);
  });

  it('only queries the requested sources', async () => {
    const guardian = fakeSource('guardian', async () => ({ articles: [], hasMore: false }));
    const nyt = fakeSource('nyt', async () => ({ articles: [], hasMore: false }));

    await fetchAggregatedPage(createSourceRegistry([guardian, nyt]), ['nyt'], query, 2);

    expect(guardian.fetchPage).not.toHaveBeenCalled();
    expect(nyt.fetchPage).toHaveBeenCalledWith(query, 2, undefined);
  });
});
