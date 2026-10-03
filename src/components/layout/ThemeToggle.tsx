import { Moon, Sun } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import { useTheme } from '@/features/theme/themeStore';

export function ThemeToggle() {
  const theme = useTheme((s) => s.theme);
  const toggleTheme = useTheme((s) => s.toggleTheme);
  const isDark = theme === 'dark';

  return (
    <IconButton
      icon={isDark ? Sun : Moon}
      label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={toggleTheme}
    />
  );
}
