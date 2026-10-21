import React from 'react';
import { ScrollView } from 'react-native';
import { USER_ROLE } from '@/services/auth';
import { REPORT_STATUS } from '@/services/report';
import { StatisticHeader } from '../components/statistic-header';
import { RecentActivities } from '../components/recent-activities';
import { RecentActivity } from '../types';
import { AllReports } from '@/features/home/components/all-reports';
import { useHomeFeed } from '@/features/home/hooks/use-home-feed';

const activities: RecentActivity[] = [
  {
    id: '1',
    title: 'AC Ruang Kelas X-B Mati',
    status: REPORT_STATUS.DONE,
    date: '8 Jul 2026',
  },
  {
    id: '2',
    title: 'AC Ruang Kelas X-B Mati',
    status: REPORT_STATUS.WAITING_VERIFICATION,
    date: '30 Jun 2026',
  },
  {
    id: '3',
    title: 'AC Ruang Kelas X-B Mati',
    status: REPORT_STATUS.IN_REPAIR,
    date: '3 Jul 2026',
  },
  {
    id: '4',
    title: 'Proyektor Kelas IIB Bermasalah',
    status: REPORT_STATUS.WAITING_VERIFICATION,
    date: '24 Jul 2026',
  },
];

export function AdministratorStatisticScreen(): React.JSX.Element {
  const feed = useHomeFeed();
  return (
    <ScrollView
      className="flex-1 bg-[#EAF2FF]"
      showsVerticalScrollIndicator={false}
    >
      <StatisticHeader
        role={USER_ROLE.SISWA}
        completed={1}
        total={6}
        waitingVerification={2}
        inInspection={1}
        inRepair={1}
      />

      <RecentActivities role={USER_ROLE.SISWA} activities={activities} />
      <AllReports reports={feed.reports} />
    </ScrollView>
  );
}
