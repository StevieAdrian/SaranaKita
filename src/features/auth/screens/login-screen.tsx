import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, type TextInputInstance } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TextField } from '@/shared/components/ui/text-field';
import { Toast } from '@/shared/components/ui';
import { AuthDivider, AuthHeader, GoogleButton } from '../components';
import { authConstants } from '../constants/auth-constants';
import { useLoginForm } from '../hooks/use-login-form';

export function LoginScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { email, password, errors, submitting, setEmail, setPassword, submit } =
    useLoginForm();
  const passwordRef = useRef<TextInputInstance>(null);

  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ visible: false, message: '', type: 'info' });

  React.useEffect(() => {
    if (route.params?.toastMessage) {
      setToast({
        visible: true,
        message: route.params.toastMessage,
        type: route.params.toastType ?? 'success',
      });
    }
  }, [route.params?.toastMessage, route.params?.toastType]);

  const onForgotPassword = useCallback(() => {
    navigation.navigate('ForgotPassword');
  }, [navigation]);

  const onSignUp = useCallback(() => {
    navigation.navigate('Register');
  }, [navigation]);

  const onGoogle = useCallback(() => {
    setToast({
      visible: true,
      message: 'Fitur Google Sign-In segera hadir.',
      type: 'info',
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.centerBlock}>
            <AuthHeader
              title="Selamat Datang!"
              subtitle="Masuk dan lanjutkan upaya mewujudkan sekolah yang lebih baik."
            />
          </View>

          {/* Form */}
          <View style={styles.card}>
            <TextField
              label="Email"
              required
              value={email}
              onChangeText={setEmail}
              placeholder="johndoe@gmail.com"
              placeholderTextColor={authConstants.typography.inputPlaceholder.color}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              submitBehavior="submit"
              errorText={errors.email}
              labelStyle={styles.label}
              style={styles.input}
            />

            <TextField
              ref={passwordRef}
              label="Kata Sandi"
              required
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••••"
              placeholderTextColor={authConstants.typography.inputPlaceholder.color}
              secureTextEntry
              autoComplete="password"
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={submit}
              errorText={errors.password}
              labelStyle={styles.label}
              style={styles.input}
            />

            <Pressable
              onPress={onForgotPassword}
              accessibilityRole="link"
              accessibilityLabel="Lupa Kata Sandi?"
              style={styles.forgot}
            >
              <Text style={styles.linkText}>Lupa Kata Sandi?</Text>
            </Pressable>

            {errors.form ? (
              <Text style={styles.formError} accessibilityLiveRegion="polite">
                {errors.form}
              </Text>
            ) : null}

            {/* Button */}
            <TouchableOpacity
              onPress={submit}
              disabled={submitting}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Masuk"
              style={[
                styles.continueButton,
                submitting && styles.buttonDisabled,
              ]}
            >
              {submitting ? (
                <ActivityIndicator color={authConstants.colors.text.light} size="small" />
              ) : (
                <Text style={styles.continueButtonText}>Masuk</Text>
              )}
            </TouchableOpacity>

            <View style={styles.signUpRow}>
              <Text style={styles.signUpText}>Belum punya akun? </Text>
              <Pressable
                onPress={onSignUp}
                accessibilityRole="link"
                accessibilityLabel="Daftar"
              >
                <Text style={styles.linkText}>Daftar</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.bottomBlock}>
            <AuthDivider text="Atau lanjutkan dengan" />

            {/* Google Button */}
            <GoogleButton onPress={onGoogle} label="Google" />
          </View>
        </ScrollView>
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
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
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
  bottomBlock: {
    width: '100%',
    maxWidth: 369,
    alignSelf: 'center',
  },
  label: {
    fontFamily: authConstants.typography.label.fontFamily,
    fontSize: 16,
    fontWeight: '500',
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
  forgot: {
    alignSelf: 'flex-end',
    marginTop: -6,
  },
  linkText: {
    color: authConstants.colors.brand,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
    fontFamily: authConstants.typography.link.fontFamily,
  },
  formError: {
    color: authConstants.colors.text.error,
    fontSize: 13,
    textAlign: 'center',
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
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
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
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 14,
  },
  signUpText: {
    color: authConstants.colors.text.dark,
    fontSize: 14,
    fontFamily: authConstants.typography.inputText.fontFamily,
  },
});
