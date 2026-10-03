import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { CATEGORY_IDS, SOURCE_IDS, type CategoryId, type SourceId } from '@/types/news';

export interface SearchFilters {
  keyword: string;
  from?: string;
  to?: string;
  categories: CategoryId[];
  /** Empty = every source. */
  sources: SourceId[];
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function parseList<T extends string>(raw: string | null, allowed: readonly T[]): T[] {
  if (!raw) return [];
  return raw.split(',').filter((v): v is T => (allowed as readonly string[]).includes(v));
}

function parseDate(raw: string | null): string | undefined {
  return raw && ISO_DATE.test(raw) ? raw : undefined;
}

export function parseFilters(params: URLSearchParams): SearchFilters {
  return {
    keyword: params.get('q')?.trim() ?? '',
    from: parseDate(params.get('from')),
    to: parseDate(params.get('to')),
    categories: parseList(params.get('category'), CATEGORY_IDS),
    sources: parseList(params.get('source'), SOURCE_IDS),
  };
}

export function serializeFilters(filters: SearchFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.keyword) params.set('q', filters.keyword);
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);
  if (filters.categories.length) params.set('category', filters.categories.join(','));
  if (filters.sources.length) params.set('source', filters.sources.join(','));
  return params;
}

export function countActiveFilters({ from, to, categories, sources }: SearchFilters): number {
  return (from || to ? 1 : 0) + categories.length + sources.length;
}

/**
 * Search + filter state lives in the URL: shareable, bookmarkable and
 * back-button friendly, with no extra global store.
 */
export function useSearchFilters() {
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => parseFilters(params), [params]);

  const update = useCallback(
    (patch: Partial<SearchFilters>) =>
      setParams((current) => serializeFilters({ ...parseFilters(current), ...patch }), {
        replace: true,
      }),
    [setParams],
  );

  const clear = useCallback(
    () =>
      setParams(
        (current) =>
          serializeFilters({
            ...parseFilters(current),
            from: undefined,
            to: undefined,
            categories: [],
            sources: [],
          }),
        { replace: true },
      ),
    [setParams],
  );

  return { filters, update, clear, activeCount: countActiveFilters(filters) };
}
