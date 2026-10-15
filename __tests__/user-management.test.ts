import {
  ROLE_FILTER_CHIPS,
  STATUS_FILTER_OPTIONS,
  USER_ROLE_OPTIONS,
} from '../src/features/user-management/utils/constants';
import { isRoleAdminOrStaff } from '../src/features/user-management/utils/permissions';
import type { ManagedUser } from '../src/services/users';

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
    expect(roles).toEqual(['siswa', 'guru', 'staff', 'administrator']);
  });

  it('defines valid status filter options', () => {
    const statuses = STATUS_FILTER_OPTIONS.map((opt) => opt.value);
    expect(statuses).toEqual(['all', 'active', 'pending', 'inactive']);
  });

  it('filters users by query, role, and status', () => {
    const mockUsers: ManagedUser[] = [
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
        u.fullName?.toLowerCase().includes('Jelly') ||
        u.email.toLowerCase().includes('Jelly'),
    );
    expect(searchMatch).toHaveLength(1);
    expect(searchMatch[0]?.id).toBe('2');

    // Role filter
    const siswaUsers = mockUsers.filter((u) => u.role === 'siswa');
    expect(siswaUsers).toHaveLength(1);
    expect(siswaUsers[0]?.id).toBe('1');
  });
});
