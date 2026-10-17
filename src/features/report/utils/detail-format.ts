import type { UserRole } from '@/services/auth';
import type { ReportTimelineEvent } from '@/services/report';
import { REPORT_STATUS, REPORT_STATUS_NAME } from '@/services/report/status.constants';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

const ROLE_LABELS: Record<UserRole, string> = {
  siswa: 'Siswa',
  guru: 'Guru',
  staff: 'Staff',
  administrator: 'Administrator',
};

const TIMELINE_COPY: Record<
  ReportTimelineEvent['type'],
  { title: string; body: string }
> = {
  created: {
    title: 'Laporan Dibuat',
    body: 'Laporan berhasil dikirim ke tim pengelola sekolah.',
  },
  [REPORT_STATUS.WAITING_VERIFICATION]: {
    title: REPORT_STATUS_NAME.WAITING_VERIFICATION,
    body: 'Laporan sedang menunggu verifikasi pihak sekolah.',
  },
  [REPORT_STATUS.IN_REVIEW]: {
    title: REPORT_STATUS_NAME.IN_REVIEW,
    body: 'Laporan sedang diperiksa oleh pihak sekolah.',
  },
  [REPORT_STATUS.IN_REPAIR]: {
    title: REPORT_STATUS_NAME.IN_REPAIR,
    body: 'Kerusakan sedang dalam proses perbaikan.',
  },
  [REPORT_STATUS.REJECTED]: {
    title: `Laporan ${REPORT_STATUS_NAME.REJECTED}`,
    body: 'Laporan ditolak oleh pihak sekolah.',
  },
  [REPORT_STATUS.DONE]: {
    title: REPORT_STATUS_NAME.DONE,
    body: 'Perbaikan telah selesai dilakukan.',
  },
};

function parse(iso: string): Date | null {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatIsoDate(iso: string): string {
  const date = parse(iso);
  if (!date) {
    return iso;
  }
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function formatShortDate(iso: string): string {
  const date = parse(iso);
  if (!date) {
    return iso;
  }
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatReporterRole(
  role: UserRole | null,
  className: string | null,
): string {
  const label = role ? ROLE_LABELS[role] : 'Pengguna';
  return role === 'siswa' && className ? `${label} Kelas ${className}` : label;
}

export function timelineCopy(type: ReportTimelineEvent['type']): {
  title: string;
  body: string;
} {
  return TIMELINE_COPY[type];
}

export function initialOf(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '?';
}
