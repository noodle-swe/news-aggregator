import type { LucideIcon } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: LucideIcon;
  /** Required: icon-only buttons must have an accessible name. */
  label: string;
}

export function IconButton({
  icon: Icon,
  label,
  className,
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'text-ink-muted hover:bg-surface-sunken hover:text-ink inline-flex size-11 shrink-0 items-center justify-center rounded-full transition-colors duration-200',
        className,
      )}
      {...props}
    >
      <Icon className="size-5" aria-hidden />
    </button>
  );
}
