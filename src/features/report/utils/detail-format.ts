import type { UserRole } from '@/services/auth';
import type { ReportTimelineEvent } from '@/services/report';

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
  waiting_verification: {
    title: 'Menunggu Verifikasi',
    body: 'Laporan sedang menunggu verifikasi pihak sekolah.',
  },
  in_review: {
    title: 'Dalam Pemeriksaan',
    body: 'Laporan sedang diperiksa oleh pihak sekolah.',
  },
  in_repair: {
    title: 'Dalam Perbaikan',
    body: 'Kerusakan sedang dalam proses perbaikan.',
  },
  rejected: {
    title: 'Laporan Ditolak',
    body: 'Laporan ditolak oleh pihak sekolah.',
  },
  done: { title: 'Selesai', body: 'Perbaikan telah selesai dilakukan.' },
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
