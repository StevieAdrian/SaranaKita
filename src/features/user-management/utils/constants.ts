import { fontFamilies, palette } from '@/shared/theme';
import type { RadioOption, SelectOption } from '@/shared/components/ui';

export const userFonts = fontFamilies;

export const DEFAULT_USER_PASSWORD = 'SaranaKita123';

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
  { value: 'inactive', label: 'Nonaktif' },
] as const;

import { Appearance } from 'react-native';

export function getUserManagementColors(scheme?: 'light' | 'dark' | null) {
  const isDark = (scheme ?? Appearance.getColorScheme()) === 'dark';
  return {
    brand: palette.brand,
    white: palette.white,
    background: isDark ? '#0B1220' : palette.slate[50],
    cardBg: isDark ? '#151E2E' : palette.white,
    text: {
      primary: isDark ? '#F1F5F9' : palette.slate[900],
      secondary: isDark ? '#CBD5E1' : palette.slate[800],
      muted: isDark ? '#94A3B8' : palette.slate[500],
      subtle: isDark ? '#64748B' : palette.slate[400],
      placeholder: isDark ? '#828282' : palette.slate[400],
    },
    border: {
      default: isDark ? '#334155' : palette.slate[300],
      light: isDark ? '#1F293D' : palette.slate[200],
      focused: palette.brand,
      error: palette.errorRed,
    },
  };
}

export const userManagementColors = {
  get brand() { return getUserManagementColors().brand; },
  get white() { return getUserManagementColors().white; },
  get background() { return getUserManagementColors().background; },
  get cardBg() { return getUserManagementColors().cardBg; },
  get text() { return getUserManagementColors().text; },
  get border() { return getUserManagementColors().border; },
  roles: {
    siswa: {
      dot: '#3B82F6',
      bg: '#EFF6FF',
      border: '#3B82F6',
      title: '#1D4ED8',
    },
    guru: {
      dot: '#8B5CF6',
      bg: '#F5F3FF',
      border: '#8B5CF6',
      title: '#6D28D9',
    },
    staff: {
      dot: '#10B981',
      bg: '#ECFDF5',
      border: '#10B981',
      title: '#047857',
    },
  },
  status: {
    active: {
      dot: '#34C759',
      bg: '#F0FDF4',
      border: '#34C759',
      title: '#166534',
    },
    inactive: {
      dot: '#EF4444',
      bg: '#FEF2F2',
      border: '#EF4444',
      title: '#991B1B',
    },
  },
  badges: {
    status: {
      active: { bg: '#DCFCE7', text: '#16A34A' },
      inactive: { bg: '#FEE2E2', text: '#DC2626' },
    },
    role: {
      siswa: { bg: '#DBEAFE', text: '#112D71' },
      guru: { bg: '#FEF9C3', text: '#F59E0B' },
      staff: { bg: '#DCFCE7', text: '#166534' },
      administrator: { bg: '#FEE2E2', text: '#360707' },
    },
    summary: {
      siswa: { bg: 'rgba(37, 99, 235, 0.13)', text: '#112D71' },
      guru: { bg: 'rgba(245, 158, 11, 0.12)', text: '#D97706' },
      staff: { bg: 'rgba(22, 101, 52, 0.12)', text: '#166534' },
    },
  },
  avatars: {
    siswa: '#112D71',
    guru: '#F59E0B',
    staff: '#166534',
    administrator: '#360707',
  },
} as const;

export type RoleOptionItem = {
  value: 'siswa' | 'guru' | 'staff';
  label: string;
  description: string;
  dotColor: string;
  selectedBg: string;
  selectedBorder: string;
  radioColor: string;
  selectedTitleColor: string;
};

export const ROLE_OPTIONS_DATA: readonly RoleOptionItem[] = [
  {
    value: 'siswa',
    label: 'Siswa',
    description: 'Pengguna murid atau peserta didik',
    dotColor: '#3B82F6',
    selectedBg: '#EFF6FF',
    selectedBorder: '#3B82F6',
    radioColor: '#3B82F6',
    selectedTitleColor: '#1D4ED8',
  },
  {
    value: 'guru',
    label: 'Guru',
    description: 'Tenaga pendidik atau guru pengajar',
    dotColor: '#8B5CF6',
    selectedBg: '#F5F3FF',
    selectedBorder: '#8B5CF6',
    radioColor: '#8B5CF6',
    selectedTitleColor: '#6D28D9',
  },
  {
    value: 'staff',
    label: 'Staff',
    description: 'Tenaga kependidikan atau staf operasional',
    dotColor: '#10B981',
    selectedBg: '#ECFDF5',
    selectedBorder: '#10B981',
    radioColor: '#10B981',
    selectedTitleColor: '#047857',
  },
];

export type StatusOptionItem = {
  value: 'active' | 'inactive';
  label: string;
  description: string;
  dotColor: string;
  selectedBg: string;
  selectedBorder: string;
  radioColor: string;
  selectedTitleColor: string;
};

export const STATUS_OPTIONS_DATA: readonly StatusOptionItem[] = [
  {
    value: 'active',
    label: 'Aktif',
    description: 'Akun aktif dan dapat masuk ke aplikasi',
    dotColor: '#34C759',
    selectedBg: '#F0FDF4',
    selectedBorder: '#34C759',
    radioColor: '#34C759',
    selectedTitleColor: '#166534',
  },
  {
    value: 'inactive',
    label: 'Nonaktif',
    description: 'Akun dinonaktifkan sementara dari sistem',
    dotColor: '#EF4444',
    selectedBg: '#FEF2F2',
    selectedBorder: '#EF4444',
    radioColor: '#EF4444',
    selectedTitleColor: '#991B1B',
  },
];
