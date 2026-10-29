import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import {
  USERNAME_CHARS_RE,
  validateEmailValue,
  validatePhoneValue,
  validateUsernameValue,
} from '@/features/auth/utils/validation';
import { ClassSelectField, DateOfBirthField, GenderRadioField, UsernameInput, type PickedPhoto } from '@/features/auth/components';
import type { Gender, UsernameStatus } from '@/features/auth/types';
import { toUserMessage } from '@/services/api';
import { authClient } from '@/services/auth';
import { uploadAvatarImage } from '@/services/upload';
import { BaseCard, BottomSheet, ConfirmationModal, FormField, Input, Toast } from '@/shared/components/ui';
import { useRole } from '@/shared/context/theme-context';
import { spacing } from '@/shared/theme';
import { getDefaultDateOfBirth, toIsoDate } from '@/shared/utils/date';
import { DEFAULT_USER_PASSWORD, ROLE_OPTIONS_DATA, STATUS_OPTIONS_DATA, userFonts } from '../utils/constants';
import { SelectOptionCard } from './select-option-card';
import addPhotoIcon from '@/assets/images/add-photo.png';
import leftArrow from '@/assets/images/left-arrow.png';
import maleDefault from '@/assets/images/male-default.png';
import vectorEdit from '@/assets/images/vector-edit.png';
import womanDefault from '@/assets/images/woman-default.png';

export type UserFormData = {
  username?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email: string;
  role: 'siswa' | 'guru' | 'staff';
  classOrPosition: string;
  status: string;
  isActive?: boolean;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: Gender | null;
  avatarUrl?: string | null;
};

export type FormUserProps = {
  mode: 'add' | 'edit';
  initialData?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => Promise<void>;
  loading?: boolean;
};

const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;

function parseInitialDob(dateStr?: string | null): Date {
  const defaultDob = getDefaultDateOfBirth();
  if (!dateStr) return defaultDob;
  const parsed = new Date(dateStr);
  return Number.isNaN(parsed.getTime()) ? defaultDob : parsed;
}

function parseInitialGender(g?: string | null): Gender {
  if (!g) return 'Laki-Laki';
  const lower = g.trim().toLowerCase();
  return lower === 'female' || lower === 'perempuan' ? 'Perempuan' : 'Laki-Laki';
}

export function FormUser({
  mode,
  initialData,
  onSubmit,
  loading = false,
}: FormUserProps): React.JSX.Element {
  const { theme } = useRole();
  const isEdit = mode === 'edit';

  const initialNameParts = (initialData?.fullName ?? '').trim().split(/\s+/);
  const defaultFirst =
    initialData?.firstName ?? initialNameParts[0] ?? '';
  const defaultLast =
    initialData?.lastName ??
    (initialNameParts.length > 1 ? initialNameParts.slice(1).join(' ') : '');

  const initialFirst = defaultFirst.trim();
  const initialLast = defaultLast.trim();
  const initialPhone = (initialData?.phone ?? '').trim();
  const initialDobStr = initialData?.dateOfBirth
    ? toIsoDate(parseInitialDob(initialData.dateOfBirth))
    : toIsoDate(getDefaultDateOfBirth());
  const initialGender = parseInitialGender(initialData?.gender);
  const initialRole =
    initialData?.role && initialData.role !== ('administrator' as any)
      ? (initialData.role as 'siswa' | 'guru' | 'staff')
      : isEdit
        ? 'siswa'
        : '';
  const initialClassOrPosition = (initialData?.classOrPosition ?? '').trim();
  const initialStatus =
    initialData?.status ??
    (initialData?.isActive === false ? 'inactive' : 'active');
  const initialAvatar = initialData?.avatarUrl ?? null;

  const [username, setUsername] = useState<string>(
    initialData?.username ??
    (initialData?.email ? initialData.email.split('@')[0] : '') ??
    '',
  );
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>(
    initialData?.username ? 'available' : 'idle',
  );
  const [firstName, setFirstName] = useState(defaultFirst);
  const [lastName, setLastName] = useState(defaultLast);
  const [email, setEmail] = useState(initialData?.email ?? '');
  const [password] = useState('');
  const [phone, setPhone] = useState(initialData?.phone ?? '');
  const [dateOfBirth, setDateOfBirth] = useState<Date>(
    parseInitialDob(initialData?.dateOfBirth),
  );
  const [role, setRole] = useState<'siswa' | 'guru' | 'staff' | ''>(
    initialData?.role && initialData.role !== ('administrator' as any)
      ? (initialData.role as 'siswa' | 'guru' | 'staff')
      : isEdit
        ? 'siswa'
        : '',
  );
  const [classOrPosition, setClassOrPosition] = useState(
    initialData?.classOrPosition ?? '',
  );
  const [gender, setGender] = useState<Gender>(
    parseInitialGender(initialData?.gender),
  );
  const [status, setStatus] = useState<string>(
    initialData?.status ??
    (initialData?.isActive === false ? 'inactive' : 'active'),
  );
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(
    initialData?.avatarUrl ?? null,
  );
  const [pickedPhoto, setPickedPhoto] = useState<PickedPhoto | null>(null);

  useEffect(() => {
    if (!isEdit || loading) return;
    if (initialData) {
      setFirstName(defaultFirst);
      setLastName(defaultLast);
      if (initialData.username) setUsername(initialData.username);
      if (initialData.email) setEmail(initialData.email);
      if (initialData.phone !== undefined) setPhone(initialData.phone ?? '');
      if (initialData.dateOfBirth) {
        setDateOfBirth(parseInitialDob(initialData.dateOfBirth));
      }
      if (initialData.role && initialData.role !== ('administrator' as any)) {
        setRole(initialData.role as 'siswa' | 'guru' | 'staff');
      }
      if (initialData.classOrPosition !== undefined) {
        setClassOrPosition(initialData.classOrPosition ?? '');
      }
      if (initialData.gender) setGender(parseInitialGender(initialData.gender));
      if (initialData.status !== undefined || initialData.isActive !== undefined) {
        setStatus(
          initialData.status ??
          (initialData.isActive === false ? 'inactive' : 'active'),
        );
      }
      if (initialData.avatarUrl !== undefined) {
        setCurrentAvatarUrl(initialData.avatarUrl ?? null);
      }
    }
  }, [
    isEdit,
    defaultFirst,
    defaultLast,
    initialData?.email,
    initialData?.username,
    initialData?.phone,
    initialData?.dateOfBirth,
    initialData?.role,
    initialData?.classOrPosition,
    initialData?.gender,
    initialData?.status,
    initialData?.isActive,
    initialData?.avatarUrl,
    loading,
  ]);

  const currentDobStr = toIsoDate(dateOfBirth);
  const hasAvatarChanged =
    pickedPhoto !== null || (currentAvatarUrl ?? null) !== initialAvatar;

  const isDirty =
    firstName.trim() !== initialFirst ||
    lastName.trim() !== initialLast ||
    phone.trim() !== initialPhone ||
    currentDobStr !== initialDobStr ||
    gender !== initialGender ||
    role !== initialRole ||
    classOrPosition.trim() !== initialClassOrPosition ||
    status !== initialStatus ||
    hasAvatarChanged;

  const [roleSheetVisible, setRoleSheetVisible] = useState(false);
  const [statusSheetVisible, setStatusSheetVisible] = useState(false);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    visible: false,
    message: '',
    type: 'success',
  });

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isEdit) return;

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

    const lowerUsername = username.toLowerCase();

    if (
      isEdit &&
      initialData?.username &&
      lowerUsername === initialData.username.trim().toLowerCase()
    ) {
      setUsernameStatus('available');
      return;
    }

    setUsernameStatus('checking');

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const res = await authClient.checkUsername(lowerUsername);
        if (res.available) {
          setUsernameStatus('available');
          setErrors((prev) => {
            const copy = { ...prev };
            delete copy.username;
            return copy;
          });
        } else {
          setUsernameStatus('taken');
          setErrors((prev) => ({
            ...prev,
            username: 'Username sudah digunakan.',
          }));
        }
      } catch (err) {
        console.warn('[form-user] checkUsername error:', err);
        setUsernameStatus('idle');
      }
    }, 450);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [username, isEdit, initialData?.username]);

  const handlePickPhoto = async () => {
    if (loading) return;
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.8,
      });

      if (result.didCancel) return;

      if (result.errorCode) {
        setToast({
          visible: true,
          message: result.errorMessage ?? 'Gagal memilih foto. Silakan coba lagi.',
          type: 'error',
        });
        return;
      }

      const asset = result.assets?.[0];
      if (!asset?.uri) return;

      if (asset.fileSize && asset.fileSize > MAX_PHOTO_SIZE_BYTES) {
        setToast({
          visible: true,
          message: 'Ukuran foto maksimal adalah 5 MB.',
          type: 'error',
        });
        return;
      }

      setPickedPhoto({
        uri: asset.uri,
        fileName: asset.fileName,
        type: asset.type,
        fileSize: asset.fileSize,
      });
    } catch {
      setToast({
        visible: true,
        message: 'Terjadi kesalahan saat membuka galeri.',
        type: 'error',
      });
    }
  };

  const handleRemovePhoto = () => {
    setPickedPhoto(null);
    setCurrentAvatarUrl(null);
  };

  const getJabatanPlaceholder = (): string => {
    if (role === 'guru') return 'Guru Bahasa Indonesia';
    if (role === 'staff') return 'Staff Sarana dan Prasarana';
    return 'Contoh: Guru Bahasa Indonesia';
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    const cleanFirst = firstName.trim();
    if (!cleanFirst) {
      errs.firstName = 'Nama depan wajib diisi.';
    }

    if (!isEdit) {
      const usernameError = validateUsernameValue(username);
      if (usernameError) {
        errs.username = usernameError;
      } else if (usernameStatus === 'taken') {
        errs.username = 'Username sudah digunakan.';
      } else if (usernameStatus === 'invalid') {
        errs.username = errors.username || 'Username tidak valid.';
      }
    }

    if (!isEdit) {
      const emailError = validateEmailValue(email);
      if (emailError) {
        errs.email = emailError;
      }
    }

    const phoneError = validatePhoneValue(phone, false);
    if (phoneError) {
      errs.phone = phoneError;
    }

    if (!role) {
      errs.role = 'Role wajib dipilih.';
    }
    if (!classOrPosition.trim()) {
      errs.classOrPosition =
        !role
          ? 'Pilih Role terlebih dahulu.'
          : role === 'siswa'
            ? 'Kelas wajib dipilih.'
            : 'Jabatan wajib diisi.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePressSubmit = async () => {
    if (!validate()) {
      return;
    }

    if (!isEdit) {
      const cleanUsername = username.trim().toLowerCase();
      try {
        const userCheck = await authClient.checkUsername(cleanUsername);
        if (!userCheck.available) {
          setUsernameStatus('taken');
          setErrors((prev) => ({
            ...prev,
            username: 'Username sudah digunakan.',
          }));
          setToast({
            visible: true,
            message: 'Username sudah digunakan.',
            type: 'error',
          });
          return;
        }
      } catch (err) {
        console.warn('[form-user] submit username check error:', err);
      }

      const cleanEmail = email.trim().toLowerCase();
      try {
        const checkRes = await authClient.checkEmail(cleanEmail);
        if (!checkRes.available) {
          setErrors((prev) => ({
            ...prev,
            email: 'Email sudah terdaftar.',
          }));
          setToast({
            visible: true,
            message: 'Email sudah terdaftar.',
            type: 'error',
          });
          return;
        }
      } catch { }
    }

    setConfirmVisible(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      let finalAvatarUrl = currentAvatarUrl;
      if (pickedPhoto) {
        try {
          const uploaded = await uploadAvatarImage(
            pickedPhoto,
            username.trim() || email.trim(),
          );
          finalAvatarUrl = uploaded.url;
        } catch { }
      }

      const combinedFullName = lastName.trim()
        ? `${firstName.trim()} ${lastName.trim()}`
        : firstName.trim();
      const isActive = status === 'active';

      await onSubmit({
        username: username.trim().toLowerCase(),
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        fullName: combinedFullName,
        email: email.trim().toLowerCase(),
        password: password ? password : (isEdit ? undefined : DEFAULT_USER_PASSWORD),
        phone: phone.trim() || undefined,
        dateOfBirth: toIsoDate(dateOfBirth),
        role: (role || 'siswa') as 'siswa' | 'guru' | 'staff',
        classOrPosition: classOrPosition.trim(),
        gender,
        status,
        isActive,
        avatarUrl: finalAvatarUrl,
      });
      setConfirmVisible(false);
      setToast({
        visible: true,
        message: isEdit
          ? 'Data pengguna berhasil diperbarui.'
          : 'Pengguna berhasil ditambahkan.',
        type: 'success',
      });
    } catch (err: any) {
      setConfirmVisible(false);
      const message =
        toUserMessage(err) ||
        err?.message ||
        'Terjadi kesalahan saat memproses data pengguna.';
      setToast({
        visible: true,
        message,
        type: 'error',
      });
    }
  };

  const submitButtonText = isEdit ? 'Simpan Perubahan' : 'Tambahkan Pengguna';
  const modalTitle = isEdit ? 'Simpan Perubahan?' : 'Tambah Pengguna?';
  const modalMessage = isEdit
    ? 'Konfirmasi untuk menyimpan perubahan.'
    : 'Konfirmasi untuk menambahkan pengguna.';
  const modalConfirmText = isEdit ? 'Ya, Simpan' : 'Ya, Tambahkan';

  const photoUri = pickedPhoto?.uri || currentAvatarUrl;

  const selectedRoleOption = ROLE_OPTIONS_DATA.find((r) => r.value === role);
  const selectedStatusOption =
    STATUS_OPTIONS_DATA.find((s) => s.value === status) ??
    STATUS_OPTIONS_DATA[0]!;

  return (
    <View style={styles.wrapper}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onDismiss={() => setToast((prev) => ({ ...prev, visible: false }))}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {isEdit ? (
            <View style={styles.avatarSection}>
              <View style={styles.avatarWrapper}>
                <TouchableOpacity
                  onPress={handlePickPhoto}
                  disabled={loading}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Pilih Foto Profil"
                  style={styles.avatarFrame}
                >
                  {photoUri ? (
                    <Image
                      source={{ uri: photoUri }}
                      style={styles.avatarImage}
                      resizeMode="cover"
                      accessibilityRole="image"
                      accessibilityLabel="Foto Profil"
                    />
                  ) : (
                    <Image
                      source={
                        gender === 'Perempuan'
                          ? womanDefault
                          : maleDefault
                      }
                      style={styles.defaultAvatarImage}
                      resizeMode="contain"
                      accessibilityRole="image"
                      accessibilityLabel="Foto Profil"
                    />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handlePickPhoto}
                  disabled={loading}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Ganti foto profil"
                  style={styles.editBadge}
                >
                  <Image
                    source={vectorEdit}
                    resizeMode="contain"
                    style={styles.editIcon}
                    accessibilityElementsHidden
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          {/* Foto Profil */}
          <BaseCard style={styles.formCard}>
            {!isEdit ? (
              <View style={styles.photoContainer}>
                <Text style={styles.photoSectionTitle}>Foto Profil</Text>
                {photoUri ? (
                  <View style={styles.photoPreviewBox}>
                    <Image
                      source={{ uri: photoUri }}
                      style={styles.photoPreviewImage}
                      resizeMode="cover"
                    />
                    <View style={styles.photoOverlayActions}>
                      <TouchableOpacity
                        onPress={handlePickPhoto}
                        style={styles.photoActionBtn}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.photoActionText}>Ganti</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleRemovePhoto}
                        style={[styles.photoActionBtn, styles.photoDeleteBtn]}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.photoActionText}>Hapus</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={handlePickPhoto}
                    activeOpacity={0.7}
                    style={styles.photoUploadBox}
                    accessibilityRole="button"
                    accessibilityLabel="Tambahkan Foto Profil"
                  >
                    <Image
                      source={addPhotoIcon}
                      style={styles.photoAddIcon}
                      resizeMode="contain"
                    />
                    <Text style={styles.photoAddTitle}>Tambahkan Foto</Text>
                    <Text style={styles.photoAddSubtitle}>
                      Klik untuk memilih foto
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : null}

            {/* Name */}
            <View style={styles.gridRow}>
              <View style={styles.gridCol}>
                <FormField label="Nama Depan" required error={errors.firstName}>
                  <Input
                    value={firstName}
                    onChangeText={(text) => {
                      setFirstName(text);
                      if (errors.firstName) {
                        setErrors((prev) => {
                          const copy = { ...prev };
                          delete copy.firstName;
                          return copy;
                        });
                      }
                    }}
                    placeholder="John"
                    hasError={Boolean(errors.firstName)}
                    autoCapitalize="words"
                  />
                </FormField>
              </View>
              <View style={styles.gridCol}>
                <FormField label="Nama Belakang" error={errors.lastName}>
                  <Input
                    value={lastName}
                    onChangeText={(text) => {
                      setLastName(text);
                      if (errors.lastName) {
                        setErrors((prev) => {
                          const copy = { ...prev };
                          delete copy.lastName;
                          return copy;
                        });
                      }
                    }}
                    placeholder="Doe"
                    hasError={Boolean(errors.lastName)}
                    autoCapitalize="words"
                  />
                </FormField>
              </View>
            </View>

            {/* Username */}
            {isEdit ? (
              <FormField label="Username">
                <Input
                  value={username}
                  editable={false}
                  placeholder="SaranaKita"
                  accessibilityState={{ disabled: true }}
                />
              </FormField>
            ) : (
              <FormField label="Username" required error={errors.username}>
                <UsernameInput
                  hideLabel
                  value={username}
                  onChangeText={(text) => {
                    setUsername(text);
                    if (errors.username) {
                      setErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.username;
                        return copy;
                      });
                    }
                  }}
                  status={usernameStatus}
                  placeholder="SaranaKita"
                  wrapperStyle={styles.usernameInputWrapper}
                />
              </FormField>
            )}

            {/* Email */}
            {isEdit ? (
              <FormField label="Email">
                <Input
                  value={email}
                  editable={false}
                  placeholder="johndoe@gmail.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  accessibilityState={{ disabled: true }}
                />
              </FormField>
            ) : (
              <FormField label="Email" required error={errors.email}>
                <Input
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) {
                      setErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.email;
                        return copy;
                      });
                    }
                  }}
                  placeholder="johndoe@gmail.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  hasError={Boolean(errors.email)}
                />
              </FormField>
            )}

            {/* Nomor Telepon */}
            <FormField label="Nomor Telepon" error={errors.phone}>
              <Input
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  if (errors.phone) {
                    setErrors((prev) => {
                      const copy = { ...prev };
                      delete copy.phone;
                      return copy;
                    });
                  }
                }}
                placeholder="08xxxxxxxxxx"
                keyboardType="phone-pad"
                hasError={Boolean(errors.phone)}
              />
            </FormField>

            {/* Tanggal Lahir */}
            <FormField label="Tanggal Lahir" error={errors.dateOfBirth}>
              <DateOfBirthField
                hideLabel
                value={dateOfBirth}
                onChange={setDateOfBirth}
                required={false}
              />
            </FormField>

            {/* Jenis Kelamin */}
            <FormField label="Jenis Kelamin" error={errors.gender}>
              <GenderRadioField
                hideLabel
                value={gender}
                onChange={(val) => setGender(val)}
                required={false}
              />
            </FormField>

            {/* Role */}
            <FormField label="Role" required error={errors.role}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setRoleSheetVisible(true)}
                accessibilityRole="button"
                accessibilityLabel="Pilih Role"
                style={[
                  styles.selectTriggerBox,
                  Boolean(errors.role) && styles.inputErrorBorder,
                ]}
              >
                <View style={styles.triggerValueRow}>
                  {selectedRoleOption ? (
                    <>
                      <View
                        style={[
                          styles.triggerDot,
                          { backgroundColor: selectedRoleOption.dotColor },
                        ]}
                      />
                      <Text style={styles.triggerTextSelected}>
                        {selectedRoleOption.label}
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.triggerPlaceholderText}>
                      Pilih Peran
                    </Text>
                  )}
                </View>
                <Image
                  source={leftArrow}
                  resizeMode="contain"
                  style={styles.chevronIcon}
                />
              </TouchableOpacity>
            </FormField>

            {/* Kelas / Jabatan */}
            {!role ? (
              <FormField
                label="Kelas / Jabatan"
                required
                error={errors.classOrPosition}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setToast({
                      visible: true,
                      message: 'Silakan pilih Role terlebih dahulu.',
                      type: 'error',
                    });
                  }}
                  style={[
                    styles.disabledInputBox,
                    Boolean(errors.classOrPosition) && styles.inputErrorBorder,
                  ]}
                >
                  <Text style={styles.disabledPlaceholderText}>
                    Pilih Role terlebih dahulu
                  </Text>
                </TouchableOpacity>
                <Text style={styles.disabledHelperText}>
                  Pilih Role terlebih dahulu untuk menentukan Kelas atau Jabatan
                </Text>
              </FormField>
            ) : role === 'siswa' ? (
              <FormField label="Kelas" required error={errors.classOrPosition}>
                <ClassSelectField
                  hideLabel
                  value={classOrPosition || null}
                  onChange={(val) => {
                    setClassOrPosition(val);
                    if (errors.classOrPosition) {
                      setErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.classOrPosition;
                        return copy;
                      });
                    }
                  }}
                  placeholder="Pilih kelas atau lokasi"
                  sheetTitle="Pilih Kelas Siswa"
                  primaryColor={theme.primary}
                />
              </FormField>
            ) : (
              <FormField
                label="Jabatan"
                required
                error={errors.classOrPosition}
              >
                <Input
                  value={classOrPosition}
                  onChangeText={(text) => {
                    setClassOrPosition(text);
                    if (errors.classOrPosition) {
                      setErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.classOrPosition;
                        return copy;
                      });
                    }
                  }}
                  placeholder={getJabatanPlaceholder()}
                  hasError={Boolean(errors.classOrPosition)}
                />
              </FormField>
            )}

            {/* Status */}
            <FormField label="Status Akun" required>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setStatusSheetVisible(true)}
                accessibilityRole="button"
                accessibilityLabel="Pilih Status Akun"
                style={styles.selectTriggerBox}
              >
                <View style={styles.triggerValueRow}>
                  <View
                    style={[
                      styles.triggerDot,
                      { backgroundColor: selectedStatusOption.dotColor },
                    ]}
                  />
                  <Text style={styles.triggerTextSelected}>
                    {selectedStatusOption.label}
                  </Text>
                </View>
                <Image
                  source={leftArrow}
                  resizeMode="contain"
                  style={styles.chevronIcon}
                />
              </TouchableOpacity>
            </FormField>
          </BaseCard>

          {/* Submit Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePressSubmit}
            disabled={isEdit ? (!isDirty || loading) : loading}
            accessibilityRole="button"
            accessibilityLabel={submitButtonText}
            style={[
              styles.submitButton,
              {
                backgroundColor: isEdit
                  ? isDirty
                    ? theme.primary
                    : theme.primarySoft
                  : theme.primary,
              },
              loading && styles.disabled,
            ]}
          >
            {loading ? (
              <ActivityIndicator color={theme.onPrimary} />
            ) : (
              <Text style={[styles.submitText, { color: theme.onPrimary }]}>
                {submitButtonText}
              </Text>
            )}
          </TouchableOpacity>

          <BottomSheet
            visible={roleSheetVisible}
            onClose={() => setRoleSheetVisible(false)}
            title="Pilih Role Pengguna"
          >
            <View style={styles.sheetOptionsList}>
              {ROLE_OPTIONS_DATA.map((item) => (
                <SelectOptionCard
                  key={item.value}
                  label={item.label}
                  description={item.description}
                  dotColor={item.dotColor}
                  selectedBg={item.selectedBg}
                  selectedBorder={item.selectedBorder}
                  radioColor={item.radioColor}
                  selectedTitleColor={item.selectedTitleColor}
                  isSelected={role === item.value}
                  onPress={() => {
                    const nextRole = item.value;
                    setRole(nextRole);
                    setRoleSheetVisible(false);
                    setErrors((prev) => {
                      const copy = { ...prev };
                      delete copy.role;
                      delete copy.classOrPosition;
                      return copy;
                    });
                    if (nextRole === 'siswa' && !classOrPosition.includes('-')) {
                      setClassOrPosition('');
                    } else if (nextRole !== 'siswa' && classOrPosition.includes('-')) {
                      setClassOrPosition('');
                    }
                  }}
                />
              ))}
            </View>
          </BottomSheet>

          <BottomSheet
            visible={statusSheetVisible}
            onClose={() => setStatusSheetVisible(false)}
            title="Pilih Status Akun"
          >
            <View style={styles.sheetOptionsList}>
              {STATUS_OPTIONS_DATA.map((item) => (
                <SelectOptionCard
                  key={item.value}
                  label={item.label}
                  description={item.description}
                  dotColor={item.dotColor}
                  selectedBg={item.selectedBg}
                  selectedBorder={item.selectedBorder}
                  radioColor={item.radioColor}
                  selectedTitleColor={item.selectedTitleColor}
                  isSelected={status === item.value}
                  onPress={() => {
                    setStatus(item.value);
                    setStatusSheetVisible(false);
                  }}
                />
              ))}
            </View>
          </BottomSheet>

          <ConfirmationModal
            visible={confirmVisible}
            variant="bottomSheet"
            title={modalTitle}
            message={modalMessage}
            confirmLabel={modalConfirmText}
            cancelLabel="Batal"
            loading={loading}
            onConfirm={handleConfirmSubmit}
            onCancel={() => setConfirmVisible(false)}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 48,
  },
  formCard: {
    gap: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  photoContainer: {
    width: '100%',
  },
  photoSectionTitle: {
    fontFamily: userFonts.medium,
    fontSize: 16,
    lineHeight: 22,
    color: '#171717',
    marginBottom: 8,
  },
  photoUploadBox: {
    width: '100%',
    height: 100,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#D4D4D4',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  photoAddIcon: {
    width: 36,
    height: 36,
    marginBottom: 4,
  },
  photoAddTitle: {
    fontFamily: userFonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: '#4B5563',
    textAlign: 'center',
  },
  photoAddSubtitle: {
    fontFamily: userFonts.regular,
    fontSize: 10,
    lineHeight: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  photoPreviewBox: {
    width: '100%',
    height: 104,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D4D4D4',
    position: 'relative',
  },
  photoPreviewImage: {
    width: '100%',
    height: '100%',
  },
  photoOverlayActions: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    gap: 8,
  },
  photoActionBtn: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  photoDeleteBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.85)',
  },
  photoActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: userFonts.medium,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  avatarWrapper: {
    position: 'relative',
    width: 148,
    height: 148,
  },
  avatarFrame: {
    width: 148,
    height: 148,
    borderRadius: 74,
    backgroundColor: '#D9D9D9',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  avatarImage: {
    width: 148,
    height: 148,
  },
  defaultAvatarImage: {
    width: 112,
    height: 113,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FDFDFD',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
    zIndex: 10,
  },
  editIcon: {
    width: 20,
    height: 20,
    tintColor: '#000000',
  },
  fieldBlock: {
    width: '100%',
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  gridCol: {
    flex: 1,
  },
  selectTriggerBox: {
    minHeight: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D4D4D4',
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  triggerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  triggerTextSelected: {
    fontFamily: userFonts.medium,
    fontSize: 14,
    color: '#171717',
  },
  triggerPlaceholderText: {
    fontFamily: userFonts.regular,
    fontSize: 14,
    color: '#737373',
  },
  chevronIcon: {
    width: 14,
    height: 14,
    tintColor: '#737373',
    transform: [{ rotate: '-90deg' }],
  },
  usernameInputWrapper: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D4D4D4',
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 16,
  },
  disabledInputBox: {
    minHeight: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D4D4D4',
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  inputErrorBorder: {
    borderColor: '#EF4444',
  },
  disabledPlaceholderText: {
    fontFamily: userFonts.regular,
    fontSize: 14,
    color: '#A3A3A3',
  },
  disabledHelperText: {
    fontFamily: userFonts.regular,
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  submitButton: {
    width: '100%',
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  submitText: {
    fontFamily: userFonts.semiBold,
    fontSize: 14,
  },
  disabled: {
    opacity: 0.6,
  },
  sheetOptionsList: {
    width: '100%',
    paddingBottom: 24,
    gap: 8,
  },
});
