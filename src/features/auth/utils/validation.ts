import type { LoginFormErrors, LoginFormState } from '../types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLoginForm(form: LoginFormState): LoginFormErrors {
  const errors: Record<string, string> = {};

  if (!form.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_RE.test(form.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!form.password) {
    errors.password = 'Password is required.';
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  return errors;
}

export function hasErrors(errors: LoginFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
