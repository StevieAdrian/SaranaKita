export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown, message?: string) {
    super(message ?? `Request failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network request failed') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor(message = 'Request timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
}

export function toUserMessage(error: unknown): string {
  if (error instanceof TimeoutError) {
    return 'The request took too long. Please try again.';
  }
  if (error instanceof NetworkError) {
    return 'No connection. Check your internet and try again.';
  }
  if (error instanceof ApiError) {
    const apiMessage = getApiMessage(error.body);
    if (apiMessage) {
      return apiMessage;
    }
    if (error.status === 401 || error.status === 403) {
      return 'Your session has expired. Please sign in again.';
    }
    if (error.status >= 500) {
      return 'Something went wrong on our side. Please try again later.';
    }
    return 'We could not complete that request.';
  }
  return 'An unexpected error occurred.';
}

function getApiMessage(body: unknown): string | null {
  if (typeof body !== 'object' || body === null || !('error' in body)) {
    return null;
  }
  const error = body.error;
  if (typeof error === 'string' && error.trim()) {
    return error;
  }
  if (typeof error !== 'object' || error === null || !('message' in error)) {
    return null;
  }
  const message = error.message;
  if (typeof message === 'string' && message.trim()) {
    return message;
  }
  if (Array.isArray(message)) {
    const messages = message.filter(
      (item): item is string => typeof item === 'string' && item.trim().length > 0,
    );
    return messages.length ? messages.join('\n') : null;
  }
  return null;
}
