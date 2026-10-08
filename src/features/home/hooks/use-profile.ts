import { useCallback, useEffect, useState } from 'react';
import { toUserMessage } from '@/services/api';
import { getProfile, type Profile } from '@/services/profile';

export type UseProfile = {
  readonly profile: Profile | null;
  readonly loading: boolean;
  readonly error: string | null;
  reload: () => Promise<void>;
};

export function useProfile(): UseProfile {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setProfile(await getProfile());
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload().catch(() => {});
  }, [reload]);

  return { profile, loading, error, reload };
}
