import { apiClient } from '@/services/api';

export type ReportStatus =
  | 'waiting_verification'
  | 'in_review'
  | 'in_repair'
  | 'rejected'
  | 'done';

export type FeedReport = {
  readonly id: string;
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
