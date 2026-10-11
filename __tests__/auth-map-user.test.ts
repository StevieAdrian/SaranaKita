import { toAuthUser } from '../src/services/auth/map-user';

const base = { id: 'u1', email: 'a@sekolah.id', displayName: 'Alicia' };

describe('toAuthUser', () => {
  it.each(['siswa', 'guru', 'staff', 'administrator'] as const)(
    'keeps known role %s',
    role => {
      expect(toAuthUser({ ...base, role })).toEqual({ ...base, role });
    },
  );

  it.each([undefined, null, '', 'user', 'admin', 'STAFF'])(
    'maps unknown role %p to null',
    role => {
      expect(toAuthUser({ ...base, role }).role).toBeNull();
    },
  );

  it('drops unexpected fields from the API payload', () => {
    const payload = { ...base, role: 'guru', extra: 'x' } as Parameters<
      typeof toAuthUser
    >[0];
    expect(toAuthUser(payload)).toEqual({ ...base, role: 'guru' });
  });
});
