import { UserCheck, UserPlus } from 'lucide-react';
import { useIsFollowing, usePreferences } from '@/features/preferences/preferencesStore';
import { cn } from '@/utils/cn';

/** One-tap follow/unfollow for an author — the fastest way to personalise the feed. */
export function FollowAuthorButton({ author }: { author: string }) {
  const following = useIsFollowing(author);
  const followAuthor = usePreferences((s) => s.followAuthor);
  const unfollowAuthor = usePreferences((s) => s.unfollowAuthor);
  const Icon = following ? UserCheck : UserPlus;

  return (
    <button
      type="button"
      aria-pressed={following}
      aria-label={following ? `Unfollow ${author}` : `Follow ${author}`}
      title={following ? `Unfollow ${author}` : `Follow ${author}`}
      onClick={() => (following ? unfollowAuthor(author) : followAuthor(author))}
      className={cn(
        // Sits above the card's stretched link.
        'relative z-10 -my-2 inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold transition-colors duration-200',
        following
          ? 'bg-accent-soft text-accent'
          : 'text-ink-muted hover:bg-surface-sunken hover:text-ink',
      )}
    >
      <Icon aria-hidden className="size-4" />
      {following ? 'Following' : 'Follow'}
    </button>
  );
}
