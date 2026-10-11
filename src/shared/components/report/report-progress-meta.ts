import type { ReportStatus } from './report-status';

export const PROGRESS_STEPS = [
  'Verifikasi',
  'Pemeriksaan',
  'Perbaikan',
  'Selesai',
] as const;

type ProgressMeta = {
  readonly percent: number;
  readonly completedSteps: number;
  readonly color: string;
};

export const REPORT_PROGRESS: Record<ReportStatus, ProgressMeta> = {
  waiting_verification: { percent: 15, completedSteps: 1, color: '#2563EB' },
  in_review: { percent: 40, completedSteps: 2, color: '#F59E0B' },
  in_repair: { percent: 70, completedSteps: 3, color: '#9A3412' },
  done: { percent: 100, completedSteps: 4, color: '#15803D' },
  rejected: { percent: 0, completedSteps: 1, color: '#B91C1C' },
};
