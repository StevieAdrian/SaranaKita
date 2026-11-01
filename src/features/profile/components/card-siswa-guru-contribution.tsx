import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { BaseCard } from '@/shared/components/ui/base-card';
import { useRole } from '@/shared/context/theme-context';
import { profileFonts } from '../utils/constants';

export type CardStudentTeacherContributionProps = {
  role?: string | null;
  reportsCreated?: number;
  votesOrRecommendations?: number;
  votesOrRecommendationsLabel?: string;
  'Menunggu Verifikasi'?: number;
  'Dalam Pemeriksaan'?: number;
  'Dalam Perbaikan'?: number;
  'Selesai'?: number;
  'Ditolak'?: number;
};

export function CardStudentTeacherContribution(
  props: CardStudentTeacherContributionProps,
): React.JSX.Element {
  const {
    role,
    reportsCreated = 0,
    votesOrRecommendations = 0,
    votesOrRecommendationsLabel,
  } = props;

  const { theme, currentRole } = useRole();
  const effectiveRole = role ?? currentRole;

  const secondaryLabel =
    votesOrRecommendationsLabel ||
    (effectiveRole === 'guru' ? 'Rekomendasi' : 'Dukungan');

  const statusRows = [
    {
      label: 'Menunggu Verifikasi',
      count: props['Menunggu Verifikasi'] ?? 0,
    },
    {
      label: 'Dalam Pemeriksaan',
      count: props['Dalam Pemeriksaan'] ?? 0,
    },
    {
      label: 'Dalam Perbaikan',
      count: props['Dalam Perbaikan'] ?? 0,
    },
    {
      label: 'Selesai',
      count: props['Selesai'] ?? 0,
    },
    {
      label: 'Ditolak',
      count: props['Ditolak'] ?? 0,
    },
  ];

  return (
    <BaseCard style={styles.card}>
      <Text
        accessibilityRole="header"
        style={[styles.title, { color: theme.textEmphasis || '#000000' }]}
      >
        Kontribusi Saya
      </Text>

      {/* Laporan Dibuat */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricNumber}>{reportsCreated}</Text>
          <Text style={styles.metricLabel} numberOfLines={1}>
            Laporan Dibuat
          </Text>
        </View>

        {/* Dukungan / Rekomendasi */}
        <View style={styles.metricCard}>
          <Text style={styles.metricNumber}>{votesOrRecommendations}</Text>
          <Text style={styles.metricLabel} numberOfLines={1}>
            {secondaryLabel}
          </Text>
        </View>
      </View>

      {/* Data Detail Laporan */}
      <View style={styles.statusList}>
        {statusRows.map((row) => (
          <View key={row.label} style={styles.statusRow}>
            <Text style={styles.statusLabel}>{row.label}</Text>
            <Text style={styles.statusCount}>{`${row.count} Laporan`}</Text>
          </View>
        ))}
      </View>
    </BaseCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 10,
    padding: 16,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  title: {
    fontFamily: profileFonts.bold,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    lineHeight: 23,
    marginBottom: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  metricCard: {
    flex: 1,
    height: 62,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  metricNumber: {
    fontFamily: profileFonts.semiBold,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
    color: '#000000',
    textAlign: 'center',
  },
  metricLabel: {
    fontFamily: profileFonts.regular,
    fontSize: 12,
    fontWeight: Platform.OS === 'ios' ? '400' : undefined,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 2,
  },
  statusList: {
    gap: 10,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  statusLabel: {
    fontFamily: profileFonts.medium,
    fontSize: 12,
    fontWeight: Platform.OS === 'ios' ? '500' : undefined,
    color: '#94A3B8',
  },
  statusCount: {
    fontFamily: profileFonts.regular,
    fontSize: 12,
    fontWeight: Platform.OS === 'ios' ? '400' : undefined,
    color: '#000000',
  },
});
