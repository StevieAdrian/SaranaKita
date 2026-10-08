import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/shared/components/themed-text';
import { ThemedView } from '@/shared/components/themed-view';
import { spacing } from '@/shared/theme';

export function HomeScreen(): React.JSX.Element {
  return (
    <ThemedView style={styles.container}>
      <ThemedText variant="h1">Home</ThemedText>
      <ThemedText variant="body" muted>
        You are signed in.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    gap: spacing.sm,
    justifyContent: 'center',
  },
});
