import React, { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import leftArrow from '@/assets/images/left-arrow.png';
import {
  changePassword,
  updateFullProfile,
} from '@/services/profile';
import { useRole } from '@/shared/context/theme-context';
import { hitSlop, spacing } from '@/shared/theme';
import { FormDataSekolah } from '../components/form-data-sekolah';
import { FormPassword } from '../components/form-password';
import { FormProfile, type ProfileFormData } from '../components/form-profile';
import { ProfileTabBar } from '../components/profile-tab-bar';
import { useProfileScreen } from '../hooks/use-profile-screen';
import type { ProfileTab } from '../utils/constants';

export function ProfileSettingsScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme } = useRole();
  const { profile, reload } = useProfileScreen();

  const [activeTab, setActiveTab] = useState<ProfileTab>('Ubah Profile');
  const [submitting, setSubmitting] = useState(false);

  const handleUpdateProfile = async (data: ProfileFormData) => {
    setSubmitting(true);
    try {
      await updateFullProfile({
        displayName: data.fullName,
        phone: data.phone,
        birthDate: data.birthDate,
        gender: data.gender,
        avatarUrl: data.avatarUrl,
      });
      await reload();
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateSchool = async (data: { classOrPosition: string }) => {
    setSubmitting(true);
    try {
      await updateFullProfile({
        classOrPosition: data.classOrPosition,
      });
      await reload();
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
            Pengaturan Profile
          </Text>
        </View>

        {/* Header Navbar */}
        <ProfileTabBar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />
      </View>

      <View style={styles.content}>
        {activeTab === 'Ubah Profile' ? (
          <FormProfile
            initialData={{
              fullName: profile.fullName,
              email: profile.email,
              phone: profile.phone,
              birthDate: profile.birthDate,
              gender: profile.gender,
              avatarUrl: profile.avatarUrl,
            }}
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
      </View>
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
    minHeight: 44,
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
    justifyContent: 'center',
  },
  backIcon: {
    width: 22,
    height: 22,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
});
