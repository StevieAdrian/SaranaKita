export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown, message?: string) {
    const apiMessage = getApiMessage(body);
    super(message ?? apiMessage ?? `Request failed with status ${status}`);
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
    return 'Permintaan membutuhkan waktu terlalu lama. Silakan coba lagi.';
  }
  if (error instanceof NetworkError) {
    return 'Tidak ada koneksi internet. Silakan periksa jaringan Anda dan coba lagi.';
  }
  if (error instanceof ApiError) {
    const apiMessage = getApiMessage(error.body);
    if (apiMessage) {
      return translateApiMessage(apiMessage);
    }
    if (error.status === 401 || error.status === 403) {
      return 'Sesi Anda telah berakhir. Silakan login kembali.';
    }
    if (error.status >= 500) {
      return 'Terjadi kesalahan pada sistem kami. Silakan coba lagi nanti.';
    }
    return 'Gagal memproses permintaan.';
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const msg = (error as { message: unknown }).message;
    if (typeof msg === 'string' && msg.trim()) {
      return translateApiMessage(msg);
    }
  }
  if (typeof error === 'string' && error.trim()) {
    return translateApiMessage(error);
  }
  return 'Terjadi kesalahan yang tidak terduga.';
}

export function translateApiMessage(rawMessage: string): string {
  const lower = rawMessage.toLowerCase();

  if (
    lower.includes('email not confirmed') ||
    lower.includes('belum diverifikasi') ||
    lower.includes('belum dikonfirmasi')
  ) {
    return 'Email belum diverifikasi. Silakan masukkan kode OTP Anda.';
  }
  if (
    lower.includes('user already registered') ||
    lower.includes('already been registered') ||
    lower.includes('already exists') ||
    lower.includes('user with this email')
  ) {
    return 'Email sudah terdaftar. Silakan gunakan email lain atau masuk ke akun Anda.';
  }
  if (
    lower.includes('invalid email or password') ||
    lower.includes('invalid login credentials') ||
    lower.includes('invalid credentials')
  ) {
    return 'Email atau kata sandi tidak valid.';
  }
  if (
    lower.includes('password should be') ||
    lower.includes('weak password')
  ) {
    return 'Kata sandi minimal 8 karakter.';
  }
  if (
    lower.includes('rate limit') ||
    lower.includes('rate_limit') ||
    lower.includes('for security purposes') ||
    lower.includes('too many requests')
  ) {
    return 'Terlalu banyak permintaan. Silakan tunggu beberapa saat sebelum mencoba lagi.';
  }
  if (
    lower.includes('token has expired') ||
    lower.includes('token is expired') ||
    lower.includes('otp expired') ||
    lower.includes('otp has expired')
  ) {
    return 'Kode OTP telah kedaluwarsa. Silakan minta kode baru.';
  }
  if (
    lower.includes('invalid token') ||
    lower.includes('token is invalid') ||
    lower.includes('invalid otp') ||
    lower.includes('otp is invalid')
  ) {
    return 'Kode OTP tidak valid. Silakan periksa kembali kode Anda.';
  }
  if (lower.includes('user not found')) {
    return 'Akun tidak ditemukan.';
  }
  if (
    lower.includes('network request failed') ||
    lower.includes('failed to fetch') ||
    lower.includes('network error')
  ) {
    return 'Koneksi internet bermasalah. Silakan periksa jaringan Anda.';
  }
  if (
    lower.includes('invalid input syntax') ||
    lower.includes('type uuid') ||
    lower.includes('syntax error') ||
    lower.includes('relation') ||
    lower.includes('column') ||
    lower.includes('query failed')
  ) {
    return 'Format data yang dimasukkan tidak valid. Silakan periksa kembali.';
  }
  if (
    lower.includes('row-level security') ||
    lower.includes('violates') ||
    lower.includes('foreign key constraint') ||
    lower.includes('permission denied') ||
    lower.includes('internal server error') ||
    lower.includes('database error')
  ) {
    return 'Gagal memproses pendaftaran. Silakan coba beberapa saat lagi.';
  }
  if (
    lower.includes('duplicate key') ||
    lower.includes('unique constraint')
  ) {
    return 'Username atau email yang Anda masukkan sudah digunakan.';
  }
  if (lower === 'bad request') {
    return 'Permintaan tidak valid. Silakan periksa kembali formulir Anda.';
  }

  return rawMessage;
}

function getApiMessage(body: unknown): string | null {
  if (typeof body !== 'object' || body === null) {
    return null;
  }

  if ('message' in body) {
    const message = (body as { message: unknown }).message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
    if (Array.isArray(message)) {
      const messages = message.filter(
        (item): item is string => typeof item === 'string' && item.trim().length > 0,
      );
      if (messages.length > 0) {
        return messages.join('\n');
      }
    }
  }

  if ('error' in body) {
    const error = (body as { error: unknown }).error;
    if (typeof error === 'string' && error.trim()) {
      return error;
    }
    if (typeof error !== 'object' || error === null || !('message' in error)) {
      return null;
    }
    const message = (error as { message: unknown }).message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
    if (Array.isArray(message)) {
      const messages = message.filter(
        (item): item is string => typeof item === 'string' && item.trim().length > 0,
      );
      return messages.length ? messages.join('\n') : null;
    }
  }

  return null;
}
