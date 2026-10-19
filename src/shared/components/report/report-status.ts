import {
  REPORT_STATUS,
  REPORT_STATUS_NAME,
  type ReportStatus,
} from '@/services/report/status.constants';

export type { ReportStatus } from '@/services/report/status.constants';

type StatusMeta = {
  readonly label: string;
  readonly container: string;
  readonly text: string;
  readonly dot: string;
};

export const REPORT_STATUS_META: Record<ReportStatus, StatusMeta> = {
  [REPORT_STATUS.WAITING_VERIFICATION]: {
    label: REPORT_STATUS_NAME.WAITING_VERIFICATION,
    container: 'bg-[#DBEAFE]',
    text: 'text-[#2563EB]',
    dot: 'bg-[#2563EB]',
  },
  [REPORT_STATUS.IN_REVIEW]: {
    label: REPORT_STATUS_NAME.IN_REVIEW,
    container: 'bg-[#FEF3C7]',
    text: 'text-[#B45309]',
    dot: 'bg-[#F59E0B]',
  },
  [REPORT_STATUS.IN_REPAIR]: {
    label: REPORT_STATUS_NAME.IN_REPAIR,
    container: 'bg-[#FFEDD5]',
    text: 'text-[#9A3412]',
    dot: 'bg-[#9A3412]',
  },
  [REPORT_STATUS.REJECTED]: {
    label: REPORT_STATUS_NAME.REJECTED,
    container: 'bg-[#FEE2E2]',
    text: 'text-[#B91C1C]',
    dot: 'bg-[#B91C1C]',
  },
  [REPORT_STATUS.DONE]: {
    label: REPORT_STATUS_NAME.DONE,
    container: 'bg-[#DCFCE7]',
    text: 'text-[#15803D]',
    dot: 'bg-[#22C55E]',
  },
};
