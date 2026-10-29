import React, { useState } from 'react';
import { ActivityIndicator, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { authClient } from '@/services/auth';
import { toUserMessage } from '@/services/api';
import { TextField } from '@/shared/components/ui/text-field';
import { Toast } from '@/shared/components/ui';
import { authConstants } from '../constants/auth-constants';
import { validateEmailValue } from '../utils/validation';
import leftArrow from '@/assets/images/left-arrow.png';
import logo from '@/assets/images/logo-saranakita.png';

const LOGO_WIDTH = 120;
const LOGO_HEIGHT = Math.round((LOGO_WIDTH * 29) / 124);

export function ForgotPasswordScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    visible: false,
    message: '',
    type: 'error',
  });

  const validateEmail = (value: string): boolean => {
    const emailError = validateEmailValue(value);
    if (emailError) {
      setError(emailError);
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    const cleanEmail = email.trim().toLowerCase();
    if (!validateEmail(cleanEmail)) return;

    setSubmitting(true);
    try {
      await authClient.forgotPassword(cleanEmail);
      navigation.navigate('OtpVerification', {
        email: cleanEmail,
        mode: 'reset-password',
        from: 'forgot-password',
      });
    } catch (err: any) {
      setToast({
        visible: true,
        message: toUserMessage(err) || 'Gagal mengirim kode OTP. Pastikan email Anda benar.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = email.trim().length > 0;

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
            <View style={styles.headerBlock}>
              <Image
                source={logo}
                style={styles.logo}
                resizeMode="contain"
                accessibilityRole="image"
                accessibilityLabel="SaranaKita"
              />
              <Text style={styles.title} accessibilityRole="header">
                Lupa Kata Sandi?
              </Text>
              <Text style={styles.subtitle}>
                Masukkan alamat email Anda. Kami akan mengirimkan kode OTP untuk mereset kata sandi.
              </Text>
            </View>

            {/* Email Card */}
            <View style={styles.card}>
              <View style={styles.fieldGroup}>
                <TextField
                  label="Email"
                  required
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (error) setError(null);
                  }}
                  placeholder="johndoe@gmail.com"
                  placeholderTextColor={authConstants.colors.text.placeholder}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  errorText={error ?? undefined}
                  labelStyle={styles.label}
                  style={styles.input}
                  onSubmitEditing={handleSubmit}
                  submitBehavior="submit"
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={submitting || !isFormValid}
                activeOpacity={0.85}
                style={[
                  styles.submitButton,
                  submitting || !isFormValid ? styles.buttonDisabled : styles.buttonActive,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Kirim Kode OTP"
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>Kirim Kode OTP</Text>
                )}
              </TouchableOpacity>

              <View style={styles.loginRow}>
                <Text style={styles.loginQuestionText}>
                  Ingat kata sandi Anda?{' '}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
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
    gap: 20,
    shadowColor: authConstants.colors.ui.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
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
