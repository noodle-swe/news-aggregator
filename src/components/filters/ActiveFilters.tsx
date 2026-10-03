import { RemovableChip } from '@/components/ui/Chip';
import { getCategory } from '@/config/categories';
import { getSource } from '@/config/sources';
import type { SearchFilters } from '@/features/search/useSearchFilters';
import { formatShortDate } from '@/utils/date';

interface ActiveFiltersProps {
  filters: SearchFilters;
  onChange: (patch: Partial<SearchFilters>) => void;
  onClear: () => void;
}

function describeRange(from?: string, to?: string): string {
  if (from && to) return `${formatShortDate(from)} – ${formatShortDate(to)}`;
  if (from) return `Since ${formatShortDate(from)}`;
  return `Until ${formatShortDate(to!)}`;
}

/** Removable summary of everything currently narrowing the results. */
export function ActiveFilters({ filters, onChange, onClear }: ActiveFiltersProps) {
  const { from, to, categories, sources } = filters;
  const hasAny = !!(from || to) || categories.length > 0 || sources.length > 0;
  if (!hasAny) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      {(from || to) && (
        <RemovableChip
          removeLabel="Remove date filter"
          onRemove={() => onChange({ from: undefined, to: undefined })}
        >
          {describeRange(from, to)}
        </RemovableChip>
      )}
      {categories.map((id) => (
        <RemovableChip
          key={id}
          removeLabel={`Remove ${getCategory(id).label}`}
          onRemove={() => onChange({ categories: categories.filter((c) => c !== id) })}
        >
          {getCategory(id).label}
        </RemovableChip>
      ))}
      {sources.map((id) => (
        <RemovableChip
          key={id}
          removeLabel={`Remove ${getSource(id).name}`}
          onRemove={() => onChange({ sources: sources.filter((s) => s !== id) })}
        >
          {getSource(id).name}
        </RemovableChip>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="text-accent h-9 rounded-full px-3 text-sm font-medium underline-offset-4 hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
