import type { LoginFormErrors, LoginFormState, RegisterFormErrors, RegisterFormState } from '../types';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;
export const PHONE_RE = /^[0-9+-\s]{9,16}$/;

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

export function validateRegisterForm(form: RegisterFormState): RegisterFormErrors {
  const errors: Record<string, string> = {};

  const cleanUsername = form.username.trim();
  if (!cleanUsername) {
    errors.username = 'Username is required.';
  } else if (cleanUsername.length < 3) {
    errors.username = 'Username must be at least 3 characters.';
  } else if (!USERNAME_RE.test(cleanUsername)) {
    errors.username = 'Only letters, numbers, and underscores allowed.';
  }

  if (!form.firstName.trim()) {
    errors.firstName = 'First name is required.';
  }

  if (!form.lastName.trim()) {
    errors.lastName = 'Last name is required.';
  }

  const cleanEmail = form.email.trim();
  if (!cleanEmail) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_RE.test(cleanEmail)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!form.password) {
    errors.password = 'Password is required.';
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Confirm your password.';
  } else if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  const cleanPhone = form.phone.trim();
  if (!cleanPhone) {
    errors.phone = 'Phone number is required.';
  } else if (!PHONE_RE.test(cleanPhone)) {
    errors.phone = 'Enter a valid phone number.';
  }

  if (!form.classGrade) {
    errors.classGrade = 'Class is required.';
  }

  if (!form.gender) {
    errors.gender = 'Gender is required.';
  }

  return errors;
}

export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some(Boolean);
}
