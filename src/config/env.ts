import { Platform } from 'react-native';
import {
  API_BASE_URL,
  API_HOST,
  API_PORT,
  NODE_ENV,
  PORT,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  GOOGLE_WEB_CLIENTID,
} from '@env';

export type AppEnvironment = 'development' | 'production' | 'test';

export type AppEnv = {
  readonly nodeEnv: AppEnvironment;
  readonly isProduction: boolean;
  readonly isDevelopment: boolean;
  readonly port: number;
  readonly apiBaseUrl: string;
  readonly apiTimeoutMs: number;
  readonly enableDevLogging: boolean;
  readonly supabaseUrl: string;
  readonly supabaseAnonKey: string;
  readonly googleWebClientId: string;
};

export function normalizeUrl(url: string): string {
  return url.trim().replace(/\/+$/, '');
}
export function resolveDevHost(customHost?: string): string {
  if (customHost && customHost.trim()) {
    return customHost.trim();
  }
  return Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
}

export function resolvePort(portValue?: string | number): number {
  const parsed = typeof portValue === 'number' ? portValue : parseInt(String(portValue || ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 3000;
}

export function resolveApiBaseUrl(params?: {
  apiBaseUrl?: string;
  host?: string;
  port?: number | string;
}): string {
  const customUrl = params?.apiBaseUrl?.trim();
  if (customUrl) {
    return normalizeUrl(customUrl);
  }

  const host = resolveDevHost(params?.host);
  const port = resolvePort(params?.port);
  return `http://${host}:${port}/api`;
}

const activeNodeEnv = (NODE_ENV?.trim().toLowerCase() as AppEnvironment) || (__DEV__ ? 'development' : 'production');
const activePort = resolvePort(PORT || API_PORT);
const activeApiBaseUrl = resolveApiBaseUrl({
  apiBaseUrl: API_BASE_URL,
  host: API_HOST,
  port: activePort,
});

export const Env: AppEnv = {
  nodeEnv: activeNodeEnv,
  isProduction: activeNodeEnv === 'production',
  isDevelopment: activeNodeEnv === 'development',
  port: activePort,
  apiBaseUrl: activeApiBaseUrl,
  apiTimeoutMs: 15_000,
  enableDevLogging: activeNodeEnv !== 'production' && __DEV__,
  supabaseUrl: (SUPABASE_URL ?? '').trim(),
  supabaseAnonKey: (SUPABASE_ANON_KEY ?? '').trim(),
  googleWebClientId: (GOOGLE_WEB_CLIENTID ?? '').trim(),
};
