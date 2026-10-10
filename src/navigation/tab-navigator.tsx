import React from 'react';
import { Image, type ImageSourcePropType } from 'react-native';
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
import { HomeScreen, ProfileScreen } from '@/features/home';
import { StatisticScreen } from '@/features/statistic';
import { CreateReportScreen, ReportHistoryScreen } from '@/features/report';
import { BottomTabBar } from './components/bottom-tab-bar';
import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

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

const createTabIcon: BottomTabNavigationOptions['tabBarIcon'] = () => (
  <Image source={createIcon} resizeMode="contain" className="h-10 w-10" />
);

const renderTabBar = (props: BottomTabBarProps) => <BottomTabBar {...props} />;

export function TabNavigator(): React.JSX.Element {
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
        name="CreateReport"
        component={CreateReportScreen}
        options={{ title: 'Buat Laporan', tabBarIcon: createTabIcon }}
      />
      <Tab.Screen
        name="ReportHistory"
        component={ReportHistoryScreen}
        options={{ title: 'Riwayat Laporan', tabBarIcon: tintedIcon(historyIcon) }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profil', tabBarIcon: tintedIcon(userIcon) }}
      />
    </Tab.Navigator>
  );
}
