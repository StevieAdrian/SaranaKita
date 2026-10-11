import { apiClient } from '@/services/api';
import type { UserRole } from '@/services/auth';
import type { ReportStatus } from './feed.api';

export type ReportTimelineEvent = {
  readonly type: 'created' | ReportStatus;
  readonly at: string;
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
  readonly timeline: readonly ReportTimelineEvent[];
};

export function getReportDetail(id: string): Promise<ReportDetail> {
  return apiClient.get<ReportDetail>(`/reports/${encodeURIComponent(id)}`);
}
