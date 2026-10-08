import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/shared/components/themed-text';
import { ThemedView } from '@/shared/components/themed-view';
import { Button } from '@/shared/components/ui/button';
import { spacing } from '@/shared/theme';
import { useOnboarding } from '../hooks/use-onboarding';
import type { OnboardingSlide } from '../types';

const SLIDES: readonly OnboardingSlide[] = [
  {
    key: 'welcome',
    title: 'Welcome to SaranaKita',
    description: 'Everything you need, in one place.',
  },
];

export function OnboardingScreen(): React.JSX.Element {
  const { complete } = useOnboarding();
  const slide = SLIDES[0];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText variant="h1">{slide?.title}</ThemedText>
        <ThemedText variant="body" muted>
          {slide?.description}
        </ThemedText>
      </View>
      <Button title="Get started" onPress={complete} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.sm,
  },
});
