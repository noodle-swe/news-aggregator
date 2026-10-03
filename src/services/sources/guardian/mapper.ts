import type { Article } from '@/types/news';
import { cleanByline, toPlainText } from '@/utils/text';
import type { GuardianResult } from './types';

export function mapGuardianResults(results: GuardianResult[]): Article[] {
  return results.map((item) => ({
    id: item.webUrl,
    url: item.webUrl,
    title: toPlainText(item.webTitle),
    summary: toPlainText(item.fields?.trailText),
    imageUrl: item.fields?.thumbnail ?? null,
    author: cleanByline(item.fields?.byline),
    publishedAt: item.webPublicationDate,
    sourceId: 'guardian',
    publisher: 'The Guardian',
    section: item.sectionName || null,
  }));
}
