import React from 'react';
import { ThemedText } from '@/shared/components/themed-text';
import { ThemedView } from '@/shared/components/themed-view';
import { useCurrentUser } from '@/features/home/hooks/use-current-user';
import { StudentHistoryScreen } from './student-history-screen';
import { TeacherHistoryScreen } from './teacher-history-screen';
import { AdministratorHistoryScreen } from './administrator-history-screen';
import { StaffHistoryScreen } from './staff-history-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';
import { HomeHeader } from '@/features/home/components/home-header';
import { USER_ROLE } from '@/services/auth';

function ComingSoonHome(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const user = useCurrentUser();

  return (
    <View className="flex-1 bg-page">
      <View
        className="gap-5 bg-primary px-5 pb-8"
        style={{ paddingTop: insets.top + 24 }}
      >
        <HomeHeader name={user?.displayName ?? ''} schoolName={null} />
      </View>
      <View className="flex-1 items-center justify-center gap-2 px-8">
        <Text
          accessibilityRole="header"
          className="text-center text-lg font-bold text-gray-900"
        >
          Beranda belum tersedia
        </Text>
        <Text className="text-center text-sm text-gray-500">
          Halaman untuk peranmu masih dalam pengembangan. Nantikan pembaruan
          berikutnya.
        </Text>
      </View>
    </View>
  );
}

export function ReportHistoryScreen(): React.JSX.Element {
  const user = useCurrentUser();

  if (user?.role === USER_ROLE.SISWA) {
    return <StudentHistoryScreen />;
  }
  if (user?.role === USER_ROLE.GURU) {
    return <TeacherHistoryScreen />;
  }
  if (user?.role === USER_ROLE.ADMINISTRATOR) {
    return <AdministratorHistoryScreen />;
  }
  if (user?.role === USER_ROLE.STAFF) {
    return <StaffHistoryScreen />;
  }
  return <ComingSoonHome />;
}
