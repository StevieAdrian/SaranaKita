import { Env } from '@/config/env';
import { ApiError, NetworkError, TimeoutError } from './errors';

type TokenProvider = () => string | null;

let tokenProvider: TokenProvider = () => null;

export function setAccessTokenProvider(fn: TokenProvider): void {
  tokenProvider = fn;
}

export type RequestOptions = Omit<RequestInit, 'body'> & {
  json?: unknown;
  timeoutMs?: number;
  skipAuth?: boolean;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { json, timeoutMs = Env.apiTimeoutMs, skipAuth, headers, ...rest } = options;

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
  try {
    response = await fetch(`${Env.apiBaseUrl}${path}`, {
      ...rest,
      headers: finalHeaders,
      signal: controller.signal,
      body: json !== undefined ? JSON.stringify(json) : undefined,
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
    throw new ApiError(response.status, parsed);
  }

  return parsed as T;
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
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};
