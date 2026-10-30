import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRole } from '@/shared/context/theme-context';
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
  const { theme } = useRole();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${location}, ${REPORT_STATUS_META[status].label}, ${votes} votes`}
      style={{ backgroundColor: theme.surface }}
      className="w-[200px] overflow-hidden rounded-lg active:opacity-80"
    >
      <View>
        <ReportThumbnail uri={imageUrl} className="h-32 w-full" />
        <View
          style={{ backgroundColor: theme.surface }}
          className="absolute right-2 top-2 rounded-full px-2.5 py-0.5"
        >
          <Text style={{ color: theme.textHeading }} className="text-xs font-bold">{votes}</Text>
        </View>
        <View className="absolute bottom-2 left-2">
          <StatusBadge status={status} size="sm" />
        </View>
      </View>
      <View className="gap-1 p-3">
        <Text
          numberOfLines={1}
          style={{ color: theme.textHeading }}
          className="text-base font-bold"
        >
          {title}
        </Text>
        <Text
          numberOfLines={1}
          style={{ color: theme.textSecondary }}
          className="text-xs"
        >
          {location} · {date}
        </Text>
      </View>
    </Pressable>
  );
}
