import {
  guardianResponse,
  mockFetchJson,
  newsApiResponse,
  nytResponseCurrent,
  nytResponseLegacy,
  requestedUrl,
} from '@/test/fixtures';
import { GuardianSource } from './guardian/GuardianSource';
import { NewsApiSource } from './newsapi/NewsApiSource';
import { NytSource } from './nyt/NytSource';

afterEach(() => vi.unstubAllGlobals());

describe('NewsApiSource', () => {
  const source = new NewsApiSource();

  it('uses /everything with dates for keyword searches', async () => {
    const fetchMock = mockFetchJson(newsApiResponse);
    await source.fetchPage(
      { keyword: 'rates', from: '2026-09-01', to: '2026-09-30', categories: [] },
      1,
    );

    const url = requestedUrl(fetchMock);
    expect(url.pathname).toBe('/api/newsapi/v2/everything');
    expect(url.searchParams.get('q')).toBe('rates');
    expect(url.searchParams.get('from')).toBe('2026-09-01');
    expect(url.searchParams.get('to')).toBe('2026-09-30');
  });

  it('fans out to /top-headlines once per category', async () => {
    const fetchMock = mockFetchJson(newsApiResponse);
    await source.fetchPage({ keyword: '', categories: ['business', 'sports'] }, 1);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(requestedUrl(fetchMock, 0).searchParams.get('category')).toBe('business');
    expect(requestedUrl(fetchMock, 1).searchParams.get('category')).toBe('sports');
  });

  it('normalises articles: drops removed items, cleans titles and URL authors', async () => {
    mockFetchJson(newsApiResponse);
    const { articles, hasMore } = await source.fetchPage({ keyword: 'x', categories: [] }, 1);

    expect(articles).toHaveLength(2);
    expect(articles[0]).toMatchObject({
      title: 'Markets rally on rate cut hopes',
      summary: 'Stocks climbed & bonds rallied.',
      author: 'Jane Doe',
      publisher: 'BBC News',
      sourceId: 'newsapi',
    });
    expect(articles[1]!.author).toBeNull();
    expect(hasMore).toBe(false);
  });
});

describe('GuardianSource', () => {
  it('ORs category sections and maps fields', async () => {
    const fetchMock = mockFetchJson(guardianResponse);
    const { articles, hasMore } = await new GuardianSource().fetchPage(
      { keyword: 'comet', from: '2026-10-01', categories: ['science', 'technology'] },
      1,
    );

    const url = requestedUrl(fetchMock);
    expect(url.searchParams.get('section')).toBe('science|environment|technology');
    expect(url.searchParams.get('from-date')).toBe('2026-10-01');
    expect(url.searchParams.get('show-fields')).toContain('byline');
    expect(hasMore).toBe(true);
    expect(articles[0]).toMatchObject({
      title: 'A comet will be visible this week',
      summary: 'Astronomers say it’s the brightest in a decade',
      author: 'Ian Sample',
      section: 'Science',
      imageUrl: 'https://media.guim.co.uk/comet.jpg',
    });
  });
});

describe('NytSource', () => {
  const source = new NytSource();

  it('builds a Lucene section filter, compact dates and 0-based pages', async () => {
    const fetchMock = mockFetchJson(nytResponseLegacy);
    await source.fetchPage(
      { keyword: 'ai', from: '2026-09-01', to: '2026-09-30', categories: ['technology'] },
      2,
    );

    const url = requestedUrl(fetchMock);
    expect(url.searchParams.get('fq')).toBe('section_name:("Technology")');
    expect(url.searchParams.get('begin_date')).toBe('20260901');
    expect(url.searchParams.get('end_date')).toBe('20260930');
    expect(url.searchParams.get('page')).toBe('1');
  });

  it('handles the legacy response shape (meta + multimedia array)', async () => {
    mockFetchJson(nytResponseLegacy);
    const { articles, hasMore } = await source.fetchPage({ keyword: '', categories: [] }, 1);

    expect(hasMore).toBe(true);
    expect(articles[0]).toMatchObject({
      author: 'Cade Metz',
      imageUrl: 'https://www.nytimes.com/images/2026/10/01/xlarge.jpg',
    });
  });

  it('handles the current response shape (metadata + multimedia object)', async () => {
    mockFetchJson(nytResponseCurrent);
    const { articles, hasMore } = await source.fetchPage({ keyword: '', categories: [] }, 1);

    expect(hasMore).toBe(false);
    expect(articles[0]).toMatchObject({
      summary: 'Rover finds water ice.',
      imageUrl: 'https://static01.nyt.com/mars.jpg',
    });
  });

  it('surfaces HTTP errors as typed ApiErrors', async () => {
    mockFetchJson({ fault: 'rate limit' }, 429);
    await expect(source.fetchPage({ keyword: '', categories: [] }, 1)).rejects.toMatchObject({
      name: 'ApiError',
      status: 429,
    });
  });
});
