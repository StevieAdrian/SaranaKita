import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toUserMessage } from '@/services/api';
import { getCategories, type Category } from '@/services/category';
import {
  getPopularReports,
  listReports,
  recommendReport,
  removeRecommendation,
  unvoteReport,
  voteReport,
  type FeedReport,
} from '@/services/report';
import { getMySchool } from '@/services/school';
import type { ChipTabOption } from '@/shared/components/ui';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { ALL_CATEGORIES } from '../types';
import {
  applyRecommendationResult,
  applyVoteResult,
  mergePage,
  toggleRecommendation,
  toggleVote,
} from '../utils/feed';
import {
  DEFAULT_FILTERS,
  isDefaultFilters,
  type ReportFilters,
} from '../utils/filters';

const PAGE_SIZE = 20;
const POPULAR_SIZE = 5;

export type UseHomeFeed = {
  readonly schoolName: string | null;
  readonly categoryOptions: readonly ChipTabOption<string>[];
  readonly categoryId: string;
  readonly setCategoryId: (id: string) => void;
  readonly query: string;
  readonly setQuery: (query: string) => void;
  readonly filters: ReportFilters;
  readonly setFilters: (filters: ReportFilters) => void;
  readonly filterActive: boolean;
  readonly popular: readonly FeedReport[];
  readonly reports: readonly FeedReport[];
  readonly loading: boolean;
  readonly refreshing: boolean;
  readonly loadingMore: boolean;
  readonly error: string | null;
  readonly refresh: () => void;
  readonly loadMore: () => void;
  readonly vote: (id: string) => Promise<string | null>;
  readonly recommend: (id: string, reason?: string) => Promise<string | null>;
};

export function useHomeFeed(): UseHomeFeed {
  const [schoolName, setSchoolName] = useState<string | null>(null);
  const [categories, setCategories] = useState<readonly Category[]>([]);
  const [categoryId, setCategoryId] = useState<string>(ALL_CATEGORIES);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query);
  const [filters, setFilters] = useState<ReportFilters>(DEFAULT_FILTERS);

  const [reports, setReports] = useState<readonly FeedReport[]>([]);
  const [popular, setPopular] = useState<readonly FeedReport[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestId = useRef(0);
  const pendingVotes = useRef(new Set<string>());
  const pendingRecommendations = useRef(new Set<string>());

  useEffect(() => {
    getMySchool()
      .then(school => setSchoolName(school.name))
      .catch(() => setSchoolName(null));
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const filterCategory = categoryId === ALL_CATEGORIES ? undefined : categoryId;
  const search = debouncedQuery.trim() || undefined;
  const { statuses, sort } = filters;

  const listParams = useCallback(
    (nextPage: number) => ({
      page: nextPage,
      limit: PAGE_SIZE,
      search,
      categoryId: filterCategory,
      status: statuses,
      sort,
    }),
    [search, filterCategory, statuses, sort],
  );

  const load = useCallback(
    async (mode: 'initial' | 'refresh') => {
      const id = ++requestId.current;
      if (mode === 'refresh') {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const [list, top] = await Promise.all([
          listReports(listParams(1)),
          getPopularReports({
            limit: POPULAR_SIZE,
            categoryId: filterCategory,
          }),
        ]);
        if (id !== requestId.current) {
          return;
        }
        setReports(list.items);
        setPage(list.page);
        setTotalPages(list.totalPages);
        setPopular(top);
      } catch (err) {
        if (id === requestId.current) {
          setError(toUserMessage(err));
        }
      } finally {
        if (id === requestId.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [listParams, filterCategory],
  );

  useEffect(() => {
    load('initial').catch(() => {});
  }, [load]);

  const refresh = useCallback(() => {
    load('refresh').catch(() => {});
  }, [load]);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || page >= totalPages) {
      return;
    }
    const id = requestId.current;
    setLoadingMore(true);
    listReports(listParams(page + 1))
      .then(next => {
        if (id !== requestId.current) {
          return;
        }
        setReports(current => mergePage(current, next.items));
        setPage(next.page);
        setTotalPages(next.totalPages);
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  }, [loading, loadingMore, page, totalPages, listParams]);

  const vote = useCallback(
    async (id: string): Promise<string | null> => {
      const target =
        reports.find(r => r.id === id) ?? popular.find(r => r.id === id);
      if (!target || pendingVotes.current.has(id)) {
        return null;
      }
      pendingVotes.current.add(id);
      setReports(current => toggleVote(current, id));
      setPopular(current => toggleVote(current, id));

      try {
        const result = target.votedByMe
          ? await unvoteReport(id)
          : await voteReport(id);
        setReports(current => applyVoteResult(current, result));
        setPopular(current => applyVoteResult(current, result));
        return null;
      } catch (err) {
        setReports(current => toggleVote(current, id));
        setPopular(current => toggleVote(current, id));
        return toUserMessage(err);
      } finally {
        pendingVotes.current.delete(id);
      }
    },
    [reports, popular],
  );

  const recommend = useCallback(
    async (id: string, reason?: string): Promise<string | null> => {
      const target =
        reports.find(report => report.id === id) ??
        popular.find(report => report.id === id);
      if (!target) {
        return 'Laporan tidak ditemukan. Muat ulang daftar lalu coba lagi.';
      }
      if (pendingRecommendations.current.has(id)) {
        return 'Rekomendasi sedang diproses. Coba lagi sebentar.';
      }
      const normalizedReason = reason?.trim() ?? '';
      if (!target.recommendedByMe) {
        if (normalizedReason.length < 10) {
          return 'Alasan rekomendasi minimal 10 karakter.';
        }
        if (normalizedReason.length > 300) {
          return 'Alasan rekomendasi maksimal 300 karakter.';
        }
      }
      pendingRecommendations.current.add(id);
      setReports(current => toggleRecommendation(current, id));
      setPopular(current => toggleRecommendation(current, id));

      try {
        const result = target.recommendedByMe
          ? await removeRecommendation(id)
          : await recommendReport(id, normalizedReason);
        setReports(current => applyRecommendationResult(current, result));
        setPopular(current => applyRecommendationResult(current, result));
        return null;
      } catch (err) {
        setReports(current => toggleRecommendation(current, id));
        setPopular(current => toggleRecommendation(current, id));
        return toUserMessage(err);
      } finally {
        pendingRecommendations.current.delete(id);
      }
    },
    [reports, popular],
  );

  const categoryOptions = useMemo(
    () => [
      { value: ALL_CATEGORIES, label: 'Semua' },
      ...categories.map(category => ({
        value: category.id,
        label: category.name,
      })),
    ],
    [categories],
  );

  return {
    schoolName,
    categoryOptions,
    categoryId,
    setCategoryId,
    query,
    setQuery,
    filters,
    setFilters,
    filterActive: !isDefaultFilters(filters),
    popular,
    reports,
    loading,
    refreshing,
    loadingMore,
    error,
    refresh,
    loadMore,
    vote,
    recommend,
  };
}
