import React, { createContext, useContext, useMemo, type PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';
import {
  getTheme,
  type Theme,
  type ThemeColors,
  type ThemeRole,
  type ThemeScheme,
} from '@/shared/theme';

export type RoleContextValue = {
  readonly currentRole: ThemeRole | null;
  readonly theme: ThemeColors;
  readonly scheme: ThemeScheme;
};

type ThemeContextValue = RoleContextValue & {
  readonly fullTheme: Theme;
};

function createValue(role: ThemeRole | null, scheme: ThemeScheme): ThemeContextValue {
  const fullTheme = getTheme(role, scheme);
  return { currentRole: role, theme: fullTheme.colors, scheme, fullTheme };
}

const ThemeContext = createContext<ThemeContextValue>(createValue(null, 'light'));

export type ThemeProviderProps = PropsWithChildren<{
  role: ThemeRole | null;
}>;

export function ThemeProvider({ role, children }: ThemeProviderProps): React.JSX.Element {
  const scheme: ThemeScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const value = useMemo(() => createValue(role, scheme), [role, scheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useRole(): RoleContextValue {
  return useContext(ThemeContext);
}

export function useThemeContext(): Theme {
  return useContext(ThemeContext).fullTheme;
}
