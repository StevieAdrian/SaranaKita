import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { palette } from '@/shared/theme';
import { ReportThumbnail } from './report-thumbnail';
import { StatusBadge } from './status-badge';
import type { ReportStatus } from './report-status';
import addVotesIcon from '../../../../assets/images/add-vote.png';

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
      <View className="border-t border-gray-100 px-4 py-3">
        <View className="flex-row items-center justify-between gap-2">
          <Text className="flex-1 text-xs text-gray-400">
            {canStillEdit
              ? 'Waktu Tersisa Untuk Mengubah Laporan:'
              : 'Waktu Laporan Final'}
          </Text>

          <Text className="text-xs text-gray-400">
            {canStillEdit ? remainingTime : finalTime}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between border-t border-gray-100 px-4 py-3">
        <Text className="text-sm text-gray-500">
          <Text className="font-bold text-gray-900">{votes}</Text> Votes
          {'   '}
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
        ) : canAddNote ? (
          <View className="flex-row items-center gap-2">
            {note ? (
              <>
                <Pressable
                  onPress={onEditNotePress}
                  accessibilityRole="button"
                  accessibilityLabel={`Ubah catatan ${title}`}
                  className="min-h-[44px] justify-center rounded-lg border border-primary bg-white px-3 active:opacity-70"
                >
                  <Text className="font-semibold text-primary">
                    Ubah Catatan
                  </Text>
                </Pressable>
                <Pressable
                  onPress={onDeleteNotePress}
                  accessibilityRole="button"
                  accessibilityLabel={`Hapus catatan ${title}`}
                  className="min-h-[44px] justify-center rounded-lg bg-red-50 px-3 active:opacity-70"
                >
                  <Text className="font-semibold text-red-600">Hapus</Text>
                </Pressable>
              </>
            ) : (
              <Pressable
                onPress={onAddNotePress}
                accessibilityRole="button"
                accessibilityLabel={`Tambah catatan ${title}`}
                className="min-h-[44px] justify-center rounded-lg border border-primary bg-white px-4 active:opacity-70"
              >
                <Text className="font-semibold text-primary">+ Catatan</Text>
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
                ? action?.tone === 'teacher'
                  ? { borderColor: actionColor }
                  : undefined
                : { backgroundColor: actionColor }
            }
            className={`min-h-[44px] justify-center rounded-lg px-6 active:opacity-70 ${
              action.variant === 'muted'
                ? 'border border-primary bg-white'
                : 'bg-primary'
            }`}
          >
            <View className="justify-cente flex flex-row gap-2">
              {action.label === 'Vote' && (
                <Image
                  source={addVotesIcon}
                  accessibilityLabel="Add Vote"
                  style={{ width: 18, height: 18 }}
                  resizeMode="contain"
                />
              )}
              <Text
                className={`font-semibold ${
                  action.variant === 'muted' ? 'text-primary' : 'text-white'
                }`}
                style={
                  isMuted && action.tone === 'teacher'
                    ? { color: actionColor }
                    : undefined
                }
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
