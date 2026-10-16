export type ManageUser = {
  readonly id: string;
  readonly username: string | null;
  readonly email: string;
  readonly fullName: string | null;
  readonly role: 'siswa' | 'guru' | 'staff' | 'administrator' | null;
  readonly isVerified: boolean;
  readonly createdAt: string;
  readonly classOrPosition?: string | null;
  readonly avatarUrl?: string | null;
  readonly status?: 'active' | 'pending' | 'inactive';
};

export type UserSummary = {
  readonly totalSiswa: number;
  readonly totalGuru: number;
  readonly totalStaff: number;
};

export type CreateUserInput = {
  readonly fullName: string;
  readonly email: string;
  readonly role: 'siswa' | 'guru' | 'staff' | 'administrator';
  readonly classOrPosition?: string;
  readonly status?: string;
  readonly password?: string;
};

export type UpdateUserInput = {
  readonly fullName?: string;
  readonly email?: string;
  readonly role?: 'siswa' | 'guru' | 'staff' | 'administrator';
  readonly classOrPosition?: string;
  readonly status?: string;
};
