import { Env } from '@/config/env';
import { supabase } from '@/services/auth';

let isConfigured = false;
let googleSigninModule: any = null;

function getGoogleSigninModule(): any {
  if (!googleSigninModule) {
    try {
      googleSigninModule = require('@react-native-google-signin/google-signin');
    } catch (err) {
      if (__DEV__) {
        console.warn(
          '[GoogleSignIn] Layanan Google Sign-In belum siap pada aplikasi:',
          err,
        );
      }
      throw new Error(
        'Fitur masuk dengan Google belum tersedia pada perangkat ini. Silakan refresh aplikasi.',
      );
    }
  }
  return googleSigninModule;
}

export const statusCodes = new Proxy(
  {},
  {
    get(_target, prop) {
      try {
        const mod = getGoogleSigninModule();
        return mod?.statusCodes?.[prop] ?? prop;
      } catch {
        return prop;
      }
    },
  },
) as any;

export function configureGoogleSignIn(): void {
  if (isConfigured) return;
  try {
    const webClientId = Env.googleWebClientId;
    if (webClientId) {
      const { GoogleSignin } = getGoogleSigninModule();
      GoogleSignin.configure({
        webClientId,
        offlineAccess: true,
      });
      isConfigured = true;
    }
  } catch (err) {
    if (__DEV__) {
      console.warn('[GoogleSignIn] Configuration error:', err);
    }
  }
}

export type GoogleLoginResult = {
  success: boolean;
  isProfileComplete?: boolean;
  email?: string;
  fullName?: string;
  message?: string;
};

export async function checkUserProfileComplete(
  userId: string,
  providedToken?: string,
): Promise<{
  isComplete: boolean;
  userData: any;
  profileData: any;
}> {
  try {
    let token = providedToken;
    if (!token) {
      try {
        const { data: sessData } = await supabase.auth.getSession();
        token = sessData?.session?.access_token;
      } catch { }
    }

    if (token) {
      try {
        const res = await fetch(`${Env.apiBaseUrl}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (res.ok) {
          const json = await res.json();
          const user = json?.data?.user;
          if (user && user.role) {
            return {
              isComplete: true,
              userData: user,
              profileData: user,
            };
          }
        } else if (res.status === 401 || res.status === 403) {
          const json = await res.json().catch(() => null);
          const msg =
            (typeof json?.error?.message === 'string'
              ? json.error.message
              : typeof json?.message === 'string'
                ? json.message
                : '') || '';
          if (
            msg.toLowerCase().includes('dinonaktifkan') ||
            msg.toLowerCase().includes('dihapus') ||
            msg.toLowerCase().includes('tidak aktif')
          ) {
            throw new Error(msg);
          }
        }
      } catch (apiErr: any) {
        if (
          apiErr?.message?.includes('dinonaktifkan') ||
          apiErr?.message?.includes('dihapus') ||
          apiErr?.message?.includes('tidak aktif')
        ) {
          throw apiErr;
        }
        if (__DEV__) {
          console.warn('[checkUserProfileComplete] Gagal memeriksa profil pengguna:', apiErr);
        }
      }
    }

    const { data: userData } = await supabase
      .from('user')
      .select('id, username, is_verified')
      .eq('id', userId)
      .maybeSingle();

    const { data: profileData } = await supabase
      .from('profile')
      .select('user_id, full_name')
      .eq('user_id', userId)
      .maybeSingle();

    const isComplete = Boolean(
      userData &&
      userData.username &&
      userData.is_verified === true &&
      profileData &&
      profileData.full_name
    );

    return { isComplete, userData, profileData };
  } catch (err: any) {
    if (
      err?.message?.includes('dinonaktifkan') ||
      err?.message?.includes('dihapus') ||
      err?.message?.includes('tidak aktif')
    ) {
      throw err;
    }
    return { isComplete: false, userData: null, profileData: null };
  }
}

export async function signInWithGoogle(): Promise<{
  authData: any;
  userEmail: string;
  userFullName: string;
}> {
  const { GoogleSignin } = getGoogleSigninModule();
  configureGoogleSignIn();

  const webClientId = Env.googleWebClientId;
  if (!webClientId) {
    throw new Error('Layanan masuk dengan Google belum dapat digunakan. Silakan coba lagi nanti.');
  }

  await GoogleSignin.hasPlayServices();
  const userInfo: any = await GoogleSignin.signIn();

  const idToken = userInfo?.data?.idToken || userInfo?.idToken;
  if (!idToken) {
    throw new Error('Gagal memperoleh ID token dari Google.');
  }

  const { data: authData, error: authError } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: idToken,
  });

  if (authError || !authData?.session || !authData?.user) {
    throw new Error(authError?.message || 'Gagal masuk dengan akun Google. Silakan coba lagi.');
  }

  const userEmail = authData.session.user.email || '';
  const meta = authData.session.user.user_metadata || {};
  const userFullName = meta.full_name || meta.name || userInfo?.data?.user?.name || userInfo?.user?.name || '';

  return { authData, userEmail, userFullName };
}
