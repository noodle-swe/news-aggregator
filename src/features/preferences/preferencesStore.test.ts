import { act } from '@testing-library/react';
import { usePreferences } from './preferencesStore';

const store = () => usePreferences.getState();

beforeEach(() => act(() => store().reset()));

describe('preferences store', () => {
  it('never removes the last source', () => {
    act(() => {
      store().toggleSource('newsapi');
      store().toggleSource('guardian');
      store().toggleSource('nyt');
    });
    expect(store().sources).toEqual(['nyt']);
  });

  it('follows authors once, case-insensitively', () => {
    act(() => {
      store().followAuthor('Ian Sample');
      store().followAuthor('  ian sample ');
      store().followAuthor('');
    });
    expect(store().authors).toEqual(['Ian Sample']);

    act(() => store().unfollowAuthor('IAN SAMPLE'));
    expect(store().authors).toEqual([]);
  });

  it('persists to localStorage', () => {
    act(() => store().toggleCategory('science'));
    expect(localStorage.getItem('newsroom:preferences')).toContain('science');
  });
});
