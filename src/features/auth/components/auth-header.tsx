import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import logo from '@/assets/images/logo-saranakita.png';
import { authConstants } from '../constants/auth-constants';

export type AuthHeaderProps = {
  title: string;
  subtitle: string;
};

const LOGO_WIDTH = 100;
const LOGO_HEIGHT = Math.round((LOGO_WIDTH * 29) / 124);

export function AuthHeader({ title, subtitle }: AuthHeaderProps): React.JSX.Element {
  return (
    <View style={styles.header}>
      <Image
        source={logo}
        style={styles.logo}
        resizeMode="contain"
        accessibilityRole="image"
        accessibilityLabel="SaranaKita"
      />
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>

      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: authConstants.spacing.cardToFormGap,
  },
  logo: {
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
    marginBottom: 16,
  },
  title: {
    ...authConstants.typography.title,
    textAlign: 'center',
  },
  subtitle: {
    ...authConstants.typography.subtitle,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 280,
    lineHeight: 22,
  },
});
