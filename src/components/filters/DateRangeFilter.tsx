import { useId } from 'react';
import { ToggleChip } from '@/components/ui/Chip';
import { daysAgo, toIsoDate } from '@/utils/date';

interface DateRange {
  from?: string;
  to?: string;
}

interface DateRangeFilterProps extends DateRange {
  onChange: (range: DateRange) => void;
}

const PRESETS = [
  { label: 'Any time', days: null },
  { label: 'Past 24 hours', days: 1 },
  { label: 'Past week', days: 7 },
  { label: 'Past month', days: 30 },
] as const;

const inputClass =
  'h-11 w-full rounded-xl border border-line-strong bg-surface px-3 text-sm text-ink transition-colors hover:border-ink/30 focus:border-ink focus:outline-none [color-scheme:inherit]';

export function DateRangeFilter({ from, to, onChange }: DateRangeFilterProps) {
  const fromId = useId();
  const toId = useId();
  const today = toIsoDate(new Date());

  const isPreset = (days: number | null) =>
    days === null ? !from && !to : !to && from === daysAgo(days);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map(({ label, days }) => (
          <ToggleChip
            key={label}
            selected={isPreset(days)}
            onToggle={() =>
              onChange({ from: days === null ? undefined : daysAgo(days), to: undefined })
            }
          >
            {label}
          </ToggleChip>
        ))}
      </div>

      <fieldset className="grid grid-cols-2 gap-3">
        <legend className="sr-only">Custom date range</legend>
        <div>
          <label htmlFor={fromId} className="text-ink-muted mb-1.5 block text-xs font-medium">
            From
          </label>
          <input
            id={fromId}
            type="date"
            value={from ?? ''}
            max={to ?? today}
            onChange={(e) => onChange({ from: e.target.value || undefined, to })}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={toId} className="text-ink-muted mb-1.5 block text-xs font-medium">
            To
          </label>
          <input
            id={toId}
            type="date"
            value={to ?? ''}
            min={from}
            max={today}
            onChange={(e) => onChange({ from, to: e.target.value || undefined })}
            className={inputClass}
          />
        </div>
      </fieldset>
    </div>
  );
}
