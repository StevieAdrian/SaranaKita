import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
  type ListRenderItem,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList } from '@/navigation/types';
import type { AppNotification } from '@/services/notifications';
import { useNotifications } from '@/shared/context/notifications-context';
import { useRole } from '@/shared/context/theme-context';
import { useCurrentUser } from '@/features/home/hooks/use-current-user';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  });
}

function reportTitle(notification: AppNotification): string {
  const match = notification.body.match(/“(.+?)”/);
  return match?.[1] ?? notification.title;
}

function notificationLabel(notification: AppNotification): string {
  if (notification.type === 'report_created') return 'Laporan Dibuat';
  if (notification.type === 'report_commented') return 'Komentar Baru';
  if (notification.type === 'report_recommended') {
    return 'Laporan Direkomendasikan';
  }

  const status = notification.body.match(/sekarang (.+?)(?:\.|$)/)?.[1];
  return status ?? 'Status Laporan Diperbarui';
}

export function NotificationsScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const { theme } = useRole();
  const user = useCurrentUser();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { notifications, loading, refresh, markRead } = useNotifications();

  const openNotification = useCallback(
    async (notification: AppNotification) => {
      if (!notification.readAt) {
        await markRead(notification.id).catch(() => undefined);
      }
      const reportId = notification.data.reportId;
      if (!reportId) return;
      navigation.navigate(
        user?.role === 'staff' || user?.role === 'administrator'
          ? 'ManagementReportDetail'
          : 'ReportDetail',
        { reportId },
      );
    },
    [markRead, navigation, user?.role],
  );

  const renderItem: ListRenderItem<AppNotification> = useCallback(
    ({ item }) => (
      <Pressable
        onPress={() => {
          void openNotification(item);
        }}
        accessibilityRole="button"
        accessibilityLabel={`${
          item.readAt ? '' : 'Belum dibaca. '
        }${reportTitle(item)}`}
        className="min-h-[87px] flex-row items-start px-6 py-5 active:opacity-70"
        style={{ backgroundColor: theme.surface }}
      >
        <View
          className="mr-4 mt-2 h-3 w-3 rounded-full"
          style={{
            backgroundColor: item.readAt ? '#22C55E' : theme.primary,
          }}
        />
        <View className="flex-1 gap-1 pr-3">
          <Text
            numberOfLines={1}
            style={{ color: theme.textHeading }}
            className="text-base font-bold"
          >
            {reportTitle(item)}
          </Text>
          <Text style={{ color: theme.textSecondary }} className="text-base">
            {notificationLabel(item)}
          </Text>
        </View>
        <Text style={{ color: theme.textMuted }} className="pt-0.5 text-sm">
          {formatDate(item.createdAt)}
        </Text>
      </Pressable>
    ),
    [openNotification, theme],
  );

  return (
    <View className="flex-1" style={{ backgroundColor: '#EDF4FF' }}>
      <View
        className="items-center justify-end pb-9"
        style={{
          height: insets.top + 158,
          backgroundColor: theme.primary,
        }}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Kembali"
          hitSlop={12}
          className="absolute bottom-8 left-8 h-11 w-11 items-center justify-center active:opacity-70"
        >
          <Text className="text-5xl font-light leading-[44px] text-white">
            ‹
          </Text>
        </Pressable>
        <Text className="text-4xl font-bold tracking-tight text-white">
          Notifikasi
        </Text>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => (
          <View className="ml-10 h-px" style={{ backgroundColor: '#E7EDF6' }} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => void refresh()}
          />
        }
        contentContainerStyle={{
          marginHorizontal: 30,
          marginTop: 18,
          borderRadius: 8,
          overflow: 'hidden',
          backgroundColor: theme.surface,
          shadowColor: '#94A3B8',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.18,
          shadowRadius: 16,
          elevation: 5,
          flexGrow: notifications.length === 0 ? 1 : undefined,
        }}
        ListEmptyComponent={
          loading ? (
            <View className="flex-1 items-center justify-center py-12">
              <ActivityIndicator color={theme.primary} />
            </View>
          ) : (
            <View
              className="flex-1 items-center justify-center px-8 py-12"
              style={{ backgroundColor: theme.surface }}
            >
              <Text
                style={{ color: theme.textSecondary }}
                className="text-center text-sm"
              >
                Belum ada notifikasi.
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}
