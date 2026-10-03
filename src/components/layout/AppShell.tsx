import { Suspense } from 'react';
import { Outlet, ScrollRestoration } from 'react-router';
import { SOURCES } from '@/config/sources';
import { ArticleGridSkeleton } from '@/components/article/ArticleGridSkeleton';
import { Header } from './Header';
import { MobileNav } from './MobileNav';

export function AppShell() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="bg-ink text-paper sr-only z-50 rounded-full px-4 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <Header />

      <main
        id="main"
        className="mx-auto w-full max-w-7xl flex-1 px-4 pt-6 pb-28 sm:px-6 md:pb-16 lg:px-8 lg:pt-10"
      >
        <Suspense fallback={<ArticleGridSkeleton withLead />}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="border-line hidden border-t md:block">
        <div className="text-ink-subtle mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-6 py-6 text-sm lg:px-8">
          <p>Newsroom — a news aggregator case study.</p>
          <p>Powered by {SOURCES.map((s) => s.name).join(', ')}.</p>
        </div>
      </footer>

      <MobileNav />
      <ScrollRestoration />
    </div>
  );
}
