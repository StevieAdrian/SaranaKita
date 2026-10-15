import type { RadioOption, SelectOption } from '@/shared/components/ui';

export const ROLE_FILTER_CHIPS = [
  { value: 'all', label: 'Semua' },
  { value: 'siswa', label: 'Siswa' },
  { value: 'guru', label: 'Guru' },
  { value: 'staff', label: 'Staff' },
] as const;

export const STATUS_FILTER_OPTIONS: readonly RadioOption[] = [
  {
    value: 'all',
    label: 'Semua Status',
    description: 'Tampilkan semua pengguna',
  },
  {
    value: 'active',
    label: 'Aktif',
    description: 'Hanya pengguna dengan akun aktif',
    dotColor: '#16A34A',
  },
  {
    value: 'pending',
    label: 'Menunggu Persetujuan',
    description: 'Pengguna yang menunggu verifikasi',
    dotColor: '#F59E0B',
  },
  {
    value: 'inactive',
    label: 'Nonaktif',
    description: 'Pengguna dengan status nonaktif',
    dotColor: '#EF4444',
  },
] as const;

export const USER_ROLE_OPTIONS: readonly SelectOption[] = [
  { value: 'siswa', label: 'Siswa' },
  { value: 'guru', label: 'Guru' },
  { value: 'staff', label: 'Staff' },
  { value: 'administrator', label: 'Administrator' },
] as const;

export const USER_STATUS_OPTIONS: readonly SelectOption[] = [
  { value: 'active', label: 'Aktif' },
  { value: 'pending', label: 'Menunggu' },
  { value: 'inactive', label: 'Nonaktif' },
] as const;
