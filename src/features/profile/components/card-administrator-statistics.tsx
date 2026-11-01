import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { profileColors, profileFonts } from '../utils/constants';

export type CardAdministratorStatisticsProps = {
  'Menunggu Verifikasi'?: number;
  'Dalam Pemeriksaan'?: number;
  'Dalam Perbaikan'?: number;
  'Selesai'?: number;
};

export function CardAdministratorStatistics(
  props: CardAdministratorStatisticsProps,
): React.JSX.Element {
  const stats = [
    {
      key: 'pending',
      value: props['Menunggu Verifikasi'] ?? 0,
      label: 'Menunggu\nVerifikasi',
      color: profileColors.stats.pending,
    },
    {
      key: 'inReview',
      value: props['Dalam Pemeriksaan'] ?? 0,
      label: 'Dalam\nPemeriksaan',
      color: profileColors.stats.inReview,
    },
    {
      key: 'inRepair',
      value: props['Dalam Perbaikan'] ?? 0,
      label: 'Dalam\nPerbaikan',
      color: profileColors.stats.inRepair,
    },
    {
      key: 'resolved',
      value: props['Selesai'] ?? 0,
      label: 'Laporan\nSelesai',
      color: profileColors.stats.resolved,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {stats.map((item) => (
          <View key={item.key} style={styles.card}>
            <Text style={[styles.number, { color: item.color }]}>
              {item.value}
            </Text>
            <Text style={styles.label} numberOfLines={2}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  card: {
    flex: 1,
    minHeight: 80,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  number: {
    fontFamily: profileFonts.bold,
    fontSize: 22,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    lineHeight: 26,
    textAlign: 'center',
    includeFontPadding: false,
    marginBottom: 4,
  },
  label: {
    fontFamily: profileFonts.medium,
    fontSize: 11,
    fontWeight: Platform.OS === 'ios' ? '500' : undefined,
    color: '#1E1E1E',
    opacity: 0.5,
    textAlign: 'center',
    lineHeight: 14,
    includeFontPadding: false,
  },
});
