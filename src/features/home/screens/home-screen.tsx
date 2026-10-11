import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
  type ListRenderItem,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { FeedReport } from '@/services/report';
import { PopularReportCard, ReportListCard } from '@/shared/components/report';
import { ChipTabs, SearchBar, SectionHeader } from '@/shared/components/ui';
import { palette } from '@/shared/theme';
import { HomeHeader } from '../components/home-header';
import { ReportFilterSheet } from '../components/report-filter-sheet';
import { useCurrentUser } from '../hooks/use-current-user';
import { useHomeFeed } from '../hooks/use-home-feed';
import { toDisplayDate } from '../utils/feed';

const LIST_CONTENT = { paddingBottom: 24 } as const;
const POPULAR_CONTENT = { gap: 12, paddingHorizontal: 20 } as const;

function ItemSeparator(): React.JSX.Element {
  return <View className="h-3" />;
}

export function HomeScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const user = useCurrentUser();
  const feed = useHomeFeed();
  const { vote } = feed;
  const [filterOpen, setFilterOpen] = useState(false);

  const handleVote = useCallback(
    async (id: string) => {
      const message = await vote(id);
      if (message) {
        Alert.alert('Gagal menyimpan vote', message);
      }
    },
    [vote],
  );

  const renderPopular: ListRenderItem<FeedReport> = useCallback(
    ({ item }) => (
      <PopularReportCard
        title={item.title}
        location={item.location}
        date={toDisplayDate(item.createdAt)}
        status={item.status}
        votes={item.votes}
        imageUrl={item.imageUrl}
      />
    ),
    [],
  );

  const renderReport: ListRenderItem<FeedReport> = useCallback(
    ({ item }) => (
      <View className="px-5">
        <ReportListCard
          title={item.title}
          description={item.description}
          location={item.location}
          status={item.status}
          imageUrl={item.imageUrl}
          reporterName={item.reporterName}
          reporterClass={item.reporterClass}
          date={toDisplayDate(item.createdAt)}
          votes={item.votes}
          comments={item.comments}
          action={{
            label: item.votedByMe ? 'Voted' : 'Vote',
            variant: item.votedByMe ? 'muted' : 'solid',
            accessibilityLabel: item.votedByMe
              ? `Batalkan vote untuk ${item.title}`
              : `Vote ${item.title}`,
            onPress: () => {
              handleVote(item.id).catch(() => {});
            },
          }}
        />
      </View>
    ),
    [handleVote],
  );

  const header = (
    <View className="gap-6 pb-4">
      <View
        className="gap-5 bg-primary px-5 pb-6"
        style={{ paddingTop: insets.top + 24 }}
      >
        <HomeHeader
          name={user?.displayName ?? ''}
          schoolName={feed.schoolName}
        />
        <SearchBar
          value={feed.query}
          onChangeText={feed.setQuery}
          placeholder="Cari Laporan"
          onFilterPress={() => setFilterOpen(true)}
          filterActive={feed.filterActive}
        />
        <ChipTabs
          options={feed.categoryOptions}
          value={feed.categoryId}
          onChange={feed.setCategoryId}
          accessibilityLabel="Kategori laporan"
        />
      </View>

      {feed.popular.length > 0 ? (
        <View className="gap-3">
          <View className="px-5">
            <SectionHeader title="Populer" />
          </View>
          <FlatList
            horizontal
            data={feed.popular}
            keyExtractor={item => item.id}
            renderItem={renderPopular}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={POPULAR_CONTENT}
          />
        </View>
      ) : null}

      <View className="px-5">
        <SectionHeader title="Semua Laporan" />
      </View>
    </View>
  );

  const renderEmpty = () => {
    if (feed.loading) {
      return (
        <View className="items-center py-10">
          <ActivityIndicator color={palette.navy} />
        </View>
      );
    }
    if (feed.error) {
      return (
        <View className="items-center gap-3 px-5 py-10">
          <Text className="text-center text-sm text-gray-500">
            {feed.error}
          </Text>
          <Pressable
            onPress={feed.refresh}
            accessibilityRole="button"
            className="min-h-[44px] justify-center rounded-lg bg-navy px-5 active:opacity-70"
          >
            <Text className="font-semibold text-white">Coba lagi</Text>
          </Pressable>
        </View>
      );
    }
    return (
      <Text className="px-5 py-10 text-center text-sm text-gray-500">
        {feed.query || feed.categoryId !== 'all' || feed.filterActive
          ? 'Tidak ada laporan yang cocok.'
          : 'Belum ada laporan di sekolahmu.'}
      </Text>
    );
  };

  return (
    <View className="flex-1 bg-page">
      <FlatList
        data={feed.loading ? [] : feed.reports}
        keyExtractor={item => item.id}
        renderItem={renderReport}
        ListHeaderComponent={header}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={
          feed.loadingMore ? (
            <View className="items-center py-4">
              <ActivityIndicator color={palette.navy} />
            </View>
          ) : undefined
        }
        onEndReached={feed.loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={feed.refreshing}
            onRefresh={feed.refresh}
          />
        }
        contentContainerStyle={LIST_CONTENT}
        keyboardShouldPersistTaps="handled"
      />
      <ReportFilterSheet
        visible={filterOpen}
        value={feed.filters}
        onClose={() => setFilterOpen(false)}
        onApply={filters => {
          feed.setFilters(filters);
          setFilterOpen(false);
        }}
      />
    </View>
  );
}
