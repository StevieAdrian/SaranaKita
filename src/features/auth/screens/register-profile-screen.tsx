import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import leftArrow from '@/assets/images/left-arrow.png';
import logo from '@/assets/images/logo-saranakita.png';
import { authClient } from '@/services/auth';
import { uploadAvatarImage } from '@/services/upload';
import { Button } from '@/shared/components/ui/button';
import { AvatarPicker, type PickedPhoto } from '../components';
import { authConstants } from '../constants/auth-constants';
import type { RegisterProfileRouteParams } from '../types';

const LOGO_WIDTH = 130;
const LOGO_HEIGHT = Math.round((LOGO_WIDTH * 29) / 124);

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

  const fullName = [params?.firstName, params?.lastName]
    .filter(Boolean)
    .join(' ')
    .trim() || 'User Profile';

  const handleRegister = async () => {
    if (!params || !params.username || !params.email || !params.password) {
      Alert.alert('Error', 'Data pendaftaran tidak lengkap. Silakan isi form registrasi kembali.');
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
        } catch { }
      }


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
    } catch (err: any) {
      const message =
        err?.message || 'Terjadi kesalahan saat memproses pendaftaran.';
      setErrorMessage(message);
      Alert.alert('Pendaftaran Gagal', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
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
            <Pressable
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={({ pressed }: { pressed: boolean }) => [
                styles.backButton,
                pressed && styles.backButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Kembali ke halaman pendaftaran"
            >
              <Image
                source={leftArrow}
                style={styles.backIcon}
                resizeMode="contain"
              />
            </Pressable>

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
            <Button
              title="Register Account"
              loading={submitting}
              onPress={handleRegister}
              style={styles.registerButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: authConstants.colors.backgroundBlue,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: authConstants.spacing.screenMargin,
    paddingTop: 24,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    minHeight: 40,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    width: 36,
    height: 36,
  },
  content: {

    width: '100%',
    paddingVertical: 40,
    gap: authConstants.spacing.fieldGap,
  },
  nameBox: {
    height: authConstants.components.input.height,
    backgroundColor: authConstants.colors.surface,
    borderRadius: authConstants.components.input.borderRadius,
    borderWidth: authConstants.components.input.borderWidth,
    borderColor: authConstants.colors.ui.inputBorder,
    paddingHorizontal: authConstants.components.input.paddingHorizontal,
    justifyContent: 'center',
  },
  nameText: {
    ...authConstants.typography.inputText,
    color: authConstants.colors.text.dark,
  },
  errorText: {
    color: authConstants.colors.text.error,
    fontSize: 13,
    textAlign: 'center',
    marginTop: -4,
  },
  registerButton: {
    backgroundColor: authConstants.colors.ui.buttonPrimaryBg,
    borderRadius: authConstants.components.button.borderRadius,
    height: authConstants.components.button.height,
    marginTop: 6,
  },
});

