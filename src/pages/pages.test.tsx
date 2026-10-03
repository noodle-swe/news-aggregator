import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePreferences } from '@/features/preferences/preferencesStore';
import { ApiError } from '@/services/http/httpClient';
import { fakeSource, makeArticle } from '@/test/fixtures';
import { renderRoutes } from '@/test/renderApp';
import ExplorePage from './ExplorePage';
import FeedPage from './FeedPage';

beforeEach(() => act(() => usePreferences.getState().reset()));

describe('ExplorePage', () => {
  it('searches by keyword and filters by category through the URL', async () => {
    const guardian = fakeSource('guardian', async (query) => ({
      articles: [makeArticle({ title: `Guardian: ${query.keyword || 'latest'}` })],
      hasMore: false,
    }));
    const { router } = renderRoutes([{ path: '/explore', element: <ExplorePage /> }], {
      url: '/explore?source=guardian',
      sources: [guardian],
    });

    expect(await screen.findByText('Guardian: latest')).toBeInTheDocument();

    const user = userEvent.setup();
    await user.type(screen.getByRole('searchbox'), 'comet{Enter}');
    expect(await screen.findByText('Guardian: comet')).toBeInTheDocument();
    expect(router.state.location.search).toContain('q=comet');

    const sidebar = screen.getByRole('complementary', { name: 'Filters' });
    await user.click(within(sidebar).getByRole('button', { name: 'Science' }));
    await waitFor(() => expect(router.state.location.search).toContain('category=science'));
    expect(guardian.fetchPage).toHaveBeenLastCalledWith(
      expect.objectContaining({ keyword: 'comet', categories: ['science'] }),
      1,
      expect.anything(),
    );
  });

  it('shows results from healthy sources and a notice for failed ones', async () => {
    renderRoutes([{ path: '/explore', element: <ExplorePage /> }], {
      url: '/explore',
      sources: [
        fakeSource('guardian', async () => ({
          articles: [makeArticle({ title: 'Still here' })],
          hasMore: false,
        })),
        fakeSource('nyt', async () => {
          throw new ApiError(429, 'Rate limit reached — try again in a minute');
        }),
        fakeSource('newsapi', async () => ({ articles: [], hasMore: false })),
      ],
    });

    expect(await screen.findByText('Still here')).toBeInTheDocument();
    expect(screen.getByText(/One source is unavailable/)).toBeInTheDocument();
    expect(screen.getByText(/The New York Times: Rate limit reached/)).toBeInTheDocument();
  });

  it('explains how to add API keys when every source rejects the key', async () => {
    const unauthorized = async () => {
      throw new ApiError(401, 'API key is missing or invalid');
    };
    renderRoutes([{ path: '/explore', element: <ExplorePage /> }], {
      url: '/explore',
      sources: [
        fakeSource('guardian', unauthorized),
        fakeSource('nyt', unauthorized),
        fakeSource('newsapi', unauthorized),
      ],
    });

    expect(await screen.findByText('Connect your news sources')).toBeInTheDocument();
  });
});

describe('FeedPage', () => {
  it('lets the user follow an author and shows their stories in a dedicated row', async () => {
    const story = makeArticle({ title: 'Comet tonight', author: 'Ian Sample' });
    renderRoutes([{ path: '/', element: <FeedPage /> }], {
      sources: [
        fakeSource('guardian', async () => ({ articles: [story], hasMore: false })),
        fakeSource('nyt', async () => ({ articles: [], hasMore: false })),
        fakeSource('newsapi', async () => ({ articles: [], hasMore: false })),
      ],
    });

    await screen.findByText('Comet tonight');
    await userEvent.setup().click(screen.getByRole('button', { name: 'Follow Ian Sample' }));

    expect(usePreferences.getState().authors).toEqual(['Ian Sample']);
    expect(
      await screen.findByRole('heading', { name: 'From authors you follow' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Unfollow Ian Sample' }).length).toBeGreaterThan(
      0,
    );
  });

  it('only queries the preferred sources and categories', async () => {
    act(() => {
      usePreferences.getState().toggleSource('newsapi');
      usePreferences.getState().toggleCategory('technology');
    });
    const newsapi = fakeSource('newsapi', async () => ({ articles: [], hasMore: false }));
    const guardian = fakeSource('guardian', async () => ({
      articles: [makeArticle()],
      hasMore: false,
    }));
    const nyt = fakeSource('nyt', async () => ({ articles: [], hasMore: false }));

    renderRoutes([{ path: '/', element: <FeedPage /> }], { sources: [newsapi, guardian, nyt] });

    await waitFor(() => expect(guardian.fetchPage).toHaveBeenCalled());
    expect(newsapi.fetchPage).not.toHaveBeenCalled();
    expect(guardian.fetchPage).toHaveBeenCalledWith(
      expect.objectContaining({ categories: ['technology'] }),
      1,
      expect.anything(),
    );
  });
});
