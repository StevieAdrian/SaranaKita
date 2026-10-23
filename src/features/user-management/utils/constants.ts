import type { RadioOption, SelectOption } from '@/shared/components/ui';

export const userFonts = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
} as const;

export const fontWeights = {
  regular: undefined,
  medium: undefined,
  semiBold: undefined,
  bold: undefined,
};

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
    dotColor: '#6B7280',
  },
  {
    value: 'active',
    label: 'Aktif',
    description: 'Hanya pengguna dengan akun aktif',
    dotColor: '#34C759',
  },
  {
    value: 'inactive',
    label: 'Nonaktif',
    description: 'Hanya pengguna dengan akun nonaktif',
    dotColor: '#EF4444',
  },
] as const;

export const USER_ROLE_OPTIONS: readonly SelectOption[] = [
  { value: 'siswa', label: 'Siswa' },
  { value: 'guru', label: 'Guru' },
  { value: 'staff', label: 'Staff' },
] as const;

export const USER_STATUS_OPTIONS: readonly SelectOption[] = [
  { value: 'active', label: 'Aktif' },
  { value: 'pending', label: 'Menunggu' },
  { value: 'inactive', label: 'Nonaktif' },
] as const;
