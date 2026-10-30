import type { LoginFormErrors, LoginFormState, RegisterFormErrors, RegisterFormState } from '../types';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const USERNAME_CHARS_RE = /^[a-zA-Z0-9_]+$/;
export const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;
export const PHONE_RE = /^[0-9+-\s]{9,16}$/;

export function validateEmailValue(email: string): string | null {
  const clean = email.trim();
  if (!clean) {
    return 'Email wajib diisi.';
  }
  if (!EMAIL_RE.test(clean)) {
    return 'Format email tidak valid.';
  }
  return null;
}

export function validateUsernameValue(username: string): string | null {
  const clean = username.trim();
  if (!clean) {
    return 'Username wajib diisi.';
  }
  if (/\s/.test(username)) {
    return 'Username tidak boleh mengandung spasi.';
  }
  if (!USERNAME_CHARS_RE.test(clean)) {
    return 'Username hanya boleh menggunakan huruf, angka, dan garis bawah (_).';
  }
  if (clean.length < 3) {
    return 'Username minimal 3 karakter.';
  }
  if (clean.length > 20) {
    return 'Username maksimal 20 karakter.';
  }
  return null;
}

export function validatePhoneValue(phone: string, required = true): string | null {
  const clean = phone.trim();
  if (!clean) {
    return required ? 'Nomor telepon wajib diisi.' : null;
  }
  const digits = clean.replace(/\D/g, '');
  if (!PHONE_RE.test(clean) || digits.length < 9 || digits.length > 15) {
    return 'Format nomor telepon tidak valid (minimal 9 digit).';
  }
  return null;
}

export function validatePasswordValue(
  password: string,
  label = 'Kata sandi',
): string | null {
  if (!password || !password.trim()) {
    return `${label} wajib diisi.`;
  }
  if (password.length < 8) {
    return `${label} minimal 8 karakter.`;
  }
  return null;
}

export function validateConfirmPasswordValue(
  password: string,
  confirmPassword: string,
  label = 'Konfirmasi kata sandi',
): string | null {
  if (!confirmPassword || !confirmPassword.trim()) {
    return `${label} wajib diisi.`;
  }
  if (confirmPassword !== password) {
    return 'Konfirmasi kata sandi tidak cocok.';
  }
  return null;
}

export function validateLoginForm(form: LoginFormState): LoginFormErrors {
  const errors: Record<string, string> = {};

  const emailError = validateEmailValue(form.email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePasswordValue(form.password, 'Kata sandi');
  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
}

export function validateRegisterForm(form: RegisterFormState): RegisterFormErrors {
  const errors: Record<string, string> = {};

  const usernameError = validateUsernameValue(form.username);
  if (usernameError) {
    errors.username = usernameError;
  }

  const cleanFirst = form.firstName.trim();
  if (!cleanFirst) {
    errors.firstName = 'Nama depan wajib diisi.';
  }

  const emailError = validateEmailValue(form.email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePasswordValue(form.password, 'Kata sandi');
  if (passwordError) {
    errors.password = passwordError;
  }

  const confirmPasswordError = validateConfirmPasswordValue(
    form.password,
    form.confirmPassword,
    'Konfirmasi kata sandi',
  );
  if (confirmPasswordError) {
    errors.confirmPassword = confirmPasswordError;
  }

  const phoneError = validatePhoneValue(form.phone, true);
  if (phoneError) {
    errors.phone = phoneError;
  }

  if (!form.classGrade) {
    errors.classGrade = 'Kelas wajib dipilih.';
  }

  if (!form.gender) {
    errors.gender = 'Jenis kelamin wajib dipilih.';
  }

  return errors;
}

export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some(Boolean);
}
