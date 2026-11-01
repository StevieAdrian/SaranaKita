import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { userFonts, userManagementColors } from '../utils/constants';
import { useRole } from '@/shared/context/theme-context';

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
    {
      title: 'Siswa',
      data: siswa,
      badgeBg: userManagementColors.badges.summary.siswa.bg,
      badgeText: userManagementColors.badges.summary.siswa.text,
    },
    {
      title: 'Guru',
      data: guru,
      badgeBg: userManagementColors.badges.summary.guru.bg,
      badgeText: userManagementColors.badges.summary.guru.text,
    },
    {
      title: 'Staff',
      data: staff,
      badgeBg: userManagementColors.badges.summary.staff.bg,
      badgeText: userManagementColors.badges.summary.staff.text,
    },
  ];

  return (
    <View style={styles.container}>
      {cards.map((item) => (
        <View key={item.title} style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.shadowColor }]}>
          <View style={styles.topRow}>
            <Text accessibilityRole="header" style={[styles.countText, { color: theme.textHeading }]}>
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
              <Text style={[styles.statusText, { color: theme.textSecondary }]} numberOfLines={1}>
                <Text style={[styles.statusNumber, { color: theme.textHeading }]}>{item.data.active}</Text> Aktif
              </Text>
            </View>
            <View style={styles.statusLine}>
              <View style={[styles.statusDot, styles.inactiveDot]} />
              <Text style={[styles.statusText, { color: theme.textSecondary }]} numberOfLines={1}>
                <Text style={[styles.statusNumber, { color: theme.textHeading }]}>{item.data.inactive}</Text> Nonaktif
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
