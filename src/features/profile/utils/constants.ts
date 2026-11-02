export { CLASS_OPTIONS } from '@/shared/constants';
import { fontFamilies, palette } from '@/shared/theme';

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

export const profileFonts = fontFamilies;

export const profileColors = {
  brand: palette.brand,
  white: palette.white,
  background: '#F0F6FF',
  backgroundSubtle: palette.slate[50],
  cardBg: palette.white,
  text: {
    primary: palette.slate[900],
    body: palette.slate[800],
    muted: palette.slate[500],
    subtle: palette.slate[400],
    white: palette.white,
  },
  border: {
    default: palette.slate[300],
    light: palette.slate[200],
    focused: palette.brand,
    error: palette.errorRed,
  },
  stats: {
    pending: palette.brand,
    inReview: palette.warning,
    inRepair: palette.brown,
    resolved: '#166534',
    rejected: '#9A3412',
  },
} as const;
