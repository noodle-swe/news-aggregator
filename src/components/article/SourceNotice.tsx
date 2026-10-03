import { AlertTriangle, RotateCw } from 'lucide-react';
import { getSource } from '@/config/sources';
import type { SourceFailure } from '@/services/aggregator';
import { Button } from '@/components/ui/Button';

/** Non-blocking notice: some providers failed, the rest still render. */
export function SourceNotice({
  failures,
  onRetry,
}: {
  failures: SourceFailure[];
  onRetry: () => void;
}) {
  if (failures.length === 0) return null;

  return (
    <div
      role="status"
      className="animate-fade-in bg-warning-soft text-warning-ink mb-8 flex flex-col gap-3 rounded-2xl px-4 py-3.5 text-sm sm:flex-row sm:items-center"
    >
      <AlertTriangle aria-hidden className="size-5 shrink-0" />
      <div className="flex-1">
        <p className="font-semibold">
          {failures.length === 1 ? 'One source is unavailable' : 'Some sources are unavailable'} —
          showing the rest.
        </p>
        <ul className="mt-0.5 opacity-90">
          {failures.map((f) => (
            <li key={f.sourceId}>
              {getSource(f.sourceId).name}: {f.message}
            </li>
          ))}
        </ul>
      </div>
      <Button variant="secondary" size="sm" onClick={onRetry} className="self-start sm:self-center">
        <RotateCw aria-hidden className="size-4" />
        Retry
      </Button>
    </div>
  );
}
