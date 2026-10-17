import { apiClient } from '@/services/api';
import type { UserRole } from '@/services/auth';
import type { ReportStatus } from './feed.api';
import type { UpdateReportStatusName } from './status.constants';

export type ReportTimelineEvent = {
  readonly type: 'created' | ReportStatus;
  readonly at: string;
};

export type ReportComment = {
  readonly id: string;
  readonly reportId: string;
  readonly userId: string;
  readonly authorName: string;
  readonly authorRole: UserRole | null;
  readonly avatarUrl: string | null;
  readonly commentText: string;
  readonly createdAt: string;
};

export type ReportDetail = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly location: string;
  readonly brokenDate: string | null;
  readonly category: { readonly id: string; readonly name: string } | null;
  readonly status: ReportStatus;
  readonly imageUrls: readonly string[];
  readonly reporter: {
    readonly name: string;
    readonly role: UserRole | null;
    readonly className: string | null;
    readonly avatarUrl: string | null;
  };
  readonly createdAt: string;
  readonly votes: number;
  readonly comments: number;
  readonly recommendations: number;
  readonly votedByMe: boolean;
  readonly recommendedByMe: boolean;
  readonly timeline: readonly ReportTimelineEvent[];
};

export function getReportDetail(id: string): Promise<ReportDetail> {
  return apiClient.get<ReportDetail>(`/reports/${encodeURIComponent(id)}`);
}

export function getReportComments(id: string): Promise<ReportComment[]> {
  return apiClient.get<ReportComment[]>(
    `/reports/${encodeURIComponent(id)}/comments`,
  );
}

export function createReportComment(
  id: string,
  commentText: string,
): Promise<ReportComment> {
  return apiClient.post<ReportComment>(
    `/reports/${encodeURIComponent(id)}/comments`,
    { commentText },
  );
}

export type RejectReportResult = {
  readonly reportId: string;
  readonly status: string;
};

export function rejectReport(id: string): Promise<RejectReportResult> {
  return apiClient.post<RejectReportResult>(
    `/reports/${encodeURIComponent(id)}/reject`,
  );
}

export type UpdateReportStatusInput = {
  readonly statusName: UpdateReportStatusName;
};

export function updateReportStatus(
  id: string,
  input: UpdateReportStatusInput,
): Promise<ReportDetail> {
  return apiClient.patch<ReportDetail>(
    `/reports/${encodeURIComponent(id)}/status`,
    input,
  );
}
