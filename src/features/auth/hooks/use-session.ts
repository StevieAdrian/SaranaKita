import { useSyncExternalStore } from 'react';
import { authClient } from '@/services/auth';
import type { Session } from '../types';

export function useSession(): Session {
  return useSyncExternalStore(authClient.subscribe, authClient.getState);
}
