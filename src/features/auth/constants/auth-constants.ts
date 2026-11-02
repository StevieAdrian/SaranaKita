import { Platform, type TextStyle } from 'react-native';
import { palette } from '@/shared/theme';
import { Appearance } from 'react-native';

const fontRegular = 'Poppins-Regular';
const fontMedium = 'Poppins-Medium';
const fontSemiBold = 'Poppins-SemiBold';
const fontBold = 'Poppins-Bold';
const fontBoldItalic = Platform.OS === 'android' ? 'Poppins-BoldItalic' : 'Poppins-Bold';

const lightAuthColors = {
  brand: '#2563EB',
  backgroundBlue: palette.brand,
  backgroundSplash: '#2563EB',
  surface: palette.white,

  text: {
    dark: '#000000',
    light: palette.white,
    secondary: '#1A1A1A',
    placeholder: '#98A2B3',
    muted: '#828282',
    navyText: '#0F172A',
    slate: '#1E293B',
    slateMuted: '#475569',
    link: '#2563EB',
    error: '#FE4A23',
    success: '#21E2CF',
  },

  ui: {
    inputBorder: '#B1A6A6',
    inputBorderLight: '#D0D5DD',
    borderSlate: '#CBD5E1',
    avatarBg: '#D9D9D9',
    badgeBg: '#FDFDFD',
    buttonBlack: '#000000',
    buttonDisabled: '#94A3B8',
    divider: palette.white,
    cardBorder: '#E5E5E5',
    optionSelectedBg: '#EFF6FF',
    optionBorder: '#E5E7EB',
    shadowColor: '#000000',
  },
};

const darkAuthColors = {
  brand: '#2563EB',
  backgroundBlue: '#0B1220',
  backgroundSplash: '#0B1220',
  surface: '#151E2E',

  text: {
    dark: '#F1F5F9',
    light: palette.white,
    secondary: '#E2E8F0',
    placeholder: '#64748B',
    muted: '#94A3B8',
    navyText: '#F1F5F9',
    slate: '#F1F5F9',
    slateMuted: '#94A3B8',
    link: '#60A5FA',
    error: '#F87171',
    success: '#34D399',
  },

  ui: {
    inputBorder: '#334155',
    inputBorderLight: '#334155',
    borderSlate: '#334155',
    avatarBg: '#1E293B',
    badgeBg: '#1C2738',
    buttonBlack: '#2563EB',
    buttonDisabled: '#475569',
    divider: '#334155',
    cardBorder: '#1E293B',
    optionSelectedBg: '#1E3A8A',
    optionBorder: '#334155',
    shadowColor: '#000000',
  },
};

export function getAuthColors(scheme?: 'light' | 'dark') {
  const activeScheme = scheme ?? (Appearance.getColorScheme() === 'dark' ? 'dark' : 'light');
  return activeScheme === 'dark' ? darkAuthColors : lightAuthColors;
}

export const authConstants = {
  get colors() {
    return Appearance.getColorScheme() === 'dark' ? darkAuthColors : lightAuthColors;
  },

  typography: {
    errorCode: {
      fontFamily: fontBold,
      fontSize: 64,
      fontWeight: Platform.OS === 'ios' ? '700' : undefined,
      color: '#FFFFFF',
    } as TextStyle,

    errorTitle: {
      fontFamily: fontBoldItalic,
      fontSize: 34,
      fontWeight: Platform.OS === 'ios' ? '700' : undefined,
      fontStyle: Platform.OS === 'ios' ? 'italic' : undefined,
      color: '#FFFFFF',
    } as TextStyle,

    title: {
      fontFamily: fontSemiBold,
      fontSize: 32,
      fontWeight: Platform.OS === 'ios' ? '600' : undefined,
      color: '#FFFFFF',
    } as TextStyle,

    subtitle: {
      fontFamily: fontRegular,
      fontSize: 16,
      fontWeight: Platform.OS === 'ios' ? '400' : undefined,
      color: '#FFFFFF',
    } as TextStyle,

    label: {
      fontFamily: fontMedium,
      fontSize: 16,
      fontWeight: Platform.OS === 'ios' ? '500' : undefined,
      color: '#000000',
    } as TextStyle,

    inputText: {
      fontFamily: fontRegular,
      fontSize: 14,
      fontWeight: Platform.OS === 'ios' ? '400' : undefined,
      color: '#000000',
    } as TextStyle,

    inputPlaceholder: {
      fontFamily: fontRegular,
      fontSize: 14,
      fontWeight: Platform.OS === 'ios' ? '400' : undefined,
      color: '#98A2B3',
    } as TextStyle,

    buttonText: {
      fontFamily: fontSemiBold,
      fontSize: 14,
      fontWeight: Platform.OS === 'ios' ? '600' : undefined,
      color: '#FFFFFF',
    } as TextStyle,

    link: {
      fontFamily: fontSemiBold,
      fontSize: 14,
      fontWeight: Platform.OS === 'ios' ? '600' : undefined,
      color: '#2563EB',
    } as TextStyle,
  },

  components: {
    input: {
      height: 44,
      borderRadius: 4,
      borderWidth: 1,
      paddingHorizontal: 12,
    },
    button: {
      height: 44,
      borderRadius: 4,
    },
    card: {
      borderRadius: 11,
      paddingVertical: 36,
      paddingHorizontal: 24,
    },
    avatar: {
      size: 130,
      radius: 65,
      defaultWidth: 98,
      defaultHeight: 99,
      badgeSize: 38,
      badgeRadius: 19,
    },
    radio: {
      size: 18,
      radius: 9,
      dotSize: 10,
      dotRadius: 5,
    },
  },
  spacing: {
    screenMargin: 34,
    cardToFormGap: 26,
    labelToInput: 10,
    sectionGap: 24,
  },
} as const;
