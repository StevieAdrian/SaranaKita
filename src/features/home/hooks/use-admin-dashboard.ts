import { useCallback, useEffect, useState } from 'react';
import { toUserMessage } from '@/services/api';
import { getReportDashboard, type ReportDashboard } from '@/services/report';

export type UseAdminDashboard = {
  readonly dashboard: ReportDashboard | null;
  readonly loading: boolean;
  readonly refreshing: boolean;
  readonly error: string | null;
  readonly refresh: () => void;
};

export function useAdminDashboard(): UseAdminDashboard {
  const [dashboard, setDashboard] = useState<ReportDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (isRefresh: boolean) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      setDashboard(await getReportDashboard());
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load(false).catch(() => {});
  }, [load]);

  const refresh = useCallback(() => {
    load(true).catch(() => {});
  }, [load]);

  return { dashboard, loading, refreshing, error, refresh };
}
