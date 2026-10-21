export { CLASS_OPTIONS } from '@/shared/constants';

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

export const profileFonts = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
} as const;
