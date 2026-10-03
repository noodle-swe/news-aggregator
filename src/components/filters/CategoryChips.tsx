import { ToggleChip } from '@/components/ui/Chip';
import { CATEGORIES } from '@/config/categories';
import type { CategoryId } from '@/types/news';

interface CategoryChipsProps {
  selected: readonly CategoryId[];
  onToggle: (id: CategoryId) => void;
}

/** Multi-select category chips — shared by search filters and preferences. */
export function CategoryChips({ selected, onToggle }: CategoryChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((category) => (
        <ToggleChip
          key={category.id}
          icon={category.icon}
          selected={selected.includes(category.id)}
          onToggle={() => onToggle(category.id)}
        >
          {category.label}
        </ToggleChip>
      ))}
    </div>
  );
}
