import { cn } from '@/utils/cn';

export type Variant = 'primary' | 'secondary' | 'ghost';
export type Size = 'sm' | 'md';

const base =
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-paper hover:bg-ink/85',
  secondary:
    'border border-line-strong bg-surface text-ink hover:border-ink/40 hover:bg-surface-sunken',
  ghost: 'text-ink-muted hover:bg-surface-sunken hover:text-ink',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
};

/** Shared so links (react-router <Link>) can look exactly like buttons. */
export function buttonStyles({
  variant = 'primary',
  size = 'md',
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}
