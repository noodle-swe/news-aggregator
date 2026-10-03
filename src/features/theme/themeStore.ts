import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
}

const prefersDark = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.style.colorScheme = theme;
}

export const useTheme = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: prefersDark() ? 'dark' : 'light',
      toggleTheme: () => {
        const theme = get().theme === 'dark' ? 'light' : 'dark';
        applyTheme(theme);
        set({ theme });
      },
    }),
    {
      name: 'newsroom:theme',
      onRehydrateStorage: () => (state) => state && applyTheme(state.theme),
    },
  ),
);
