import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { authClient } from '@/services/auth';
import { hasErrors, validateRegisterForm } from '../utils/validation';
import type {
  Gender,
  RegisterFormErrors,
  RegisterFormState,
  UsernameStatus,
} from '../types';

const INITIAL_DATE = new Date(2005, 1, 1);

export function useRegisterForm() {
  const navigation = useNavigation<any>();

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date>(INITIAL_DATE);
  const [classGrade, setClassGrade] = useState<string>('');
  const [gender, setGender] = useState<Gender>('Female');

  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle');
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const trimmed = username.trim();
    if (!trimmed || trimmed.length < 3) {
      setUsernameStatus('idle');
      return;
    }

    setUsernameStatus('checking');

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const res = await authClient.checkUsername(trimmed);
        if (res.available) {
          setUsernameStatus('available');
          setErrors((prev) => ({ ...prev, username: undefined }));
        } else {
          setUsernameStatus('taken');
          setErrors((prev) => ({ ...prev, username: 'Username sudah digunakan.' }));
        }
      } catch {
        setUsernameStatus('idle');
      }
    }, 450);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [username]);

  const submit = useCallback(async () => {
    const form: RegisterFormState = {
      username,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phone,
      dateOfBirth,
      classGrade,
      gender,
    };

    const validationErrors = validateRegisterForm(form);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    if (usernameStatus === 'taken') {
      setErrors((prev) => ({ ...prev, username: 'Username sudah digunakan.' }));
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      try {
        const emailCheck = await authClient.checkEmail(email.trim());
        if (!emailCheck.available) {
          setErrors({ email: 'Email sudah terdaftar. Silakan login.' });
          setSubmitting(false);
          return;
        }
      } catch { }

      navigation.navigate('RegisterProfile', {
        username: username.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone.trim(),
        dateOfBirth: dateOfBirth.toISOString().split('T')[0],
        classGrade,
        gender,
      });
    } catch (err: any) {
      setErrors({ form: err?.message ?? 'Gagal memproses pendaftaran.' });
    } finally {
      setSubmitting(false);
    }
  }, [
    username,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    phone,
    dateOfBirth,
    classGrade,
    gender,
    usernameStatus,
    navigation,
  ]);

  return {
    username,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    phone,
    dateOfBirth,
    classGrade,
    gender,
    usernameStatus,
    errors,
    submitting,
    setUsername,
    setFirstName,
    setLastName,
    setEmail,
    setPassword,
    setConfirmPassword,
    setPhone,
    setDateOfBirth,
    setClassGrade,
    setGender,
    submit,
  };
}
