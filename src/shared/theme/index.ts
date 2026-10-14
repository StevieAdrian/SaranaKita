import { spacing } from './spacing';
import { typography } from './typography';
import { radius } from './layout';
import {
  DEFAULT_THEME_ROLE,
  appThemes,
  type ThemeColors,
  type ThemeRole,
  type ThemeScheme,
} from './colors';

export type AppColors = Readonly<ThemeColors> & {
  readonly text: string;
  readonly border: string;
};

export type Theme = {
  readonly scheme: ThemeScheme;
  readonly role: ThemeRole;
  readonly colors: AppColors;
  readonly spacing: typeof spacing;
  readonly typography: typeof typography;
  readonly radius: typeof radius;
};

function buildTheme(role: ThemeRole, scheme: ThemeScheme): Theme {
  const colors = appThemes[role][scheme];
  return {
    scheme,
    role,
    colors: { ...colors, text: colors.textHeading, border: colors.borderInput },
    spacing,
    typography,
    radius,
  };
}

const themeCache = Object.fromEntries(
  (Object.keys(appThemes) as ThemeRole[]).map(role => [
    role,
    { light: buildTheme(role, 'light'), dark: buildTheme(role, 'dark') },
  ]),
) as Record<ThemeRole, Record<ThemeScheme, Theme>>;

export function getTheme(
  role: ThemeRole | null | undefined,
  scheme: ThemeScheme = 'light',
): Theme {
  return themeCache[role ?? DEFAULT_THEME_ROLE][scheme];
}

export {
  DEFAULT_THEME_ROLE,
  THEME_ROLES,
  appThemes,
  getThemeColors,
  palette,
  type ThemeColors,
  type ThemeRole,
  type ThemeScheme,
} from './colors';
export { spacing } from './spacing';
export { typography, type TypographyVariant } from './typography';
export { radius, hitSlop, MIN_TOUCH_SIZE } from './layout';
export type { SpacingToken } from './spacing';
