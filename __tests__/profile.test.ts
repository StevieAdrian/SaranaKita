import { CLASS_OPTIONS, GENDER_OPTIONS, PROFILE_TABS, formatRoleLabel, formatBadgeLabel } from '../src/features/profile/utils/constants';
import { CardContribution, CardAdministratorStatistics, CardStaffContribution, CardStudentTeacherContribution } from '../src/features/profile/components/card-contribution';

describe('profile utils & constants', () => {
  it('defines valid class options for Siswa', () => {
    const values = CLASS_OPTIONS.map((c: { value: string }) => c.value);
    expect(values.length).toBeGreaterThan(0);
  });

  it('defines valid gender options', () => {
    expect(GENDER_OPTIONS).toEqual([
      { value: 'Laki-Laki', label: 'Laki-Laki' },
      { value: 'Perempuan', label: 'Perempuan' },
    ]);
  });

  it('defines the standard 3 profile tabs', () => {
    expect(PROFILE_TABS).toEqual([
      'Ubah Profile',
      'Data Sekolah',
      'Ubah Kata Sandi',
    ]);
  });

  it('formats role labels correctly', () => {
    expect(formatRoleLabel('siswa')).toBe('Siswa');
    expect(formatRoleLabel('guru')).toBe('Guru');
    expect(formatRoleLabel('staff')).toBe('Staff');
    expect(formatRoleLabel('administrator')).toBe('Administrator');
    expect(formatRoleLabel(null)).toBe('Pengguna');
    expect(formatRoleLabel(undefined)).toBe('Pengguna');
  });

  it('formats badge labels correctly matching Figma specs', () => {
    expect(formatBadgeLabel('siswa')).toBe('Siswa Aktif');
    expect(formatBadgeLabel('guru')).toBe('Guru Aktif');
    expect(formatBadgeLabel('staff')).toBe('Staff Aktif');
    expect(formatBadgeLabel('administrator')).toBe('Administrator');
    expect(formatBadgeLabel(null)).toBe('Aktif');
  });

  it('exports separated role contribution and statistics components', () => {
    expect(typeof CardContribution).toBe('function');
    expect(typeof CardAdministratorStatistics).toBe('function');
    expect(typeof CardStaffContribution).toBe('function');
    expect(typeof CardStudentTeacherContribution).toBe('function');
  });
});
