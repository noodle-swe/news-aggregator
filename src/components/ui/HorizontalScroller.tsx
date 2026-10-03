import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

/** A scroll-snapping row that bleeds to the screen edge on mobile (chips, rails). */
export function HorizontalScroller({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <div
      role={label ? 'group' : undefined}
      aria-label={label}
      className={cn(
        '-mx-4 flex snap-x scrollbar-none gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0',
        className,
      )}
    >
      {children}
    </div>
  );
}
