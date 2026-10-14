import type { Theme } from '@/shared/theme';
import { useThemeContext } from '@/shared/context/theme-context';

export function useTheme(): Theme {
  return useThemeContext();
}
