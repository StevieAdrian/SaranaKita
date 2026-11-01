import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { USER_ROLE, type UserRole } from '@/services/auth';
import type { RootStackParamList } from '@/navigation/types';
import { MonitoringReportCard } from '@/shared/components/report';
import { ChipTabs } from '@/shared/components/ui';
import { SectionHeader } from '@/shared/components/ui';
import { palette } from '@/shared/theme';
import { toDisplayDate } from '@/features/home/utils/feed';
import { useAllReports } from '@/features/statistic/hooks/use-all-reports';

type MonitoringFilter = 'all' | 'mine' | 'supported' | 'recommended';

type MonitoringReportsProps = {
  role: UserRole;
  currentUserId?: string;
};

export function MonitoringReports({
  role,
  currentUserId,
}: MonitoringReportsProps): React.JSX.Element {
  const [filter, setFilter] = useState<MonitoringFilter>('all');
  const { reports, loading, error, refresh } = useAllReports();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const options = useMemo(() => {
    const result: {
      label: string;
      value: MonitoringFilter;
    }[] = [
      { label: 'Semua', value: 'all' },
      { label: 'Laporan Saya', value: 'mine' },
    ];

    if (role === USER_ROLE.SISWA) {
      result.push({ label: 'Didukung', value: 'supported' });
    }

    if (role === USER_ROLE.GURU) {
      result.push({
        label: 'Direkomendasi',
        value: 'recommended',
      });
    }

    return result;
  }, [role]);

  const filteredReports = useMemo(() => {
    switch (filter) {
      case 'mine':
        return reports.filter(report => report.reporter_id === currentUserId);

      case 'supported':
        return reports.filter(report => report.votedByMe);

      case 'recommended':
        return reports.filter(report => report.recommendedByMe);

      default:
        return reports;
    }
  }, [reports, filter, currentUserId]);

  return (
    <View className="gap-4 px-5 pb-6">
      <SectionHeader title="Daftar Monitoring Laporan" />

      <ChipTabs
        options={options}
        value={filter}
        onChange={setFilter}
        accessibilityLabel="Filter monitoring laporan"
      />

      {loading ? (
        <View className="py-8">
          <ActivityIndicator />
        </View>
      ) : error ? (
        <View className="items-center gap-2 py-5">
          <Text className="text-center text-sm" style={{ color: palette.danger }}>
            {error}
          </Text>
          <Text
            className="text-sm font-semibold"
            style={{ color: palette.primary }}
            onPress={refresh}
          >
            Coba lagi
          </Text>
        </View>
      ) : filteredReports.length > 0 ? (
        <View className="gap-3">
          {filteredReports.map(report => (
            <MonitoringReportCard
              key={report.id}
              title={report.title}
              location={report.location}
              status={report.status}
              imageUrl={report.imageUrl}
              reporterName={report.reporterName}
              date={toDisplayDate(report.createdAt)}
              votes={report.votes}
              comments={report.comments}
              onPress={() =>
                navigation.navigate('ReportDetail', { reportId: report.id })
              }
            />
          ))}
        </View>
      ) : (
        <Text
          className="py-5 text-center text-sm"
          style={{ color: palette.gray500 }}
        >
          Tidak ada laporan untuk filter ini.
        </Text>
      )}
    </View>
  );
}
