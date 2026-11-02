import 'react-native-url-polyfill/auto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Env } from '@/config/env';

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

export type SupabaseClientLike = SupabaseClient;

const supabaseUrl = Env.supabaseUrl;
const supabaseAnonKey = Env.supabaseAnonKey;

export const supabase: SupabaseClient = (globalThis as any).supabase || createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  },
);
