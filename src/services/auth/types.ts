export type AuthTokens = {
  readonly accessToken: string;
  readonly refreshToken: string;
};

export type AuthUser = {
  readonly id: string;
  readonly email: string;
  readonly displayName: string;
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
