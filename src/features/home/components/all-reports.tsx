import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SectionHeader } from '@/shared/components/ui';
import { palette } from '@/shared/theme';
import { FeedReport } from '@/services/report';
import { ReportListCard } from '@/shared/components/report';
import { toDisplayDate } from '../utils/feed';
import { USER_ROLE, type UserRole } from '@/services/auth';
import { useCurrentUser } from '@/features/home/hooks/use-current-user';

type ReportFilter = 'all' | 'mine' | 'supported';

type AllReportsProps = {
  reports: readonly FeedReport[];
  role: UserRole;
};

const FILTERS: { label: string; value: ReportFilter }[] = [
  { label: 'Semua', value: 'all' },
  { label: 'Laporan Saya', value: 'mine' },
  { label: 'Didukung', value: 'supported' },
];

export function AllReports({ reports, role }: AllReportsProps): React.JSX.Element {
  const [filter, setFilter] = useState<ReportFilter>('all');
  const currentUser = useCurrentUser();
  const filteredReports = reports.filter(report => {
    const isMine = report.reporter_id === currentUser?.id;
    if (filter === 'mine') return isMine;
    if (filter === 'supported') {
      return role === USER_ROLE.GURU ? report.recommendedByMe : report.votedByMe;
    }
    if (role === USER_ROLE.GURU) return isMine || report.recommendedByMe;
    if (role === USER_ROLE.SISWA || role === USER_ROLE.ADMINISTRATOR) {
      return isMine || report.votedByMe;
    }
    return true;
  });

  return (
    <View className="gap-4 px-5 pb-6">
      <SectionHeader title="Semua Laporan" />

      <View className="flex-row gap-2">
        {FILTERS.map(item => {
          const active = filter === item.value;

          return (
            <Pressable
              key={item.value}
              onPress={() => setFilter(item.value)}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              className="min-h-[40px] flex-1 items-center justify-center rounded-lg border px-1 text-[12px]"
              style={{
                backgroundColor: active ? '#DBEAFE' : palette.white,
                borderColor: active ? palette.primary : palette.gray300,
              }}
            >
              <Text
                className="text-xs"
                style={{
                  color: active ? palette.primary : palette.gray500,
                  fontWeight: active ? '600' : '400',
                }}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {filteredReports.length > 0 ? (
          <View className="w-full gap-3">
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
          <Text className="text-sm text-gray-500">Belum ada laporan.</Text>
        )}
    </View>
  );
}
