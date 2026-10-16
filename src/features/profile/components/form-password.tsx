import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import {
  BaseCard,
  ConfirmationModal,
  FormField,
  Input,
} from '@/shared/components/ui';
import { useRole } from '@/shared/context/theme-context';
import { radius, spacing } from '@/shared/theme';

export type FormPasswordProps = {
  onSubmit: (currentPass: string, newPass: string) => Promise<void>;
  loading?: boolean;
};

export function FormPassword({
  onSubmit,
  loading = false,
}: FormPasswordProps): React.JSX.Element {
  const { theme } = useRole();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!currentPassword) {
      errs.currentPassword = 'Password sekarang wajib diisi.';
    }
    if (!newPassword) {
      errs.newPassword = 'Password baru wajib diisi.';
    } else if (newPassword.length < 6) {
      errs.newPassword = 'Password baru minimal 6 karakter.';
    }
    if (!confirmPassword) {
      errs.confirmPassword = 'Konfirmasi password baru wajib diisi.';
    } else if (confirmPassword !== newPassword) {
      errs.confirmPassword = 'Konfirmasi password tidak cocok.';
    }
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
      await onSubmit(currentPassword, newPassword);
      setConfirmVisible(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      Alert.alert('Sukses', 'Kata sandi berhasil diperbarui.');
    } catch {
      Alert.alert('Gagal', 'Kata sandi sekarang salah atau terjadi kendala.');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <BaseCard style={styles.formCard}>
        <FormField
          label="Password Sekarang"
          required
          error={errors.currentPassword}
        >
          <Input
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="••••••••••••"
            secureTextEntry
            hasError={Boolean(errors.currentPassword)}
          />
        </FormField>

        <FormField label="Password Baru" required error={errors.newPassword}>
          <Input
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="••••••••••••"
            secureTextEntry
            hasError={Boolean(errors.newPassword)}
          />
        </FormField>

        <FormField
          label="Konfirmasi Password Baru"
          required
          error={errors.confirmPassword}
        >
          <Input
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="••••••••••••"
            secureTextEntry
            hasError={Boolean(errors.confirmPassword)}
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
        title="Ubah Kata Sandi?"
        message="Pastikan kata sandi baru Anda sudah diingat dengan baik."
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
  formCard: {
    gap: spacing.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
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
