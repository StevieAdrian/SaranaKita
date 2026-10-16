import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BaseCard } from '@/shared/components/ui';
import { useRole } from '@/shared/context/theme-context';
import { radius, spacing } from '@/shared/theme';

export type CardContributionProps = {
  reportsCreated?: number;
  votesOrRecommendations?: number;
  pendingConfirmation?: number;
  inReview?: number;
  inRepair?: number;
  rejected?: number;
  resolved?: number;
};

export function CardContribution({
  reportsCreated = 0,
  votesOrRecommendations = 0,
  pendingConfirmation = 0,
  inReview = 0,
  inRepair = 0,
  rejected = 0,
  resolved = 0,
}: CardContributionProps): React.JSX.Element {
  const { theme, currentRole } = useRole();

  const isGuru = currentRole === 'guru';
  const secondMetricLabel = isGuru ? 'Rekomendasi' : 'Dukungan';

  const statusItems = [
    { label: 'Menunggu Konfirmasi', count: pendingConfirmation },
    { label: 'Dalam Pemeriksaan', count: inReview },
    { label: 'Dalam Perbaikan', count: inRepair },
    { label: 'Ditolak', count: rejected },
    { label: 'Selesai', count: resolved },
  ];

  return (
    <BaseCard style={styles.card}>
      <Text
        accessibilityRole="header"
        style={[styles.title, { color: theme.textHeading }]}
      >
        Kontribusi Saya
      </Text>

      <View style={styles.metricRow}>
        <View
          style={[
            styles.metricBox,
            { backgroundColor: theme.backgroundSubtle },
          ]}
        >
          <Text style={[styles.metricValue, { color: theme.textHeading }]}>
            {reportsCreated}
          </Text>
          <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
            Laporan Dibuat
          </Text>
        </View>

        <View
          style={[
            styles.metricBox,
            { backgroundColor: theme.backgroundSubtle },
          ]}
        >
          <Text style={[styles.metricValue, { color: theme.textHeading }]}>
            {votesOrRecommendations}
          </Text>
          <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
            {secondMetricLabel}
          </Text>
        </View>
      </View>

      {/* Statistik Jumlah Laporan */}
      <View style={styles.statusList}>
        {statusItems.map((item) => (
          <View key={item.label} style={styles.statusRow}>
            <Text style={[styles.statusLabel, { color: theme.textSecondary }]}>
              {item.label}
            </Text>
            <Text style={[styles.statusCount, { color: theme.textHeading }]}>
              {item.count} Laporan
            </Text>
          </View>
        ))}
      </View>
    </BaseCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  metricRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  metricBox: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  metricLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  statusList: {
    gap: spacing.xs,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  statusLabel: {
    fontSize: 13,
  },
  statusCount: {
    fontSize: 13,
    fontWeight: '500',
  },
});
