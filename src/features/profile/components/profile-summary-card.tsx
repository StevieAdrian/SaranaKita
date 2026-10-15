import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import dummyAvatar from '@/assets/images/base-pict.png';
import { Avatar, BaseCard } from '@/shared/components/ui';
import { useRole } from '@/shared/context/theme-context';
import { radius, spacing } from '@/shared/theme';
import { formatBadgeLabel } from '../utils/constants';

export type ProfileSummaryCardProps = {
  name: string;
  subtitle: string;
  role?: string | null;
  avatarUrl?: string | null;
};

export function ProfileSummaryCard({
  name,
  subtitle,
  role,
  avatarUrl,
}: ProfileSummaryCardProps): React.JSX.Element {
  const { theme, currentRole } = useRole();
  const effectiveRole = role ?? currentRole;

  const isGuru = effectiveRole === 'guru';
  const badgeTextColor = isGuru ? theme.badgeActive : theme.success;
  const badgeBgColor = isGuru ? theme.badgeActiveSurface : theme.successSurface;

  return (
    <BaseCard style={styles.card}>
      <View style={styles.contentRow}>
        <Avatar
          uri={avatarUrl}
          source={!avatarUrl ? dummyAvatar : undefined}
          name={name}
          size="lg"
          style={styles.avatar}
        />

        <View style={styles.infoCol}>
          <Text
            accessibilityRole="header"
            numberOfLines={1}
            style={[styles.name, { color: theme.textHeading }]}
          >
            {name}
          </Text>

          <Text
            numberOfLines={1}
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
    marginTop: -28,
    marginHorizontal: spacing.lg,
    padding: spacing.md,
    borderRadius: 20,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    borderRadius: 34,
  },
  infoCol: {
    flex: 1,
    justifyContent: 'center',
    gap: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginTop: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
