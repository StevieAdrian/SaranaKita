import React, { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { USER_ROLE, type UserRole } from '@/services/auth';
import type { FeedReport } from '@/services/report';
import { ReportListCard } from '@/shared/components/report';
import { ChipTabs } from '@/shared/components/ui';
import { SectionHeader } from '@/shared/components/ui';
import { palette } from '@/shared/theme';
import { toDisplayDate } from '@/features/home/utils/feed';

type MonitoringFilter = 'all' | 'mine' | 'supported' | 'recommended';

type MonitoringReportsProps = {
  reports: readonly FeedReport[];
  role: UserRole;
  currentUserId?: string;
};

export function MonitoringReports({
  reports,
  role,
  currentUserId,
}: MonitoringReportsProps): React.JSX.Element {
  const [filter, setFilter] = useState<MonitoringFilter>('all');

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

      {filteredReports.length > 0 ? (
        <View className="gap-3">
          {filteredReports.slice(0, 3).map(report => (
            <ReportListCard
              key={report.id}
              title={report.title}
              description={report.description}
              location={report.location}
              status={report.status}
              imageUrl={report.imageUrl}
              reporterName={report.reporterName}
              reporterClass={report.reporterClass}
              date={toDisplayDate(report.createdAt)}
              votes={report.votes}
              comments={report.comments}
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
