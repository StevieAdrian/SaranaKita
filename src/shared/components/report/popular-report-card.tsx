import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ReportThumbnail } from './report-thumbnail';
import { StatusBadge } from './status-badge';
import { REPORT_STATUS_META, type ReportStatus } from './report-status';

export type PopularReportCardProps = {
  title: string;
  location: string;
  date: string;
  status: ReportStatus;
  votes: number;
  imageUrl: string | null;
  onPress?: () => void;
};

export function PopularReportCard({
  title,
  location,
  date,
  status,
  votes,
  imageUrl,
  onPress,
}: PopularReportCardProps): React.JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${location}, ${REPORT_STATUS_META[status].label}, ${votes} votes`}
      className="w-[200px] overflow-hidden rounded-lg bg-white active:opacity-80"
    >
      <View>
        <ReportThumbnail uri={imageUrl} className="h-32 w-full" />
        <View className="absolute right-2 top-2 rounded-full bg-white px-2.5 py-0.5">
          <Text className="text-xs font-bold text-gray-900">{votes}</Text>
        </View>
        <View className="absolute bottom-2 left-2">
          <StatusBadge status={status} size="sm" />
        </View>
      </View>
      <View className="gap-1 p-3">
        <Text numberOfLines={1} className="text-base font-bold text-gray-900">
          {title}
        </Text>
        <Text numberOfLines={1} className="text-xs text-gray-500">
          {location} · {date}
        </Text>
      </View>
    </Pressable>
  );
}
