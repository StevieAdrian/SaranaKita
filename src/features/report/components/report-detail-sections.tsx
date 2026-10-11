import React, { useState } from 'react';
import { Image, Text, TextInput, View } from 'react-native';
import checkIcon from '@/assets/images/check.png';
import type { ReportTimelineEvent } from '@/services/report';
import { palette } from '@/shared/theme';

const WHITE_TINT = { tintColor: '#FFFFFF' } as const;
import {
  formatShortDate,
  initialOf,
  timelineCopy,
} from '../utils/detail-format';

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
          className={`flex-1 items-center ${
            i > 0 ? 'border-l border-white/40' : ''
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
      style={style}
      className="items-center justify-center rounded-full bg-green-600"
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
  return (
    <View className="flex-row items-center gap-3 rounded-xl border border-gray-200 p-3">
      <Avatar name={name} uri={avatarUrl} size={44} />
      <View className="flex-1">
        <Text className="text-xs text-gray-400">Dilaporkan oleh</Text>
        <Text numberOfLines={1} className="text-base font-bold text-gray-900">
          {name}
        </Text>
        <Text className="text-xs text-gray-500">{roleLabel}</Text>
      </View>
      <Text className="text-xs text-gray-400">{date}</Text>
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
            <View className="flex-1 rounded-lg border border-gray-200 p-3">
              <View className="flex-row justify-between gap-2">
                <Text className="flex-1 font-semibold text-gray-900">
                  {copy.title}
                </Text>
                <Text className="text-xs text-gray-400">
                  {formatShortDate(event.at)}
                </Text>
              </View>
              <Text className="mt-1 text-sm text-gray-500">{copy.body}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const COMMENT_MAX = 300;

export function CommentSection({
  count,
  userName,
}: {
  count: number;
  userName: string;
}): React.JSX.Element {
  const [text, setText] = useState('');

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
          className="text-lg font-bold text-gray-900"
        >
          Komentar
        </Text>
        <View className="rounded-full bg-[#DBEAFE] px-3 py-0.5">
          <Text className="text-xs font-semibold text-primary">{count}</Text>
        </View>
      </View>
      <View className="gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3">
        <View className="flex-row items-start gap-3">
          <Avatar name={userName} uri={null} size={32} />
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Tambahkan komentar..."
            placeholderTextColor={palette.gray500}
            maxLength={COMMENT_MAX}
            multiline
            accessibilityLabel="Tulis komentar"
            className="min-h-[48px] flex-1 text-sm text-gray-900"
          />
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-gray-400">
            {text.length}/{COMMENT_MAX}
          </Text>
          <View
            accessible
            accessibilityRole="button"
            accessibilityState={{ disabled: true }}
            accessibilityLabel="Kirim komentar, belum tersedia"
            className="min-h-[36px] justify-center rounded-lg bg-gray-300 px-5"
          >
            <Text className="font-semibold text-white">Kirim</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
