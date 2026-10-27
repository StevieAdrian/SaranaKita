export { CLASS_OPTIONS } from '@/shared/constants';

export const GENDER_OPTIONS = [
  { value: 'Laki-Laki', label: 'Laki-Laki' },
  { value: 'Perempuan', label: 'Perempuan' },
] as const;

export const PROFILE_TABS = [
  'Ubah Profil',
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

export function formatRoleTitle(
  role?: string | null,
  classOrPosition?: string | null,
): string {
  const isGuru = role === 'guru';
  if (isGuru) {
    if (!classOrPosition) return 'Guru';
    return classOrPosition.toLowerCase().includes('guru')
      ? classOrPosition
      : `Guru ${classOrPosition}`;
  }
  if (role === 'staff') {
    if (!classOrPosition) return 'Staff';
    return classOrPosition.toLowerCase().includes('staff')
      ? classOrPosition
      : `Staff ${classOrPosition}`;
  }
  if (role === 'administrator') {
    return classOrPosition || 'Administrator';
  }
  if (!classOrPosition) return 'Siswa';
  return classOrPosition.toLowerCase().startsWith('kelas')
    ? classOrPosition
    : `Kelas ${classOrPosition}`;
}

export const profileFonts = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
} as const;

export const profileColors = {
  brand: '#2563EB',
  white: '#FFFFFF',
  background: '#F0F6FF',
  backgroundSubtle: '#F8FAFC',
  cardBg: '#FFFFFF',
  text: {
    primary: '#0F172A',
    body: '#1E293B',
    muted: '#64748B',
    subtle: '#94A3B8',
    white: '#FFFFFF',
  },
  border: {
    default: '#CBD5E1',
    light: '#E2E8F0',
    focused: '#2563EB',
    error: '#EF4444',
  },
  stats: {
    pending: '#2563EB',
    inReview: '#F59E0B',
    inRepair: '#713F12',
    resolved: '#166534',
    rejected: '#9A3412',
  },
} as const;
