import { Platform, type TextStyle } from 'react-native';

export const fontFamilies = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
} as const;

const fontRegular = fontFamilies.regular;
const fontSemiBold = fontFamilies.semiBold;
const fontBold = fontFamilies.bold;

export const typography = {
  h1: { fontFamily: fontBold, fontSize: 28, fontWeight: Platform.OS === 'ios' ? '700' : undefined, lineHeight: 34 },
  h2: { fontFamily: fontBold, fontSize: 22, fontWeight: Platform.OS === 'ios' ? '700' : undefined, lineHeight: 28 },
  title: { fontFamily: fontSemiBold, fontSize: 18, fontWeight: Platform.OS === 'ios' ? '600' : undefined, lineHeight: 24 },
  body: { fontFamily: fontRegular, fontSize: 16, fontWeight: Platform.OS === 'ios' ? '400' : undefined, lineHeight: 22 },
  caption: { fontFamily: fontRegular, fontSize: 13, fontWeight: Platform.OS === 'ios' ? '400' : undefined, lineHeight: 18 },
  button: { fontFamily: fontSemiBold, fontSize: 16, fontWeight: Platform.OS === 'ios' ? '600' : undefined, lineHeight: 20 },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
