import { useCallback, useEffect, useState } from 'react';
import { toUserMessage } from '@/services/api';
import { listReports, type FeedReport } from '@/services/report';

type UseHistoryReportsResult = {
  reports: readonly FeedReport[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refresh: () => void;
};

export function useHistoryReports(): UseHistoryReportsResult {
  const [reports, setReports] = useState<readonly FeedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReports = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const result = await listReports({
        page: 1,
        limit: 50,
        status: ['done'],
      });

      console.log('[HISTORY] API result:', JSON.stringify(result, null, 2));

      setReports(result.items.filter(report => report.status === 'done'));
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadReports();
  }, [loadReports]);

  const refresh = useCallback(() => {
    void loadReports(true);
  }, [loadReports]);

  return { reports, loading, refreshing, error, refresh };
}
