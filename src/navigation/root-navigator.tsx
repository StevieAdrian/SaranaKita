import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSession } from '@/features/auth/hooks/use-session';
import { NotFoundScreen } from '@/features/auth/screens/transitions';
import { ProfileSettingsScreen } from '@/features/profile';
import {
  CreateReportScreen,
  EditReportScreen,
  ReportDetailScreen,
  ReportManagementDetailScreen,
} from '@/features/report';
import { AddUserScreen, EditUserScreen, UserManagementScreen } from '@/features/user-management';
import { AuthNavigator } from './auth-navigator';
import { TabNavigator } from './tab-navigator';
import type { RootStackParamList } from './types';
import { ReportEvaluationsScreen } from '@/features/history/screen/report-evaluations-screen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator(): React.JSX.Element {
  const session = useSession();
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
            <Stack.Screen name="ManagementReportDetail" component={ReportManagementDetailScreen} />
            <Stack.Screen name="EditReport" component={EditReportScreen} />
            <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
            <Stack.Screen name="UserManagement" component={UserManagementScreen} />
            <Stack.Screen name="AddUser" component={AddUserScreen} />
            <Stack.Screen name="EditUser" component={EditUserScreen} />
            <Stack.Screen name="EvaluationReport" component={ReportEvaluationsScreen} />
          </Stack.Group>
        )}
        <Stack.Screen name="NotFound" component={NotFoundScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

