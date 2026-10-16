import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSession } from '@/features/auth';
import { ProfileSettingsScreen } from '@/features/profile';
import { CreateReportScreen, EditReportScreen, ReportDetailScreen } from '@/features/report';
import { AddUserScreen, EditUserScreen, UserManagementScreen } from '@/features/user-management';
import { AuthNavigator } from './auth-navigator';
import { TabNavigator } from './tab-navigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator(): React.JSX.Element {
  const session = useSession();

  if (session.status === 'unknown') {
    return (
      <View style={styles.splash}>
        <ActivityIndicator />
      </View>
    );
  }

  const needsAuth = session.status !== 'authenticated';

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {needsAuth ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Group>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen name="CreateReport" component={CreateReportScreen} />
            <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
            <Stack.Screen name="EditReport" component={EditReportScreen} />
            <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
            <Stack.Screen name="UserManagement" component={UserManagementScreen} />
            <Stack.Screen name="AddUser" component={AddUserScreen} />
            <Stack.Screen name="EditUser" component={EditUserScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
