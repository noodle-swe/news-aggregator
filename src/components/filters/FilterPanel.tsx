import type { ReactNode } from 'react';
import type { SearchFilters } from '@/features/search/useSearchFilters';
import type { CategoryId, SourceId } from '@/types/news';
import { toggleItem } from '@/utils/array';
import { CategoryChips } from './CategoryChips';
import { DateRangeFilter } from './DateRangeFilter';
import { SourceChips } from './SourceChips';

interface FilterPanelProps {
  filters: SearchFilters;
  onChange: (patch: Partial<SearchFilters>) => void;
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-line border-t py-6 first:border-t-0 first:pt-0">
      <h3 className="text-ink-muted mb-3 text-xs font-semibold tracking-wider uppercase">
        {title}
      </h3>
      {children}
    </section>
  );
}

/** Pure, controlled filter UI — rendered in the desktop sidebar and the mobile sheet. */
export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  return (
    <div>
      <FilterGroup title="Date">
        <DateRangeFilter from={filters.from} to={filters.to} onChange={onChange} />
      </FilterGroup>
      <FilterGroup title="Category">
        <CategoryChips
          selected={filters.categories}
          onToggle={(id: CategoryId) =>
            onChange({ categories: toggleItem(filters.categories, id) })
          }
        />
      </FilterGroup>
      <FilterGroup title="Source">
        <SourceChips
          selected={filters.sources}
          onToggle={(id: SourceId) => onChange({ sources: toggleItem(filters.sources, id) })}
        />
        <p className="text-ink-subtle mt-3 text-xs">No source selected means all sources.</p>
      </FilterGroup>
    </div>
  );
}
