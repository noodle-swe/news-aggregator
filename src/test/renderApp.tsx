import { render } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider, type RouteObject } from 'react-router';
import { AppProviders } from '@/app/AppProviders';
import type { NewsSource } from '@/services/sources/NewsSource';
import { createSourceRegistry } from '@/services/sources/registry';

/** Renders routes with real providers but injected (fake) news sources. */
export function renderRoutes(
  routes: RouteObject[],
  { url = '/', sources }: { url?: string; sources: NewsSource[] },
) {
  const router = createMemoryRouter(routes, { initialEntries: [url] });
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  render(
    <AppProviders registry={createSourceRegistry(sources)} queryClient={queryClient}>
      <RouterProvider router={router} />
    </AppProviders>,
  );
  return { router };
}
