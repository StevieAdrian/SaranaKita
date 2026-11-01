import React, { useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { authClient } from '@/services/auth';
import { toUserMessage } from '@/services/api';
import { TextField } from '@/shared/components/ui/text-field';
import { Toast } from '@/shared/components/ui';
import { AuthDivider, AuthHeader, ClassSelectField, DateOfBirthField, GenderRadioField, GoogleButton, UsernameInput } from '../components';
import { authConstants } from '../constants/auth-constants';
import { useRegisterForm } from '../hooks/use-register-form';
import { checkUserProfileComplete, signInWithGoogle, statusCodes } from '../services/google-auth';

export function RegisterScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const routeParams = route.params;

  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ visible: false, message: '', type: 'info' });
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    isGoogleAuth,
    username,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    phone,
    dateOfBirth,
    classGrade,
    gender,
    usernameStatus,
    errors,
    submitting,
    setUsername,
    setFirstName,
    setLastName,
    setEmail,
    setPassword,
    setConfirmPassword,
    setPhone,
    setDateOfBirth,
    setClassGrade,
    setGender,
    submit,
  } = useRegisterForm(routeParams);

  useEffect(() => {
    if (!isGoogleAuth) return;

    const onBackPress = () => {
      if (!navigation.isFocused()) {
        return false;
      }
      authClient.signOut().catch(() => { });
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [isGoogleAuth, navigation]);

  const handleLoginPress = () => {
    if (isGoogleAuth) {
      authClient.signOut().catch(() => { });
    }
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleGooglePress = async () => {
    setGoogleLoading(true);
    try {
      const { authData, userEmail, userFullName } = await signInWithGoogle();
      const userId = authData.session.user.id;

      const { isComplete, userData } = await checkUserProfileComplete(userId, authData.session.access_token);
      if (!isComplete) {
        navigation.replace('SignUp', {
          isGoogleAuth: true,
          email: userEmail,
          fullName: userFullName,
        });
      } else {
        await authClient.applySupabaseSession(authData.session, userData);
      }
    } catch (err: any) {
      authClient.signOut().catch(() => { });
      if (err?.code === statusCodes?.SIGN_IN_CANCELLED) return;
      if (err?.code === statusCodes?.IN_PROGRESS) return;
      if (err?.code === statusCodes?.PLAY_SERVICES_NOT_AVAILABLE) {
        setToast({
          visible: true,
          message: 'Layanan Google Play tidak tersedia pada perangkat ini.',
          type: 'error',
        });
        return;
      }
      setToast({
        visible: true,
        message: toUserMessage(err) || 'Gagal mendaftar dengan Google.',
        type: 'error',
      });
    } finally {
      setGoogleLoading(false);
    }
  };

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
              title={isGoogleAuth ? 'Lengkapi Profil' : 'Mulai Sekarang'}
              subtitle={
                isGoogleAuth
                  ? 'Buat kata sandi dan lengkapi data profil untuk mengaktifkan akun Anda.'
                  : 'Buat akun dan wujudkan sekolah yang lebih baik.'
              }
            />
          </View>

          {/* Register Form */}
          <View style={styles.card}>
            <UsernameInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              status={usernameStatus}
              errorText={errors.username}
              required
              labelStyle={styles.label}
            />

            <TextField
              label="Nama Depan"
              required
              value={firstName}
              onChangeText={setFirstName}
              placeholder="John"
              placeholderTextColor={authConstants.typography.inputPlaceholder.color}
              errorText={errors.firstName}
              labelStyle={styles.label}
              style={styles.input}
            />

            <TextField
              label="Nama Belakang"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Doe"
              placeholderTextColor={authConstants.typography.inputPlaceholder.color}
              errorText={errors.lastName}
              labelStyle={styles.label}
              style={styles.input}
            />

            <TextField
              label="Email"
              required
              value={email}
              onChangeText={setEmail}
              placeholder="johndoe@gmail.com"
              placeholderTextColor={authConstants.typography.inputPlaceholder.color}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isGoogleAuth}
              accessibilityState={isGoogleAuth ? { disabled: true } : undefined}
              errorText={errors.email}
              labelStyle={styles.label}
              style={[styles.input, isGoogleAuth && styles.inputDisabled]}
            />

            <TextField
              label="Kata Sandi"
              required
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••••"
              placeholderTextColor={authConstants.typography.inputPlaceholder.color}
              secureTextEntry
              errorText={errors.password}
              labelStyle={styles.label}
              style={styles.input}
            />

            <TextField
              label="Konfirmasi Kata Sandi"
              required
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••••"
              placeholderTextColor={authConstants.typography.inputPlaceholder.color}
              secureTextEntry
              errorText={errors.confirmPassword}
              labelStyle={styles.label}
              style={styles.input}
            />

            <TextField
              label="Nomor Telepon"
              required
              value={phone}
              onChangeText={setPhone}
              placeholder="08xxxxxxxxxx"
              placeholderTextColor={authConstants.typography.inputPlaceholder.color}
              keyboardType="phone-pad"
              errorText={errors.phone}
              labelStyle={styles.label}
              style={styles.input}
            />

            <DateOfBirthField
              label="Tanggal Lahir"
              value={dateOfBirth}
              onChange={setDateOfBirth}
              errorText={errors.dateOfBirth}
              required
              labelStyle={styles.label}
            />

            <ClassSelectField
              label="Kelas"
              value={classGrade || null}
              onChange={setClassGrade}
              errorText={errors.classGrade}
              required
              labelStyle={styles.label}
            />

            <GenderRadioField
              label="Jenis Kelamin"
              value={gender}
              onChange={setGender}
              errorText={errors.gender}
              required
              labelStyle={styles.label}
            />

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
              accessibilityLabel="Lanjutkan"
              style={[
                styles.continueButton,
                submitting && styles.buttonDisabled,
              ]}
            >
              {submitting ? (
                <ActivityIndicator color={authConstants.colors.text.light} size="small" />
              ) : (
                <Text style={styles.continueButtonText}>Lanjutkan</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Sudah punya akun? </Text>
              <Pressable
                onPress={handleLoginPress}
                accessibilityRole="link"
                accessibilityLabel="Log In"
              >
                <Text style={styles.linkText}>Log In</Text>
              </Pressable>
            </View>
          </View>

          {!isGoogleAuth ? (
            <View style={styles.bottomBlock}>
              <AuthDivider text="Atau lanjutkan dengan" />
              <GoogleButton
                onPress={handleGooglePress}
                label="Google"
                disabled={submitting || googleLoading}
                loading={googleLoading}
              />
            </View>
          ) : null}
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
    paddingBottom: 48,
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
    borderColor: '#E0E0E0',
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
  inputDisabled: {
    backgroundColor: '#F1F5F9',
    opacity: 0.8,
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
