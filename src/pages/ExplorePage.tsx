import { SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ArticleFeed } from '@/components/article/ArticleFeed';
import { ActiveFilters } from '@/components/filters/ActiveFilters';
import { FilterPanel } from '@/components/filters/FilterPanel';
import { Button } from '@/components/ui/Button';
import { SearchField } from '@/components/ui/SearchField';
import { Sheet } from '@/components/ui/Sheet';
import { useArticles } from '@/features/articles/useArticles';
import { useSearchFilters } from '@/features/search/useSearchFilters';
import { SOURCE_IDS } from '@/types/news';

export default function ExplorePage() {
  const { filters, update, clear, activeCount } = useSearchFilters();
  const [sheetOpen, setSheetOpen] = useState(false);

  const sources = useMemo(
    () => (filters.sources.length > 0 ? filters.sources : [...SOURCE_IDS]),
    [filters.sources],
  );
  const query = useMemo(
    () => ({
      keyword: filters.keyword,
      from: filters.from,
      to: filters.to,
      categories: filters.categories,
    }),
    [filters.keyword, filters.from, filters.to, filters.categories],
  );
  const result = useArticles(sources, query);

  return (
    <>
      <header className="animate-fade-in mx-auto mb-8 max-w-3xl text-center lg:mb-12">
        <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">Explore</h1>
        <p className="text-ink-muted mt-3 text-base sm:text-lg">
          Search across NewsAPI, The Guardian and The New York Times.
        </p>
        <SearchField
          size="lg"
          value={filters.keyword}
          onSubmit={(keyword) => update({ keyword })}
          autoFocus={!filters.keyword}
          className="mt-6"
        />
      </header>

      <div className="lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12">
        <aside aria-label="Filters" className="hidden lg:block">
          <div className="sticky top-24">
            <div className="border-ink mb-5 flex items-center justify-between border-t-2 pt-3">
              <h2 className="font-serif text-2xl font-semibold">Filters</h2>
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={clear}
                  className="text-accent text-sm font-medium hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
            <FilterPanel filters={filters} onChange={update} />
          </div>
        </aside>

        <section aria-labelledby="results-heading" className="min-w-0">
          <div className="border-ink mb-5 flex items-end justify-between gap-4 border-t-2 pt-3">
            <h2
              id="results-heading"
              className="min-w-0 truncate font-serif text-2xl font-semibold"
              aria-live="polite"
            >
              {filters.keyword ? <>Results for “{filters.keyword}”</> : 'Latest stories'}
            </h2>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSheetOpen(true)}
              className="lg:hidden"
            >
              <SlidersHorizontal aria-hidden className="size-4" />
              Filters
              {activeCount > 0 && (
                <span className="bg-accent text-accent-ink -mr-1 flex size-5 items-center justify-center rounded-full text-[11px] font-bold">
                  {activeCount}
                </span>
              )}
            </Button>
          </div>

          <div className="mb-6 empty:hidden">
            <ActiveFilters filters={filters} onChange={update} onClear={clear} />
          </div>

          <ArticleFeed
            result={result}
            empty={{
              title: 'No stories match',
              description: 'Try a different keyword, widen the date range or remove some filters.',
              action:
                activeCount > 0 ? (
                  <Button variant="secondary" onClick={clear}>
                    Clear filters
                  </Button>
                ) : undefined,
            }}
          />
        </section>
      </div>

      <Sheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Filters"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={clear}
              disabled={activeCount === 0}
              className="flex-1"
            >
              Reset
            </Button>
            <Button onClick={() => setSheetOpen(false)} className="flex-[2]">
              Show results
            </Button>
          </div>
        }
      >
        <FilterPanel filters={filters} onChange={update} />
      </Sheet>
    </>
  );
}
