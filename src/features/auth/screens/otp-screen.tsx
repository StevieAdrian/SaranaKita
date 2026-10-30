import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  type NativeSyntheticEvent,
  type TextInputInstance,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { authClient, supabase } from '@/services/auth';
import { toUserMessage } from '@/services/api';
import { Toast } from '@/shared/components/ui';
import { authConstants } from '../constants/auth-constants';
import { fontFamilies } from '@/shared/theme';
import { checkUserProfileComplete } from '../services/google-auth';
import type { OtpScreenRouteParams } from '../types';
import leftArrow from '@/assets/images/left-arrow.png';

const OTP_LENGTH = 6;
const OTP_VALIDITY_SECONDS = 15 * 60;
const RESEND_COOLDOWN_SECONDS = 60;

type OtpScreenRoute = RouteProp<
  { OtpVerification: OtpScreenRouteParams },
  'OtpVerification'
>;

export function OtpScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const route = useRoute<OtpScreenRoute>();
  const insets = useSafeAreaInsets();

  const email = route.params?.email || '';
  const mode = route.params?.mode ?? 'signup';
  const from = route.params?.from;
  const isResetPassword = mode === 'reset-password';

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [validityTimer, setValidityTimer] = useState(OTP_VALIDITY_SECONDS);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    visible: false,
    message: '',
    type: 'error',
  });

  const inputRefs = useRef<Array<TextInputInstance | null>>([]);

  const handleBackOrChange = useCallback(() => {
    if (from === 'register') {
      navigation.navigate('Register');
    } else if (from === 'login') {
      navigation.navigate('Login');
    } else if (from === 'forgot-password') {
      navigation.navigate('ForgotPassword');
    } else {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('Login');
      }
    }
  }, [from, navigation]);

  useEffect(() => {
    const onBackPress = () => {
      handleBackOrChange();
      return true;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );

    return () => subscription.remove();
  }, [handleBackOrChange]);

  useEffect(() => {
    if (validityTimer <= 0) return;
    const interval = setInterval(() => {
      setValidityTimer((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [validityTimer]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const otpCode = otp.join('');
  const isComplete = otp.every((d) => d.trim().length === 1);

  const handleOtpChange = (text: string, index: number) => {
    const cleaned = text.replace(/[^0-9]/g, '');

    if (cleaned.length >= OTP_LENGTH) {
      const newOtp = cleaned.slice(0, OTP_LENGTH).split('');
      setOtp(newOtp);
      inputRefs.current[OTP_LENGTH - 1]?.focus();
      return;
    }

    if (cleaned.length === 2 && otp[index]) {
      const prevDigit = otp[index];
      const newDigit = cleaned[0] === prevDigit ? cleaned[1] : cleaned[0];
      setOtp((prev) => {
        const next = [...prev];
        next[index] = newDigit ?? '';
        return next;
      });

      if (index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
      return;
    }

    if (cleaned.length > 1) {
      setOtp((prev) => {
        const next = [...prev];
        for (let i = 0; i < cleaned.length && index + i < OTP_LENGTH; i++) {
          next[index + i] = cleaned[i] ?? '';
        }
        return next;
      });
      const nextTarget = Math.min(index + cleaned.length, OTP_LENGTH - 1);
      inputRefs.current[nextTarget]?.focus();
      return;
    }

    if (cleaned.length === 1) {
      setOtp((prev) => {
        const next = [...prev];
        next[index] = cleaned;
        return next;
      });

      if (index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
      return;
    }

    if (text === '') {
      setOtp((prev) => {
        const next = [...prev];
        next[index] = '';
        return next;
      });
    }
  };

  const handleOtpKeyPress = (
    e: NativeSyntheticEvent<{ key: string }>,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!otp[index]) {
        if (index > 0) {
          setOtp((prev) => {
            const next = [...prev];
            next[index - 1] = '';
            return next;
          });
          inputRefs.current[index - 1]?.focus();
        }
      } else {
        setOtp((prev) => {
          const next = [...prev];
          next[index] = '';
          return next;
        });
      }
    }
  };

  const handleVerifyOTP = async () => {
    if (!isComplete) {
      setToast({
        visible: true,
        message: 'Harap masukkan 6 digit kode OTP secara lengkap.',
        type: 'error',
      });
      return;
    }

    if (!email) {
      setToast({
        visible: true,
        message: 'Alamat email tidak ditemukan. Silakan kembali ke halaman sebelumnya.',
        type: 'error',
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: isResetPassword ? 'recovery' : 'email',
      });

      if (error) {
        setOtp(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();

        const errorMsg =
          error.message?.toLowerCase().includes('expired') ||
            error.message?.toLowerCase().includes('invalid')
            ? 'Kode salah atau kadaluarsa'
            : toUserMessage(error) || 'Kode salah atau kadaluarsa';

        setToast({
          visible: true,
          message: errorMsg,
          type: 'error',
        });
        return;
      }

      if (isResetPassword) {
        await supabase.auth.signOut({ scope: 'local' }).catch(() => { });
        navigation.replace('ResetPassword', { email });
      } else {
        if (data?.session) {
          const { userData } = await checkUserProfileComplete(
            data.session.user.id,
            data.session.access_token,
          );
          await authClient.applySupabaseSession(data.session, userData ?? undefined);
        } else {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'Login',
                params: {
                  toastMessage: 'Akun berhasil diverifikasi. Silakan masuk.',
                  toastType: 'success',
                },
              },
            ],
          });
        }
      }
    } catch (err: any) {
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();

      setToast({
        visible: true,
        message: toUserMessage(err) || 'Kode salah atau kadaluarsa',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resending || !email) return;

    setResending(true);

    try {
      if (isResetPassword) {
        await authClient.resendOtp(email, 'recovery');
      } else if (supabase.auth.resend) {
        const res = await supabase.auth.resend({
          type: 'signup',
          email,
        });
        if (res?.error) {
          throw new Error(res.error.message);
        }
      } else if (supabase.auth.signInWithOtp) {
        const res = await supabase.auth.signInWithOtp({ email });
        if (res?.error) {
          throw new Error(res.error.message);
        }
      }

      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      setValidityTimer(OTP_VALIDITY_SECONDS);
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
      setToast({
        visible: true,
        message: 'Kode OTP baru telah dikirimkan ke email Anda.',
        type: 'success',
      });
    } catch (err: any) {
      setToast({
        visible: true,
        message: toUserMessage(err) || 'Gagal mengirim ulang kode OTP.',
        type: 'error',
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onDismiss={() => setToast((prev) => ({ ...prev, visible: false }))}
      />

      {/* Header */}
      <View style={[styles.topHeader, { paddingTop: Math.max(insets.top, 16) }]}>
        <TouchableOpacity
          onPress={handleBackOrChange}
          activeOpacity={0.7}
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
            <View style={styles.headerTitleGroup}>
              <Text style={styles.title} accessibilityRole="header">
                Verifikasi OTP
              </Text>
              <Text style={styles.subtitle}>
                Masukkan 6 digit kode OTP yang telah kami kirim ke email Anda.
              </Text>
            </View>

            <View style={styles.emailCard}>
              <Text style={styles.emailText} numberOfLines={1} ellipsizeMode="middle">
                {email || 'johndoe@gmail.com'}
              </Text>
              <TouchableOpacity
                onPress={handleBackOrChange}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.changeButton}
                accessibilityRole="button"
                accessibilityLabel="Ubah alamat email"
              >
                <Text style={styles.changeText}>Ubah</Text>
              </TouchableOpacity>
            </View>

            {/* Kode OTP */}
            <View
              style={styles.otpContainer}
              accessibilityRole="none"
              accessibilityLabel="Kotak Input OTP 6 Digit"
            >
              {Array.from({ length: OTP_LENGTH }).map((_, index) => {
                const digit = otp[index] || '';
                const isFocused = focusedIndex === index;
                const hasError = toast.visible && toast.type === 'error';

                return (
                  <View
                    key={index}
                    style={[
                      styles.otpBox,
                      isFocused && styles.otpBoxFocused,
                      hasError && styles.otpBoxError,
                    ]}
                  >
                    <TextInput
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      value={digit}
                      onChangeText={(text) => handleOtpChange(text, index)}
                      onKeyPress={(e) => handleOtpKeyPress(e, index)}
                      onFocus={() => setFocusedIndex(index)}
                      onBlur={() => {
                        if (focusedIndex === index) {
                          setFocusedIndex(-1);
                        }
                      }}
                      keyboardType="number-pad"
                      textContentType="oneTimeCode"
                      autoComplete="sms-otp"
                      selectTextOnFocus
                      caretHidden
                      autoFocus={index === 0}
                      style={styles.otpInput}
                      maxLength={OTP_LENGTH}
                      accessibilityLabel={`Digit ke-${index + 1}`}
                    />
                    {isFocused && !digit ? (
                      <View style={styles.cursorIndicator} pointerEvents="none" />
                    ) : null}
                  </View>
                );
              })}
            </View>

            <View style={styles.metaRow}>
              <View style={styles.timerGroup}>
                <Text style={styles.metaLabel}>Sisa Waktu: </Text>
                <Text style={styles.timerValue}>{formatTime(validityTimer)}</Text>
              </View>

              <View style={styles.resendGroup}>
                <Text style={styles.metaLabel}>Belum terima kode? </Text>
                <TouchableOpacity
                  onPress={handleResend}
                  disabled={resendCooldown > 0 || resending}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}
                >
                  <Text
                    style={[
                      styles.resendButton,
                      (resendCooldown > 0 || resending) && styles.resendDisabled,
                    ]}
                  >
                    {resending
                      ? 'Mengirim...'
                      : resendCooldown > 0
                        ? `Kirim ulang (${resendCooldown}s)`
                        : 'Kirim Ulang'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.verifyButton,
                isComplete && !loading ? styles.verifyButtonActive : styles.verifyButtonDisabled,
              ]}
              onPress={handleVerifyOTP}
              disabled={loading || !isComplete}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Verifikasi"
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.verifyButtonText}>Verifikasi</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECF3FD',
  },
  flex: {
    flex: 1,
  },
  topHeader: {
    width: '100%',
    height: 120,
    backgroundColor: authConstants.colors.brand,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 48,
    alignItems: 'center',
  },
  headerTitleGroup: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  title: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 24,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
    color: authConstants.colors.text.slate,
    textAlign: 'center',
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 15,
    fontWeight: Platform.OS === 'ios' ? '400' : undefined,
    color: authConstants.colors.text.slateMuted,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
    marginTop: 8,
  },
  emailCard: {
    width: '100%',
    maxWidth: 340,
    height: 52,
    backgroundColor: authConstants.colors.surface,
    borderWidth: 1,
    borderColor: authConstants.colors.ui.borderSlate,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 20,
    shadowColor: authConstants.colors.brand,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  emailText: {
    flex: 1,
    fontFamily: fontFamilies.medium,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '500' : undefined,
    color: authConstants.colors.text.slate,
    lineHeight: 21,
    marginRight: 8,
  },
  changeButton: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  changeText: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
    color: authConstants.colors.brand,
    lineHeight: 21,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    gap: 8,
    marginTop: 32,
  },
  otpBox: {
    flex: 1,
    height: 50,
    backgroundColor: authConstants.colors.surface,
    borderWidth: 1,
    borderColor: authConstants.colors.ui.borderSlate,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  otpBoxFocused: {
    borderColor: authConstants.colors.brand,
    borderWidth: 1.5,
  },
  otpBoxError: {
    borderColor: authConstants.colors.text.error,
  },
  otpInput: {
    width: '100%',
    height: '100%',
    fontFamily: fontFamilies.semiBold,
    fontSize: 24,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
    color: authConstants.colors.text.navyText,
    textAlign: 'center',
    includeFontPadding: false,
    padding: 0,
    margin: 0,
  },
  cursorIndicator: {
    position: 'absolute',
    bottom: 10,
    width: 14,
    height: 2,
    backgroundColor: authConstants.colors.brand,
    borderRadius: 1,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    marginTop: 28,
  },
  timerGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    fontWeight: Platform.OS === 'ios' ? '400' : undefined,
    color: authConstants.colors.text.slateMuted,
    lineHeight: 18,
  },
  timerValue: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    color: authConstants.colors.brand,
    lineHeight: 18,
  },
  resendButton: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    color: authConstants.colors.brand,
    lineHeight: 18,
  },
  resendDisabled: {
    opacity: 0.5,
  },
  verifyButton: {
    width: '100%',
    maxWidth: 340,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  verifyButtonActive: {
    backgroundColor: authConstants.colors.ui.buttonBlack,
  },
  verifyButtonDisabled: {
    backgroundColor: authConstants.colors.ui.buttonDisabled,
  },
  verifyButtonText: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
    color: authConstants.colors.text.light,
    lineHeight: 21,
  },
});
