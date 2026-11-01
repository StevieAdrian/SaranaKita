import { apiClient } from '@/services/api';
import type { ReportStatus } from './status.constants';
import { MonitoringResponse } from '@/features/statistic/types';

export type { ReportStatus } from './status.constants';

export type FeedReport = {
  readonly id: string;
  readonly reporter_id: string;
  readonly title: string;
  readonly description: string;
  readonly location: string;
  readonly categoryId: string | null;
  readonly status: ReportStatus;
  readonly imageUrl: string | null;
  readonly reporterName: string;
  readonly reporterClass: string | null;
  readonly createdAt: string;
  readonly votes: number;
  readonly comments: number;
  readonly recommendations: number;
  readonly votedByMe: boolean;
  readonly recommendedByMe: boolean;
  readonly note: {
    readonly id: string;
    readonly authorId: string;
    readonly text: string;
    readonly createdAt: string;
  } | null;
};

export type ReportSort =
  | 'latest'
  | 'oldest'
  | 'most_votes'
  | 'least_votes'
  | 'most_recommendations';

export type Paginated<T> = {
  readonly items: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
};

export type ListReportsParams = {
  readonly page?: number;
  readonly limit?: number;
  readonly search?: string;
  readonly categoryId?: string;
  readonly status?: readonly ReportStatus[];
  readonly sort?: ReportSort;
};

export type PopularReportsParams = {
  readonly limit?: number;
  readonly categoryId?: string;
};

export type VoteResult = {
  readonly reportId: string;
  readonly votes: number;
  readonly votedByMe: boolean;
};

export type RecommendationResult = {
  readonly reportId: string;
  readonly recommendations: number;
  readonly recommendedByMe: boolean;
};

export type ReportNote = {
  readonly id: string;
  readonly report_id: string;
  readonly author_id: string;
  readonly note_text: string;
  readonly created_at: string;
};

export type ReportEvaluasi = {
  readonly id: string;
  readonly report_id: string;
  readonly evaluator_id: string;
  readonly rate: number | null;
  readonly notes: string | null;
  readonly created_at: string;
};

export type CreateReportEvaluasiInput = {
  readonly rate: number;
  readonly notes?: string;
};

type QueryValue = string | number | readonly string[] | undefined;

export function toQuery(params: Record<string, QueryValue>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === '') {
      continue;
    }
    if (Array.isArray(value)) {
      if (value.length > 0) {
        search.append(key, value.join(','));
      }
      continue;
    }
    search.append(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : '';
}

export function listReports(
  params: ListReportsParams = {},
): Promise<Paginated<FeedReport>> {
  return apiClient.get<Paginated<FeedReport>>(`/reports${toQuery(params)}`);
}

export function getPopularReports(
  params: PopularReportsParams = {},
): Promise<FeedReport[]> {
  return apiClient.get<FeedReport[]>(`/reports/popular${toQuery(params)}`);
}

export function voteReport(id: string): Promise<VoteResult> {
  return apiClient.post<VoteResult>(`/reports/${encodeURIComponent(id)}/votes`);
}

export function unvoteReport(id: string): Promise<VoteResult> {
  return apiClient.delete<VoteResult>(
    `/reports/${encodeURIComponent(id)}/votes`,
  );
}

export function recommendReport(
  id: string,
  reason: string,
): Promise<RecommendationResult> {
  return apiClient.post<RecommendationResult>(
    `/reports/${encodeURIComponent(id)}/recommendations`,
    { reason },
  );
}

export function removeRecommendation(
  id: string,
): Promise<RecommendationResult> {
  return apiClient.delete<RecommendationResult>(
    `/reports/${encodeURIComponent(id)}/recommendations`,
  );
}

//report notes
export function createReportNote(
  reportId: string,
  noteText: string,
): Promise<ReportNote> {
  return apiClient.post<ReportNote>(
    `/reports/${encodeURIComponent(reportId)}/notes`,
    { note_text: noteText },
  );
}

export function updateReportNote(
  reportId: string,
  noteText: string,
): Promise<ReportNote> {
  return apiClient.put<ReportNote>(
    `/reports/${encodeURIComponent(reportId)}/notes`,
    { note_text: noteText },
  );
}

export function deleteReportNote(
  reportId: string,
): Promise<{ message: string }> {
  return apiClient.delete<{ message: string }>(
    `/reports/${encodeURIComponent(reportId)}/notes`,
  );
}

//report evaluasi
export function createReportEvaluasi(
  reportId: string,
  input: CreateReportEvaluasiInput,
): Promise<{
  message: string;
  evaluation: ReportEvaluasi;
}> {
  return apiClient.post<{
    message: string;
    evaluation: ReportEvaluasi;
  }>(`/reports/${encodeURIComponent(reportId)}/evaluasi`, input);
}

export function getReportEvaluasi(reportId: string): Promise<ReportEvaluasi[]> {
  return apiClient.get<ReportEvaluasi[]>(
    `/reports/${encodeURIComponent(reportId)}/evaluasi`,
  );
}

//Monitoring
export function getReportMonitoring(): Promise<MonitoringResponse> {
  return apiClient.get<MonitoringResponse>('/reports/monitoring');
}
