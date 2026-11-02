import { useCallback, useEffect, useRef, useState } from 'react';

import { toUserMessage } from '@/services/api';
import { listReports, type FeedReport } from '@/services/report';

const PAGE_SIZE = 10;

export type UseAllReports = {
  readonly reports: readonly FeedReport[];
  readonly loading: boolean;
  readonly loadingMore: boolean;
  readonly error: string | null;
  readonly hasMore: boolean;
  readonly refresh: () => void;
  readonly loadMore: () => void;
};

export function useAllReports(): UseAllReports {
  const [reports, setReports] = useState<readonly FeedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const requestId = useRef(0);

  const loadFirstPage = useCallback(async () => {
    const activeRequest = ++requestId.current;
    setLoading(true);
    setLoadingMore(false);
    setError(null);
    try {
      const result = await listReports({ page: 1, limit: PAGE_SIZE });
      if (activeRequest !== requestId.current) return;
      
      setReports(result.items);
      setPage(result.page);
      setTotalPages(result.totalPages);
    } catch (err) {
      if (activeRequest === requestId.current) {
        setError(toUserMessage(err));
        setReports([]);
        setPage(1);
        setTotalPages(0);
      }
    } finally {
      if (activeRequest === requestId.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFirstPage().catch(() => {});
    return () => {
      requestId.current += 1;
    };
  }, [loadFirstPage]);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || page >= totalPages) return;
    const nextPage = page + 1;
    const activeRequest = requestId.current;

    setLoadingMore(true);
    setError(null);

    listReports({ page: nextPage, limit: PAGE_SIZE })
      .then(result => {
        if (activeRequest !== requestId.current) return;

        setReports(current => [...current, ...result.items]);
        setPage(result.page);
        setTotalPages(result.totalPages);
      })
      .catch(err => {
        if (activeRequest === requestId.current) setError(toUserMessage(err));
      })
      .finally(() => {
        if (activeRequest === requestId.current) setLoadingMore(false);
      });
  }, [loading, loadingMore, page, totalPages]);

  return {
    reports,
    loading,
    loadingMore,
    error,
    hasMore: page < totalPages,
    refresh: loadFirstPage,
    loadMore,
  };
}
