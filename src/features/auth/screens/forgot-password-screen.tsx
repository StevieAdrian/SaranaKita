import React, { useState } from 'react';
import { ActivityIndicator, Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { authClient } from '@/services/auth';
import { toUserMessage } from '@/services/api';
import { TextField } from '@/shared/components/ui/text-field';
import { Toast } from '@/shared/components/ui';
import { AuthHeader } from '../components';
import { authConstants } from '../constants/auth-constants';
import { validateEmailValue } from '../utils/validation';
import leftArrow from '@/assets/images/left-arrow.png';

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

  const handleLoginPress = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  };

  const isFormValid = email.trim().length > 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.topNavRow}>
        <TouchableOpacity
          onPress={handleBack}
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
                title="Lupa Kata Sandi?"
                subtitle="Masukkan alamat email Anda. Kami akan mengirimkan kode OTP untuk mereset kata sandi."
              />
            </View>

            {/* Email Card */}
            <View style={styles.card}>
              <TextField
                label="Email"
                required
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) setError(null);
                }}
                placeholder="johndoe@gmail.com"
                placeholderTextColor={authConstants.typography.inputPlaceholder.color}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                errorText={error ?? undefined}
                labelStyle={styles.label}
                style={styles.input}
                onSubmitEditing={handleSubmit}
                submitBehavior="submit"
              />

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={submitting || !isFormValid}
                activeOpacity={0.8}
                style={[
                  styles.continueButton,
                  (submitting || !isFormValid) && styles.buttonDisabled,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Kirim Kode OTP"
              >
                {submitting ? (
                  <ActivityIndicator color={authConstants.colors.text.light} size="small" />
                ) : (
                  <Text style={styles.continueButtonText}>Kirim Kode OTP</Text>
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
