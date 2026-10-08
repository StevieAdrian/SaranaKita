import { darkColors, lightColors, type ColorScheme } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';
import { radius } from './layout';

export type Theme = {
  readonly scheme: 'light' | 'dark';
  readonly colors: ColorScheme;
  readonly spacing: typeof spacing;
  readonly typography: typeof typography;
  readonly radius: typeof radius;
};

export const lightTheme: Theme = {
  scheme: 'light',
  colors: lightColors,
  spacing,
  typography,
  radius,
};

export const darkTheme: Theme = {
  scheme: 'dark',
  colors: darkColors,
  spacing,
  typography,
  radius,
};

export { palette } from './colors';
export { spacing } from './spacing';
export { typography, type TypographyVariant } from './typography';
export { radius, hitSlop, MIN_TOUCH_SIZE } from './layout';
export type { ColorScheme } from './colors';
export type { SpacingToken } from './spacing';
