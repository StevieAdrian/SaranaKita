export const THEME_ROLES = ['siswa', 'guru', 'staff', 'administrator'] as const;

export interface ThemeColors {
  primary: string;
  primaryStrong: string;
  primarySoft: string;
  onPrimary: string;
  background: string;
  backgroundSubtle: string;
  surface: string;
  surfaceRaised: string;
  surfaceInput: string;
  overlayDisabled: string;
  textHeading: string;
  textBody: string;
  textSecondary: string;
  textMuted: string;
  textEmphasis: string;
  textInput: string;
  textOption: string;
  textPlaceholder: string;
  textInactiveOnPrimary: string;
  borderSubtle: string;
  borderLight: string;
  borderInput: string;
  borderControl: string;
  borderControlSelected: string;
  iconActive: string;
  iconInactive: string;
  iconMuted: string;
  iconNeutral: string;
  success: string;
  successSurface: string;
  badgeActive: string;
  badgeActiveSurface: string;
  danger: string;
  dangerSurface: string;
  headerGradientStart: string;
  headerGradientEnd: string;
  shadowColor: string;
  shadowSubtle: string;
  shadowSoft: string;
  shadowNavigation: string;
  shadowMedium: string;
  shadowStrong: string;
  shadowNeutral: string;
  transparent: string;
}

export type ThemeRole = (typeof THEME_ROLES)[number];
export type ThemeScheme = 'light' | 'dark';

type RoleAccent = Pick<
  ThemeColors,
  | 'primary'
  | 'primaryStrong'
  | 'primarySoft'
  | 'textInactiveOnPrimary'
  | 'iconActive'
  | 'badgeActive'
  | 'badgeActiveSurface'
  | 'headerGradientStart'
  | 'headerGradientEnd'
>;

type NeutralColors = Omit<ThemeColors, keyof RoleAccent>;

// --- COLORS ---

// Light Colors
const lightNeutrals: NeutralColors = {
  onPrimary: '#FFFFFF',
  background: '#ECF3FD',
  backgroundSubtle: '#F0F6FF',
  surface: '#FFFFFF',
  surfaceRaised: '#FDFDFD',
  surfaceInput: '#FAFAFA',
  overlayDisabled: 'rgba(0, 0, 0, 0.2)',
  textHeading: '#0F172A',
  textBody: '#374151',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textEmphasis: '#000000',
  textInput: '#1E1E1E',
  textOption: '#1A1A1A',
  textPlaceholder: '#828282',
  borderSubtle: '#F1F5F9',
  borderLight: '#F8FAFF',
  borderInput: '#D4D4D4',
  borderControl: '#B1A6A6',
  borderControlSelected: '#393939',
  iconInactive: '#CBD5E1',
  iconMuted: '#828282',
  iconNeutral: '#DADADA',
  success: '#16A34A',
  successSurface: '#DCFCE7',
  danger: '#EF4444',
  dangerSurface: '#FEF2F2',
  shadowColor: '#000000',
  shadowSubtle: 'rgba(0, 0, 0, 0.03)',
  shadowSoft: 'rgba(0, 0, 0, 0.06)',
  shadowNavigation: 'rgba(0, 0, 0, 0.08)',
  shadowMedium: 'rgba(0, 0, 0, 0.1)',
  shadowStrong: 'rgba(0, 0, 0, 0.12)',
  shadowNeutral: 'rgba(215, 215, 215, 0.2)',
  transparent: 'rgba(255, 255, 255, 0)',
};

// Dark Colors
const darkNeutrals: NeutralColors = {
  onPrimary: '#FFFFFF',
  background: '#0B1220',
  backgroundSubtle: '#0F172A',
  surface: '#151E2E',
  surfaceRaised: '#1C2738',
  surfaceInput: '#1A2433',
  overlayDisabled: 'rgba(0, 0, 0, 0.45)',
  textHeading: '#F1F5F9',
  textBody: '#CBD5E1',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textEmphasis: '#FFFFFF',
  textInput: '#F1F5F9',
  textOption: '#E2E8F0',
  textPlaceholder: '#64748B',
  borderSubtle: '#1E293B',
  borderLight: '#1A2433',
  borderInput: '#334155',
  borderControl: '#475569',
  borderControlSelected: '#CBD5E1',
  iconInactive: '#475569',
  iconMuted: '#64748B',
  iconNeutral: '#334155',
  success: '#22C55E',
  successSurface: '#052E16',
  danger: '#F87171',
  dangerSurface: '#450A0A',
  shadowColor: '#000000',
  shadowSubtle: 'rgba(0, 0, 0, 0.2)',
  shadowSoft: 'rgba(0, 0, 0, 0.3)',
  shadowNavigation: 'rgba(0, 0, 0, 0.35)',
  shadowMedium: 'rgba(0, 0, 0, 0.4)',
  shadowStrong: 'rgba(0, 0, 0, 0.5)',
  shadowNeutral: 'rgba(0, 0, 0, 0.3)',
  transparent: 'rgba(0, 0, 0, 0)',
};

// Badge Color
const LIGHT_SUCCESS_BADGE = {
  badgeActive: '#16A34A',
  badgeActiveSurface: '#DCFCE7',
} as const;
const DARK_SUCCESS_BADGE = {
  badgeActive: '#4ADE80',
  badgeActiveSurface: '#052E16',
} as const;

// Banner Color
const LIGHT_BLUE_BANNER = {
  headerGradientStart: '#2563EB',
  headerGradientEnd: '#1E40AF',
} as const;
const DARK_BLUE_BANNER = {
  headerGradientStart: '#1D4ED8',
  headerGradientEnd: '#1E3A8A',
} as const;

// Siswa
export const siswaTheme: ThemeColors = {
  ...lightNeutrals,
  primary: '#2563EB',
  primaryStrong: '#1E40AF',
  primarySoft: '#93C5FD',
  textInactiveOnPrimary: '#93C5FD',
  iconActive: '#2563EB',
  ...LIGHT_SUCCESS_BADGE,
  ...LIGHT_BLUE_BANNER,
};

export const siswaDarkTheme: ThemeColors = {
  ...darkNeutrals,
  primary: '#3B82F6',
  primaryStrong: '#2563EB',
  primarySoft: '#1E3A8A',
  textInactiveOnPrimary: '#BFDBFE',
  iconActive: '#60A5FA',
  ...DARK_SUCCESS_BADGE,
  ...DARK_BLUE_BANNER,
};

// Guru
export const guruTheme: ThemeColors = {
  ...lightNeutrals,
  primary: '#4F46E5',
  primaryStrong: '#4F46E5',
  primarySoft: '#A5B4FC',
  textInactiveOnPrimary: '#A5B4FC',
  iconActive: '#4F46E5',
  badgeActive: '#F59E0B',
  badgeActiveSurface: '#FEF9C3',
  ...LIGHT_BLUE_BANNER,
};

export const guruDarkTheme: ThemeColors = {
  ...darkNeutrals,
  primary: '#6366F1',
  primaryStrong: '#4F46E5',
  primarySoft: '#312E81',
  textInactiveOnPrimary: '#C7D2FE',
  iconActive: '#818CF8',
  badgeActive: '#FBBF24',
  badgeActiveSurface: '#422006',
  ...DARK_BLUE_BANNER,
};

// Staff
export const staffTheme: ThemeColors = {
  ...lightNeutrals,
  primary: '#112D71',
  primaryStrong: '#112D71',
  primarySoft: '#8598B8',
  textInactiveOnPrimary: '#8598B8',
  iconActive: '#112D71',
  ...LIGHT_SUCCESS_BADGE,
  ...LIGHT_BLUE_BANNER,
};

export const staffDarkTheme: ThemeColors = {
  ...darkNeutrals,
  primary: '#2F4F9E',
  primaryStrong: '#1E3A7B',
  primarySoft: '#334155',
  textInactiveOnPrimary: '#94A3B8',
  iconActive: '#8CA3DB',
  ...DARK_SUCCESS_BADGE,
  ...DARK_BLUE_BANNER,
};

// Administrator
export const adminTheme: ThemeColors = {
  ...lightNeutrals,
  primary: '#360707',
  primaryStrong: '#360707',
  primarySoft: '#9E6B6B',
  textInactiveOnPrimary: '#9E6B6B',
  iconActive: '#360707',
  ...LIGHT_SUCCESS_BADGE,
  headerGradientStart: '#360707',
  headerGradientEnd: '#360707',
};

export const adminDarkTheme: ThemeColors = {
  ...darkNeutrals,
  primary: '#7F1D1D',
  primaryStrong: '#5C1010',
  primarySoft: '#334155',
  textInactiveOnPrimary: '#94A3B8',
  iconActive: '#E29A9A',
  ...DARK_SUCCESS_BADGE,
  headerGradientStart: '#4A0E0E',
  headerGradientEnd: '#4A0E0E',
};

export const appThemes: Record<ThemeRole, Record<ThemeScheme, ThemeColors>> = {
  siswa: { light: siswaTheme, dark: siswaDarkTheme },
  guru: { light: guruTheme, dark: guruDarkTheme },
  staff: { light: staffTheme, dark: staffDarkTheme },
  administrator: { light: adminTheme, dark: adminDarkTheme },
};

export const DEFAULT_THEME_ROLE: ThemeRole = 'siswa';

export function getThemeColors(
  role: ThemeRole | null | undefined,
  scheme: ThemeScheme = 'light',
): ThemeColors {
  return appThemes[role ?? DEFAULT_THEME_ROLE][scheme];
}

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
  teacherPrimary: '#4F46E5',
  teacherSoft: '#E0E7FF',
  teacherText: '#4338CA',
  navy: '#102A6B',
  tabInactive: '#CBD5E1',
  danger: '#E5484D',
  success: '#2BA471',
  warning: '#F59E0B',
  brown: '#713F12',
  greenStatus: '#713F12',
  blueStatus: '#DBEAFE',
} as const;
