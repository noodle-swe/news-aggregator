import { countActiveFilters, parseFilters, serializeFilters } from './useSearchFilters';

describe('search filter URL state', () => {
  it('round-trips through the URL', () => {
    const filters = {
      keyword: 'climate',
      from: '2026-09-01',
      to: '2026-09-30',
      categories: ['science' as const, 'health' as const],
      sources: ['guardian' as const],
    };
    expect(parseFilters(serializeFilters(filters))).toEqual(filters);
  });

  it('ignores unknown or malformed values', () => {
    const filters = parseFilters(
      new URLSearchParams('q=%20x%20&from=yesterday&category=science,bogus&source=cnn,nyt'),
    );
    expect(filters).toEqual({
      keyword: 'x',
      from: undefined,
      to: undefined,
      categories: ['science'],
      sources: ['nyt'],
    });
  });

  it('counts a date range as one active filter', () => {
    expect(
      countActiveFilters({
        keyword: 'x',
        from: '2026-01-01',
        to: '2026-02-01',
        categories: ['sports'],
        sources: [],
      }),
    ).toBe(2);
  });
});
