import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeHeader } from '../components/home-header';
import { useCurrentUser } from '../hooks/use-current-user';
import { StudentHomeScreen, TeacherHomeScreen } from './student-home-screen';

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

export function HomeScreen(): React.JSX.Element {
  const user = useCurrentUser();

  if (user?.role === 'siswa') {
    return <StudentHomeScreen />;
  }
  if (user?.role === 'guru') {
    return <TeacherHomeScreen />;
  }
  return <ComingSoonHome />;
}
