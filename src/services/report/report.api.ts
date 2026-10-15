import { apiClient } from '@/services/api';
import { ReportDetail } from './detail.api';

export type CreateReportInput = {
  readonly title: string;
  readonly description: string;
  readonly location: string;
  readonly categoryId: string;
  readonly brokenDate: string;
  readonly imageUrl?: string;
  readonly imagePublicId?: string;
};

export type UpdateReportInput = {
  readonly title?: string;
  readonly description?: string;
  readonly location?: string;
  readonly categoryId?: string;
  readonly brokenDate?: string;
  readonly imageUrl?: string | null;
  readonly imagePublicId?: string;
};

export type Report = {
  readonly id: string;
  readonly title: string;
  readonly description: string | null;
  readonly location: string | null;
  readonly brokenDate: string | null;
  readonly categoryId: string | null;
  readonly statusId: string | null;
  readonly imageUrl: string | null;
  readonly isValidated: boolean;
  readonly createdAt: string;
};

export function createReport(input: CreateReportInput): Promise<Report> {
  return apiClient.post<Report>('/reports', input);
}

export function updateReport(
  reportId: string,
  input: UpdateReportInput,
): Promise<Report> {
  return apiClient.put<Report>(`/reports/${reportId}`, input);
}
