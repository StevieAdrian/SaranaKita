import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { userFonts } from '../utils/constants';

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
  const cards = [
    {
      title: 'Siswa',
      data: siswa,
      badgeBg: 'rgba(37, 99, 235, 0.13)',
      badgeText: '#112D71',
    },
    {
      title: 'Guru',
      data: guru,
      badgeBg: 'rgba(245, 158, 11, 0.12)',
      badgeText: '#D97706',
    },
    {
      title: 'Staff',
      data: staff,
      badgeBg: 'rgba(22, 101, 52, 0.12)',
      badgeText: '#166534',
    },
  ];

  return (
    <View style={styles.container}>
      {cards.map((item) => (
        <View key={item.title} style={styles.card}>
          <View style={styles.topRow}>
            <Text accessibilityRole="header" style={styles.countText}>
              {item.data.total}
            </Text>
            <View style={[styles.roleBadge, { backgroundColor: item.badgeBg }]}>
              <Text style={[styles.roleBadgeText, { color: item.badgeText }]}>
                {item.title}
              </Text>
            </View>
          </View>

          <View style={styles.statusCol}>
            <View style={styles.statusLine}>
              <View style={[styles.statusDot, styles.activeDot]} />
              <Text style={styles.statusText} numberOfLines={1}>
                <Text style={styles.statusNumber}>{item.data.active}</Text> Aktif
              </Text>
            </View>
            <View style={styles.statusLine}>
              <View style={[styles.statusDot, styles.inactiveDot]} />
              <Text style={styles.statusText} numberOfLines={1}>
                <Text style={styles.statusNumber}>{item.data.inactive}</Text> Nonaktif
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  card: {
    flex: 1,
    minHeight: 84,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  countText: {
    fontFamily: userFonts.bold,
    fontSize: 22,
    color: '#1E1E1E',
    includeFontPadding: false,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleBadgeText: {
    fontFamily: userFonts.semiBold,
    fontSize: 10.5,
    includeFontPadding: false,
  },
  statusCol: {
    marginTop: 6,
    gap: 3,
  },
  statusLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6.5,
    height: 6.5,
    borderRadius: 3.5,
    marginRight: 6,
  },
  activeDot: {
    backgroundColor: '#16A34A',
  },
  inactiveDot: {
    backgroundColor: '#DC2626',
  },
  statusText: {
    fontFamily: userFonts.medium,
    fontSize: 10.5,
    color: '#334155',
    includeFontPadding: false,
  },
  statusNumber: {
    fontFamily: userFonts.semiBold,
    color: '#0F172A',
  },
});
