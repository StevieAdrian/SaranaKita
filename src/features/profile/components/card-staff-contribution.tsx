import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { BaseCard } from '@/shared/components/ui/base-card';
import { useRole } from '@/shared/context/theme-context';
import { profileFonts } from '../utils/constants';

export type CardStaffContributionProps = {
  'Menunggu Verifikasi'?: number;
  'Selesai'?: number;
  'Ditolak'?: number;
};

export function CardStaffContribution(
  props: CardStaffContributionProps,
): React.JSX.Element {
  const { theme } = useRole();

  const rejectedCount = props['Ditolak'] ?? 0;
  const verifiedCount = props['Selesai'] ?? 0;
  const pendingCount = props['Menunggu Verifikasi'] ?? 0;

  return (
    <BaseCard style={styles.card}>
      <Text
        accessibilityRole="header"
        style={[styles.title, { color: theme.textEmphasis || '#000000' }]}
      >
        Kontribusi Saya
      </Text>

      <View style={styles.staffRow}>
        {/* Laporan Ditolak */}
        <View style={styles.miniCard}>
          <Text style={[styles.miniNumber, { color: '#9A3412' }]}>
            {rejectedCount}
          </Text>
          <Text style={styles.miniLabel} numberOfLines={2}>
            Laporan Ditolak
          </Text>
        </View>

        {/* Laporan Diverifikasi */}
        <View style={styles.miniCard}>
          <Text style={[styles.miniNumber, { color: '#2563EB' }]}>
            {verifiedCount}
          </Text>
          <Text style={styles.miniLabel} numberOfLines={2}>
            Laporan Diverifikasi
          </Text>
        </View>

        {/* Menunggu Verifikasi */}
        <View style={styles.miniCard}>
          <Text style={[styles.miniNumber, { color: '#F59E0B' }]}>
            {pendingCount}
          </Text>
          <Text style={styles.miniLabel} numberOfLines={2}>
            Menunggu{'\n'}Verifikasi
          </Text>
        </View>
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
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
    marginBottom: 12,
  },
  staffRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'stretch',
  },
  miniCard: {
    flex: 1,
    height: 75,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  miniNumber: {
    fontFamily: profileFonts.bold,
    fontSize: 18,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    lineHeight: 24,
    textAlign: 'center',
  },
  miniLabel: {
    fontFamily: profileFonts.regular,
    fontSize: 11,
    fontWeight: Platform.OS === 'ios' ? '400' : undefined,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 3,
    lineHeight: 14,
  },
});
