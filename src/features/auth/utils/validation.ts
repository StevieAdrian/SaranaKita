import type { LoginFormErrors, LoginFormState, RegisterFormErrors, RegisterFormState } from '../types';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;
export const PHONE_RE = /^[0-9+-\s]{9,16}$/;

export function validateLoginForm(form: LoginFormState): LoginFormErrors {
  const errors: Record<string, string> = {};

  if (!form.email.trim()) {
    errors.email = 'Email wajib diisi.';
  } else if (!EMAIL_RE.test(form.email)) {
    errors.email = 'Format email tidak valid.';
  }

  if (!form.password) {
    errors.password = 'Kata sandi wajib diisi.';
  } else if (form.password.length < 8) {
    errors.password = 'Kata sandi minimal 8 karakter.';
  }

  return errors;
}

export function validateRegisterForm(form: RegisterFormState): RegisterFormErrors {
  const errors: Record<string, string> = {};

  const cleanUsername = form.username.trim();
  if (!cleanUsername) {
    errors.username = 'Username wajib diisi.';
  } else if (/\s/.test(form.username)) {
    errors.username = 'Username tidak boleh mengandung spasi.';
  } else if (cleanUsername.length < 3) {
    errors.username = 'Username minimal 3 karakter.';
  } else if (!USERNAME_RE.test(cleanUsername)) {
    errors.username = 'Username hanya boleh menggunakan huruf, angka, dan garis bawah (_).';
  }

  const cleanFirst = form.firstName.trim();
  if (!cleanFirst) {
    errors.firstName = 'First name wajib diisi.';
  }

  const cleanEmail = form.email.trim();
  if (!cleanEmail) {
    errors.email = 'Email wajib diisi.';
  } else if (!EMAIL_RE.test(cleanEmail)) {
    errors.email = 'Format email tidak valid.';
  }

  if (!form.password) {
    errors.password = 'Kata sandi wajib diisi.';
  } else if (form.password.length < 8) {
    errors.password = 'Kata sandi minimal 8 karakter.';
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Konfirmasi kata sandi wajib diisi.';
  } else if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'Konfirmasi kata sandi tidak cocok.';
  }

  const cleanPhone = form.phone.trim();
  if (!cleanPhone) {
    errors.phone = 'Nomor telepon wajib diisi.';
  } else if (!PHONE_RE.test(cleanPhone)) {
    errors.phone = 'Format nomor telepon tidak valid.';
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
