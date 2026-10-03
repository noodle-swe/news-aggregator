import { Search, X } from 'lucide-react';
import { useId, useRef, useState, type FormEvent } from 'react';
import { cn } from '@/utils/cn';

interface SearchFieldProps {
  /** Committed value (e.g. from the URL). The field re-syncs when it changes. */
  value: string;
  onSubmit: (keyword: string) => void;
  size?: 'md' | 'lg';
  autoFocus?: boolean;
  className?: string;
  placeholder?: string;
}

/**
 * Submits on Enter rather than on every keystroke: it keeps the UI calm and
 * respects the providers' strict rate limits (NYT allows 5 requests/minute).
 */
export function SearchField({
  value,
  onSubmit,
  size = 'md',
  autoFocus,
  className,
  placeholder = 'Search news, topics, people…',
}: SearchFieldProps) {
  const [draft, setDraft] = useState(value);
  const [syncedValue, setSyncedValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  // Re-sync the draft when the committed value changes (e.g. back/forward navigation).
  if (value !== syncedValue) {
    setSyncedValue(value);
    setDraft(value);
  }

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(draft.trim());
    inputRef.current?.blur();
  };

  const clear = () => {
    setDraft('');
    onSubmit('');
    inputRef.current?.focus();
  };

  const isLarge = size === 'lg';

  return (
    <form role="search" onSubmit={submit} className={cn('relative', className)}>
      <label htmlFor={id} className="sr-only">
        Search articles
      </label>
      <Search
        aria-hidden
        className={cn(
          'text-ink-subtle pointer-events-none absolute top-1/2 -translate-y-1/2',
          isLarge ? 'left-5 size-5' : 'left-4 size-4',
        )}
      />
      <input
        ref={inputRef}
        id={id}
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        autoFocus={autoFocus}
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        className={cn(
          'border-line-strong bg-surface text-ink placeholder:text-ink-subtle hover:border-ink/30 focus:border-ink focus:ring-ink/5 w-full rounded-full border transition-[border-color,box-shadow] duration-200 focus:ring-4 focus:outline-none [&::-webkit-search-cancel-button]:hidden',
          isLarge ? 'h-14 pr-28 pl-13 text-base shadow-sm' : 'h-10 pr-10 pl-10 text-sm',
        )}
      />
      <div
        className={cn(
          'absolute top-1/2 flex -translate-y-1/2 items-center gap-1',
          isLarge ? 'right-2' : 'right-1',
        )}
      >
        {draft && (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear search"
            className="text-ink-subtle hover:bg-surface-sunken hover:text-ink inline-flex size-9 items-center justify-center rounded-full transition-colors"
          >
            <X aria-hidden className="size-4" />
          </button>
        )}
        {isLarge && (
          <button
            type="submit"
            className="bg-ink text-paper hover:bg-ink/85 h-10 rounded-full px-4 text-sm font-semibold transition-colors"
          >
            Search
          </button>
        )}
      </div>
    </form>
  );
}
