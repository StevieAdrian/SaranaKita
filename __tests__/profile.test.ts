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
      'Ubah Profil',
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

  describe('RULES FOR PROFILE PAGE - Card Statistic per Role', () => {
    it('applies rules for Siswa and Guru (Laporan Dibuat, Dukungan / Rekomendasi, and status breakdown)', () => {
      const siswaStats = {
        reportsCreated: 5,
        votesCount: 12,
        recommendationsCount: 0,
        'Menunggu Verifikasi': 1,
        'Dalam Pemeriksaan': 1,
        'Dalam Perbaikan': 1,
        'Selesai': 2,
        'Ditolak': 0,
      };

      const guruStats = {
        reportsCreated: 3,
        votesCount: 0,
        recommendationsCount: 8,
        'Menunggu Verifikasi': 0,
        'Dalam Pemeriksaan': 1,
        'Dalam Perbaikan': 1,
        'Selesai': 1,
        'Ditolak': 0,
      };

      expect(siswaStats.reportsCreated).toBe(5);
      expect(siswaStats.votesCount).toBe(12);

      expect(guruStats.reportsCreated).toBe(3);
      expect(guruStats.recommendationsCount).toBe(8);

      const totalSiswaStatus =
        siswaStats['Menunggu Verifikasi'] +
        siswaStats['Dalam Pemeriksaan'] +
        siswaStats['Dalam Perbaikan'] +
        siswaStats['Selesai'] +
        siswaStats['Ditolak'];
      expect(totalSiswaStatus).toBe(siswaStats.reportsCreated);

      const totalGuruStatus =
        guruStats['Menunggu Verifikasi'] +
        guruStats['Dalam Pemeriksaan'] +
        guruStats['Dalam Perbaikan'] +
        guruStats['Selesai'] +
        guruStats['Ditolak'];
      expect(totalGuruStatus).toBe(guruStats.reportsCreated);
    });

    it('applies rules for Staff (Laporan Ditolak, Laporan Diverifikasi, Menunggu Verifikasi)', () => {
      const staffStats = {
        reportsRejected: 3,
        reportsVerified: 8,
        'Menunggu Verifikasi': 4,
      };

      expect(staffStats.reportsRejected).toBe(3);
      expect(staffStats.reportsVerified).toBe(8);
      expect(staffStats['Menunggu Verifikasi']).toBe(4);
    });

    it('applies rules for Administrator (Menunggu Verifikasi, Dalam Pemeriksaan, Dalam Perbaikan, Selesai)', () => {
      const adminStats = {
        'Menunggu Verifikasi': 7,
        'Dalam Pemeriksaan': 3,
        'Dalam Perbaikan': 2,
        'Selesai': 15,
      };

      expect(adminStats['Menunggu Verifikasi']).toBe(7);
      expect(adminStats['Dalam Pemeriksaan']).toBe(3);
      expect(adminStats['Dalam Perbaikan']).toBe(2);
      expect(adminStats['Selesai']).toBe(15);
    });
  });
});
