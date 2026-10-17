import {
  REPORT_STATUS,
  REPORT_STATUS_NAME,
  type ReportStatus,
} from '@/services/report/status.constants';

export const PROGRESS_STEPS = [
  'Verifikasi',
  'Pemeriksaan',
  'Perbaikan',
  REPORT_STATUS_NAME.DONE,
] as const;

type ProgressMeta = {
  readonly percent: number;
  readonly completedSteps: number;
  readonly color: string;
};

export const REPORT_PROGRESS: Record<ReportStatus, ProgressMeta> = {
  [REPORT_STATUS.WAITING_VERIFICATION]: {
    percent: 15,
    completedSteps: 1,
    color: '#2563EB',
  },
  [REPORT_STATUS.IN_REVIEW]: {
    percent: 40,
    completedSteps: 2,
    color: '#F59E0B',
  },
  [REPORT_STATUS.IN_REPAIR]: {
    percent: 70,
    completedSteps: 3,
    color: '#9A3412',
  },
  [REPORT_STATUS.DONE]: { percent: 100, completedSteps: 4, color: '#15803D' },
  [REPORT_STATUS.REJECTED]: { percent: 0, completedSteps: 1, color: '#B91C1C' },
};
