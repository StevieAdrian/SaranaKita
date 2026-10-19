import React, { useCallback, useRef } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type TextInputInstance,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/shared/components/ui/button';
import { TextField } from '@/shared/components/ui/text-field';
import { AuthDivider, AuthHeader, GoogleButton } from '../components';
import { authConstants } from '../constants/auth-constants';
import { useLoginForm } from '../hooks/use-login-form';

export function LoginScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const { email, password, errors, submitting, setEmail, setPassword, submit } =
    useLoginForm();
  const passwordRef = useRef<TextInputInstance>(null);

  const onForgotPassword = useCallback(() => {
    Alert.alert('Forgot Password', 'Fitur reset kata sandi segera hadir.');
  }, []);

  const onSignUp = useCallback(() => {
    navigation.navigate('Register');
  }, [navigation]);

  const onGoogle = useCallback(() => {
    Alert.alert('Google Sign-In', 'Fitur Google Sign-In segera hadir.');
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <AuthHeader
            title="Welcome Back!"
            subtitle="Let’s continue your healthy journey with us."
          />

          {/* Form */}
          <View style={styles.card}>
            <TextField
              label="Email"
              required
              value={email}
              onChangeText={setEmail}
              placeholder="johndoe@gmail.com"
              placeholderTextColor={authConstants.typography.inputPlaceholder.color}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              submitBehavior="submit"
              errorText={errors.email}
              labelStyle={styles.label}
              style={styles.input}
            />

            <TextField
              ref={passwordRef}
              label="Password"
              required
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••••"
              placeholderTextColor={authConstants.typography.inputPlaceholder.color}
              secureTextEntry
              autoComplete="password"
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={submit}
              errorText={errors.password}
              labelStyle={styles.label}
              style={styles.input}
            />

            <Pressable
              onPress={onForgotPassword}
              accessibilityRole="link"
              accessibilityLabel="Forgot Password?"
              style={styles.forgot}
            >
              <Text style={styles.linkText}>Forgot Password?</Text>
            </Pressable>

            {errors.form ? (
              <Text style={styles.formError} accessibilityLiveRegion="polite">
                {errors.form}
              </Text>
            ) : null}

            {/* Button */}
            <Button
              title="Continue"
              loading={submitting}
              onPress={submit}
              style={styles.continueButton}
            />


            <View style={styles.signUpRow}>
              <Text style={styles.signUpText}>Haven’t create an account? </Text>
              <Pressable
                onPress={onSignUp}
                accessibilityRole="link"
                accessibilityLabel="Sign Up"
              >
                <Text style={styles.linkText}>Sign Up</Text>
              </Pressable>
            </View>
          </View>

          <AuthDivider text="Or Continue With" />

          {/* Google Button */}
          <GoogleButton onPress={onGoogle} label="Google" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: authConstants.colors.backgroundBlue,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: authConstants.spacing.screenMargin,
    paddingTop: 32,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: authConstants.colors.surface,
    borderRadius: authConstants.components.card.borderRadius,
    borderWidth: authConstants.components.card.borderWidth,
    borderColor: authConstants.colors.ui.cardBorder,
    paddingVertical: authConstants.components.card.paddingVertical,
    paddingHorizontal: authConstants.components.card.paddingHorizontal,
    gap: authConstants.spacing.fieldGap,
  },
  label: {
    ...authConstants.typography.label,
  },
  input: {
    backgroundColor: authConstants.colors.surface,
    borderColor: authConstants.colors.ui.inputBorder,
    borderWidth: authConstants.components.input.borderWidth,
    borderRadius: authConstants.components.input.borderRadius,
    height: authConstants.components.input.height,
    ...authConstants.typography.inputText,
  },
  forgot: {
    alignSelf: 'flex-end',
    marginTop: -6,
  },
  linkText: {
    color: authConstants.colors.text.link,
    fontSize: 13,
    fontWeight: '600',
  },
  formError: {
    color: authConstants.colors.text.error,
    fontSize: 13,
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: authConstants.colors.ui.buttonPrimaryBg,
    borderRadius: authConstants.components.button.borderRadius,
    height: authConstants.components.button.height,
    marginTop: 4,
  },
  signUpRow: {

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  signUpText: {
    color: authConstants.colors.text.dark,
    fontSize: 13,
  },
});
