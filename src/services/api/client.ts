import { Env } from '@/config/env';
import { ApiError, NetworkError, TimeoutError } from './errors';

type TokenProvider = () => string | null;

let tokenProvider: TokenProvider = () => null;

export function setAccessTokenProvider(fn: TokenProvider): void {
  tokenProvider = fn;
}

type UnauthorizedHandler = () => Promise<boolean>;

let unauthorizedHandler: UnauthorizedHandler | null = null;
let inFlightRefresh: Promise<boolean> | null = null;

export function setUnauthorizedHandler(fn: UnauthorizedHandler | null): void {
  unauthorizedHandler = fn;
}

function refreshOnce(): Promise<boolean> {
  if (!unauthorizedHandler) {
    return Promise.resolve(false);
  }
  if (!inFlightRefresh) {
    inFlightRefresh = unauthorizedHandler()
      .catch(() => false)
      .finally(() => {
        inFlightRefresh = null;
      });
  }
  return inFlightRefresh;
}

export type RequestOptions = Omit<RequestInit, 'body'> & {
  json?: unknown;
  formData?: FormData;
  timeoutMs?: number;
  skipAuth?: boolean;
};

type InternalOptions = RequestOptions & { _retried?: boolean };

async function request<T>(path: string, options: InternalOptions = {}): Promise<T> {
  const {
    json,
    formData,
    timeoutMs = Env.apiTimeoutMs,
    skipAuth,
    headers,
    _retried,
    ...rest
  } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const finalHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(headers as Record<string, string> | undefined),
  };

  if (json !== undefined) {
    finalHeaders['Content-Type'] = 'application/json';
  }

  if (!skipAuth) {
    const token = tokenProvider();
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  let response: Response;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  try {
    response = await fetch(`${Env.apiBaseUrl}${normalizedPath}`, {
      ...rest,
      headers: finalHeaders,
      signal: controller.signal,
      body: formData ?? (json !== undefined ? JSON.stringify(json) : undefined),
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new TimeoutError();
    }
    throw new NetworkError();
  } finally {
    clearTimeout(timeout);
  }

  const raw = await response.text();
  const parsed: unknown = raw ? safeJsonParse(raw) : null;

  if (!response.ok) {
    if (response.status === 401 && !skipAuth && !_retried) {
      const refreshed = await refreshOnce();
      if (refreshed) {
        return request<T>(path, { ...options, _retried: true });
      }
    }
    throw new ApiError(response.status, parsed);
  }

  return unwrapEnvelope(parsed) as T;
}

function unwrapEnvelope(parsed: unknown): unknown {
  if (
    parsed !== null &&
    typeof parsed === 'object' &&
    'success' in parsed &&
    'data' in parsed
  ) {
    return (parsed as { data: unknown }).data;
  }
  return parsed;
}

function safeJsonParse(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, json?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', json }),
  put: <T>(path: string, json?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', json }),
  patch: <T>(path: string, json?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', json }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
  upload: <T>(path: string, formData: FormData, options?: RequestOptions) =>
    request<T>(path, { timeoutMs: 60_000, ...options, method: 'POST', formData }),
};
