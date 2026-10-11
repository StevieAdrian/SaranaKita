export type ReportStatus =
  | 'waiting_verification'
  | 'in_review'
  | 'in_repair'
  | 'rejected'
  | 'done';

type StatusMeta = {
  readonly label: string;
  readonly container: string;
  readonly text: string;
  readonly dot: string;
};

export const REPORT_STATUS_META: Record<ReportStatus, StatusMeta> = {
  waiting_verification: {
    label: 'Menunggu Verifikasi',
    container: 'bg-[#DBEAFE]',
    text: 'text-[#2563EB]',
    dot: 'bg-[#2563EB]',
  },
  in_review: {
    label: 'Dalam Pemeriksaan',
    container: 'bg-[#FEF3C7]',
    text: 'text-[#B45309]',
    dot: 'bg-[#F59E0B]',
  },
  in_repair: {
    label: 'Dalam Perbaikan',
    container: 'bg-[#FFEDD5]',
    text: 'text-[#9A3412]',
    dot: 'bg-[#9A3412]',
  },
  rejected: {
    label: 'Ditolak',
    container: 'bg-[#FEE2E2]',
    text: 'text-[#B91C1C]',
    dot: 'bg-[#B91C1C]',
  },
  done: {
    label: 'Selesai',
    container: 'bg-[#DCFCE7]',
    text: 'text-[#15803D]',
    dot: 'bg-[#22C55E]',
  },
};
