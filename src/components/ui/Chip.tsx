import type { LucideIcon } from 'lucide-react';
import { Check, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

const base =
  'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium whitespace-nowrap transition-colors duration-200';

interface ToggleChipProps {
  selected: boolean;
  onToggle: () => void;
  icon?: LucideIcon;
  /** Small colored dot (e.g. source identity) shown before the label. */
  dotClass?: string;
  disabled?: boolean;
  children: ReactNode;
}

/** A pressable filter chip (aria-pressed) — used by filters, preferences and feed tabs. */
export function ToggleChip({
  selected,
  onToggle,
  icon: Icon,
  dotClass,
  disabled,
  children,
}: ToggleChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        base,
        selected
          ? 'border-ink bg-ink text-paper'
          : 'border-line-strong bg-surface text-ink hover:border-ink/40',
        disabled && 'cursor-not-allowed opacity-60',
      )}
    >
      {dotClass && <span aria-hidden className={cn('size-2 rounded-full', dotClass)} />}
      {Icon && !dotClass && <Icon aria-hidden className="size-4" />}
      {children}
      {selected && !Icon && !dotClass && <Check aria-hidden className="-mr-1 size-3.5" />}
    </button>
  );
}

interface RemovableChipProps {
  onRemove: () => void;
  removeLabel: string;
  children: ReactNode;
}

/** A static chip with a remove button — used for active filters and followed authors. */
export function RemovableChip({ onRemove, removeLabel, children }: RemovableChipProps) {
  return (
    <span className={cn(base, 'border-line bg-surface-sunken text-ink pr-1')}>
      {children}
      <button
        type="button"
        onClick={onRemove}
        aria-label={removeLabel}
        title={removeLabel}
        className="text-ink-muted hover:bg-line hover:text-ink inline-flex size-7 items-center justify-center rounded-full transition-colors"
      >
        <X aria-hidden className="size-3.5" />
      </button>
    </span>
  );
}
