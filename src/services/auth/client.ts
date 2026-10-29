import {
  ApiError,
  apiClient,
  setAccessTokenProvider,
  setUnauthorizedHandler,
} from '@/services/api';
import { clearTokens, loadCachedUser, loadTokens, saveCachedUser, saveTokens } from './storage';
import { supabase } from './supabase';
import { toAuthUser, type ApiUser } from './map-user';
import type {
  AuthListener,
  AuthState,
  AuthTokens,
  AuthUser,
  SignInCredentials,
} from './types';

let tokens: AuthTokens | null = null;
let state: AuthState = { status: 'unknown', user: null };
const listeners = new Set<AuthListener>();

setAccessTokenProvider(() => tokens?.accessToken ?? null);
setUnauthorizedHandler(refresh);

function setState(next: AuthState): void {
  state = next;
  for (const listener of listeners) {
    listener(state);
  }
}

type SessionResponse = {
  readonly tokens: AuthTokens;
  readonly user: ApiUser;
};

async function applySession(response: SessionResponse): Promise<AuthUser> {
  tokens = response.tokens;
  await saveTokens(response.tokens);
  const user = toAuthUser(response.user);
  await saveCachedUser(user);
  setState({ status: 'authenticated', user });
  return user;
}

async function signIn(credentials: SignInCredentials): Promise<AuthUser> {
  const response = await apiClient.post<SessionResponse>(
    '/auth/sign-in',
    credentials,
    { skipAuth: true },
  );
  return applySession(response);
}

async function applySupabaseSession(
  session: { access_token: string; refresh_token: string; user?: any },
  userOverride?: { id?: string; email?: string; username?: string; displayName?: string; role?: string | null },
): Promise<AuthUser> {
  const newTokens: AuthTokens = {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
  };
  tokens = newTokens;
  await saveTokens(newTokens);

  const rawUser = session.user || {};
  const user: ApiUser = {
    id: userOverride?.id || rawUser.id,
    email: userOverride?.email || rawUser.email || '',
    displayName:
      userOverride?.displayName ||
      userOverride?.username ||
      rawUser.user_metadata?.full_name ||
      rawUser.user_metadata?.name ||
      (rawUser.email ? rawUser.email.split('@')[0] : 'User'),
    role: userOverride?.role ?? rawUser.user_metadata?.role ?? 'siswa',
  };

  const authUser = toAuthUser(user);
  await saveCachedUser(authUser);
  setState({ status: 'authenticated', user: authUser });
  return authUser;
}

let isSigningOut = false;

async function signOut(): Promise<void> {
  if (isSigningOut) {
    return;
  }
  isSigningOut = true;

  tokens = null;
  setState({ status: 'unauthenticated', user: null });

  try {
    await clearTokens();
  } catch (err) {
    if (__DEV__) {
      console.warn('[signOut] Gagal menghapus token di keychain:', err);
    }
  }

  try {
    await Promise.race([
      Promise.allSettled([
        supabase.auth.signOut({ scope: 'local' }).catch(() => { }),
        (async () => {
          try {
            const mod = require('@react-native-google-signin/google-signin');
            await mod?.GoogleSignin?.signOut?.().catch?.(() => { });
          } catch { }
        })(),
      ]),
      new Promise<void>((resolve) => {
        const timer = setTimeout(() => resolve(), 1000);
        if (typeof (timer as any)?.unref === 'function') {
          (timer as any).unref();
        }
      }),
    ]);
  } catch { } finally {
    isSigningOut = false;
  }
}

async function refresh(): Promise<boolean> {
  const refreshToken = tokens?.refreshToken;
  if (!refreshToken) {
    return false;
  }
  try {
    const response = await apiClient.post<SessionResponse>(
      '/auth/refresh',
      { refreshToken },
      { skipAuth: true },
    );
    await applySession(response);
    return true;
  } catch (error) {
    if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
      await signOut();
    }
    return false;
  }
}

type MeResponse = { readonly user: ApiUser };

async function restore(): Promise<void> {
  const stored = await loadTokens();
  if (!stored) {
    setState({ status: 'unauthenticated', user: null });
    return;
  }
  tokens = stored;

  const cachedUser = await loadCachedUser();
  if (cachedUser) {
    setState({ status: 'authenticated', user: cachedUser });
  }

  try {
    const response = await apiClient.get<MeResponse>('/auth/me');
    const user = toAuthUser(response.user);
    await saveCachedUser(user);
    setState({ status: 'authenticated', user });
  } catch (err) {
    if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
      tokens = null;
      await clearTokens();
      setState({ status: 'unauthenticated', user: null });
    } else {
      if (__DEV__) {
        console.warn('[authClient.restore] Gagal verifikasi sesi karena kendala jaringan:', error);
      }
      if (cachedUser) {
        setState({ status: 'authenticated', user: cachedUser });
      }
    }
  }
}

function getState(): AuthState {
  return state;
}

function getAccessToken(): string | null {
  return tokens?.accessToken ?? null;
}

function subscribe(listener: AuthListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

async function checkUsername(username: string): Promise<{ available: boolean; username: string }> {
  return apiClient.get<{ available: boolean; username: string }>(
    `/auth/check-username?username=${encodeURIComponent(username)}`,
    { skipAuth: true },
  );
}

async function checkEmail(email: string): Promise<{ available: boolean; email: string }> {
  return apiClient.get<{ available: boolean; email: string }>(
    `/auth/check-email?email=${encodeURIComponent(email)}`,
    { skipAuth: true },
  );
}

async function register(payload: unknown): Promise<AuthUser> {
  const response = await apiClient.post<SessionResponse>(
    '/auth/register',
    payload,
    { skipAuth: true },
  );
  return applySession(response);
}

async function forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
  return apiClient.post<{ success: boolean; message: string }>(
    '/auth/forgot-password',
    { email },
    { skipAuth: true },
  );
}

async function resetPassword(payload: {
  email: string;
  newPassword: string;
}): Promise<{ success: boolean; message: string }> {
  return apiClient.post<{ success: boolean; message: string }>(
    '/auth/reset-password',
    payload,
    { skipAuth: true },
  );
}

async function resendOtp(
  email: string,
  type: 'signup' | 'recovery' = 'signup',
): Promise<{ success: boolean; message: string }> {
  return apiClient.post<{ success: boolean; message: string }>(
    '/auth/resend-otp',
    { email, type },
    { skipAuth: true },
  );
}

export type CompleteGoogleProfilePayload = {
  username: string;
  password: string;
  firstName: string;
  lastName?: string;
  phone: string;
  dateOfBirth: string;
  class: string;
  gender: string;
  avatarUrl?: string;
};

async function completeGoogleProfile(
  payload: CompleteGoogleProfilePayload,
): Promise<AuthUser> {
  const { data: sessData } = await supabase.auth.getSession();
  const session = sessData?.session;
  const token = session?.access_token || tokens?.accessToken;

  if (!token || !session) {
    throw new Error('Sesi akun Google tidak ditemukan. Silakan login kembali.');
  }

  const response = await apiClient.post<MeResponse & { tokens?: AuthTokens }>(
    '/auth/complete-google-profile',
    payload,
    {
      skipAuth: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const activeSession = response.tokens
    ? {
      access_token: response.tokens.accessToken,
      refresh_token: response.tokens.refreshToken,
      user: session.user,
    }
    : session;

  if (response.tokens) {
    await supabase.auth
      .setSession({
        access_token: response.tokens.accessToken,
        refresh_token: response.tokens.refreshToken,
      })
      .catch(() => { });
  }

  return applySupabaseSession(activeSession, {
    id: response.user.id,
    email: response.user.email,
    username: response.user.username,
    displayName: response.user.displayName,
    role: response.user.role || 'siswa',
  });
}

export const authClient = {
  signIn,
  signOut,
  refresh,
  restore,
  getState,
  getAccessToken,
  subscribe,
  checkUsername,
  checkEmail,
  register,
  forgotPassword,
  resetPassword,
  resendOtp,
  applySupabaseSession,
  completeGoogleProfile,
};
