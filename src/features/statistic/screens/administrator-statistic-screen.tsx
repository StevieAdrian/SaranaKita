import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { USER_ROLE } from '@/services/auth';
import { StatisticHeader } from '../components/statistic-header';
import { RecentActivities } from '../components/recent-activities';
import { AllReports } from '@/features/home/components/all-reports';
import { useHomeFeed } from '@/features/home/hooks/use-home-feed';
import { useReportMonitoring } from '../hooks/use-report-monitoring';

export function AdministratorStatisticScreen(): React.JSX.Element {
  const feed = useHomeFeed();
  const monitoring = useReportMonitoring();

  if (monitoring.loading && !monitoring.data) {
    return (
      <View className="flex-1 items-center justify-center bg-[#EAF2FF]">
        <ActivityIndicator size="large" />
        <Text>Memuat statistik laporan...</Text>
      </View>
    );
  }

  if (monitoring.error && !monitoring.data) {
    return (
      <View className="flex-1 items-center justify-center bg-[#EAF2FF] p-4">
        <Text>{monitoring.error}</Text>
      </View>
    );
  }

  const statistics = monitoring.data?.statistics;

  return (
    <ScrollView
      className="flex-1 bg-[#EAF2FF]"
      showsVerticalScrollIndicator={false}
    >
      <StatisticHeader
        role={USER_ROLE.ADMINISTRATOR}
        completed={statistics?.completed ?? 0}
        total={statistics?.total ?? 0}
        waitingVerification={statistics?.waitingVerification ?? 0}
        inInspection={statistics?.inInspection ?? 0}
        inRepair={statistics?.inRepair ?? 0}
      />

      <RecentActivities
        role={USER_ROLE.ADMINISTRATOR}
        activities={monitoring.data?.activities ?? []}
      />

      <AllReports reports={feed.reports} />
    </ScrollView>
  );
}
