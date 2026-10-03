import { ArrowRight, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { ArticleCard } from '@/components/article/ArticleCard';
import { ArticleFeed } from '@/components/article/ArticleFeed';
import { buttonStyles } from '@/components/ui/buttonStyles';
import { ToggleChip } from '@/components/ui/Chip';
import { HorizontalScroller } from '@/components/ui/HorizontalScroller';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Skeleton } from '@/components/ui/Skeleton';
import { CATEGORIES, getCategory } from '@/config/categories';
import { getSource } from '@/config/sources';
import { usePersonalizedFeed } from '@/features/feed/usePersonalizedFeed';
import { usePreferences } from '@/features/preferences/preferencesStore';
import { SOURCE_IDS, type Article, type CategoryId } from '@/types/news';
import { formatLongDate } from '@/utils/date';

function greeting(hour = new Date().getHours()): string {
  if (hour < 5) return 'Good evening';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function listFormat(items: string[]): string {
  return new Intl.ListFormat('en', { style: 'long', type: 'conjunction' }).format(items);
}

function Masthead() {
  const sources = usePreferences((s) => s.sources);
  const categories = usePreferences((s) => s.categories);
  const authors = usePreferences((s) => s.authors);
  const isPersonalized =
    categories.length > 0 || authors.length > 0 || sources.length !== SOURCE_IDS.length;

  return (
    <header className="animate-fade-in border-line mb-8 border-b pb-8 lg:mb-10">
      <p className="text-accent text-xs font-semibold tracking-[0.14em] uppercase">
        {formatLongDate()}
      </p>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        {greeting()}.
      </h1>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <p className="text-ink-muted max-w-2xl text-base leading-relaxed text-pretty sm:text-lg">
          Your briefing from {listFormat(sources.map((id) => getSource(id).name))}
          {categories.length > 0 && (
            <> on {listFormat(categories.map((id) => getCategory(id).label.toLowerCase()))}</>
          )}
          .
        </p>
        <Link
          to="/preferences"
          className={buttonStyles({
            variant: 'secondary',
            size: 'sm',
            className: 'self-start sm:self-auto',
          })}
        >
          <Sparkles aria-hidden className="size-4" />
          {isPersonalized ? 'Edit preferences' : 'Personalize'}
        </Link>
      </div>
    </header>
  );
}

function CategoryTabs({
  active,
  onChange,
}: {
  active: CategoryId | null;
  onChange: (id: CategoryId | null) => void;
}) {
  const preferred = usePreferences((s) => s.categories);
  const ids = preferred.length > 0 ? preferred : CATEGORIES.map((c) => c.id);
  if (ids.length < 2) return null;

  return (
    <HorizontalScroller label="Filter feed by topic" className="mb-8">
      <ToggleChip selected={active === null} onToggle={() => onChange(null)}>
        {preferred.length > 0 ? 'All my topics' : 'Top stories'}
      </ToggleChip>
      {ids.map((id) => {
        const category = getCategory(id);
        return (
          <ToggleChip
            key={id}
            icon={category.icon}
            selected={active === id}
            onToggle={() => onChange(id)}
          >
            {category.label}
          </ToggleChip>
        );
      })}
    </HorizontalScroller>
  );
}

function FollowedAuthorsRail({ articles, isLoading }: { articles: Article[]; isLoading: boolean }) {
  return (
    <section aria-labelledby="followed-authors" className="mb-12">
      <SectionHeading
        id="followed-authors"
        title="From authors you follow"
        action={
          <Link
            to="/preferences#authors"
            className="text-ink-muted hover:text-ink flex shrink-0 items-center gap-1 text-sm font-medium"
          >
            Manage <ArrowRight aria-hidden className="size-4" />
          </Link>
        }
      />
      {isLoading ? (
        <div className="flex gap-4 overflow-hidden">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-36 w-80 shrink-0 rounded-2xl" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <p className="border-line-strong text-ink-muted rounded-2xl border border-dashed px-5 py-6 text-sm">
          No recent stories from the authors you follow. We’ll show them here as soon as they
          publish.
        </p>
      ) : (
        <HorizontalScroller label="Stories from followed authors" className="gap-4 pb-1">
          {articles.slice(0, 12).map((article) => (
            <div key={article.id} className="w-[85%] max-w-sm shrink-0 snap-start sm:w-96">
              <ArticleCard article={article} variant="compact" />
            </div>
          ))}
        </HorizontalScroller>
      )}
    </section>
  );
}

export default function FeedPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
  const preferredCategories = usePreferences((s) => s.categories);
  // If the active tab was removed in preferences, fall back to "all".
  const effectiveCategory =
    activeCategory &&
    (preferredCategories.length === 0 || preferredCategories.includes(activeCategory))
      ? activeCategory
      : null;

  const { feed, authors, fromFollowedAuthors, isLoadingAuthors } =
    usePersonalizedFeed(effectiveCategory);

  return (
    <>
      <Masthead />
      <CategoryTabs active={effectiveCategory} onChange={setActiveCategory} />
      {authors.length > 0 && (
        <FollowedAuthorsRail articles={fromFollowedAuthors} isLoading={isLoadingAuthors} />
      )}

      <section aria-labelledby="top-stories">
        <SectionHeading
          id="top-stories"
          title={effectiveCategory ? getCategory(effectiveCategory).label : 'Top stories'}
        />
        <ArticleFeed
          result={feed}
          withLead
          empty={{
            title: 'Nothing here yet',
            description:
              'There are no recent stories for your current preferences. Try adding more topics or sources.',
            action: (
              <Link to="/preferences" className={buttonStyles()}>
                Update preferences
              </Link>
            ),
          }}
        />
      </section>
    </>
  );
}
