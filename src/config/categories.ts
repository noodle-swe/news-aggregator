import type { LucideIcon } from 'lucide-react';
import {
  Briefcase,
  Clapperboard,
  Cpu,
  FlaskConical,
  Globe2,
  HeartPulse,
  Trophy,
} from 'lucide-react';
import type { CategoryId } from '@/types/news';

export interface CategoryDefinition {
  id: CategoryId;
  label: string;
  icon: LucideIcon;
  /**
   * How each provider names this category. Adapters read from here, so adding
   * or re-mapping a category never touches adapter code (Open/Closed).
   */
  providers: {
    /** NewsAPI `top-headlines` category. */
    newsapi: string;
    /** Guardian section ids, OR-ed together. */
    guardian: string[];
    /** NYT `section_name` values, OR-ed together. */
    nyt: string[];
  };
}

export const CATEGORIES: readonly CategoryDefinition[] = [
  {
    id: 'general',
    label: 'World',
    icon: Globe2,
    providers: {
      newsapi: 'general',
      guardian: ['world', 'us-news', 'uk-news'],
      nyt: ['World', 'U.S.'],
    },
  },
  {
    id: 'business',
    label: 'Business',
    icon: Briefcase,
    providers: {
      newsapi: 'business',
      guardian: ['business', 'money'],
      nyt: ['Business Day', 'Business'],
    },
  },
  {
    id: 'technology',
    label: 'Technology',
    icon: Cpu,
    providers: { newsapi: 'technology', guardian: ['technology'], nyt: ['Technology'] },
  },
  {
    id: 'science',
    label: 'Science',
    icon: FlaskConical,
    providers: {
      newsapi: 'science',
      guardian: ['science', 'environment'],
      nyt: ['Science', 'Climate'],
    },
  },
  {
    id: 'health',
    label: 'Health',
    icon: HeartPulse,
    providers: { newsapi: 'health', guardian: ['society', 'wellness'], nyt: ['Health', 'Well'] },
  },
  {
    id: 'sports',
    label: 'Sports',
    icon: Trophy,
    providers: { newsapi: 'sports', guardian: ['sport', 'football'], nyt: ['Sports'] },
  },
  {
    id: 'entertainment',
    label: 'Culture',
    icon: Clapperboard,
    providers: {
      newsapi: 'entertainment',
      guardian: ['culture', 'film', 'music', 'tv-and-radio', 'books'],
      nyt: ['Arts', 'Movies', 'Books', 'Theater'],
    },
  },
];

const byId = new Map(CATEGORIES.map((category) => [category.id, category]));

export function getCategory(id: CategoryId): CategoryDefinition {
  // Every CategoryId is registered above, so the lookup can't miss.
  return byId.get(id)!;
}
