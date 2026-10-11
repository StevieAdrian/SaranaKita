import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSession } from '@/features/auth';
import { CreateReportScreen, ReportDetailScreen } from '@/features/report';
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
