import { ToggleChip } from '@/components/ui/Chip';
import { SOURCES } from '@/config/sources';
import type { SourceId } from '@/types/news';

interface SourceChipsProps {
  selected: readonly SourceId[];
  onToggle: (id: SourceId) => void;
}

export function SourceChips({ selected, onToggle }: SourceChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {SOURCES.map((source) => (
        <ToggleChip
          key={source.id}
          dotClass={source.dotClass}
          selected={selected.includes(source.id)}
          onToggle={() => onToggle(source.id)}
        >
          {source.name}
        </ToggleChip>
      ))}
    </div>
  );
}
