import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/shared/components/themed-text';
import { ThemedView } from '@/shared/components/themed-view';
import { Button } from '@/shared/components/ui/button';
import { TextField } from '@/shared/components/ui/text-field';
import { spacing } from '@/shared/theme';
import { useLoginForm } from '../hooks/use-login-form';

export function LoginScreen(): React.JSX.Element {
  const { email, password, errors, submitting, setEmail, setPassword, submit } =
    useLoginForm();

  return (
    <ThemedView style={styles.container}>
      <ThemedText variant="h1">Welcome back</ThemedText>
      <ThemedText variant="body" muted>
        Sign in to continue.
      </ThemedText>

      <View style={styles.form}>
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          errorText={errors.email}
        />
        <TextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
          errorText={errors.password}
        />
        {errors.form ? (
          <ThemedText variant="caption" style={styles.formError}>
            {errors.form}
          </ThemedText>
        ) : null}
        <Button title="Sign in" loading={submitting} onPress={submit} />
      </View>
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
  form: {
    marginTop: spacing.xl,
    gap: spacing.lg,
  },
  formError: {
    color: '#E5484D',
  },
});
