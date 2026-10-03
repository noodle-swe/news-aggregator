import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';
import { AppShell } from '@/components/layout/AppShell';
import FeedPage from '@/pages/FeedPage';
import { RouteError } from './RouteError';

// The landing page ships in the main bundle; secondary pages are code-split.
const ExplorePage = lazy(() => import('@/pages/ExplorePage'));
const PreferencesPage = lazy(() => import('@/pages/PreferencesPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <FeedPage /> },
      { path: 'explore', element: <ExplorePage /> },
      { path: 'preferences', element: <PreferencesPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
