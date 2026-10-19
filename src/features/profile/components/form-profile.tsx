import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import dummyAvatar from '@/assets/images/base-pict.png';
import vectorEdit from '@/assets/images/vector-edit.png';
import {
  Avatar,
  BaseCard,
  ConfirmationModal,
  DatePicker,
  FormField,
  Input,
  RadioGroup,
} from '@/shared/components/ui';
import { useRole } from '@/shared/context/theme-context';
import { radius, spacing } from '@/shared/theme';
import { GENDER_OPTIONS } from '../utils/constants';

export type ProfileFormData = {
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  avatarUrl?: string | null;
};

export type FormProfileProps = {
  initialData?: Partial<ProfileFormData>;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  loading?: boolean;
};

export function FormProfile({
  initialData,
  onSubmit,
  loading = false,
}: FormProfileProps): React.JSX.Element {
  const { theme } = useRole();

  const [fullName, setFullName] = useState(initialData?.fullName ?? '');
  const [email, setEmail] = useState(initialData?.email ?? '');
  const [phone, setPhone] = useState(initialData?.phone ?? '');
  const [birthDate, setBirthDate] = useState<Date>(
    initialData?.birthDate ? new Date(initialData.birthDate) : new Date(2005, 0, 1),
  );
  const [gender, setGender] = useState(initialData?.gender || 'Laki-Laki');
  const [avatarUrl] = useState<string | null>(initialData?.avatarUrl ?? null);

  useEffect(() => {
    if (initialData?.fullName) setFullName(initialData.fullName);
    if (initialData?.email) setEmail(initialData.email);
    if (initialData?.phone !== undefined) setPhone(initialData.phone);
    if (initialData?.birthDate) {
      const parsed = new Date(initialData.birthDate);
      if (!isNaN(parsed.getTime())) setBirthDate(parsed);
    }
    if (initialData?.gender) setGender(initialData.gender);
  }, [initialData]);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full Name wajib diisi.';
    if (!email.trim()) errs.email = 'Email wajib diisi.';
    if (!phone.trim()) errs.phone = 'Nomor Telepon wajib diisi.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePressSave = () => {
    if (validate()) {
      setConfirmVisible(true);
    }
  };

  const handleConfirmSave = async () => {
    try {
      await onSubmit({
        fullName,
        email,
        phone,
        birthDate: birthDate.toISOString(),
        gender,
        avatarUrl,
      });
      setConfirmVisible(false);
      Alert.alert('Sukses', 'Perubahan profil berhasil disimpan.');
    } catch {
      Alert.alert('Gagal', 'Terjadi kesalahan saat menyimpan profil.');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarWrapper}>
          <Avatar
            uri={avatarUrl}
            source={!avatarUrl ? dummyAvatar : undefined}
            name={fullName}
            size="xl"
            style={styles.avatar}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ganti foto profil"
            style={[styles.editBadge, { backgroundColor: theme.surface }]}
          >
            <Image
              source={vectorEdit}
              resizeMode="contain"
              style={[styles.editIcon, { tintColor: theme.textHeading }]}
            />
          </Pressable>
        </View>
      </View>

      {/* Form */}
      <BaseCard style={styles.formCard}>
        <FormField label="Full Name" required error={errors.fullName}>
          <Input
            value={fullName}
            onChangeText={setFullName}
            placeholder="Masukkan nama lengkap"
            autoCapitalize="words"
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

        <FormField label="Nomor Telepon" required error={errors.phone}>
          <Input
            value={phone}
            onChangeText={setPhone}
            placeholder="08xxxxxxxxxx"
            keyboardType="phone-pad"
            hasError={Boolean(errors.phone)}
          />
        </FormField>

        <FormField label="Tanggal Lahir" required>
          <DatePicker
            value={birthDate}
            onChange={setBirthDate}
          />
        </FormField>

        <FormField label="Gender" required>
          <RadioGroup
            options={GENDER_OPTIONS}
            value={gender}
            onChange={setGender}
            direction="horizontal"
          />
        </FormField>
      </BaseCard>

      {/* Submit Button */}
      <Pressable
        onPress={handlePressSave}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel="Simpan Perubahan"
        style={({ pressed }) => [
          styles.saveButton,
          { backgroundColor: theme.primarySoft },
          pressed && styles.pressed,
        ]}
      >
        <Text style={[styles.saveText, { color: theme.onPrimary }]}>
          Simpan Perubahan
        </Text>
      </Pressable>

      <ConfirmationModal
        visible={confirmVisible}
        title="Simpan Perubahan?"
        message="Pastikan data profil yang Anda masukkan sudah benar."
        confirmLabel="Ya, Simpan"
        cancelLabel="Batal"
        loading={loading}
        onConfirm={handleConfirmSave}
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    borderRadius: 46,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D4D4D4',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  editIcon: {
    width: 14,
    height: 14,
  },
  formCard: {
    gap: spacing.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  datePickerTrigger: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 15,
  },
  saveButton: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  saveText: {
    fontSize: 15,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
  },
});
