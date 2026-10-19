import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BaseCard } from '@/shared/components/ui';
import { useRole } from '@/shared/context/theme-context';
import { radius, spacing } from '@/shared/theme';

export type UserCountMetric = {
  total: number;
  active: number;
  inactive: number;
};

export type SummaryCardProps = {
  siswa?: UserCountMetric;
  guru?: UserCountMetric;
  staff?: UserCountMetric;
};

export function SummaryCard({
  siswa = { total: 0, active: 0, inactive: 0 },
  guru = { total: 0, active: 0, inactive: 0 },
  staff = { total: 0, active: 0, inactive: 0 },
}: SummaryCardProps): React.JSX.Element {
  const { theme } = useRole();

  const cards = [
    { title: 'Siswa', data: siswa },
    { title: 'Guru', data: guru },
    { title: 'Staff', data: staff },
  ];

  return (
    <View style={styles.container}>
      {cards.map((item) => (
        <BaseCard key={item.title} style={styles.miniCard}>
          <Text style={[styles.roleTitle, { color: theme.textSecondary }]}>
            {item.title}
          </Text>

          <Text
            accessibilityRole="header"
            style={[styles.countText, { color: theme.textHeading }]}
          >
            {item.data.total}
          </Text>

          <View style={styles.breakdownRow}>
            <View style={styles.dotGroup}>
              <View
                style={[styles.dot, { backgroundColor: theme.success }]}
              />
              <Text style={[styles.breakdownText, { color: theme.textSecondary }]}>
                {item.data.active}
              </Text>
            </View>

            <View style={styles.dotGroup}>
              <View
                style={[styles.dot, { backgroundColor: theme.danger }]}
              />
              <Text style={[styles.breakdownText, { color: theme.textSecondary }]}>
                {item.data.inactive}
              </Text>
            </View>
          </View>
        </BaseCard>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  miniCard: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleTitle: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  countText: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  breakdownRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  dotGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  breakdownText: {
    fontSize: 11,
  },
});
