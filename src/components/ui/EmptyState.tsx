import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="animate-fade-in mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
      <div className="bg-surface-sunken text-ink-muted mb-5 flex size-14 items-center justify-center rounded-2xl">
        <Icon aria-hidden className="size-6" />
      </div>
      <h2 className="font-serif text-2xl font-semibold text-balance">{title}</h2>
      <div className="text-ink-muted mt-2 text-[15px] leading-relaxed text-pretty">
        {description}
      </div>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
