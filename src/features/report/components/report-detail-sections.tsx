import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import checkIcon from '@/assets/images/check.png';
import type { ReportComment, ReportTimelineEvent } from '@/services/report';
import { palette } from '@/shared/theme';
import { useRole } from '@/shared/context/theme-context';
import { COMMENT_MAX_LENGTH } from '../constants';
import {
  formatShortDate,
  initialOf,
  timelineCopy,
} from '../utils/detail-format';

const WHITE_TINT = { tintColor: palette.white } as const;

export function DetailStats({
  votes,
  recommendations,
  comments,
}: {
  votes: number;
  recommendations: number;
  comments: number;
}): React.JSX.Element {
  const items = [
    { label: 'Votes', value: votes },
    { label: 'Rekomendasi', value: recommendations },
    { label: 'Komentar', value: comments },
  ];
  return (
    <View className="flex-row rounded-xl bg-primary py-4">
      {items.map((item, i) => (
        <View
          key={item.label}
          accessible
          accessibilityLabel={`${item.value} ${item.label}`}
          className={`flex-1 items-center ${i > 0 ? 'border-l border-white/40' : ''
            }`}
        >
          <Text className="text-2xl font-bold text-white">{item.value}</Text>
          <Text className="text-xs text-white/90">{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

function Avatar({
  name,
  uri,
  size,
}: {
  name: string;
  uri: string | null;
  size: number;
}) {
  const style = { width: size, height: size };
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={style}
        className="rounded-full bg-gray-200"
        accessibilityIgnoresInvertColors
      />
    );
  }
  return (
    <View
      className="items-center justify-center rounded-full"
      style={[style, { backgroundColor: palette.success }]}
    >
      <Text className="font-bold text-white">{initialOf(name)}</Text>
    </View>
  );
}

export function ReporterCard({
  name,
  roleLabel,
  avatarUrl,
  date,
}: {
  name: string;
  roleLabel: string;
  avatarUrl: string | null;
  date: string;
}): React.JSX.Element {
  const { theme } = useRole();
  return (
    <View style={{ borderColor: theme.borderSubtle }} className="flex-row items-center gap-3 rounded-xl border p-3">
      <Avatar name={name} uri={avatarUrl} size={44} />
      <View className="flex-1">
        <Text style={{ color: theme.textMuted }} className="text-xs">Dilaporkan oleh</Text>
        <Text numberOfLines={1} style={{ color: theme.textHeading }} className="text-base font-bold">
          {name}
        </Text>
        <Text style={{ color: theme.textSecondary }} className="text-xs">{roleLabel}</Text>
      </View>
      <Text style={{ color: theme.textMuted }} className="text-xs">{date}</Text>
    </View>
  );
}

export function ReportTimeline({
  events,
  color,
}: {
  events: readonly ReportTimelineEvent[];
  color: string;
}): React.JSX.Element {
  const { theme } = useRole();
  return (
    <View className="gap-3">
      {events.map(event => {
        const copy = timelineCopy(event.type);
        return (
          <View
            key={`${event.type}-${event.at}`}
            className="flex-row items-start gap-3"
          >
            <View
              className="mt-3 h-7 w-7 items-center justify-center rounded-full"
              style={{ backgroundColor: color }}
            >
              <Image
                source={checkIcon}
                resizeMode="contain"
                className="h-3.5 w-3.5"
                style={WHITE_TINT}
              />
            </View>
            <View style={{ borderColor: theme.borderSubtle, backgroundColor: theme.surface }} className="flex-1 rounded-lg border p-3">
              <View className="flex-row justify-between gap-2">
                <Text style={{ color: theme.textHeading }} className="flex-1 font-semibold">
                  {copy.title}
                </Text>
                <Text style={{ color: theme.textMuted }} className="text-xs">
                  {formatShortDate(event.at)}
                </Text>
              </View>
              <Text style={{ color: theme.textSecondary }} className="mt-1 text-sm">{copy.body}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

export type CommentSectionProps = {
  count: number;
  userName: string;
  comments: readonly ReportComment[];
  error: string | null;
  canComment: boolean;
  submitting: boolean;
  onSubmit: (text: string) => Promise<boolean>;
  onRetry: () => void;
};

export function CommentSection({
  count,
  userName,
  comments,
  error,
  canComment,
  submitting,
  onSubmit,
  onRetry,
}: CommentSectionProps): React.JSX.Element {
  const { theme } = useRole();
  const [text, setText] = useState('');
  const trimmedText = text.trim();
  const handleSubmit = async () => {
    if (!trimmedText || submitting) {
      return;
    }
    if (await onSubmit(trimmedText)) {
      setText('');
    }
  };

  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-3">
        <View className="h-px flex-1 bg-gray-200" />
        <Text className="text-xs text-gray-400">Diskusi</Text>
        <View className="h-px flex-1 bg-gray-200" />
      </View>
      <View className="flex-row items-center justify-between">
        <Text
          accessibilityRole="header"
          style={{ color: theme.textHeading }}
          className="text-lg font-bold"
        >
          Komentar
        </Text>
        <View
          className="rounded-full px-3 py-0.5"
          style={{ backgroundColor: palette.infoBackground }}
        >
          <Text className="text-xs font-semibold text-primary">{count}</Text>
        </View>
      </View>
      <View style={{ backgroundColor: theme.surfaceInput, borderColor: theme.borderInput }} className="gap-2 rounded-xl border p-3">
        <View className="flex-row items-start gap-3">
          <Avatar name={userName} uri={null} size={32} />
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Tambahkan komentar..."
            placeholderTextColor={theme.textPlaceholder}
            maxLength={COMMENT_MAX_LENGTH}
            multiline
            editable={canComment && !submitting}
            accessibilityLabel="Tulis komentar"
            style={{ color: theme.textInput }}
            className="min-h-[48px] flex-1 text-sm"
          />
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-gray-400">
            {text.length}/{COMMENT_MAX_LENGTH}
          </Text>
          <Pressable
            onPress={() => {
              handleSubmit().catch(() => { });
            }}
            disabled={!canComment || !trimmedText || submitting}
            accessibilityRole="button"
            accessibilityState={{
              disabled: !canComment || !trimmedText || submitting,
              busy: submitting,
            }}
            accessibilityLabel="Kirim komentar"
            className={`min-h-[36px] justify-center rounded-lg px-5 ${canComment && trimmedText && !submitting
              ? 'bg-primary'
              : 'bg-gray-300'
              }`}
          >
            {submitting ? (
              <ActivityIndicator size="small" color={palette.white} />
            ) : (
              <Text className="font-semibold text-white">Kirim</Text>
            )}
          </Pressable>
        </View>
      </View>
      {!canComment ? (
        <Text className="text-xs text-gray-500">
          Hanya siswa yang dapat menambahkan komentar.
        </Text>
      ) : null}
      {error ? (
        <View className="flex-row items-center justify-between gap-3">
          <Text style={{ color: palette.danger }} className="flex-1 text-sm">
            {error}
          </Text>
          <Pressable
            onPress={onRetry}
            accessibilityRole="button"
            className="min-h-[40px] justify-center px-2"
          >
            <Text className="font-semibold text-primary">Coba lagi</Text>
          </Pressable>
        </View>
      ) : null}
      {comments.map(comment => (
        <View key={comment.id} className="flex-row items-start gap-3 py-1">
          <Avatar name={comment.authorName} uri={comment.avatarUrl} size={32} />
          <View style={{ backgroundColor: theme.surfaceInput }} className="flex-1 gap-1 rounded-xl p-3">
            <View className="flex-row items-center justify-between gap-2">
              <Text style={{ color: theme.textHeading }} className="flex-1 text-sm font-semibold">
                {comment.authorName}
              </Text>
              <Text className="text-xs text-gray-400">
                {formatShortDate(comment.createdAt)}
              </Text>
            </View>
            <Text style={{ color: theme.textBody }} className="text-sm leading-5">
              {comment.commentText}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
