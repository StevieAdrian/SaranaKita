import { useSyncExternalStore } from 'react';
import { authClient, type AuthUser } from '@/services/auth';

export function useCurrentUser(): AuthUser | null {
  return useSyncExternalStore(authClient.subscribe, authClient.getState).user;
}
