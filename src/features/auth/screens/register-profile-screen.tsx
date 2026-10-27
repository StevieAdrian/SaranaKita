import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import leftArrow from '@/assets/images/left-arrow.png';
import logo from '@/assets/images/logo-saranakita.png';
import { toUserMessage } from '@/services/api';
import { authClient } from '@/services/auth';
import { uploadAvatarImage } from '@/services/upload';
import { Toast } from '@/shared/components/ui';
import { AvatarPicker, type PickedPhoto } from '../components';
import { authConstants } from '../constants/auth-constants';
import type { RegisterProfileRouteParams } from '../types';

const LOGO_WIDTH = 124;
const LOGO_HEIGHT = 27;

type RegisterProfileRouteProp = RouteProp<
  { RegisterProfile?: RegisterProfileRouteParams },
  'RegisterProfile'
>;

export function RegisterProfileScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const route = useRoute<RegisterProfileRouteProp>();
  const params = route.params;

  const [pickedPhoto, setPickedPhoto] = useState<PickedPhoto | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ visible: false, message: '', type: 'error' });
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fullName =
    [params?.firstName, params?.lastName].filter(Boolean).join(' ').trim() ||
    params?.username ||
    'Profil Pengguna';

  const handleRegister = async () => {
    if (!params || !params.username || !params.email || !params.password) {
      setToast({
        visible: true,
        message: 'Data pendaftaran tidak lengkap. Silakan isi form registrasi kembali.',
        type: 'error',
      });
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      let avatarUrl: string | undefined;

      if (pickedPhoto) {
        try {
          const uploadRes = await uploadAvatarImage(pickedPhoto, params.username);
          avatarUrl = uploadRes.url;
        } catch {
        }
      }

      try {
        await authClient.register({
          username: params.username,
          email: params.email,
          password: params.password,
          firstName: params.firstName,
          lastName: params.lastName,
          phone: params.phone,
          dateOfBirth: params.dateOfBirth,
          class: params.classGrade,
          gender: params.gender,
          avatarUrl,
        });
        navigation.navigate('OtpVerification', {
          email: params.email.trim().toLowerCase(),
          mode: 'signup',
          from: 'register',
        });
      } catch (regErr: any) {
        const bodyCode = regErr?.body?.code || regErr?.body?.error;
        const msg = (regErr?.message || '').toLowerCase();
        const bodyMsg = (
          typeof regErr?.body?.message === 'string' ? regErr.body.message : ''
        ).toLowerCase();

        const isUnverified =
          bodyCode === 'EMAIL_NOT_VERIFIED' ||
          msg.includes('belum diverifikasi') ||
          msg.includes('email not confirmed') ||
          bodyMsg.includes('belum diverifikasi') ||
          bodyMsg.includes('email not confirmed');

        if (isUnverified) {
          navigation.navigate('OtpVerification', {
            email: params.email.trim().toLowerCase(),
            mode: 'signup',
            from: 'register',
          });
          return;
        }
        throw regErr;
      }
    } catch (err: any) {
      const message =
        toUserMessage(err) ||
        'Terjadi kesalahan saat memproses pendaftaran.';
      setErrorMessage(message);
      setToast({
        visible: true,
        message,
        type: 'error',
      });
    } finally {
      if (isMountedRef.current) {
        setSubmitting(false);
      }
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
          <View style={styles.headerBar}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              activeOpacity={0.7}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Kembali ke halaman pendaftaran"
            >
              <Image
                source={leftArrow}
                style={styles.backIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <Image
                source={logo}
                style={styles.logo}
                resizeMode="contain"
                accessibilityRole="image"
                accessibilityLabel="SaranaKita"
              />
            </View>

            <View style={styles.headerSpacer} />
          </View>

          {/* Avatar */}
          <View style={styles.content}>
            <AvatarPicker
              gender={params?.gender}
              photo={pickedPhoto}
              onChange={setPickedPhoto}
              disabled={submitting}
            />

            {/* Full Name */}
            <View style={styles.nameBox}>
              <Text
                style={styles.nameText}
                numberOfLines={1}
                ellipsizeMode="tail"
                accessibilityLabel={`Nama lengkap: ${fullName}`}
              >
                {fullName}
              </Text>
            </View>

            {errorMessage ? (
              <Text style={styles.errorText} accessibilityLiveRegion="polite">
                {errorMessage}
              </Text>
            ) : null}

            {/* Button */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={submitting}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Daftar Akun"
              style={[
                styles.registerButton,
                submitting && styles.buttonDisabled,
              ]}
            >
              {submitting ? (
                <ActivityIndicator color={authConstants.colors.text.light} size="small" />
              ) : (
                <Text style={styles.registerButtonText}>Daftar Akun</Text>
              )}
            </TouchableOpacity>
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
    paddingHorizontal: authConstants.spacing.screenMargin,
    paddingTop: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    minHeight: 44,
    marginBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: {
    opacity: 0.6,
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: authConstants.colors.text.light,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  nameBox: {
    width: '100%',
    maxWidth: 323,
    height: authConstants.components.input.height,
    backgroundColor: authConstants.colors.surface,
    borderRadius: authConstants.components.input.borderRadius,
    borderWidth: 0.5,
    borderColor: authConstants.colors.ui.inputBorder,
    paddingHorizontal: 12,
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 0,
  },
  nameText: {
    fontFamily: authConstants.typography.inputText.fontFamily,
    fontSize: 14,
    color: authConstants.colors.text.dark,
    fontWeight: '400',
  },
  errorText: {
    color: authConstants.colors.text.light,
    backgroundColor: 'rgba(239, 68, 68, 0.4)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    fontSize: 13,
    textAlign: 'center',
    width: '100%',
    maxWidth: 323,
    marginTop: 12,
  },
  registerButton: {
    width: '100%',
    maxWidth: 323,
    height: authConstants.components.button.height,
    backgroundColor: authConstants.colors.ui.buttonBlack,
    borderRadius: authConstants.components.button.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  buttonDisabled: {
    backgroundColor: authConstants.colors.ui.buttonDisabled,
  },
  registerButtonText: {
    fontFamily: authConstants.typography.buttonText.fontFamily,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
    color: authConstants.colors.text.light,
  },
});
