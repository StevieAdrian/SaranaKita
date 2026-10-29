import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { authClient } from '@/services/auth';
import { ApiError, toUserMessage } from '@/services/api';
import type { LoginFormErrors } from '../types';
import { hasErrors, validateLoginForm } from '../utils/validation';

export type UseLoginForm = {
  readonly email: string;
  readonly password: string;
  readonly errors: LoginFormErrors;
  readonly submitting: boolean;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  submit: () => Promise<void>;
};

export function useLoginForm(): UseLoginForm {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const submit = useCallback(async () => {
    const nextErrors = validateLoginForm({ email, password });
    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await authClient.signIn({ email, password });
    } catch (error: any) {
      if (error instanceof ApiError) {
        const body: any = error.body;
        const msg = (error.message || '').toLowerCase();
        const bodyMsg = (
          typeof body?.error?.message === 'string'
            ? body.error.message
            : typeof body?.message === 'string'
              ? body.message
              : ''
        ).toLowerCase();
        const isPendingOtpVerification =
          body?.code === 'EMAIL_NOT_VERIFIED' ||
          body?.error === 'EMAIL_NOT_VERIFIED' ||
          body?.error?.code === 'EMAIL_NOT_VERIFIED' ||
          msg.includes('kode otp') ||
          msg.includes('email not confirmed') ||
          bodyMsg.includes('kode otp') ||
          bodyMsg.includes('email not confirmed');

        if (isPendingOtpVerification) {
          const targetEmail =
            body?.error?.email || body?.email || email.trim().toLowerCase();
          await authClient.resendOtp(targetEmail, 'signup').catch(() => { });
          navigation.navigate('OtpVerification', {
            email: targetEmail,
            mode: 'signup',
            from: 'login',
          });
          return;
        }
      }

      const userMsg = toUserMessage(error);
      const lowerMsg = userMsg.toLowerCase();
      const isAccountStatusError =
        lowerMsg.includes('dinonaktifkan') ||
        lowerMsg.includes('dihapus') ||
        lowerMsg.includes('tidak aktif') ||
        lowerMsg.includes('belum diverifikasi');

      const message =
        error instanceof ApiError && error.status === 401 && !isAccountStatusError
          ? 'Email atau kata sandi salah.'
          : userMsg;
      setPassword('');
      setErrors({ form: message });
    } finally {
      setSubmitting(false);
    }
  }, [email, password, navigation]);

  return {
    email,
    password,
    errors,
    submitting,
    setEmail,
    setPassword,
    submit,
  };
}
