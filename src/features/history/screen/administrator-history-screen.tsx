import React from 'react';
import { USER_ROLE } from '@/services/auth';
import { getThemeColors } from '@/shared/theme';
import { ScrollView, View } from 'react-native';
import { useHomeFeed } from '@/features/home/hooks/use-home-feed';
import { HistoryHeader } from '../components/history-header';
import { AllReportsHistory } from '../components/all-history-reports';

export function AdministratorHistoryScreen(): React.JSX.Element {
  const feed = useHomeFeed();
  return (
    <ScrollView
      className="flex-1 bg-[#EAF2FF]"
      showsVerticalScrollIndicator={false}
    >
      <HistoryHeader role={USER_ROLE.SISWA} completed={1} total={6} />

      <AllReportsHistory reports={feed.reports} />
    </ScrollView>
  );
}
