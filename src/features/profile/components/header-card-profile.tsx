import React from 'react';
import { ImageBackground, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import schoolBanner from '@/assets/images/sekolah.png';
import { useRole } from '@/shared/context/theme-context';
import { spacing } from '@/shared/theme';
import { profileFonts } from '../utils/constants';

export type HeaderCardProfileProps = {
  schoolName?: string | null;
  role?: string | null;
};

export function HeaderCardProfile({
  schoolName,
  role,
}: HeaderCardProfileProps): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const { theme, currentRole } = useRole();
  const effectiveRole = role ?? currentRole;
  const displaySchoolName = schoolName?.trim() || 'Belum Terhubung Sekolah';
  const caption = effectiveRole === 'administrator' ? 'Administrator' : 'Profil Sekolah';

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <ImageBackground
        source={schoolBanner}
        resizeMode="cover"
        style={styles.bannerImage}
      />

      <View
        style={[
          styles.textContainer,
          { paddingTop: insets.top + spacing.lg },
        ]}
      >
        <Text style={styles.caption}>{caption}</Text>
        <Text accessibilityRole="header" numberOfLines={1} style={styles.schoolName}>
          {displaySchoolName}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 220,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    ...StyleSheet.absoluteFill,
    opacity: 0.3,
  },
  textContainer: {
    paddingHorizontal: 22,
    paddingBottom: 68,
    minHeight: 220,
    justifyContent: 'flex-end',
  },
  caption: {
    fontFamily: profileFonts.regular,
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    fontWeight: Platform.OS === 'ios' ? '400' : undefined,
    marginBottom: 2,
  },
  schoolName: {
    fontFamily: profileFonts.bold,
    fontSize: 24,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    color: '#FFFFFF',
    lineHeight: 34,
  },
});
