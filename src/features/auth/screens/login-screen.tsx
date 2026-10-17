import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Image,
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
import logo from '../../../../assets/images/logo-saranakita.png';
import { Button } from '@/shared/components/ui/button';
import { TextField } from '@/shared/components/ui/text-field';
import { hitSlop, palette, radius, spacing } from '@/shared/theme';
import { useLoginForm } from '../hooks/use-login-form';

const LOGO_WIDTH = 100;
const LOGO_HEIGHT = Math.round((LOGO_WIDTH * 29) / 124);

const INPUT_BORDER = '#D0D5DD';
const PLACEHOLDER = '#98A2B3';
const TEXT = '#101828';

function comingSoon(feature: string): void {
  Alert.alert(feature, 'This feature is coming soon.');
}

export function LoginScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const { email, password, errors, submitting, setEmail, setPassword, submit } =
    useLoginForm();
  const passwordRef = useRef<TextInputInstance>(null);
  const [googlePressed, setGooglePressed] = useState(false);


  const onForgotPassword = useCallback(() => comingSoon('Forgot Password'), []);
  const onSignUp = useCallback(() => comingSoon('Sign Up'), []);
  const onGoogle = useCallback(() => comingSoon('Google Sign-In'), []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Image
              source={logo}
              style={styles.logo}
              resizeMode="contain"
              accessibilityRole="image"
              accessibilityLabel="SaranaKita"
            />
            <Text style={styles.title} accessibilityRole="header">
              Welcome Back!
            </Text>
            <Text style={styles.subtitle}>
              Let’s continue your healthy journey with us.
            </Text>
          </View>

          <View style={styles.card}>
            <TextField
              label="Email"
              required
              value={email}
              onChangeText={setEmail}
              placeholder="johndoe@gmail.com"
              placeholderTextColor={PLACEHOLDER}
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
              placeholderTextColor={PLACEHOLDER}
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
              hitSlop={hitSlop}
              style={styles.forgot}
            >
              <Text style={styles.link}>Forgot Password?</Text>
            </Pressable>

            {errors.form ? (
              <Text style={styles.formError} accessibilityLiveRegion="polite">
                {errors.form}
              </Text>
            ) : null}

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
                hitSlop={hitSlop}
              >
                <Text style={[styles.link, styles.bold]}>Sign Up</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.dividerRow} accessibilityElementsHidden>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or Continue With</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable
            onPress={onGoogle}
            onPressIn={() => setGooglePressed(true)}
            onPressOut={() => setGooglePressed(false)}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
            style={[styles.googleButton, googlePressed && styles.pressed]}
          >
            <Text style={styles.googleMark}>G</Text>
            <Text style={styles.googleText}>Google</Text>
          </Pressable>

          {/* Button Testing - Temporary */}
          <View>
            <Text>-- DEV TESTING BUTTONS --</Text>
            <View>
              <Pressable
                onPress={() => navigation.navigate('NotFound')}>
                <Text>Test Page 404</Text>
              </Pressable>
              <Pressable
                onPress={() => navigation.navigate('Loading')}>
                <Text>Test Loading</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.brand,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl + spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
    marginBottom: spacing.lg,
  },
  title: {
    color: palette.white,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    textAlign: 'center',
  },
  subtitle: {
    color: palette.white,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: spacing.xs,
    maxWidth: 260,
  },
  card: {
    backgroundColor: palette.white,
    borderRadius: radius.md,
    padding: spacing.lg,
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
  label: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
  },
  input: {
    backgroundColor: palette.white,
    borderColor: INPUT_BORDER,
    borderWidth: 1,
    borderRadius: radius.sm,
    color: TEXT,
    fontSize: 14,
  },
  forgot: {
    alignSelf: 'flex-end',
  },
  link: {
    color: palette.link,
    fontSize: 13,
    fontWeight: '500',
  },
  bold: {
    fontWeight: '600',
  },
  formError: {
    color: palette.danger,
    fontSize: 13,
  },
  continueButton: {
    backgroundColor: palette.black,
    borderRadius: radius.sm,
  },
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: spacing.xs,
  },
  signUpText: {
    color: TEXT,
    fontSize: 13,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: palette.white,
    opacity: 0.8,
  },
  dividerText: {
    color: palette.white,
    fontSize: 13,
    fontWeight: '500',
  },
  googleButton: {
    minHeight: 44,
    marginHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: palette.white,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
  },
  pressed: {
    opacity: 0.7,
  },
  googleMark: {
    color: '#4285F4',
    fontSize: 16,
    fontWeight: '700',
  },
  googleText: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '600',
  },
});
