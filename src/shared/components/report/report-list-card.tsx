import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { palette } from '@/shared/theme';
import { ReportThumbnail } from './report-thumbnail';
import { StatusBadge } from './status-badge';
import type { ReportStatus } from './report-status';

export type ReportListCardAction = {
  label: string;
  onPress: () => void;
  variant?: 'solid' | 'muted';
  accessibilityLabel?: string;
  disabled?: boolean;
  tone?: 'primary' | 'teacher';
};

export type ReportListCardProps = {
  title: string;
  description: string;
  location: string;
  badgeLabel?: string;
  status: ReportStatus;
  imageUrl: string | null;
  reporterName: string;
  reporterClass: string | null;
  date: string;
  votes: number;
  comments: number;
  action?: ReportListCardAction;
  onPress?: () => void;
  canEdit?: boolean;
  onEditPress?: () => void;
};

export function ReportListCard({
  title,
  description,
  location,
  badgeLabel,
  status,
  imageUrl,
  reporterName,
  reporterClass,
  date,
  votes,
  comments,
  action,
  onPress,
  canEdit = false,
  onEditPress,
}: ReportListCardProps): React.JSX.Element {
  const isMuted = action?.variant === 'muted';
  const actionColor =
    action?.tone === 'teacher' ? palette.teacherPrimary : palette.primary;
  const reporter = reporterClass
    ? `${reporterName} · Kelas ${reporterClass}`
    : reporterName;

  return (
    <View className="overflow-hidden rounded-lg bg-white">
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        accessibilityRole="button"
        accessibilityLabel={`${title}, ${location}`}
        className="gap-4 p-4 active:opacity-80"
      >
        <View className="flex-row gap-3">
          <ReportThumbnail uri={imageUrl} className="h-24 w-24 rounded-md" />
          <View className="flex-1 gap-1.5">
            <View className="flex-row items-start gap-2">
              <Text
                numberOfLines={1}
                className="flex-1 text-base font-bold text-gray-900"
              >
                {title}
              </Text>
              <View className="rounded-md bg-[#DBEAFE] px-2 py-0.5">
                <Text className="text-xs font-semibold text-navy">
                  {badgeLabel ?? location}
                </Text>
              </View>
            </View>
            <Text numberOfLines={2} className="text-sm text-gray-700">
              {description}
            </Text>
            <StatusBadge status={status} />
          </View>
        </View>

        <View className="gap-1">
          <View className="flex-row justify-between">
            <Text className="text-xs text-gray-400">Dilaporkan oleh:</Text>
            <Text className="text-xs text-gray-400">{date}</Text>
          </View>
          <Text numberOfLines={1} className="text-sm text-gray-900">
            {reporter}
          </Text>
        </View>
      </Pressable>

      <View className="flex-row items-center justify-between border-t border-gray-100 px-4 py-3">
        <Text className="text-sm text-gray-500">
          <Text className="font-bold text-gray-900">{votes}</Text> Votes{'   '}
          <Text className="font-bold text-gray-900">{comments}</Text> Komentar
        </Text>
        {canEdit && onEditPress ? (
          <Pressable
            onPress={onEditPress}
            accessibilityRole="button"
            accessibilityLabel={`Edit laporan ${title}`}
            className="min-h-[44px] justify-center rounded-lg border border-primary bg-white px-4 active:opacity-70"
          >
            <Text className="font-semibold text-primary">Edit Laporan</Text>
          </Pressable>
        ) : action ? (
          <Pressable
            onPress={action.onPress}
            accessibilityRole="button"
            accessibilityLabel={action.accessibilityLabel ?? action.label}
            accessibilityState={{ disabled: action.disabled }}
            disabled={action.disabled}
            style={
              isMuted
                ? action?.tone === 'teacher'
                  ? { borderColor: actionColor }
                  : undefined
                : { backgroundColor: actionColor }
            }
            className={`min-h-[44px] justify-center rounded-lg px-6 active:opacity-70 ${action.variant === 'muted'
              ? 'border border-primary bg-white'
              : 'bg-primary'
              }`}
          >
            <Text
              className={`font-semibold ${action.variant === 'muted' ? 'text-primary' : 'text-white'
                }`}
              style={
                isMuted && action.tone === 'teacher'
                  ? { color: actionColor }
                  : undefined
              }
            >
              {action.label}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
