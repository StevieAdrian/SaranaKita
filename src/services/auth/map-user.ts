import { USER_ROLES, type AuthUser } from './types';

export type ApiUser = Omit<AuthUser, 'role'> & { readonly role?: string | null };

export function toAuthUser(user: ApiUser): AuthUser {
  const role = USER_ROLES.find(known => known === user.role) ?? null;
  return { id: user.id, email: user.email, displayName: user.displayName, role };
}
