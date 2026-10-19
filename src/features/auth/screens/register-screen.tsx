import React from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
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
      <StatusBar barStyle="light-content" />
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
          <View style={styles.centerBlock}>
            <AuthHeader
              title="Get Started Now"
              subtitle="Create an account and start your healthy journey together."
            />
          </View>

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
              placeholder="087223627139"
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
            <TouchableOpacity
              onPress={submit}
              disabled={submitting}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Continue"
              style={[
                styles.continueButton,
                submitting && styles.buttonDisabled,
              ]}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.continueButtonText}>Continue</Text>
              )}
            </TouchableOpacity>

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

          <View style={styles.bottomBlock}>
            <AuthDivider text="Or Continue With" />
            <GoogleButton onPress={handleGooglePress} label="Google" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: authConstants.colors.brand,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 48,
    alignItems: 'center',
  },
  centerBlock: {
    width: '100%',
    maxWidth: 369,
    alignSelf: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 369,
    alignSelf: 'center',
    backgroundColor: authConstants.colors.surface,
    borderRadius: authConstants.components.card.borderRadius,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: authConstants.components.card.paddingVertical,
    paddingHorizontal: authConstants.components.card.paddingHorizontal,
    gap: 18,
  },
  bottomBlock: {
    width: '100%',
    maxWidth: 369,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  label: {
    fontFamily: authConstants.typography.label.fontFamily,
    fontSize: 16,
    fontWeight: '500',
    color: authConstants.colors.text.dark,
  },
  input: {
    backgroundColor: authConstants.colors.surface,
    borderColor: authConstants.colors.ui.inputBorderLight,
    borderWidth: authConstants.components.input.borderWidth,
    borderRadius: authConstants.components.input.borderRadius,
    height: authConstants.components.input.height,
    fontFamily: authConstants.typography.inputText.fontFamily,
    fontSize: 14,
    color: authConstants.colors.text.dark,
  },
  formError: {
    color: authConstants.colors.text.error,
    fontSize: 13,
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: authConstants.colors.ui.buttonBlack,
    borderRadius: authConstants.components.button.borderRadius,
    height: authConstants.components.button.height,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    fontFamily: authConstants.typography.buttonText.fontFamily,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
    color: authConstants.colors.text.light,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 14,
  },
  loginText: {
    color: authConstants.colors.text.dark,
    fontSize: 14,
    fontFamily: authConstants.typography.inputText.fontFamily,
  },
  linkText: {
    color: authConstants.colors.brand,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
    fontFamily: authConstants.typography.link.fontFamily,
  },
});
