import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SectionHeader } from '@/shared/components/ui';
import { palette } from '@/shared/theme';
import { FeedReport } from '@/services/report';
import { useHomeFeed } from '../hooks/use-home-feed';
import { ReportListCard } from '@/shared/components/report';
import { toDisplayDate } from '../utils/feed';

type ReportFilter = 'all' | 'mine' | 'supported';

type AllReportsProps = {
  reports: readonly FeedReport[];
};

const FILTERS: { label: string; value: ReportFilter }[] = [
  { label: 'Semua', value: 'all' },
  { label: 'Laporan Saya', value: 'mine' },
  { label: 'Didukung', value: 'supported' },
];

export function AllReports({ reports }: AllReportsProps): React.JSX.Element {
  const [filter, setFilter] = useState<ReportFilter>('all');

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

      <Text className="text-sm text-gray-500">
        {reports.length > 0 ? (
          <View className="w-full gap-3">
            {reports.slice(0, 3).map(report => (
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
