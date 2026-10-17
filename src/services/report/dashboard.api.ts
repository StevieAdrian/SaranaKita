import { apiClient } from '@/services/api';
import type { FeedReport, ReportStatus } from './feed.api';

export type ReportDashboard = {
  readonly generatedAt: string;
  readonly schoolName: string | null;
  readonly totalReports: number;
  readonly totalThisMonth: number;
  readonly statusCounts: Readonly<Record<ReportStatus, number>>;
  readonly categories: readonly {
    readonly id: string;
    readonly name: string;
    readonly count: number;
  }[];
  readonly urgentReports: readonly FeedReport[];
};

export function getReportDashboard(): Promise<ReportDashboard> {
  return apiClient.get<ReportDashboard>('/reports/dashboard');
}
