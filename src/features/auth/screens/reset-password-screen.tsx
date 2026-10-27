import React, { useState } from 'react';
import { ActivityIndicator, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { authClient } from '@/services/auth';
import { TextField } from '@/shared/components/ui/text-field';
import { ConfirmationModal, Toast } from '@/shared/components/ui';
import { authConstants } from '../constants/auth-constants';
import type { AuthStackParamList } from '@/navigation/types';
import leftArrow from '@/assets/images/left-arrow.png';
import logo from '@/assets/images/logo-saranakita.png';

type ResetPasswordRoute = RouteProp<AuthStackParamList, 'ResetPassword'>;

const LOGO_WIDTH = 120;
const LOGO_HEIGHT = Math.round((LOGO_WIDTH * 29) / 124);

export function ResetPasswordScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const route = useRoute<ResetPasswordRoute>();

  const email = route.params?.email || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [errors, setErrors] = useState<{ newPassword?: string; confirmPassword?: string }>({});
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    visible: false,
    message: '',
    type: 'error',
  });

  const validate = (): boolean => {
    const errs: { newPassword?: string; confirmPassword?: string } = {};

    if (!newPassword.trim()) {
      errs.newPassword = 'Kata sandi baru wajib diisi.';
    } else if (newPassword.length < 8) {
      errs.newPassword = 'Kata sandi minimal 8 karakter.';
    }

    if (!confirmPassword.trim()) {
      errs.confirmPassword = 'Konfirmasi kata sandi wajib diisi.';
    } else if (confirmPassword !== newPassword) {
      errs.confirmPassword = 'Konfirmasi kata sandi tidak cocok.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePressSubmit = () => {
    Keyboard.dismiss();
    if (validate()) {
      setConfirmModalVisible(true);
    }
  };

  const handleConfirmReset = async () => {
    setConfirmModalVisible(false);
    setSubmitting(true);

    try {
      await authClient.resetPassword({
        email,
        newPassword,
      });

      try {
        await authClient.signOut();
      } catch { }
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Login',
            params: {
              toastMessage: 'Kata sandi berhasil diperbarui. Silakan masuk menggunakan kata sandi baru.',
              toastType: 'success',
            },
          },
        ],
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Gagal memperbarui kata sandi. Silakan coba beberapa saat lagi.';
      setToast({
        visible: true,
        message: msg,
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = newPassword.trim().length >= 8 && confirmPassword.trim().length >= 8;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.topNavRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Kembali"
        >
          <Image
            source={leftArrow}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerBlock}>
              <Image
                source={logo}
                style={styles.logo}
                resizeMode="contain"
                accessibilityRole="image"
                accessibilityLabel="SaranaKita"
              />
              <Text style={styles.title} accessibilityRole="header">
                Reset Kata Sandi
              </Text>
              <Text style={styles.subtitle}>
                Buat kata sandi baru minimal 8 karakter untuk akun Anda.
              </Text>
            </View>

            {/* Form Password */}
            <View style={styles.card}>
              <View style={styles.fieldGroup}>
                <TextField
                  label="Kata Sandi Baru"
                  required
                  value={newPassword}
                  onChangeText={(text) => {
                    setNewPassword(text);
                    if (errors.newPassword) {
                      setErrors((prev) => ({ ...prev, newPassword: undefined }));
                    }
                  }}
                  placeholder="••••••••••"
                  placeholderTextColor={authConstants.colors.text.placeholder}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  errorText={errors.newPassword}
                  labelStyle={styles.label}
                  style={styles.input}
                />
              </View>

              <View style={styles.fieldGroup}>
                <TextField
                  label="Konfirmasi Kata Sandi Baru"
                  required
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) {
                      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }
                  }}
                  placeholder="••••••••••"
                  placeholderTextColor={authConstants.colors.text.placeholder}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  errorText={errors.confirmPassword}
                  labelStyle={styles.label}
                  style={styles.input}
                />
              </View>

              {/* Button */}
              <TouchableOpacity
                onPress={handlePressSubmit}
                disabled={submitting || !isFormValid}
                activeOpacity={0.85}
                style={[
                  styles.submitButton,
                  submitting || !isFormValid ? styles.buttonDisabled : styles.buttonActive,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Simpan Kata Sandi Baru"
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>Simpan Kata Sandi</Text>
                )}
              </TouchableOpacity>

              <View style={styles.loginRow}>
                <Text style={styles.loginQuestionText}>
                  Ingat kata sandi Anda?{' '}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Login')}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.loginLinkText}>Log In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <ConfirmationModal
        visible={confirmModalVisible}
        title="Ubah Kata Sandi?"
        message="Pastikan Anda mengingat kata sandi baru ini untuk login berikutnya."
        confirmLabel="Ya, Simpan"
        cancelLabel="Batal"
        loading={submitting}
        onConfirm={handleConfirmReset}
        onCancel={() => setConfirmModalVisible(false)}
      />

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onDismiss={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: authConstants.colors.brand,
  },
  flex: {
    flex: 1,
  },
  topNavRow: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: 14,
    height: 14,
    tintColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
    alignItems: 'center',
  },
  headerBlock: {
    alignItems: 'center',
    marginBottom: authConstants.spacing.cardToFormGap,
    paddingHorizontal: 20,
  },
  logo: {
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
    marginBottom: 20,
  },
  title: {
    fontFamily: authConstants.typography.title.fontFamily,
    fontSize: 32,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    color: authConstants.colors.text.light,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: authConstants.typography.subtitle.fontFamily,
    fontSize: 16,
    lineHeight: 24,
    color: authConstants.colors.text.light,
    textAlign: 'center',
    maxWidth: 280,
    marginTop: 8,
  },
  card: {
    width: '100%',
    maxWidth: 369,
    backgroundColor: authConstants.colors.surface,
    borderRadius: authConstants.components.card.borderRadius,
    borderWidth: 0.8,
    borderColor: authConstants.colors.ui.cardBorder,
    paddingVertical: 28,
    paddingHorizontal: 24,
    gap: 18,
    shadowColor: authConstants.colors.ui.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  accountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    gap: 10,
    marginTop: 16,
  },
  accountBadgeLabel: {
    fontFamily: authConstants.typography.label.fontFamily,
    fontSize: 12,
    fontWeight: Platform.OS === 'ios' ? '400' : undefined,
    color: 'rgba(255, 255, 255, 0.65)',
    lineHeight: 18,
  },
  accountBadgeEmail: {
    fontFamily: authConstants.typography.label.fontFamily,
    fontSize: 13,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: authConstants.colors.text.light,
    lineHeight: 19.5,
    maxWidth: 220,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontFamily: authConstants.typography.label.fontFamily,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '500' : undefined,
    color: authConstants.colors.text.secondary,
  },
  input: {
    backgroundColor: authConstants.colors.surface,
    borderColor: authConstants.colors.ui.inputBorder,
    borderWidth: 0.8,
    borderRadius: authConstants.components.input.borderRadius,
    height: authConstants.components.input.height,
    fontFamily: authConstants.typography.inputText.fontFamily,
    fontSize: 14,
    color: authConstants.colors.text.dark,
    paddingHorizontal: 12,
  },
  submitButton: {
    borderRadius: authConstants.components.button.borderRadius,
    height: authConstants.components.button.height,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    width: '100%',
  },
  buttonActive: {
    backgroundColor: authConstants.colors.ui.buttonBlack,
  },
  buttonDisabled: {
    backgroundColor: authConstants.colors.ui.buttonDisabled,
  },
  submitButtonText: {
    fontFamily: authConstants.typography.buttonText.fontFamily,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
    color: authConstants.colors.text.light,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  loginQuestionText: {
    color: authConstants.colors.text.dark,
    fontSize: 14,
    fontFamily: authConstants.typography.inputText.fontFamily,
  },
  loginLinkText: {
    color: authConstants.colors.brand,
    fontSize: 16,
    fontFamily: authConstants.typography.link.fontFamily,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
  },
});
