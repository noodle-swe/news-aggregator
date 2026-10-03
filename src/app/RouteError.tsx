import { AlertOctagon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

/** Last-resort error boundary for unexpected render errors. */
export function RouteError() {
  return (
    <div className="bg-paper flex min-h-dvh items-center justify-center">
      <EmptyState
        icon={AlertOctagon}
        title="Something went wrong"
        description="An unexpected error occurred. Reloading the page usually fixes it."
        action={<Button onClick={() => window.location.reload()}>Reload page</Button>}
      />
    </div>
  );
}
