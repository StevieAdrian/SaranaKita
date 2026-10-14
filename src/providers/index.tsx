import React, { useEffect, useSyncExternalStore, type PropsWithChildren } from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { authClient, type UserRole } from '@/services/auth';
import { AccessibilityProvider } from '@/shared/accessibility/accessibility-context';
import { ThemeProvider } from '@/shared/context/theme-context';

function selectRole(): UserRole | null {
  return authClient.getState().user?.role ?? null;
}

export function AppProviders({ children }: PropsWithChildren): React.JSX.Element {
  const isDark = useColorScheme() === 'dark';
  const role = useSyncExternalStore(authClient.subscribe, selectRole);

  useEffect(() => {
    authClient.restore().catch(() => { });
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <ThemeProvider role={role}>
          <AccessibilityProvider>{children}</AccessibilityProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
