import { memo } from 'react';
import type { Article } from '@/types/news';
import { cn } from '@/utils/cn';
import { ArticleImage } from './ArticleImage';
import { Byline, SourceLine } from './ArticleMeta';
import { FollowAuthorButton } from './FollowAuthorButton';

export type ArticleCardVariant = 'lead' | 'standard' | 'compact';

interface ArticleCardProps {
  article: Article;
  variant?: ArticleCardVariant;
}

/**
 * One card, three layouts. The headline link is "stretched" over the whole
 * card, so the entire surface is clickable while the follow button stays usable.
 */
function ArticleCardBase({ article, variant = 'standard' }: ArticleCardProps) {
  const headline = (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
    >
      {article.title}
    </a>
  );

  const footer = (
    <div className="mt-auto flex items-center justify-between gap-2 pt-3">
      <Byline article={article} />
      {article.author && <FollowAuthorButton author={article.author} />}
    </div>
  );

  if (variant === 'compact') {
    return (
      <article className="group border-line bg-surface focus-within:ring-accent hover:shadow-ink/5 relative flex h-full gap-4 rounded-2xl border p-4 transition-shadow duration-200 focus-within:ring-2 hover:shadow-lg">
        <div className="flex min-w-0 flex-1 flex-col">
          <SourceLine article={article} />
          <h3 className="mt-1.5 line-clamp-3 font-serif text-lg leading-snug font-semibold text-balance group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
            {headline}
          </h3>
          {/* Compact cards live in tight rails: byline only, no follow control. */}
          <Byline article={article} className="mt-auto pt-3" />
        </div>
        <ArticleImage article={article} className="size-20 shrink-0 rounded-xl sm:size-24" />
      </article>
    );
  }

  const isLead = variant === 'lead';

  return (
    <article
      className={cn(
        'group focus-within:ring-accent focus-within:ring-offset-paper relative flex h-full flex-col rounded-2xl focus-within:ring-2 focus-within:ring-offset-4',
        isLead && '@3xl:grid @3xl:grid-cols-[3fr_2fr] @3xl:items-center @3xl:gap-8',
      )}
    >
      <ArticleImage
        article={article}
        priority={isLead}
        sizes={isLead ? '(min-width: 1024px) 720px, 100vw' : '(min-width: 1024px) 400px, 100vw'}
        className={cn('aspect-[16/10] w-full rounded-xl', isLead && '@3xl:aspect-[4/3]')}
      />
      <div className="flex flex-1 flex-col pt-4">
        <SourceLine article={article} />
        <h3
          className={cn(
            'mt-2 font-serif font-semibold tracking-tight text-balance decoration-1 underline-offset-4 group-hover:underline',
            isLead
              ? 'text-[1.75rem] leading-[1.15] @3xl:text-[2.5rem] @3xl:leading-[1.08]'
              : 'line-clamp-3 text-xl leading-snug',
          )}
        >
          {headline}
        </h3>
        {article.summary && (
          <p
            className={cn(
              'text-ink-muted mt-2 text-pretty',
              isLead
                ? 'line-clamp-4 text-base leading-relaxed @3xl:text-lg'
                : 'line-clamp-2 text-[15px] leading-relaxed',
            )}
          >
            {article.summary}
          </p>
        )}
        {footer}
      </div>
    </article>
  );
}

export const ArticleCard = memo(ArticleCardBase);
