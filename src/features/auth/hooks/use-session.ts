import { useEffect, useState } from 'react';
import { authClient } from '@/services/auth';
import type { Session } from '../types';

export function useSession(): Session {
  const [session, setSession] = useState<Session>(() => authClient.getState());

  useEffect(() => authClient.subscribe(setSession), []);

  return session;
}
