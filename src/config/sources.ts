import type { SourceId } from '@/types/news';

export interface SourceDefinition {
  id: SourceId;
  name: string;
  shortName: string;
  description: string;
  /** Tailwind class for the source's identity dot. */
  dotClass: string;
}

export const SOURCES: readonly SourceDefinition[] = [
  {
    id: 'newsapi',
    name: 'NewsAPI',
    shortName: 'NewsAPI',
    description: 'Headlines from 80,000+ publishers, including BBC, CNN and Reuters.',
    dotClass: 'bg-source-newsapi',
  },
  {
    id: 'guardian',
    name: 'The Guardian',
    shortName: 'Guardian',
    description: 'Independent journalism from The Guardian’s global newsroom.',
    dotClass: 'bg-source-guardian',
  },
  {
    id: 'nyt',
    name: 'The New York Times',
    shortName: 'NYT',
    description: 'Reporting and analysis from The New York Times archive.',
    dotClass: 'bg-source-nyt',
  },
];

const byId = new Map(SOURCES.map((source) => [source.id, source]));

export function getSource(id: SourceId): SourceDefinition {
  return byId.get(id)!;
}
