import { useCallback, useEffect, useState } from 'react';
import { authClient } from '@/services/auth';
import { getFullProfile, type FullProfile } from '@/services/profile';

function createEmptyProfile(): FullProfile {
  const user = authClient.getState().user;
  return {
    id: user?.id ?? '',
    email: user?.email ?? '',
    fullName: user?.displayName || user?.email.split('@')[0] || '',
    role: user?.role ?? null,
    phone: '',
    birthDate: '',
    gender: '',
    avatarUrl: null,
    classOrPosition: '',
    schoolInfo: {
      name: '',
      address: '',
      npsn: '',
      principal: '',
      phone: '',
      accreditation: '',
    },
    stats: {
      reportsCreated: 0,
      votesCount: 0,
      recommendationsCount: 0,
      pendingConfirmation: 0,
      inReview: 0,
      inRepair: 0,
      rejected: 0,
      resolved: 0,
    },
  };
}

export function useProfileScreen() {
  const [profile, setProfile] = useState<FullProfile>(createEmptyProfile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFullProfile();
      setProfile(data);
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat profil pengguna.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { profile, loading, error, reload: load };
}
