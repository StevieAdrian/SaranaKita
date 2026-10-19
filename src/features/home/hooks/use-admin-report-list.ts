import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toUserMessage } from '@/services/api';
import {
  listReports,
  REPORT_STATUS,
  type FeedReport,
  type ReportStatus,
} from '@/services/report';

export type AdminReportFilter = ReportStatus | 'all' | 'action_required';

const PAGE_SIZE = 20;
const ACTION_REQUIRED_STATUSES: readonly ReportStatus[] = [
  REPORT_STATUS.WAITING_VERIFICATION,
  REPORT_STATUS.IN_REVIEW,
  REPORT_STATUS.IN_REPAIR,
];

function getStatuses(
  filter: AdminReportFilter,
): readonly ReportStatus[] | undefined {
  if (filter === 'all') return undefined;
  if (filter === 'action_required') return ACTION_REQUIRED_STATUSES;
  return [filter];
}

export type UseAdminReportList = {
  readonly reports: readonly FeedReport[];
  readonly loading: boolean;
  readonly loadingMore: boolean;
  readonly error: string | null;
  readonly hasMore: boolean;
  readonly refresh: () => void;
  readonly loadMore: () => void;
};

export function useAdminReportList(
  filter: AdminReportFilter,
): UseAdminReportList {
  const [reports, setReports] = useState<readonly FeedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const requestId = useRef(0);
  const statuses = useMemo(() => getStatuses(filter), [filter]);

  const loadFirstPage = useCallback(async () => {
    const activeRequest = ++requestId.current;
    setLoading(true);
    setLoadingMore(false);
    setReports([]);
    setPage(1);
    setError(null);
    try {
      const result = await listReports({
        page: 1,
        limit: PAGE_SIZE,
        sort: 'latest',
        status: statuses,
      });
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
  }, [statuses]);

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
    listReports({
      page: nextPage,
      limit: PAGE_SIZE,
      sort: 'latest',
      status: statuses,
    })
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
  }, [loading, loadingMore, page, statuses, totalPages]);

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
