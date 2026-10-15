import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import rightArrow from '@/assets/images/right-arrow.png';
import userLogo from '@/assets/images/user-logo.png';
import settingIcon from '@/assets/images/vector-setting.png';
import { useRole } from '@/shared/context/theme-context';
import { radius, spacing } from '@/shared/theme';

export type ButtonManageProfileProps = {
  onPressEditProfile: () => void;
  onPressUserManagement?: () => void;
};

export function ButtonManageProfile({
  onPressEditProfile,
  onPressUserManagement,
}: ButtonManageProfileProps): React.JSX.Element {
  const { theme, currentRole } = useRole();
  const showUserManagement =
    currentRole === 'staff' || currentRole === 'administrator';

  return (
    <View style={styles.container}>
      {/* Button Profile */}
      <Pressable
        onPress={onPressEditProfile}
        accessibilityRole="button"
        accessibilityLabel="Ubah Data Diri"
        style={({ pressed }) => [
          styles.actionButton,
          {
            backgroundColor: theme.primary,
          },
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.leftGroup}>
          <Image
            source={settingIcon}
            resizeMode="contain"
            style={[styles.actionIcon, { tintColor: theme.onPrimary }]}
          />
          <Text style={[styles.actionLabel, { color: theme.onPrimary }]}>
            Ubah Data Diri
          </Text>
        </View>

        <Image
          source={rightArrow}
          resizeMode="contain"
          style={[styles.arrowIcon, { tintColor: theme.onPrimary }]}
        />
      </Pressable>

      {/* Button User Management */}
      {showUserManagement && onPressUserManagement ? (
        <Pressable
          onPress={onPressUserManagement}
          accessibilityRole="button"
          accessibilityLabel="Manajemen Profile Pengguna"
          style={({ pressed }) => [
            styles.actionButton,
            styles.manageButton,
            {
              backgroundColor:
                currentRole === 'administrator'
                  ? theme.primary
                  : '#112D71',
            },
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.leftGroup}>
            <Image
              source={userLogo}
              resizeMode="contain"
              style={[styles.actionIcon, styles.whiteTint]}
            />
            <View>
              <Text style={[styles.actionLabel, styles.whiteText]}>
                Manajemen Profile Pengguna
              </Text>
              <Text style={styles.manageSubtitle}>
                Kelola profile user & staff sekolah
              </Text>
            </View>
          </View>

          <Image
            source={rightArrow}
            resizeMode="contain"
            style={[styles.arrowIcon, styles.whiteTint]}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    borderRadius: radius.lg,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  manageButton: {
    paddingVertical: 12,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionIcon: {
    width: 20,
    height: 20,
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  manageSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 1,
  },
  arrowIcon: {
    width: 14,
    height: 14,
  },
  pressed: {
    opacity: 0.85,
  },
  whiteTint: {
    tintColor: '#FFFFFF',
  },
  whiteText: {
    color: '#FFFFFF',
  },
});
