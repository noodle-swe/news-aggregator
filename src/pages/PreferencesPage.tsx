import { Check, Plus, RotateCcw, UserPlus } from 'lucide-react';
import { useId, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router';
import { CategoryChips } from '@/components/filters/CategoryChips';
import { Button } from '@/components/ui/Button';
import { buttonStyles } from '@/components/ui/buttonStyles';
import { RemovableChip } from '@/components/ui/Chip';
import { SOURCES } from '@/config/sources';
import { usePreferences } from '@/features/preferences/preferencesStore';
import { useSuggestedAuthors } from '@/features/preferences/useSuggestedAuthors';
import { cn } from '@/utils/cn';

function PreferenceSection({
  id,
  step,
  title,
  description,
  children,
}: {
  id: string;
  step: number;
  title: string;
  description: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="border-line grid scroll-mt-24 gap-5 border-t py-10 md:grid-cols-[16rem_minmax(0,1fr)] md:gap-10"
    >
      <div>
        <p className="text-accent font-serif text-sm font-semibold">0{step}</p>
        <h2 id={`${id}-title`} className="mt-1 font-serif text-2xl font-semibold tracking-tight">
          {title}
        </h2>
        <p className="text-ink-muted mt-2 text-sm leading-relaxed">{description}</p>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function SourcePicker() {
  const selected = usePreferences((s) => s.sources);
  const toggleSource = usePreferences((s) => s.toggleSource);

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {SOURCES.map((source) => {
        const isSelected = selected.includes(source.id);
        const isLast = isSelected && selected.length === 1;
        return (
          <button
            key={source.id}
            type="button"
            aria-pressed={isSelected}
            disabled={isLast}
            title={isLast ? 'Keep at least one source' : undefined}
            onClick={() => toggleSource(source.id)}
            className={cn(
              'bg-surface relative flex flex-col items-start rounded-2xl border p-4 text-left transition-[border-color,box-shadow] duration-200 disabled:cursor-not-allowed',
              isSelected
                ? 'border-ink shadow-[inset_0_0_0_1px_var(--ink)]'
                : 'border-line-strong hover:border-ink/40',
            )}
          >
            <span
              aria-hidden
              className={cn(
                'absolute top-4 right-4 flex size-5 items-center justify-center rounded-full border transition-colors',
                isSelected ? 'border-ink bg-ink text-paper' : 'border-line-strong',
              )}
            >
              {isSelected && <Check className="size-3.5" strokeWidth={3} />}
            </span>
            <span className={cn('mb-3 size-2.5 rounded-full', source.dotClass)} aria-hidden />
            <span className="pr-6 font-serif text-lg font-semibold">{source.name}</span>
            <span className="text-ink-muted mt-1 text-sm leading-snug">{source.description}</span>
          </button>
        );
      })}
    </div>
  );
}

function TopicPicker() {
  const categories = usePreferences((s) => s.categories);
  const toggleCategory = usePreferences((s) => s.toggleCategory);
  return <CategoryChips selected={categories} onToggle={toggleCategory} />;
}

function AuthorPicker() {
  const authors = usePreferences((s) => s.authors);
  const followAuthor = usePreferences((s) => s.followAuthor);
  const unfollowAuthor = usePreferences((s) => s.unfollowAuthor);
  const suggestions = useSuggestedAuthors(authors);
  const [draft, setDraft] = useState('');
  const inputId = useId();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    followAuthor(draft);
    setDraft('');
  };

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="flex gap-2">
        <label htmlFor={inputId} className="sr-only">
          Author name
        </label>
        <input
          id={inputId}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="e.g. Paul Krugman"
          autoComplete="off"
          className="border-line-strong bg-surface text-ink placeholder:text-ink-subtle hover:border-ink/30 focus:border-ink h-11 min-w-0 flex-1 rounded-full border px-4 text-sm transition-colors focus:outline-none"
        />
        <Button type="submit" disabled={!draft.trim()}>
          <UserPlus aria-hidden className="size-4" />
          Follow
        </Button>
      </form>

      <div>
        <h3 className="text-ink-muted mb-3 text-xs font-semibold tracking-wider uppercase">
          Following{authors.length > 0 && ` · ${authors.length}`}
        </h3>
        {authors.length === 0 ? (
          <p className="text-ink-muted text-sm">
            You’re not following anyone yet. Add a name above, or tap{' '}
            <strong className="text-ink font-semibold">Follow</strong> on any story.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {authors.map((author) => (
              <li key={author}>
                <RemovableChip
                  removeLabel={`Unfollow ${author}`}
                  onRemove={() => unfollowAuthor(author)}
                >
                  {author}
                </RemovableChip>
              </li>
            ))}
          </ul>
        )}
      </div>

      {suggestions.length > 0 && (
        <div>
          <h3 className="text-ink-muted mb-3 text-xs font-semibold tracking-wider uppercase">
            Suggested from your reading
          </h3>
          <ul className="flex flex-wrap gap-2">
            {suggestions.map((author) => (
              <li key={author}>
                <button
                  type="button"
                  onClick={() => followAuthor(author)}
                  className="border-line-strong text-ink-muted hover:border-ink/40 hover:text-ink inline-flex h-9 items-center gap-1.5 rounded-full border border-dashed px-3.5 text-sm font-medium transition-colors"
                >
                  <Plus aria-hidden className="size-3.5" />
                  {author}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function PreferencesPage() {
  const reset = usePreferences((s) => s.reset);

  return (
    <div className="mx-auto max-w-5xl">
      <header className="animate-fade-in mb-2 pb-8">
        <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          Personalize your feed
        </h1>
        <p className="text-ink-muted mt-3 max-w-2xl text-base leading-relaxed sm:text-lg">
          Choose the sources, topics and writers that shape{' '}
          <strong className="text-ink font-semibold">For you</strong>. Changes save automatically on
          this device.
        </p>
      </header>

      <PreferenceSection
        id="sources"
        step={1}
        title="Sources"
        description="Where your stories come from. Keep at least one."
      >
        <SourcePicker />
      </PreferenceSection>

      <PreferenceSection
        id="topics"
        step={2}
        title="Topics"
        description="Pick the subjects you care about. Leave empty for top stories across every topic."
      >
        <TopicPicker />
      </PreferenceSection>

      <PreferenceSection
        id="authors"
        step={3}
        title="Authors"
        description="Follow writers to get a dedicated row of their latest stories in your feed."
      >
        <AuthorPicker />
      </PreferenceSection>

      <div className="border-line flex flex-col-reverse gap-3 border-t pt-8 sm:flex-row sm:justify-between">
        <Button variant="ghost" onClick={reset}>
          <RotateCcw aria-hidden className="size-4" />
          Reset to defaults
        </Button>
        <Link to="/" className={buttonStyles()}>
          View my feed
        </Link>
      </div>
    </div>
  );
}
