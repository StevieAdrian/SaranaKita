import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

import { USER_ROLE } from '@/services/auth';
import { useHomeFeed } from '@/features/home/hooks/use-home-feed';

import { StatisticHeader } from '../components/statistic-header';
import { RecentActivities } from '../components/recent-activities';
import { useReportMonitoring } from '../hooks/use-report-monitoring';
import { MonitoringReports } from '@/features/home/components/monitoring-reports';
import { useCurrentUser } from '../hooks/use-current-user';

export function StudentStatisticScreen(): React.JSX.Element {
  const user = useCurrentUser();
  const feed = useHomeFeed();
  const monitoring = useReportMonitoring();

  if (monitoring.loading && !monitoring.data) {
    return (
      <View className="flex-1 items-center justify-center bg-[#EAF2FF]">
        <ActivityIndicator size="large" />
        <Text className="mt-3 text-sm text-gray-500">
          Memuat monitoring laporan...
        </Text>
      </View>
    );
  }

  if (monitoring.error && !monitoring.data) {
    return (
      <View className="flex-1 items-center justify-center bg-[#EAF2FF] px-5">
        <Text className="text-center text-red-600">{monitoring.error}</Text>

        <Text
          className="mt-3 font-semibold text-blue-600"
          onPress={() => void monitoring.refresh()}
        >
          Coba lagi
        </Text>
      </View>
    );
  }

  const statistics = monitoring.data?.statistics;
  const activities = monitoring.data?.activities ?? [];

  return (
    <ScrollView
      className="flex-1 bg-[#EAF2FF]"
      showsVerticalScrollIndicator={false}
    >
      <StatisticHeader
        role={USER_ROLE.SISWA}
        completed={statistics?.completed ?? 0}
        total={statistics?.total ?? 0}
        waitingVerification={statistics?.waitingVerification ?? 0}
        inInspection={statistics?.inInspection ?? 0}
        inRepair={statistics?.inRepair ?? 0}
      />

      <RecentActivities role={USER_ROLE.SISWA} activities={activities} />

      <MonitoringReports
        reports={feed.reports}
        role={USER_ROLE.SISWA}
        currentUserId={user?.id}
      />
    </ScrollView>
  );
}
