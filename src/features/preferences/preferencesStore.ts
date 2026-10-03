import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CATEGORY_IDS, SOURCE_IDS, type CategoryId, type SourceId } from '@/types/news';
import { normalizeName } from '@/utils/text';
import { toggleItem } from '@/utils/array';

export interface PreferencesState {
  sources: SourceId[];
  /** Empty = top stories across every category. */
  categories: CategoryId[];
  authors: string[];
  toggleSource: (id: SourceId) => void;
  toggleCategory: (id: CategoryId) => void;
  followAuthor: (name: string) => void;
  unfollowAuthor: (name: string) => void;
  reset: () => void;
}

const DEFAULTS = {
  sources: [...SOURCE_IDS] as SourceId[],
  categories: [] as CategoryId[],
  authors: [] as string[],
};

const sameAuthor = (a: string, b: string) => normalizeName(a) === normalizeName(b);

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      toggleSource: (id) =>
        set((state) => {
          const next = toggleItem(state.sources, id);
          // A feed needs at least one source.
          return next.length > 0 ? { sources: next } : state;
        }),
      toggleCategory: (id) => set((state) => ({ categories: toggleItem(state.categories, id) })),
      followAuthor: (name) =>
        set((state) => {
          const trimmed = name.trim();
          if (!trimmed || state.authors.some((a) => sameAuthor(a, trimmed))) return state;
          return { authors: [...state.authors, trimmed] };
        }),
      unfollowAuthor: (name) =>
        set((state) => ({ authors: state.authors.filter((a) => !sameAuthor(a, name)) })),
      reset: () => set(DEFAULTS),
    }),
    {
      name: 'newsroom:preferences',
      version: 1,
      // Drop anything stale/unknown from storage so bad data can't break queries.
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<typeof DEFAULTS>;
        const sources = (saved.sources ?? []).filter((id) => SOURCE_IDS.includes(id));
        return {
          ...current,
          sources: sources.length > 0 ? sources : DEFAULTS.sources,
          categories: (saved.categories ?? []).filter((id) => CATEGORY_IDS.includes(id)),
          authors: (saved.authors ?? []).filter((a) => typeof a === 'string' && a.trim()),
        };
      },
    },
  ),
);

/** Selector helper so components subscribe only to what they render. */
export const useIsFollowing = (author: string | null) =>
  usePreferences((state) => !!author && state.authors.some((a) => sameAuthor(a, author)));
