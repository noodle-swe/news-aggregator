import { isWithinRange, toCompactDate } from './date';
import { bylineMatches, cleanByline, toPlainText } from './text';

describe('text utils', () => {
  it('strips HTML and decodes entities', () => {
    expect(toPlainText('<p>Rock &amp; roll&#8217;s <b>back</b>&hellip;</p>')).toBe(
      'Rock & roll’s back…',
    );
  });

  it('cleans bylines', () => {
    expect(cleanByline('By Jane Doe')).toBe('Jane Doe');
    expect(cleanByline('   ')).toBeNull();
  });

  it('matches followed authors case- and accent-insensitively', () => {
    expect(bylineMatches('By José Álvarez and Ann Lee', ['jose alvarez'])).toBe(true);
    expect(bylineMatches('Ann Lee', ['John Smith'])).toBe(false);
    expect(bylineMatches(null, ['Ann Lee'])).toBe(false);
  });
});

describe('date utils', () => {
  it('formats NYT dates', () => {
    expect(toCompactDate('2026-10-03')).toBe('20261003');
  });

  it('checks inclusive ranges with open bounds', () => {
    const ts = new Date(2026, 9, 2, 12).toISOString();
    expect(isWithinRange(ts, '2026-10-02', '2026-10-02')).toBe(true);
    expect(isWithinRange(ts, '2026-10-03')).toBe(false);
    expect(isWithinRange(ts, undefined, '2026-10-01')).toBe(false);
    expect(isWithinRange(ts)).toBe(true);
  });
});
