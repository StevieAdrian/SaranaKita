import type { SelectOption } from '@/shared/components/ui';

export const CLASS_OPTIONS: readonly SelectOption[] = [
  { value: 'X-A', label: 'X-A' },
  { value: 'X-B', label: 'X-B' },
  { value: 'XI-A', label: 'XI-A' },
  { value: 'XI-B', label: 'XI-B' },
  { value: 'XI-C', label: 'XI-C' },
  { value: 'XII-A', label: 'XII-A' },
  { value: 'XII-B', label: 'XII-B' },
  { value: 'XII-C', label: 'XII-C' },
] as const;

export const GENDER_OPTIONS = [
  { value: 'Laki-Laki', label: 'Laki-Laki' },
  { value: 'Perempuan', label: 'Perempuan' },
] as const;

export const PROFILE_TABS = [
  'Ubah Profile',
  'Data Sekolah',
  'Ubah Kata Sandi',
] as const;

export type ProfileTab = (typeof PROFILE_TABS)[number];

export function formatRoleLabel(role?: string | null): string {
  switch (role) {
    case 'siswa':
      return 'Siswa';
    case 'guru':
      return 'Guru';
    case 'staff':
      return 'Staff';
    case 'administrator':
      return 'Administrator';
    default:
      return 'Pengguna';
  }
}

export function formatBadgeLabel(role?: string | null): string {
  switch (role) {
    case 'siswa':
      return 'Siswa Aktif';
    case 'guru':
      return 'Guru Aktif';
    case 'staff':
      return 'Staff Aktif';
    case 'administrator':
      return 'Administrator';
    default:
      return 'Aktif';
  }
}
