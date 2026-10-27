import React from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import maleDefault from '@/assets/images/male-default.png';
import womanDefault from '@/assets/images/woman-default.png';
import { BaseCard } from '@/shared/components/ui';
import { useRole } from '@/shared/context/theme-context';
import { formatBadgeLabel, profileFonts } from '../utils/constants';

export type ProfileSummaryCardProps = {
  name: string;
  subtitle: string;
  role?: string | null;
  avatarUrl?: string | null;
  gender?: string | null;
};

export function ProfileSummaryCard({
  name,
  subtitle,
  role,
  avatarUrl,
  gender,
}: ProfileSummaryCardProps): React.JSX.Element {
  const { theme, currentRole } = useRole();
  const effectiveRole = role ?? currentRole;
  const isGuru = effectiveRole === 'guru';
  const badgeTextColor = isGuru ? theme.badgeActive : theme.success;
  const badgeBgColor = isGuru ? theme.badgeActiveSurface : theme.successSurface;
  const isFemale = gender === 'Female' || gender === 'Perempuan';
  const defaultAvatarSource = isFemale ? womanDefault : maleDefault;

  return (
    <BaseCard style={styles.card}>
      <View style={styles.contentRow}>
        <View style={styles.avatarContainer}>
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={styles.avatarImage}
              resizeMode="cover"
              accessibilityRole="image"
              accessibilityLabel="Foto Profil"
            />
          ) : (
            <Image
              source={defaultAvatarSource}
              style={styles.defaultAvatarImage}
              resizeMode="contain"
              accessibilityRole="image"
              accessibilityLabel="Foto Profil"
            />
          )}
        </View>

        <View style={styles.infoCol}>
          <Text
            accessibilityRole="header"
            numberOfLines={1}
            style={[styles.name, { color: theme.textHeading }]}
          >
            {name}
          </Text>

          <Text
            numberOfLines={2}
            style={[styles.subtitle, { color: theme.textSecondary }]}
          >
            {subtitle}
          </Text>

          <View style={[styles.badge, { backgroundColor: badgeBgColor }]}>
            <Text style={[styles.badgeText, { color: badgeTextColor }]}>
              {formatBadgeLabel(effectiveRole)}
            </Text>
          </View>
        </View>
      </View>
    </BaseCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: -44,
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#D9D9D9',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderWidth: 3.5,
    borderColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarImage: {
    width: 70,
    height: 70,
  },
  defaultAvatarImage: {
    width: 53,
    height: 54,
  },
  infoCol: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  name: {
    fontFamily: profileFonts.bold,
    fontSize: 18,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    lineHeight: 26,
  },
  subtitle: {
    fontFamily: profileFonts.regular,
    fontSize: 13,
    fontWeight: Platform.OS === 'ios' ? '400' : undefined,
    lineHeight: 18,
    marginTop: 1,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    marginTop: 6,
  },
  badgeText: {
    fontFamily: profileFonts.medium,
    fontSize: 12,
    fontWeight: Platform.OS === 'ios' ? '500' : undefined,
    lineHeight: 16,
  },
});
