import React from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/shared/components/ui/button';
import { TextField } from '@/shared/components/ui/text-field';
import { AuthDivider, AuthHeader, ClassSelectField, DateOfBirthField, GenderRadioField, GoogleButton, UsernameInput } from '../components';
import { authConstants } from '../constants/auth-constants';
import { useRegisterForm } from '../hooks/use-register-form';

export function RegisterScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const {
    username,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    phone,
    dateOfBirth,
    classGrade,
    gender,
    usernameStatus,
    errors,
    submitting,
    setUsername,
    setFirstName,
    setLastName,
    setEmail,
    setPassword,
    setConfirmPassword,
    setPhone,
    setDateOfBirth,
    setClassGrade,
    setGender,
    submit,
  } = useRegisterForm();

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleGooglePress = () => {
    Alert.alert('Google Sign-Up', 'Fitur Google Sign-Up segera hadir.');
  };

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
            title="Get Started Now"
            subtitle="Create an account and start your healthy journey together."
          />

          {/* Register Form */}
          <View style={styles.card}>
            <UsernameInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              status={usernameStatus}
              errorText={errors.username}
              required
            />

            {/* 2. First Name & Last Name (Side by side row) */}
            <View style={styles.row}>
              <View style={styles.flex}>
                <TextField
                  label="First Name"
                  required
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Doe"
                  placeholderTextColor={authConstants.typography.inputPlaceholder.color}
                  errorText={errors.firstName}
                  labelStyle={styles.label}
                  style={styles.input}
                />
              </View>
              <View style={styles.flex}>
                <TextField
                  label="Last Name"
                  required
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Doe"
                  placeholderTextColor={authConstants.typography.inputPlaceholder.color}
                  errorText={errors.lastName}
                  labelStyle={styles.label}
                  style={styles.input}
                />
              </View>
            </View>

            <TextField
              label="Email"
              required
              value={email}
              onChangeText={setEmail}
              placeholder="johndoe@gmail.com"
              placeholderTextColor={authConstants.typography.inputPlaceholder.color}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              errorText={errors.email}
              labelStyle={styles.label}
              style={styles.input}
            />

            <TextField
              label="Password"
              required
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••••"
              placeholderTextColor={authConstants.typography.inputPlaceholder.color}
              secureTextEntry
              errorText={errors.password}
              labelStyle={styles.label}
              style={styles.input}
            />

            <TextField
              label="Confirm Password"
              required
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••••"
              placeholderTextColor={authConstants.typography.inputPlaceholder.color}
              secureTextEntry
              errorText={errors.confirmPassword}
              labelStyle={styles.label}
              style={styles.input}
            />

            <TextField
              label="Phone Number"
              required
              value={phone}
              onChangeText={setPhone}
              placeholder="08123456789"
              placeholderTextColor={authConstants.typography.inputPlaceholder.color}
              keyboardType="phone-pad"
              errorText={errors.phone}
              labelStyle={styles.label}
              style={styles.input}
            />

            <DateOfBirthField
              value={dateOfBirth}
              onChange={setDateOfBirth}
              errorText={errors.dateOfBirth}
              required
            />

            <ClassSelectField
              value={classGrade || null}
              onChange={setClassGrade}
              errorText={errors.classGrade}
              required
            />

            <GenderRadioField
              value={gender}
              onChange={setGender}
              errorText={errors.gender}
              required
            />

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

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <Pressable
                onPress={handleLoginPress}
                accessibilityRole="link"
                accessibilityLabel="Log In"
              >
                <Text style={styles.linkText}>Log In</Text>
              </Pressable>
            </View>
          </View>

          <AuthDivider text="Or Continue With" />

          {/* Google Button */}
          <GoogleButton onPress={handleGooglePress} label="Google" />
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
  row: {
    flexDirection: 'row',
    gap: 12,
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
  formError: {
    color: authConstants.colors.text.error,
    fontSize: 13,
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: authConstants.colors.ui.buttonPrimaryBg,
    borderRadius: authConstants.components.button.borderRadius,
    height: authConstants.components.button.height,
    marginTop: 8,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  loginText: {
    color: authConstants.colors.text.dark,
    fontSize: 13,
  },
  linkText: {
    color: authConstants.colors.text.link,
    fontSize: 13,
    fontWeight: '600',
  },
});
