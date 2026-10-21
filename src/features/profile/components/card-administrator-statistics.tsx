import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { profileFonts } from '../utils/constants';

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
      color: '#2563EB',
    },
    {
      key: 'inReview',
      value: props['Dalam Pemeriksaan'] ?? 0,
      label: 'Dalam\nPemeriksaan',
      color: '#F59E0B',
    },
    {
      key: 'inRepair',
      value: props['Dalam Perbaikan'] ?? 0,
      label: 'Dalam\nPerbaikan',
      color: '#713F12',
    },
    {
      key: 'resolved',
      value: props['Selesai'] ?? 0,
      label: 'Laporan\nSelesai',
      color: '#166534',
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
    height: 76,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 6,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  number: {
    fontFamily: profileFonts.medium,
    fontSize: 20,
    fontWeight: Platform.OS === 'ios' ? '500' : undefined,
    lineHeight: 22,
    textAlign: 'center',
  },
  label: {
    fontFamily: profileFonts.regular,
    fontSize: 10,
    fontWeight: Platform.OS === 'ios' ? '400' : undefined,
    color: '#1E1E1E',
    opacity: 0.5,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 12,
  },
});
