import type { AuthState } from '@/services/auth';

export type LoginFormState = {
  readonly email: string;
  readonly password: string;
};

export type LoginFormErrors = {
  readonly email?: string;
  readonly password?: string;
  readonly form?: string;
};

export type Session = AuthState;
