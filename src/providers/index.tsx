import React, { useEffect, type PropsWithChildren } from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { authClient } from '@/services/auth';
import { AccessibilityProvider } from '@/shared/accessibility/accessibility-context';

export function AppProviders({ children }: PropsWithChildren): React.JSX.Element {
  const isDark = useColorScheme() === 'dark';

  useEffect(() => {
    authClient.restore().catch(() => {});
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <AccessibilityProvider>{children}</AccessibilityProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
