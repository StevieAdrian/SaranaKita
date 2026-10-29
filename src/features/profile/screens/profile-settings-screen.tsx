import React, { useMemo, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import leftArrow from '@/assets/images/left-arrow.png';
import { authClient } from '@/services/auth';
import { changePassword, updateFullProfile } from '@/services/profile';
import { useRole } from '@/shared/context/theme-context';
import { hitSlop, spacing } from '@/shared/theme';
import { FormDataSekolah } from '../components/form-data-sekolah';
import { FormPassword } from '../components/form-password';
import { FormProfile, type ProfileFormData } from '../components/form-profile';
import { ProfileTabBar } from '../components/profile-tab-bar';
import { notifyProfileUpdated, useProfileScreen } from '../hooks/use-profile-screen';
import { profileFonts, type ProfileTab } from '../utils/constants';

export function ProfileSettingsScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme } = useRole();
  const { profile, setProfile } = useProfileScreen();
  const [activeTab, setActiveTab] = useState<ProfileTab>('Ubah Profil');
  const [submitting, setSubmitting] = useState(false);

  const initialProfileData = useMemo<Partial<ProfileFormData>>(() => ({
    fullName: profile.fullName,
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phone,
    birthDate: profile.birthDate,
    gender: profile.gender,
    avatarUrl: profile.avatarUrl,
  }), [
    profile.fullName,
    profile.firstName,
    profile.lastName,
    profile.email,
    profile.phone,
    profile.birthDate,
    profile.gender,
    profile.avatarUrl,
  ]);

  const handleUpdateProfile = async (data: ProfileFormData) => {
    setSubmitting(true);
    try {
      const updated = await updateFullProfile({
        fullName: data.fullName,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        birthDate: data.birthDate,
        gender: data.gender,
        avatarUrl: data.avatarUrl,
      });
      setProfile(updated);
      notifyProfileUpdated(updated);
      await authClient.restore().catch(() => { });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateSchool = async (data: { classOrPosition: string }) => {
    setSubmitting(true);
    try {
      const updated = await updateFullProfile({
        classOrPosition: data.classOrPosition,
      });
      setProfile(updated);
      notifyProfileUpdated(updated);
      await authClient.restore().catch(() => { });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangePassword = async (currentPass: string, newPass: string) => {
    setSubmitting(true);
    try {
      await changePassword({
        currentPassword: currentPass,
        newPassword: newPass,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header Card */}
      <View
        style={[
          styles.headerBar,
          {
            backgroundColor: theme.primary,
            paddingTop: insets.top + spacing.sm,
          },
        ]}
      >
        <View style={styles.titleRow}>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={hitSlop}
            accessibilityRole="button"
            accessibilityLabel="Kembali"
            style={styles.backButton}
          >
            <Image
              source={leftArrow}
              resizeMode="contain"
              style={[styles.backIcon, { tintColor: theme.onPrimary }]}
            />
          </Pressable>

          <Text
            accessibilityRole="header"
            style={[styles.headerTitle, { color: theme.onPrimary }]}
          >
            Pengaturan Profil
          </Text>
        </View>

        {/* Header Navbar */}
        <ProfileTabBar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {activeTab === 'Ubah Profil' ? (
          <FormProfile
            initialData={initialProfileData}
            onSubmit={handleUpdateProfile}
            loading={submitting}
          />
        ) : activeTab === 'Data Sekolah' ? (
          <FormDataSekolah
            schoolName={profile.schoolInfo.name}
            initialClassOrPosition={profile.classOrPosition}
            onSubmit={handleUpdateSchool}
            loading={submitting}
          />
        ) : (
          <FormPassword
            onSubmit={handleChangePassword}
            loading={submitting}
          />
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    paddingBottom: 2,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  titleRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  backButton: {
    position: 'absolute',
    left: spacing.md,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  headerTitle: {
    fontFamily: profileFonts.semiBold,
    fontSize: 20,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
});
