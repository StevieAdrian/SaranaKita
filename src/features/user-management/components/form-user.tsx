import React, { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import addPhotoIcon from '@/assets/images/add-photo.png';
import dummyAvatar from '@/assets/images/base-pict.png';
import {
  Avatar,
  BaseCard,
  ConfirmationModal,
  FormField,
  Input,
  Select,
} from '@/shared/components/ui';
import { useRole } from '@/shared/context/theme-context';
import { radius, spacing } from '@/shared/theme';
import { USER_ROLE_OPTIONS, USER_STATUS_OPTIONS } from '../utils/constants';

export type UserFormData = {
  fullName: string;
  email: string;
  role: 'siswa' | 'guru' | 'staff' | 'administrator';
  classOrPosition: string;
  status: string;
  avatarUrl?: string | null;
};

export type FormUserProps = {
  mode: 'add' | 'edit';
  initialData?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => Promise<void>;
  loading?: boolean;
};

export function FormUser({
  mode,
  initialData,
  onSubmit,
  loading = false,
}: FormUserProps): React.JSX.Element {
  const { theme } = useRole();
  const isEdit = mode === 'edit';

  const [fullName, setFullName] = useState(initialData?.fullName ?? '');
  const [email, setEmail] = useState(initialData?.email ?? '');
  const [role, setRole] = useState<'siswa' | 'guru' | 'staff' | 'administrator'>(
    initialData?.role ?? 'siswa',
  );
  const [classOrPosition, setClassOrPosition] = useState(
    initialData?.classOrPosition ?? '',
  );
  const [status, setStatus] = useState(initialData?.status ?? 'active');
  const [avatarUrl] = useState<string | null>(initialData?.avatarUrl ?? null);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Nama lengkap wajib diisi.';
    if (!email.trim()) errs.email = 'Email wajib diisi.';
    if (!classOrPosition.trim()) {
      errs.classOrPosition = 'Kelas / Jabatan wajib diisi.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePressSubmit = () => {
    if (validate()) {
      setConfirmVisible(true);
    }
  };

  const handleConfirmSubmit = async () => {
    try {
      await onSubmit({
        fullName,
        email,
        role,
        classOrPosition,
        status,
        avatarUrl,
      });
      setConfirmVisible(false);
    } catch {
      Alert.alert('Gagal', 'Terjadi kesalahan saat memproses data pengguna.');
    }
  };

  const submitButtonText = isEdit ? 'Simpan Perubahan' : 'Tambahkan Pengguna';
  const modalTitle = isEdit ? 'Simpan Perubahan?' : 'Tambah Pengguna?';
  const modalMessage = isEdit
    ? 'Konfirmasi untuk menyimpan perubahan pengguna.'
    : 'Konfirmasi untuk menambahkan pengguna.';
  const modalConfirmText = isEdit ? 'Ya, Simpan' : 'Ya, Tambahkan';

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Upload Foto Profile */}
      <View style={styles.photoSection}>
        <Text style={[styles.photoLabel, { color: theme.textSecondary }]}>
          Foto Profile
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Unggah foto profil"
          style={[
            styles.photoCard,
            {
              backgroundColor: theme.surfaceInput,
              borderColor: theme.borderInput,
            },
          ]}
        >
          {avatarUrl ? (
            <Avatar uri={avatarUrl} size="lg" />
          ) : isEdit ? (
            <Avatar source={dummyAvatar} size="lg" />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Image
                source={addPhotoIcon}
                resizeMode="contain"
                style={styles.uploadIcon}
              />
              <Text style={[styles.uploadText, { color: theme.textSecondary }]}>
                Tambahkan Foto
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Form */}
      <BaseCard style={styles.formCard}>
        <FormField label="Nama Lengkap" required error={errors.fullName}>
          <Input
            value={fullName}
            onChangeText={setFullName}
            placeholder="Masukkan nama lengkap"
            hasError={Boolean(errors.fullName)}
          />
        </FormField>

        <FormField label="Email" required error={errors.email}>
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="nama@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            hasError={Boolean(errors.email)}
          />
        </FormField>

        <FormField label="Role" required>
          <Select
            value={role}
            options={USER_ROLE_OPTIONS}
            onChange={(val) =>
              setRole(val as 'siswa' | 'guru' | 'staff' | 'administrator')
            }
            placeholder="Pilih Role"
            sheetTitle="Pilih Role Pengguna"
          />
        </FormField>

        <FormField
          label="Kelas / Jabatan"
          required
          error={errors.classOrPosition}
        >
          <Input
            value={classOrPosition}
            onChangeText={setClassOrPosition}
            placeholder="Contoh: XII-B atau Guru Bahasa Indonesia"
            hasError={Boolean(errors.classOrPosition)}
          />
        </FormField>

        <FormField label="Status Akun" required>
          <Select
            value={status}
            options={USER_STATUS_OPTIONS}
            onChange={setStatus}
            placeholder="Pilih Status"
            sheetTitle="Pilih Status Akun"
          />
        </FormField>
      </BaseCard>

      {/* Button */}
      <Pressable
        onPress={handlePressSubmit}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel={submitButtonText}
        style={({ pressed }) => [
          styles.submitButton,
          { backgroundColor: theme.primary },
          pressed && styles.pressed,
        ]}
      >
        <Text style={[styles.submitText, { color: theme.onPrimary }]}>
          {submitButtonText}
        </Text>
      </Pressable>

      <ConfirmationModal
        visible={confirmVisible}
        title={modalTitle}
        message={modalMessage}
        confirmLabel={modalConfirmText}
        cancelLabel="Batal"
        loading={loading}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setConfirmVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  photoLabel: {
    fontSize: 13,
    marginBottom: spacing.xs,
  },
  photoCard: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  uploadPlaceholder: {
    alignItems: 'center',
    gap: 4,
  },
  uploadIcon: {
    width: 24,
    height: 24,
  },
  uploadText: {
    fontSize: 10,
    textAlign: 'center',
  },
  formCard: {
    gap: spacing.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  submitButton: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  submitText: {
    fontSize: 15,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
  },
});
