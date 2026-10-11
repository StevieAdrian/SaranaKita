import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { authClient } from '@/services/auth';
import { ThemedText } from '@/shared/components/themed-text';
import { ThemedView } from '@/shared/components/themed-view';
import { Button } from '@/shared/components/ui/button';
import { spacing } from '@/shared/theme';
import { useProfile } from '../hooks/use-profile';

export function ProfileScreen(): React.JSX.Element {
  const { profile, loading, error, reload } = useProfile();

  return (
    <ThemedView style={styles.container}>
      <ThemedText variant="h1">Profile</ThemedText>

      {loading ? (
        <ActivityIndicator />
      ) : error ? (
        <View style={styles.block}>
          <ThemedText variant="body" muted>
            {error}
          </ThemedText>
          <Button title="Retry" variant="secondary" onPress={reload} />
        </View>
      ) : profile ? (
        <View style={styles.block}>
          <ThemedText variant="title">{profile.displayName}</ThemedText>
          <ThemedText variant="body" muted>
            {profile.email}
          </ThemedText>
        </View>
      ) : null}

      <Button
        title="Sign out"
        variant="secondary"
        onPress={authClient.signOut}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    gap: spacing.xl,
  },
  block: {
    gap: spacing.sm,
  },
});
