import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import schoolBanner from '@/assets/images/sekolah.png';
import { useRole } from '@/shared/context/theme-context';
import { spacing } from '@/shared/theme';

export type HeaderCardProfileProps = {
  schoolName?: string | null;
};

export function HeaderCardProfile({
  schoolName = 'Jakarta',
}: HeaderCardProfileProps): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const { theme, currentRole } = useRole();

  const isAdmin = currentRole === 'administrator';
  const overlayColor = isAdmin
    ? theme.primary
    : 'rgba(30, 64, 175, 0.82)';

  return (
    <View style={styles.container}>
      <ImageBackground
        source={schoolBanner}
        resizeMode="cover"
        style={[
          styles.banner,
          { paddingTop: insets.top + spacing.lg },
        ]}
      >
        <View style={[styles.overlay, { backgroundColor: overlayColor }]}>
          <Text style={styles.caption}>Profil Sekolah</Text>
          <Text accessibilityRole="header" style={styles.schoolName}>
            {schoolName || 'Jakarta'}
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  banner: {
    width: '100%',
    minHeight: 180,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: 36,
  },
  caption: {
    fontSize: 12,
    color: '#E0E7FF',
    fontWeight: '500',
    marginBottom: 2,
  },
  schoolName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
