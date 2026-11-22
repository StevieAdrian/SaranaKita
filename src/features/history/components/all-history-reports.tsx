import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useRole } from '@/shared/context/theme-context';
import type { FeedReport } from '@/services/report';
import { ReportListCard } from '@/shared/components/report';
import { toDisplayDate } from '@/features/home/utils/feed';
import { HistoryFilter } from '..';
import { USER_ROLE, UserRole } from '@/services/auth';
import { useCurrentUser } from '@/features/home/hooks/use-current-user';

type AllReportsHistoryProps = {
  reports: readonly FeedReport[];
  loading: boolean;
  filter: HistoryFilter;
  query: string;
  role: UserRole;
  onEvaluatePress: (report: FeedReport) => void;
  evaluatedReportIds: ReadonlySet<string>;
  onViewEvaluations: (report: FeedReport) => void;
};

export function AllReportsHistory({
  reports,
  loading,
  filter,
  query,
  role,
  onEvaluatePress,
  evaluatedReportIds,
  onViewEvaluations,
}: AllReportsHistoryProps): React.JSX.Element {
  const { theme } = useRole();
  const currentUser = useCurrentUser();
  const normalizedQuery = query.trim().toLowerCase();

  const filteredReports = reports.filter(report => {
    const isStudent = role === USER_ROLE.SISWA;
    const isTeacher = role === USER_ROLE.GURU;
    const isStaff = role === USER_ROLE.STAFF;
    const isAdmin = role === USER_ROLE.ADMINISTRATOR;

    const isMine = report.reporter_id === currentUser?.id;

    const matchesFilter =
      filter === 'all'
        ? isAdmin ||
          (isStaff && true) ||
          (isStudent &&
            report.status === 'done' &&
            (isMine || report.votedByMe)) ||
          (isTeacher &&
            report.status === 'done' &&
            (isMine || report.recommendedByMe))
        : filter === 'mine'
        ? isMine
        : filter === 'supported'
        ? report.votedByMe
        : filter === 'recommended'
        ? report.recommendedByMe
        : false;

    const searchableText = [
      report.title,
      report.description,
      report.location,
      report.reporterName,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return matchesFilter && searchableText.includes(normalizedQuery);
  });

  return (
    <View className="mt-5 gap-4 px-5 pb-6">
      {loading ? (
        <View className="items-center justify-center gap-3 py-10">
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={{ color: theme.textSecondary }} className="text-sm">
            Memuat laporan…
          </Text>
        </View>
      ) : filteredReports.length > 0 ? (
        <View className="w-full gap-3">
          {filteredReports.map(report => (
            <ReportListCard
              key={report.id}
              showProgress
              showFinalizedTime
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
              action={
                report.status === 'done'
                  ? evaluatedReportIds.has(report.id)
                    ? {
                        label: 'Lihat Semua Evaluasi',
                        onPress: () => onViewEvaluations(report),
                        variant: 'muted',
                      }
                    : {
                        label: 'Tambah Evaluasi',
                        onPress: () => onEvaluatePress(report),
                        variant: 'solid',
                      }
                  : undefined
              }
            />
          ))}
        </View>
      ) : (
        <Text className="text-sm text-gray-500">
          Belum ada laporan yang sesuai.
        </Text>
      )}
    </View>
  );
}
