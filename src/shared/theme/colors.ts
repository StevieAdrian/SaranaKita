export const palette = {
  black: '#0B0B0F',
  white: '#FFFFFF',
  gray100: '#F2F3F5',
  gray300: '#C8CBD1',
  gray500: '#8A8F99',
  gray700: '#4A4E57',
  gray900: '#1C1E24',
  primary: '#2F6BFF',
  infoBackground: '#DBEAFE',
  brand: '#2563EB',
  link: '#1D6FE0',
  primaryDark: '#1B4FD1',
  navy: '#102A6B',
  tabInactive: '#CBD5E1',
  danger: '#E5484D',
  success: '#2BA471',
} as const;

export type ColorScheme = {
  readonly background: string;
  readonly surface: string;
  readonly text: string;
  readonly textMuted: string;
  readonly border: string;
  readonly primary: string;
  readonly onPrimary: string;
  readonly danger: string;
  readonly success: string;
};

export const lightColors: ColorScheme = {
  background: palette.white,
  surface: palette.gray100,
  text: palette.gray900,
  textMuted: palette.gray500,
  border: palette.gray300,
  primary: palette.primary,
  onPrimary: palette.white,
  danger: palette.danger,
  success: palette.success,
};

export const darkColors: ColorScheme = {
  background: palette.black,
  surface: palette.gray900,
  text: palette.white,
  textMuted: palette.gray300,
  border: palette.gray700,
  primary: palette.primary,
  onPrimary: palette.white,
  danger: palette.danger,
  success: palette.success,
};
