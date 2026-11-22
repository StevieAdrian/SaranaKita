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
import type { FeedReport } from '@/services/report';
import { MonitoringReportCard } from '@/shared/components/report';
import { useRole } from '@/shared/context/theme-context';
import { useAdminReportList } from '../hooks/use-admin-report-list';
import { toDisplayDate } from '../utils/feed';

export function ActionRequiredReportsScreen(): React.JSX.Element {
  const { theme } = useRole();
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const reportList = useAdminReportList('action_required');

  const renderItem: ListRenderItem<FeedReport> = useCallback(
    ({ item }) => (
      <MonitoringReportCard
        title={item.title}
        location={item.location}
        status={item.status}
        imageUrl={item.imageUrl}
        reporterName={item.reporterName}
        date={toDisplayDate(item.createdAt)}
        votes={item.votes}
        comments={item.comments}
        detailLabel="Perbarui Status"
        detailTone="dark"
        onPress={() =>
          navigation.navigate('ManagementReportDetail', {
            reportId: item.id,
          })
        }
      />
    ),
    [navigation],
  );

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <View
        className="justify-end px-5 pb-5"
        style={{
          backgroundColor: theme.primary,
          paddingTop: insets.top + 20,
        }}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Kembali"
          hitSlop={12}
          className="absolute bottom-4 left-5 h-11 w-11 items-center justify-center active:opacity-70"
        >
          <Text className="text-4xl font-light leading-[38px] text-white">‹</Text>
        </Pressable>
        <View className="ml-12 gap-1">
          <Text className="text-2xl font-bold text-white">Perlu Tindakan</Text>
          <Text className="text-sm text-white/75">
            Laporan yang masih dalam proses
          </Text>
        </View>
      </View>

      <FlatList
        data={reportList.reports}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: insets.bottom + 28,
          gap: 12,
          flexGrow: reportList.reports.length === 0 ? 1 : undefined,
        }}
        refreshControl={
          <RefreshControl
            refreshing={reportList.loading}
            onRefresh={reportList.refresh}
            tintColor={theme.primary}
          />
        }
        ListHeaderComponent={
          reportList.error ? (
            <View className="mb-3 rounded-lg bg-red-100 px-4 py-3">
              <Text className="text-sm text-red-800">{reportList.error}</Text>
            </View>
          ) : undefined
        }
        ListEmptyComponent={
          reportList.loading ? (
            <View className="flex-1 items-center justify-center py-12">
              <ActivityIndicator color={theme.primary} />
            </View>
          ) : (
            <View className="flex-1 items-center justify-center px-8 py-12">
              <Text
                className="text-center text-sm"
                style={{ color: theme.textSecondary }}
              >
                Semua laporan sudah selesai.
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          reportList.hasMore ? (
            <Pressable
              onPress={reportList.loadMore}
              disabled={reportList.loadingMore}
              accessibilityRole="button"
              className="mt-1 min-h-[44px] items-center justify-center rounded-lg active:opacity-70"
              style={{ backgroundColor: theme.surface }}
            >
              {reportList.loadingMore ? (
                <ActivityIndicator color={theme.primary} />
              ) : (
                <Text className="text-sm font-semibold" style={{ color: theme.primary }}>
                  Muat Laporan Lainnya
                </Text>
              )}
            </Pressable>
          ) : undefined
        }
      />
    </View>
  );
}
