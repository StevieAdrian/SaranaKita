import { useNavigation } from '@react-navigation/native';
import { useRole } from '@/shared/context/theme-context';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getReportEvaluasi } from '@/services/report/feed.api';
import type { ReportEvaluasi } from '@/services/report/feed.api';

type ReportEvaluationsScreenProps = {
  route: { params: { reportId: string; reportTitle: string } };
};

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Tanggal tidak tersedia';
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function RatingStars({ value, size = 'text-base' }: { value: number; size?: string }): React.JSX.Element {
  const rating = Math.max(0, Math.min(5, value));
  return (
    <View className="flex-row" accessibilityLabel={`${rating} dari 5 bintang`}>
      {[1, 2, 3, 4, 5].map(star => (
        <Text key={star} className={size} style={{ color: star <= rating ? '#F59E0B' : '#E2E8F0' }}>★</Text>
      ))}
    </View>
  );
}

export function ReportEvaluationsScreen({ route }: ReportEvaluationsScreenProps): React.JSX.Element {
  const { theme } = useRole();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { reportId } = route.params;
  const [evaluations, setEvaluations] = useState<ReportEvaluasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadedReportId, setLoadedReportId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadEvaluations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setEvaluations(await getReportEvaluasi(reportId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat evaluasi laporan.');
    } finally {
      setLoading(false);
      setLoadedReportId(reportId);
    }
  }, [reportId]);

  useEffect(() => {
    let active = true;
    async function loadInitialEvaluations() {
      setLoading(true);
      setLoadedReportId(null);
      setEvaluations([]);
      setError(null);
      try {
        const result = await getReportEvaluasi(reportId);
        if (active) setEvaluations(result);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Gagal memuat evaluasi laporan.');
      } finally {
        if (active) {
          setLoading(false);
          setLoadedReportId(reportId);
        }
      }
    }
    void loadInitialEvaluations();
    return () => { active = false; };
  }, [reportId]);

  const isLoading = loading || loadedReportId !== reportId;

  const renderEvaluation = ({ item, index }: { item: ReportEvaluasi; index: number }) => {
    const rating = item.rate ?? 0;
    return (
      <View
        className="rounded-2xl p-4"
        style={{
          backgroundColor: theme.surface,
          borderColor: theme.borderSubtle,
          borderWidth: 1,
          shadowColor: theme.shadowColor,
          shadowOpacity: 0.05,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 3 },
          elevation: 2,
        }}
      >
        <View className="flex-row items-start justify-between gap-4">
          <View className="flex-1">
            <Text style={{ color: theme.textMuted }} className="text-xs font-medium">EVALUASI {index + 1}</Text>
            <View className="mt-1 flex-row items-center gap-2">
              <Text style={{ color: theme.textHeading }} className="text-lg font-bold">
                {item.rate ?? '-'}<Text className="text-sm font-medium"> / 5</Text>
              </Text>
              <RatingStars value={rating} size="text-sm" />
            </View>
          </View>
          <View className="rounded-full px-3 py-1" style={{ backgroundColor: theme.primarySoft }}>
            <Text style={{ color: theme.primary }} className="text-xs font-semibold">Selesai</Text>
          </View>
        </View>
        <View className="my-4 h-px" style={{ backgroundColor: theme.borderSubtle }} />
        <Text style={{ color: theme.textBody }} className="text-sm leading-6">
          {item.notes?.trim() || 'Tidak ada catatan untuk evaluasi ini.'}
        </Text>
        <Text style={{ color: theme.textMuted }} className="mt-4 text-xs">
          Diberikan pada {formatDate(item.created_at)}
        </Text>
      </View>
    );
  };

  const listHeader = (
    <View className="mb-3 flex-row items-center justify-between">
      <Text style={{ color: theme.textHeading }} className="text-lg font-bold">Detail Evaluasi</Text>
      <Text style={{ color: theme.textSecondary }} className="text-sm">{evaluations.length} masuk</Text>
    </View>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <View className="px-5 pb-7" style={{ backgroundColor: theme.primary, paddingTop: insets.top + 12 }}>
        <View className="h-11 flex-row items-center">
          <Pressable
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Kembali"
            className="h-11 w-11 items-start justify-center active:opacity-70"
          >
            <Text style={{ color: theme.onPrimary }} className="text-4xl font-light leading-10">‹</Text>
          </Pressable>
          <Text accessibilityRole="header" numberOfLines={1} style={{ color: theme.onPrimary }} className="ml-1 flex-1 text-xl font-bold">
            Evaluasi Laporan
          </Text>
        </View>
      </View>

      {isLoading ? (
        <View
          accessibilityRole="progressbar"
          accessibilityLabel="Memuat evaluasi"
          className="flex-1 items-center justify-center gap-3 px-5"
        >
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={{ color: theme.textSecondary }} className="text-sm">Memuat evaluasi…</Text>
        </View>
      ) : error ? (
        <View className="mx-5 mt-5 items-center rounded-2xl px-5 py-8" style={{ backgroundColor: theme.surface }}>
          <Text style={{ color: theme.textHeading }} className="text-base font-semibold">Evaluasi belum bisa dimuat</Text>
          <Text style={{ color: theme.textSecondary }} className="mt-2 text-center text-sm">{error}</Text>
          <Pressable onPress={() => void loadEvaluations()} accessibilityRole="button" className="mt-5 min-h-11 items-center justify-center rounded-xl px-5" style={{ backgroundColor: theme.primary }}>
            <Text style={{ color: theme.onPrimary }} className="font-semibold">Coba lagi</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={evaluations}
          keyExtractor={item => item.id}
          renderItem={renderEvaluation}
          ListHeaderComponent={listHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingHorizontal: 20, paddingTop: 20, paddingBottom: insets.bottom + 24 }}
          ListEmptyComponent={
            <View className="items-center rounded-2xl px-5 py-8" style={{ backgroundColor: theme.surface }}>
              <Text style={{ color: theme.textHeading }} className="text-base font-semibold">Belum ada evaluasi</Text>
              <Text style={{ color: theme.textSecondary }} className="mt-2 text-center text-sm">Evaluasi untuk laporan ini akan muncul di sini.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
