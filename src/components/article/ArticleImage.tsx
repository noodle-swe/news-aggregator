import { useState } from 'react';
import { getSource } from '@/config/sources';
import type { Article } from '@/types/news';
import { cn } from '@/utils/cn';

interface ArticleImageProps {
  article: Pick<Article, 'imageUrl' | 'publisher' | 'sourceId'>;
  className?: string;
  /** Load eagerly for above-the-fold images (the lead story). */
  priority?: boolean;
  sizes?: string;
}

/**
 * Lazy image with a reserved aspect box (no layout shift) and a branded
 * typographic fallback when the provider has no image or it fails to load.
 */
export function ArticleImage({ article, className, priority = false, sizes }: ArticleImageProps) {
  const [failed, setFailed] = useState(false);
  const showImage = article.imageUrl && !failed;

  return (
    <div className={cn('bg-surface-sunken relative overflow-hidden', className)}>
      {showImage ? (
        <img
          src={article.imageUrl!}
          alt=""
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
        />
      ) : (
        <div className="from-surface-sunken to-line flex size-full items-center justify-center bg-gradient-to-br">
          <span className="text-ink-subtle flex items-center gap-2 font-serif text-lg font-semibold">
            <span
              aria-hidden
              className={cn('size-2 rounded-full', getSource(article.sourceId).dotClass)}
            />
            {article.publisher}
          </span>
        </div>
      )}
    </div>
  );
}
