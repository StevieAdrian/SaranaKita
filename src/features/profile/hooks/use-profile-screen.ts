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
      reportsRejected: 0,
      reportsVerified: 0,
      'Menunggu Verifikasi': 0,
      'Dalam Pemeriksaan': 0,
      'Dalam Perbaikan': 0,
      'Selesai': 0,
      'Ditolak': 0,
    },
  };
}

let cachedProfile: FullProfile | null = null;
const subscribers = new Set<(p: FullProfile) => void>();

export function notifyProfileUpdated(profile: FullProfile): void {
  cachedProfile = profile;
  subscribers.forEach((sub) => {
    try {
      sub(profile);
    } catch { }
  });
}

export async function reloadSharedProfile(): Promise<FullProfile | null> {
  try {
    const data = await getFullProfile();
    notifyProfileUpdated(data);
    return data;
  } catch {
    return null;
  }
}

export function useProfileScreen() {
  const [profile, setProfile] = useState<FullProfile>(() => cachedProfile ?? createEmptyProfile());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFullProfile();
      notifyProfileUpdated(data);
      setProfile(data);
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat profil pengguna.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const subscriber = (next: FullProfile) => {
      setProfile(next);
    };
    subscribers.add(subscriber);
    return () => {
      subscribers.delete(subscriber);
    };
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSetProfile = useCallback(
    (next: FullProfile | ((prev: FullProfile) => FullProfile)) => {
      setProfile((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next;
        notifyProfileUpdated(resolved);
        return resolved;
      });
    },
    [],
  );

  return { profile, setProfile: handleSetProfile, loading, error, reload: load };
}
