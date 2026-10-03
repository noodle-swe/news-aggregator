import type { SourceId } from '@/types/news';
import { GuardianSource } from './guardian/GuardianSource';
import type { NewsSource } from './NewsSource';
import { NewsApiSource } from './newsapi/NewsApiSource';
import { NytSource } from './nyt/NytSource';

export type SourceRegistry = ReadonlyMap<SourceId, NewsSource>;

/** Adding a provider = write an adapter + register it here. Nothing else changes. */
export function createSourceRegistry(
  sources: NewsSource[] = [new NewsApiSource(), new GuardianSource(), new NytSource()],
): SourceRegistry {
  return new Map(sources.map((source) => [source.id, source]));
}
