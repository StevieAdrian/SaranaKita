import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import rightArrow from '@/assets/images/right-arrow.png';
import userLogo from '@/assets/images/user-logo.png';
import settingIcon from '@/assets/images/vector-setting.png';
import { useRole } from '@/shared/context/theme-context';
import { profileFonts } from '../utils/constants';

export type ButtonManageProfileProps = {
  role?: string | null;
  onPressEditProfile: () => void;
  onPressUserManagement?: () => void;
};

export function ButtonManageProfile({
  role,
  onPressEditProfile,
  onPressUserManagement,
}: ButtonManageProfileProps): React.JSX.Element {
  const { theme, currentRole } = useRole();
  const effectiveRole = role ?? currentRole;
  const showEditProfile = true;
  const showUserManagement =
    effectiveRole === 'staff' || effectiveRole === 'administrator';

  const buttonBgColor =
    theme.primary || (effectiveRole === 'administrator' ? '#360707' : '#112D71');
  const textColor = theme.onPrimary || '#FFFFFF';

  return (
    <View style={styles.container}>
      {/* Button Profile */}
      {showEditProfile && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPressEditProfile}
          accessibilityRole="button"
          accessibilityLabel="Ubah Data Diri"
          style={[styles.actionButton, { backgroundColor: buttonBgColor }]}
        >
          <View style={styles.leftGroup}>
            <Image
              source={settingIcon}
              resizeMode="contain"
              style={[styles.actionIcon, { tintColor: textColor }]}
            />
            <Text style={[styles.actionLabel, { color: textColor }]}>
              Ubah Data Diri
            </Text>
          </View>

          <Image
            source={rightArrow}
            resizeMode="contain"
            style={[styles.arrowIcon, { tintColor: textColor }]}
          />
        </TouchableOpacity>
      )}

      {/* Button User Management */}
      {showUserManagement && onPressUserManagement ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPressUserManagement}
          accessibilityRole="button"
          accessibilityLabel="Manajemen Profil Pengguna"
          style={[
            styles.actionButton,
            styles.manageButton,
            { backgroundColor: buttonBgColor },
          ]}
        >
          <View style={styles.leftGroup}>
            <Image
              source={userLogo}
              resizeMode="contain"
              style={[styles.actionIcon, { tintColor: textColor }]}
            />
            <View style={styles.manageTextGroup}>
              <Text style={[styles.manageTitle, { color: textColor }]}>
                Manajemen Profil Pengguna
              </Text>
              <Text style={[styles.manageSubtitle, { color: textColor }]}>
                Kelola profil Siswa, Guru & Staff sekolah
              </Text>
            </View>
          </View>

          <Image
            source={rightArrow}
            resizeMode="contain"
            style={[styles.arrowIcon, { tintColor: textColor }]}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 12,
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  manageButton: {
    height: 70,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  actionIcon: {
    width: 22,
    height: 22,
  },
  actionLabel: {
    fontFamily: profileFonts.semiBold,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
  },
  manageTextGroup: {
    flex: 1,
  },
  manageTitle: {
    fontFamily: profileFonts.semiBold,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
  },
  manageSubtitle: {
    fontFamily: profileFonts.regular,
    fontSize: 10.5,
    fontWeight: Platform.OS === 'ios' ? '400' : undefined,
    marginTop: 2,
    opacity: 0.85,
  },
  arrowIcon: {
    width: 14,
    height: 14,
  },
});

