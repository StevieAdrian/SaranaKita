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
  readonly isActive?: boolean;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly phone?: string | null;
  readonly gender?: string | null;
  readonly dateOfBirth?: string | null;
  readonly isDelete?: boolean;
};

export type UserSummary = {
  readonly totalSiswa: number;
  readonly totalGuru: number;
  readonly totalStaff: number;
};

export type CreateUserInput = {
  readonly username?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly fullName?: string;
  readonly email: string;
  readonly role: 'siswa' | 'guru' | 'staff' | 'administrator';
  readonly classOrPosition?: string;
  readonly status?: string;
  readonly isActive?: boolean;
  readonly password?: string;
  readonly gender?: string | null;
  readonly phone?: string;
  readonly phoneNumber?: string;
  readonly dateOfBirth?: string;
  readonly avatarUrl?: string | null;
};

export type UpdateUserInput = {
  readonly username?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly fullName?: string;
  readonly email?: string;
  readonly role?: 'siswa' | 'guru' | 'staff' | 'administrator';
  readonly classOrPosition?: string;
  readonly status?: string;
  readonly isActive?: boolean;
  readonly password?: string;
  readonly gender?: string | null;
  readonly phone?: string;
  readonly phoneNumber?: string;
  readonly dateOfBirth?: string;
  readonly avatarUrl?: string | null;
};
