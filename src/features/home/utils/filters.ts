import type { ReportSort, ReportStatus } from '@/services/report';
import { REPORT_STATUSES } from '@/services/report/status.constants';

export type ReportFilters = {
  readonly statuses: readonly ReportStatus[];
  readonly sort: ReportSort;
};

export const DEFAULT_FILTERS: ReportFilters = { statuses: [], sort: 'latest' };

export const STATUS_OPTIONS: readonly ReportStatus[] = REPORT_STATUSES;

export const SORT_OPTIONS: readonly { value: ReportSort; label: string }[] = [
  { value: 'latest', label: 'Terbaru' },
  { value: 'oldest', label: 'Terlama' },
  { value: 'most_votes', label: 'Votes Terbanyak' },
  { value: 'least_votes', label: 'Votes Tersedikit' },
  { value: 'most_recommendations', label: 'Rekomendasi Terbanyak' },
];

export function toggleStatus(
  statuses: readonly ReportStatus[],
  status: ReportStatus,
): ReportStatus[] {
  return statuses.includes(status)
    ? statuses.filter(item => item !== status)
    : STATUS_OPTIONS.filter(item => item === status || statuses.includes(item));
}

export function isDefaultFilters(filters: ReportFilters): boolean {
  return filters.statuses.length === 0 && filters.sort === DEFAULT_FILTERS.sort;
}
