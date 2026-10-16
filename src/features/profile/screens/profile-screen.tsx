import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRole } from '@/shared/context/theme-context';
import { ButtonManageProfile } from '../components/button-manage-profile';
import { CardContribution } from '../components/card-contribution';
import { CardSchoolInformation } from '../components/card-school-information';
import { HeaderCardProfile } from '../components/header-card-profile';
import { LogoutCard } from '../components/logout-card';
import { ProfileSummaryCard } from '../components/profile-summary-card';
import { useProfileScreen } from '../hooks/use-profile-screen';

export function ProfileScreen(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { theme, currentRole } = useRole();
  const { profile, loading, reload } = useProfileScreen();

  const handleEditProfile = () => {
    navigation.navigate('ProfileSettings');
  };

  const handleUserManagement = () => {
    navigation.navigate('UserManagement');
  };

  const isGuru = currentRole === 'guru';
  const subtitle = isGuru
    ? `${profile.classOrPosition || 'Guru Matematika'} · ${profile.schoolInfo.name}`
    : currentRole === 'staff'
      ? `Staff · ${profile.schoolInfo.name}`
      : currentRole === 'administrator'
        ? `Administrator · ${profile.schoolInfo.name}`
        : `Kelas ${profile.classOrPosition || 'XII-B'} · ${profile.schoolInfo.name}`;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
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
        <HeaderCardProfile schoolName={profile.schoolInfo.name} />

        {/* Header Card Profile */}
        <ProfileSummaryCard
          name={profile.fullName}
          subtitle={subtitle}
          role={currentRole}
          avatarUrl={profile.avatarUrl}
        />

        {/* Button Profile & User Management*/}
        <ButtonManageProfile
          onPressEditProfile={handleEditProfile}
          onPressUserManagement={handleUserManagement}
        />

        {/* Card Kontribusi */}
        <CardContribution
          reportsCreated={profile.stats.reportsCreated}
          votesOrRecommendations={
            isGuru
              ? profile.stats.recommendationsCount
              : profile.stats.votesCount
          }
          pendingConfirmation={profile.stats.pendingConfirmation}
          inReview={profile.stats.inReview}
          inRepair={profile.stats.inRepair}
          rejected={profile.stats.rejected}
          resolved={profile.stats.resolved}
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
