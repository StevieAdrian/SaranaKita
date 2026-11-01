import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  type ListRenderItem,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { USER_ROLE, type UserRole } from '@/services/auth';
import type { FeedReport } from '@/services/report';
import type { RootStackParamList } from '@/navigation/types';
import { MonitoringReportCard } from '@/shared/components/report';
import { ChipTabs } from '@/shared/components/ui';
import { SectionHeader } from '@/shared/components/ui';
import { palette } from '@/shared/theme';
import { toDisplayDate } from '@/features/home/utils/feed';
import { useAllReports } from '@/features/statistic/hooks/use-all-reports';

type MonitoringFilter = 'all' | 'mine' | 'supported' | 'recommended';

type MonitoringReportsProps = {
  role: UserRole;
  currentUserId?: string;
  ListHeaderComponent?: React.ReactElement;
};

const LIST_CONTENT = { paddingBottom: 24 } as const;

const EDIT_WINDOW_MS = 15 * 60 * 1000;

function formatRemaining(ms: number): string {
  const totalSeconds = Math.floor(Math.max(0, ms) / 1000);
  return [
    Math.floor(totalSeconds / 3600),
    Math.floor((totalSeconds % 3600) / 60),
    totalSeconds % 60,
  ]
    .map(value => String(value).padStart(2, '0'))
    .join(':');
}

export function MonitoringReports({
  role,
  currentUserId,
  ListHeaderComponent,
}: MonitoringReportsProps): React.JSX.Element {
  const [filter, setFilter] = useState<MonitoringFilter>('all');
  const [now, setNow] = useState(() => Date.now());
  const { reports, loading, loadingMore, error, hasMore, refresh, loadMore } =
    useAllReports();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const options = useMemo(() => {
    const result: {
      label: string;
      value: MonitoringFilter;
    }[] = [
      { label: 'Semua', value: 'all' },
      { label: 'Laporan Saya', value: 'mine' },
    ];

    if (role === USER_ROLE.SISWA) {
      result.push({ label: 'Didukung', value: 'supported' });
    }

    if (role === USER_ROLE.GURU) {
      result.push({ label: 'Direkomendasi', value: 'recommended' });
    }

    return result;
  }, [role]);

  const filteredReports = useMemo(() => {
    switch (filter) {
      case 'mine':
        return reports.filter(report => report.reporter_id === currentUserId);
      case 'supported':
        return reports.filter(report => report.votedByMe);
      case 'recommended':
        return reports.filter(report => report.recommendedByMe);
      default:
        return reports;
    }
  }, [reports, filter, currentUserId]);

  const canManage =
    role === USER_ROLE.STAFF || role === USER_ROLE.ADMINISTRATOR;

  const renderItem: ListRenderItem<FeedReport> = useCallback(
    ({ item }) => {
      const isOwner = item.reporter_id === currentUserId;
      const editDeadline = new Date(item.createdAt).getTime() + EDIT_WINDOW_MS;
      const canStillEdit = isOwner && now < editDeadline;

      return (
        <View className="px-5">
          <MonitoringReportCard
            title={item.title}
            location={item.location}
            status={item.status}
            imageUrl={item.imageUrl}
            reporterName={item.reporterName}
            date={toDisplayDate(item.createdAt)}
            votes={item.votes}
            comments={item.comments}
            isOwner={isOwner}
            canStillEdit={canStillEdit}
            remainingTime={formatRemaining(editDeadline - now)}
            onEditPress={() =>
              navigation.navigate('EditReport', { reportId: item.id })
            }
            detailLabel={canManage ? 'Perbarui Status' : 'Lihat Detail'}
            detailTone={canManage ? 'dark' : 'primary'}
            onPress={() =>
              canManage
                ? navigation.navigate('ManagementReportDetail', {
                    reportId: item.id,
                  })
                : navigation.navigate('ReportDetail', { reportId: item.id })
            }
          />
        </View>
      );
    },
    [navigation, currentUserId, now, canManage],
  );

  const header = (
    <View className="gap-4">
      {ListHeaderComponent}
      <View className="gap-4 px-5 pt-2">
        <SectionHeader title="Daftar Monitoring Laporan" />
        <ChipTabs
          options={options}
          value={filter}
          onChange={setFilter}
          accessibilityLabel="Filter monitoring laporan"
        />
      </View>
    </View>
  );

  const renderEmpty = () => {
    if (loading) {
      return (
        <View className="py-8">
          <ActivityIndicator />
        </View>
      );
    }
    if (error) {
      return (
        <View className="items-center gap-2 px-5 py-5">
          <Text
            className="text-center text-sm"
            style={{ color: palette.danger }}
          >
            {error}
          </Text>
          <Text
            className="text-sm font-semibold"
            style={{ color: palette.primary }}
            onPress={refresh}
          >
            Coba lagi
          </Text>
        </View>
      );
    }
    return (
      <Text
        className="px-5 py-5 text-center text-sm"
        style={{ color: palette.gray500 }}
      >
        Tidak ada laporan untuk filter ini.
      </Text>
    );
  };

  return (
    <FlatList
      data={loading ? [] : filteredReports}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      ListHeaderComponent={header}
      ItemSeparatorComponent={ItemSeparator}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={
        loadingMore ? (
          <View className="items-center py-4">
            <ActivityIndicator color={palette.primary} />
          </View>
        ) : undefined
      }
      onEndReached={() => {
        // Infinite scroll hanya untuk tab "Semua"; tab lain difilter
        // client-side sehingga tidak perlu memuat halaman tambahan.
        if (filter === 'all' && hasMore) {
          loadMore();
        }
      }}
      onEndReachedThreshold={0.5}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={LIST_CONTENT}
    />
  );
}

function ItemSeparator(): React.JSX.Element {
  return <View className="h-3" />;
}
