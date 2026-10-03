import type { Article } from '@/types/news';
import { cleanByline, toPlainText } from '@/utils/text';
import type { NewsApiArticle } from './types';

const REMOVED = '[Removed]';

/** NewsAPI often reports authors as URLs or publisher names — keep only real names. */
function cleanAuthor(author: string | null, publisher: string): string | null {
  const name = cleanByline(author);
  if (!name || /^https?:\/\//i.test(name) || name === publisher) return null;
  return name;
}

/** Top-headlines titles end with " - Publisher"; drop the redundant suffix. */
function cleanTitle(title: string, publisher: string): string {
  const suffix = ` - ${publisher}`;
  return title.endsWith(suffix) ? title.slice(0, -suffix.length) : title;
}

export function mapNewsApiArticles(raw: NewsApiArticle[], section: string | null): Article[] {
  return raw
    .filter((item) => item.title && item.title !== REMOVED && item.url)
    .map((item) => {
      const publisher = item.source.name || 'NewsAPI';
      return {
        id: item.url,
        url: item.url,
        title: cleanTitle(toPlainText(item.title), publisher),
        summary: toPlainText(item.description),
        imageUrl: item.urlToImage || null,
        author: cleanAuthor(item.author, publisher),
        publishedAt: item.publishedAt,
        sourceId: 'newsapi',
        publisher,
        section,
      };
    });
}
