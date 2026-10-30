import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { authClient } from '@/services/auth';
import { toUserMessage } from '@/services/api';
import { getDefaultDateOfBirth, toIsoDate } from '@/shared/utils/date';
import { hasErrors, USERNAME_CHARS_RE, validateRegisterForm } from '../utils/validation';
import type {
  Gender,
  RegisterFormErrors,
  RegisterFormState,
  RegisterRouteParams,
  UsernameStatus,
} from '../types';

export function useRegisterForm(routeParams?: RegisterRouteParams) {
  const navigation = useNavigation<any>();

  const isGoogleAuth = Boolean(routeParams?.isGoogleAuth);
  const initialEmail = routeParams?.email || '';
  const nameParts = (routeParams?.fullName || '').trim().split(/\s+/);
  const initialFirst = nameParts[0] || '';
  const initialLast = nameParts.slice(1).join(' ') || '';

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState(initialFirst);
  const [lastName, setLastName] = useState(initialLast);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date>(() => getDefaultDateOfBirth());
  const [classGrade, setClassGrade] = useState<string>('');
  const [gender, setGender] = useState<Gender | null>(null);

  useEffect(() => {
    if (routeParams?.email) {
      setEmail(routeParams.email);
    }
    if (routeParams?.fullName) {
      const parts = routeParams.fullName.trim().split(/\s+/);
      if (parts[0]) setFirstName(parts[0]);
      setLastName(parts.length > 1 ? parts.slice(1).join(' ') : '');
    }
  }, [routeParams?.email, routeParams?.fullName]);

  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle');
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!username) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      setUsernameStatus('idle');
      return;
    }

    if (/\s/.test(username)) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      setUsernameStatus('invalid');
      setErrors((prev) => ({
        ...prev,
        username: 'Username tidak boleh mengandung spasi.',
      }));
      return;
    }

    if (!USERNAME_CHARS_RE.test(username)) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      setUsernameStatus('invalid');
      setErrors((prev) => ({
        ...prev,
        username: 'Username hanya boleh menggunakan huruf, angka, dan garis bawah (_).',
      }));
      return;
    }

    if (username.length > 20) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      setUsernameStatus('invalid');
      setErrors((prev) => ({
        ...prev,
        username: 'Username maksimal 20 karakter.',
      }));
      return;
    }

    if (username.length < 3) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      setUsernameStatus('idle');
      return;
    }

    setErrors((prev) => {
      if (prev.username && prev.username !== 'Username sudah digunakan.') {
        const copy = { ...prev };
        delete copy.username;
        return copy;
      }
      return prev;
    });

    setUsernameStatus('checking');

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const res = await authClient.checkUsername(username.toLowerCase());
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
      if (usernameStatus !== 'available') {
        try {
          const usernameCheck = await authClient.checkUsername(username.trim().toLowerCase());
          if (!usernameCheck.available) {
            setUsernameStatus('taken');
            setErrors({ username: 'Username sudah digunakan.' });
            setSubmitting(false);
            return;
          }
          setUsernameStatus('available');
        } catch { }
      }

      if (!isGoogleAuth) {
        try {
          const emailCheck = await authClient.checkEmail(email.trim());
          if (!emailCheck.available) {
            setErrors({ email: 'Email sudah terdaftar. Silakan login.' });
            setSubmitting(false);
            return;
          }
        } catch { }
      }

      navigation.navigate('RegisterProfile', {
        isGoogleAuth,
        username: username.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone.trim(),
        dateOfBirth: toIsoDate(dateOfBirth),
        classGrade,
        gender,
      });
    } catch (err: any) {
      setErrors({ form: toUserMessage(err) });
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
    isGoogleAuth,
    navigation,
  ]);

  return {
    isGoogleAuth,
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
