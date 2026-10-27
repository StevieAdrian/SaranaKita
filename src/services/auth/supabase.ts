import { Env } from '@/config/env';
import { translateApiMessage } from '@/services/api';

function getSupabaseUrl(): string {
  return Env.supabaseUrl;
}

function getSupabaseHeaders(): Record<string, string> {
  const key = Env.supabaseAnonKey;
  return {
    'Content-Type': 'application/json',
    apikey: key,
    Authorization: `Bearer ${key}`,
  };
}

export interface VerifyOtpParams {
  email: string;
  token: string;
  type: 'email' | 'signup' | 'magiclink' | 'recovery';
}

export interface ResendOtpParams {
  type: 'signup' | 'sms' | 'phone_change' | 'email_change';
  email: string;
}

export interface SupabaseAuthResponse {
  data: {
    session: any;
    user: any;
  };
  error: {
    message: string;
    status?: number;
  } | null;
}

export interface SupabaseClientLike {
  auth: {
    verifyOtp: (params: VerifyOtpParams) => Promise<SupabaseAuthResponse>;
    resend?: (params: ResendOtpParams) => Promise<SupabaseAuthResponse>;
    signInWithOtp?: (params: { email: string }) => Promise<SupabaseAuthResponse>;
  };
}

function resolveErrorMessage(rawMessage: unknown, fallbackMessage: string): string {
  if (typeof rawMessage === 'string' && rawMessage.trim()) {
    return translateApiMessage(rawMessage.trim());
  }
  return fallbackMessage;
}

function resolveCatchErrorMessage(err: any, fallbackMessage: string): string {
  if (err?.message && typeof err.message === 'string') {
    const lower = err.message.toLowerCase();
    if (
      lower.includes('network') ||
      lower.includes('fetch') ||
      lower.includes('abort') ||
      lower.includes('timeout')
    ) {
      return fallbackMessage;
    }
    return translateApiMessage(err.message);
  }
  return fallbackMessage;
}

export const supabase: SupabaseClientLike = (globalThis as any).supabase || {
  auth: {
    verifyOtp: async ({ email, token, type }: VerifyOtpParams): Promise<SupabaseAuthResponse> => {
      try {
        const response = await fetch(`${getSupabaseUrl()}/auth/v1/verify`, {
          method: 'POST',
          headers: getSupabaseHeaders(),
          body: JSON.stringify({
            type: type || 'email',
            email: email.trim().toLowerCase(),
            token: token.trim(),
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          const rawMessage =
            data.msg ||
            data.message ||
            data.error_description;
          const message = resolveErrorMessage(
            rawMessage,
            'Kode OTP salah atau telah kedaluwarsa.',
          );
          return {
            data: { session: null, user: null },
            error: {
              message,
              status: response.status,
            },
          };
        }

        const session = {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          expiresIn: data.expires_in,
          tokenType: data.token_type,
          user: data.user,
        };

        return {
          data: { session, user: data.user },
          error: null,
        };
      } catch (err: any) {
        return {
          data: { session: null, user: null },
          error: {
            message: resolveCatchErrorMessage(
              err,
              'Terjadi kesalahan koneksi saat verifikasi OTP.',
            ),
          },
        };
      }
    },

    resend: async ({ email, type }: ResendOtpParams): Promise<SupabaseAuthResponse> => {
      const cleanEmail = email.trim().toLowerCase();
      try {
        const response = await fetch(`${getSupabaseUrl()}/auth/v1/resend`, {
          method: 'POST',
          headers: getSupabaseHeaders(),
          body: JSON.stringify({
            type: type || 'signup',
            email: cleanEmail,
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          try {
            const backendRes = await fetch(`${Env.apiBaseUrl}/auth/resend-otp`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: cleanEmail }),
            });
            if (backendRes.ok) {
              return { data: { session: null, user: null }, error: null };
            }
          } catch { }

          const rawMessage =
            data.msg || data.message || data.error_description;
          const message = resolveErrorMessage(rawMessage, 'Gagal mengirim ulang OTP.');
          return {
            data: { session: null, user: null },
            error: {
              message,
              status: response.status,
            },
          };
        }

        return {
          data: { session: null, user: null },
          error: null,
        };
      } catch (err: any) {
        try {
          const backendRes = await fetch(`${Env.apiBaseUrl}/auth/resend-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: cleanEmail }),
          });
          if (backendRes.ok) {
            return { data: { session: null, user: null }, error: null };
          }
        } catch { }

        return {
          data: { session: null, user: null },
          error: {
            message: resolveCatchErrorMessage(
              err,
              'Terjadi kesalahan koneksi saat mengirim ulang OTP.',
            ),
          },
        };
      }
    },

    signInWithOtp: async ({ email }: { email: string }): Promise<SupabaseAuthResponse> => {
      try {
        const response = await fetch(`${getSupabaseUrl()}/auth/v1/otp`, {
          method: 'POST',
          headers: getSupabaseHeaders(),
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          const rawMessage =
            data.msg || data.message || data.error_description;
          const message = resolveErrorMessage(rawMessage, 'Gagal mengirim OTP.');
          return {
            data: { session: null, user: null },
            error: {
              message,
              status: response.status,
            },
          };
        }

        return {
          data: { session: null, user: null },
          error: null,
        };
      } catch (err: any) {
        return {
          data: { session: null, user: null },
          error: {
            message: resolveCatchErrorMessage(
              err,
              'Terjadi kesalahan koneksi saat mengirim OTP.',
            ),
          },
        };
      }
    },
  },
};
