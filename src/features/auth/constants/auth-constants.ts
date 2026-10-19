import { Platform, type TextStyle } from 'react-native';
import { palette } from '@/shared/theme';

const fontFamily = Platform.select({
  ios: 'Poppins-Regular',
  android: 'Poppins-Regular',
  default: 'System',
});

export const authConstants = {
  colors: {
    brand: '#1A73E8',
    backgroundBlue: palette.brand,
    backgroundSplash: palette.white,
    surface: palette.white,

    text: {
      dark: '#000000',
      light: palette.white,
      placeholder: '#B1A6A6',
      link: '#1A73E8',
      error: '#FE4A23',
      success: '#21E2CF',
    },

    ui: {
      inputBorder: '#B1A6A6',
      inputFocused: '#1A73E8',
      buttonPrimaryBg: '#000000',
      buttonPrimaryText: palette.white,
      divider: palette.white,
      avatarBg: '#D9D9D9',
      cardBorder: '#E5E5E5',
    },
  },

  typography: {
    errorCode: {
      fontFamily,
      fontSize: 64,
      fontWeight: '700',
      color: '#FFFFFF',
    } as TextStyle,

    errorTitle: {
      fontFamily,
      fontSize: 34,
      fontWeight: '700',
      fontStyle: 'italic',
      color: '#FFFFFF',
    } as TextStyle,

    title: {
      fontFamily,
      fontSize: 32,
      fontWeight: '600',
      color: '#FFFFFF',
    } as TextStyle,

    subtitle: {
      fontFamily,
      fontSize: 16,
      fontWeight: '400',
      color: '#FFFFFF',
    } as TextStyle,

    label: {
      fontFamily,
      fontSize: 16,
      fontWeight: '500',
      color: '#000000',
    } as TextStyle,

    inputText: {
      fontFamily,
      fontSize: 14,
      fontWeight: '400',
      color: '#000000',
    } as TextStyle,

    inputPlaceholder: {
      fontFamily,
      fontSize: 14,
      fontWeight: '400',
      color: '#B1A6A6',
    } as TextStyle,

    buttonText: {
      fontFamily,
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
    } as TextStyle,

    link: {
      fontFamily,
      fontSize: 14,
      fontWeight: '600',
      color: '#1A73E8',
    } as TextStyle,
  },

  components: {
    input: {
      height: 44,
      borderRadius: 4,
      borderWidth: 0.5,
      paddingHorizontal: 12,
    },
    button: {
      height: 44,
      borderRadius: 4,
    },
    card: {
      borderRadius: 11,
      borderWidth: 1,
      paddingVertical: 36,
      paddingHorizontal: 24,
    },
    radio: {
      size: 19,
      dotSize: 10,
      borderWidth: 0.6,
    },
    avatar: {
      size: 130,
      radius: 65,
    },
  },

  spacing: {
    screenMargin: 34,
    cardToFormGap: 26,
    fieldGap: 18,
    labelToInput: 10,
    sectionGap: 24,
  },
} as const;
