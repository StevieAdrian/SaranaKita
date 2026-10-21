import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SectionHeader } from '@/shared/components/ui';
import { palette } from '@/shared/theme';
import { FeedReport } from '@/services/report';
import { ReportListCard } from '@/shared/components/report';
import { toDisplayDate } from '@/features/home/utils/feed';

type ReportFilter = 'all' | 'mine' | 'supported';

type AllReportsProps = {
  reports: readonly FeedReport[];
};

export function AllReportsHistory({
  reports,
}: AllReportsProps): React.JSX.Element {
  const [filter, setFilter] = useState<ReportFilter>('all');

  return (
    <View className="mt-100 gap-4 px-5 pb-6">
      <Text className="text-sm text-gray-500">
        {reports.length > 0 ? (
          <View className="w-full gap-3">
            {reports.map(report => (
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
          'Belum ada laporan.'
        )}
      </Text>
    </View>
  );
}
