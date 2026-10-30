import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { palette } from '@/shared/theme';
import { useRole } from '@/shared/context/theme-context';
import { ReportThumbnail } from './report-thumbnail';
import { StatusBadge } from './status-badge';
import type { ReportStatus } from './report-status';
import addVotesIcon from '../../../../assets/images/add-vote.png';
import { ReportProgress } from './report-progress';

export type ReportListCardAction = {
  label: string;
  onPress: () => void;
  variant?: 'solid' | 'muted';
  accessibilityLabel?: string;
  disabled?: boolean;
  tone?: 'primary' | 'teacher';
};

export type ReportNoteData = {
  id: string;
  text: string;
  createdAt: string;
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
  canAddNote?: boolean;
  note?: ReportNoteData | null;
  onAddNotePress?: () => void;
  onEditNotePress?: () => void;
  onDeleteNotePress?: () => void;
  canStillEdit?: boolean;
  finalTime?: string;
  remainingTime?: string;
  showFinalizedTime?: boolean;
  showProgress?: boolean;
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
  canAddNote = false,
  note = null,
  onAddNotePress,
  onEditNotePress,
  onDeleteNotePress,
  canStillEdit = false,
  finalTime,
  remainingTime = '00:00',
  showProgress = false,
}: ReportListCardProps): React.JSX.Element {
  const { theme, scheme } = useRole();
  const isDark = scheme === 'dark';
  const isMuted = action?.variant === 'muted';
  const actionColor =
    action?.tone === 'teacher' ? palette.teacherPrimary : theme.primary;
  const reporter = reporterClass
    ? `${reporterName} · Kelas ${reporterClass}`
    : reporterName;

  return (
    <View
      style={{ backgroundColor: theme.surface }}
      className="overflow-hidden rounded-lg py-2"
    >
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
                style={{ color: theme.textHeading }}
                className="flex-1 text-base font-bold"
              >
                {title}
              </Text>
              <View
                style={{
                  backgroundColor: isDark ? theme.primarySoft : '#DBEAFE',
                }}
                className="rounded-md px-2 py-0.5"
              >
                <Text
                  style={{ color: isDark ? theme.primary : palette.navy }}
                  className="text-xs font-semibold"
                >
                  {badgeLabel ?? location}
                </Text>
              </View>
            </View>
            <Text
              numberOfLines={2}
              style={{ color: theme.textSecondary }}
              className="text-sm"
            >
              {description}
            </Text>
            <StatusBadge status={status} />
          </View>
        </View>

        <View className="gap-1">
          <View className="flex-row justify-between">
            <Text style={{ color: theme.textMuted }} className="text-xs">Dilaporkan oleh:</Text>
            <Text style={{ color: theme.textMuted }} className="text-xs">{date}</Text>
          </View>
          <Text
            numberOfLines={1}
            style={{ color: theme.textHeading }}
            className="text-sm"
          >
            {reporter}
          </Text>
        </View>
      </Pressable>
      {showProgress && <ReportProgress status={status} />}

      <View
        style={{ borderTopColor: theme.borderSubtle }}
        className="mt-2 border-t px-4 py-3"
      >
        <View className="flex-row items-center justify-between gap-2">
          <Text style={{ color: theme.textMuted }} className="flex-1 text-xs">
            {canStillEdit
              ? 'Waktu Tersisa Untuk Mengubah Laporan:'
              : 'Waktu Laporan Final'}
          </Text>

          <Text style={{ color: theme.textMuted }} className="text-xs">
            {canStillEdit ? remainingTime : finalTime}
          </Text>
        </View>
      </View>

      <View
        style={{ borderTopColor: theme.borderSubtle }}
        className="flex-row items-center justify-between border-t px-4 py-3"
      >
        <Text style={{ color: theme.textSecondary }} className="text-sm">
          <Text style={{ color: theme.textHeading }} className="font-bold">{votes}</Text> Votes
          {'   '}
          <Text style={{ color: theme.textHeading }} className="font-bold">{comments}</Text> Komentar
        </Text>

        {canEdit && onEditPress ? (
          <Pressable
            onPress={onEditPress}
            accessibilityRole="button"
            accessibilityLabel={`Edit laporan ${title}`}
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.primary,
            }}
            className="min-h-[44px] justify-center rounded-lg border px-4 active:opacity-70"
          >
            <Text style={{ color: theme.primary }} className="font-semibold">Edit Laporan</Text>
          </Pressable>
        ) : canAddNote ? (
          <View className="flex-row items-center gap-2">
            {note ? (
              <>
                <Pressable
                  onPress={onEditNotePress}
                  accessibilityRole="button"
                  accessibilityLabel={`Ubah catatan ${title}`}
                  style={{
                    backgroundColor: theme.surface,
                    borderColor: theme.primary,
                  }}
                  className="min-h-[44px] justify-center rounded-lg border px-3 active:opacity-70"
                >
                  <Text style={{ color: theme.primary }} className="font-semibold">
                    Ubah Catatan
                  </Text>
                </Pressable>
                <Pressable
                  onPress={onDeleteNotePress}
                  accessibilityRole="button"
                  accessibilityLabel={`Hapus catatan ${title}`}
                  style={{ backgroundColor: theme.dangerSurface }}
                  className="min-h-[44px] justify-center rounded-lg px-3 active:opacity-70"
                >
                  <Text style={{ color: theme.danger }} className="font-semibold">Hapus</Text>
                </Pressable>
              </>
            ) : (
              <Pressable
                onPress={onAddNotePress}
                accessibilityRole="button"
                accessibilityLabel={`Tambah catatan ${title}`}
                style={{
                  backgroundColor: theme.surface,
                  borderColor: theme.primary,
                }}
                className="min-h-[44px] justify-center rounded-lg border px-4 active:opacity-70"
              >
                <Text style={{ color: theme.primary }} className="font-semibold">+ Catatan</Text>
              </Pressable>
            )}
          </View>
        ) : action ? (
          <Pressable
            onPress={action.onPress}
            accessibilityRole="button"
            accessibilityLabel={action.accessibilityLabel ?? action.label}
            accessibilityState={{ disabled: action.disabled }}
            disabled={action.disabled}
            style={
              isMuted
                ? {
                  backgroundColor: theme.surface,
                  borderColor: actionColor,
                  borderWidth: 1,
                }
                : { backgroundColor: actionColor }
            }
            className="min-h-[44px] justify-center rounded-lg px-6 active:opacity-70"
          >
            <View className="flex flex-row items-center justify-center gap-2">
              {action.label === 'Vote' && (
                <Image
                  source={addVotesIcon}
                  accessibilityLabel="Add Vote"
                  style={{ width: 18, height: 18, tintColor: isMuted ? actionColor : '#FFFFFF' }}
                  resizeMode="contain"
                />
              )}
              <Text
                style={{ color: isMuted ? actionColor : '#FFFFFF' }}
                className="font-semibold"
              >
                {action.label}
              </Text>
            </View>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
