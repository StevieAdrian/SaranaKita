export type AuthTokens = {
  readonly accessToken: string;
  readonly refreshToken: string;
};

export const USER_ROLES = ['siswa', 'guru', 'staff', 'administrator'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type AuthUser = {
  readonly id: string;
  readonly email: string;
  readonly displayName: string;
  readonly role: UserRole | null;
};

export type AuthStatus = 'unknown' | 'authenticated' | 'unauthenticated';

export type AuthState = {
  readonly status: AuthStatus;
  readonly user: AuthUser | null;
};

export type SignInCredentials = {
  readonly email: string;
  readonly password: string;
};

export type AuthListener = (state: AuthState) => void;
