import type { PickedPhoto } from '@/shared/components/ui';

export type ReportFormValues = {
  readonly photo: PickedPhoto | null;
  readonly title: string;
  readonly description: string;
  readonly categoryId: string | null;
  readonly location: string;
  readonly incidentDate: Date;
};

export type ReportFormField = keyof ReportFormValues;

export type ReportFormErrors = Partial<Record<ReportFormField, string>>;
