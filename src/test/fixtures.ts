import type { GuardianResponse } from '@/services/sources/guardian/types';
import type { NewsApiResponse } from '@/services/sources/newsapi/types';
import type { NewsSource } from '@/services/sources/NewsSource';
import type { NytResponse } from '@/services/sources/nyt/types';
import type { Article, SourceId, SourcePage } from '@/types/news';

export const newsApiResponse: NewsApiResponse = {
  status: 'ok',
  totalResults: 3,
  articles: [
    {
      source: { id: 'bbc-news', name: 'BBC News' },
      author: 'Jane Doe',
      title: 'Markets rally on rate cut hopes - BBC News',
      description: 'Stocks climbed &amp; bonds rallied.',
      url: 'https://bbc.co.uk/news/markets',
      urlToImage: 'https://ichef.bbci.co.uk/markets.jpg',
      publishedAt: '2026-10-02T09:00:00Z',
      content: null,
    },
    {
      source: { id: null, name: '[Removed]' },
      author: null,
      title: '[Removed]',
      description: '[Removed]',
      url: 'https://removed.com',
      urlToImage: null,
      publishedAt: '2026-10-02T08:00:00Z',
      content: null,
    },
    {
      source: { id: null, name: 'Wired' },
      author: 'https://www.wired.com/author/someone',
      title: 'A new chip architecture',
      description: null,
      url: 'https://wired.com/chips',
      urlToImage: null,
      publishedAt: '2026-10-01T12:00:00Z',
      content: null,
    },
  ],
};

export const guardianResponse: GuardianResponse = {
  response: {
    status: 'ok',
    total: 45,
    currentPage: 1,
    pages: 3,
    results: [
      {
        id: 'science/2026/oct/02/comet',
        sectionName: 'Science',
        webPublicationDate: '2026-10-02T10:30:00Z',
        webTitle: 'A comet will be visible this week',
        webUrl: 'https://www.theguardian.com/science/2026/oct/02/comet',
        fields: {
          thumbnail: 'https://media.guim.co.uk/comet.jpg',
          trailText: '<p>Astronomers say it&#8217;s the brightest in a decade</p>',
          byline: 'Ian Sample',
        },
      },
    ],
  },
};

export const nytResponseLegacy: NytResponse = {
  response: {
    meta: { hits: 25 },
    docs: [
      {
        _id: 'nyt://article/1',
        web_url: 'https://www.nytimes.com/2026/10/01/technology/ai.html',
        abstract: 'A look at the newest AI models.',
        pub_date: '2026-10-01T15:00:00+0000',
        section_name: 'Technology',
        headline: { main: 'The A.I. Race Heats Up' },
        byline: { original: 'By Cade Metz' },
        multimedia: [
          { url: 'images/2026/10/01/thumb.jpg', subtype: 'thumbnail', width: 75 },
          { url: 'images/2026/10/01/xlarge.jpg', subtype: 'xlarge', width: 1050 },
        ],
      },
    ],
  },
};

export const nytResponseCurrent: NytResponse = {
  response: {
    metadata: { hits: 5 },
    docs: [
      {
        _id: 'nyt://article/2',
        web_url: 'https://www.nytimes.com/2026/10/02/science/mars.html',
        snippet: 'Rover finds water ice.',
        pub_date: '2026-10-02T11:00:00Z',
        section_name: 'Science',
        headline: { main: 'Water on Mars' },
        byline: { original: 'By Kenneth Chang' },
        multimedia: { default: { url: 'https://static01.nyt.com/mars.jpg' } },
      },
    ],
  },
};

let counter = 0;

export function makeArticle(overrides: Partial<Article> = {}): Article {
  counter += 1;
  const url = overrides.url ?? `https://example.com/story-${counter}`;
  return {
    id: url,
    url,
    title: `Story ${counter}`,
    summary: 'Summary',
    imageUrl: null,
    author: null,
    publishedAt: '2026-10-01T00:00:00Z',
    sourceId: 'guardian',
    publisher: 'The Guardian',
    section: null,
    ...overrides,
  };
}

/** A controllable in-memory source for aggregator and UI tests. */
export function fakeSource(
  id: SourceId,
  impl: (...args: Parameters<NewsSource['fetchPage']>) => Promise<SourcePage>,
): NewsSource & { fetchPage: ReturnType<typeof vi.fn> } {
  return { id, fetchPage: vi.fn(impl) };
}

/** Mocks global fetch with a JSON body and returns the mock for URL assertions. */
export function mockFetchJson(body: unknown, status = 200) {
  const mock = vi.fn(async () => new Response(JSON.stringify(body), { status }));
  vi.stubGlobal('fetch', mock);
  return mock;
}

export function requestedUrl(mock: ReturnType<typeof vi.fn>, call = 0): URL {
  return new URL(String(mock.mock.calls[call]![0]), 'http://localhost');
}
