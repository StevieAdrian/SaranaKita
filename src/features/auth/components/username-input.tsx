import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, View, type StyleProp, type TextInputProps, type TextStyle, type ViewStyle } from 'react-native';
import verifiedCheckmark from '@/assets/images/verified-checkmark.png';
import unverifiedCrossmark from '@/assets/images/unverified-crossmark.png';
import { authConstants } from '../constants/auth-constants';
import type { UsernameStatus } from '../types';

export type UsernameInputProps = Omit<TextInputProps, 'style'> & {
  label?: string;
  required?: boolean;
  status?: UsernameStatus;
  errorText?: string;
  hideLabel?: boolean;
  labelStyle?: StyleProp<TextStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
};

export function UsernameInput({
  label = 'Username',
  required = true,
  status = 'idle',
  errorText,
  value,
  onChangeText,
  hideLabel = false,
  labelStyle,
  wrapperStyle,
  ...rest
}: UsernameInputProps): React.JSX.Element {
  const hasError = Boolean(errorText) || status === 'taken' || status === 'invalid';
  const isSuccess = status === 'available';

  const defaultBorderColor = hasError
    ? authConstants.colors.text.error
    : isSuccess
      ? authConstants.colors.text.success
      : authConstants.colors.ui.inputBorderLight;

  return (
    <View style={styles.container}>
      {!hideLabel ? (
        <Text style={[styles.label, labelStyle]}>
          {label}
          {required ? <Text style={styles.requiredAsterisk}> *</Text> : null}
        </Text>
      ) : null}

      <View style={[styles.inputWrapper, wrapperStyle, { borderColor: defaultBorderColor }]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="SaranaKita"
          placeholderTextColor={authConstants.typography.inputPlaceholder.color}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          accessibilityLabel={required ? `${label}, wajib` : label}
          accessibilityHint={hasError ? errorText : undefined}
          {...rest}
        />

        <View style={styles.indicatorContainer} pointerEvents="none">
          {status === 'checking' ? (
            <ActivityIndicator size="small" color={authConstants.colors.brand} />
          ) : isSuccess ? (
            <Image
              source={verifiedCheckmark}
              style={styles.statusIcon}
              resizeMode="contain"
              accessibilityLabel="Username tersedia"
            />
          ) : status === 'taken' || status === 'invalid' ? (
            <Image
              source={unverifiedCrossmark}
              style={styles.statusIcon}
              resizeMode="contain"
              accessibilityLabel="Username tidak tersedia"
            />
          ) : null}
        </View>
      </View>

      {errorText ? (
        <Text style={styles.errorText} accessibilityLiveRegion="polite">
          {errorText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: authConstants.spacing.labelToInput,
  },
  label: {
    ...authConstants.typography.label,
  },
  requiredAsterisk: {
    color: authConstants.colors.text.error,
  },
  inputWrapper: {
    height: authConstants.components.input.height,
    borderRadius: authConstants.components.input.borderRadius,
    borderWidth: authConstants.components.input.borderWidth,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: authConstants.components.input.paddingHorizontal,
    backgroundColor: authConstants.colors.surface,
  },
  input: {
    flex: 1,
    height: '100%',
    ...authConstants.typography.inputText,
    paddingVertical: 0,
  },
  indicatorContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  statusIcon: {
    width: 18,
    height: 18,
  },
  errorText: {
    color: authConstants.colors.text.error,
    fontSize: 12,
    marginTop: 2,
  },
});
