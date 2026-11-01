import React, { useCallback } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRole } from '@/shared/context/theme-context';
import { ButtonManageProfile } from '../components/button-manage-profile';
import { CardContribution } from '../components/card-contribution';
import { CardSchoolInformation } from '../components/card-school-information';
import { HeaderCardProfile } from '../components/header-card-profile';
import { LogoutCard } from '../components/logout-card';
import { ProfileSummaryCard } from '../components/profile-summary-card';
import { useProfileScreen } from '../hooks/use-profile-screen';
import { formatRoleTitle, profileColors } from '../utils/constants';

export function ProfileScreen(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { theme, currentRole } = useRole();
  const { profile, loading, reload } = useProfileScreen();

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const handleEditProfile = () => {
    navigation.navigate('ProfileSettings');
  };

  const handleUserManagement = () => {
    navigation.navigate('UserManagement');
  };

  const roleTitle = formatRoleTitle(currentRole, profile.classOrPosition);
  const schoolText = profile.schoolInfo.name ? ` · ${profile.schoolInfo.name}` : '';
  const subtitle = `${roleTitle}${schoolText}`;

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundSubtle || profileColors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={reload}
            tintColor={theme.primary}
          />
        }
      >
        {/* Header */}
        <HeaderCardProfile
          schoolName={profile.schoolInfo.name}
          role={currentRole}
        />

        {/* Header Card Profile - Siswa, Guru, Staff */}
        {currentRole !== 'administrator' && (
          <ProfileSummaryCard
            name={profile.fullName}
            subtitle={subtitle}
            role={currentRole}
            avatarUrl={profile.avatarUrl}
            gender={profile.gender}
          />
        )}

        {/* Button Profile & User Management */}
        <ButtonManageProfile
          role={currentRole}
          onPressEditProfile={handleEditProfile}
          onPressUserManagement={handleUserManagement}
        />

        {/* Card Kontribusi */}
        <CardContribution
          role={currentRole}
          reportsCreated={profile.stats.reportsCreated}
          votesOrRecommendations={
            currentRole === 'guru'
              ? profile.stats.recommendationsCount
              : profile.stats.votesCount
          }
          reportsRejected={profile.stats.reportsRejected}
          reportsVerified={profile.stats.reportsVerified}
          {...{
            'Menunggu Verifikasi': profile.stats['Menunggu Verifikasi'],
            'Dalam Pemeriksaan': profile.stats['Dalam Pemeriksaan'],
            'Dalam Perbaikan': profile.stats['Dalam Perbaikan'],
            'Selesai': profile.stats['Selesai'],
            'Ditolak': profile.stats['Ditolak'],
          }}
        />

        {/* Card Informasi Sekolah */}
        <CardSchoolInformation school={profile.schoolInfo} />

        {/* LogOut Card */}
        <LogoutCard />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
});
