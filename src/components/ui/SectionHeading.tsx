import type { ReactNode } from 'react';

interface SectionHeadingProps {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  id?: string;
}

/** Editorial section header: a heavy rule, a serif title and an optional action. */
export function SectionHeading({ title, description, action, id }: SectionHeadingProps) {
  return (
    <div className="border-ink mb-5 flex items-end justify-between gap-4 border-t-2 pt-3">
      <div className="min-w-0">
        <h2 id={id} className="font-serif text-2xl font-semibold tracking-tight">
          {title}
        </h2>
        {description && <p className="text-ink-muted mt-1 text-sm">{description}</p>}
      </div>
      {action}
    </div>
  );
}
