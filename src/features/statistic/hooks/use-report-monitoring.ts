import { useCallback, useEffect, useState } from 'react';

import type { MonitoringResponse } from '../types';
import { getReportMonitoring } from '@/services/report/feed.api';

export function useReportMonitoring() {
  const [data, setData] = useState<MonitoringResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMonitoring = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await getReportMonitoring();
      setData(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Gagal mengambil data monitoring laporan.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchMonitoring();
  }, [fetchMonitoring]);

  return {
    data,
    loading,
    error,
    refresh: fetchMonitoring,
  };
}
