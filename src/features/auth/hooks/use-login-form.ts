import { useCallback, useState } from 'react';
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
    } catch (error) {
      const message =
        error instanceof ApiError && error.status === 401
          ? 'Email atau kata sandi salah.'
          : toUserMessage(error);
      setErrors({ form: message });
    } finally {
      setSubmitting(false);
    }
  }, [email, password]);

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
