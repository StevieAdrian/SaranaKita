import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRole } from '@/shared/context/theme-context';
import { palette } from '@/shared/theme';
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
  isOwner?: boolean;
  canStillEdit?: boolean;
  remainingTime?: string;
  onEditPress?: () => void;
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
  isOwner = false,
  canStillEdit = false,
  remainingTime = '00:00:00',
  onEditPress,
}: MonitoringReportCardProps): React.JSX.Element {
  const { theme } = useRole();
  const { percent, color } = REPORT_PROGRESS[status];
  const showEdit = isOwner && canStillEdit;

  return (
    <View
      style={{ backgroundColor: theme.surface }}
      className="overflow-hidden rounded-lg py-2"
    >
      <View className="gap-4 p-4">
        <View className="flex-row gap-3">
          <ReportThumbnail uri={imageUrl} className="h-24 w-24 rounded-md" />
          <View className="flex-1 gap-1.5">
            {isOwner ? (
              <View
                style={{ backgroundColor: palette.black }}
                className="flex-row items-center gap-2 self-start rounded-full px-3 py-1"
              >
                <View className="h-1.5 w-1.5 rounded-full bg-white" />
                <Text className="text-xs font-semibold text-white">
                  Laporan Dibuat
                </Text>
              </View>
            ) : null}
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

      {showEdit ? (
        <View
          style={{ borderTopColor: theme.borderSubtle }}
          className="flex-row items-center justify-between border-t px-4 py-3"
        >
          <Text style={{ color: theme.textMuted }} className="flex-1 text-xs">
            Waktu Tersisa Untuk Mengubah Laporan:
          </Text>
          <Text style={{ color: theme.textMuted }} className="text-xs">
            {remainingTime}
          </Text>
        </View>
      ) : null}

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

        {showEdit && onEditPress ? (
          <Pressable
            onPress={onEditPress}
            accessibilityRole="button"
            accessibilityLabel={`Ubah laporan ${title}`}
            style={{ backgroundColor: palette.black }}
            className="min-h-[44px] justify-center rounded-lg px-6 active:opacity-70"
          >
            <Text style={{ color: '#FFFFFF' }} className="font-semibold">
              Ubah Laporan
            </Text>
          </Pressable>
        ) : onPress ? (
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
