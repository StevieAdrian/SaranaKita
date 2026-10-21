import React, { useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ConfirmationModal, Toast } from '@/shared/components/ui';
import { useRole } from '@/shared/context/theme-context';
import { spacing } from '@/shared/theme';
import { profileFonts } from '../utils/constants';

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
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    visible: false,
    message: '',
    type: 'success',
  });

  const isDirty = Boolean(
    currentPassword.trim() &&
    newPassword.trim() &&
    confirmPassword.trim(),
  );

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!currentPassword) {
      errs.currentPassword = 'Password sekarang wajib diisi.';
    }
    if (!newPassword) {
      errs.newPassword = 'Password baru wajib diisi.';
    } else if (newPassword.length < 8) {
      errs.newPassword = 'Password baru minimal 8 karakter.';
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
      setToast({
        visible: true,
        message: 'Kata sandi berhasil diperbarui.',
        type: 'success',
      });
    } catch {
      setConfirmVisible(false);
      setToast({
        visible: true,
        message: 'Kata sandi sekarang salah atau terjadi kendala.',
        type: 'error',
      });
    }
  };

  return (
    <View style={styles.root}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onDismiss={() => setToast((prev) => ({ ...prev, visible: false }))}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          {/* Password Sekarang */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Password Sekarang<Text style={styles.asterisk}>*</Text>
            </Text>
            <TextInput
              value={currentPassword}
              onChangeText={(text) => {
                setCurrentPassword(text);
                if (errors.currentPassword) {
                  setErrors((prev) => ({ ...prev, currentPassword: '' }));
                }
              }}
              placeholder="••••••••••"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              style={[
                styles.textInput,
                errors.currentPassword ? styles.textInputError : null,
              ]}
            />
            {errors.currentPassword ? (
              <Text style={styles.errorText}>{errors.currentPassword}</Text>
            ) : null}
          </View>

          {/* Password Baru */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Password Baru<Text style={styles.asterisk}>*</Text>
            </Text>
            <TextInput
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                if (errors.newPassword) {
                  setErrors((prev) => ({ ...prev, newPassword: '' }));
                }
              }}
              placeholder="••••••••••"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              style={[
                styles.textInput,
                errors.newPassword ? styles.textInputError : null,
              ]}
            />
            {errors.newPassword ? (
              <Text style={styles.errorText}>{errors.newPassword}</Text>
            ) : null}
          </View>

          {/* Konfirmasi Password Baru */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Konfirmasi Password Baru<Text style={styles.asterisk}>*</Text>
            </Text>
            <TextInput
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) {
                  setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }
              }}
              placeholder="••••••••••"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              style={[
                styles.textInput,
                errors.confirmPassword ? styles.textInputError : null,
              ]}
            />
            {errors.confirmPassword ? (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            ) : null}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePressSave}
            disabled={!isDirty || loading}
            accessibilityRole="button"
            accessibilityLabel="Simpan Perubahan"
            style={[
              styles.saveButton,
              { backgroundColor: isDirty ? theme.primary : theme.primarySoft },
            ]}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveText}>
                Simpan Perubahan
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <ConfirmationModal
          visible={confirmVisible}
          title="Ubah Kata Sandi?"
          message="Pastikan Anda mengingat kata sandi baru Anda."
          confirmLabel="Ya, Simpan"
          cancelLabel="Batal"
          loading={loading}
          onConfirm={handleConfirmSave}
          onCancel={() => setConfirmVisible(false)}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    position: 'relative',
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: spacing.xl * 2,
  },
  formContainer: {
    gap: 15,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontFamily: profileFonts.medium,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '500' : undefined,
    color: '#000000',
  },
  asterisk: {
    fontFamily: profileFonts.medium,
    color: '#FE4A23',
  },
  textInput: {
    height: 44,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    fontFamily: profileFonts.regular,
    fontSize: 14,
    color: '#1E1E1E',
  },
  textInputError: {
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  errorText: {
    fontFamily: profileFonts.regular,
    fontSize: 12,
    color: '#EF4444',
    marginTop: 2,
  },
  saveButton: {
    height: 48,
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  saveText: {
    fontFamily: profileFonts.semiBold,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
    color: '#FFFFFF',
  },
});
