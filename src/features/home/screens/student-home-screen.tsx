import React, { useCallback, useEffect, useState } from 'react';
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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { FeedReport } from '@/services/report';
import { PopularReportCard, ReportListCard } from '@/shared/components/report';
import {
  ChipTabs,
  RecommendationSheet,
  SearchBar,
  SectionHeader,
} from '@/shared/components/ui';
import { palette } from '@/shared/theme';
import { HomeHeader } from '../components/home-header';
import { ReportFilterSheet } from '../components/report-filter-sheet';
import { useCurrentUser } from '../hooks/use-current-user';
import { useHomeFeed } from '../hooks/use-home-feed';
import { toDisplayDate } from '../utils/feed';
import { useReportNote } from '@/features/report/hooks/use-report-note';
import { ReportNoteSheet } from '@/features/report/components/report-note-sheet';

const LIST_CONTENT = { paddingBottom: 24 } as const;
const POPULAR_CONTENT = { gap: 12, paddingHorizontal: 20 } as const;

function ItemSeparator(): React.JSX.Element {
  return <View className="h-3" />;
}

type HomeRole = 'siswa' | 'guru';

function ReportHomeScreen({ role }: { role: HomeRole }): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const user = useCurrentUser();
  const feed = useHomeFeed();
  const {
    saveNote,
    removeNote,
    isSaving,
    isDeleting,
    error: noteError,
  } = useReportNote({
    onSuccess: async () => {
      await feed.refresh();
    },
  });
  const { vote, recommend } = feed;
  const isTeacher = role === 'guru';

  const [now, setNow] = useState(() => Date.now());
  const [filterOpen, setFilterOpen] = useState(false);
  const [recommendationReportId, setRecommendationReportId] = useState<
    string | null
  >(null);
  const [recommendationSubmitting, setRecommendationSubmitting] =
    useState(false);

  const [noteSheetVisible, setNoteSheetVisible] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [selectedNoteMode, setSelectedNoteMode] = useState<'create' | 'edit'>(
    'create',
  );
  const [selectedInitialNote, setSelectedInitialNote] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useFocusEffect(
    useCallback(() => {
      feed.refresh();
    }, [feed.refresh]),
  );

  const openEdit = useCallback(
    (reportId: string) => navigation.navigate('EditReport', { reportId }),
    [navigation],
  );

  const openDetail = useCallback(
    (reportId: string) => navigation.navigate('ReportDetail', { reportId }),
    [navigation],
  );

  const handleVote = useCallback(
    async (id: string) => {
      const message = await vote(id);
      if (message) {
        Alert.alert('Gagal menyimpan vote', message);
      }
    },
    [vote],
  );

  const handleRecommendation = useCallback(
    async (id: string, recommendedByMe: boolean) => {
      if (!recommendedByMe) {
        setRecommendationReportId(id);
        return;
      }
      const message = await recommend(id);
      if (message) Alert.alert('Gagal menyimpan rekomendasi', message);
    },
    [recommend],
  );

  const handleRecommendationSubmit = useCallback(
    async (reason: string) => {
      if (!recommendationReportId || recommendationSubmitting) {
        return;
      }
      setRecommendationSubmitting(true);
      try {
        const message = await recommend(recommendationReportId, reason);
        if (message) {
          Alert.alert('Gagal menyimpan rekomendasi', message);
          return;
        }
        setRecommendationReportId(null);
      } finally {
        setRecommendationSubmitting(false);
      }
    },
    [recommend, recommendationReportId, recommendationSubmitting],
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
        onPress={() => openDetail(item.id)}
      />
    ),
    [openDetail],
  );

  const renderReport: ListRenderItem<FeedReport> = useCallback(
    ({ item }) => {
      const isOwner = item.reporter_id === user?.id;
      const editDeadline = new Date(item.createdAt).getTime() + 15 * 60 * 1000;

      const canStillEdit = now < editDeadline;

      const remainingMs = Math.max(0, editDeadline - now);
      const remainingSeconds = Math.floor(remainingMs / 1000);

      const remainingTime = [
        Math.floor(remainingSeconds / 3600),
        Math.floor((remainingSeconds % 3600) / 60),
        remainingSeconds % 60,
      ]
        .map(value => String(value).padStart(2, '0'))
        .join(':');

      const finalTime = new Date(editDeadline).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      return (
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
            onPress={() => openDetail(item.id)}
            canEdit={isOwner && canStillEdit}
            onEditPress={() => openEdit(item.id)}
            canAddNote={isOwner && !canStillEdit}
            note={item.note}
            onAddNotePress={() => {
              setSelectedReportId(item.id);
              setSelectedNoteMode('create');
              setSelectedInitialNote('');
              setNoteSheetVisible(true);
            }}
            onEditNotePress={() => {
              setSelectedReportId(item.id);
              setSelectedNoteMode('edit');
              setSelectedInitialNote(item.note?.text ?? '');
              setNoteSheetVisible(true);
            }}
            onDeleteNotePress={() => {
              Alert.alert(
                'Hapus Catatan',
                'Apakah kamu yakin ingin menghapus catatan ini?',
                [
                  { text: 'Batal', style: 'cancel' },
                  {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: () => {
                      removeNote(item.id).catch(() => {});
                    },
                  },
                ],
              );
            }}
            canStillEdit={canStillEdit}
            remainingTime={remainingTime}
            finalTime={finalTime}
            action={
              isOwner
                ? undefined
                : isTeacher
                ? {
                    label: item.recommendedByMe
                      ? 'Direkomendasikan'
                      : 'Rekomendasi',
                    variant: item.recommendedByMe ? 'muted' : 'solid',
                    tone: 'teacher',
                    accessibilityLabel: item.recommendedByMe
                      ? `Batalkan rekomendasi untuk ${item.title}`
                      : `Rekomendasikan ${item.title}`,
                    onPress: () => {
                      handleRecommendation(item.id, item.recommendedByMe).catch(
                        () => {},
                      );
                    },
                  }
                : {
                    label: item.votedByMe ? 'Voted' : 'Vote',
                    variant: item.votedByMe ? 'muted' : 'solid',
                    accessibilityLabel: item.votedByMe
                      ? `Batalkan vote untuk ${item.title}`
                      : `Vote ${item.title}`,
                    onPress: () => {
                      handleVote(item.id).catch(() => {});
                    },
                  }
            }
          />
        </View>
      );
    },
    [
      handleVote,
      handleRecommendation,
      isTeacher,
      openDetail,
      openEdit,
      user?.id,
      now,
    ],
  );

  const header = (
    <View className="gap-6 pb-4">
      <View
        className="gap-5 px-5 pb-6"
        style={{
          backgroundColor: isTeacher ? palette.teacherPrimary : palette.primary,
          paddingTop: insets.top + 24,
        }}
      >
        <HomeHeader
          name={`${isTeacher ? 'Guru ' : ''}${user?.displayName ?? ''}`}
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
          tone={isTeacher ? 'teacher' : 'primary'}
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
        <SectionHeader
          title={isTeacher ? 'Semua Laporan Sekolah' : 'Semua Laporan'}
        />
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
              <ActivityIndicator color={palette.primary} />
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
      <RecommendationSheet
        visible={recommendationReportId !== null}
        loading={recommendationSubmitting}
        onSubmit={reason => {
          handleRecommendationSubmit(reason).catch(() => {});
        }}
        onCancel={() => setRecommendationReportId(null)}
      />
      <ReportNoteSheet
        visible={noteSheetVisible}
        mode={selectedNoteMode}
        initialNote={selectedInitialNote}
        onClose={() => setNoteSheetVisible(false)}
        onSave={async noteText => {
          if (!selectedReportId) return;

          await saveNote(selectedReportId, noteText, selectedNoteMode);

          setNoteSheetVisible(false);
        }}
        buttonColor={isTeacher ? palette.teacherPrimary : palette.primary}
      />
    </View>
  );
}

export function StudentHomeScreen(): React.JSX.Element {
  return <ReportHomeScreen role="siswa" />;
}

export function TeacherHomeScreen(): React.JSX.Element {
  return <ReportHomeScreen role="guru" />;
}
