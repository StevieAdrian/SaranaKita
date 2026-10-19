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

export type Gender = 'Male' | 'Female';

export type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

export type RegisterFormState = {
  readonly username: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
  readonly confirmPassword: string;
  readonly phone: string;
  readonly dateOfBirth: Date;
  readonly classGrade: string;
  readonly gender: Gender | null;
};

export type RegisterFormErrors = {
  readonly username?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly email?: string;
  readonly password?: string;
  readonly confirmPassword?: string;
  readonly phone?: string;
  readonly dateOfBirth?: string;
  readonly classGrade?: string;
  readonly gender?: string;
  readonly form?: string;
};

export type RegisterPayload = {
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phone: string;
  readonly dateOfBirth: string;
  readonly class: string;
  readonly gender: Gender;
  readonly avatarUrl?: string;
};

export type RegisterProfileRouteParams = {
  readonly username: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
  readonly phone: string;
  readonly dateOfBirth: string;
  readonly classGrade: string;
  readonly gender?: Gender | null;
};

export type Session = AuthState;
