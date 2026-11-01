import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type StyleProp,
  type TextInputInstance,
  type TextInputProps,
  type TextStyle,
} from 'react-native';
import eyeClosedIcon from '@/assets/images/eye-closed.png';
import eyeOpenIcon from '@/assets/images/eye-open.png';
import { useTheme } from '@/shared/hooks/use-theme';
import { MIN_TOUCH_SIZE, radius, spacing } from '@/shared/theme';

export type TextFieldProps = TextInputProps & {
  label: string;
  errorText?: string;
  required?: boolean;
  labelStyle?: StyleProp<TextStyle>;
  ref?: React.Ref<TextInputInstance>;
};

export function TextField({
  label,
  errorText,
  required = false,
  labelStyle,
  style,
  secureTextEntry,
  ref,
  ...rest
}: TextFieldProps): React.JSX.Element {
  const theme = useTheme();
  const hasError = Boolean(errorText);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPasswordField = Boolean(secureTextEntry);
  const effectiveSecureTextEntry = isPasswordField ? !isPasswordVisible : false;

  return (
    <View style={styles.container}>
      <Text
        style={[theme.typography.caption, { color: theme.colors.textMuted }, labelStyle]}
      >
        {label}
        {required ? (
          <Text style={{ color: theme.colors.danger }} accessibilityElementsHidden>
            {' *'}
          </Text>
        ) : null}
      </Text>
      <View style={styles.inputWrapper}>
        <TextInput
          ref={ref}
          accessibilityLabel={required ? `${label}, wajib` : label}
          accessibilityHint={hasError ? errorText : undefined}
          placeholderTextColor={theme.colors.textMuted}
          secureTextEntry={effectiveSecureTextEntry}
          style={[
            styles.input,
            theme.typography.body,
            {
              color: theme.colors.text,
              backgroundColor: theme.colors.surface,
              borderColor: hasError ? theme.colors.danger : theme.colors.border,
            },
            style,
            isPasswordField ? styles.inputWithAccessory : null,
            hasError ? { borderColor: theme.colors.danger } : null,
          ]}
          {...rest}
        />
        {isPasswordField ? (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible((prev) => !prev)}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={
              isPasswordVisible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'
            }
            style={styles.eyeButton}
          >
            <Image
              source={isPasswordVisible ? eyeOpenIcon : eyeClosedIcon}
              style={styles.eyeIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {hasError ? (
        <Text
          accessibilityLiveRegion="polite"
          style={[theme.typography.caption, { color: theme.colors.danger }]}
        >
          {errorText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    minHeight: MIN_TOUCH_SIZE,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  inputWithAccessory: {
    paddingRight: 44,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    width: 22,
    height: 22,
  },
});
