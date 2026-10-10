import {
  ApiError,
  apiClient,
  setAccessTokenProvider,
  setUnauthorizedHandler,
} from '@/services/api';
import { clearTokens, loadTokens, saveTokens } from './storage';
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
  readonly user: AuthUser;
};

async function applySession(response: SessionResponse): Promise<void> {
  tokens = response.tokens;
  await saveTokens(response.tokens);
  setState({ status: 'authenticated', user: response.user });
}

async function signIn(credentials: SignInCredentials): Promise<AuthUser> {
  const response = await apiClient.post<SessionResponse>(
    '/auth/sign-in',
    credentials,
    { skipAuth: true },
  );
  await applySession(response);
  return response.user;
}

async function signOut(): Promise<void> {
  tokens = null;
  await clearTokens();
  setState({ status: 'unauthenticated', user: null });
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

type MeResponse = { readonly user: AuthUser };

async function restore(): Promise<void> {
  const stored = await loadTokens();
  if (!stored) {
    setState({ status: 'unauthenticated', user: null });
    return;
  }
  tokens = stored;
  try {
    const response = await apiClient.get<MeResponse>('/auth/me');
    setState({ status: 'authenticated', user: response.user });
  } catch {
    tokens = null;
    await clearTokens();
    setState({ status: 'unauthenticated', user: null });
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

export const authClient = {
  signIn,
  signOut,
  refresh,
  restore,
  getState,
  getAccessToken,
  subscribe,
};
