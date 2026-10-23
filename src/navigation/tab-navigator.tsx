import React from 'react';
import { Image, View, type ImageSourcePropType } from 'react-native';
import {
  createBottomTabNavigator,
  type BottomTabBarProps,
  type BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import homeIcon from '../../assets/images/home-logo.png';
import statisticIcon from '../../assets/images/statistic-logo.png';
import createIcon from '../../assets/images/create-logo.png';
import historyIcon from '../../assets/images/history-logo.png';
import userIcon from '../../assets/images/user-logo.png';
import { HomeScreen } from '@/features/home';
import { ProfileScreen } from '@/features/profile';
import { StatisticScreen } from '@/features/statistic';
import { ReportHistoryScreen } from '@/features/report';
import { BottomTabBar } from './components/bottom-tab-bar';
import type { TabParamList } from './types';
import { palette } from '@/shared/theme';
import { adminTheme, staffTheme } from '@/shared/theme/colors';
import { useCurrentUser } from '@/features/home/hooks/use-current-user';

const Tab = createBottomTabNavigator<TabParamList>();

const EmptyScreen = () => null;
const ROLE_COLORS: Record<string, string> = {
  siswa: palette.primary,
  guru: palette.teacherPrimary,
  staff: staffTheme.primary,
  administrator: adminTheme.primary,
};

function tintedIcon(
  source: ImageSourcePropType,
): BottomTabNavigationOptions['tabBarIcon'] {
  return ({ color, size }) => (
    <Image
      source={source}
      resizeMode="contain"
      style={{ width: size, height: size, tintColor: color }}
    />
  );
}

export function TabNavigator(): React.JSX.Element {
  const user = useCurrentUser();
  const createColor = ROLE_COLORS[user?.role ?? ''] ?? palette.primary;

  const createTabIcon: BottomTabNavigationOptions['tabBarIcon'] = () => (
    <View
      className="h-10 w-10 items-center justify-center rounded-md"
      style={{ backgroundColor: createColor }}
    >
      <Image
        source={createIcon}
        resizeMode="contain"
        style={{ width: 24, height: 24, tintColor: '#FFFFFF' }}
      />
    </View>
  );
  const renderTabBar = (props: BottomTabBarProps) => (
    <BottomTabBar {...props} />
  );

  return (
    <Tab.Navigator tabBar={renderTabBar} screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Beranda', tabBarIcon: tintedIcon(homeIcon) }}
      />
      <Tab.Screen
        name="Statistic"
        component={StatisticScreen}
        options={{ title: 'Statistik', tabBarIcon: tintedIcon(statisticIcon) }}
      />
      <Tab.Screen
        name="CreateReportTab"
        component={EmptyScreen}
        options={{ title: 'Buat Laporan', tabBarIcon: createTabIcon }}
        listeners={({ navigation }) => ({
          tabPress: event => {
            event.preventDefault();
            navigation.getParent()?.navigate('CreateReport');
          },
        })}
      />
      <Tab.Screen
        name="ReportHistory"
        component={ReportHistoryScreen}
        options={{
          title: 'Riwayat Laporan',
          tabBarIcon: tintedIcon(historyIcon),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profil', tabBarIcon: tintedIcon(userIcon) }}
      />
    </Tab.Navigator>
  );
}
