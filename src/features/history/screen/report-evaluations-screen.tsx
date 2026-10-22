import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { getReportEvaluasi } from '@/services/report/feed.api';
import type { ReportEvaluasi } from '@/services/report/feed.api';

type ReportEvaluationsScreenProps = {
  route: {
    params: {
      reportId: string;
      reportTitle: string;
    };
  };
};

export function ReportEvaluationsScreen({
  route,
}: ReportEvaluationsScreenProps): React.JSX.Element {
  const { reportId, reportTitle } = route.params;

  const [evaluations, setEvaluations] = useState<ReportEvaluasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadEvaluations() {
      setLoading(true);
      setError(null);

      try {
        const result = await getReportEvaluasi(reportId);
        if (active) {
          setEvaluations(result);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'Gagal memuat evaluasi laporan.',
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadEvaluations();

    return () => {
      active = false;
    };
  }, [reportId]);

  return (
    <View className="flex-1 bg-[#EAF2FF] px-5 pt-5">
      <Text className="text-xl font-bold text-gray-900">Semua Evaluasi</Text>

      <Text className="mb-5 mt-1 text-sm text-gray-500">{reportTitle}</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : error ? (
        <Text className="text-sm text-red-600">{error}</Text>
      ) : evaluations.length === 0 ? (
        <Text className="text-sm text-gray-500">
          Belum ada evaluasi untuk laporan ini.
        </Text>
      ) : (
        <FlatList
          data={evaluations}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 24, gap: 12 }}
          renderItem={({ item }) => (
            <View className="rounded-xl bg-white p-4">
              <Text className="font-semibold text-gray-900">
                Rating: {item.rate ?? '-'} / 5
              </Text>

              <Text className="mt-2 text-sm text-gray-700">
                {item.notes || 'Tidak ada catatan.'}
              </Text>

              <Text className="mt-3 text-xs text-gray-400">
                {new Date(item.created_at).toLocaleDateString('id-ID')}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
