import { getSource } from '@/config/sources';
import type { Article } from '@/types/news';
import { cn } from '@/utils/cn';
import { formatRelative } from '@/utils/date';

/** "● THE GUARDIAN · Technology" */
export function SourceLine({ article }: { article: Article }) {
  return (
    <p className="text-ink-muted flex min-w-0 items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
      <span
        aria-hidden
        className={cn('size-1.5 shrink-0 rounded-full', getSource(article.sourceId).dotClass)}
      />
      <span className="truncate">{article.publisher}</span>
      {article.section && (
        <>
          <span aria-hidden className="text-ink-subtle">
            ·
          </span>
          <span className="text-ink-subtle truncate font-medium tracking-normal normal-case">
            {article.section}
          </span>
        </>
      )}
    </p>
  );
}

/** "Jane Doe · 3 hours ago" */
export function Byline({ article, className }: { article: Article; className?: string }) {
  return (
    <p className={cn('text-ink-muted flex min-w-0 items-center gap-1.5 text-sm', className)}>
      {article.author && (
        <>
          <span className="text-ink truncate font-medium">{article.author}</span>
          <span aria-hidden className="text-ink-subtle">
            ·
          </span>
        </>
      )}
      <time dateTime={article.publishedAt} className="shrink-0">
        {formatRelative(article.publishedAt)}
      </time>
    </p>
  );
}
