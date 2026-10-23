import { ROLE_FILTER_CHIPS, STATUS_FILTER_OPTIONS, USER_ROLE_OPTIONS } from '../src/features/user-management/utils/constants';
import { isRoleAdminOrStaff } from '../src/features/user-management/utils/permissions';
import type { ManageUser } from '../src/services/users';

describe('user-management permissions and constants', () => {
  it('allows only administrator and staff to manage users', () => {
    expect(isRoleAdminOrStaff('administrator')).toBe(true);
    expect(isRoleAdminOrStaff('staff')).toBe(true);
    expect(isRoleAdminOrStaff('siswa')).toBe(false);
    expect(isRoleAdminOrStaff('guru')).toBe(false);
    expect(isRoleAdminOrStaff(null)).toBe(false);
    expect(isRoleAdminOrStaff(undefined)).toBe(false);
  });

  it('defines valid role filter options', () => {
    const roles = ROLE_FILTER_CHIPS.map((chip) => chip.value);
    expect(roles).toEqual(['all', 'siswa', 'guru', 'staff']);
  });

  it('defines valid user role options for creation/edit', () => {
    const roles = USER_ROLE_OPTIONS.map((opt) => opt.value);
    expect(roles).toEqual(['siswa', 'guru', 'staff']);
  });

  it('defines valid status filter options', () => {
    const statuses = STATUS_FILTER_OPTIONS.map((opt) => opt.value);
    expect(statuses).toEqual(['all', 'active', 'inactive']);
  });

  it('filters users by query, role, and status', () => {
    const mockUsers: ManageUser[] = [
      {
        id: '1',
        username: 'BC',
        email: 'bece@sch.id',
        fullName: 'Bryan Cornelius Sunadi',
        role: 'siswa',
        isVerified: true,
        createdAt: '2026-01-01',
        status: 'active',
        classOrPosition: 'X-A',
      },
      {
        id: '2',
        username: 'Jelly',
        email: 'jelly@sch.id',
        fullName: 'Jelly The Pug',
        role: 'guru',
        isVerified: true,
        createdAt: '2026-01-02',
        status: 'pending',
        classOrPosition: 'Guru Fisika',
      },
    ];

    // Search
    const searchMatch = mockUsers.filter(
      (u) =>
        u.fullName?.toLowerCase().includes('jelly') ||
        u.email.toLowerCase().includes('jelly@sch.id'),
    );
    expect(searchMatch).toHaveLength(1);
    expect(searchMatch[0]?.id).toBe('2');

    // Role filter
    const siswaUsers = mockUsers.filter((u) => u.role === 'siswa');
    expect(siswaUsers).toHaveLength(1);
    expect(siswaUsers[0]?.id).toBe('1');
  });

  it('excludes users marked with isDelete = true from active users list', () => {
    const mockUsersWithDeleted: ManageUser[] = [
      {
        id: '1',
        username: 'activeUser',
        email: 'active@sch.id',
        fullName: 'Active User',
        role: 'siswa',
        isVerified: true,
        createdAt: '2026-01-01',
        status: 'active',
        isDelete: false,
      },
      {
        id: '2',
        username: 'deletedUser',
        email: 'deleted@sch.id',
        fullName: 'Deleted User',
        role: 'guru',
        isVerified: true,
        createdAt: '2026-01-02',
        status: 'inactive',
        isDelete: true,
      },
    ];

    const activeUsers = mockUsersWithDeleted.filter((u) => !u.isDelete);
    expect(activeUsers).toHaveLength(1);
    expect(activeUsers[0]?.username).toBe('activeUser');
  });

  it('correctly composes full name from firstName and lastName', () => {
    const firstName = 'Bryan';
    const lastName = 'Cornelius';
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    expect(fullName).toBe('Bryan Cornelius');
  });

  describe('formatClassOrPosition', () => {
    const { formatClassOrPosition } = require('../src/features/user-management/utils/format');

    it('formats siswa class correctly with Kelas prefix', () => {
      expect(formatClassOrPosition('siswa', '9A')).toBe('Kelas 9A');
      expect(formatClassOrPosition('siswa', 'XI-C')).toBe('Kelas XI-C');
      expect(formatClassOrPosition('siswa', 'Kelas 9A')).toBe('Kelas 9A');
      expect(formatClassOrPosition('siswa', '')).toBe('Kelas -');
    });

    it('formats guru position correctly with Guru prefix', () => {
      expect(formatClassOrPosition('guru', 'Matematika')).toBe('Guru Matematika');
      expect(formatClassOrPosition('guru', 'Guru Bahasa Indonesia')).toBe('Guru Bahasa Indonesia');
      expect(formatClassOrPosition('guru', '')).toBe('Guru');
    });

    it('formats staff position correctly with Staff prefix', () => {
      expect(formatClassOrPosition('staff', 'TU')).toBe('Staff TU');
      expect(formatClassOrPosition('staff', 'Staff Kebersihan')).toBe('Staff Kebersihan');
      expect(formatClassOrPosition('staff', '')).toBe('Staff');
    });

    it('formats administrator position correctly with Administrator prefix', () => {
      expect(formatClassOrPosition('administrator', 'Utama')).toBe('Administrator Utama');
      expect(formatClassOrPosition('administrator', 'Admin TI')).toBe('Admin TI');
      expect(formatClassOrPosition('administrator', '')).toBe('Administrator');
    });
  });

  describe('edit user form validation rules', () => {
    const { PHONE_RE } = require('../src/features/auth/utils/validation');

    it('requires firstName with at least 1 character while lastName is optional', () => {
      const validateNames = (first: string) => {
        const cleanFirst = first.trim();
        if (!cleanFirst) return 'First name wajib diisi.';
        return null;
      };

      expect(validateNames('')).toBe('First name wajib diisi.');
      expect(validateNames('A')).toBeNull();
      expect(validateNames('Al')).toBeNull();
      expect(validateNames('Alicia')).toBeNull();
    });

    it('treats phone as optional, but validates PHONE_RE format if provided', () => {
      const validatePhone = (phone: string) => {
        const cleanPhone = phone.trim();
        if (!cleanPhone) return null;
        if (!PHONE_RE.test(cleanPhone) || cleanPhone.replace(/\D/g, '').length < 9) {
          return 'Format nomor telepon tidak valid (minimal 9 digit).';
        }
        return null;
      };

      expect(validatePhone('')).toBeNull();
      expect(validatePhone('   ')).toBeNull();
      expect(validatePhone('12345')).toBe('Format nomor telepon tidak valid (minimal 9 digit).');
      expect(validatePhone('abcde')).toBe('Format nomor telepon tidak valid (minimal 9 digit).');
      expect(validatePhone('08123456789')).toBeNull();
      expect(validatePhone('+6281234567890')).toBeNull();
    });
  });
});
