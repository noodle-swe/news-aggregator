const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  rsquo: '’',
  lsquo: '‘',
  rdquo: '”',
  ldquo: '“',
  mdash: '—',
  ndash: '–',
  hellip: '…',
};

/** Strips markup and decodes common entities from provider-supplied HTML snippets. */
export function toPlainText(html: string | null | undefined): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&(#\d+|#x[\da-f]+|\w+);/gi, (match, entity: string) => {
      if (entity.startsWith('#x') || entity.startsWith('#X')) {
        return String.fromCodePoint(parseInt(entity.slice(2), 16));
      }
      if (entity.startsWith('#')) return String.fromCodePoint(parseInt(entity.slice(1), 10));
      return NAMED_ENTITIES[entity.toLowerCase()] ?? match;
    })
    .replace(/\s+/g, ' ')
    .trim();
}

/** "By Jane Doe and John Roe" → "Jane Doe and John Roe". */
export function cleanByline(byline: string | null | undefined): string | null {
  const cleaned = toPlainText(byline)
    .replace(/^by\s+/i, '')
    .trim();
  return cleaned || null;
}

/** Normalises an author name for comparisons (case/whitespace/diacritics-insensitive). */
export function normalizeName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/\p{M}/gu, '') // strip combining accents
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** True when any of `authors` appears in the article's byline. */
export function bylineMatches(byline: string | null, authors: readonly string[]): boolean {
  if (!byline || authors.length === 0) return false;
  const normalized = normalizeName(byline);
  return authors.some((author) => normalized.includes(normalizeName(author)));
}
