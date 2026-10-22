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

export type ReportNoteMode = 'create' | 'edit';

export type ReportNoteSheetProps = {
  visible: boolean;
  mode: ReportNoteMode;
  initialNote?: string;
  onClose: () => void;
  onSave: (noteText: string) => Promise<void>;
  buttonColor?: string;
};
