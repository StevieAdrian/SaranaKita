import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRole } from '@/shared/context/theme-context';
import { ReportThumbnail } from './report-thumbnail';
import { StatusBadge } from './status-badge';
import { ReportProgress } from './report-progress';
import { REPORT_PROGRESS } from './report-progress-meta';
import type { ReportStatus } from './report-status';

export type MonitoringReportCardProps = {
  title: string;
  status: ReportStatus;
  imageUrl: string | null;
  reporterName: string;
  date: string;
  location: string;
  votes: number;
  comments: number;
  onPress?: () => void;
  detailLabel?: string;
};

export function MonitoringReportCard({
  title,
  status,
  imageUrl,
  reporterName,
  date,
  location,
  votes,
  comments,
  onPress,
  detailLabel = 'Lihat Detail',
}: MonitoringReportCardProps): React.JSX.Element {
  const { theme } = useRole();
  const { percent, color } = REPORT_PROGRESS[status];

  return (
    <View
      style={{ backgroundColor: theme.surface }}
      className="overflow-hidden rounded-lg py-2"
    >
      <View className="gap-4 p-4">
        <View className="flex-row gap-3">
          <ReportThumbnail uri={imageUrl} className="h-24 w-24 rounded-md" />
          <View className="flex-1 gap-1.5">
            <View className="flex-row items-start gap-2">
              <Text
                numberOfLines={2}
                style={{ color: theme.textHeading }}
                className="flex-1 text-base font-bold"
              >
                {title}
              </Text>
              <View className="items-end">
                <Text className="text-base font-bold" style={{ color }}>
                  {percent}%
                </Text>
                <Text
                  className="text-[11px]"
                  style={{ color: theme.textMuted }}
                >
                  progres
                </Text>
              </View>
            </View>
            <Text
              numberOfLines={1}
              style={{ color: theme.textSecondary }}
              className="text-sm"
            >
              {reporterName} | {date}
            </Text>
            <StatusBadge status={status} />
          </View>
        </View>

        <ReportProgress status={status} />
      </View>

      <View
        style={{ borderTopColor: theme.borderSubtle }}
        className="flex-row items-center justify-between border-t px-4 py-3"
      >
        <Text style={{ color: theme.textSecondary }} className="text-sm">
          <Text style={{ color: theme.textHeading }} className="font-bold">
            {votes}
          </Text>{' '}
          Votes
          {'   '}
          <Text style={{ color: theme.textHeading }} className="font-bold">
            {comments}
          </Text>{' '}
          Komentar
        </Text>

        {onPress ? (
          <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`${detailLabel} ${title}, ${location}`}
            style={{ backgroundColor: theme.primary }}
            className="min-h-[44px] justify-center rounded-lg px-6 active:opacity-70"
          >
            <Text style={{ color: '#FFFFFF' }} className="font-semibold">
              {detailLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
