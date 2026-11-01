import React, { useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { authClient, supabase } from '@/services/auth';
import { toUserMessage } from '@/services/api';
import { TextField } from '@/shared/components/ui/text-field';
import { ConfirmationModal, Toast } from '@/shared/components/ui';
import { AuthHeader } from '../components';
import { authConstants } from '../constants/auth-constants';
import { validateConfirmPasswordValue, validatePasswordValue } from '../utils/validation';
import type { AuthStackParamList } from '@/navigation/types';
import leftArrow from '@/assets/images/left-arrow.png';

type ResetPasswordRoute = RouteProp<AuthStackParamList, 'ResetPassword'>;

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

    const newPassErr = validatePasswordValue(newPassword, 'Kata sandi baru');
    if (newPassErr) {
      errs.newPassword = newPassErr;
    }

    const confirmPassErr = validateConfirmPasswordValue(
      newPassword,
      confirmPassword,
      'Konfirmasi kata sandi baru',
    );
    if (confirmPassErr) {
      errs.confirmPassword = confirmPassErr;
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
      try {
        await supabase.auth.updateUser({ password: newPassword });
      } catch { }

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
      setToast({
        visible: true,
        message: toUserMessage(err) || 'Gagal memperbarui kata sandi. Silakan coba beberapa saat lagi.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoginPress = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleBackPress = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  useEffect(() => {
    const onBackPress = () => {
      if (!navigation.isFocused()) {
        return false;
      }
      handleBackPress();
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [navigation]);

  const isFormValid = Boolean(newPassword.trim() && confirmPassword.trim());

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.topNavRow}>
        <TouchableOpacity
          onPress={handleBackPress}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Kembali ke halaman masuk"
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
            <View style={styles.centerBlock}>
              <AuthHeader
                title="Reset Kata Sandi"
                subtitle="Buat kata sandi baru minimal 8 karakter untuk akun Anda."
              />
            </View>

            {/* Form Password */}
            <View style={styles.card}>
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
                placeholderTextColor={authConstants.typography.inputPlaceholder.color}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                errorText={errors.newPassword}
                labelStyle={styles.label}
                style={styles.input}
              />

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
                placeholderTextColor={authConstants.typography.inputPlaceholder.color}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                errorText={errors.confirmPassword}
                labelStyle={styles.label}
                style={styles.input}
              />

              {/* Button */}
              <TouchableOpacity
                onPress={handlePressSubmit}
                disabled={submitting || !isFormValid}
                activeOpacity={0.8}
                style={[
                  styles.continueButton,
                  (submitting || !isFormValid) && styles.buttonDisabled,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Simpan Kata Sandi"
              >
                {submitting ? (
                  <ActivityIndicator color={authConstants.colors.text.light} size="small" />
                ) : (
                  <Text style={styles.continueButtonText}>Simpan Kata Sandi</Text>
                )}
              </TouchableOpacity>

              <View style={styles.loginRow}>
                <Text style={styles.loginText}>
                  Ingat kata sandi Anda?{' '}
                </Text>
                <Pressable
                  onPress={handleLoginPress}
                  accessibilityRole="link"
                  accessibilityLabel="Log In"
                >
                  <Text style={styles.linkText}>Log In</Text>
                </Pressable>
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
  centerBlock: {
    width: '100%',
    maxWidth: 369,
    alignSelf: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 369,
    alignSelf: 'center',
    backgroundColor: authConstants.colors.surface,
    borderRadius: authConstants.components.card.borderRadius,
    borderWidth: 1,
    borderColor: authConstants.colors.ui.cardBorder,
    paddingVertical: authConstants.components.card.paddingVertical,
    paddingHorizontal: authConstants.components.card.paddingHorizontal,
    gap: 18,
  },
  label: {
    fontFamily: authConstants.typography.label.fontFamily,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '500' : undefined,
    color: authConstants.colors.text.dark,
  },
  input: {
    backgroundColor: authConstants.colors.surface,
    borderColor: authConstants.colors.ui.inputBorderLight,
    borderWidth: authConstants.components.input.borderWidth,
    borderRadius: authConstants.components.input.borderRadius,
    height: authConstants.components.input.height,
    fontFamily: authConstants.typography.inputText.fontFamily,
    fontSize: 14,
    color: authConstants.colors.text.dark,
  },
  continueButton: {
    backgroundColor: authConstants.colors.ui.buttonBlack,
    borderRadius: authConstants.components.button.borderRadius,
    height: authConstants.components.button.height,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: authConstants.colors.ui.buttonDisabled,
  },
  continueButtonText: {
    fontFamily: authConstants.typography.buttonText.fontFamily,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
    color: authConstants.colors.text.light,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 14,
  },
  loginText: {
    color: authConstants.colors.text.dark,
    fontSize: 14,
    fontFamily: authConstants.typography.inputText.fontFamily,
  },
  linkText: {
    color: authConstants.colors.brand,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
    fontFamily: authConstants.typography.link.fontFamily,
  },
});
