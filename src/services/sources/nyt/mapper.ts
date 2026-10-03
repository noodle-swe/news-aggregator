import type { Article } from '@/types/news';
import { cleanByline, toPlainText } from '@/utils/text';
import type { NytDoc } from './types';

const NYT_ORIGIN = 'https://www.nytimes.com/';

function absolute(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `${NYT_ORIGIN}${url.replace(/^\//, '')}`;
}

/** Picks the best image, supporting both the legacy and the 2025 multimedia shapes. */
export function pickNytImage(multimedia: NytDoc['multimedia']): string | null {
  if (!multimedia) return null;

  if (Array.isArray(multimedia)) {
    const preferred =
      multimedia.find((m) => m.subtype === 'xlarge') ??
      multimedia.find((m) => (m.width ?? 0) >= 600) ??
      multimedia[0];
    return preferred?.url ? absolute(preferred.url) : null;
  }

  const url = multimedia.default?.url ?? multimedia.thumbnail?.url;
  return url ? absolute(url) : null;
}

export function mapNytDocs(docs: NytDoc[]): Article[] {
  return docs
    .filter((doc) => doc.web_url && doc.headline?.main)
    .map((doc) => ({
      id: doc.web_url,
      url: doc.web_url,
      title: toPlainText(doc.headline.main),
      summary: toPlainText(doc.abstract || doc.snippet || doc.lead_paragraph),
      imageUrl: pickNytImage(doc.multimedia),
      author: cleanByline(doc.byline?.original),
      publishedAt: doc.pub_date,
      sourceId: 'nyt',
      publisher: 'The New York Times',
      section: doc.section_name || null,
    }));
}
